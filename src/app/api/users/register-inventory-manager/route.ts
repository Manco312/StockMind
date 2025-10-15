import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // 1️⃣ Validar sesión
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2️⃣ Verificar que el usuario es preventista o distribuidor
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        salesperson: true,
        inventoryManager: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Solo preventistas y distribuidores pueden registrar encargados de inventario
    const isSalespersonOrDistributor =
      currentUser.salesperson || !currentUser.inventoryManager;
    if (!isSalespersonOrDistributor) {
      return NextResponse.json(
        {
          error:
            "Solo los preventistas pueden registrar encargados de inventario",
        },
        { status: 403 }
      );
    }

    // 3️⃣ Obtener y validar datos del body
    const body = await req.json();
    const { name, email, password, phone, storeId } = body;

    // Validaciones
    if (!name || !email || !password || !phone || !storeId) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // 4️⃣ Verificar que el email no esté en uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 409 }
      );
    }

    // 5️⃣ Verificar que la tienda existe y no tiene encargado
    const store = await prisma.store.findUnique({
      where: { id: parseInt(storeId) },
      include: { inventoryManager: true },
    });

    if (!store) {
      return NextResponse.json(
        { error: "La tienda seleccionada no existe" },
        { status: 404 }
      );
    }

    if (store.inventoryManager) {
      return NextResponse.json(
        { error: "Esta tienda ya tiene un encargado de inventario asignado" },
        { status: 409 }
      );
    }

    // 6️⃣ Crear el usuario y asociarlo a la tienda
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      // Crear el usuario
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
        },
      });

      // Crear el encargado de inventario
      const inventoryManager = await tx.inventoryManager.create({
        data: {
          userId: newUser.id,
          storeId: store.id,
        },
      });

      // Asegurar que la tienda tenga un inventario
      let inventory = await tx.inventory.findUnique({
        where: { storeId: store.id },
      });

      if (!inventory) {
        inventory = await tx.inventory.create({
          data: {
            type: "Store",
            storeId: store.id,
          },
        });
      }

      return { user: newUser, inventoryManager, inventory };
    });

    // 7️⃣ Respuesta exitosa
    return NextResponse.json({
      success: true,
      message: "Encargado de inventario registrado exitosamente",
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone,
        storeId: store.id,
        storeName: store.name,
      },
    });
  } catch (error) {
    console.error("Error registrando encargado de inventario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
