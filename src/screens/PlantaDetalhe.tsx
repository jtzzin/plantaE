import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { loadAll, upsert, remove as removePlant } from '../storage/db';
import { MVP_PLANTS } from '../data/plants';
import { rescheduleFrom } from '../services/scheduler';

export default function PlantaDetalhe({ route, navigation }: any) {
  const { instanceId } = route.params;
  const [plant, setPlant] = useState<any>();
  const [showManualDate, setShowManualDate] = useState(false);
  const [showManualTime, setShowManualTime] = useState(false);
  const [manualDate, setManualDate] = useState<Date>(new Date());

  const load = async () => {
    const list = await loadAll();
    setPlant(list.find((p) => p.instanceId === instanceId));
  };
  useEffect(() => {
    load();
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  if (!plant) return null;
  const def = MVP_PLANTS.find((d) => d.id === plant.plantId)!;

  // Handler adubação
  const adicionarAdubacao = async () => {
    plant.fertilize = { ...plant.fertilize, lastAt: Date.now(), intervalDays: 30 };
    await upsert(plant);
    load();
    Alert.alert('Adubação', 'Adubação registrada com sucesso.');
  };

  // Handler lembrete manual (dois passos no Android)
  const openManualPicker = () => {
    if (Platform.OS === 'ios') setShowManualDate(true);
    else setShowManualDate(true); // começa pela data no Android
  };

  const handleManualPickerDate = (_: any, d?: Date) => {
    setShowManualDate(false);
    if (d) {
      const temp = new Date(manualDate);
      temp.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
      setManualDate(temp);
      setTimeout(() => setShowManualTime(true), 200);
    }
  };

  const handleManualPickerTime = (_: any, d?: Date) => {
    setShowManualTime(false);
    if (d) {
      const temp = new Date(manualDate);
      temp.setHours(d.getHours(), d.getMinutes(), 0, 0);
      setManualDate(temp);
      agendarLembreteManual(temp);
    }
  };

  // Para iOS: picker único
  const handleManualPickerIOS = (_: any, d?: Date) => {
    setShowManualDate(false);
    if (d) agendarLembreteManual(d);
  };

  async function agendarLembreteManual(d: Date) {
    plant.history.push({ at: d.getTime(), type: 'manual', note: 'Lembrete manual' });
    await upsert(plant);
    load();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Lembrete manual para planta`,
        body: 'Hora de regar manualmente!',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: d,
      },
    });
    Alert.alert('Lembrete', 'Lembrete manual agendado!');
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 8 }}>{def.name}</Text>
      <Text>Ambiente ideal: {def.environment}</Text>
      <Text>Água por rega: {def.waterMl} ml</Text>
      <Text>Intervalo recomendado: {def.intervalHours} h</Text>

      <View style={{ height: 16 }} />
      <Button title="Regar agora" onPress={async () => {
        plant.history.push({ at: Date.now(), type: 'manual' });
        await rescheduleFrom(plant, new Date());
        await upsert(plant);
        load();
      }} />

      <View style={{ height: 8 }} />
      <Button
        title="Lembrete manual (3 pontos)"
        onPress={openManualPicker}
      />

      <View style={{ height: 8 }} />
      <Button
        title="Adicionar adubação"
        onPress={adicionarAdubacao}
      />

      <View style={{ height: 8 }} />
      <Button
        color="red"
        title="Deletar"
        onPress={() => {
          Alert.alert('Excluir planta', 'Deseja realmente excluir?', [
            { text: 'Cancelar' },
            {
              text: 'Excluir',
              style: 'destructive',
              onPress: async () => {
                await removePlant(instanceId);
                navigation.goBack();
              },
            },
          ]);
        }}
      />

      {/* Picker de lembrete manual */}
      {showManualDate && (
        <DateTimePicker
          mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
          value={manualDate}
          onChange={Platform.OS === 'ios' ? handleManualPickerIOS : handleManualPickerDate}
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
        />
      )}
      {showManualTime && Platform.OS === 'android' && (
        <DateTimePicker
          mode="time"
          value={manualDate}
          onChange={handleManualPickerTime}
          display="clock"
        />
      )}

      <View style={{ marginTop: 24 }}>
        <Text style={{ fontWeight: '600' }}>Histórico de regas</Text>
        {plant.history.slice().reverse().map((h: any, i: number) => (
          <Text key={i}>
            • {new Date(h.at).toLocaleString()} ({h.type}
            {h.note ? ` - ${h.note}` : ''})
          </Text>
        ))}
        {plant.fertilize?.lastAt &&
          <Text style={{ color: '#e4911c', marginTop: 8 }}>
            Última adubação: {new Date(plant.fertilize.lastAt).toLocaleDateString()}
          </Text>
        }
      </View>
    </View>
  );
}
