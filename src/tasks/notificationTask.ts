// src/tasks/notificationTask.ts
import * as TaskManager from 'expo-task-manager';
import { rescheduleFrom } from '../services/scheduler';
import { loadAll, remove as removePlant, upsert } from '../storage/db';

export const TASK = 'PLANTAE_NOTIFICATION_TASK';

// Define o manipulador para ações da notificação
TaskManager.defineTask(TASK, async ({ data, error }) => {
  if (error) return;
  const notif: any = (data as any)?.notification;
  const actionId: string = (data as any)?.actionIdentifier;
  const payload = notif?.request?.content?.data as any;
  const instanceId = payload?.instanceId;
  if (!instanceId) return;

  const list = await loadAll();
  const plant = list.find((p) => p.instanceId === instanceId);
  if (!plant) return;

  if (actionId === 'ALARM_WATERED') {
    plant.history.push({ at: Date.now(), type: 'alarm' });
    await rescheduleFrom(plant, new Date());
    await upsert(plant);
  } else if (actionId === 'ALARM_SNOOZE') {
    plant.schedule = undefined;
    await upsert(plant);
  } else if (actionId === 'ALARM_DELETE') {
    await removePlant(instanceId);
  }
});
