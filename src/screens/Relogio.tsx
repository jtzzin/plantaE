// src/screens/Relogio.tsx
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Button, Platform, Text, View } from 'react-native';
import { planFirst } from '../services/scheduler';
import { PlantInstance, upsert } from '../storage/db';
import { uid } from '../utils/uid';

export default function Relogio({ route, navigation }: any) {
  const { plantId } = route.params;
  const [date, setDate] = useState(new Date());

  // iOS: controle inline opcional de hora
  const [showTimeIOS, setShowTimeIOS] = useState(false);

  // Android: abre o diálogo nativo de HORA
  const onChangeTimeAndroid = (_: any, d?: Date) => {
    if (d) {
      const nd = new Date(date);
      nd.setHours(d.getHours(), d.getMinutes(), 0, 0);
      setDate(nd);
    }
  };

  const showAndroidTime = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onChangeTimeAndroid,
      mode: 'time',
      is24Hour: true, // altere para false se quiser AM/PM
    });
  };

  // iOS: handler inline
  const onChangeTimeIOS = (_: any, d?: Date) => {
    setShowTimeIOS(false);
    if (d) {
      const nd = new Date(date);
      nd.setHours(d.getHours(), d.getMinutes(), 0, 0);
      setDate(nd);
    }
  };

  const handleConfirm = async () => {
    try {
      const instance: PlantInstance = {
        instanceId: await uid(),
        plantId,
        active: true,
        history: [],
      };
      await planFirst(instance, date);
      instance.history.push({ at: date.getTime(), type: 'manual' });
      await upsert(instance);
      navigation.replace('Plantas');
    } catch (e) {
      console.log('Erro ao cadastrar planta:', e);
      alert('Falha ao cadastrar. Veja logs e tente novamente.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, textAlign: 'center', marginBottom: 16 }}>
        Selecione dias e horário fixo
      </Text>

      {/* Botão de escolher HORA */}
      <Button
        title={`Escolher hora: ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        onPress={Platform.OS === 'android' ? showAndroidTime : () => setShowTimeIOS(true)}
      />

      {/* iOS: time picker inline em modal controlado */}
      {Platform.OS === 'ios' && showTimeIOS && (
        <DateTimePicker
          value={date}
          mode="time"
          display="spinner"
          onChange={onChangeTimeIOS}
        />
      )}

      <View style={{ height: 12 }} />
      <Button title="Salvar" onPress={handleConfirm} />
    </View>
  );
}
