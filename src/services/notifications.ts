// src/services/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const CHANNEL_ID = 'plantae-alarms';

export async function configureNotifications() {
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Lembretes de rega',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'alarm.wav',
      vibrationPattern: [500, 500, 500, 500],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
}

export async function registerActions() {
  await Notifications.setNotificationCategoryAsync('PLANTAE_ALARM', [
    { identifier: 'ALARM_WATERED', buttonTitle: 'Regada' },
    { identifier: 'ALARM_SNOOZE', buttonTitle: 'Regar mais tarde' },
    { identifier: 'ALARM_DELETE', buttonTitle: 'Deletar' },
  ]);
}

export type AlarmPayload = { instanceId: string };

/**
 * Agenda uma notificação para uma data/hora exata.
 * Se preferir “em X segundos”, use TIME_INTERVAL no trecho comentado.
 */
export async function scheduleWaterAlarm(datetime: Date, data: AlarmPayload, durationMin = 5) {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora de regar',
      body: 'Toque para registrar a rega ou adiar.',
      sound: 'alarm.wav',
      data,
      categoryIdentifier: 'PLANTAE_ALARM',
    },
    // Opção A: dispara em uma data/hora específica (recomendado para seu caso)
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: datetime,
    },
    // Opção B: dispara em X segundos (use esta alternativa se preferir)
    // trigger: {
    //   type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    //   seconds: Math.max(1, Math.round((datetime.getTime() - Date.now()) / 1000)),
    //   repeats: false,
    // },
  });

  // encerra o alarme após durationMin
  setTimeout(() => Notifications.dismissNotificationAsync(id), durationMin * 60 * 1000);
  return id;
}

export async function cancelAlarm(id?: string) {
  if (!id) return;
  await Notifications.cancelScheduledNotificationAsync(id);
}
