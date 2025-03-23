
import React from "react";
import { cn } from "@/lib/utils";

type ActivityType = "reservation" | "order" | "system";

interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  time: string;
  status?: "pending" | "completed" | "cancelled";
}

interface RecentActivityProps {
  activities: Activity[];
  className?: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, className }) => {
  return (
    <div className={cn("bg-card shadow-sm rounded-xl border border-border/50 overflow-hidden", className)}>
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-medium">Recent Activity</h3>
      </div>
      
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="px-6 py-4 hover:bg-muted/40 transition-colors flex items-center justify-between"
          >
            <div>
              <p className="text-sm">{activity.message}</p>
              <div className="flex items-center mt-1 space-x-3">
                <span className="text-xs text-muted-foreground">{activity.time}</span>
                
                {activity.status && (
                  <span 
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      activity.status === "pending" && "bg-yellow-100 text-yellow-800",
                      activity.status === "completed" && "bg-green-100 text-green-800",
                      activity.status === "cancelled" && "bg-red-100 text-red-800"
                    )}
                  >
                    {activity.status}
                  </span>
                )}
              </div>
            </div>
            
            <div className={cn(
              "w-2 h-2 rounded-full",
              activity.type === "reservation" && "bg-blue-400",
              activity.type === "order" && "bg-purple-400",
              activity.type === "system" && "bg-gray-400"
            )} />
          </div>
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className="py-10 text-center text-muted-foreground">
          <p>No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
