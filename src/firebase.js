import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

// --- Cấu hình Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyBHVrVLkhFNuzev0AUTo4xnT6Hizx5JkIM",
  authDomain: "hoa-tieu-app.firebaseapp.com",
  projectId: "hoa-tieu-app",
  storageBucket: "hoa-tieu-app.firebasestorage.app",
  messagingSenderId: "880513197137",
  appId: "1:880513197137:web:41e9e3dec2cca25f330470",
  measurementId: "G-WHSMMB0815",
};

// --- Khởi tạo app ---
const app = initializeApp(firebaseConfig);

// --- Biến toàn cục ---
let messaging = null;
let isInitialized = false;
let listenerAttached = false;
let unsubscribe = null;

export const initializeMessaging = async () => {
  console.log("🔍 [Firebase] initializeMessaging called, isInitialized:", isInitialized);

  if (isInitialized) {
    console.log("⚠️ [Firebase] Already initialized, skipping");
    return messaging;
  }

  try {
    const supported = await isSupported();
    console.log("🔍 [Firebase] isSupported:", supported);

    if (!supported) {
      console.warn("⚠️ [Firebase] Messaging not supported in this browser");
      return null;
    }

    messaging = getMessaging(app);
    isInitialized = true;
    console.log("✅ [Firebase] Messaging initialized");
    return messaging;
  } catch (error) {
    console.error("❌ [Firebase] Error initializing Firebase Messaging:", error);
    return null;
  }
};

/**
 * ✅ Yêu cầu cấp token FCM (lấy token để gửi thông báo)
 */
export const requestForToken = async () => {
  console.log("🔑 [Firebase] requestForToken called");

  if (!messaging) {
    console.warn("⚠️ [Firebase] Messaging not initialized yet");
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
      console.warn("⚠️ [Firebase] No registration token available");
      return null;
    }
  } catch (error) {
    console.error("❌ [Firebase] Error getting token:", error);
    return null;
  }
};

/**
 * ✅ Đăng ký listener nhận thông báo khi app đang mở
 * (chỉ gắn 1 lần duy nhất, có cleanup)
 */
export const onMessageListener = (callback) => {
  if (!messaging) {
    console.error("❌ [Firebase] Messaging not initialized");
    return;
  }

  if (listenerAttached) {
    console.log("⚠️ [Firebase] onMessageListener already attached — skipping");
    return unsubscribe; // nếu đã attach rồi thì trả lại hàm hủy cũ
  }

  console.log("🎯 [Firebase] Setting up single onMessage listener");

  unsubscribe = onMessage(messaging, (payload) => {
    console.log("📨 [Firebase] Received foreground message:", payload);
    if (callback) callback(payload);
  });

  listenerAttached = true;
  return unsubscribe;
};

export const removeMessageListener = () => {
  if (unsubscribe) {
    unsubscribe();
    console.log("🧹 [Firebase] Foreground listener removed");
    listenerAttached = false;
    unsubscribe = null;
  }
};

export default app;
