import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'
import { AuthProvider } from '../context/AuthContext'
import { authApi } from '../api/services'

vi.mock('../api/services', () => ({
  authApi: {
    login: vi.fn(),
  },
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderLogin() {
  render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNavigate.mockClear()
    authApi.login.mockReset()
  })

  it('muestra errores de validación si se envía el formulario vacío', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByText('El correo es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument()
    expect(authApi.login).not.toHaveBeenCalled()
  })

  it('inicia sesión y navega al dashboard con credenciales correctas', async () => {
    authApi.login.mockResolvedValue({
      data: {
        success: true,
        message: 'OK',
        data: { id: 1, email: 'admin@caballeriza.com', nombre: 'Admin', role: 'ADMIN', token: 'jwt-abc' },
      },
    })
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'admin@caballeriza.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'secreta123')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
    expect(authApi.login).toHaveBeenCalledWith({ email: 'admin@caballeriza.com', password: 'secreta123' })
    expect(localStorage.getItem('token')).toBe('jwt-abc')
  })

  it('no navega cuando las credenciales son inválidas', async () => {
    authApi.login.mockRejectedValue({ response: { data: { message: 'Credenciales inválidas' } } })
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText('correo@ejemplo.com'), 'malo@caballeriza.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'incorrecta')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    await waitFor(() => expect(authApi.login).toHaveBeenCalled())
    expect(mockNavigate).not.toHaveBeenCalled()
    expect(localStorage.getItem('token')).toBeNull()
  })
})
