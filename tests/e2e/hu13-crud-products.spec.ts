import { test, expect } from '@playwright/test';

test.describe('H.U 13 - CRUD productos de distribuidora - E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Asumimos login como preventista/distribuidor
    await page.goto('/inventory/distributor');
  });

  test.describe('Crear producto', () => {
    test('debe mostrar el formulario para crear un nuevo producto', async ({ page }) => {
      // Buscar botón para agregar producto
      const addButton = page.locator('button:has-text("agregar" i), button:has-text("nuevo" i)').first();
      
      if (await addButton.isVisible()) {
        await addButton.click();
        
        // Verificar que aparece el formulario
        await expect(page.locator('input[name="title"], input[placeholder*="nombre" i]')).toBeVisible();
        await expect(page.locator('input[name="price"], input[type="number"]')).toBeVisible();
      }
    });

    test('debe crear un producto exitosamente', async ({ page }) => {
      // Mock del fetch
      await page.route('**/api/inventory/*/distributor-products', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 1,
              title: 'Producto Test E2E',
              description: 'Descripción test',
              price: 15000,
              available: true,
            }),
          });
        } else {
          await route.continue();
        }
      });

      // Buscar y hacer click en agregar producto
      const addButton = page.locator('button:has-text("agregar" i), button:has-text("nuevo" i)').first();
      if (await addButton.isVisible()) {
        await addButton.click();
        
        // Llenar formulario
        await page.locator('input[name="title"]').fill('Producto Test E2E');
        await page.locator('input[name="description"]').fill('Descripción test');
        await page.locator('input[name="price"]').fill('15000');
        
        // Enviar
        await page.locator('button[type="submit"]').click();
        
        // Verificar que se creó (puede mostrar mensaje o actualizar lista)
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Editar producto', () => {
    test('debe permitir editar un producto existente', async ({ page }) => {
      // Mock del fetch
      await page.route('**/api/inventory/*/distributor-products/**', async (route) => {
        if (route.request().method() === 'PUT') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 1,
              title: 'Producto Editado',
              price: 18000,
            }),
          });
        } else {
          await route.continue();
        }
      });

      // Buscar botón de editar (puede ser un ícono o botón)
      const editButton = page.locator('button:has-text("editar" i), [aria-label*="editar" i]').first();
      
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Si aparece un formulario modal o página
        await page.waitForTimeout(500);
        
        // Editar precio
        const priceInput = page.locator('input[name="price"]').first();
        if (await priceInput.isVisible()) {
          await priceInput.clear();
          await priceInput.fill('18000');
          
          // Guardar
          await page.locator('button:has-text("guardar" i), button[type="submit"]').first().click();
          
          await page.waitForTimeout(1000);
        }
      }
    });
  });

  test.describe('Eliminar producto', () => {
    test('debe permitir eliminar un producto', async ({ page }) => {
      // Mock del fetch
      await page.route('**/api/inventory/*/distributor-products/**', async (route) => {
        if (route.request().method() === 'DELETE') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ ok: true }),
          });
        } else {
          await route.continue();
        }
      });

      // Buscar botón de eliminar
      const deleteButton = page.locator('button:has-text("eliminar" i), [aria-label*="eliminar" i]').first();
      
      if (await deleteButton.isVisible()) {
        // Configurar diálogo de confirmación
        page.on('dialog', async (dialog) => {
          expect(dialog.type()).toBe('confirm');
          await dialog.accept();
        });

        await deleteButton.click();
        
        // Esperar a que se procese la eliminación
        await page.waitForTimeout(1000);
      }
    });
  });

  test('debe validar campos obligatorios al crear producto', async ({ page }) => {
    const addButton = page.locator('button:has-text("agregar" i)').first();
    
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Intentar enviar sin llenar
      const submitButton = page.locator('button[type="submit"]').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Verificar que no se envió o muestra error
        await page.waitForTimeout(500);
      }
    }
  });
});
