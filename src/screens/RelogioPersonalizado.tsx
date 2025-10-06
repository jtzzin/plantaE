// src/screens/RelogioPersonalizado.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Button } from 'react-native';
import { loadAll, upsert } from '../storage/db';
import { scheduleWaterAlarm, cancelAlarm } from '../services/notifications';

export default function RelogioPersonalizado({ route, navigation }: any) {
  const { instanceId } = route.params;
  const [plant,setPlant]=useState<any>();
  const [days,setDays]=useState<boolean[]>([false,false,false,false,false,false,false]);
  const [time,setTime]=useState('09:00');

  useEffect(()=>{ (async()=>{
    const list = await loadAll();
    const p = list.find(x=>x.instanceId===instanceId);
    setPlant(p);
  })(); },[]);

  if (!plant) return null;

  return (
    <View style={{flex:1, padding:16}}>
      <Text style={{fontSize:18, marginBottom:8}}>Selecione dias e horário fixo</Text>
      {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((d,idx)=>(
        <View key={d} style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginVertical:4}}>
          <Text>{d}</Text><Switch value={days[idx]} onValueChange={(v)=>{ const cp=[...days]; cp[idx]=v; setDays(cp); }}/>
        </View>
      ))}
      {/* time picker simples */}
      <Button title={`Escolher hora: ${time}`} onPress={()=>{/* implementar seletor a gosto */}}/>

      <View style={{height:12}}/>
      <Button title="Salvar" onPress={async()=>{
        // cancela auto
        if (plant.schedule?.notificationId) await cancelAlarm(plant.schedule.notificationId);
        plant.schedule = undefined;
        plant.manual = [{ id: 'rule-1', dow: days.map((v,i)=>v?i:-1).filter(v=>v>=0), times: [time] }];
        await upsert(plant);
        navigation.goBack();
      }}/>
    </View>
  );
}
