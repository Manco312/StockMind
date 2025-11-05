import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('H.U 11 - Registrar nuevas tiendas - Pruebas de Integración', () => {
  const baseUrl = 'http://localhost:3000';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe crear una nueva tienda con todos los campos requeridos', async () => {
    const storeData = {
      name: 'Tienda Test Integración',
      address: 'Calle 123 #45-67',
      neighborhood: 'Centro',
      capital: 2500000,
    };

    const mockResponse = {
      success: true,
      store: {
        id: 1,
        ...storeData,
      },
      inventory: {
        id: 1,
        type: 'store',
        storeId: 1,
      },
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/stores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeData),
    });

    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
    expect(data.store.name).toBe(storeData.name);
    expect(data.store.address).toBe(storeData.address);
    expect(data.inventory).toBeDefined();
    expect(data.inventory.storeId).toBe(data.store.id);
  });

  it('debe validar que todos los campos son obligatorios', async () => {
    const incompleteData = {
      name: 'Tienda Test',
      // Faltan address, neighborhood, capital
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({ error: 'Todos los campos son obligatorios' }),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/stores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incompleteData),
    });

    const data = await response.json();

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(data.error).toBe('Todos los campos son obligatorios');
  });

  it('debe crear un inventario asociado a la tienda automáticamente', async () => {
    const storeData = {
      name: 'Tienda con Inventario',
      address: 'Calle Test',
      neighborhood: 'Test',
      capital: 1000000,
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            store: { id: 2, ...storeData },
            inventory: { id: 2, type: 'store', storeId: 2 },
          }),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/stores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeData),
    });

    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.inventory).toBeDefined();
    expect(data.inventory.type).toBe('store');
    expect(data.inventory.storeId).toBe(data.store.id);
  });

  it('debe retornar error 401 si no está autenticado', async () => {
    const storeData = {
      name: 'Tienda Test',
      address: 'Calle Test',
      neighborhood: 'Test',
      capital: 1000000,
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'No autorizado' }),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/stores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeData),
    });

    const data = await response.json();

    expect(response.ok).toBe(false);
    expect(response.status).toBe(401);
    expect(data.error).toBe('No autorizado');
  });

  it('debe retornar error 403 si el usuario no tiene permisos', async () => {
    const storeData = {
      name: 'Tienda Test',
      address: 'Calle Test',
      neighborhood: 'Test',
      capital: 1000000,
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 403,
        json: () =>
          Promise.resolve({
            error: 'Solo los preventistas pueden registrar tiendas',
          }),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/stores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeData),
    });

    const data = await response.json();

    expect(response.ok).toBe(false);
    expect(response.status).toBe(403);
    expect(data.error).toContain('Solo los preventistas');
  });

  it('debe validar que el capital es un número válido', async () => {
    const storeData = {
      name: 'Tienda Test',
      address: 'Calle Test',
      neighborhood: 'Test',
      capital: 'no-es-un-numero',
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({ error: 'El capital debe ser un número válido' }),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/stores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storeData),
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
  });
});
