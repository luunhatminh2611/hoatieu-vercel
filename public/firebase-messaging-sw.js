importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

console.log("🔧 [SW] Service Worker loading...");

firebase.initializeApp({
  apiKey: "AIzaSyBHVrVLkhFNuzev0AUTo4xnT6Hizx5JkIM",
  authDomain: "hoa-tieu-app.firebaseapp.com",
  projectId: "hoa-tieu-app",
  storageBucket: "hoa-tieu-app.firebasestorage.app",
  messagingSenderId: "880513197137",
  appId: "1:880513197137:web:41e9e3dec2cca25f330470",
  measurementId: "G-WHSMMB0815"
});

console.log("✅ [SW] Firebase initialized");

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message:", payload);
  if (payload.data) {
    console.log("[SW] Bỏ qua vì FCM đã tự hiển thị notification.");
    return;
  }

  // Chỉ xử lý message kiểu data
  const title = payload.data?.title || "Thông báo";
  const options = {
    body: payload.data?.body || "",
    icon: "/icons/logo-mobile.png",
  };

  self.registration.showNotification(title, options);
});
