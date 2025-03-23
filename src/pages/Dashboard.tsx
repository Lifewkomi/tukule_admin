
import React from "react";
import StatCard from "@/components/dashboard/StatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SalesChart from "@/components/dashboard/SalesChart";
import { 
  CalendarClock, 
  ChefHat, 
  DollarSign, 
  TrendingUp, 
  Users 
} from "lucide-react";

// Demo data
const salesData = [
  { name: "Monday", value: 1200 },
  { name: "Tuesday", value: 1400 },
  { name: "Wednesday", value: 1800 },
  { name: "Thursday", value: 1600 },
  { name: "Friday", value: 2200 },
  { name: "Saturday", value: 2600 },
  { name: "Sunday", value: 2400 },
];

const recentActivities = [
  {
    id: "1",
    type: "reservation",
    message: "New reservation from John Doe for 4 people",
    time: "5 minutes ago",
    status: "pending",
  },
  {
    id: "2",
    type: "order",
    message: "New order #12345 - Table 4",
    time: "15 minutes ago",
    status: "completed",
  },
  {
    id: "3",
    type: "reservation",
    message: "Reservation #789 cancelled by customer",
    time: "1 hour ago",
    status: "cancelled",
  },
  {
    id: "4",
    type: "order",
    message: "Order #12340 is ready for delivery",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: "5",
    type: "system",
    message: "System maintenance scheduled for tonight at 2 AM",
    time: "3 hours ago",
  },
];

const Dashboard: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="page-transition space-y-6">
      <div>
        <h2 className="section-heading">Dashboard Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Reservations" 
          value="124" 
          icon={<CalendarClock size={20} />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Total Orders" 
          value="67" 
          icon={<ChefHat size={20} />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard 
          title="Daily Revenue" 
          value={formatCurrency(3245.75)} 
          icon={<DollarSign size={20} />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="Table Occupancy" 
          value="68%" 
          icon={<Users size={20} />}
          trend={{ value: 3, isPositive: false }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesChart 
          data={salesData} 
          title="Weekly Sales" 
          description="Revenue for the past 7 days"
          className="lg:col-span-2"
        />
        <RecentActivity activities={recentActivities} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card shadow-sm rounded-xl border border-border/50 p-6">
          <h3 className="font-medium mb-4">Popular Menu Items</h3>
          <div className="space-y-4">
            {[
              { name: "Margherita Pizza", percentage: 85 },
              { name: "Spaghetti Carbonara", percentage: 72 },
              { name: "Caesar Salad", percentage: 68 },
              { name: "Tiramisu", percentage: 65 },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="text-muted-foreground">{item.percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary-foreground h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card shadow-sm rounded-xl border border-border/50 p-6">
          <h3 className="font-medium mb-4">Upcoming Reservations</h3>
          <div className="space-y-4">
            {[
              { name: "John Doe", time: "Today, 7:30 PM", people: 4, table: "Table 12" },
              { name: "Jane Smith", time: "Today, 8:00 PM", people: 2, table: "Table 5" },
              { name: "Michael Brown", time: "Tomorrow, 6:30 PM", people: 6, table: "Table 8" },
              { name: "Sarah Johnson", time: "Tomorrow, 7:45 PM", people: 3, table: "Table 10" },
            ].map((reservation, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border border-border rounded-md hover:bg-muted/40 transition-colors"
              >
                <div>
                  <p className="font-medium">{reservation.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground">{reservation.time}</span>
                    <span className="text-xs text-muted-foreground">{reservation.people} people</span>
                  </div>
                </div>
                <span className="text-sm font-medium">{reservation.table}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
