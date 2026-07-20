// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// TODO: User needs to put their config here to match src/firebase.ts if they want background notifications
// The values here must match the Firebase config used in the app.
const firebaseConfig = {
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_AUTH_DOMAIN",
  // projectId: "YOUR_PROJECT_ID",
  // storageBucket: "YOUR_STORAGE_BUCKET",
  // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  // appId: "YOUR_APP_ID"
};

// Only initialize if config is provided
if (firebaseConfig.apiKey) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification?.title || 'Notifikasi KAVIO Edu';
    const notificationOptions = {
      body: payload.notification?.body || 'Anda memiliki pemberitahuan baru.',
      icon: '/logo.png',
      badge: '/logo.png',
      data: payload.data,
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
