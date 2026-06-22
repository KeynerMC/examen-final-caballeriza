import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { PawPrint, Mail, Lock, User } from 'lucide-react'
import { authApi } from '../api/services'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authApi.register(data)
      login(res.data)
      toast.success('¡Cuenta creada con éxito!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-tierra-50 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-salvia-50 via-tierra-50 to-crema-100 opacity-70" />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-salvia-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-tierra-200/40 blur-3xl" />

      <div className="w-full max-w-md relative page-enter">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-salvia-400 to-salvia-600 text-crema-100 shadow-lg mb-3">
            <PawPrint className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-tierra-800 tracking-tight">Crear cuenta</h1>
          <p className="text-tierra-400 text-sm mt-1">Unite a la caballeriza</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-salvia-400 via-tierra-400 to-salvia-400" />
          <div>
            <label className="label">Nombre completo</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-tierra-300" />
              <input className="input pl-9" placeholder="Tu nombre" {...register('nombre', { required: 'El nombre es obligatorio' })} />
            </div>
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="label">Correo electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-tierra-300" />
              <input type="email" className="input pl-9" placeholder="correo@ejemplo.com" {...register('email', { required: 'El correo es obligatorio' })} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-tierra-300" />
              <input type="password" className="input pl-9" placeholder="Mínimo 6 caracteres"
                {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="label">Tipo de cuenta</label>
            <select className="input" {...register('role')} defaultValue="CLIENTE">
              <option value="CLIENTE">Cliente</option>
              <option value="CUIDADOR">Cuidador</option>
              <option value="VETERINARIO">Veterinario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-secondary w-full justify-center flex">
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="text-center text-sm text-tierra-400 mt-4">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-tierra-600 font-medium hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
