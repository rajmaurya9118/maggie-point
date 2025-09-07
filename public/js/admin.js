// admin.js

const socket = io();

// Sidebar navigation
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    sections.forEach(sec => sec.classList.remove('active-section'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.section).classList.add('active-section');

    document.querySelector('.sidebar').classList.remove('active'); // hide sidebar on mobile
  });
});

// Sidebar toggle on mobile
const sidebar = document.querySelector('.sidebar');
document.getElementById('toggleSidebar').addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Animate Dashboard counters
function animateCounters() {
  document.querySelectorAll('.count').forEach(counter => {
    const target = +counter.dataset.target;
    let count = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      count += step;
      if (count >= target) {
        counter.textContent = target;
        clearInterval(interval);
      } else {
        counter.textContent = count;
      }
    }, 20);
  });
}

// Fetch dashboard stats
async function fetchDashboardStats() {
  const res = await fetch("/admin/stats");
  const stats = await res.json();

  document.querySelector('.card:nth-child(1) .count').dataset.target = stats.totalOrders;
  document.querySelector('.card:nth-child(2) .count').dataset.target = stats.itemsSold;
  document.querySelector('.card:nth-child(3) .count').dataset.target = stats.revenue;
  document.querySelector('.card:nth-child(4) .count').dataset.target = stats.pendingOrders;

  animateCounters();
}
fetchDashboardStats();

// Render Orders
async function fetchOrders() {
  const res = await fetch("/admin/orders");
  const orders = await res.json();
  const tbody = document.getElementById("ordersBody");
  tbody.innerHTML = "";

  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No orders available</td></tr>`;
    return;
  }

  orders.forEach(o => {
    const row = document.createElement("tr");
    row.dataset.id = o.id;
    row.innerHTML = `
      <td>#${o.id}</td>
      <td>${o.customer}</td>
      <td>${o.items}</td>
      <td>${o.time}</td>
      <td>₹${o.payment}</td>
      <td class="status">${o.status}</td>
      <td>
        <select class="status-select">
          <option ${o.status === "Pending" ? "selected" : ""}>Pending</option>
          <option ${o.status === "Cooking" ? "selected" : ""}>Cooking</option>
          <option ${o.status === "On the Way" ? "selected" : ""}>On the Way</option>
          <option ${o.status === "Delivered" ? "selected" : ""}>Delivered</option>
        </select>
      </td>
    `;
    tbody.appendChild(row);

    row.querySelector(".status-select").addEventListener("change", async (e) => {
      const status = e.target.value;
      await fetch(`/admin/orders/${o.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
    });
  });
}
fetchOrders();

// Render Customers
async function fetchCustomers(query = "") {
  const res = await fetch("/admin/customers");
  const customers = await res.json();

  const list = document.getElementById("customerList");
  list.innerHTML = "";

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.phone.includes(query)
  );

  if (!filtered.length) {
    list.innerHTML = `<li>No customers found</li>`;
    return;
  }

  filtered.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${c.name}</strong><br>📞 ${c.number}<br>📍 ${c.address}`;
    list.appendChild(li);
  });
}
fetchCustomers();

document.getElementById('searchUser').addEventListener('input', (e) => {
  fetchCustomers(e.target.value);
});

// Socket events for real-time updates
socket.on("newOrder", fetchOrders);
socket.on("orderUpdated", ({ orderId, status }) => {
  const row = document.querySelector(`[data-id='${orderId}']`);
  if (row) row.querySelector(".status").textContent = status;
});
socket.on("orderCancelled", fetchOrders);
