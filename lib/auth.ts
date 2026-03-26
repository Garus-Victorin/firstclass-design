'use client'

const SESSION_KEY = 'admin_session'
const LAST_ACTIVITY_KEY = 'admin_last_activity'
const SESSION_TIMEOUT = 10 * 60 * 1000 // 10 minutes en millisecondes

interface AdminSession {
  email: string
  authenticated: boolean
  loginTime: number
}

// Credentials admin (en production, utiliser une vraie base de données)
const ADMIN_CREDENTIALS = {
  email: 'admin@fc-design.com',
  password: 'admin123'
}

export const authService = {
  // Connexion
  login(email: string, password: string): boolean {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const session: AdminSession = {
        email,
        authenticated: true,
        loginTime: Date.now()
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
        localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString())
      }
      
      return true
    }
    return false
  },

  // Déconnexion
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY)
      localStorage.removeItem(LAST_ACTIVITY_KEY)
    }
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false

    const sessionData = localStorage.getItem(SESSION_KEY)
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY)

    if (!sessionData || !lastActivity) {
      return false
    }

    const session: AdminSession = JSON.parse(sessionData)
    const lastActivityTime = parseInt(lastActivity)
    const currentTime = Date.now()

    // Vérifier si la session a expiré (10 minutes d'inactivité)
    if (currentTime - lastActivityTime > SESSION_TIMEOUT) {
      this.logout()
      return false
    }

    // Mettre à jour le temps de dernière activité
    localStorage.setItem(LAST_ACTIVITY_KEY, currentTime.toString())

    return session.authenticated
  },

  // Obtenir les informations de session
  getSession(): AdminSession | null {
    if (typeof window === 'undefined') return null

    const sessionData = localStorage.getItem(SESSION_KEY)
    if (!sessionData) return null

    return JSON.parse(sessionData)
  },

  // Mettre à jour l'activité
  updateActivity(): void {
    if (typeof window !== 'undefined' && this.isAuthenticated()) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString())
    }
  },

  // Obtenir le temps restant avant expiration (en secondes)
  getTimeUntilExpiration(): number {
    if (typeof window === 'undefined') return 0

    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY)
    if (!lastActivity) return 0

    const lastActivityTime = parseInt(lastActivity)
    const currentTime = Date.now()
    const timeElapsed = currentTime - lastActivityTime
    const timeRemaining = SESSION_TIMEOUT - timeElapsed

    return Math.max(0, Math.floor(timeRemaining / 1000))
  }
}
