import { User } from '../types';

interface UserCredential extends User {
  password: string;
}

export const USERS: UserCredential[] = [
  { username: 'admin', password: '299381Be@', role: 'admin' },
  { username: 'javier', password: '123450', role: 'admin' },
  { username: 'briyith', password: '123450', role: 'admin' },
  { username: 'employee', password: 'Savia123', role: 'employee' },
  { username: 'miguel', password: '1081058106', role: 'employee' },
  { username: 'erica', password: '1088798678', role: 'employee' },
  { username: 'tania', password: '1088799073', role: 'employee' },
  { username: 'jonathan', password: '1004135095', role: 'admin' },
  // { username: 'lina', password: '1004236331', role: 'admin' },
  // { username: 'daniel', password: '1193131563', role: 'employee' },
];

export function authenticate(username: string, password: string): User | null {
  const user = USERS.find(u => u.username === username && u.password === password);
  return user ? { username: user.username, role: user.role } : null;
}
