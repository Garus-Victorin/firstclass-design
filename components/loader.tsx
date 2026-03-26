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

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

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
        
        {/* Nom avec soulignement */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-orange-500 mb-2">
            FIRST CLASS DESIGN
          </h1>
          <div className="h-1 w-full bg-orange-500 rounded-full" />
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

      {/* Message dynamique */}
      <p className="text-muted-foreground text-sm animate-fade-in">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  )
}
