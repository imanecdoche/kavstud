import { useState, useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase';

export const usePushNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermissionStatus(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    try {
      if (!('Notification' in window)) {
        console.warn('This browser does not support desktop notification');
        return;
      }

      const permission = await Notification.requestPermission();
      setNotificationPermissionStatus(permission);

      if (permission === 'granted') {
        // Wait for messaging to be initialized (since we dynamically import/initialize it)
        if (!messaging) {
          console.warn('Firebase messaging is not initialized yet or not supported.');
          return;
        }

        // TODO: Replace with user's actual VAPID KEY from Firebase Console
        const token = await getToken(messaging, {
          vapidKey: 'BAeCT6dbHqgaTBrYQ4iHMmZZp7P9F7_bbrTppEHlm3mA1zkZnHzgAH2FQ6yIcQKLadw7xKCTxX-4tpU8GgyywsI'
        });

        if (token) {
          console.log('FCM Token retrieved:', token);
          setFcmToken(token);
          // Here you would typically send this token to your server/firestore
          // to associate it with the current user
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      } else {
        console.log('Notification permission denied by user.');
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
    }
  };

  useEffect(() => {
    if (messaging && notificationPermissionStatus === 'granted') {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground message received: ', payload);
        // You can display a custom toast or in-app notification here
        // The service worker handles background messages automatically
      });

      return () => {
        unsubscribe(); // Cleanup listener on unmount
      };
    }
  }, [notificationPermissionStatus]);

  return {
    fcmToken,
    notificationPermissionStatus,
    requestPermission
  };
};
