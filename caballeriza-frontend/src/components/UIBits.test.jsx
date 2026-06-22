import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner, EmptyState, PageHeader, Badge } from './UIBits'

describe('Spinner', () => {
  it('muestra el texto por defecto', () => {
    render(<Spinner />)
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('muestra una etiqueta personalizada', () => {
    render(<Spinner label="Guardando caballo..." />)
    expect(screen.getByText('Guardando caballo...')).toBeInTheDocument()
  })
})

describe('EmptyState', () => {
  it('muestra el mensaje por defecto cuando no hay registros', () => {
    render(<EmptyState />)
    expect(screen.getByText('No hay registros todavía.')).toBeInTheDocument()
  })

  it('muestra un mensaje personalizado', () => {
    render(<EmptyState label="No hay caballos registrados" />)
    expect(screen.getByText('No hay caballos registrados')).toBeInTheDocument()
  })
})

describe('PageHeader', () => {
  it('renderiza título, subtítulo y acción', () => {
    render(<PageHeader title="Caballos" subtitle="Gestión de la caballeriza" action={<button>Nuevo</button>} />)
    expect(screen.getByText('Caballos')).toBeInTheDocument()
    expect(screen.getByText('Gestión de la caballeriza')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nuevo' })).toBeInTheDocument()
  })

  it('no renderiza el subtítulo si no se proporciona', () => {
    render(<PageHeader title="Empleados" />)
    expect(screen.getByText('Empleados')).toBeInTheDocument()
    expect(screen.queryByText('Gestión de la caballeriza')).not.toBeInTheDocument()
  })
})

describe('Badge', () => {
  it('aplica el tono verde por defecto', () => {
    render(<Badge>Activo</Badge>)
    expect(screen.getByText('Activo')).toHaveClass('badge-green')
  })

  it('aplica el tono solicitado (rojo) para stock bajo', () => {
    render(<Badge tone="red">Stock bajo</Badge>)
    expect(screen.getByText('Stock bajo')).toHaveClass('badge-red')
  })

  it('usa verde como respaldo ante un tono desconocido', () => {
    render(<Badge tone="azul">Desconocido</Badge>)
    expect(screen.getByText('Desconocido')).toHaveClass('badge-green')
  })
})
