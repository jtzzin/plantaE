import { CommonActions, createNavigationContainerRef } from '@react-navigation/native';

export type RootStackParamList = {
  Onboarding: undefined;
  Vitrine: undefined;
  Relogio: { plantId: string };
  Plantas: undefined;
  PlantaDetalhe: { instanceId: string };
  RelogioPersonalizado: { instanceId: string };
  Alarme: { instanceId: string };
  Encerramento: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigate: typeof navigationRef.navigate = (name: any, params?: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
};

export function navigateToAlarm(instanceId: string) {
  navigate('Alarme', { instanceId });
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
