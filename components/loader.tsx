'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const loadingMessages = [
  'Veuillez patienter...',
  'Page en cours de chargement...',
  'Préparation de votre expérience...',
  'Chargement des données...',
  'Presque prêt...',
]

export function Loader() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [charIndex, setCharIndex] = useState(0)

  const currentMessage = loadingMessages[messageIndex]

  // Animation lettre par lettre
  useEffect(() => {
    if (charIndex < currentMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentMessage.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, 50) // 50ms entre chaque lettre

      return () => clearTimeout(timeout)
    } else {
      // Attendre 2 secondes avant de passer au message suivant
      const timeout = setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
        setCharIndex(0)
        setDisplayedText('')
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [charIndex, currentMessage, messageIndex])

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="relative w-24 h-24">
          <Image
            src="/logo.png"
            alt="First Class Design"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Nom sans soulignement */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-orange-500">
            FIRST CLASS DESIGN
          </h1>
        </div>
      </div>

      {/* Points de chargement */}
      <div className="flex gap-3 mb-8">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="w-4 h-4 rounded-full bg-orange-500 animate-bounce"
            style={{
              animationDelay: `${index * 0.15}s`,
              animationDuration: '0.8s',
            }}
          />
        ))}
      </div>

      {/* Message dynamique avec animation lettre par lettre */}
      <p className="text-muted-foreground text-sm h-6">
        {displayedText}
        <span className="animate-pulse">|</span>
      </p>
    </div>
  )
}
