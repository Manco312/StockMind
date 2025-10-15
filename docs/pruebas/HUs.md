## Pruebas Automáticas de Software

Este documento describe la estrategia de pruebas automáticas para las Historias de Usuario seleccionadas. Todas las funcionalidades entregadas estarán cubiertas por al menos una prueba automática y se ejecutarán en cada Pull Request.

### HU9 – Consultar historial de pedidos por tienda (Preventista)

| Funcionalidad                                             | Tipo de Prueba                                                                                                                     | Justificación                                                                                                            |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Listar pedidos de una tienda con filtros (texto y fechas) | Unitarias: parsing/validación de parámetros. Integración: GET `/api/stores/[storeId]/orders`. E2E: flujo de navegación y filtrado. | Asegura reglas puras de filtrado (unit), contrato API/BD estable (integración) y experiencia completa del usuario (E2E). |

Código base: `src/app/api/stores/[storeId]/orders/route.ts`, `src/app/dashboard/tiendas/[storeId]/pedidos/page.tsx`, `StoreOrdersClient.tsx`. Modelos: `Order`, `Product`, `InventoryManager`.

### HU10 – Registrar encargados de inventario (Preventista)

| Funcionalidad                                              | Tipo de Prueba                                                                                                                                                                           | Justificación                                                                                                     |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Registro de usuario con rol de encargado asociado a tienda | Unitarias: validaciones de email/contraseña/teléfono y tiendas disponibles. Integración: POST `/api/users/register-inventory-manager`. E2E: registro desde UI y login del nuevo usuario. | Valida reglas de entrada (unit), efectos en BD y transacciones (integración) y el flujo crítico de negocio (E2E). |

Código base: `components/RegisterInventoryManagerForm.tsx`, `src/app/dashboard/tiendas/register-manager/page.tsx`, `src/app/api/users/register-inventory-manager/route.ts`. Modelos: `User`, `InventoryManager`, `Store`, `Inventory`.

### HU11 – Registrar nuevas tiendas (Preventista)

| Funcionalidad                       | Tipo de Prueba                                                                                                                                                      | Justificación                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Crear tienda aliada y su inventario | Unitarias: validación de campos requeridos. Integración: POST `/api/stores` crea tienda e inventario en transacción. E2E: alta desde UI y visualización en listado. | Valida reglas de negocio (unit), consistencia transaccional (integración) y resultado visible (E2E). |

Código base: `src/app/dashboard/tiendas/add/page.tsx`, `AddStoreForm.tsx`, `src/app/api/stores/route.ts`. Modelos: `Store`, `Inventory`.

### HU12 – Reducción automática de stock por vencimiento (Encargado)

| Funcionalidad                                      | Tipo de Prueba                                                                                                                                                                                                 | Justificación                                                                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Reducir stock de `Batch` vencidos y generar alerta | Unitarias: determinación de vencidos y cantidad a reducir. Integración: job/endpoint que actualiza `Batch.quantity` y crea `alerts`. E2E: datos vencidos → ejecutar job → reflejo en UI de alertas/inventario. | Reglas determinísticas (unit), efectos persistentes (integración) y verificación end-to-end del impacto (E2E). |

Código propuesto: tarea programada (cron) o endpoint protegido. Modelos: `Batch`, `Product`, `alerts`.

### HU13 – CRUD de productos (Preventista)

| Funcionalidad                                             | Tipo de Prueba                                                                                                                                                                                             | Justificación                                                                                            |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Crear/leer/actualizar/eliminar productos de distribuidora | Unitarias: validación de payload (título, precio, disponibilidad). Integración: PUT/DELETE en `/api/inventory/[inventoryId]/distributor-products/[productId]`. E2E: edición desde UI y reflejo en listado. | Asegura calidad de entradas (unit), contrato con BD (integración) y flujo administrativo completo (E2E). |

Código base: `src/app/inventory/distributor/page.tsx`, `src/app/api/inventory/[inventoryId]/distributor-products/[productId]/route.ts`. Modelos: `Product`, `Inventory`.

### HU14 – Enviar pedidos desde tienda (Encargado)

| Funcionalidad                             | Tipo de Prueba                                                                                                                                                                                            | Justificación                                                                             |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Crear pedido `Order` asociado a la tienda | Unitarias: reglas de cantidad mínima/validaciones. Integración: POST `/api/orders` o `/api/stores/[storeId]/orders` crea `Order` con `PENDING`. E2E: envío desde UI y visualización en panel preventista. | Reglas de negocio (unit), persistencia/relaciones (integración) y experiencia real (E2E). |

Código propuesto: endpoint para creación; UI en módulo de órdenes. Modelos: `Order`, `InventoryManager`, `Product`.

### HU15 – Aceptar/rechazar pedidos (Preventista)

| Funcionalidad                                                         | Tipo de Prueba                                                                                                                                                                               | Justificación                                                                                |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Cambiar `Order.status` (APPROVED/REJECTED/SENT/COMPLETED) y notificar | Unitarias: máquina de estados y transiciones válidas. Integración: PATCH `/api/orders/[orderId]` actualiza estado y crea `notifications`. E2E: decisión desde UI y reflejo para ambos roles. | Control de estado (unit), efectos y notificación (integración) y validación funcional (E2E). |

Código propuesto: endpoint de actualización y UI en panel preventista. Modelos: `Order`, `notifications`.

### HU16 – Confirmar llegada de envío (Encargado)

| Funcionalidad                     | Tipo de Prueba                                                                                                                                                                                                | Justificación                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Confirmar entrega y cerrar pedido | Unitarias: transición `SENT → COMPLETED`. Integración: POST `/api/orders/[orderId]/confirm-delivery` y actualización en BD; notificación al preventista. E2E: confirmación desde UI y ver estado actualizado. | Asegura reglas de transición (unit), persistencia (integración) y cierre completo del flujo (E2E). |

Código propuesto: endpoint de confirmación; UI en panel de tienda. Modelos: `Order`, `Batch` (si hay movimiento de lote), `notifications`.

---

## Extras (prácticas recomendadas)

- Corregir los elementos detectados por herramientas de análisis estático (ESLint, TypeScript).
- Ejecutar las pruebas en cada Pull Request y bloquear la fusión si fallan.
- Llevar control de cobertura de código (umbral inicial recomendado: 60–70%) y elevarlo progresivamente.

### Ejecución en CI

El workflow de GitHub Actions (ver `.github/workflows/ci.yml`) ejecuta:

1. Instalación con `npm ci`
2. Lint con `npm run lint`
3. Build con `npm run build`
4. Tests con `npm test` y cobertura

Si cualquier paso falla, el PR queda en rojo y no debe fusionarse.
