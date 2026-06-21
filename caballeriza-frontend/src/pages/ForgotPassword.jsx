import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { PawPrint, Mail } from 'lucide-react'
import { authApi } from '../api/services'

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authApi.forgotPassword(data)
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo procesar la solicitud')
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
          <h1 className="font-serif text-3xl font-bold text-tierra-800">Recuperar contraseña</h1>
          <p className="text-tierra-400 text-sm mt-1">
            Te enviaremos un enlace a tu correo para crear una nueva contraseña
          </p>
        </div>

        {sent ? (
          <div className="card text-center space-y-3">
            <p className="text-tierra-700 font-medium">Revisá tu correo</p>
            <p className="text-sm text-tierra-500">
              Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña.
              Será válido durante 30 minutos.
            </p>
            <Link to="/login" className="text-tierra-600 font-medium hover:underline text-sm inline-block mt-2">
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
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

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex">
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
            </form>

            <p className="text-center text-sm text-tierra-400 mt-4">
              <Link to="/login" className="text-tierra-600 font-medium hover:underline">
                Volver a iniciar sesión
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
