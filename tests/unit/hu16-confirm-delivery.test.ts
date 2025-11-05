import { describe, it, expect, beforeEach } from 'vitest';

describe('H.U 16 - Confirmar llegada de envío - Pruebas Unitarias', () => {
  describe('Actualización de stock al recibir pedido', () => {
    it('debe transferir el batch del inventario del distribuidor al inventario de la tienda', () => {
      const originalBatch = {
        id: 1,
        inventoryId: 10, // Inventario del distribuidor
        quantity: 50,
        location: 'Almacén Central',
      };

      const updateBatchInventory = (
        batch: typeof originalBatch,
        newInventoryId: number,
        newLocation: string
      ) => {
        return {
          ...batch,
          inventoryId: newInventoryId,
          location: newLocation,
        };
      };

      const updatedBatch = updateBatchInventory(originalBatch, 20, 'Tienda Principal');
      
      expect(updatedBatch.inventoryId).toBe(20);
      expect(updatedBatch.location).toBe('Tienda Principal');
      expect(updatedBatch.quantity).toBe(50); // La cantidad no cambia
    });

    it('debe actualizar el estado del pedido a "received"', () => {
      const order = {
        id: 1,
        status: 'accepted',
        quantity: 50,
        productId: 5,
      };

      const markOrderAsReceived = (order: typeof order) => {
        if (order.status !== 'accepted') {
          throw new Error('Solo los pedidos aceptados pueden ser recibidos');
        }
        return {
          ...order,
          status: 'received',
        };
      };

      const updatedOrder = markOrderAsReceived(order);
      expect(updatedOrder.status).toBe('received');
    });

    it('debe validar que solo pedidos aceptados pueden ser recibidos', () => {
      const markOrderAsReceived = (order: { status: string }) => {
        if (order.status !== 'accepted') {
          throw new Error('Solo los pedidos aceptados pueden ser recibidos');
        }
        return { ...order, status: 'received' };
      };

      expect(() => markOrderAsReceived({ status: 'pending' })).toThrow();
      expect(() => markOrderAsReceived({ status: 'rejected' })).toThrow();
      expect(markOrderAsReceived({ status: 'accepted' }).status).toBe('received');
    });

    it('debe crear un registro de ProductUpdate al recibir el pedido', () => {
      const createProductUpdate = (
        productId: number,
        orderId: number,
        quantity: number,
        purchasePrice: number
      ) => {
        return {
          productId,
          type: 'stock_add',
          message: `Stock actualizado con el pedido #${orderId}, ${quantity} unidades recibidas. Precio de compra $${purchasePrice}`,
          date: new Date(),
        };
      };

      const update = createProductUpdate(5, 1, 50, 10000);
      
      expect(update.type).toBe('stock_add');
      expect(update.productId).toBe(5);
      expect(update.message).toContain('#1');
      expect(update.message).toContain('50 unidades');
      expect(update.message).toContain('$10000');
    });

    it('debe validar que el batch existe antes de transferirlo', () => {
      const validateBatchExists = (batch: { id: number } | null) => {
        if (!batch) {
          throw new Error('No se encontró un lote asociado a la orden');
        }
        return true;
      };

      expect(() => validateBatchExists(null)).toThrow();
      expect(validateBatchExists({ id: 1 })).toBe(true);
    });

    it('debe validar que el inventario de la tienda existe', () => {
      const validateInventoryExists = (inventory: { id: number } | null | undefined) => {
        if (!inventory) {
          throw new Error('No se encontró inventario para la tienda actual');
        }
        return true;
      };

      expect(() => validateInventoryExists(null)).toThrow();
      expect(() => validateInventoryExists(undefined)).toThrow();
      expect(validateInventoryExists({ id: 20 })).toBe(true);
    });
  });

  describe('Cálculo de stock después de recibir pedido', () => {
    it('debe calcular correctamente el stock total después de recibir un pedido', () => {
      const existingBatches = [
        { id: 1, quantity: 20, expired: false },
        { id: 2, quantity: 15, expired: false },
      ];

      const newBatch = { id: 3, quantity: 50, expired: false };

      const calculateTotalStock = (batches: typeof existingBatches) => {
        return batches
          .filter((b) => !b.expired)
          .reduce((sum, b) => sum + b.quantity, 0);
      };

      const stockBefore = calculateTotalStock(existingBatches);
      expect(stockBefore).toBe(35);

      const stockAfter = calculateTotalStock([...existingBatches, newBatch]);
      expect(stockAfter).toBe(85);
    });
  });
});
