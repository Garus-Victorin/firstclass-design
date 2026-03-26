'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Phone, Mail, Facebook } from 'lucide-react'
import { WHATSAPP_NUMBER, GOOGLE_MAPS_URL } from '@/lib/data'

export function Footer() {
  const router = useRouter()
  
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span 
              onClick={() => router.push('/admin/login')}
              className="inline-block cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-bold tracking-tight">
                FIRST CLASS <span className="text-accent">DESIGN</span>
              </span>
            </span>
            <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
              Votre destination premium pour des vêtements de qualité exceptionnelle. Style, élégance et raffinement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/catalogue" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=homme" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Homme
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=femme" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Femme
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=accessoires" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER.replace(/^0/, '225')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {WHATSAPP_NUMBER}
                </a>
              </li>
              <li>
                <a 
                  href="mailto:arseneadouhouekonou@yahoo.fr"
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  arseneadouhouekonou@yahoo.fr
                </a>
              </li>
              <li>
                <a 
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  Voir sur la carte
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">
              Suivez-nous
            </h3>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61571781114002"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors"
                title="Facebook - FIRST CLASS AUTO"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a 
                href="https://wa.me/22901964227780"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors"
                title="WhatsApp: +229 01 96 42 27 80"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="sr-only">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-sm text-primary-foreground/50 text-center">
            © {new Date().getFullYear()} First Class Design. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
