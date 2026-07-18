import AsyncStorage from '@react-native-async-storage/async-storage';

const ROLE_KEY = 'easymap.role';

export type Role = 'senior' | 'helper';

export async function getStoredRole(): Promise<Role | null> {
  const value = await AsyncStorage.getItem(ROLE_KEY);
  return value === 'senior' || value === 'helper' ? value : null;
}

export async function setStoredRole(role: Role): Promise<void> {
  await AsyncStorage.setItem(ROLE_KEY, role);
}
