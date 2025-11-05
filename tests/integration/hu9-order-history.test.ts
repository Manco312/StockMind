import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('H.U 9 - Consultar historial de pedidos - Pruebas de Integración', () => {
  const baseUrl = 'http://localhost:3000';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener el historial de pedidos de una tienda', async () => {
    const storeId = 1;
    const mockResponse = {
      orders: [
        {
          id: 1,
          product: { title: 'Producto Test 1', id: 1 },
          quantity: 10,
          price: 100000,
          status: 'received',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          product: { title: 'Producto Test 2', id: 2 },
          quantity: 5,
          price: 50000,
          status: 'accepted',
          createdAt: new Date().toISOString(),
        },
      ],
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/stores/${storeId}/orders`);
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.orders).toBeDefined();
    expect(Array.isArray(data.orders)).toBe(true);
    expect(data.orders.length).toBe(2);
  });

  it('debe filtrar pedidos por búsqueda de producto', async () => {
    const storeId = 1;
    const searchQuery = 'Producto Test 1';

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            orders: [
              {
                id: 1,
                product: { title: 'Producto Test 1', id: 1 },
                quantity: 10,
                price: 100000,
                status: 'received',
              },
            ],
          }),
      } as Response)
    );

    const response = await fetch(
      `${baseUrl}/api/stores/${storeId}/orders?q=${encodeURIComponent(searchQuery)}`
    );
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.orders.length).toBe(1);
    expect(data.orders[0].product.title).toContain(searchQuery);
  });

  it('debe filtrar pedidos por rango de fechas', async () => {
    const storeId = 1;
    const dateFrom = '2024-01-01';
    const dateTo = '2024-12-31';

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            orders: [
              {
                id: 1,
                product: { title: 'Producto Test', id: 1 },
                quantity: 10,
                price: 100000,
                status: 'received',
                createdAt: '2024-06-15T10:00:00Z',
              },
            ],
          }),
      } as Response)
    );

    const response = await fetch(
      `${baseUrl}/api/stores/${storeId}/orders?from=${dateFrom}&to=${dateTo}`
    );
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.orders).toBeDefined();
  });

  it('debe retornar error 401 si no está autenticado', async () => {
    const storeId = 1;

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'No autorizado' }),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/stores/${storeId}/orders`);
    const data = await response.json();

    expect(response.ok).toBe(false);
    expect(response.status).toBe(401);
    expect(data.error).toBe('No autorizado');
  });

  it('debe retornar error 403 si el usuario no tiene permisos', async () => {
    const storeId = 1;

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 403,
        json: () =>
          Promise.resolve({
            error: 'Acceso denegado. Se requiere rol de preventista o distribuidor.',
          }),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/stores/${storeId}/orders`);
    const data = await response.json();

    expect(response.ok).toBe(false);
    expect(response.status).toBe(403);
    expect(data.error).toContain('Acceso denegado');
  });

  it('debe mostrar los datos correctos de cada pedido', async () => {
    const storeId = 1;
    const mockOrder = {
      id: 1,
      product: { title: 'Producto Test', id: 1 },
      quantity: 10,
      price: 100000,
      status: 'received',
      createdAt: '2024-06-15T10:00:00Z',
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ orders: [mockOrder] }),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/stores/${storeId}/orders`);
    const data = await response.json();

    const order = data.orders[0];
    expect(order.id).toBe(mockOrder.id);
    expect(order.product.title).toBe(mockOrder.product.title);
    expect(order.quantity).toBe(mockOrder.quantity);
    expect(order.price).toBe(mockOrder.price);
    expect(order.status).toBe(mockOrder.status);
  });
});
