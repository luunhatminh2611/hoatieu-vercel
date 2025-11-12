importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// console.log("🔧 [SW] Service Worker loading...");

firebase.initializeApp({
  apiKey: "AIzaSyBHVrVLkhFNuzev0AUTo4xnT6Hizx5JkIM",
  authDomain: "hoa-tieu-app.firebaseapp.com",
  projectId: "hoa-tieu-app",
  storageBucket: "hoa-tieu-app.firebasestorage.app",
  messagingSenderId: "880513197137",
  appId: "1:880513197137:web:41e9e3dec2cca25f330470",
  measurementId: "G-WHSMMB0815"
});

const messaging = firebase.messaging();

// console.log("✅ [SW] Firebase initialized & messaging ready");

// Cẩn thận: một số bản FCM tự hiển thị notification nếu payload có field 'title' ở cấp cao.
// Để chặn hành vi đó, ta ép Firebase chỉ xử lý bằng tay.
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const payload = event.data.json();
  // console.log("[SW] Custom push handler payload:", payload);

  // FCM có thể gói data vào .data hoặc ở root
  const data = payload.data || payload;

  const title = data.title || "Thông báo mới";
  const options = {
    body: data.body || "",
    icon: "/icons/logo-mobile.png",
    data,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Giữ lại để tương thích
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] onBackgroundMessage:", payload);
});