// script.js

// === Admin Login ===
function loginAdmin() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "Mohsin" && pass === "Mohsin@9") {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    showAdminProducts();
  } else {
    alert("Invalid credentials!");
  }
}

// === Upload Product ===
function uploadProduct() {
  const name = document.getElementById("prodName").value;
  const price = document.getElementById("prodPrice").value;
  const desc = document.getElementById("prodDesc").value;
  const files = document.getElementById("prodImages").files;

  if (!name || !price || !desc || files.length === 0) {
    alert("Please fill all fields and select images.");
    return;
  }

  const imagePromises = Array.from(files).slice(0, 6).map(file => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "styleway_upload_01");

    return fetch("https://api.cloudinary.com/v1_1/dkgevnwc2/image/upload", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => data.secure_url);
  });

  Promise.all(imagePromises).then(images => {
    const product = {
      id: Date.now(),
      name,
      price,
      desc,
      images
    };

    const products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));

    alert("Product uploaded successfully!");
    showAdminProducts();
  });
}

// === Show Products (Admin Panel) ===
function showAdminProducts() {
  const list = document.getElementById("adminProductList");
  if (!list) return;

  const products = JSON.parse(localStorage.getItem("products")) || [];
  list.innerHTML = "";

  products.forEach(prod => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${prod.images[0]}" />
      <h3>${prod.name}</h3>
      <p>${prod.price}</p>
      <button onclick="deleteProduct(${prod.id})">Delete</button>
    `;
    list.appendChild(div);
  });
}

// === Delete Product ===
function deleteProduct(id) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products = products.filter(p => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  showAdminProducts();
}

// === Load Products on index.html ===
function loadProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;

  const products = JSON.parse(localStorage.getItem("products")) || [];
  list.innerHTML = "";

  products.forEach(prod => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${prod.images[0]}" />
      <h3>${prod.name}</h3>
      <p>${prod.price}</p>
      <button onclick='openModalFromProduct("${prod.name}", "${prod.price}")'>Buy Now</button>
    `;
    list.appendChild(div);
  });
}
loadProducts();

// === Modal Control ===
let selectedProductName = '';
let selectedProductPrice = '';

function openModalFromProduct(name, price) {
  selectedProductName = name;
  selectedProductPrice = price;
  openModal();
}

function openModal() {
  document.getElementById("orderModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("orderModal").style.display = "none";
}

// === Submit Order via WhatsApp ===
function submitOrder() {
  const name = document.getElementById("orderName").value;
  const phone = document.getElementById("orderNumber").value;
  const address = document.getElementById("orderAddress").value;

  if (!name || !phone || !address) {
    alert("Please fill all fields.");
    return;
  }

  const message = `Hello Style Way! 👕\n\nI want to order:\n🛍️ Product: ${selectedProductName}\n💵 Price: ${selectedProductPrice}\n\nMy Details:\n📛 Name: ${name}\n📞 Phone: ${phone}\n🏠 Address: ${address}`;

  window.open(`https://wa.me/923337307009?text=${encodeURIComponent(message)}`, "_blank");
}

// === Load Product Detail on product.html ===
function loadProductDetail() {
  const productId = sessionStorage.getItem("selectedProduct");
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find(p => p.id == productId);
  if (!product) return;

  selectedProductName = product.name;
  selectedProductPrice = product.price;

  document.getElementById("detailName").innerText = product.name;
  document.getElementById("detailPrice").innerText = product.price;
  document.getElementById("detailDesc").innerText = product.desc;

  const imageBox = document.getElementById("productImages");
  product.images.forEach(img => {
    const image = document.createElement("img");
    image.src = img;
    imageBox.appendChild(image);
  });
}

// === Load Other Products on product.html ===
function loadOtherProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;

  const currentId = sessionStorage.getItem("selectedProduct");
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const others = products.filter(p => p.id != currentId);

  others.forEach(prod => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${prod.images[0]}" />
      <h3>${prod.name}</h3>
      <p>${prod.price}</p>
      <button onclick='openModalFromProduct("${prod.name}", "${prod.price}")'>Buy Now</button>
    `;
    list.appendChild(div);
  });
}

// === Countdown Timer ===
let time = 300;
const timerEl = document.getElementById("timer");
if (timerEl) {
  const countdown = setInterval(() => {
    if (time <= 0) {
      clearInterval(countdown);
      timerEl.innerText = "00:00";
    } else {
      const mins = String(Math.floor(time / 60)).padStart(2, "0");
      const secs = String(time % 60).padStart(2, "0");
      timerEl.innerText = `${mins}:${secs}`;
      time--;
    }
  }, 1000);
}

// === Fake Notification Slider ===
const notifications = [
  "Ali just bought a shirt!",
  "Fatima ordered a hoodie!",
  "Usman purchased jeans!",
  "Sana added a kurti to cart!",
  "Bilal bought sneakers!"
];

let notifyEl = document.getElementById("notification");
if (notifyEl) {
  setInterval(() => {
    const random = notifications[Math.floor(Math.random() * notifications.length)];
    notifyEl.innerText = `🛍️ ${random}`;
  }, 5000);
}
