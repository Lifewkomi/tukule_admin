import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm from "@/components/products/ProductForm";
import ProductList from "@/components/products/ProductList";
import { toast } from "sonner";

// Import the API service functions from your services folder.
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/API/productService";

// Import the Product interface for type-checking.
import type { Product } from "@/API/productService";

const Products: React.FC = () => {
  // State for storing products fetched from the backend.
  const [products, setProducts] = useState<Product[]>([]);
  
  // Dialog states for adding and editing products.
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  
  // State for the product currently selected for editing.
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Active tab for filtering by product category.
  const [activeTab, setActiveTab] = useState("all");

  /**
   * Fetch products from the backend when the component mounts.
   * This uses the getAllProducts() function from our productService.
   */
  useEffect(() => {
    async function fetchProductsFromServer() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      }
    }
    fetchProductsFromServer();
  }, []);

  /**
   * Handle adding a new product.
   * Convert form data into an object matching our Product interface, then call createProduct().
   */
  const handleAddProduct = async (formData: FormData) => {
    try {
      // Build productData object from formData.
      const productData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category") as string,
        // For images: In a real app, upload the file and use the resulting URL.
        image: formData.get("image") ? URL.createObjectURL(formData.get("image") as File) : "",
        
      };

      // Call createProduct to add the product in the database.
      const newProduct = await createProduct(productData);
      
      // Update local state with the new product.
      setProducts((prev) => [...prev, newProduct]);
      setIsAddProductOpen(false);
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  /**
   * Handle editing an existing product.
   * Update product details and call updateProduct().
   */
  const handleEditProduct = async (formData: FormData) => {
    try {
      if (!selectedProduct) return;

      const productData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category") as string,
        // Update image only if a new one is provided.
        image: formData.get("image")
          ? URL.createObjectURL(formData.get("image") as File)
          : selectedProduct.image,
      };

      // Call updateProduct to update the product in the database.
      const updated = await updateProduct(selectedProduct._id || "", productData);

      // Update local state with the updated product.
      setProducts((prev) =>
        prev.map((prod) => (prod._id === selectedProduct._id ? updated : prod))
      );
      setIsEditProductOpen(false);
      setSelectedProduct(null);
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  /**
   * Handle deleting a product.
   * Calls deleteProduct and updates the local state by filtering out the deleted product.
   */
  const handleDeleteProduct = async (productId: string) => {
    try {
      // Log productId to verify it is defined and is the _id from MongoDB
      console.log("Deleting product with _id:", productId);
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  /**
   * When clicking the edit button, set the selected product and open the edit dialog.
   */
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  /**
   * Filter products based on the active tab (category).
   * If the active tab is "all", return all products; otherwise, filter by category.
   */
  const filteredProducts = 
    activeTab === "all" 
      ? products 
      : products.filter((product) => product.category === activeTab);

  return (
    <div className="page-transition space-y-6">
      {/* Header section with title and "Add New Product" button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="section-heading mb-0">Product Management</h2>
        <Button className="mt-4 sm:mt-0" onClick={() => setIsAddProductOpen(true)}>
          <PlusCircle size={16} className="mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Tabs for filtering products by category */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-border">
          <TabsList className="bg-transparent">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="appetizers">Appetizers</TabsTrigger>
            <TabsTrigger value="main_dishes">Main Dishes</TabsTrigger>
            <TabsTrigger value="pasta">Pasta</TabsTrigger>
            <TabsTrigger value="pizzas">Pizzas</TabsTrigger>
            <TabsTrigger value="desserts">Desserts</TabsTrigger>
            <TabsTrigger value="beverages">Beverages</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="pt-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products found in this category</p>
              <Button onClick={() => setIsAddProductOpen(true)}>
                <PlusCircle size={16} className="mr-2" />
                Add New Product
              </Button>
            </div>
          ) : (
            <ProductList
              products={filteredProducts}
              onEditProduct={handleEditClick}
              onDeleteProduct={(id) => handleDeleteProduct(id)}
            />
            
          )}
        </TabsContent>
      </Tabs>

      {/* Add Product Dialog on PRODUCTS page */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm onSubmit={handleAddProduct} />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog on PRODUCTS page*/}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm 
              product={selectedProduct} 
              onSubmit={handleEditProduct}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
