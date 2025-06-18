import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@toystore.com',
    name: 'Administrador',
    role: 'admin'
  }
];

export const login = async (email: string, password: string): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email === email);
  if (user && password === '123456') {
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = (): void => {
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};