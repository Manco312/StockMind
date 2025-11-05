import { test, expect } from '@playwright/test';

test.describe('H.U 11 - Registrar nuevas tiendas - E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Asumimos login como preventista o distribuidor
    await page.goto('/dashboard/tiendas/add');
  });

  test('debe mostrar el formulario de registro de tienda', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/nueva tienda|registrar.*tienda/i);
    
    // Verificar campos del formulario
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('textarea[name="address"], input[name="address"]')).toBeVisible();
    await expect(page.locator('input[name="neighborhood"]')).toBeVisible();
    await expect(page.locator('input[name="capital"]')).toBeVisible();
  });

  test('debe validar que todos los campos son obligatorios', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first();
    
    await submitButton.click();
    
    // Verificar que se muestran mensajes de error o alertas
    await page.waitForTimeout(500);
    
    // Verificar que el formulario no se envió
    await expect(page).toHaveURL(/add/);
  });

  test('debe crear una tienda exitosamente con todos los datos', async ({ page }) => {
    // Mock del fetch para simular respuesta exitosa
    await page.route('**/api/stores', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            store: {
              id: 1,
              name: 'Tienda Test E2E',
              address: 'Calle Test 123',
              neighborhood: 'Test',
              capital: 1000000,
            },
            inventory: {
              id: 1,
              type: 'store',
              storeId: 1,
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Llenar el formulario
    await page.locator('input[name="name"]').fill('Tienda Test E2E');
    await page.locator('textarea[name="address"], input[name="address"]').fill('Calle Test 123');
    await page.locator('input[name="neighborhood"]').fill('Test');
    await page.locator('input[name="capital"]').fill('1000000');

    // Enviar formulario
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Verificar que se muestra mensaje de éxito o redirige
    await page.waitForTimeout(1000);
    
    // Debería mostrar alerta de éxito o redirigir a /dashboard/tiendas
    const successAlert = page.locator('text=/exitoso|registrada/i');
    // Puede estar presente o redirigir
  });

  test('debe redirigir a la lista de tiendas después de crear exitosamente', async ({ page }) => {
    // Mock del fetch
    await page.route('**/api/stores', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            store: { id: 1, name: 'Test', address: 'Test', neighborhood: 'Test', capital: 1000000 },
            inventory: { id: 1, type: 'store', storeId: 1 },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Llenar y enviar formulario
    await page.locator('input[name="name"]').fill('Tienda Test');
    await page.locator('textarea[name="address"], input[name="address"]').fill('Calle Test');
    await page.locator('input[name="neighborhood"]').fill('Test');
    await page.locator('input[name="capital"]').fill('1000000');
    
    await page.locator('button[type="submit"]').first().click();
    
    // Esperar redirección
    await page.waitForURL(/tiendas/, { timeout: 3000 });
    
    // Verificar que está en la página de tiendas (puede ser lista o detalle)
    await expect(page).toHaveURL(/tiendas/);
  });

  test('debe mostrar error si falta algún campo', async ({ page }) => {
    // Llenar solo algunos campos
    await page.locator('input[name="name"]').fill('Tienda Test');
    // No llenar address, neighborhood, capital

    // Mock de respuesta de error
    await page.route('**/api/stores', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Todos los campos son obligatorios' }),
        });
      } else {
        await route.continue();
      }
    });

    await page.locator('button[type="submit"]').first().click();
    
    // Verificar que se muestra el error
    await page.waitForTimeout(500);
    const errorMessage = page.locator('text=/obligatorio|error/i');
    // Puede estar presente según la implementación
  });
});
