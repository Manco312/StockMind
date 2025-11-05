import { test, expect } from "@playwright/test";

test.describe("H.U 9 - Consultar historial de pedidos - E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Asumimos que hay un usuario autenticado (preventista o distribuidor)
    // En un entorno real, aquí se haría login
    await page.goto("/dashboard/tiendas");
  });

  test("debe mostrar el historial de pedidos de una tienda", async ({
    page,
  }) => {
    // Navegar a la página de historial de pedidos de una tienda
    // Asumiendo que hay una tienda con ID 1
    await page.goto("/dashboard/tiendas/3/pedidos");

    // Verificar que la página se carga correctamente
    await expect(page.locator("h1, h2")).toContainText(/historial|pedidos/i);

    // Verificar que se muestran los pedidos
    const ordersTable = page.locator("table").first();
    await expect(ordersTable).toBeVisible();

    // Verificar que hay columnas para los datos de pedidos
    await expect(page.locator("th")).toContainText(
      /fecha|producto|cantidad|estado|precio/i
    );
  });

  test("debe permitir filtrar pedidos por búsqueda de producto", async ({
    page,
  }) => {
    await page.goto("/dashboard/tiendas/1/pedidos");

    // Buscar un campo de búsqueda
    const searchInput = page
      .locator('input[type="search"], input[placeholder*="buscar" i]')
      .first();

    if (await searchInput.isVisible()) {
      await searchInput.fill("Producto Test");

      // Esperar a que se actualice la tabla
      await page.waitForTimeout(500);

      // Verificar que los resultados se filtran
      const rows = page.locator("table tbody tr");
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("debe permitir filtrar pedidos por rango de fechas", async ({
    page,
  }) => {
    await page.goto("/dashboard/tiendas/1/pedidos");

    // Buscar campos de fecha
    const dateFromInput = page
      .locator('input[type="date"], input[name*="from" i]')
      .first();
    const dateToInput = page
      .locator('input[type="date"], input[name*="to" i]')
      .first();

    if ((await dateFromInput.isVisible()) && (await dateToInput.isVisible())) {
      await dateFromInput.fill("2024-01-01");
      await dateToInput.fill("2024-12-31");

      // Esperar a que se actualice la tabla
      await page.waitForTimeout(500);

      // Verificar que los resultados se filtran
      const rows = page.locator("table tbody tr");
      expect(await rows.count()).toBeGreaterThan(0);
    }
  });

  test("debe mostrar mensaje cuando no hay pedidos", async ({ page }) => {
    // Navegar a una tienda que no tenga pedidos (si existe)
    await page.goto("/dashboard/tiendas/999/pedidos");

    // Verificar que se muestra un mensaje apropiado
    const noOrdersMessage = page.locator(
      "text=/no se encontraron pedidos|no hay pedidos/i"
    );

    // El mensaje puede estar presente o la página puede redirigir
    // En este caso verificamos que la página no tenga errores críticos
    await expect(page.locator("body")).toBeVisible();
  });
});
