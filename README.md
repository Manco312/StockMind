This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Testing

Este proyecto incluye pruebas automatizadas usando Vitest (unitarias e integración) y Playwright (E2E).

### Pruebas Unitarias e Integración (Vitest)

```bash
# Ejecutar todas las pruebas unitarias e integración
npm run test

# Ejecutar con interfaz UI
npm run test:ui

# Ejecutar con cobertura de código
npm run test:coverage
```

### Pruebas E2E (Playwright)

```bash
# Ejecutar todas las pruebas E2E
npm run test:e2e

# Ejecutar con interfaz UI
npm run test:e2e:ui
```

### Ejecutar todas las pruebas

```bash
npm run test:all
```

### Estructura de Pruebas

Las pruebas están organizadas según la estrategia de testing del proyecto:

- **Pruebas Unitarias** (`tests/unit/`): Validaciones de funciones individuales

  - H.U 10: Validaciones del formulario de registro
  - H.U 12: Lógica de vencimiento de lotes
  - H.U 13: Validaciones CRUD de productos
  - H.U 16: Funciones de actualización de stock

- **Pruebas de Integración** (`tests/integration/`): Comunicación con backend y APIs

  - H.U 9: Historial de pedidos
  - H.U 11: Registro de tiendas
  - H.U 12: Reducción de stock por vencimiento
  - H.U 14: Envío de pedidos
  - H.U 15: Aceptar/rechazar pedidos

- **Pruebas E2E** (`tests/e2e/`): Flujos completos desde la UI
  - H.U 9: Consultar historial de pedidos
  - H.U 10: Registrar nuevos usuarios
  - H.U 11: Registrar nuevas tiendas
  - H.U 13: CRUD de productos
  - H.U 14: Enviar pedidos a distribuidora
  - H.U 15: Aceptar o rechazar pedidos
  - H.U 16: Confirmar llegada de envío

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [the Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
