
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Mail, Phone, Users, MapPin, MessageSquare, CheckCircle, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  partySize: number;
  tableId: string;
  tableName: string;
  status: "pending" | "confirmed" | "cancelled";
  specialRequests?: string;
}

interface ReservationDetailsProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (reservationId: string, status: "confirmed" | "cancelled") => void;
}

const ReservationDetails: React.FC<ReservationDetailsProps> = ({
  reservation,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  if (!reservation) return null;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4 mr-1.5" />,
    confirmed: <CheckCircle className="h-4 w-4 mr-1.5" />,
    cancelled: <X className="h-4 w-4 mr-1.5" />,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reservation Details</DialogTitle>
          <DialogDescription>
            Information about reservation #{reservation.id.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>
        
        <div className={cn(
          "px-3 py-1.5 rounded-md text-sm font-medium inline-flex items-center border mt-2",
          statusColors[reservation.status]
        )}>
          {statusIcons[reservation.status]}
          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
        </div>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 p-1">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Customer Information</h3>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{reservation.customerName}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`mailto:${reservation.customerEmail}`} className="text-primary-foreground hover:underline">
                    {reservation.customerEmail}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`tel:${reservation.customerPhone}`} className="hover:underline">
                    {reservation.customerPhone}
                  </a>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Reservation Information</h3>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{format(new Date(reservation.date), "PPPP")}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{reservation.time}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Table: {reservation.tableName}</span>
                </div>
              </div>
            </div>
            
            {reservation.specialRequests && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Special Requests</h3>
                  <div className="rounded-md border p-3 bg-muted/40">
                    <div className="flex">
                      <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground mt-1 flex-shrink-0" />
                      <p className="text-sm">{reservation.specialRequests}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex sm:justify-between">
          {reservation.status === "pending" && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={() => {
                  onUpdateStatus(reservation.id, "cancelled");
                  onClose();
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                onClick={() => {
                  onUpdateStatus(reservation.id, "confirmed");
                  onClose();
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm
              </Button>
            </div>
          )}
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDetails;
