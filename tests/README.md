# Estrategia de Testing - StockMind

Este directorio contiene todas las pruebas automatizadas del proyecto StockMind, organizadas según la estrategia definida para cada Historia de Usuario (H.U).

## Estructura

```
tests/
├── setup.ts              # Configuración global de pruebas (mocks, etc.)
├── unit/                 # Pruebas unitarias
│   ├── hu10-register-users.test.tsx
│   ├── hu12-reduce-stock-expiration.test.ts
│   ├── hu13-crud-products.test.tsx
│   └── hu16-confirm-delivery.test.ts
├── integration/          # Pruebas de integración
│   ├── hu9-order-history.test.ts
│   ├── hu11-register-stores.test.ts
│   ├── hu12-expiration-stock.test.ts
│   ├── hu14-send-orders.test.ts
│   └── hu15-accept-reject-orders.test.ts
└── e2e/                  # Pruebas end-to-end
    ├── hu9-order-history.spec.ts
    ├── hu10-register-users.spec.ts
    ├── hu11-register-stores.spec.ts
    ├── hu13-crud-products.spec.ts
    ├── hu14-send-orders.spec.ts
    ├── hu15-accept-reject-orders.spec.ts
    └── hu16-confirm-delivery.spec.ts
```

## Estrategia por Historia de Usuario

### H.U 9 – Consultar historial de pedidos
- **E2E**: `tests/e2e/hu9-order-history.spec.ts`
- **Integración**: `tests/integration/hu9-order-history.test.ts`
- **Justificación**: Necesita probar que se muestren correctamente los pedidos y sus datos, así como la comunicación con el backend.

### H.U 10 – Registrar nuevos usuarios (encargados)
- **E2E**: `tests/e2e/hu10-register-users.spec.ts`
- **Unitarias**: `tests/unit/hu10-register-users.test.tsx`
- **Justificación**: Se valida el flujo completo de registro (formulario) y las funciones de validación del formulario individualmente.

### H.U 11 – Registrar nuevas tiendas
- **E2E**: `tests/e2e/hu11-register-stores.spec.ts`
- **Integración**: `tests/integration/hu11-register-stores.test.ts`
- **Justificación**: Es un flujo de creación de entidad; requiere comprobar formulario + persistencia.

### H.U 12 – Reducir stock por vencimiento
- **Unitarias**: `tests/unit/hu12-reduce-stock-expiration.test.ts`
- **Integración**: `tests/integration/hu12-expiration-stock.test.ts`
- **Justificación**: Es una lógica interna del backend o cron job; se valida la función que calcula vencimientos y reduce stock.

### H.U 13 – CRUD productos de distribuidora
- **E2E**: `tests/e2e/hu13-crud-products.spec.ts`
- **Unitarias**: `tests/unit/hu13-crud-products.test.tsx`
- **Justificación**: Flujos CRUD deben probar creación, edición, eliminación desde la UI y la función del servicio.

### H.U 14 – Enviar pedidos a distribuidora
- **E2E**: `tests/e2e/hu14-send-orders.spec.ts`
- **Integración**: `tests/integration/hu14-send-orders.test.ts`
- **Justificación**: Se prueba envío de pedido completo y que el backend lo registre correctamente.

### H.U 15 – Aceptar o rechazar pedidos
- **E2E**: `tests/e2e/hu15-accept-reject-orders.spec.ts`
- **Integración**: `tests/integration/hu15-accept-reject-orders.test.ts`
- **Justificación**: El preventista debe poder cambiar estado y ver actualización inmediata.

### H.U 16 – Confirmar llegada de envío
- **E2E**: `tests/e2e/hu16-confirm-delivery.spec.ts`
- **Unitarias**: `tests/unit/hu16-confirm-delivery.test.ts`
- **Justificación**: El encargado debe confirmar entrega y actualizar inventario; se prueba la función que actualiza el stock.

## Ejecutar Pruebas

### Pruebas Unitarias e Integración (Vitest)

```bash
# Todas las pruebas
npm run test

# Con interfaz UI
npm run test:ui

# Con cobertura
npm run test:coverage
```

### Pruebas E2E (Playwright)

```bash
# Todas las pruebas E2E
npm run test:e2e

# Con interfaz UI
npm run test:e2e:ui
```

### Todas las pruebas

```bash
npm run test:all
```

## Notas Importantes

1. **Autenticación en E2E**: Las pruebas E2E asumen que el usuario está autenticado. En un entorno real, deberías agregar un helper para login antes de cada prueba.

2. **Base de Datos de Prueba**: Las pruebas de integración usan mocks de fetch. Para pruebas reales con base de datos, considera usar una BD de prueba y resetearla entre pruebas.

3. **Variables de Entorno**: Asegúrate de tener configuradas las variables de entorno necesarias para las pruebas.

4. **Dependencias**: Algunas pruebas requieren:
   - `@vitejs/plugin-react` para pruebas de componentes React
   - Base de datos configurada para pruebas de integración reales

## Mejoras Futuras

- [ ] Agregar helpers de autenticación para E2E
- [ ] Configurar base de datos de prueba para integración
- [ ] Agregar más casos edge en las pruebas unitarias
- [ ] Implementar fixtures para datos de prueba
- [ ] Agregar pruebas de performance donde sea relevante
