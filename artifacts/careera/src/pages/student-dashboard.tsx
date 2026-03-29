import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEvents, useGetMe, useGetNotifications, useGetReferrals } from "@workspace/api-client-react";
import { EventCard } from "@/components/shared/event-card";
import { Card } from "@/components/ui/card";
import { Bell, Copy, Sparkles, User, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function StudentDashboard() {
  const { data: user } = useGetMe();
  const { data: events, isLoading } = useGetEvents();
  const { data: notifications } = useGetNotifications();
  const { data: referrals } = useGetReferrals();
  const { toast } = useToast();

  const activeEvents = events?.filter(e => e.status !== "closed" && e.status !== "cancelled") || [];
  const recommendedEvents = activeEvents.filter(e => 
    e.tags?.some(tag => user?.interests?.includes(tag))
  );
  const upcomingEvents = activeEvents.filter(e => new Date(e.eventDate) > new Date());
  const pastEvents = events?.filter(e => e.status === "closed" || new Date(e.eventDate) < new Date()) || [];

  const copyReferral = () => {
    if (referrals?.referralCode) {
      navigator.clipboard.writeText(referrals.referralCode);
      toast({ title: "Copied!", description: "Referral code copied to clipboard." });
    }
  };

  return (
    <DashboardLayout role="user">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Welcome, {user?.fullName?.split(" ")[0]}!</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening around you.</p>
      </div>

      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="bg-card border border-border/50 h-auto p-1.5 rounded-xl shadow-sm mb-8 overflow-x-auto flex whitespace-nowrap justify-start max-w-full hide-scrollbar">
          <TabsTrigger value="recommended" className="rounded-lg py-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Sparkles className="w-4 h-4 mr-2"/>Recommended</TabsTrigger>
          <TabsTrigger value="all" className="rounded-lg py-2 px-4">All Events</TabsTrigger>
          <TabsTrigger value="upcoming" className="rounded-lg py-2 px-4">Upcoming</TabsTrigger>
          <TabsTrigger value="past" className="rounded-lg py-2 px-4">Past</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg py-2 px-4 flex items-center">
            <Bell className="w-4 h-4 mr-2"/> Notifications
            {notifications && notifications.filter(n => !n.isRead).length > 0 && (
              <span className="ml-2 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg py-2 px-4"><User className="w-4 h-4 mr-2"/> Profile</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <>
            <TabsContent value="recommended" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedEvents.length > 0 ? (
                  recommendedEvents.map(event => <EventCard key={event.id} event={event} />)
                ) : (
                  <div className="col-span-full py-20 text-center text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No recommended events right now. Try updating your interests!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeEvents.map(event => <EventCard key={event.id} event={event} />)}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map(event => <EventCard key={event.id} event={event} showStatus={false} />)}
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Your Notifications</h3>
                {notifications && notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map(note => (
                      <div key={note.id} className={`p-4 rounded-xl border ${note.isRead ? 'bg-card border-border/50' : 'bg-primary/5 border-primary/20'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-foreground">{note.title}</h4>
                          <span className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{note.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">You have no notifications.</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="mt-0 space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Profile Details</h3>
                <div className="space-y-4 text-sm">
                  <div><span className="text-muted-foreground block mb-1">Full Name</span><span className="font-medium text-lg">{user?.fullName}</span></div>
                  <div><span className="text-muted-foreground block mb-1">College</span><span className="font-medium">{user?.collegeName}</span></div>
                  <div>
                    <span className="text-muted-foreground block mb-2">Interests</span>
                    <div className="flex flex-wrap gap-2">
                      {user?.interests?.map(i => <span key={i} className="px-3 py-1 bg-secondary/10 text-secondary-foreground rounded-full">{i}</span>)}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg"><LinkIcon className="w-5 h-5"/></div>
                  <h3 className="text-xl font-bold">Referral Program</h3>
                </div>
                <p className="text-muted-foreground mb-6">Invite your friends to Careera and build your network together!</p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
                  <div className="flex-1 w-full bg-background rounded-xl border border-border p-4 flex justify-between items-center">
                    <span className="font-mono text-lg tracking-wider font-semibold">{referrals?.referralCode || 'Loading...'}</span>
                    <Button variant="ghost" size="icon" onClick={copyReferral}><Copy className="w-4 h-4" /></Button>
                  </div>
                  <div className="bg-primary text-primary-foreground px-6 py-4 rounded-xl text-center shadow-lg shadow-primary/20 w-full sm:w-auto">
                    <div className="text-2xl font-bold">{referrals?.referralCount || 0}</div>
                    <div className="text-xs uppercase tracking-wider opacity-80">Referrals</div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </DashboardLayout>
  );
}
