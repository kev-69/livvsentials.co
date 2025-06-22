import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  PlusCircle,
  Filter,
  Pencil,
  Trash,
  Loader2,
  AlertCircle
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';

// Import product components
import ProductCard from '@/components/cards/ProductCard';
import ViewProduct from '@/components/modals/ViewProduct';
import AddProduct from '@/components/modals/AddProduct';
import EditProduct from '@/components/modals/EditProduct';
import DeleteProduct from '@/components/modals/DeleteProduct';

// Import API functions
import { 
  fetchProducts, 
  fetchCategories, 
  deleteProduct,
  addCategory,
  updateCategory,
  deleteCategory
} from '@/lib/api';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  slug: string;
  stockQuantity: number;
  salePrice: number;
  inStock: boolean;
  productImages: string[];
  categoryId: string
  category: {
    id: string;
    name: string;
  }
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
}

// Import new components for category management
import AddCategory from '@/components/modals/AddCategory';
import EditCategory from '@/components/modals/EditCategory';
import DeleteCategory from '@/components/modals/DeleteCategory';

const ProductsTab = () => {
  const [productTab, setProductTab] = useState('all');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showViewProductModal, setShowViewProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // State for products
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);

  // Fetch products and categories on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Load products from API
  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      setProductError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProductError('Failed to load products. Please try again later.');
    } finally {
      setLoadingProducts(false);
    }
  };

  // Load categories from API
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoryError(null);
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategoryError('Failed to load categories. Please try again later.');
    } finally {
      setLoadingCategories(false);
    }
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === 'all' || 
      product.categoryId === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Get products by stock status
  const inStockProducts = filteredProducts.filter(p => p.inStock);
  const outOfStockProducts = filteredProducts.filter(p => !p.inStock);

  // Handle deleting a product
  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
        setProducts(products.filter(p => p.id !== selectedProduct.id));
        toast.success('Product deleted successfully');
      } catch (error: any) {
        // Check for foreign key constraint error related to order items
        if (error.response?.data?.message?.includes('foreign key constraint') || 
            error.response?.data?.message?.includes('order items') ||
            error.response?.data?.message?.includes('OrderItem')) {
          toast.error('Cannot delete this product because it exists in customer orders. Consider marking it as out of stock instead.');
        } else {
          toast.error(error.response?.data?.message || 'Failed to delete product');
        }
        console.error('Error deleting product:', error);
      } finally {
        setShowDeleteConfirmModal(false);
        setSelectedProduct(null);
      }
    }
  };

  // Handle saving a new or updated category
  const handleSaveCategory = async (categoryData: any) => {
    try {
      let updatedCategory: Category;
      
      if (categoryData.id) {
        // Update existing category
        updatedCategory = await updateCategory(categoryData.id, categoryData);
        toast.success('Category updated successfully');
        
        // Update local state
        setCategories(categories.map(c => 
          c.id === updatedCategory.id ? updatedCategory : c
        ));
      } else {
        // Create new category
        updatedCategory = await addCategory(categoryData);
        toast.success('Category created successfully');
        
        // Update local state
        setCategories([...categories, updatedCategory]);
      }
      
      setShowAddCategoryModal(false);
      setShowEditCategoryModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
      console.error('Error saving category:', error);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      try {
        await deleteCategory(selectedCategory.id);
        setCategories(categories.filter(c => c.id !== selectedCategory.id));
        toast.success('Category deleted successfully');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete category');
        console.error('Error deleting category:', error);
      } finally {
        setShowDeleteCategoryModal(false);
        setSelectedCategory(null);
      }
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white">Products</h1>
        <Button onClick={() => {
          setShowAddProductModal(true);
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

        {/* All Products Tab */}
        <TabsContent value="all" className="space-y-4">
          {/* Search and filter row */}
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="icon" className="dark:border-gray-700">
                <Filter className="h-4 w-4" />
              </Button>
              <Select 
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
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

          {/* Error message */}
          {productError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{productError}</AlertDescription>
            </Alert>
          )}

          {/* Loading state */}
          {loadingProducts ? (
            <div className="flex justify-center items-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No products found.
            </div>
          ) : (
            /* Products grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    ...product,
                    inStock: product.inStock,
                    price: product.price,
                    salePrice: product.salePrice,
                    category: categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'
                  }}
                  onView={(product) => {
                    setSelectedProduct(product);
                    setShowViewProductModal(true);
                  }}
                  onEdit={(product) => {
                    setSelectedProduct(product);
                    setShowEditProductModal(true);
                  }}
                  onDelete={(product: any) => {
                    setSelectedProduct(product);
                    setShowDeleteConfirmModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* In Stock Tab */}
        <TabsContent value="in-stock" className="space-y-4">
          {productError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{productError}</AlertDescription>
            </Alert>
          )}

          {loadingProducts ? (
            <div className="flex justify-center items-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : inStockProducts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No in-stock products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {inStockProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    ...product,
                    inStock: product.inStock,
                    price: product.price,
                    salePrice: product.salePrice,
                    category: categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'
                  }}
                  onView={(product) => {
                    setSelectedProduct(product);
                    setShowViewProductModal(true);
                  }}
                  onEdit={(product) => {
                    setSelectedProduct(product);
                    setShowEditProductModal(true);
                  }}
                  onDelete={(product: any) => {
                    setSelectedProduct(product);
                    setShowDeleteConfirmModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Out of Stock Tab */}
        <TabsContent value="out-of-stock" className="space-y-4">
          {productError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{productError}</AlertDescription>
            </Alert>
          )}

          {loadingProducts ? (
            <div className="flex justify-center items-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : outOfStockProducts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No out-of-stock products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {outOfStockProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    ...product,
                    inStock: product.inStock,
                    price: product.price,
                    salePrice: product.salePrice,
                    category: categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'
                  }}
                  onView={(product) => {
                    setSelectedProduct(product);
                    setShowViewProductModal(true);
                  }}
                  onEdit={(product) => {
                    setSelectedProduct(product);
                    setShowEditProductModal(true);
                  }}
                  onDelete={(product: any) => {
                    setSelectedProduct(product);
                    setShowDeleteConfirmModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          {/* Categories management UI */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium dark:text-white">Product Categories</h2>
            <Button size="sm" onClick={() => {
              setSelectedCategory(null);
              setShowAddCategoryModal(true);
            }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
          
          {/* Error message */}
          {categoryError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{categoryError}</AlertDescription>
            </Alert>
          )}

          {/* Loading state or table */}
          {loadingCategories ? (
            <div className="flex justify-center items-center h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No categories found. Create your first category to get started.
            </div>
          ) : (
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
                  {categories.map(category => {
                    // Count products in this category
                    const productCount = products.filter(p => p.categoryId === category.id).length;
                    
                    return (
                      <TableRow key={category.id} className="table-row">
                        <TableCell className="table-cell font-medium">{category.name}</TableCell>
                        <TableCell className="table-cell">{productCount}</TableCell>
                        <TableCell className="table-cell">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="table-cell text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="table-action-button"
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowEditCategoryModal(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 dark:text-red-400 table-action-button"
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowDeleteCategoryModal(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Product Modal */}
      <ViewProduct 
        open={showViewProductModal} 
        onOpenChange={setShowViewProductModal}
        product={selectedProduct ? {
          ...selectedProduct,
          isAvailable: selectedProduct.inStock,
          price: selectedProduct.price,
          salePrice: selectedProduct.salePrice,
          images: selectedProduct.productImages,
          category: categories.find(c => c.id === selectedProduct?.categoryId)?.name || 'Uncategorized'
        } : null}
        onEdit={() => {
          setShowViewProductModal(false);
          setShowEditProductModal(true);
        }}
        onDelete={() => {
          setShowViewProductModal(false);
          setShowDeleteConfirmModal(true);
        }}
      />

      {/* Add Product Modal */}
      <AddProduct
        open={showAddProductModal} 
        onOpenChange={setShowAddProductModal}
        categories={categories}
        onProductAdded={(newProduct) => {
          setProducts([...products, newProduct]);
          setShowAddProductModal(false);
        }}
      />

      {/* Edit Product Modal */}
      <EditProduct
        open={showEditProductModal} 
        onOpenChange={setShowEditProductModal}
        product={selectedProduct}
        categories={categories}
        onProductUpdated={(updatedProduct) => {
          setProducts(products.map(p => 
            p.id === updatedProduct.id ? updatedProduct : p
          ));
          setShowEditProductModal(false);
        }}
      />

      {/* Delete Product Confirmation Modal */}
      <DeleteProduct
        open={showDeleteConfirmModal}
        onOpenChange={setShowDeleteConfirmModal}
        productName={selectedProduct?.name || ""}
        onConfirm={handleDeleteProduct}
      />

      {/* Add Category Modal */}
      <AddCategory
        open={showAddCategoryModal}
        onOpenChange={setShowAddCategoryModal}
        onSave={handleSaveCategory}
      />

      {/* Edit Category Modal */}
      <EditCategory
        open={showEditCategoryModal}
        onOpenChange={setShowEditCategoryModal}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />

      {/* Delete Category Confirmation Modal */}
      <DeleteCategory
        open={showDeleteCategoryModal}
        onOpenChange={setShowDeleteCategoryModal}
        categoryName={selectedCategory?.name || ""}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
};

export default ProductsTab;