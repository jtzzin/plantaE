// src/data/plants.ts
export type PlantGroup = 'Briófitas' | 'Pteridófitas' | 'Gimnospermas' | 'Angiospermas';
export type Plant = {
  id: string;
  name: string;
  group: PlantGroup;
  famous: boolean;
  environment: 'Sombra' | 'Meia-sombra' | 'Sol';
  waterMl: number;
  intervalHours: number;
  intervalDays?: number;
  summary: string;
};

export const MVP_PLANTS: Plant[] = [
  {
    id: '1',
    name: 'Monstera deliciosa',
    group: 'Angiospermas',
    famous: true,
    environment: 'Meia-sombra',
    waterMl: 250,
    intervalHours: 72,
    summary: 'Luz indireta brilhante; regas moderadas quando o solo estiver quase seco.',
  },
  {
    id: '2',
    name: 'Samambaia',
    group: 'Pteridófitas',
    famous: true,
    environment: 'Sombra',
    waterMl: 200,
    intervalHours: 48,
    summary: 'Ambiente úmido e sem sol direto; regas frequentes.',
  },
  {
    id: '3',
    name: 'Cacto Cereus',
    group: 'Gimnospermas',
    famous: true,
    environment: 'Sol',
    waterMl: 100,
    intervalHours: 168,
    summary: 'Sol pleno; regar pouco e somente com substrato seco.',
  },
];
