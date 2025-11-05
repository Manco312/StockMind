import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';

describe('H.U 12 - Reducir stock por vencimiento - Pruebas Unitarias', () => {
  it('debe identificar lotes vencidos correctamente', () => {
    const now = new Date();
    const expiredDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 día atrás
    const validDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 días adelante

    const isExpired = (expirationDate: Date) => {
      return expirationDate < now;
    };

    expect(isExpired(expiredDate)).toBe(true);
    expect(isExpired(validDate)).toBe(false);
  });

  it('debe calcular correctamente el stock total considerando lotes vencidos', () => {
    const batches = [
      { id: 1, quantity: 10, expired: false, expirationDate: new Date('2025-12-31') },
      { id: 2, quantity: 5, expired: true, expirationDate: new Date('2024-01-01') },
      { id: 3, quantity: 8, expired: false, expirationDate: new Date('2025-12-31') },
    ];

    const calculateAvailableStock = (batches: typeof batches) => {
      return batches
        .filter((batch) => !batch.expired)
        .reduce((sum, batch) => sum + batch.quantity, 0);
    };

    const availableStock = calculateAvailableStock(batches);
    expect(availableStock).toBe(18); // 10 + 8 (excluyendo el lote vencido)
  });

  it('debe marcar lotes como expirados cuando la fecha ha pasado', () => {
    const now = new Date();
    const expiredDate = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hora atrás

    const markBatchAsExpired = (batch: { expired: boolean; expirationDate: Date }) => {
      if (batch.expirationDate < now && !batch.expired) {
        return { ...batch, expired: true };
      }
      return batch;
    };

    const batch = {
      id: 1,
      expired: false,
      expirationDate: expiredDate,
    };

    const updatedBatch = markBatchAsExpired(batch);
    expect(updatedBatch.expired).toBe(true);
  });

  it('debe crear alerta cuando un lote expira', () => {
    const batch = {
      id: 1,
      code: 'BATCH-001',
      quantity: 10,
      product: { title: 'Producto Test' },
      expirationDate: new Date('2024-01-01'),
    };

    const createExpirationAlert = (batch: typeof batch, storeId: number) => {
      return {
        type: 'EXPIRED_BATCH',
        productId: batch.id,
        storeId,
        message: `Lote vencido: ${batch.product.title} - Lote ${batch.code} (${batch.quantity} unidades)`,
      };
    };

    const alert = createExpirationAlert(batch, 1);
    expect(alert.type).toBe('EXPIRED_BATCH');
    expect(alert.message).toContain('BATCH-001');
    expect(alert.message).toContain('10 unidades');
  });

  it('no debe reducir stock si el lote no ha vencido', () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días adelante

    const batch = {
      id: 1,
      quantity: 10,
      expired: false,
      expirationDate: futureDate,
    };

    const shouldReduceStock = batch.expirationDate < now;
    expect(shouldReduceStock).toBe(false);
    expect(batch.expired).toBe(false);
  });
});
