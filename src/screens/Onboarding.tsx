// src/screens/Onboarding.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Onboarding({ navigation }: any) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  // se já houver nome salvo, pula para a vitrine
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('plantae@username');
      if (stored) {
        navigation.replace('Vitrine');
      }
    })();
  }, [navigation]);

  // validação mínima: exige ao menos 2 caracteres úteis
  const isValid = useMemo(() => name.trim().length >= 2, [name]);

  const handleConfirm = async () => {
    if (!isValid || saving) return;
    try {
      setSaving(true);
      await AsyncStorage.setItem('plantae@username', name.trim());
      navigation.replace('Vitrine'); // substitui a rota para não voltar ao onboarding
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 22, marginBottom: 12 }}>Como podemos chamar?</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          style={{ borderWidth: 1, borderRadius: 8, width: '100%', padding: 12, marginBottom: 12 }}
        />
        <Button title={saving ? 'Salvando...' : 'Confirmar'} disabled={!isValid || saving} onPress={handleConfirm} />
      </View>
    </KeyboardAvoidingView>
  );
}
