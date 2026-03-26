'use client'

import { Package, ShoppingCart, TrendingUp, Users, Tag, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts'

interface Stats {
  totalProducts: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  activePromotions: number
  lowStockProducts: number
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
    totalRevenue: 0,
    activePromotions: 0,
    lowStockProducts: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])
  const [ordersByStatus, setOrdersByStatus] = useState<any[]>([])
  const [revenueByMonth, setRevenueByMonth] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Products
      const { data: productsData, count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact' })

      const lowStockItems = productsData?.filter(p => p.stock <= 5) || []
      const lowStock = lowStockItems.length

      // Orders
      const { data: ordersData, count: ordersCount } = await supabase
        .from('orders')
        .select('*, order_items(*)', { count: 'exact' })
        .order('created_at', { ascending: false })

      const pendingOrdersCount = ordersData?.filter(o => o.status === 'pending').length || 0
      const totalRevenue = ordersData?.reduce((sum, o) => sum + Number(o.total), 0) || 0

      // Promotions
      const { count: promotionsCount } = await supabase
        .from('promotions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Orders by status
      const statusCounts = [
        { name: 'En attente', value: ordersData?.filter(o => o.status === 'pending').length || 0, color: '#eab308' },
        { name: 'Confirmée', value: ordersData?.filter(o => o.status === 'confirmed').length || 0, color: '#3b82f6' },
        { name: 'Expédiée', value: ordersData?.filter(o => o.status === 'shipped').length || 0, color: '#a855f7' },
        { name: 'Livrée', value: ordersData?.filter(o => o.status === 'delivered').length || 0, color: '#22c55e' },
        { name: 'Annulée', value: ordersData?.filter(o => o.status === 'cancelled').length || 0, color: '#ef4444' }
      ]

      // Revenue by month (last 6 months)
      const monthlyRevenue = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const month = date.toLocaleDateString('fr-FR', { month: 'short' })
        const monthOrders = ordersData?.filter(o => {
          const orderDate = new Date(o.created_at)
          return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear()
        }) || []
        const revenue = monthOrders.reduce((sum, o) => sum + Number(o.total), 0)
        monthlyRevenue.push({ month, revenue, orders: monthOrders.length })
      }

      // Top products by sales
      const productSales = new Map()
      ordersData?.forEach(order => {
        order.order_items?.forEach((item: any) => {
          const current = productSales.get(item.product_name) || { name: item.product_name, quantity: 0, revenue: 0 }
          current.quantity += item.quantity
          current.revenue += Number(item.total_price)
          productSales.set(item.product_name, current)
        })
      })
      const topProductsList = Array.from(productSales.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        pendingOrders: pendingOrdersCount,
        totalRevenue,
        activePromotions: promotionsCount || 0,
        lowStockProducts: lowStock
      })

      setRecentOrders(ordersData?.slice(0, 5) || [])
      setTopProducts(topProductsList)
      setLowStockProducts(lowStockItems)
      setOrdersByStatus(statusCounts)
      setRevenueByMonth(monthlyRevenue)
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produits
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <Link href="/admin/produits" className="text-xs text-muted-foreground hover:text-accent">
              Gérer →
            </Link>
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
            <Link href="/admin/commandes" className="text-xs text-muted-foreground hover:text-accent">
              Voir tout →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chiffre d'affaires
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Commandes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Promotions
            </CardTitle>
            <Tag className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activePromotions}</div>
            <Link href="/admin/promotions" className="text-xs text-muted-foreground hover:text-accent">
              Gérer →
            </Link>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50 dark:bg-red-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-red-600">
              Stock faible
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.lowStockProducts}</div>
            <p className="text-xs text-red-600">Produits</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution du CA (6 derniers mois)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatPrice(value)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#f97316" name="CA" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#3b82f6" name="Commandes" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 produits par CA</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => formatPrice(value)} />
              <Bar dataKey="revenue" fill="#f97316" name="CA" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Orders & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.order_number} • {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(order.total)}</p>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Alertes de stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/produits?edit=${product.id}`}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                  >
                    <span className="font-medium text-sm">{product.name}</span>
                    <Badge variant="destructive">
                      Stock: {product.stock}
                    </Badge>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  ✅ Aucune alerte
                </p>
              )}
            </div>
            <Link href="/admin/produits" className="block mt-4">
              <Button variant="outline" className="w-full">
                Gérer les stocks →
              </Button>
            </Link>
          </CardContent>
        </Card>
    </div>
  )
}

