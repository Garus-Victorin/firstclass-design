"use client";

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export function ReviewForm() {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !rating || !comment) return

    setIsSubmitting(true)

    await supabase.from('reviews').insert({
      customer_name: name,
      rating,
      comment,
      is_active: false
    })

    setSubmitted(true)
    setName('')
    setRating(0)
    setComment('')
    setIsSubmitting(false)

    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Laissez votre avis</h3>
      
      {submitted ? (
        <div className="text-center py-8">
          <p className="text-green-600 font-medium">✅ Merci pour votre avis !</p>
          <p className="text-sm text-muted-foreground mt-2">
            Il sera publié après validation
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Votre nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Entrez votre nom"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Note</label>
            <div className="flex gap-1">
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
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Votre avis</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[100px]"
              placeholder="Partagez votre expérience..."
              required
            />
          </div>

          <Button
            type="submit"
            disabled={!name || !rating || !comment || isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isSubmitting ? 'Envoi...' : 'Envoyer mon avis'}
          </Button>
        </form>
      )}
    </div>
  )
}
