// src/screens/Encerramento.tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

export default function Encerramento() {
  useEffect(()=>{
    const t = setTimeout(()=>{/* fechar app ou voltar */}, 1500);
    return ()=>clearTimeout(t);
  },[]);
  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Text style={{fontSize:24}}>PlantaE</Text>
    </View>
  );
}


