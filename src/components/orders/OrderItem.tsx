
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  ChevronRight, 
  MapPin, 
  User, 
  Utensils, 
  Home, 
  Truck,
  MessageSquare,
  Printer,
  MoreVertical
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerAddress?: string;
  orderType: "dine-in" | "takeaway" | "delivery";
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  tableId?: string;
  tableName?: string;
  timestamp: string;
  totalAmount: number;
  products: OrderProduct[];
  specialInstructions?: string;
}

interface OrderItemProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: string) => void;
}

const OrderTypeIcon = ({ orderType }: { orderType: Order["orderType"] }) => {
  switch (orderType) {
    case "dine-in":
      return <Utensils className="h-4 w-4" />;
    case "takeaway":
      return <Home className="h-4 w-4" />;
    case "delivery":
      return <Truck className="h-4 w-4" />;
    default:
      return null;
  }
};

const OrderItem: React.FC<OrderItemProps> = ({ order, onUpdateStatus }) => {
  const getStatusBadgeProps = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return { variant: "outline" as const, className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300" };
      case "preparing":
        return { variant: "outline" as const, className: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300" };
      case "ready":
        return { variant: "outline" as const, className: "bg-green-100 text-green-800 hover:bg-green-200 border-green-300" };
      case "completed":
        return { variant: "outline" as const, className: "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300" };
      case "cancelled":
        return { variant: "outline" as const, className: "bg-red-100 text-red-800 hover:bg-red-200 border-red-300" };
      default:
        return { variant: "outline" as const };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get the next possible status based on current status
  const getNextStatus = (currentStatus: Order["status"]) => {
    switch (currentStatus) {
      case "pending":
        return "preparing";
      case "preparing":
        return "ready";
      case "ready":
        return "completed";
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(order.status);
  const nextStatusText = nextStatus 
    ? {
        preparing: "Start Preparing",
        ready: "Mark as Ready",
        completed: "Complete Order"
      }[nextStatus]
    : null;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md",
      order.status === "pending" && "border-l-4 border-l-yellow-400",
      order.status === "preparing" && "border-l-4 border-l-blue-400",
      order.status === "ready" && "border-l-4 border-l-green-400",
      order.status === "completed" && "border-l-4 border-l-purple-400",
      order.status === "cancelled" && "border-l-4 border-l-red-400"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">Order #{order.id.slice(0, 8)}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {format(new Date(order.timestamp), "MMM d, h:mm a")}
            </CardDescription>
          </div>
          <Badge {...getStatusBadgeProps(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">{order.customerName}</p>
                {order.orderType === "dine-in" && order.tableName && (
                  <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                    <MapPin className="h-3 w-3 mr-1" />
                    Table: {order.tableName}
                  </p>
                )}
                {order.orderType === "delivery" && order.customerAddress && (
                  <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                    <MapPin className="h-3 w-3 mr-1" />
                    {order.customerAddress}
                  </p>
                )}
              </div>
            </div>
            
            <div className="px-2 py-1 rounded-full bg-secondary text-xs font-medium flex items-center space-x-1">
              <OrderTypeIcon orderType={order.orderType} />
              <span>
                {order.orderType === "dine-in" 
                  ? "Dine-in"
                  : order.orderType === "takeaway"
                  ? "Takeaway"
                  : "Delivery"
                }
              </span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">Items</span>
              <span className="text-muted-foreground">Qty × Price</span>
            </div>
            <Separator className="my-2" />
            <ul className="space-y-2">
              {order.products.map((product, index) => (
                <li key={index} className="text-sm flex justify-between">
                  <span>{product.name}</span>
                  <span className="text-muted-foreground">
                    {product.quantity} × {formatCurrency(product.price)}
                  </span>
                </li>
              ))}
            </ul>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium mt-2">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
          
          {order.specialInstructions && (
            <div className="mt-2 text-sm">
              <div className="flex items-start space-x-2 p-2 rounded-md bg-muted/50 border">
                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs">{order.specialInstructions}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => window.print()}
              className="cursor-pointer"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Order
            </DropdownMenuItem>
            {order.status !== "cancelled" && order.status !== "completed" && (
              <DropdownMenuItem 
                onClick={() => onUpdateStatus(order.id, "cancelled")}
                className="text-red-600 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4 mr-2" />
                Cancel Order
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {nextStatus && order.status !== "cancelled" && (
          <Button size="sm" onClick={() => onUpdateStatus(order.id, nextStatus)}>
            <ChevronRight className="h-4 w-4 mr-2" />
            {nextStatusText}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OrderItem;
