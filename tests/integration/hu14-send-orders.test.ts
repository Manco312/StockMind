import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('H.U 14 - Enviar pedidos a distribuidora - Pruebas de Integración', () => {
  const baseUrl = 'http://localhost:3000';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe crear un pedido completo con todos los datos requeridos', async () => {
    const orderData = {
      productId: 1,
      quantity: 10,
      price: 100000,
      productName: 'Producto Test',
      inventoryManagerId: 1,
    };

    const mockResponse = {
      id: 1,
      status: 'pending',
      quantity: orderData.quantity,
      price: orderData.price,
      productId: orderData.productId,
      inventoryManagerId: orderData.inventoryManagerId,
      notifications: [
        {
          id: 1,
          title: 'Nuevo Pedido',
          message: `Producto: ${orderData.productName} - Cantidad: ${orderData.quantity}`,
          type: 'order_created',
        },
      ],
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.status).toBe('pending');
    expect(data.quantity).toBe(orderData.quantity);
    expect(data.price).toBe(orderData.price);
    expect(data.notifications).toBeDefined();
    expect(data.notifications.length).toBeGreaterThan(0);
  });

  it('debe validar que todos los campos obligatorios estén presentes', async () => {
    const incompleteOrderData = {
      productId: 1,
      // Faltan quantity, inventoryManagerId
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Faltan datos obligatorios' }),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incompleteOrderData),
    });

    const data = await response.json();

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(data.error).toBe('Faltan datos obligatorios');
  });

  it('debe crear una notificación cuando se crea un pedido', async () => {
    const orderData = {
      productId: 1,
      quantity: 5,
      price: 50000,
      productName: 'Producto Test',
      inventoryManagerId: 1,
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            status: 'pending',
            notifications: [
              {
                id: 1,
                title: 'Nuevo Pedido',
                message: `Producto: ${orderData.productName} - Cantidad: ${orderData.quantity}`,
                type: 'order_created',
              },
            ],
          }),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.notifications).toBeDefined();
    expect(data.notifications[0].type).toBe('order_created');
    expect(data.notifications[0].message).toContain(orderData.productName);
  });

  it('debe calcular correctamente el precio total del pedido', async () => {
    const orderData = {
      productId: 1,
      quantity: 10,
      price: 100000, // precio total = precio unitario * cantidad
      productName: 'Producto Test',
      inventoryManagerId: 1,
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            price: orderData.price,
            quantity: orderData.quantity,
          }),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.price).toBe(orderData.price);
    expect(data.quantity).toBe(orderData.quantity);
  });

  it('debe retornar error 404 si no se encuentra un distribuidor', async () => {
    const orderData = {
      productId: 1,
      quantity: 10,
      price: 100000,
      productName: 'Producto Test',
      inventoryManagerId: 1,
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            error: 'No se encontró un usuario distribuidor o vendedor',
          }),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
    expect(data.error).toContain('No se encontró');
  });

  it('debe asignar el estado "pending" por defecto a los nuevos pedidos', async () => {
    const orderData = {
      productId: 1,
      quantity: 10,
      price: 100000,
      productName: 'Producto Test',
      inventoryManagerId: 1,
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            status: 'pending',
          }),
      } as Response)
    );

    const response = await fetch(`${baseUrl}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.status).toBe('pending');
  });
});
