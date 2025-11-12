import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBHVrVLkhFNuzev0AUTo4xnT6Hizx5JkIM",
  authDomain: "hoa-tieu-app.firebaseapp.com",
  projectId: "hoa-tieu-app",
  storageBucket: "hoa-tieu-app.firebasestorage.app",
  messagingSenderId: "880513197137",
  appId: "1:880513197137:web:41e9e3dec2cca25f330470",
  measurementId: "G-WHSMMB0815",
};

const app = initializeApp(firebaseConfig);

let messaging = null;
let isInitialized = false; // ✅ Thêm flag để tránh init nhiều lần

export const initializeMessaging = async () => {
  console.log("🔍 [Firebase] initializeMessaging called, isInitialized:", isInitialized);
  
  if (isInitialized) {
    console.log("⚠️ [Firebase] Already initialized, skipping");
    return messaging;
  }

  try {
    const supported = await isSupported();
    console.log("🔍 [Firebase] isSupported:", supported);
    
    if (supported) {
      messaging = getMessaging(app);
      isInitialized = true;
      console.log("✅ [Firebase] Messaging initialized");
      return messaging;
    } else {
      console.warn("⚠️ [Firebase] Not supported in this browser");
      return null;
    }
  } catch (error) {
    console.error("❌ [Firebase] Error initializing:", error);
    return null;
  }
};

export const requestForToken = async () => {
  console.log("🔑 [Firebase] requestForToken called");
  
  if (!messaging) {
    console.warn("⚠️ [Firebase] Messaging not initialized — wait for initializeMessaging()");
    return null;
  }

  try {
    const token = await getToken(messaging, {
      vapidKey: "BD3yyPQCbGXaVncyP_yvEp4VpFGMcbtDJC-_qpi5uxJnJmMpGCa-03rp-66rMZv0gEszrczjCD6ewePB_fTnibw",
    });
    if (token) {
      console.log("✅ [Firebase] FCM Token:", token);
      return token;
    } else {
      console.warn("⚠️ [Firebase] No FCM registration token available");
    }
  } catch (err) {
    console.error("❌ [Firebase] Error retrieving FCM token:", err);
  }
  return null;
};

let listenerCount = 0; // ✅ Đếm số lần đăng ký listener

export const onMessageListener = () => {
  listenerCount++;
  console.log("📊 [Firebase] onMessageListener called, count:", listenerCount);
  
  return new Promise((resolve, reject) => {
    if (!messaging) {
      console.error("❌ [Firebase] Messaging not initialized");
      reject(new Error("Firebase Messaging not initialized"));
      return;
    }
    
    console.log("🎯 [Firebase] Setting up onMessage listener #", listenerCount);
    onMessage(messaging, (payload) => {
      console.log(`📨 [Firebase] Listener #${listenerCount} received message:`, payload);
      resolve(payload);
    });
  });
};

export default app;