import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronUp, ChevronDown } from "lucide-react";
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
import ProductListItem from "@/components/products/ProductItem"; // Assume this is a component for a single product
import { toast } from "sonner";

// Import API service functions (if needed) and Product interface
import type { Product } from "@/API/productService";

// Define props for the ProductList component
interface ProductListProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onEditProduct,
  onDeleteProduct,
}) => {
  // Local state for search, filtering, and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "appetizers", label: "Appetizers" },
    { value: "main_dishes", label: "Main Dishes" },
    { value: "pasta", label: "Pasta" },
    { value: "pizzas", label: "Pizzas" },
    { value: "desserts", label: "Desserts" },
    { value: "beverages", label: "Beverages" },
  ];

  // Filter products based on search term and selected category.
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      }
    });

  // Toggle sort order between ascending and descending
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="space-y-6">
      {/* Search and filter controls */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-2 border rounded"
          />
        </div>
        <div>
          {/* Category Dropdown */}
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded">
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <div>
            {/* Sort By Dropdown */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "name" | "price")} className="p-2 border rounded">
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
          <Button variant="outline" size="icon" onClick={toggleSortOrder}>
            {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No products found in this category</p>
          <Button onClick={() => toast.info("Add a product via the admin panel")}>
            <PlusCircle size={16} className="mr-2" />
            Add New Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            // Use product._id (the default MongoDB id) as the key
            <ProductListItem
              key={product._id}
              product={product}
              onEdit={() => onEditProduct(product)}
              onDelete={() => onDeleteProduct(product._id || "")} // Ensure _id is passed
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
