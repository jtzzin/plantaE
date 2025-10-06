// src/storage/db.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WaterEvent = { at: number; note?: string; type: 'auto' | 'manual' | 'alarm' };
export type ManualRule = { id: string; dow: number[]; times: string[] };
export type PlantInstance = {
  instanceId: string;
  plantId: string;
  nickname?: string;
  firstWaterAt?: number;
  schedule?: { nextAt: number; intervalMs: number; notificationId?: string };
  manual?: ManualRule[];
  history: WaterEvent[];
  fertilize?: { lastAt?: number; intervalDays?: number };
  active: boolean;
};

const KEY = 'plantae@plants';

export async function loadAll(): Promise<PlantInstance[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
export async function saveAll(list: PlantInstance[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}
export async function upsert(instance: PlantInstance) {
  const list = await loadAll();
  const i = list.findIndex((p) => p.instanceId === instance.instanceId);
  if (i >= 0) list[i] = instance;
  else list.push(instance);
  await saveAll(list);
}
export async function remove(instanceId: string) {
  const list = await loadAll();
  await saveAll(list.filter((p) => p.instanceId !== instanceId));
}
