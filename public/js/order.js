// public/js/order.js
const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  const totalPriceEl = document.getElementById("total-price");
  const orderBtn = document.getElementById("order-btn");

  // server rendered boolean (set in EJS)
  const hasAddress = typeof window.__HAS_ADDRESS__ !== "undefined" ? window.__HAS_ADDRESS__ : true;

  if (orderBtn && !hasAddress) {
    orderBtn.disabled = true;
  }

  function computeTotal() {
    let total = 0;
    document.querySelectorAll(".order-item").forEach(row => {
      const qtyInput = row.querySelector(".item-quantity");
      const qty = parseInt(qtyInput?.value, 10) || 1;
      const price = parseFloat(qtyInput?.dataset.price) || 0;
      const lineTotal = qty * price;
      const totalCell = row.querySelector(".item-total");
      if (totalCell) totalCell.textContent = `₹${lineTotal.toFixed(2)}`;
      total += lineTotal;
    });
    if (totalPriceEl) totalPriceEl.textContent = `₹${total.toFixed(2)}`;
    return total;
  }

  computeTotal();

  // Single event listener for clicks (delegation)
  document.body.addEventListener("click", async (e) => {
    const el = e.target;

    // ===== Remove an item from current cart (remove-item-btn) =====
    if (el.classList.contains("remove-item-btn")) {
      const row = el.closest(".order-item");
      const itemName = row?.dataset.name || row?.querySelector(".item-name")?.textContent;
      if (!itemName) return alert("Item name not found");

      if (!confirm(`Remove "${itemName}" from your cart?`)) return;

      try {
        const res = await fetch(`/order/cancel-item/${encodeURIComponent(itemName)}`, {
          method: "PATCH",
          headers: { "Accept": "application/json" }
        });
        if (!res.ok) {
          const text = await res.text();
          let json;
          try { json = JSON.parse(text); } catch (_) { json = null; }
          return alert((json && json.message) || text || "Failed to remove item");
        }
        // success
        row.remove();
        computeTotal();
      } catch (err) {
        console.error("Remove item error:", err);
        alert("Error removing item");
      }
      return;
    }

    // ===== Cancel previous order =====
    if (el.classList.contains("cancel-btn")) {
      const orderId = el.dataset.id;
      if (!orderId) return alert("Order id missing");

      if (!confirm("Are you sure you want to cancel this order?")) return;

      try {
        const res = await fetch(`/order/cancel/${orderId}`, {
          method: "PATCH",
          headers: { "Accept": "application/json" }
        });

        if (!res.ok) {
          const text = await res.text();
          let json;
          try { json = JSON.parse(text); } catch (_) { json = null; }
          return alert((json && json.message) || text || "Failed to cancel order");
        }

        // success: update UI
        const card = el.closest(".history-card");
        if (card) {
          const statusEl = card.querySelector(".status");
          if (statusEl) statusEl.textContent = "Cancelled";
          el.remove(); // remove cancel button
        }
        alert("Order cancelled");
      } catch (err) {
        console.error("Cancel order error:", err);
        alert("Error cancelling order");
      }
      return;
    }
  });

  // update quantities (delegation)
  document.body.addEventListener("input", async (e) => {
    if (e.target.classList && e.target.classList.contains("item-quantity")) {
      const input = e.target;
      const row = input.closest(".order-item");
      const name = row?.querySelector(".item-name")?.textContent;
      const newQty = parseInt(input.value, 10) || 1;

      computeTotal();

      // update server cart
      try {
        await fetch("/cart/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ name, quantity: newQty })
        });
      } catch (err) {
        console.error("cart update error:", err);
      }
    }
  });

  // Place order
  orderBtn?.addEventListener("click", async () => {
    // Extra safety
    if (!hasAddress) {
      alert("⚠️ Please add an address in your profile before placing an order.");
      return;
    }

    const rows = document.querySelectorAll(".order-item");
    if (!rows.length) return alert("No items to order.");

    const items = Array.from(rows).map(row => {
      const name = row.querySelector(".item-name")?.textContent;
      const quantity = parseInt(row.querySelector(".item-quantity")?.value, 10) || 1;
      const price = parseFloat(row.querySelector(".item-quantity")?.dataset.price) || 0;
      return { name, quantity, price };
    });

    const totalAmount = items.reduce((s, it) => s + it.price * it.quantity, 0);

    try {
      const res = await fetch("/order", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ items, totalAmount })
      });

      if (!res.ok) {
        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch (_) { json = null; }
        return alert((json && json.message) || text || "Order failed");
      }

      alert("✅ Order placed!");
      window.location.reload();
    } catch (err) {
      console.error("Place order error:", err);
      alert("Something went wrong while placing order.");
    }
  });

  // Socket listeners for admin updates
  socket.on("orderUpdated", ({ orderId, status }) => {
    const row = document.querySelector(`[data-id='${orderId}']`);
    if (row) {
      const st = row.querySelector(".status");
      if (st) st.textContent = status;
    }
  });

  socket.on("orderCancelled", ({ orderId }) => {
    const row = document.querySelector(`[data-id='${orderId}']`);
    if (row) {
      const st = row.querySelector(".status");
      if (st) st.textContent = "Cancelled";
      const cancelBtn = row.querySelector(".cancel-btn");
      if (cancelBtn) cancelBtn.remove();
    }
  });

});
