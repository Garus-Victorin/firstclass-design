import { Truck, Shield, RefreshCw, CreditCard } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Livraison Rapide',
    description: 'Livraison à domicile disponible'
  },
  {
    icon: Shield,
    title: 'Qualité Premium',
    description: 'Produits authentiques garantis'
  },
  {
    icon: RefreshCw,
    title: 'Retour Facile',
    description: 'Échange sous 14 jours'
  },
  {
    icon: CreditCard,
    title: 'Paiement Flexible',
    description: 'À la livraison ou retrait boutique'
  }
]

export function PromoBar() {
  return (
    <section className="bg-secondary py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
