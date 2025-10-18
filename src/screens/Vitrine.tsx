import React, { useMemo, useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MVP_PLANTS } from '../data/plants';

// Exemplo de ícones ilustrativos locais (adicione imagens reais na pasta assets)
const ICONS: Record<string, any> = {
  Samambaia: require('../../assets/images/samanbaia.png'),
  'Monstera deliciosa': require('../../assets/images/monstera.png'),
  'Cacto Cereus': require('../../assets/images/cacto.png'),
  // Adicione outros conforme necessário
};

const GROUPS = [
  'Briófitas',
  'Pteridófitas',
  'Gimnospermas',
  'Angiospermas',
];

export default function Vitrine({ navigation }: any) {
  const [activeGroup, setActiveGroup] = useState(GROUPS[0]);

  const plantasPorGrupo = useMemo(() => {
    return MVP_PLANTS.filter((p) => p.group === activeGroup);
  }, [activeGroup]);

  return (
    <View style={{ flex: 1, backgroundColor: '#10141a' }}>
      {/* Header, user, saudação */}
      <View style={{
        paddingTop: 45,
        paddingHorizontal: 18,
        backgroundColor: '#10141a',
      }}>
        <Text style={{ color: '#4ADE80', fontSize: 24, fontWeight: 'bold' }}>Olá, Tiago</Text>
        <Text style={{ color: '#fff', fontSize: 16, marginTop: 2 }}>
          Qual planta você gostaria de cadastrar?
        </Text>
      </View>
      {/* Abas horizontais */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          marginVertical: 20,
          paddingLeft: 12,
          paddingRight: 6,
          alignItems: 'center'
        }}>
        {GROUPS.map((g) => (
          <TouchableOpacity
            key={g}
            style={{
              backgroundColor: g === activeGroup ? '#4ADE80' : '#23272f',
              borderRadius: 16,
              paddingVertical: 8,
              paddingHorizontal: 18,
              minWidth: 100,
              maxWidth: 180,
              marginRight: 10,
              alignItems: 'center',
              borderWidth: g === activeGroup ? 0 : 1,
              borderColor: '#3f424d',
            }}
            onPress={() => setActiveGroup(g)}
            activeOpacity={0.7}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: g === activeGroup ? '#10141a' : '#fff',
              textAlign: 'center',
            }}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grid de cards */}
      <FlatList
        style={{ flex: 1, paddingHorizontal: 10 }}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 18 }}
        keyExtractor={item => item.id}
        data={plantasPorGrupo}
        ListEmptyComponent={
          <Text style={{ color: '#fff', alignSelf: 'center' }}>
            Nenhuma planta nesse grupo.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Relogio', { plantId: item.id })}
            style={{
              backgroundColor: '#202534',
              borderRadius: 20,
              padding: 16,
              alignItems: 'center',
              width: Dimensions.get('window').width / 2 - 25,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.18,
              shadowRadius: 4,
              elevation: 7,
            }}
            activeOpacity={0.8}
          >
            <View
              style={{
                backgroundColor: '#181b24',
                width: 64,
                height: 64,
                borderRadius: 32,
                marginBottom: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {ICONS[item.name] ? (
                <Image
                  source={ICONS[item.name]}
                  resizeMode="contain"
                  style={{ width: 48, height: 48 }}
                />
              ) : (
                <Text style={{ color: '#4ADE80', fontSize: 42 }}>🌱</Text>
              )}
            </View>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>{item.name}</Text>
            <Text
              style={{
                color: '#91A7C8',
                fontSize: 13,
                textAlign: 'center',
                marginTop: 5,
              }}
              numberOfLines={2}
            >
              {item.summary}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Barra inferior fictícia */}
      <View style={{
        backgroundColor: '#181b24',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 68,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
      }}>
        <TouchableOpacity>
          <Text style={{ color: '#4ADE80', fontWeight: 'bold' }}>plantas cadastradas</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{
            color: '#10141a',
            backgroundColor: '#4ADE80',
            borderRadius: 16,
            padding: 12,
            overflow: 'hidden',
            fontWeight: 'bold'
          }}>
            Nova planta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
