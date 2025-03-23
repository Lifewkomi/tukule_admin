
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface ProductItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onEdit, onDelete }) => {
  const categoryNames: Record<string, string> = {
    appetizers: "Appetizers",
    main_dishes: "Main Dishes",
    pasta: "Pasta",
    pizzas: "Pizzas",
    desserts: "Desserts",
    beverages: "Beverages",
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="h-44 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {categoryNames[product.category] || product.category}
            </CardDescription>
          </div>
          <span className="text-lg font-medium">
            {formatPrice(product.price)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(product)}
        >
          <Edit size={16} className="mr-2" />
          Edit
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              <Trash size={16} className="mr-2" />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{product.name}"?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                variant="destructive" 
                onClick={() => onDelete(product.id)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ProductItem;
