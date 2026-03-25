import Link from 'next/link'
import { CheckCircle, Phone, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WHATSAPP_NUMBER, GOOGLE_MAPS_URL } from '@/lib/data'

export default function ConfirmationPage() {
  return (
    <div className="py-16 lg:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Commande envoyée !
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          Merci pour votre commande. Votre demande a été transmise via WhatsApp. 
          Notre équipe vous contactera rapidement pour confirmer les détails.
        </p>

        <div className="bg-secondary rounded-lg p-6 mb-8">
          <h2 className="font-semibold mb-4">Prochaines étapes</h2>
          <ol className="text-left text-sm space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                1
              </span>
              <span>Nous recevons votre commande via WhatsApp</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                2
              </span>
              <span>Notre équipe confirme la disponibilité et le montant total</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                3
              </span>
              <span>Nous préparons et expédions votre commande (ou vous venez la chercher)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                4
              </span>
              <span>Paiement à la livraison ou au retrait</span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button asChild variant="outline">
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER.replace(/^0/, '225')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="h-4 w-4 mr-2" />
              Nous contacter
            </a>
          </Button>
          <Button asChild variant="outline">
            <a 
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Notre boutique
            </a>
          </Button>
        </div>

        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/catalogue">
            Continuer mes achats
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
