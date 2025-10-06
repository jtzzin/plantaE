// src/screens/Alarme.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { loadAll, upsert, remove as removePlant } from '../storage/db';
import { rescheduleFrom } from '../services/scheduler';

export default function Alarme({ route, navigation }: any) {
  const { instanceId } = route.params;

  const handle = async (action: 'regada'|'snooze'|'delete')=>{
    const list = await loadAll();
    const p = list.find(x=>x.instanceId===instanceId);
    if (!p) return navigation.goBack();
    if (action==='regada') {
      p.history.push({ at: Date.now(), type: 'alarm' });
      await rescheduleFrom(p, new Date());
      await upsert(p);
    } else if (action==='snooze') {
      p.schedule = undefined; // pausa automático
      await upsert(p);
    } else {
      await removePlant(p.instanceId);
    }
    navigation.goBack();
  };

  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center', padding:24}}>
      <Text style={{fontSize:22, marginBottom:16}}>Hora de regar!</Text>
      <Button title="Regar mais tarde" onPress={()=>handle('snooze')}/>
      <View style={{height:8}}/>
      <Button title="Regada" onPress={()=>handle('regada')}/>
      <View style={{height:8}}/>
      <Button color="red" title="Deletar" onPress={()=>handle('delete')}/>
    </View>
  );
}
