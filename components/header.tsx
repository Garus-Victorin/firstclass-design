'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, MapPin, Phone } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { WHATSAPP_NUMBER, GOOGLE_MAPS_URL } from '@/lib/data'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Catalogue', href: '/catalogue' },
  { name: 'À propos', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
]

export function Header() {
  const { itemCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            return
          }
        }
      }
      setActiveSection('')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.substring(2)
      
      // Si on n'est pas sur la page d'accueil, rediriger d'abord
      if (pathname !== '/') {
        router.push(href)
      } else {
        // Si on est déjà sur la page d'accueil, scroll direct
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    } else {
      router.push(href)
    }
    setIsOpen(false)
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.startsWith('/#')) {
      const section = href.substring(2)
      return activeSection === section
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between text-xs sm:text-sm">
            <a 
              href="https://wa.me/22996422780"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">WhatsApp:</span> +229 96 42 27 80
            </a>
            <a 
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Notre boutique</span>
              <span className="sm:hidden">Localisation</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.href)}
                      className={`text-lg font-medium text-left transition-colors ${
                        isActive(item.href) 
                          ? 'text-accent' 
                          : 'hover:text-accent'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div 
                onClick={() => router.push('/admin/login')} 
                className="cursor-pointer relative w-10 h-10"
              >
                <Image 
                  src="/logo.png" 
                  alt="First Class Design Logo" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span 
                onClick={() => router.push('/admin/login')}
                className="text-xl sm:text-2xl font-bold tracking-tight hidden sm:inline cursor-pointer hover:opacity-80 transition-opacity"
              >
                FIRST CLASS <span className="text-accent">DESIGN</span>
              </span>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`text-sm font-medium transition-all duration-300 relative ${
                    isActive(item.href)
                      ? 'text-accent'
                      : 'hover:text-accent'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent animate-in slide-in-from-left" />
                  )}
                </button>
              ))}
            </nav>

            {/* Cart */}
            <Link href="/panier" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Panier</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
