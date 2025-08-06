// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Firebase Config (from your project)
const firebaseConfig = {
  apiKey: "AIzaSyA5wBXRup_GlXt6lAeLue9j6pByEij0wrY",
  authDomain: "styleway-2ea88.firebaseapp.com",
  projectId: "styleway-2ea88",
  storageBucket: "styleway-2ea88.firebasestorage.app",
  messagingSenderId: "1089626223478",
  appId: "1:1089626223478:web:040ac6fbf352e902c84057"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================
// 🔴 ADMIN PANEL FUNCTIONS
// ============================

// Handle Product Upload from admin.html
window.uploadProduct = async function () {
  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const description = document.getElementById("productDescription").value;
  const image = document.getElementById("productImage").value;

  if (!name || !price || !description || !image) {
    alert("Please fill all fields");
    return;
  }

  try {
    await addDoc(collection(db, "products"), {
      name,
      price,
      description,
      image,
      createdAt: new Date()
    });

    alert("Product uploaded successfully!");
    document.getElementById("productForm").reset();
    loadProducts(); // Refresh list
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Failed to upload product");
  }
}

// Fetch and display products in admin panel
window.loadProducts = async function () {
  const productList = document.getElementById("productList");
  if (!productList) return;

  productList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${data.name}</strong> - Rs.${data.price}
      <button onclick="deleteProduct('${docSnap.id}')">Delete</button>
    `;
    productList.appendChild(div);
  });
}

// Delete product (admin only)
window.deleteProduct = async function (id) {
  await deleteDoc(doc(db, "products", id));
  alert("Product deleted!");
  loadProducts();
}

// ============================
// 🔴 MAIN PAGE FUNCTIONS
// ============================

window.displayProducts = async function () {
  const container = document.getElementById("productContainer");
  if (!container) return;

  container.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${data.image}" alt="${data.name}" />
      <h3>${data.name}</h3>
      <p>Rs.${data.price}</p>
      <p>${data.description}</p>
      <button onclick="openOrderModal('${data.name}', '${data.price}')">Buy Now</button>
    `;
    container.appendChild(card);
  });
}

// Show order form modal (Buy Now)
window.openOrderModal = function (productName, productPrice) {
  const modal = document.getElementById("orderModal");
  if (!modal) return;

  modal.style.display = "block";
  document.getElementById("orderProductName").innerText = productName;
  document.getElementById("orderProductPrice").innerText = "Rs. " + productPrice;
}

// Close modal
window.closeOrderModal = function () {
  const modal = document.getElementById("orderModal");
  if (modal) modal.style.display = "none";
}

// Send order via WhatsApp
window.submitOrder = function () {
  const name = document.getElementById("customerName").value;
  const address = document.getElementById("customerAddress").value;
  const number = document.getElementById("customerNumber").value;
  const product = document.getElementById("orderProductName").innerText;
  const price = document.getElementById("orderProductPrice").innerText;

  if (!name || !address || !number) {
    alert("Please fill all fields");
    return;
  }

  const message = `New Order:\nProduct: ${product}\nPrice: ${price}\nName: ${name}\nAddress: ${address}\nContact: ${number}`;
  const whatsappURL = `https://wa.me/923337307009?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");

  closeOrderModal();
}
