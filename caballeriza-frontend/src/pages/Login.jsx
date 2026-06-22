import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, Lock } from 'lucide-react'
import { authApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { CaballoCorriendo } from '../animacion'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authApi.login(data)
      login(res.data)
      toast.success('¡Bienvenido de nuevo!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-tierra-50 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-crema-100 via-tierra-50 to-salvia-50 opacity-70" />
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-tierra-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-salvia-200/40 blur-3xl" />

      <div className="w-full max-w-md relative page-enter">
        <div className="text-center mb-8">
          <div className="w-64 h-44 mx-auto rounded-2xl overflow-hidden shadow-lg ring-1 ring-tierra-200 mb-4">
            <CaballoCorriendo />
          </div>
          <h1 className="font-serif text-3xl font-bold text-tierra-800 tracking-tight">Caballeriza</h1>
          <p className="text-tierra-400 text-sm mt-1">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-tierra-400 via-salvia-400 to-tierra-400" />
          <div>
            <label className="label">Correo electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-tierra-300" />
              <input
                type="email"
                className="input pl-9"
                placeholder="correo@ejemplo.com"
                {...register('email', { required: 'El correo es obligatorio' })}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="label">Contraseña</label>
              <Link to="/forgot-password" className="text-xs text-tierra-500 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-tierra-300" />
              <input
                type="password"
                className="input pl-9"
                placeholder="••••••••"
                {...register('password', { required: 'La contraseña es obligatoria' })}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex">
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-sm text-tierra-400 mt-4">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="text-tierra-600 font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
