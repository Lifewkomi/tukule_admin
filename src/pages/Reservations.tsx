
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, Users } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import TableVisualization from "@/components/reservations/TableVisualization";
import ReservationList from "@/components/reservations/ReservationList";
import ReservationDetails from "@/components/reservations/ReservationDetails";
import { toast } from "sonner";

// Demo data
const demoTables = [
  { id: "1", name: "Table 1", capacity: 2, status: "available", x: -5, y: -5, width: 1, length: 1 },
  { id: "2", name: "Table 2", capacity: 2, status: "reserved", x: -3, y: -5, width: 1, length: 1 },
  { id: "3", name: "Table 3", capacity: 4, status: "available", x: -1, y: -5, width: 1.2, length: 1.8 },
  { id: "4", name: "Table 4", capacity: 4, status: "occupied", x: 1, y: -5, width: 1.2, length: 1.8 },
  { id: "5", name: "Table 5", capacity: 4, status: "reserved", x: 3, y: -5, width: 1.2, length: 1.8 },
  { id: "6", name: "Table 6", capacity: 6, status: "available", x: 5, y: -5, width: 2, length: 1.8 },
  { id: "7", name: "Table 7", capacity: 2, status: "available", x: -5, y: -1, width: 1, length: 1 },
  { id: "8", name: "Table 8", capacity: 2, status: "occupied", x: -3, y: -1, width: 1, length: 1 },
  { id: "9", name: "Table 9", capacity: 4, status: "reserved", x: -1, y: -1, width: 1.2, length: 1.8 },
  { id: "10", name: "Table 10", capacity: 4, status: "available", x: 1, y: -1, width: 1.2, length: 1.8 },
  { id: "11", name: "Table 11", capacity: 6, status: "available", x: 3, y: -1, width: 2, length: 1.8 },
  { id: "12", name: "Table 12", capacity: 8, status: "occupied", x: -4, y: 3, width: 3, length: 1.8 },
  { id: "13", name: "Table 13", capacity: 8, status: "available", x: 0, y: 3, width: 3, length: 1.8 },
  { id: "14", name: "Table 14", capacity: 2, status: "reserved", x: 4, y: 3, width: 1, length: 1 },
  { id: "15", name: "Table 15", capacity: 2, status: "available", x: 6, y: 3, width: 1, length: 1 },
];

const demoReservations = [
  {
    id: "1",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "555-123-4567",
    date: "2023-08-15",
    time: "7:00 PM",
    partySize: 4,
    tableId: "5",
    tableName: "Table 5",
    status: "confirmed",
  },
  {
    id: "2",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    customerPhone: "555-987-6543",
    date: "2023-08-15",
    time: "8:00 PM",
    partySize: 2,
    tableId: "2",
    tableName: "Table 2",
    status: "pending",
    specialRequests: "Anniversary celebration, would like a quiet corner if possible.",
  },
  {
    id: "3",
    customerName: "Michael Johnson",
    customerEmail: "michael.j@example.com",
    customerPhone: "555-456-7890",
    date: "2023-08-16",
    time: "6:30 PM",
    partySize: 6,
    tableId: "6",
    tableName: "Table 6",
    status: "cancelled",
  },
  {
    id: "4",
    customerName: "Emily Brown",
    customerEmail: "emily.b@example.com",
    customerPhone: "555-567-1234",
    date: "2023-08-16",
    time: "7:30 PM",
    partySize: 3,
    tableId: "9",
    tableName: "Table 9",
    status: "confirmed",
    specialRequests: "One person has a gluten allergy.",
  },
  {
    id: "5",
    customerName: "David Wilson",
    customerEmail: "david.w@example.com",
    customerPhone: "555-678-2345",
    date: "2023-08-17",
    time: "6:00 PM",
    partySize: 2,
    tableId: "14",
    tableName: "Table 14",
    status: "confirmed",
  },
];

const Reservations: React.FC = () => {
  const [tables, setTables] = useState(demoTables);
  const [reservations, setReservations] = useState(demoReservations);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<typeof demoReservations[0] | null>(null);
  const [isReservationDetailsOpen, setIsReservationDetailsOpen] = useState(false);

  const handleTableClick = (tableId: string) => {
    setSelectedTable(tableId);
    const tableReservations = reservations.filter(
      (res) => res.tableId === tableId && res.status !== "cancelled"
    );
    
    if (tableReservations.length > 0) {
      setSelectedReservation(tableReservations[0]);
      setIsReservationDetailsOpen(true);
    } else {
      toast.info(`Table ${tables.find(t => t.id === tableId)?.name} has no active reservations.`);
    }
  };

  const handleUpdateReservationStatus = (reservationId: string, status: "confirmed" | "cancelled") => {
    try {
      // Update reservation status
      const updatedReservations = reservations.map((res) =>
        res.id === reservationId ? { ...res, status } : res
      );
      setReservations(updatedReservations);
      
      // If cancelled, update table status if it was reserved for this reservation
      if (status === "cancelled") {
        const reservation = reservations.find((res) => res.id === reservationId);
        if (reservation) {
          const tableId = reservation.tableId;
          setTables(tables.map((table) =>
            table.id === tableId && table.status === "reserved"
              ? { ...table, status: "available" }
              : table
          ));
        }
      }
      
      // If confirmed, update table status to reserved
      if (status === "confirmed") {
        const reservation = reservations.find((res) => res.id === reservationId);
        if (reservation) {
          const tableId = reservation.tableId;
          setTables(tables.map((table) =>
            table.id === tableId && table.status === "available"
              ? { ...table, status: "reserved" }
              : table
          ));
        }
      }
      
      toast.success(
        status === "confirmed"
          ? "Reservation confirmed successfully"
          : "Reservation cancelled successfully"
      );
    } catch (error) {
      console.error("Error updating reservation status:", error);
      toast.error("Failed to update reservation status");
    }
  };

  const handleViewReservationDetails = (reservationId: string) => {
    const reservation = reservations.find((res) => res.id === reservationId);
    if (reservation) {
      setSelectedReservation(reservation);
      setIsReservationDetailsOpen(true);
    }
  };

  return (
    <div className="page-transition space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="section-heading mb-0">Reservation Management</h2>
      </div>
      
      <Tabs defaultValue="visualization">
        <TabsList>
          <TabsTrigger value="visualization">
            <Calendar className="h-4 w-4 mr-2" />
            Table Visualization
          </TabsTrigger>
          <TabsTrigger value="list">
            <CalendarDays className="h-4 w-4 mr-2" />
            Reservation List
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualization" className="pt-6">
          <TableVisualization 
            tables={tables} 
            onTableClick={handleTableClick} 
          />
        </TabsContent>
        
        <TabsContent value="list" className="pt-6">
          <ReservationList 
            reservations={reservations} 
            onViewDetails={handleViewReservationDetails}
            onUpdateStatus={handleUpdateReservationStatus}
          />
        </TabsContent>
      </Tabs>
      
      <ReservationDetails 
        reservation={selectedReservation}
        isOpen={isReservationDetailsOpen}
        onClose={() => setIsReservationDetailsOpen(false)}
        onUpdateStatus={handleUpdateReservationStatus}
      />
    </div>
  );
};

export default Reservations;
