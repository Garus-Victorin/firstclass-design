import { Hero } from '@/components/hero'
import { CategoriesSection } from '@/components/categories-section'
import { FeaturedProducts } from '@/components/featured-products'
import { PromoBar } from '@/components/promo-bar'
import { ReviewSection } from '@/components/review-section'
import { ContactSection } from '@/components/contact-section'
import { MapPin, Clock, Phone } from 'lucide-react'

export default function HomePage() {
  // Fonction pour déterminer le statut d'ouverture
  const getOpenStatus = () => {
    const now = new Date()
    const day = now.getDay() // 0 = Dimanche, 1 = Lundi, etc.
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const currentTime = hours * 60 + minutes

    // Horaires : Lundi - Samedi: 8h - 22h, Dimanche: Fermé
    if (day === 0) {
      return { status: 'closed', text: 'Fermé - Ouvre lundi à 8h00', color: 'text-red-600' }
    }

    const openTime = 8 * 60 // 8h00
    const closeTime = 22 * 60 // 22h00
    const closingSoon = closeTime - 60 // 1h avant la fermeture (21h00)

    if (currentTime < openTime) {
      return { status: 'closed', text: `Fermé - Ouvre à 8h00`, color: 'text-red-600' }
    } else if (currentTime >= openTime && currentTime < closingSoon) {
      return { status: 'open', text: 'Ouvert actuellement', color: 'text-green-600' }
    } else if (currentTime >= closingSoon && currentTime < closeTime) {
      return { status: 'closing', text: 'Ferme bientôt', color: 'text-orange-600' }
    } else {
      return { status: 'closed', text: 'Fermé - Ouvre demain à 8h00', color: 'text-red-600' }
    }
  }

  const openStatus = getOpenStatus()

  return (
    <>
      <Hero />
      <PromoBar />
      <FeaturedProducts 
        title="Nos Produits" 
        subtitle="Mode pour toute la famille : vêtements, chaussures, accessoires pour hommes, femmes et enfants"
        filter="all"
        limit={8}
      />
      
      {/* Section Lifestyle - Bloc Visuel */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Notre Style de Vie
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment nos clients portent nos créations au quotidien
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Image 1 - Homme élégant */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg group">
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80"
                alt="Style homme élégant"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold">Style Homme</p>
                  <p className="text-white/80 text-sm">Élégance au quotidien</p>
                </div>
              </div>
            </div>

            {/* Image 2 - Femme mode */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg group">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
                alt="Mode femme"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold">Mode Femme</p>
                  <p className="text-white/80 text-sm">Tendances actuelles</p>
                </div>
              </div>
            </div>

            {/* Image 3 - Accessoires */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg group">
              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"
                alt="Accessoires mode"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold">Accessoires</p>
                  <p className="text-white/80 text-sm">Complétez votre look</p>
                </div>
              </div>
            </div>

            {/* Image 4 - Style décontracté */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg group">
              <img
                src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&q=80"
                alt="Style décontracté"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold">Casual Chic</p>
                  <p className="text-white/80 text-sm">Confort et style</p>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </section>
      {/* Section Qui sommes-nous */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Qui sommes-nous ?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-lg">
              First Class est votre destination mode à Cotonou. Nous proposons une sélection exclusive de vêtements et accessoires pour toute la famille.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Informations de contact */}
            <div className="space-y-6">
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-3">Horaires d'ouverture</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lundi - Samedi</span>
                        <span className="font-medium">8h00 - 22h00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dimanche</span>
                        <span className="font-medium">Fermé</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          openStatus.status === 'open' ? 'bg-green-600' :
                          openStatus.status === 'closing' ? 'bg-orange-600' :
                          'bg-red-600'
                        } animate-pulse`} />
                        <span className={`font-semibold ${openStatus.color}`}>
                          {openStatus.text}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Contact</h3>
                    <div className="space-y-2 text-sm">
                      <a href="tel:0196422780" className="block text-muted-foreground hover:text-accent transition-colors">
                        +229 01 96 42 27 80
                      </a>
                      <a href="https://wa.me/22901964227780" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-accent transition-colors">
                        WhatsApp: +229 01 96 42 27 80
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image ou description */}
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Notre Histoire</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Depuis notre ouverture, First Class s'est imposé comme une référence dans le monde de la mode à Cotonou. Nous sélectionnons avec soin chaque pièce pour vous offrir le meilleur de la mode contemporaine.
                </p>
                <p>
                  Notre équipe passionnée est à votre écoute pour vous conseiller et vous aider à trouver le style qui vous correspond. Que vous recherchiez une tenue décontractée, professionnelle ou élégante, vous trouverez votre bonheur chez First Class.
                </p>
                <p className="font-medium text-foreground">
                  Venez découvrir notre collection en boutique ou parcourez notre catalogue en ligne !
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Où sommes-nous */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Où sommes-nous ?
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Venez nous rendre visite dans notre boutique
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.6437891234567!2d2.4954282!3d6.3727323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103cab0005816e3f%3A0x6477b7326fe7be84!2sFirst%20Class!5e0!3m2!1sfr!2sci!4v1234567890123!5m2!1sfr!2sci"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Notre localisation - First Class"
              />
            </div>
            
            <div className="mt-8 text-center">
              <a 
                href="https://www.google.com/maps/place/First+Class/@6.3727323,2.4980031,17z/data=!3m1!4b1!4m6!3m5!1s0x103cab0005816e3f:0x6477b7326fe7be84!8m2!3d6.3727323!4d2.4980031!16s%2Fg%2F11n99sz7w8?entry=ttu&g_ep=EgoyMDI2MDMyMy4xIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
              >
                <MapPin className="h-5 w-5" />
                Ouvrir dans Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Avis Clients */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              ⭐ Avis Clients
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Découvrez ce que nos clients pensent de nous
            </p>
          </div>

          <ReviewSection />
        </div>
      </section>

      {/* Section Nous Contacter */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              📞 Nous Contacter
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Une question ? Besoin d'aide ? Nous sommes là pour vous
            </p>
          </div>

          <ContactSection />
        </div>
      </section>
    </>
  )
}
