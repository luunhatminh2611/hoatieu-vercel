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

let messageCount = 0;

messaging.onBackgroundMessage(function (payload) {
  messageCount++;
  console.log(`📬 [SW] Background message #${messageCount}:`, payload);
  console.log("⏰ [SW] Thời gian:", new Date().toISOString());
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/logo-mobile.png',
  };
  
  console.log("🔔 [SW] Showing notification:", notificationTitle);
  self.registration.showNotification(notificationTitle, notificationOptions);
});