"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import * as React from "react";

const notifications = {
  inbox: [
    {
      user: "Mark Bush",
      action: "New post",
      time: "12 Minutes ago",
    },
    {
      user: "Aaron Black",
      action: "New comment",
      time: "27 Minutes ago",
    },
  ],
  general: [
    {
      user: "Fred Campbell",
      action: "New comment",
      time: "39 Minutes ago",
    },
  ],
};

export function NotificationsDropdown() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border border-white bg-[#ff5c5c]" />
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="text-sm font-semibold">NOTIFICATIONS</h4>
          <Badge variant="secondary">8 New</Badge>
        </div>
        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="inbox"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Inbox
            </TabsTrigger>
            <TabsTrigger
              value="general"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              General
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inbox" className="m-0">
            <div className="divide-y divide-border">
              {notifications.inbox.map((n, i) => (
                <div key={i} className="space-y-3 p-4 hover:bg-muted/50">
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{n.user}</p>
                      <p className="text-xs text-muted-foreground">
                        {n.time} • <span className="text-primary">{n.action}</span>
                      </p>
                    </div>
                  </div>
                  {i === 1 && (
                    <div className="flex gap-2 pl-12">
                      <Button variant="secondary" size="sm" className="h-8 px-3 text-xs">
                        Decline
                      </Button>
                      <Button size="sm" className="h-8 px-3 text-xs">
                        Accept
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="general" className="m-0">
            <div className="p-4 text-center text-sm text-muted-foreground">
              No general notifications.
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
