'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown, ChevronUp, Star, Send, User } from 'lucide-react'

const SAMPLE_REVIEWS = [
  {
    id: 1,
    name: 'Aminata K.',
    rating: 5,
    comment: 'Excellente boutique ! J\'ai trouvé exactement ce que je cherchais. La qualité des vêtements est top et le service client est irréprochable.',
    date: '15 Mars 2024'
  },
  {
    id: 2,
    name: 'Jean-Paul D.',
    rating: 5,
    comment: 'Très satisfait de mon achat. Les produits sont de qualité premium et les prix sont raisonnables. Je recommande vivement First Class !',
    date: '10 Mars 2024'
  },
  {
    id: 3,
    name: 'Fatoumata S.',
    rating: 4,
    comment: 'Belle collection de vêtements tendance. L\'accueil est chaleureux et les conseils sont pertinents. Une adresse à retenir à Cotonou.',
    date: '5 Mars 2024'
  },
  {
    id: 4,
    name: 'Mohamed A.',
    rating: 5,
    comment: 'Superbe expérience d\'achat ! Large choix de produits pour toute la famille. La boutique est bien située et facile d\'accès. Bravo !',
    date: '1 Mars 2024'
  }
]

export function ReviewSection() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  return (
    <div className="space-y-8">
      {/* Liste des avis */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {SAMPLE_REVIEWS.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/10 rounded-full">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{review.name}</h4>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bouton pour ouvrir/fermer le formulaire */}
      <div className="text-center">
        <Button
          onClick={() => setIsFormOpen(!isFormOpen)}
          size="lg"
          className="gap-2"
        >
          {isFormOpen ? (
            <>
              Masquer le formulaire
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Laissez-nous votre avis
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Formulaire déroulant */}
      {isFormOpen && (
        <Card className="max-w-2xl mx-auto p-6 animate-in slide-in-from-top duration-300">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Votre note
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Votre nom
              </label>
              <Input
                id="name"
                placeholder="Jean Dupont"
                required
              />
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Votre commentaire
              </label>
              <Textarea
                id="comment"
                placeholder="Partagez votre expérience avec nous..."
                rows={4}
                required
              />
            </div>

            <Button type="submit" className="w-full gap-2">
              <Send className="h-4 w-4" />
              Envoyer mon avis
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}
