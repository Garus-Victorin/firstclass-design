'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, MoreHorizontal, Upload, X, Search, Grid, List, Filter, Eye, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
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

interface Category {
  id: string
  lebele: string
  description?: string
}

interface Product {
  id: number
  name: string
  original_price: number | null
  description: string | null
  image: string
  sizes: string[]
  stock: number
  category_ids: string[]
  created_at: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    original_price: '',
    description: '',
    image: '',
    sizes: '',
    stock: '0',
    category_ids: [] as string[]
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [loading, setLoading] = useState(true)

  // Filter products
  const filteredProducts = products

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    // Products
    const { data: prodData } = await supabase
      .from('products')
      .select('*')
    
    // Categories
    const { data: catData } = await supabase
      .from('categories')
      .select('*')
    
    setProducts(prodData || [])
    setCategories(catData || [])
    setLoading(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData({...formData, image: ''})
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement')
    }
    
    const data = await response.json()
    return data.url
  }

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product)
    setIsViewOpen(true)
  }

  const handleOpenForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        original_price: product.original_price?.toString() || '',
        description: product.description || '',
        image: product.image,
        sizes: product.sizes.join(', '),
        stock: product.stock.toString(),
        category_ids: product.category_ids || []
      })
      setImagePreview(product.image)
      setImageFile(null)
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        original_price: '',
        description: '',
        image: '',
        sizes: '',
        stock: '0',
        category_ids: []
      })
      setImagePreview('')
      setImageFile(null)
    }
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let imageUrl = formData.image
    
    // Upload image if a new file is selected
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile)
      } catch (error) {
        alert('Erreur lors du téléchargement de l\'image')
        return
      }
    }
    
    const data = {
      ...formData,
      image: imageUrl,
      stock: parseInt(formData.stock),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null
    }

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(data)
        .eq('id', editingProduct.id)
      if (error) alert('Erreur: ' + error.message)
    } else {
      const { error } = await supabase
        .from('products')
        .insert([data])
      if (error) alert('Erreur: ' + error.message)
    }

    setIsFormOpen(false)
    fetchData()
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteId)
    
    if (error) alert('Erreur: ' + error.message)
    else {
      setIsDeleteOpen(false)
      setDeleteId(null)
      fetchData()
    }
  }

  if (loading) return <div className="p-8 text-center">Chargement...</div>

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">Gérez votre catalogue de produits en toute simplicité</p>
        </div>
        <Button 
          onClick={() => handleOpenForm()} 
          className="bg-orange-500 hover:bg-orange-600 h-10 sm:h-11 px-4 sm:px-6 whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
              <img 
                src={product.image || '/placeholder.jpg'} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="mb-3">
                <h3 className="font-semibold text-base lg:text-lg line-clamp-2 mb-1 min-h-[3rem]">{product.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{product.description || 'Aucune description'}</p>
              </div>
              
              {product.category_ids?.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {product.category_ids.slice(0, 2).map((catId) => {
                    const category = categories.find(c => c.id === catId)
                    return category ? (
                      <Badge key={catId} className="bg-orange-500 text-white text-xs px-2 py-0.5">
                        {category.lebele}
                      </Badge>
                    ) : null
                  })}
                  {product.category_ids.length > 2 && (
                    <Badge className="bg-gray-500 text-white text-xs px-2 py-0.5">
                      +{product.category_ids.length - 2}
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Prix</p>
                  <p className="font-bold text-sm lg:text-base">
                    {product.original_price ? `${product.original_price.toLocaleString()} FCFA` : '—'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">Stock</p>
                  <Badge 
                    className={
                      product.stock === 0 
                        ? 'bg-red-600 text-white'
                        : product.stock < 5 
                        ? 'bg-red-500 text-white'
                        : product.stock < 10 
                        ? 'bg-yellow-500 text-white'
                        : 'bg-green-500 text-white'
                    }
                  >
                    {product.stock}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2 mt-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-9 text-xs sm:text-sm font-medium"
                  onClick={() => handleViewProduct(product)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  Voir
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 px-3"
                  onClick={() => handleOpenForm(product)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="h-9 px-3"
                  onClick={() => {
                    setDeleteId(product.id.toString())
                    setIsDeleteOpen(true)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog View Product */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-[96vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl max-h-[96vh] overflow-y-auto">
          <DialogHeader className="pb-4 sm:pb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsViewOpen(false)}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-xl sm:text-2xl font-semibold">
                Détails du produit
              </DialogTitle>
            </div>
          </DialogHeader>
          {viewingProduct && (
            <div className="space-y-6">
              {/* Image */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                <img 
                  src={viewingProduct.image || '/placeholder.jpg'} 
                  alt={viewingProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-sm text-gray-600">Nom du produit</Label>
                  <p className="text-base font-semibold">{viewingProduct.name}</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm text-gray-600">Prix original</Label>
                  <p className="text-base font-semibold text-orange-600">
                    {viewingProduct.original_price ? `${viewingProduct.original_price.toLocaleString()} FCFA` : 'Non défini'}
                  </p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm text-gray-600">Stock disponible</Label>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={
                        viewingProduct.stock === 0 
                          ? 'bg-red-600 text-white'
                          : viewingProduct.stock < 5 
                          ? 'bg-red-500 text-white'
                          : viewingProduct.stock < 10 
                          ? 'bg-yellow-500 text-white'
                          : 'bg-green-500 text-white'
                      }
                    >
                      {viewingProduct.stock} unités
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-sm text-gray-600">Description</Label>
                  <p className="text-base text-gray-700">
                    {viewingProduct.description || 'Aucune description'}
                  </p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-sm text-gray-600">Catégories</Label>
                  <div className="flex gap-2 flex-wrap">
                    {viewingProduct.category_ids?.length > 0 ? (
                      viewingProduct.category_ids.map((catId) => {
                        const category = categories.find(c => c.id === catId)
                        return category ? (
                          <Badge key={catId} className="bg-orange-500 text-white">
                            {category.lebele}
                          </Badge>
                        ) : null
                      })
                    ) : (
                      <span className="text-sm text-gray-500">Aucune catégorie</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-sm text-gray-600">Tailles disponibles</Label>
                  <div className="flex gap-2 flex-wrap">
                    {viewingProduct.sizes?.length > 0 ? (
                      viewingProduct.sizes.map((size) => (
                        <Badge key={size} className="bg-orange-500 text-white font-mono">
                          {size}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Aucune taille</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-sm text-gray-600">Date de création</Label>
                  <p className="text-base">
                    {new Date(viewingProduct.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsViewOpen(false)}
                  className="h-10 sm:h-11 px-4 sm:px-6"
                >
                  Fermer
                </Button>
                <Button 
                  type="button"
                  className="h-10 sm:h-11 px-4 sm:px-6 bg-orange-500 hover:bg-orange-600"
                  onClick={() => {
                    setIsViewOpen(false)
                    handleOpenForm(viewingProduct)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-[96vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl max-h-[96vh] overflow-y-auto">
          <DialogHeader className="pb-4 sm:pb-6">
            <DialogTitle className="text-xl sm:text-2xl font-semibold">
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Image Section */}
            <div className="space-y-3 sm:space-y-4">
              <Label className="text-base sm:text-lg font-medium">Image du produit</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 hover:border-gray-400 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Prévisualisation" 
                      className="w-full h-40 sm:h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                    <div className="mt-3 sm:mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 sm:h-10"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choisir une image
                      </Button>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-gray-500">
                      PNG, JPG, WEBP jusqu'à 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <Label className="text-base sm:text-lg font-medium">Informations générales</Label>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm">Nom du produit *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: T-shirt Premium"
                      className="h-10 sm:h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm">Description</Label>
                    <textarea
                      id="description"
                      className="w-full p-3 sm:p-4 border rounded-lg min-h-[100px] sm:min-h-[120px] resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Décrivez votre produit..."
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3 sm:space-y-4">
                <Label className="text-base sm:text-lg font-medium">Catégories</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      type="button"
                      variant="outline"
                      className={`h-10 sm:h-12 justify-start text-xs sm:text-sm ${
                        formData.category_ids?.includes(cat.id) 
                          ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600" 
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        const isSelected = formData.category_ids?.includes(cat.id)
                        const newIds = isSelected
                          ? (formData.category_ids || []).filter(id => id !== cat.id)
                          : [...(formData.category_ids || []), cat.id]
                        setFormData({...formData, category_ids: newIds})
                      }}
                    >
                      {cat.lebele}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price & Stock */}
              <div className="space-y-3 sm:space-y-4">
                <Label className="text-base sm:text-lg font-medium">Prix et stock</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="original_price" className="text-sm">Prix original (FCFA)</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      value={formData.original_price}
                      onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                      placeholder="25000"
                      className="h-10 sm:h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-sm">Stock disponible *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="10"
                      className="h-10 sm:h-12"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-3 sm:space-y-4">
                <Label className="text-base sm:text-lg font-medium">Tailles disponibles</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'].map((size) => {
                    const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean)
                    const isSelected = sizesArray.includes(size)
                    return (
                      <Button
                        key={size}
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`h-9 sm:h-10 text-xs sm:text-sm ${
                          isSelected 
                            ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600" 
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          const newSizes = isSelected
                            ? sizesArray.filter(s => s !== size)
                            : [...sizesArray, size]
                          setFormData({...formData, sizes: newSizes.join(', ')})
                        }}
                      >
                        {size}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsFormOpen(false)}
                className="h-10 sm:h-11 px-4 sm:px-6"
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                className="h-10 sm:h-11 px-4 sm:px-6 bg-orange-500 hover:bg-orange-600"
              >
                {editingProduct ? 'Enregistrer' : 'Créer le produit'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Confirmer suppression</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Supprimer ce produit ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteOpen(false)}
              className="h-10"
            >
              Annuler
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleConfirmDelete}
              className="h-10"
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
