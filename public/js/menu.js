// menu.js

const menuData = [
  // Maggi
  { name: "Simple Maggi (Plane)", category: "Maggi", price: 39, image: "/images/simple-maggie.jpg" },
  { name: "Masala Maggi (Double)", category: "Maggi", price: 49, image: "/images/masala-maggie.jpg" },
  { name: "Vegetable Maggi", category: "Maggi", price: 59, image: "/images/vegetable-maggie.png" },
  { name: "Paneer Maggi", category: "Maggi", price: 69, image: "/images/paneer-maggie.png" },
  { name: "Butter Cheese Maggi", category: "Maggi", price: 69, image: "/images/butter-cheese-maggie.png" },
  { name: "Pahadi Special Maggi", category: "Maggi", price: 98, image: "/images/pahari-special-maggie.png" },

  // Pasta
  { name: "Red Sauce Pasta", category: "Pasta", price: 89, image: "/images/red-sauce-pasta.png" },
  { name: "White Sauce Pasta", category: "Pasta", price: 99, image: "/images/white-sauce-pasta.png" },
  { name: "Cheez Packet Pasta", category: "Pasta", price: 119, image: "/images/cheese-packet-pasta.png" },

  // Sandwich
  { name: "Corn Masala Sandwich", category: "Sandwich", price: 49, image: "/images/corn-sandwich.png" },
  { name: "Veg Grilled Sandwich", category: "Sandwich", price: 59, image: "/images/veg-grilled-sandwich.png" },
  { name: "Cheez Sandwich", category: "Sandwich", price: 59, image: "/images/cheese-sandwich.png" },
  { name: "Corn Mayo Sandwich", category: "Sandwich", price: 59, image: "/images/corn-mayo-sandwich.png" },
  { name: "Three Layer Sandwich", category: "Sandwich", price: 79, image: "/images/three-layer-sandwich.png" },
  { name: "Pahari Special Sandwich", category: "Sandwich", price: 99, image: "/images/pahari-special-sandwich.png"},
  // Pizza
  { name: "Margherita Pizza", category: "Pizza", price: 79, image: "/images/margherita-pizza.png" },
  { name: "Sweet Corn Pizza", category: "Pizza", price: 89, image: "/images/sweet-corn-pizza.png" },
  { name: "Veggie Delite Pizza", category: "Pizza", price: 99, image: "/images/veggie-delite-pizza.png" },
  { name: "Extra Cheez Pizza", category: "Pizza", price: 109, image: "/images/extra-cheese-pizza.png" },
  { name: "Paneer Pizza", category: "Pizza", price: 129, image: "/images/paneer-pizza.png" },
  { name: "Pahari Special Pizza", category: "Pizza", price: 149, image: "/images/pahari-special-pizza.png" },

  // Burger
  { name: "Veg Burger", category: "Burger", price: 39, image: "/images/veg-burger.png" },
  { name: "Cheez Burger", category: "Burger", price: 49, image: "/images/cheese-burger.png" },
  { name: "Paneer Burger", category: "Burger", price: 59, image: "/images/paneer-burger.png" },
  { name: "Paneer Cheez Burger", category: "Burger", price: 69, image: "/images/paneer-cheese-burger.png" },
  { name: "Pahari Special Burger", category: "Burger", price: 89, image: "/images/pahari-special-burger.png" },

  // Momos
  { name: "Steam Momos", category: "Momos", price: 39, image: "/images/steam-momos.png" },
  { name: "Fried Momos", category: "Momos", price: 49, image: "/images/fried-momos.png" },
  { name: "Tandoori Momos", category: "Momos", price: 59, image: "/images/tanduri-momos.png" },
  { name: "Cheez Momos", category: "Momos", price: 69, image: "/images/cheese-momos.png" },
  { name: "Malai Momos", category: "Momos", price: 79, image: "/images/malai-momos.png" },
  { name: "Pahadi Special Momos", category: "Momos", price: 89, image: "/images/pahari-special-momos.png" },

  // French Fries
  { name: "Plane French Fries", category: "French Fries", price: 69, image: "/images/plane-french-fries.png" },
  { name: "Spicy French Fries", category: "French Fries", price: 79, image: "/images/spicy-french-fries.png" },
  { name: "Cheez French Fries", category: "French Fries", price: 89, image: "/images/cheese-french-fries.png" },

  // Combo
  { name: "Momos + Burger + Soft Drink", category: "Combo", price: 89, image: "/images/combo-meal.png" },
  { name: "Maggi + Momos + Soft Drink", category: "Combo", price: 109, image: "/images/maggie-combo.png" },
  { name: "Burger + Pizza + Soft Drink", category: "Combo", price: 129, image: "/images/burger-pizza-combo.png" },
  { name: "Pizza + French Fries + Soft Drink", category: "Combo", price: 149, image: "/images/pizza-fries-combo.png" },

  // Cold Coffee
  { name: "Plane Cold Coffee", category: "Cold Coffee", price: 89, image: "/images/cold-coffee.png" },
  { name: "Strong Choco Cold Coffee", category: "Cold Coffee", price: 79, image: "/images/choco-cold-coffee.png" },
  { name: "Cold Coffee with Ice Cream", category: "Cold Coffee", price: 99, image: "/images/coffee-icecream.png" },
  { name: "Pahadi Special Cold Coffee", category: "Cold Coffee", price: 119, image: "/images/pahari-special-cold-coffee.png" },

  // shake
  {name:"Strawberry Shake", category:"Shake",price:69,image:"/images/strawberry-shake.png"},
  {name:"Black Crane Shake", category:"Shake",price:69,image:"/images/blue-crane-shake.png"},
  {name:"Butter Scotch Shake", category:"Shake",price:69,image:"/images/butter-scotch-shake.png"},
  {name:"Mango Shake", category:"Shake",price:69,image:"/images/mango-shake.png"},
  {name:"Banana Shake", category:"Shake",price:69,image:"/images/banana-shake.png"},
  //Mocktail
  {name:"Blue Lagoon Mocktail", category:"Mocktail",price:69,image:"/images/blue-logoon-mocktail.png"},
  {name:"Kiwi Mocktail", category:"Mocktail",price:79,image:"/images/kiwi-mocktail.png"},
  {name:"Bubble Gum Mocktail", category:"Mocktail",price:79,image:"/images/bubble-gum-mocktail.png"},
  {name:"Black Iron Mocktail", category:"Mocktail",price:89,image:"/images/black-iron-moctail.png"},
  //Hot Coffee
  {name:"Coffee", category:"Hot Coffee",price:20,image:"/images/coffee.png"},
  {name:"Black Coffee", category:"Hot Coffee",price:25,image:"/images/black-coffee.png"},
  {name:"Strong Coffee", category:"Hot Coffee",price:30,image:"/images/strong-coffee.png"},
  {name:"Chocolate Coffee", category:"Hot Coffee",price:50,image:"/images/chocolate-coffee.png"},
  {name:"Strong Hot Chocolate Coffee", category:"Hot Coffee",price:60,image:"/images/strong-hot-chocolate-coffee.png"}

];

const menuContainer = document.getElementById("menuContainer");

// ================= Render Items =================
function renderMenuItems(category = "All") {
  menuContainer.innerHTML = "";
  const filtered =
    category === "All"
      ? menuData
      : menuData.filter(item => item.category === category);

  if (filtered.length === 0) {
    menuContainer.innerHTML = `<p>No items found.</p>`;
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("menu-card");
    card.dataset.name = item.name;
    card.dataset.price = item.price;
    card.dataset.image = item.image;

    card.innerHTML = `
      <div class="menu-image"><img src="${item.image}" alt="${item.name}" /></div>
      <div class="menu-info">
        <h3>${item.name}</h3>
        <p class="price">₹${item.price}</p>
      </div>
    `;
    menuContainer.appendChild(card);
  });

  attachAddToCartModal();
}

// ================= Modal Logic =================
const cartModal = document.getElementById('cartModal');
const modalImg = document.getElementById('modalImg');
const modalName = document.getElementById('modalName');
const modalPrice = document.getElementById('modalPrice');
const qtyValue = document.getElementById('qtyValue');
const totalPrice = document.getElementById('totalPrice'); // ✅ added
const decreaseQty = document.getElementById('decreaseQty');
const increaseQty = document.getElementById('increaseQty');
const confirmAdd = document.getElementById('confirmAdd');

let currentItem = null;
let currentQty = 1;

function attachAddToCartModal() {
  document.querySelectorAll(".menu-card").forEach(card => {
    card.addEventListener("click", () => {
      currentItem = {
        name: card.dataset.name,
        price: parseFloat(card.dataset.price),
        image: card.dataset.image
      };
      currentQty = 1;

      modalImg.src = currentItem.image;
      modalName.textContent = currentItem.name;
      modalPrice.textContent = `₹${currentItem.price}`;
      qtyValue.textContent = currentQty;
      totalPrice.textContent = currentItem.price * currentQty; // ✅ set initial total

      cartModal.classList.remove("hidden");
      cartModal.classList.add("show");
    });
  });
}

// Quantity
increaseQty.addEventListener("click", () => {
  currentQty++;
  qtyValue.textContent = currentQty;
  totalPrice.textContent = currentItem.price * currentQty; // ✅ update total
});

decreaseQty.addEventListener("click", () => {
  if (currentQty > 1) {
    currentQty--;
    qtyValue.textContent = currentQty;
    totalPrice.textContent = currentItem.price * currentQty; // ✅ update total
  }
});

// Confirm Add
confirmAdd.addEventListener("click", async () => {
  if (!currentItem) return;

  const cartData = {
    name: currentItem.name,
    price: currentItem.price,
    quantity: currentQty,
    total: currentItem.price * currentQty
  };

  try {
    const res = await fetch("/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartData)
    });

    if (res.ok) {
      const data = await res.json();
      alert(`${currentQty} × ${currentItem.name} added to cart!`);

      // update cart count
      const cartCountEl = document.getElementById("cartCount");
      if (cartCountEl) {
        const totalQty = data.cart.items.reduce((sum, i) => sum + i.quantity, 0);
        cartCountEl.textContent = totalQty;
      }
    } else {
      alert("⚠️ Please login first to add items to cart.");
    }
  } catch (err) {
    console.error("Error adding cart:", err);
    alert("Something went wrong!");
  }

  cartModal.classList.remove("show");
  cartModal.classList.add("hidden");
});

// Close modal when clicking outside
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove("show");
    cartModal.classList.add("hidden");
  }
});

// ================= Category Buttons =================
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderMenuItems(btn.dataset.category);
  });
});

// ================= First Render =================
renderMenuItems();
