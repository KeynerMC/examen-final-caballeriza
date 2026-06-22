import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'

function Probe() {
  const { user, loading, login, logout, isAdmin, canManage, isCliente } = useAuth()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.nombre : 'sin-usuario'}</span>
      <span data-testid="isAdmin">{String(isAdmin())}</span>
      <span data-testid="canManage">{String(canManage())}</span>
      <span data-testid="isCliente">{String(isCliente())}</span>
      <button onClick={() => login({ data: { id: 1, email: 'vet@caballeriza.com', nombre: 'Dra. Vega', role: 'VETERINARIO', token: 'token-123' } })}>
        login-vet
      </button>
      <button onClick={() => login({ data: { id: 2, email: 'cliente@caballeriza.com', nombre: 'Juan', role: 'CLIENTE', token: 'token-456' } })}>
        login-cliente
      </button>
      <button onClick={logout}>logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('inicia sin usuario y termina de cargar', async () => {
    render(<AuthProvider><Probe /></AuthProvider>)
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'))
    expect(screen.getByTestId('user')).toHaveTextContent('sin-usuario')
  })

  it('login guarda el usuario en estado y localStorage, y calcula permisos por rol', async () => {
    const user = userEvent.setup()
    render(<AuthProvider><Probe /></AuthProvider>)

    await user.click(screen.getByText('login-vet'))

    expect(screen.getByTestId('user')).toHaveTextContent('Dra. Vega')
    expect(screen.getByTestId('isAdmin')).toHaveTextContent('false')
    expect(screen.getByTestId('canManage')).toHaveTextContent('true')
    expect(localStorage.getItem('token')).toBe('token-123')
    expect(JSON.parse(localStorage.getItem('user')).role).toBe('VETERINARIO')
  })

  it('un cliente no puede gestionar el sistema (canManage = false)', async () => {
    const user = userEvent.setup()
    render(<AuthProvider><Probe /></AuthProvider>)

    await user.click(screen.getByText('login-cliente'))

    expect(screen.getByTestId('isCliente')).toHaveTextContent('true')
    expect(screen.getByTestId('canManage')).toHaveTextContent('false')
  })

  it('logout limpia el estado y el localStorage', async () => {
    const user = userEvent.setup()
    render(<AuthProvider><Probe /></AuthProvider>)

    await user.click(screen.getByText('login-vet'))
    expect(screen.getByTestId('user')).toHaveTextContent('Dra. Vega')

    await user.click(screen.getByText('logout'))

    expect(screen.getByTestId('user')).toHaveTextContent('sin-usuario')
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('recupera la sesión guardada en localStorage al montar', async () => {
    localStorage.setItem('token', 'token-789')
    localStorage.setItem('user', JSON.stringify({ id: 3, nombre: 'Admin Root', role: 'ADMIN' }))

    render(<AuthProvider><Probe /></AuthProvider>)

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'))
    expect(screen.getByTestId('user')).toHaveTextContent('Admin Root')
    expect(screen.getByTestId('isAdmin')).toHaveTextContent('true')
  })
})
