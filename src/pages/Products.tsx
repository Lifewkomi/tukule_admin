import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, ListFilter } from "lucide-react";
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

// Demo data
const demoProducts = [
  {
    id: "1",
    name: "Margherita Pizza",
    description: "Classic tomato sauce, mozzarella cheese, and fresh basil on our homemade dough.",
    price: 12.99,
    category: "pizzas",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fHww",
  },
  {
    id: "2",
    name: "Spaghetti Carbonara",
    description: "Spaghetti with a creamy sauce of eggs, Pecorino Romano cheese, pancetta, and black pepper.",
    price: 14.99,
    category: "pasta",
    image: "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNwYWdoZXR0aSUyMGNhcmJvbmFyYXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "3",
    name: "Caesar Salad",
    description: "Romaine lettuce, croutons, Parmesan cheese, and our homemade Caesar dressing.",
    price: 8.99,
    category: "appetizers",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Flc2FyJTIwc2FsYWR8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "4",
    name: "Tiramisu",
    description: "Classic Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cream.",
    price: 7.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGlyYW1pc3V8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "5",
    name: "Bruschetta",
    description: "Toasted bread topped with diced tomatoes, fresh basil, garlic, and olive oil.",
    price: 6.99,
    category: "appetizers",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnJ1c2NoZXR0YXxlbnwwfHwwfHx8MA%3D",
  },
  {
    id: "6",
    name: "Pepperoni Pizza",
    description: "Classic tomato sauce, mozzarella cheese, and pepperoni on our homemade dough.",
    price: 14.99,
    category: "pizzas",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8fDA%3D",
  },
];

const Products: React.FC = () => {
  const [products, setProducts] = useState(demoProducts);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof demoProducts[0] | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const handleAddProduct = async (formData: FormData) => {
    try {
      // This would be an API call in a real implementation
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Generate a unique ID (in a real app, this would come from the backend)
      const newProductId = (Math.max(...products.map(p => parseInt(p.id))) + 1).toString();
      
      const newProduct = {
        id: newProductId,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category") as string,
        // In a real app, the image would be uploaded to a server and a URL would be returned
        // For this demo, we're using the first image in our dummy data
        image: URL.createObjectURL(formData.get("image") as File),
      };
      
      setProducts([...products, newProduct]);
      setIsAddProductOpen(false);
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  const handleEditProduct = async (formData: FormData) => {
    try {
      if (!selectedProduct) return;
      
      // This would be an API call in a real implementation
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const productId = selectedProduct.id;
      
      const updatedProduct = {
        id: productId,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category") as string,
        // If a new image was uploaded, use that, otherwise keep the existing image
        image: formData.get("image") 
          ? URL.createObjectURL(formData.get("image") as File)
          : selectedProduct.image,
      };
      
      setProducts(products.map(product => 
        product.id === productId ? updatedProduct : product
      ));
      
      setIsEditProductOpen(false);
      setSelectedProduct(null);
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      // This would be an API call in a real implementation
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setProducts(products.filter(product => product.id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEditClick = (product: typeof demoProducts[0]) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  // Filter products based on active tab
  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter(product => product.category === activeTab);

  return (
    <div className="page-transition space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="section-heading mb-0">Product Management</h2>
        <Button 
          className="mt-4 sm:mt-0"
          onClick={() => setIsAddProductOpen(true)}
        >
          <PlusCircle size={16} className="mr-2" />
          Add New Product
        </Button>
      </div>
      
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
              onDeleteProduct={handleDeleteProduct}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm onSubmit={handleAddProduct} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
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
