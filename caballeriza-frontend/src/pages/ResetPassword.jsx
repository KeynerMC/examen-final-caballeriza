import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { PawPrint, Lock } from 'lucide-react'
import { authApi } from '../api/services'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authApi.resetPassword({ token, newPassword: data.newPassword })
      toast.success('Contraseña actualizada. Ya podés iniciar sesión.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'El enlace expiró o no es válido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-tierra-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tierra-600 text-crema-100 mb-3">
            <PawPrint className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-tierra-800">Nueva contraseña</h1>
          <p className="text-tierra-400 text-sm mt-1">Elegí una nueva contraseña para tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
          <div>
            <label className="label">Nueva contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-tierra-300" />
              <input
                type="password"
                className="input pl-9"
                placeholder="••••••••"
                {...register('newPassword', {
                  required: 'La contraseña es obligatoria',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                })}
              />
            </div>
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="label">Confirmar contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-tierra-300" />
              <input
                type="password"
                className="input pl-9"
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Confirmá tu contraseña',
                  validate: (value) => value === watch('newPassword') || 'Las contraseñas no coinciden',
                })}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex">
            {loading ? 'Guardando...' : 'Restablecer contraseña'}
          </button>
        </form>

        <p className="text-center text-sm text-tierra-400 mt-4">
          <Link to="/login" className="text-tierra-600 font-medium hover:underline">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
