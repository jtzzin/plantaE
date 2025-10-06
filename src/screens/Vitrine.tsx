// src/screens/Vitrine.tsx
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MVP_PLANTS } from '../data/plants';

export default function Vitrine({ navigation }: any) {
  const groups = useMemo(() => {
    const map = new Map<string, typeof MVP_PLANTS>();
    MVP_PLANTS.forEach((p) => {
      const arr: any = map.get(p.group) || [];
      arr.push(p);
      map.set(p.group, arr);
    });
    return Array.from(map.entries());
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 12 }}>Plantas por grupo</Text>
      {groups.map(([group, list]) => (
        <View key={group} style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>{group}</Text>
          {list.map((p) => (
            <TouchableOpacity
              key={p.id}
              onPress={() => navigation.navigate('Relogio', { plantId: p.id })}
              style={{ backgroundColor: '#111', padding: 16, borderRadius: 12, marginBottom: 8 }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>{p.name}</Text>
              <Text style={{ color: '#a7a7a7', marginTop: 4 }}>
                {p.summary} • Ambiente: {p.environment} • Água: {p.waterMl} ml • Próxima: +{p.intervalHours}h
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
