'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Truck, Store, Phone, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice, WHATSAPP_NUMBER, GOOGLE_MAPS_URL } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  
  const [deliveryMethod, setDeliveryMethod] = useState<'livraison' | 'retrait'>('livraison')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (items.length === 0) {
    router.push('/panier')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateWhatsAppMessage = () => {
    const itemsList = items.map(item => 
      `• ${item.product.name} (Taille: ${item.size}) x${item.quantity} - ${formatPrice(item.product.price * item.quantity)}`
    ).join('\n')

    const message = `*NOUVELLE COMMANDE - First Class Design*\n\n` +
      `*Client:* ${formData.name}\n` +
      `*Téléphone:* ${formData.phone}\n` +
      `*Email:* ${formData.email}\n\n` +
      `*Mode de livraison:* ${deliveryMethod === 'livraison' ? 'Livraison à domicile' : 'Retrait en boutique'}\n` +
      (deliveryMethod === 'livraison' ? `*Adresse:* ${formData.address}\n` : '') +
      (formData.notes ? `*Notes:* ${formData.notes}\n` : '') +
      `\n*ARTICLES:*\n${itemsList}\n\n` +
      `*TOTAL: ${formatPrice(total)}*\n\n` +
      `Merci de confirmer ma commande !`

    return encodeURIComponent(message)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/^0/, '225')}?text=${generateWhatsAppMessage()}`
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
    
    // Clear cart and redirect
    setTimeout(() => {
      clearCart()
      router.push('/commande/confirmation')
    }, 1000)
  }

  const isFormValid = formData.name && formData.phone && 
    (deliveryMethod === 'retrait' || formData.address)

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Link 
          href="/panier" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au panier
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
          Finaliser la commande
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Info */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Votre numéro"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Mode de livraison</h2>
                <RadioGroup 
                  value={deliveryMethod} 
                  onValueChange={(value) => setDeliveryMethod(value as 'livraison' | 'retrait')}
                  className="space-y-3"
                >
                  <div className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    deliveryMethod === 'livraison' ? 'border-accent bg-accent/5' : 'border-border'
                  }`}>
                    <RadioGroupItem value="livraison" id="livraison" />
                    <div className="flex-1">
                      <Label htmlFor="livraison" className="flex items-center gap-2 cursor-pointer font-medium">
                        <Truck className="h-4 w-4" />
                        Livraison à domicile
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Livraison sous 24-48h. Paiement à la livraison.
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    deliveryMethod === 'retrait' ? 'border-accent bg-accent/5' : 'border-border'
                  }`}>
                    <RadioGroupItem value="retrait" id="retrait" />
                    <div className="flex-1">
                      <Label htmlFor="retrait" className="flex items-center gap-2 cursor-pointer font-medium">
                        <Store className="h-4 w-4" />
                        Retrait en boutique
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Gratuit. Récupérez votre commande à notre boutique.
                      </p>
                      <a 
                        href={GOOGLE_MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-accent hover:underline mt-2"
                      >
                        <MapPin className="h-3 w-3" />
                        Voir l'adresse
                      </a>
                    </div>
                  </div>
                </RadioGroup>

                {/* Address (only for delivery) */}
                {deliveryMethod === 'livraison' && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="address">Adresse de livraison *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Votre adresse complète"
                      rows={3}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Notes supplémentaires</h2>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Instructions spéciales, commentaires..."
                  rows={3}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-secondary rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Votre commande</h2>
                
                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                      <div className="relative w-16 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-muted-foreground">
                          Taille: {item.size} | Qté: {item.quantity}
                        </p>
                        <p className="font-medium mt-1">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border mt-4 pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button 
                  type="submit"
                  size="lg" 
                  disabled={!isFormValid || isSubmitting}
                  className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isSubmitting ? (
                    'Redirection vers WhatsApp...'
                  ) : (
                    <>
                      <Phone className="h-5 w-5 mr-2" />
                      Commander via WhatsApp
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Votre commande sera envoyée via WhatsApp pour confirmation
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
