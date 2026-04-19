"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActivityIcon } from "lucide-react";
import * as React from "react";

const activities = [
  {
    user: "Joe Lincoln",
    action: "mentioned you in last trends topic",
    time: "18 mins ago",
    comment: "@ShadcnStudio For an expert opinion, check out what Mike has to say on this topic!",
  },
  {
    user: "Jane Perez",
    action: "invites you to review a file",
    time: "39 mins ago",
    details: "invoices.pdf",
  },
];

export function ActivityViewer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <ActivityIcon className="h-4 w-4" />
          <span className="sr-only">View activity</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Activity</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {activities.map((activity, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  {activity.user} <span className="font-normal text-muted-foreground">{activity.action}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
                {activity.comment && (
                  <div className="mt-2 rounded-lg bg-muted/50 p-3 text-sm italic">
                    {activity.comment}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
