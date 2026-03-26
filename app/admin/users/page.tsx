'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, MoreHorizontal, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
} from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  nom: string
  prenom: string
  email: string
  mot_de_passe: string
  date_creation: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('date_creation', { ascending: false })

    if (error) console.error(error)
    else setUsers(data || [])
    setLoading(false)
  }

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        mot_de_passe: ''
      })
    } else {
      setEditingUser(null)
      setFormData({ nom: '', prenom: '', email: '', mot_de_passe: '' })
    }
    setShowPassword(false)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingUser) {
      // Update - ne pas mettre à jour le mot de passe s'il est vide
      const updateData: any = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email
      }
      
      if (formData.mot_de_passe) {
        updateData.mot_de_passe = formData.mot_de_passe
      }
      
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', editingUser.id)
      
      if (error) alert('Erreur: ' + error.message)
    } else {
      // Create
      if (!formData.mot_de_passe) {
        alert('Le mot de passe est requis pour créer un utilisateur')
        return
      }
      
      const { error } = await supabase
        .from('users')
        .insert([formData])
      
      if (error) alert('Erreur: ' + error.message)
    }

    setIsDialogOpen(false)
    fetchUsers()
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', deleteId)
    
    if (error) alert('Erreur: ' + error.message)
    else {
      setIsDeleteOpen(false)
      setDeleteId(null)
      fetchUsers()
    }
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">{users.length} utilisateur(s)</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date création</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.nom}</TableCell>
                <TableCell>{user.prenom}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.date_creation).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleOpenDialog(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive" 
                        onClick={() => {
                          setDeleteId(user.id)
                          setIsDeleteOpen(true)
                        }}
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

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Modifier' : 'Nouvel'} utilisateur
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                placeholder="Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mot_de_passe">
                Mot de passe {editingUser ? '(laisser vide pour ne pas changer)' : '*'}
              </Label>
              <div className="relative">
                <Input
                  id="mot_de_passe"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.mot_de_passe}
                  onChange={(e) => setFormData(prev => ({ ...prev, mot_de_passe: e.target.value }))}
                  placeholder="••••••••"
                  required={!editingUser}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">{editingUser ? 'Enregistrer' : 'Créer'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Annuler
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
