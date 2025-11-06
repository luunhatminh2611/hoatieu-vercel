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

// ✅ Trả về Promise để FE có thể chờ
export const initializeMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      console.log("✅ Firebase Messaging initialized");
      return messaging;
    } else {
      console.warn("Firebase Messaging not supported in this browser");
      return null;
    }
  } catch (error) {
    console.error("Error initializing messaging:", error);
    return null;
  }
};

export const requestForToken = async () => {
  if (!messaging) {
    console.warn("Firebase Messaging not initialized — wait for initializeMessaging()");
    return null;
  }

  try {
    const token = await getToken(messaging, {
      vapidKey: "BD3yyPQCbGXaVncyP_yvEp4VpFGMcbtDJC-_qpi5uxJnJmMpGCa-03rp-66rMZv0gEszrczjCD6ewePB_fTnibw",
    });
    if (token) {
      console.log("FCM Token:", token);
      return token;
    } else {
      console.warn("No FCM registration token available");
    }
  } catch (err) {
    console.error("Error retrieving FCM token:", err);
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    if (!messaging) {
      reject(new Error("Firebase Messaging not initialized"));
      return;
    }
    onMessage(messaging, (payload) => resolve(payload));
  });

export default app;
