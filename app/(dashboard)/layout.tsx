import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'

async function logoutAction() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    // Sur ordinateur, la page ne défile pas : c'est `main` qui défile.
    // Sur mobile, le défilement reste celui du document — une hauteur figée à
    // `100vh` se fait manger par la barre d'adresse d'un navigateur Android.
    <div className="flex min-h-screen md:h-screen md:overflow-hidden" style={{ background: '#f1f5f9' }}>
      <DashboardNav userEmail={user.email ?? ''} logoutAction={logoutAction} />
      <main className="flex-1 pt-14 md:pt-0 md:overflow-y-auto">{children}</main>
    </div>
  )
}
