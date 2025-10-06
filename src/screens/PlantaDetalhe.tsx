// src/screens/PlantaDetalhe.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { loadAll, upsert, remove as removePlant } from '../storage/db';
import { MVP_PLANTS } from '../data/plants';
import { rescheduleFrom } from '../services/scheduler';

export default function PlantaDetalhe({ route, navigation }: any) {
  const { instanceId } = route.params;
  const [plant,setPlant]=useState<any>();

  const load = async()=>{
    const list = await loadAll();
    setPlant(list.find(p=>p.instanceId===instanceId));
  };
  useEffect(()=>{ load(); const unsub=navigation.addListener('focus', load); return unsub; },[navigation]);

  if (!plant) return null;
  const def = MVP_PLANTS.find(d=>d.id===plant.plantId)!;

  return (
    <View style={{flex:1, padding:16}}>
      <Text style={{fontSize:22, marginBottom:8}}>{def.name}</Text>
      <Text>Ambiente ideal: {def.environment}</Text>
      <Text>Água por rega: {def.waterMl} ml</Text>
      <Text>Intervalo recomendado: {def.intervalHours} h</Text>

      <View style={{height:16}}/>
      <Button title="Regar agora" onPress={async()=>{
        plant.history.push({ at: Date.now(), type:'manual' });
        await rescheduleFrom(plant, new Date());
        await upsert(plant);
        load();
      }}/>

      <View style={{height:8}}/>
      <Button title="Lembrete manual (3 pontos)" onPress={()=>navigation.navigate('RelogioPersonalizado', { instanceId })}/>

      <View style={{height:8}}/>
      <Button title="Adicionar adubação" onPress={async()=>{
        plant.fertilize = { lastAt: Date.now(), intervalDays: 30 };
        await upsert(plant);
        load();
      }}/>

      <View style={{height:8}}/>
      <Button color="red" title="Deletar" onPress={()=>{
        Alert.alert('Excluir planta','Deseja realmente excluir?',[
          { text:'Cancelar' },
          { text:'Excluir', style:'destructive', onPress: async()=>{ await removePlant(instanceId); navigation.goBack(); } }
        ]);
      }}/>

      <View style={{marginTop:24}}>
        <Text style={{fontWeight:'600'}}>Histórico de regas</Text>
        {plant.history.slice().reverse().map((h:any, i:number)=>(
          <Text key={i}>• {new Date(h.at).toLocaleString()} ({h.type})</Text>
        ))}
      </View>
    </View>
  );
}
