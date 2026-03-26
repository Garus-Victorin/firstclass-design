'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Truck, Store, Phone } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice, GOOGLE_MAPS_URL } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart, discount, promoCode, finalTotal } = useCart()
  
  const [deliveryMethod, setDeliveryMethod] = useState<'livraison' | 'retrait'>('livraison')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (items.length === 0) {
      router.push('/panier')
    }
  }, [items.length, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generateWhatsAppMessage = (orderNumber: string) => {
    const itemsList = items.map((item, index) => 
      `${index + 1}. *${item.product.name}*%0A   • Taille: ${item.size}%0A   • Quantité: ${item.quantity}%0A   • Prix: ${formatPrice((Number(item.product.original_price) || 0) * item.quantity)}`
    ).join('%0A%0A')

    // Date GMT+1
    const now = new Date()
    const gmt1Date = new Date(now.getTime() + (60 * 60 * 1000))
    const dateFormatted = gmt1Date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric'
    })

    const message = `🛍️ *NOUVELLE COMMANDE*%0A` +
      `━━━━━━━━━━━━━━━━━━%0A%0A` +
      `📝 *Numéro de commande:* ${orderNumber}%0A` +
      `📅 *Date:* ${dateFormatted}%0A%0A` +
      `━━━━━━━━━━━━━━━━━━%0A` +
      `👤 *INFORMATIONS CLIENT*%0A%0A` +
      `Nom: *${formData.name}*%0A` +
      `Téléphone: *${formData.phone}*%0A%0A` +
      `━━━━━━━━━━━━━━━━━━%0A` +
      `🚚 *MODE DE LIVRAISON*%0A%0A` +
      `${deliveryMethod === 'livraison' ? '🏠 *Livraison à domicile*' : '🏪 *Retrait en boutique*'}%0A` +
      (deliveryMethod === 'livraison' ? `Adresse: ${formData.address}%0A` : '') +
      (formData.notes ? `%0A📌 *Note:* ${formData.notes}%0A` : '') +
      `%0A━━━━━━━━━━━━━━━━━━%0A` +
      `📦 *DÉTAIL DE LA COMMANDE*%0A%0A` +
      `${itemsList}%0A%0A` +
      `━━━━━━━━━━━━━━━━━━%0A` +
      (promoCode ? `🎫 *Code promo:* ${promoCode}%0A💰 *Réduction:* -${formatPrice(discount)}%0A%0A` : '') +
      `💰 *MONTANT TOTAL: ${formatPrice(finalTotal)}*%0A` +
      `━━━━━━━━━━━━━━━━━━%0A%0A` +
      `✅ Merci de confirmer la réception de cette commande.%0A%0A` +
      `👉 _First Class Design - Votre style, notre passion_`

    return message
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Compter le nombre de commandes existantes
      const { count, error: countError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      if (countError) throw countError

      const orderCount = (count || 0) + 1

      // Générer le numéro avec GMT+1
      const now = new Date()
      const gmt1Date = new Date(now.getTime() + (60 * 60 * 1000))
      const year = gmt1Date.getFullYear().toString().slice(-2)
      const month = (gmt1Date.getMonth() + 1).toString().padStart(2, '0')
      const day = gmt1Date.getDate().toString().padStart(2, '0')
      
      const orderNumber = `FC${year}${month}${day}-${orderCount.toString().padStart(4, '0')}`

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: deliveryMethod === 'livraison' ? formData.address : null,
          delivery_method: deliveryMethod,
          total: finalTotal,
          status: 'pending',
          notes: formData.notes || null
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_size: item.size,
        quantity: item.quantity,
        unit_price: Number(item.product.original_price) || 0,
        total_price: (Number(item.product.original_price) || 0) * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      const whatsappUrl = `https://wa.me/22996422780?text=${generateWhatsAppMessage(orderNumber)}`
      window.open(whatsappUrl, '_blank')
      
      setTimeout(() => {
        clearCart()
        router.push('/commande/confirmation')
      }, 1000)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la création de la commande. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name && formData.phone && 
    (deliveryMethod === 'retrait' || formData.address)

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            <div className="lg:col-span-2 space-y-8">
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
                </div>
              </div>

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

            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-secondary rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Votre commande</h2>
                
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
                          {formatPrice((Number(item.product.original_price) || 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border mt-4 pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <div className="text-right">
                      {promoCode && discount > 0 ? (
                        <>
                          <div className="text-sm text-red-600 line-through mb-1">
                            {formatPrice(total)}
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {formatPrice(finalTotal)}
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            Code: {promoCode}
                          </div>
                        </>
                      ) : (
                        <span>{formatPrice(total)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit"
                  size="lg" 
                  disabled={!isFormValid || isSubmitting}
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isSubmitting ? (
                    'Création de la commande...'
                  ) : (
                    <>
                      <Phone className="h-5 w-5 mr-2" />
                      Commander via WhatsApp
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Votre commande sera enregistrée et envoyée via WhatsApp
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
