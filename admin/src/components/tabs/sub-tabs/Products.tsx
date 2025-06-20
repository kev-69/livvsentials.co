import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  PlusCircle,
  Filter,
  Pencil,
  Trash
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import product components
import ProductCard from '@/components/cards/ProductCard';
import ViewProduct from '@/components/modals/ViewProduct';
import EditProduct from '@/components/modals/EditProduct';
import DeleteProduct from '@/components/modals/DeleteProduct';
import { sampleCategories, sampleProducts } from '@/data/data';

const ProductsTab = () => {
  const [productTab, setProductTab] = useState('all');
  const [showViewProductModal, setShowViewProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState(sampleProducts);
  const [categories, setCategories] = useState(sampleCategories);

  const handleSaveProduct = (updatedProduct: any) => {
    // For a new product
    if (!updatedProduct.id) {
      const newProduct = {
        ...updatedProduct,
        id: `PROD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      };
      setProducts([...products, newProduct]);
    } else {
      // For updating an existing product
      setProducts(products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ));
    }
    setShowEditProductModal(false);
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setShowDeleteConfirmModal(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">Products</h1>
        <Button onClick={() => {
          setSelectedProduct(null);
          setShowEditProductModal(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Tabs defaultValue={productTab} onValueChange={setProductTab} className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="in-stock">In Stock</TabsTrigger>
          <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Search and filter row */}
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-8"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="icon" className="dark:border-gray-700">
                <Filter className="h-4 w-4" />
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onView={(p) => {
                  setSelectedProduct(p);
                  setShowViewProductModal(true);
                }}
                onEdit={(p) => {
                  setSelectedProduct(p);
                  setShowEditProductModal(true);
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in-stock" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.filter(p => p.isAvailable).map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onView={(p) => {
                  setSelectedProduct(p);
                  setShowViewProductModal(true);
                }}
                onEdit={(p) => {
                  setSelectedProduct(p);
                  setShowEditProductModal(true);
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="out-of-stock" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.filter(p => !p.isAvailable).map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onView={(p) => {
                  setSelectedProduct(p);
                  setShowViewProductModal(true);
                }}
                onEdit={(p) => {
                  setSelectedProduct(p);
                  setShowEditProductModal(true);
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {/* Categories management UI */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium dark:text-white">Product Categories</h2>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
          
          <div className="table-container">
            <Table>
              <TableHeader className="table-header">
                <TableRow className="table-row">
                  <TableHead className="table-header-cell">Name</TableHead>
                  <TableHead className="table-header-cell">Products</TableHead>
                  <TableHead className="table-header-cell">Created</TableHead>
                  <TableHead className="table-header-cell text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(category => (
                  <TableRow key={category.id} className="table-row">
                    <TableCell className="table-cell font-medium">{category.name}</TableCell>
                    <TableCell className="table-cell">{category.productCount}</TableCell>
                    <TableCell className="table-cell">{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="table-cell text-right">
                      <Button variant="ghost" size="icon" className="table-action-button">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 dark:text-red-400 table-action-button">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Product Modal */}
      <ViewProduct 
        open={showViewProductModal} 
        onOpenChange={setShowViewProductModal}
        product={selectedProduct}
        onEdit={() => {
          setShowViewProductModal(false);
          setShowEditProductModal(true);
        }}
        onDelete={() => {
          setShowViewProductModal(false);
          setShowDeleteConfirmModal(true);
        }}
      />

      {/* Edit Product Modal */}
      <EditProduct
        open={showEditProductModal} 
        onOpenChange={setShowEditProductModal}
        product={selectedProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteProduct
        open={showDeleteConfirmModal}
        onOpenChange={setShowDeleteConfirmModal}
        productName={selectedProduct?.name || ""}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductsTab;