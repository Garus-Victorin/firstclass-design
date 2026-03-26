'use client'

import { useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  ShoppingCart, 
  Tag,
  Star,
  LogOut,
  Menu,
  X,
  Clock,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authService } from '@/lib/auth'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Produits', href: '/admin/produits', icon: Package },
  { name: 'Catégories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Commandes', href: '/admin/commandes', icon: ShoppingCart },
  { name: 'Promotions', href: '/admin/promotions', icon: Tag },
  { name: 'Avis', href: '/admin/avis', icon: Star },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    // Vérifier l'authentification
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      setIsAuthenticated(authenticated)
      
      if (!authenticated && pathname !== '/admin/login') {
        router.push('/admin/login')
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  useEffect(() => {
    // Vérifier la session toutes les 30 secondes
    const sessionCheckInterval = setInterval(() => {
      const authenticated = authService.isAuthenticated()
      
      if (!authenticated && pathname !== '/admin/login') {
        router.push('/admin/login')
      }
      
      setIsAuthenticated(authenticated)
    }, 30000) // 30 secondes

    // Mettre à jour le compteur de temps restant chaque seconde
    const timeInterval = setInterval(() => {
      setTimeRemaining(authService.getTimeUntilExpiration())
    }, 1000)

    // Mettre à jour l'activité lors des interactions
    const updateActivity = () => {
      authService.updateActivity()
    }

    // Écouter les événements d'activité
    window.addEventListener('mousemove', updateActivity)
    window.addEventListener('keydown', updateActivity)
    window.addEventListener('click', updateActivity)
    window.addEventListener('scroll', updateActivity)

    return () => {
      clearInterval(sessionCheckInterval)
      clearInterval(timeInterval)
      window.removeEventListener('mousemove', updateActivity)
      window.removeEventListener('keydown', updateActivity)
      window.removeEventListener('click', updateActivity)
      window.removeEventListener('scroll', updateActivity)
    }
  }, [pathname, router])

  const handleLogout = () => {
    authService.logout()
    router.push('/admin/login')
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Afficher la page de login sans le layout admin
  if (pathname === '/admin/login') {
    return children
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="shadow-lg"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/admin" className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="First Class Design Logo" 
                width={40}
                height={40}
                className="w-auto h-10 object-contain"
              />
              <span className="text-lg font-bold">
                FIRST CLASS <span className="text-accent">ADMIN</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            {/* Compteur de session */}
            <div className="px-4 py-2 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Session: {formatTime(timeRemaining)}</span>
              </div>
            </div>
            
            <Link 
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Voir la boutique
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
