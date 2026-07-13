'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Leaf } from 'lucide-react'

async function loginAction(formData: FormData) {
  'use server'
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
  }
  redirect('/dashboard')
}

async function demoLoginAction() {
  'use server'
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: 'demo@agrotrack-bf.com',
    password: 'Demo2026!',
  })
  if (error) {
    redirect('/auth/login?error=demo_unavailable')
  }
  redirect('/dashboard')
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; demo?: string }>
}) {
  const params = await searchParams
  const errorMsg = params.error

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0A1628' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Leaf className="w-8 h-8" style={{ color: '#D4AF37' }} />
            <span className="text-2xl font-bold text-white">AgroTrack BF</span>
          </div>
          <p className="text-white/50 text-sm">Connectez-vous à votre coopérative</p>
        </div>

        {/* Bloc Demo */}
        <div className="rounded-xl p-4 mb-6"
          style={{ border: '2px solid #D4AF37', background: '#D4AF3710' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#D4AF37' }}>
            🎯 Compte démo — accès immédiat
          </p>
          <div className="text-xs text-white/60 space-y-0.5 mb-3">
            <p>Email : <span className="text-white font-mono">demo@agrotrack-bf.com</span></p>
            <p>Mot de passe : <span className="text-white font-mono">Demo2026!</span></p>
          </div>
          <form action={demoLoginAction}>
            <button type="submit"
              className="w-full py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: '#D4AF37', color: '#0A1628' }}>
              Accéder à la démo →
            </button>
          </form>
        </div>

        <div className="relative flex items-center my-4">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="px-3 text-xs text-white/30">ou connectez-vous</span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        {errorMsg && (
          <div className="rounded-lg p-3 mb-4 text-sm text-red-300"
            style={{ background: '#ff000020', border: '1px solid #ff000040' }}>
            {decodeURIComponent(errorMsg)}
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Adresse email
            </label>
            <input name="email" type="email" required autoComplete="email"
              placeholder="vous@exemple.com"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Mot de passe
            </label>
            <input name="password" type="password" required autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          <button type="submit"
            className="w-full py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90 mt-2"
            style={{ background: '#00BCD4', color: '#0A1628' }}>
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          Pas encore de compte ?{' '}
          <Link href="/auth/register" className="font-medium hover:underline"
            style={{ color: '#D4AF37' }}>
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
