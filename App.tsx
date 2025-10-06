// App.tsx
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import RootNav from './src/navigation';
import * as Notifications from 'expo-notifications';
import { configureNotifications, registerActions } from './src/services/notifications';
import './src/tasks/notificationTask';
import { TASK } from './src/tasks/notificationTask';
import { navigateToAlarm } from './src/navigation/rootNavigation';

// registra a task em escopo de módulo
Notifications.registerTaskAsync(TASK);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,  // adiciona
    shouldShowList: true,    // adiciona
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    (async () => {
      await configureNotifications();
      await registerActions();
      if (Platform.OS === 'ios') {
        await Notifications.requestPermissionsAsync();
      }
    })();
    const sub = Notifications.addNotificationResponseReceivedListener((resp) => {
      const data: any = resp.notification.request.content.data;
      if (data?.instanceId) navigateToAlarm(data.instanceId);
    });
    return () => sub.remove();
  }, []);

  return <RootNav />;
}
