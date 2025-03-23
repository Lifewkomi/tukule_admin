
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  CheckCircle, 
  Clock, 
  Filter, 
  Search, 
  Users, 
  X 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  partySize: number;
  tableId: string;
  tableName: string;
  status: ReservationStatus;
  specialRequests?: string;
}

interface ReservationListProps {
  reservations: Reservation[];
  onViewDetails: (reservationId: string) => void;
  onUpdateStatus: (reservationId: string, status: ReservationStatus) => void;
}

const ReservationList: React.FC<ReservationListProps> = ({
  reservations,
  onViewDetails,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string>("all");
  
  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch = 
      reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customerPhone.includes(searchTerm) ||
      reservation.tableName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = date 
      ? reservation.date === format(date, "yyyy-MM-dd")
      : true;
    
    const matchesStatus = status === "all" || reservation.status === status;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
              {date && (
                <div className="flex justify-center pb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDate(undefined)}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          
          <Select
            value={status}
            onValueChange={setStatus}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>People</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No reservations found
                </TableCell>
              </TableRow>
            ) : (
              filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{reservation.customerName}</p>
                      <p className="text-sm text-muted-foreground">{reservation.customerPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{format(new Date(reservation.date), "PP")}</p>
                        <p className="text-sm text-muted-foreground">{reservation.time}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{reservation.partySize}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{reservation.tableName}</span>
                  </TableCell>
                  <TableCell>
                    <div className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center",
                      reservation.status === "pending" && "bg-yellow-100 text-yellow-800",
                      reservation.status === "confirmed" && "bg-green-100 text-green-800",
                      reservation.status === "cancelled" && "bg-red-100 text-red-800"
                    )}>
                      {reservation.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                      {reservation.status === "confirmed" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {reservation.status === "cancelled" && <X className="h-3 w-3 mr-1" />}
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-2">
                      {reservation.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => onUpdateStatus(reservation.id, "confirmed")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => onUpdateStatus(reservation.id, "cancelled")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(reservation.id)}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReservationList;
