import { describe, it, expect } from "vitest";

// Validadores simples replicados del formulario (HU10)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]+$/;

function validateEmail(email: string) {
  return emailRegex.test(email.trim());
}

function validatePassword(pw: string) {
  return pw.length >= 6;
}

function validatePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return phoneRegex.test(phone) && digits.length >= 7;
}

describe("HU10 - Validaciones de registro de encargado", () => {
  it("email válido", () => {
    expect(validateEmail("a@b.com")).toBe(true);
    expect(validateEmail("mal")).toBe(false);
  });

  it("password con longitud mínima", () => {
    expect(validatePassword("123456")).toBe(true);
    expect(validatePassword("123")).toBe(false);
  });

  it("teléfono válido", () => {
    expect(validatePhone("3001234567")).toBe(true);
    expect(validatePhone("abc")).toBe(false);
  });
});

// HU9 - construcción de filtros básicos (unit test de lógica)
function buildWhereClause(
  storeId: number,
  q?: string,
  from?: string,
  to?: string
) {
  const where: any = { inventoryManager: { storeId } };
  if (q) where.product = { title: { contains: q, mode: "insensitive" } };
  if (from)
    where.createdAt = { ...(where.createdAt || {}), gte: new Date(from) };
  if (to) where.createdAt = { ...(where.createdAt || {}), lte: new Date(to) };
  return where;
}

describe("HU9 - Construcción de filtros", () => {
  it("agrega filtro por texto y rango de fechas", () => {
    const where = buildWhereClause(1, "pan", "2025-01-01", "2025-01-31");
    expect(where.inventoryManager.storeId).toBe(1);
    expect(where.product.title.contains).toBe("pan");
    expect(where.createdAt.gte instanceof Date).toBe(true);
    expect(where.createdAt.lte instanceof Date).toBe(true);
  });
});
