'use client'

import { Package, ShoppingCart, TrendingUp, Users, ArrowLeft, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/types'
import type { Product, Order } from '@/lib/types'

interface Stats {
  totalProducts: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'confirmed': return 'bg-blue-100 text-blue-800'
    case 'shipped': return 'bg-purple-100 text-purple-800'
    case 'delivered': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'En attente'
    case 'confirmed': return 'Confirmée'
    case 'shipped': return 'Expédiée'
    case 'delivered': return 'Livrée'
    default: return status
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const router = useRouter()
  const [userRole, setUserRole] = useState<'admin' | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const userId = localStorage.getItem('user_id')
    const userEmail = localStorage.getItem('user_email')
    
    if (!userId || !userEmail) {
      router.push('/admin/login')
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('id, nom, prenom')
      .eq('email', userEmail)
      .eq('id', userId)
      .single()
    
    if (!profile) {
      router.push('/admin/login')
      return
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_name')
    router.push('/admin/login')
  }

  if (!userRole) return <div>Chargement...</div>
  const [topProducts, setTopProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Orders
      const { data: ordersData, count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      const pendingOrdersCount = ordersData?.filter(o => o.status === 'pending').length || 0
      const totalRevenue = ordersData?.reduce((sum, o) => sum + Number(o.total), 0) || 0

      // Top products by stock
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('stock', { ascending: false })
        .limit(5)

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        pendingOrders: pendingOrdersCount,
        totalRevenue
      })

      setRecentOrders(ordersData || [])
      setTopProducts(productsData || [])
    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <div className="h-24 animate-pulse bg-muted rounded-lg"></div>
          </Card>
        ))}
      </div>
    </div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenue dans votre espace d'administration First Class Design
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Produits
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Commandes
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              CA
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{order.customer_name || 'Client'}</p>
                  <p className="text-sm text-muted-foreground">
                    #{order.id?.slice(-6)} • {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(Number(order.total))}</p>
                  <Badge className={getStatusColor(order.status || 'pending')}>
                    {getStatusLabel(order.status || 'pending')}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meilleurs produits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-accent/10 text-accent font-medium text-sm flex items-center justify-center flex-shrink-0">
                  #{index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium truncate">{product.name}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{formatPrice(Number(product.price))}</p>
                  <p className="text-muted-foreground">x{product.stock} stock</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-destructive bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            ⚠️ Alertes de stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProducts.filter(p => p.stock <= 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-md">
                <span className="font-medium">{product.name}</span>
                <Badge variant="destructive" className="font-medium">
                  {product.stock} restant{product.stock !== 1 ? 's' : ''}
                </Badge>
              </div>
            ))}
            {topProducts.filter(p => p.stock <= 5).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                ✅ Tous les produits ont du stock
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

