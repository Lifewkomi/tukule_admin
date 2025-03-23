
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import OrderItem from "./OrderItem";

interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";
export type OrderType = "dine-in" | "takeaway" | "delivery";

export interface Order {
  id: string;
  customerName: string;
  customerAddress?: string;
  orderType: OrderType;
  status: OrderStatus;
  tableId?: string;
  tableName?: string;
  timestamp: string;
  totalAmount: number;
  products: OrderProduct[];
  specialInstructions?: string;
}

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.tableName && order.tableName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesOrderType = orderTypeFilter === "all" || order.orderType === orderTypeFilter;

    return matchesSearch && matchesStatus && matchesOrderType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by order ID, customer name or table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={orderTypeFilter}
            onValueChange={setOrderTypeFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="dine-in">Dine-in</SelectItem>
              <SelectItem value="takeaway">Takeaway</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredOrders.map((order) => (
            <OrderItem 
              key={order.id} 
              order={order} 
              onUpdateStatus={onUpdateStatus} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
