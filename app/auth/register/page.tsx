'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Leaf } from 'lucide-react'

async function registerAction(formData: FormData) {
  'use server'
  const fullName = formData.get('full_name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirm = formData.get('confirm_password') as string
  if (password !== confirm) {
    redirect('/auth/register?error=Les+mots+de+passe+ne+correspondent+pas')
  }
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) {
    redirect(`/auth/register?error=${encodeURIComponent(error.message)}`)
  }
  redirect('/auth/register?success=1')
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const params = await searchParams

  if (params.success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: '#0A1628' }}>
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-2xl font-bold text-white mb-2">Vérifiez vos emails</h2>
          <p className="text-white/50 mb-6">
            Un lien de confirmation vous a été envoyé. Cliquez dessus pour activer votre compte.
          </p>
          <Link href="/auth/login"
            className="inline-block px-6 py-2 rounded-lg font-medium text-sm"
            style={{ background: '#D4AF37', color: '#0A1628' }}>
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: '#0A1628' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Leaf className="w-8 h-8" style={{ color: '#D4AF37' }} />
            <span className="text-2xl font-bold text-white">AgroTrack</span>
          </div>
          <p className="text-white/50 text-sm">Créez votre compte</p>
        </div>

        {params.error && (
          <div className="rounded-lg p-3 mb-4 text-sm text-red-300"
            style={{ background: '#ff000020', border: '1px solid #ff000040' }}>
            {decodeURIComponent(params.error)}
          </div>
        )}

        <form action={registerAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Nom complet</label>
            <input name="full_name" type="text" required placeholder="Prénom et nom"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none"
              style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Adresse email</label>
            <input name="email" type="email" required placeholder="vous@exemple.com"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none"
              style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Mot de passe</label>
            <input name="password" type="password" required placeholder="••••••••" minLength={8}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none"
              style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Confirmer le mot de passe</label>
            <input name="confirm_password" type="password" required placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none"
              style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          <button type="submit"
            className="w-full py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90 mt-2"
            style={{ background: '#D4AF37', color: '#0A1628' }}>
            Créer mon compte
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="font-medium hover:underline" style={{ color: '#D4AF37' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
