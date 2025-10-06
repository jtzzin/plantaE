// src/utils/uid.ts
import * as Crypto from 'expo-crypto';

export async function uid(): Promise<string> {
  // Disponível no SDK atual; gera UUID v4 válido
  if (typeof (Crypto as any).randomUUID === 'function') {
    return (Crypto as any).randomUUID();
  }
  // Fallback: cria 16 bytes aleatórios e formata com padrão v4
  const bytes = Crypto.getRandomBytes(16);
  // Ajuste de variantes v4: 8, 9, A ou B
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
