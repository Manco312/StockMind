import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock de Next-Auth
vi.mock('@/src/auth', () => ({
  auth: vi.fn(),
}));
