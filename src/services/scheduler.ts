// src/services/scheduler.ts
import { MVP_PLANTS } from '../data/plants';
import { scheduleWaterAlarm, cancelAlarm } from './notifications';
import { PlantInstance } from '../storage/db';

export function getPlantDef(plantId: string) {
  return MVP_PLANTS.find((p) => p.id === plantId)!;
}

export async function planFirst(plant: PlantInstance, firstAt: Date) {
  const def = getPlantDef(plant.plantId);
  const intervalMs = (def.intervalDays ? def.intervalDays * 24 : def.intervalHours) * 3600 * 1000;
  plant.firstWaterAt = firstAt.getTime();
  const nextAt = new Date(firstAt.getTime() + intervalMs);
  const id = await scheduleWaterAlarm(nextAt, { instanceId: plant.instanceId });
  plant.schedule = { nextAt: nextAt.getTime(), intervalMs, notificationId: id };
  return plant;
}

export async function rescheduleFrom(plant: PlantInstance, base: Date) {
  const nextAt = new Date(base.getTime() + (plant.schedule?.intervalMs ?? 0));
  if (plant.schedule?.notificationId) await cancelAlarm(plant.schedule.notificationId);
  const id = await scheduleWaterAlarm(nextAt, { instanceId: plant.instanceId });
  plant.schedule = {
    nextAt: nextAt.getTime(),
    intervalMs: plant.schedule?.intervalMs ?? 0,
    notificationId: id,
  };
  return plant;
}
