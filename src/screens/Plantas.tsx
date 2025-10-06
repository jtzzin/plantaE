// src/screens/Plantas.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { loadAll } from '../storage/db';
import { MVP_PLANTS } from '../data/plants';

export default function Plantas({ navigation }: any) {
  const [list, setList] = useState<any[]>([]);
  const refresh = async () => setList(await loadAll());
  useEffect(() => {
    const unsub = navigation.addListener('focus', refresh);
    return unsub;
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={list}
        keyExtractor={(i) => i.instanceId}
        ListEmptyComponent={
          <View style={{ padding: 24 }}>
            <Text>Nenhuma planta cadastrada.</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <Button title="Cadastrar mais" onPress={() => navigation.navigate('Vitrine')} />
          </View>
        }
        renderItem={({ item }) => {
          const def = MVP_PLANTS.find((p) => p.id === item.plantId)!;
          return (
            <TouchableOpacity
              style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}
              onPress={() => navigation.navigate('PlantaDetalhe', { instanceId: item.instanceId })}
            >
              <Text style={{ fontSize: 16 }}>{def.name}</Text>
              <Text style={{ color: '#666' }}>
                Próxima rega: {new Date(item.schedule?.nextAt || Date.now()).toLocaleString()}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
