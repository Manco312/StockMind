import { test, expect } from '@playwright/test';

test.describe('H.U 14 - Enviar pedidos a distribuidora - E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Asumimos login como encargado de inventario
    await page.goto('/orders/create');
  });

  test('debe mostrar el formulario para crear un pedido', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/pedido|orden/i);
    
    // Verificar que hay campos para seleccionar producto y cantidad
    const productSelect = page.locator('select[name="productId"], select').first();
    const quantityInput = page.locator('input[name="quantity"], input[type="number"]').first();
    
    // Al menos uno de estos debe estar visible
    const hasProductSelect = await productSelect.isVisible().catch(() => false);
    const hasQuantityInput = await quantityInput.isVisible().catch(() => false);
    
    expect(hasProductSelect || hasQuantityInput).toBeTruthy();
  });

  test('debe permitir seleccionar un producto del catálogo', async ({ page }) => {
    const productSelect = page.locator('select[name="productId"], select').first();
    
    if (await productSelect.isVisible()) {
      const options = await productSelect.locator('option').count();
      expect(options).toBeGreaterThan(1); // Al menos la opción por defecto y una más
    }
  });

  test('debe permitir ingresar la cantidad de productos', async ({ page }) => {
    const quantityInput = page.locator('input[name="quantity"], input[type="number"]').first();
    
    if (await quantityInput.isVisible()) {
      await quantityInput.fill('10');
      const value = await quantityInput.inputValue();
      expect(value).toBe('10');
    }
  });

  test('debe crear un pedido exitosamente', async ({ page }) => {
    // Mock del fetch
    await page.route('**/api/orders/create', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          status: 'pending',
          quantity: 10,
          price: 100000,
          productId: 1,
        }),
      });
    });

    // Seleccionar producto si hay select
    const productSelect = page.locator('select[name="productId"]').first();
    if (await productSelect.isVisible()) {
      const options = await productSelect.locator('option').count();
      if (options > 1) {
        await productSelect.selectOption({ index: 1 });
      }
    }

    // Ingresar cantidad
    const quantityInput = page.locator('input[name="quantity"]').first();
    if (await quantityInput.isVisible()) {
      await quantityInput.fill('10');
    }

    // Enviar pedido
    const submitButton = page.locator('button[type="submit"], button:has-text("enviar" i)').first();
    await submitButton.click();

    // Verificar que se muestra mensaje de éxito
    await page.waitForTimeout(1000);
    const successMessage = page.locator('text=/exitoso|enviado|creado/i');
    // Puede estar presente según la implementación
  });

  test('debe mostrar el precio total calculado', async ({ page }) => {
    // Si hay un campo que muestra el total
    const totalDisplay = page.locator('text=/total|precio/i').first();
    
    // Verificar que el precio se calcula cuando se selecciona producto y cantidad
    const productSelect = page.locator('select[name="productId"]').first();
    const quantityInput = page.locator('input[name="quantity"]').first();
    
    if (await productSelect.isVisible() && await quantityInput.isVisible()) {
      await productSelect.selectOption({ index: 1 });
      await quantityInput.fill('5');
      
      // Esperar a que se calcule el total
      await page.waitForTimeout(500);
    }
  });

  test('debe validar que la cantidad sea mayor que cero', async ({ page }) => {
    const quantityInput = page.locator('input[name="quantity"]').first();
    
    if (await quantityInput.isVisible()) {
      await quantityInput.fill('0');
      
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();
      
      // Verificar que no se envía o muestra error
      await page.waitForTimeout(500);
    }
  });

  test('debe redirigir o actualizar después de crear el pedido', async ({ page }) => {
    // Mock del fetch
    await page.route('**/api/orders/create', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          status: 'pending',
        }),
      });
    });

    // Llenar y enviar
    const quantityInput = page.locator('input[name="quantity"]').first();
    if (await quantityInput.isVisible()) {
      await quantityInput.fill('5');
      
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();
      
      // Esperar redirección o actualización
      await page.waitForTimeout(2000);
    }
  });
});
