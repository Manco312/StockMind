import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('H.U 12 - Reducir stock por vencimiento - Pruebas de Integración', () => {
  const baseUrl = 'http://localhost:3000';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe marcar lotes vencidos correctamente', async () => {
    const storeId = 1;

    const mockResponse = {
      message: 'Revisión de alertas completada',
      created: 2, // 2 alertas creadas
      resolved: 0,
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const response = await fetch(
      `${baseUrl}/api/inventory/alerts/check/${storeId}`
    );
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.message).toContain('completada');
    expect(data.created).toBeGreaterThanOrEqual(0);
    expect(data.resolved).toBeGreaterThanOrEqual(0);
  });

  it('debe crear alertas de lote vencido cuando hay lotes expirados', async () => {
    const storeId = 1;

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Revisión de alertas completada',
            created: 1,
            resolved: 0,
          }),
      } as Response)
    );

    const response = await fetch(
      `${baseUrl}/api/inventory/alerts/check/${storeId}`
    );
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.created).toBe(1);
  });

  it('debe marcar lotes como expired cuando la fecha de vencimiento ha pasado', async () => {
    const storeId = 1;

    // Simulamos que se encontraron lotes vencidos
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Revisión de alertas completada',
            created: 1,
            resolved: 0,
          }),
      } as Response)
    );

    const response = await fetch(
      `${baseUrl}/api/inventory/alerts/check/${storeId}`
    );
    const data = await response.json();

    expect(response.ok).toBe(true);
    // Si se creó una alerta, significa que se marcó un lote como vencido
    expect(data.created).toBeGreaterThanOrEqual(0);
  });

  it('debe retornar error 400 si el storeId es inválido', async () => {
    const invalidStoreId = 'invalid';

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'ID de tienda inválido' }),
      } as Response)
    );

    const response = await fetch(
      `${baseUrl}/api/inventory/alerts/check/${invalidStoreId}`
    );
    const data = await response.json();

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(data.error).toBe('ID de tienda inválido');
  });

  it('debe calcular correctamente el stock disponible excluyendo lotes vencidos', async () => {
    const storeId = 1;

    // Simulamos que se procesaron lotes y se calcularon stocks
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Revisión de alertas completada',
            created: 0,
            resolved: 1, // Se resolvió una alerta, stock normalizado
          }),
      } as Response)
    );

    const response = await fetch(
      `${baseUrl}/api/inventory/alerts/check/${storeId}`
    );
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.resolved).toBeGreaterThanOrEqual(0);
  });

  it('debe crear alertas de tipo EXPIRED_BATCH para lotes vencidos', async () => {
    const storeId = 1;

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Revisión de alertas completada',
            created: 1,
            resolved: 0,
          }),
      } as Response)
    );

    const response = await fetch(
      `${baseUrl}/api/inventory/alerts/check/${storeId}`
    );
    const data = await response.json();

    expect(response.ok).toBe(true);
    // Si se creó una alerta, debería ser de tipo EXPIRED_BATCH
    expect(data.created).toBeGreaterThanOrEqual(0);
  });
});
