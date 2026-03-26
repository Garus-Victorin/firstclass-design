'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown, ChevronUp, Star, Send, User } from 'lucide-react'
import { getActiveReviews } from '@/lib/data'

export function ReviewSection() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await getActiveReviews()
        // Sélectionner 4 avis aléatoires
        const shuffled = [...data].sort(() => Math.random() - 0.5)
        setReviews(shuffled.slice(0, 4))
      } catch (error) {
        console.error('Erreur chargement avis:', error)
      } finally {
        setLoading(false)
      }
    }
    loadReviews()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Chargement des avis...</div>
  }

  if (reviews.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Aucun avis pour le moment</div>
  }

  return (
    <div className="space-y-8">
      {/* Liste des avis */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/10 rounded-full">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{review.customer_name}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
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
          className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
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

            <Button type="submit" className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white">
              <Send className="h-4 w-4" />
              Envoyer mon avis
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}
