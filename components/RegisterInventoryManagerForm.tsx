"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Store {
  id: number;
  name: string;
  address: string;
  neighborhood: string;
  inventoryManager?: any;
}

interface RegisterInventoryManagerFormProps {
  stores: Store[];
}

export default function RegisterInventoryManagerForm({
  stores,
}: RegisterInventoryManagerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Estados del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    storeId: "",
  });

  // Estados de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtrar tiendas que no tienen encargado de inventario
  const availableStores = stores.filter((store) => !store.inventoryManager);

  // Validaciones en tiempo real
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "El nombre es obligatorio";
        } else if (value.trim().length < 2) {
          newErrors.name = "El nombre debe tener al menos 2 caracteres";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = "El email es obligatorio";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Formato de email inválido";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "La contraseña es obligatoria";
        } else if (value.length < 6) {
          newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        } else {
          delete newErrors.password;
        }
        // Revalidar confirmación si ya existe
        if (formData.confirmPassword && formData.confirmPassword !== value) {
          newErrors.confirmPassword = "Las contraseñas no coinciden";
        } else if (
          formData.confirmPassword &&
          formData.confirmPassword === value
        ) {
          delete newErrors.confirmPassword;
        }
        break;

      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Confirma la contraseña";
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Las contraseñas no coinciden";
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case "phone":
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!value.trim()) {
          newErrors.phone = "El teléfono es obligatorio";
        } else if (
          !phoneRegex.test(value) ||
          value.replace(/\D/g, "").length < 7
        ) {
          newErrors.phone = "Formato de teléfono inválido";
        } else {
          delete newErrors.phone;
        }
        break;

      case "storeId":
        if (!value) {
          newErrors.storeId = "Debes seleccionar una tienda";
        } else {
          delete newErrors.storeId;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validar todos los campos
    const fieldsToValidate = [
      "name",
      "email",
      "password",
      "confirmPassword",
      "phone",
      "storeId",
    ];
    fieldsToValidate.forEach((field) => {
      validateField(field, formData[field as keyof typeof formData]);
    });

    // Verificar si hay errores
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      setError("Por favor corrige los errores en el formulario");
      return;
    }

    // Verificar que no hay tiendas disponibles
    if (availableStores.length === 0) {
      setError("No hay tiendas disponibles sin encargado de inventario");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/register-inventory-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          phone: formData.phone.trim(),
          storeId: parseInt(formData.storeId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar el usuario");
      }

      setSuccess("¡Encargado de inventario registrado exitosamente!");

      // Limpiar formulario
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        storeId: "",
      });
      setErrors({});

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/dashboard/tiendas");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al registrar el usuario"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Registrar Encargado de Inventario
          </h2>
          <p className="text-gray-600">
            Completa los datos para registrar un nuevo encargado de inventario y
            asignarlo a una tienda.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        {availableStores.length === 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-yellow-700">
                No hay tiendas disponibles sin encargado de inventario.
                <a href="/dashboard/tiendas/add" className="underline ml-1">
                  Registra una nueva tienda
                </a>
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre Completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: Juan Pérez"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: juan@tienda.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Teléfono *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: 3001234567"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Mínimo 6 caracteres"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Repite la contraseña"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Tienda */}
          <div>
            <label
              htmlFor="storeId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tienda Asignada *
            </label>
            <select
              id="storeId"
              name="storeId"
              value={formData.storeId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.storeId ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isSubmitting || availableStores.length === 0}
            >
              <option value="">Selecciona una tienda</option>
              {availableStores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} - {store.address}, {store.neighborhood}
                </option>
              ))}
            </select>
            {errors.storeId && (
              <p className="mt-1 text-sm text-red-600">{errors.storeId}</p>
            )}
            {availableStores.length > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {availableStores.length} tienda(s) disponible(s) sin encargado
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/tiendas")}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isSubmitting || availableStores.length === 0}
            >
              {isSubmitting ? "Registrando..." : "Registrar Encargado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
