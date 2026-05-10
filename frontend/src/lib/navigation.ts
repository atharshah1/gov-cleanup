import type { UserRole } from './types';

export const USER_ROLES: UserRole[] = ['citizen', 'driver', 'admin'];

export function isUserRole(value: string | null | undefined): value is UserRole {
  return Boolean(value && USER_ROLES.includes(value as UserRole));
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case 'citizen':
      return 'Citizen';
    case 'driver':
      return 'Driver';
    case 'admin':
      return 'Admin';
    default:
      return 'Citizen';
  }
}

export function loginPathForRole(role: UserRole): string {
  return `/login/${role}`;
}

export function signupPathForRole(role: UserRole): string {
  return `/signup/${role}`;
}

export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case 'driver':
      return '/dashboard/driver';
    case 'admin':
      return '/dashboard/admin';
    default:
      return '/dashboard/user';
  }
}
