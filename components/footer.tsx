import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react'
import { WHATSAPP_NUMBER, GOOGLE_MAPS_URL } from '@/lib/data'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tight">
                FIRST CLASS <span className="text-accent">DESIGN</span>
              </span>
            </Link>
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
                  href="mailto:contact@firstclassdesign.com"
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  contact@firstclassdesign.com
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
                href="#"
                className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a 
                href="#"
                className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
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
