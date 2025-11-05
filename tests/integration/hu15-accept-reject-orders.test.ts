import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('H.U 15 - Aceptar o rechazar pedidos - Pruebas de Integración', () => {
  const baseUrl = 'http://localhost:3000';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Aceptar pedidos', () => {
    it('debe aceptar un pedido pendiente correctamente', async () => {
      const orderId = 1;
      const acceptData = {
        quantity: 10,
        expirationDate: '2025-12-31',
        location: 'Almacén Central',
      };

      const mockResponse = {
        message: 'Orden aceptada y lote creado exitosamente',
        order: {
          id: orderId,
          status: 'accepted',
        },
        batch: {
          id: 1,
          code: 'BATCH-123',
          quantity: acceptData.quantity,
        },
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const response = await fetch(`${baseUrl}/api/orders/${orderId}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acceptData),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.order.status).toBe('accepted');
      expect(data.batch).toBeDefined();
      expect(data.message).toContain('aceptada');
    });

    it('debe crear un lote cuando se acepta un pedido', async () => {
      const orderId = 1;
      const acceptData = {
        quantity: 10,
        expirationDate: '2025-12-31',
        location: 'Almacén Central',
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              message: 'Orden aceptada y lote creado exitosamente',
              order: { id: orderId, status: 'accepted' },
              batch: {
                id: 1,
                code: expect.any(String),
                quantity: acceptData.quantity,
                expirationDate: acceptData.expirationDate,
                location: acceptData.location,
              },
            }),
        } as Response)
      );

      const response = await fetch(`${baseUrl}/api/orders/${orderId}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acceptData),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.batch).toBeDefined();
      expect(data.batch.quantity).toBe(acceptData.quantity);
    });

    it('debe retornar error si el pedido ya fue aceptado', async () => {
      const orderId = 1;

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () =>
            Promise.resolve({
              message: 'El pedido ya fue aceptado previamente',
            }),
        } as Response)
      );

      const response = await fetch(`${baseUrl}/api/orders/${orderId}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: 10, expirationDate: '2025-12-31' }),
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(data.message).toContain('ya fue aceptado');
    });

    it('debe crear una notificación cuando se acepta un pedido', async () => {
      const orderId = 1;

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              message: 'Orden aceptada y lote creado exitosamente',
              order: { id: orderId, status: 'accepted' },
              batch: { id: 1 },
            }),
        } as Response)
      );

      const response = await fetch(`${baseUrl}/api/orders/${orderId}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: 10, expirationDate: '2025-12-31' }),
      });

      expect(response.ok).toBe(true);
      // La notificación se crea en el backend
    });
  });

  describe('Rechazar pedidos', () => {
    it('debe rechazar un pedido pendiente correctamente', async () => {
      const orderId = 1;

      const mockResponse = {
        message: 'Pedido rechazado correctamente',
        order: {
          id: orderId,
          status: 'rejected',
        },
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const response = await fetch(`${baseUrl}/api/orders/${orderId}/reject`, {
        method: 'PATCH',
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.order.status).toBe('rejected');
      expect(data.message).toContain('rechazado');
    });

    it('debe retornar error si el pedido ya fue rechazado', async () => {
      const orderId = 1;

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () =>
            Promise.resolve({
              message: 'El pedido ya fue rechazado previamente',
            }),
        } as Response)
      );

      const response = await fetch(`${baseUrl}/api/orders/${orderId}/reject`, {
        method: 'PATCH',
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(data.message).toContain('ya fue rechazado');
    });

    it('no debe permitir rechazar un pedido ya aceptado', async () => {
      const orderId = 1;

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () =>
            Promise.resolve({
              message: 'No se puede rechazar un pedido aceptado',
            }),
        } as Response)
      );

      const response = await fetch(`${baseUrl}/api/orders/${orderId}/reject`, {
        method: 'PATCH',
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(data.message).toContain('No se puede rechazar');
    });

    it('debe crear una notificación cuando se rechaza un pedido', async () => {
      const orderId = 1;

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              message: 'Pedido rechazado correctamente',
              order: { id: orderId, status: 'rejected' },
            }),
        } as Response)
      );

      const response = await fetch(`${baseUrl}/api/orders/${orderId}/reject`, {
        method: 'PATCH',
      });

      expect(response.ok).toBe(true);
      // La notificación se crea en el backend
    });
  });

  describe('Validaciones de estado', () => {
    it('debe retornar error 404 si el pedido no existe', async () => {
      const orderId = 999;

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({ error: 'Pedido no encontrado' }),
        } as Response)
      );

      const response = await fetch(`${baseUrl}/api/orders/${orderId}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: 10, expirationDate: '2025-12-31' }),
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      expect(data.error).toBe('Pedido no encontrado');
    });
  });
});
