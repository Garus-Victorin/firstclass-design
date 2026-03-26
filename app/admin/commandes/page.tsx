'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, Phone, Check, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface OrderItem {
  id: string
  product_name: string
  product_size: string
  quantity: number
  unit_price: number
  total_price: number
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_address: string
  delivery_method: 'livraison' | 'retrait'
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  notes?: string
  created_at: string
  order_items?: OrderItem[]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'confirmed': return 'bg-blue-100 text-blue-800'
    case 'shipped': return 'bg-purple-100 text-purple-800'
    case 'delivered': return 'bg-green-100 text-green-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'En attente'
    case 'confirmed': return 'Confirmée'
    case 'shipped': return 'Expédiée'
    case 'delivered': return 'Livrée'
    case 'cancelled': return 'Annulée'
    default: return status
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erreur:', error)
      alert('Erreur lors du chargement des commandes')
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
    
    if (error) {
      alert('Erreur: ' + error.message)
    } else {
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
      }
    }
  }

  const generateInvoice = (order: Order) => {
    const invoiceContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Facture ${order.order_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #1a1a1a; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #f97316; padding-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; }
    .logo span { color: #f97316; }
    .invoice-info { text-align: right; }
    .invoice-info h1 { font-size: 28px; color: #f97316; margin-bottom: 5px; }
    .invoice-info p { color: #666; }
    .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .details-section h3 { font-size: 14px; color: #666; text-transform: uppercase; margin-bottom: 10px; }
    .details-section p { margin: 3px 0; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #1a1a1a; color: white; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #eee; }
    .total-row td { font-weight: bold; font-size: 18px; border-top: 2px solid #1a1a1a; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">FIRST CLASS <span>DESIGN</span></div>
    <div class="invoice-info">
      <h1>FACTURE</h1>
      <p>N° ${order.order_number}</p>
      <p>Date: ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>
  </div>
  
  <div class="details">
    <div class="details-section">
      <h3>Client</h3>
      <p><strong>${order.customer_name}</strong></p>
      <p>${order.customer_phone}</p>
      <p>${order.customer_email}</p>
      ${order.customer_address ? `<p>${order.customer_address}</p>` : ''}
    </div>
    <div class="details-section">
      <h3>Informations</h3>
      <p>Date commande: ${new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
      <p>Mode: ${order.delivery_method === 'livraison' ? 'Livraison' : 'Retrait en boutique'}</p>
      <p>Statut: Livrée</p>
    </div>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Article</th>
        <th>Taille</th>
        <th>Qté</th>
        <th>Prix Unit.</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.order_items?.map(item => `
        <tr>
          <td>${item.product_name}</td>
          <td>${item.product_size}</td>
          <td>${item.quantity}</td>
          <td>${item.unit_price.toLocaleString('fr-FR')} FCFA</td>
          <td>${item.total_price.toLocaleString('fr-FR')} FCFA</td>
        </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="4">TOTAL</td>
        <td>${order.total.toLocaleString('fr-FR')} FCFA</td>
      </tr>
    </tbody>
  </table>
  
  <div class="footer">
    <p><strong>First Class Design</strong></p>
    <p>WhatsApp: 0196422780</p>
    <p>Merci pour votre confiance!</p>
  </div>
</body>
</html>
    `
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(invoiceContent)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }

  if (loading) return <div className="p-8 text-center">Chargement...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
        <p className="text-muted-foreground">{orders.length} commandes au total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une commande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmée</SelectItem>
            <SelectItem value="shipped">Expédiée</SelectItem>
            <SelectItem value="delivered">Livrée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-lg">{order.order_number}</p>
                <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {getStatusLabel(order.status)}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <p className="font-medium">{order.customer_name}</p>
              <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold text-lg">{formatPrice(order.total)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Livraison</p>
                <p className="text-sm capitalize">{order.delivery_method === 'livraison' ? 'Livraison' : 'Retrait'}</p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => setSelectedOrder(order)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Voir
              </Button>
              {order.status === 'delivered' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateInvoice(order)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Facture
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Commande {selectedOrder?.order_number}</DialogTitle>
            <DialogDescription>
              Consultez et gérez les détails de cette commande.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Status update */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Statut actuel</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {getStatusLabel(selectedOrder.status)}
                  </Badge>
                </div>
                <Select 
                  value={selectedOrder.status} 
                  onValueChange={(value) => updateOrderStatus(selectedOrder.id, value as Order['status'])}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="shipped">Expédiée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Customer info */}
              <div>
                <h3 className="font-semibold mb-2">Informations client</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nom</p>
                    <p>{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Téléphone</p>
                    <p>{selectedOrder.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p>{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mode de livraison</p>
                    <p className="capitalize">{selectedOrder.delivery_method}</p>
                  </div>
                  {selectedOrder.customer_address && (
                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground">Adresse</p>
                      <p>{selectedOrder.customer_address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-2">Articles</h3>
                <div className="border border-border rounded-lg divide-y divide-border">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between p-3 text-sm">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-muted-foreground">Taille: {item.product_size} | Qté: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatPrice(item.total_price)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between p-3 font-semibold">
                    <p>Total</p>
                    <p>{formatPrice(selectedOrder.total)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button asChild className="flex-1 min-w-[200px]">
                  <a 
                    href={`https://wa.me/225${selectedOrder.customer_phone.replace(/^0/, '')}?text=${encodeURIComponent(`Bonjour ${selectedOrder.customer_name}, concernant votre commande ${selectedOrder.order_number}...`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contacter via WhatsApp
                  </a>
                </Button>
                {selectedOrder.status === 'delivered' && (
                  <Button
                    variant="outline"
                    onClick={() => generateInvoice(selectedOrder)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Facture
                  </Button>
                )}
                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const nextStatus = {
                        pending: 'confirmed',
                        confirmed: 'shipped',
                        shipped: 'delivered'
                      }[selectedOrder.status] as Order['status']
                      if (nextStatus) updateOrderStatus(selectedOrder.id, nextStatus)
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Passer au statut suivant
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
