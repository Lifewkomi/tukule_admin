
import React, { useState } from "react";
import OrderList from "@/components/orders/OrderList";
import { toast } from "sonner";

// Demo data
const demoOrders = [
  {
    id: "ORD123456",
    customerName: "John Doe",
    customerAddress: "123 Main St, Cityville",
    orderType: "delivery",
    status: "pending",
    timestamp: "2023-08-15T19:30:00",
    totalAmount: 35.97,
    products: [
      { id: "1", name: "Margherita Pizza", price: 12.99, quantity: 1 },
      { id: "3", name: "Caesar Salad", price: 8.99, quantity: 1 },
      { id: "4", name: "Tiramisu", price: 7.99, quantity: 1 },
      { id: "7", name: "Sparkling Water", price: 2.00, quantity: 3 },
    ],
    specialInstructions: "Please ring the doorbell twice.",
  },
  {
    id: "ORD123457",
    customerName: "Jane Smith",
    orderType: "dine-in",
    status: "preparing",
    tableId: "5",
    tableName: "Table 5",
    timestamp: "2023-08-15T19:15:00",
    totalAmount: 42.97,
    products: [
      { id: "2", name: "Spaghetti Carbonara", price: 14.99, quantity: 1 },
      { id: "6", name: "Pepperoni Pizza", price: 14.99, quantity: 1 },
      { id: "5", name: "Bruschetta", price: 6.99, quantity: 1 },
      { id: "8", name: "Red Wine (Glass)", price: 6.00, quantity: 1 },
    ],
  },
  {
    id: "ORD123458",
    customerName: "David Johnson",
    orderType: "takeaway",
    status: "ready",
    timestamp: "2023-08-15T18:45:00",
    totalAmount: 29.98,
    products: [
      { id: "6", name: "Pepperoni Pizza", price: 14.99, quantity: 2 },
    ],
    specialInstructions: "Extra napkins please.",
  },
  {
    id: "ORD123459",
    customerName: "Sarah Williams",
    orderType: "dine-in",
    status: "completed",
    tableId: "10",
    tableName: "Table 10",
    timestamp: "2023-08-15T17:30:00",
    totalAmount: 64.95,
    products: [
      { id: "1", name: "Margherita Pizza", price: 12.99, quantity: 1 },
      { id: "2", name: "Spaghetti Carbonara", price: 14.99, quantity: 1 },
      { id: "3", name: "Caesar Salad", price: 8.99, quantity: 2 },
      { id: "4", name: "Tiramisu", price: 7.99, quantity: 2 },
      { id: "8", name: "Red Wine (Glass)", price: 6.00, quantity: 1 },
      { id: "9", name: "White Wine (Glass)", price: 5.00, quantity: 1 },
    ],
  },
  {
    id: "ORD123460",
    customerName: "Michael Brown",
    customerAddress: "456 Oak Ave, Townsville",
    orderType: "delivery",
    status: "cancelled",
    timestamp: "2023-08-15T18:00:00",
    totalAmount: 37.97,
    products: [
      { id: "6", name: "Pepperoni Pizza", price: 14.99, quantity: 1 },
      { id: "5", name: "Bruschetta", price: 6.99, quantity: 1 },
      { id: "4", name: "Tiramisu", price: 7.99, quantity: 2 },
    ],
    specialInstructions: "No contact delivery, please leave at the door.",
  },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState(demoOrders);

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    try {
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      
      setOrders(updatedOrders);
      
      const statusMessages = {
        pending: "Order marked as pending",
        preparing: "Order moved to preparation",
        ready: "Order marked as ready",
        completed: "Order completed successfully",
        cancelled: "Order cancelled successfully",
      };
      
      toast.success(statusMessages[newStatus as keyof typeof statusMessages] || "Order status updated");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="page-transition space-y-6">
      <div>
        <h2 className="section-heading">Order Management</h2>
      </div>
      
      <OrderList orders={orders} onUpdateStatus={handleUpdateOrderStatus} />
    </div>
  );
};

export default Orders;
