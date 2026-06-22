import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from './Modal'

describe('Modal', () => {
  it('renderiza el título y el contenido', () => {
    render(
      <Modal title="Nuevo caballo" onClose={() => {}}>
        <p>Contenido del formulario</p>
      </Modal>
    )
    expect(screen.getByText('Nuevo caballo')).toBeInTheDocument()
    expect(screen.getByText('Contenido del formulario')).toBeInTheDocument()
  })

  it('llama a onClose al hacer click en el fondo', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Modal title="Editar empleado" onClose={onClose}>
        <p>Formulario</p>
      </Modal>
    )
    await user.click(screen.getByText('Editar empleado').closest('div.fixed'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('no llama a onClose al hacer click dentro del contenido', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Modal title="Editar empleado" onClose={onClose}>
        <p>Formulario</p>
      </Modal>
    )
    await user.click(screen.getByText('Formulario'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('llama a onClose al hacer click en el botón de cerrar', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <Modal title="Reservar paseo" onClose={onClose}>
        <p>Formulario</p>
      </Modal>
    )
    await user.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
