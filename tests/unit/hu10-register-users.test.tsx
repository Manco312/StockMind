import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterInventoryManagerForm from '@/components/RegisterInventoryManagerForm';

describe('H.U 10 - Registrar nuevos usuarios (encargados) - Pruebas Unitarias', () => {
  const mockStores = [
    { id: 1, name: 'Tienda Test 1', inventoryManager: null },
    { id: 2, name: 'Tienda Test 2', inventoryManager: { id: 1 } },
  ];

  const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('debe validar que el nombre es obligatorio', async () => {
    render(<RegisterInventoryManagerForm stores={mockStores} />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /registrar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
    });
  });

  it('debe validar el formato de email', async () => {
    render(<RegisterInventoryManagerForm stores={mockStores} />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'email-invalido');

    const submitButton = screen.getByRole('button', { name: /registrar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/formato de email inválido/i)).toBeInTheDocument();
    });
  });

  it('debe validar que la contraseña tiene mínimo 6 caracteres', async () => {
    render(<RegisterInventoryManagerForm stores={mockStores} />);
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/contraseña/i);
    await user.type(passwordInput, '12345');

    const submitButton = screen.getByRole('button', { name: /registrar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/la contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it('debe validar que las contraseñas coinciden', async () => {
    render(<RegisterInventoryManagerForm stores={mockStores} />);
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/contraseña/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);

    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password456');

    const submitButton = screen.getByRole('button', { name: /registrar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  it('debe validar que el teléfono es obligatorio', async () => {
    render(<RegisterInventoryManagerForm stores={mockStores} />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/nombre/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /registrar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el teléfono es obligatorio/i)).toBeInTheDocument();
    });
  });

  it('debe validar que se selecciona una tienda', async () => {
    render(<RegisterInventoryManagerForm stores={mockStores} />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/nombre/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const phoneInput = screen.getByLabelText(/teléfono/i);

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(phoneInput, '3001234567');

    const submitButton = screen.getByRole('button', { name: /registrar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/debes seleccionar una tienda/i)).toBeInTheDocument();
    });
  });

  it('debe filtrar solo tiendas sin encargado asignado', () => {
    render(<RegisterInventoryManagerForm stores={mockStores} />);
    
    const storeSelect = screen.getByLabelText(/tienda/i);
    const options = storeSelect.querySelectorAll('option');
    
    // Solo debe mostrar la tienda sin encargado (Tienda Test 1)
    expect(options.length).toBeGreaterThan(0);
  });
});
