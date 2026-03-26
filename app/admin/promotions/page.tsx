'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, MoreHorizontal, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Promotion {
  id: string
  name: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  min_order: number
  start_date: string
  end_date: string
  is_active: boolean
  created_at?: string
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(null)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    min_order: '',
    start_date: '',
    end_date: '',
    is_active: true
  })
  const [dateError, setDateError] = useState('')

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erreur:', error)
      alert('Erreur lors du chargement des promotions')
    } else {
      setPromotions(data || [])
    }
    setLoading(false)
  }

  const handleOpenDialog = (promotion?: Promotion) => {
    setDateError('')
    if (promotion) {
      setEditingPromotion(promotion)
      setFormData({
        name: promotion.name,
        code: promotion.code,
        type: promotion.type,
        value: promotion.value.toString(),
        min_order: promotion.min_order.toString(),
        start_date: promotion.start_date,
        end_date: promotion.end_date,
        is_active: promotion.is_active
      })
    } else {
      setEditingPromotion(null)
      const today = new Date().toISOString().split('T')[0]
      setFormData({
        name: '',
        code: '',
        type: 'percentage',
        value: '',
        min_order: '0',
        start_date: today,
        end_date: '',
        is_active: true
      })
    }
    setIsDialogOpen(true)
  }

  const validateDates = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) return true
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (end <= start) {
      setDateError('La date de fin doit être après la date de début')
      return false
    }
    
    setDateError('')
    return true
  }

  const handleDateChange = (field: 'start_date' | 'end_date', value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    
    if (field === 'start_date' && newFormData.end_date) {
      validateDates(value, newFormData.end_date)
    } else if (field === 'end_date' && newFormData.start_date) {
      validateDates(newFormData.start_date, value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateDates(formData.start_date, formData.end_date)) {
      return
    }
    
    const promotionData = {
      name: formData.name,
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseInt(formData.value),
      min_order: parseInt(formData.min_order) || 0,
      start_date: formData.start_date,
      end_date: formData.end_date,
      is_active: formData.is_active
    }

    if (editingPromotion) {
      const { error } = await supabase
        .from('promotions')
        .update(promotionData)
        .eq('id', editingPromotion.id)
      
      if (error) {
        alert('Erreur: ' + error.message)
        return
      }
    } else {
      const { error } = await supabase
        .from('promotions')
        .insert([promotionData])
      
      if (error) {
        alert('Erreur: ' + error.message)
        return
      }
    }

    setIsDialogOpen(false)
    fetchPromotions()
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id)
    
    if (error) {
      alert('Erreur: ' + error.message)
    } else {
      fetchPromotions()
    }
    setIsDeleteDialogOpen(false)
    setPromotionToDelete(null)
  }

  const openDeleteDialog = (promo: Promotion) => {
    setPromotionToDelete(promo)
    setIsDeleteDialogOpen(true)
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('promotions')
      .update({ is_active: !currentStatus })
      .eq('id', id)
    
    if (error) {
      alert('Erreur: ' + error.message)
    } else {
      fetchPromotions()
    }
  }

  const formatValue = (promo: Promotion) => {
    if (promo.type === 'percentage') {
      return `${promo.value}%`
    }
    return `${promo.value.toLocaleString()} FCFA`
  }

  if (loading) return <div className="p-8 text-center">Chargement...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
          <p className="text-muted-foreground">
            {promotions.filter(p => p.is_active).length} promotions actives
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? 'Modifier la promotion' : 'Nouvelle promotion'}
              </DialogTitle>
              <DialogDescription>
                {editingPromotion ? 'Modifiez les informations de la promotion ci-dessous.' : 'Remplissez les informations pour ajouter une nouvelle promotion.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la promotion *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code promo *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="EX: PROMO20"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'percentage' | 'fixed' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Pourcentage</SelectItem>
                      <SelectItem value="fixed">Montant fixe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Valeur *</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    placeholder={formData.type === 'percentage' ? '20' : '10000'}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_order">Commande minimum (FCFA)</Label>
                <Input
                  id="min_order"
                  type="number"
                  value={formData.min_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_order: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Date de début *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleDateChange('start_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">Date de fin *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleDateChange('end_date', e.target.value)}
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
              {dateError && (
                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3">
                  ⚠️ {dateError}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={!!dateError}>
                  {editingPromotion ? 'Enregistrer' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promotion</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Réduction</TableHead>
              <TableHead>Minimum</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promo) => (
              <TableRow key={promo.id}>
                <TableCell className="font-medium">{promo.name}</TableCell>
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-sm">{promo.code}</code>
                </TableCell>
                <TableCell className="font-medium text-accent">{formatValue(promo)}</TableCell>
                <TableCell>
                  {promo.min_order > 0 ? `${promo.min_order.toLocaleString()} FCFA` : '-'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {promo.start_date} - {promo.end_date}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={promo.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    onClick={() => toggleActive(promo.id, promo.is_active)}
                    style={{ cursor: 'pointer' }}
                  >
                    {promo.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenDialog(promo)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleActive(promo.id, promo.is_active)}>
                        <Tag className="h-4 w-4 mr-2" />
                        {promo.is_active ? 'Désactiver' : 'Activer'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => openDeleteDialog(promo)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la promotion <strong>{promotionToDelete?.name}</strong> (code: <code className="bg-muted px-1 py-0.5 rounded">{promotionToDelete?.code}</code>) ?
              <br /><br />
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => promotionToDelete && handleDelete(promotionToDelete.id)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
