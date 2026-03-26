'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/data'
import { useState, FormEvent } from 'react'

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // Construire le message WhatsApp
    const whatsappMessage = `Bonjour First Class,\n\nNom: ${formData.name}\n\nMessage:\n${formData.message}`
    
    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(whatsappMessage)
    
    // Rediriger vers WhatsApp
    window.open(`https://wa.me/229${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank')
    
    // Réinitialiser le formulaire
    setFormData({ name: '', message: '' })
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Informations de contact */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">Nos coordonnées</h3>
          <p className="text-muted-foreground">
            N'hésitez pas à nous contacter pour toute question ou demande d'information.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Phone className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Téléphone</h4>
              <a 
                href={`tel:${WHATSAPP_NUMBER}`}
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                +229 {WHATSAPP_NUMBER}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Mail className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Email</h4>
              <a 
                href="mailto:arseneadouhouekonou@yahoo.fr"
                className="text-muted-foreground hover:text-accent transition-colors break-all"
              >
                arseneadouhouekonou@yahoo.fr
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Adresse</h4>
              <p className="text-muted-foreground">
                Cotonou, Bénin
              </p>
            </div>
          </div>
        </Card>

        <Button 
          asChild
          size="lg" 
          className="w-full gap-2"
        >
          <a 
            href={`https://wa.me/229${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Phone className="h-4 w-4" />
            Contactez-nous sur WhatsApp
          </a>
        </Button>
      </div>

      {/* Formulaire de contact */}
      <Card className="p-6">
        <h3 className="text-2xl font-bold mb-6">Envoyez-nous un message</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium mb-2">
              Nom complet
            </label>
            <Input
              id="contact-name"
              placeholder="Votre nom"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <Textarea
              id="contact-message"
              placeholder="Votre message..."
              rows={8}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full gap-2">
            <Send className="h-4 w-4" />
            Envoyer le message
          </Button>
        </form>
      </Card>
    </div>
  )
}
