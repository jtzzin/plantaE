// src/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from '../screens/Onboarding';
import Vitrine from '../screens/Vitrine';
import Relogio from '../screens/Relogio';
import Plantas from '../screens/Plantas';
import PlantaDetalhe from '../screens/PlantaDetalhe';
import RelogioPersonalizado from '../screens/RelogioPersonalizado';
import Alarme from '../screens/Alarme';
import Encerramento from '../screens/Encerramento';
import { navigationRef } from './rootNavigation';

const Stack = createNativeStackNavigator();

export default function RootNav() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Vitrine" component={Vitrine} />
        <Stack.Screen name="Relogio" component={Relogio} />
        <Stack.Screen name="Plantas" component={Plantas} />
        <Stack.Screen name="PlantaDetalhe" component={PlantaDetalhe} />
        <Stack.Screen name="RelogioPersonalizado" component={RelogioPersonalizado} />
        <Stack.Screen name="Alarme" component={Alarme} />
        <Stack.Screen name="Encerramento" component={Encerramento} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
