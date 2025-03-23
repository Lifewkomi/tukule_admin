
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";

interface ProductFormProps {
  onSubmit: (productData: FormData) => Promise<void>;
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
  };
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  product,
  isEditing = false,
}) => {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [category, setCategory] = useState(product?.category || "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }
    
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    
    if (!isEditing && !image) {
      toast.error("Please upload a product image");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create FormData for image upload
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      
      if (image) {
        formData.append("image", image);
      }
      
      if (isEditing && product?.id) {
        formData.append("id", product.id);
      }
      
      await onSubmit(formData);
      
      if (!isEditing) {
        // Reset form after submission if not editing
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setImage(null);
        setImagePreview(null);
      }
      
      toast.success(isEditing ? "Product updated successfully" : "Product added successfully");
    } catch (error) {
      console.error("Error submitting product form:", error);
      toast.error("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appetizers">Appetizers</SelectItem>
                <SelectItem value="main_dishes">Main Dishes</SelectItem>
                <SelectItem value="pasta">Pasta</SelectItem>
                <SelectItem value="pizzas">Pizzas</SelectItem>
                <SelectItem value="desserts">Desserts</SelectItem>
                <SelectItem value="beverages">Beverages</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex flex-col items-center space-y-4">
              {imagePreview ? (
                <div className="relative w-full h-40 rounded-md overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div 
                  className="w-full h-40 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => document.getElementById("image")?.click()}
                >
                  <ImagePlus size={24} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload image</p>
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setName(product?.name || "");
            setDescription(product?.description || "");
            setPrice(product?.price?.toString() || "");
            setCategory(product?.category || "");
            setImage(null);
            setImagePreview(product?.image || null);
          }}
        >
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              {isEditing ? "Updating..." : "Saving..."}
            </>
          ) : (
            isEditing ? "Update Product" : "Add Product"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
