# [StockMind - App Desplegada](http://34.29.53.93)

## Descripción

**StockMind** es una aplicación de manejo de inventario inteligente desarrollada con **Next.js**, diseñada para ayudar a distribuidores, preventistas y gestores de inventario a controlar y optimizar sus productos de manera eficiente.

La aplicación permite:

* Gestión de inventario por usuario.
* Registro de productos y categorías.
* Actualización y eliminación de productos.
* Visualización de inventarios de manera clara y organizada.

---

## Tecnologías

* **Frontend y Backend:** Next.js 15.x
* **Base de datos:** PostgreSQL (Supabase)
* **ORM:** Prisma
* **Autenticación:** NextAuth
* **Estilo:** CSS personalizado y componentes reutilizables
* **Despliegue:** Servidor propio / Docker

---

## Instalación y ejecución

1. **Clonar el repositorio**

```bash
git clone <TU_REPOSITORIO_URL>
cd stockmind
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz con tus credenciales de base de datos, auth y otros secretos. Ejemplo mínimo:

```env
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/base
NEXTAUTH_SECRET=algún_valor_secreto
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Migrar base de datos**

```bash
npx prisma migrate dev --name init
```

5. **Ejecutar la aplicación en modo desarrollo**

```bash
npx prisma generate
npm run dev
```

Accede a la app en [http://localhost:3000](http://localhost:3000)

6. **Construir para producción**

```bash
npm run build
npm start
```

---

## Despliegue

La aplicación ya está desplegada en:
[http://34.29.53.93](http://34.29.53.93)

---

## Contribución

Si deseas contribuir:

1. Haz un fork del repositorio.
2. Crea una rama nueva (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit.
4. Envía un pull request describiendo tus cambios.
