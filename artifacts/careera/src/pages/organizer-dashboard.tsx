import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetOrganizerEvents, useCreateEvent, useDeleteEvent, useCreateAnnouncement } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Plus, Trash2, Edit, Megaphone, Calendar } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { INTEREST_OPTIONS, cn } from "@/lib/utils";

export default function OrganizerDashboard() {
  const { data: events, isLoading } = useGetOrganizerEvents();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createEventMut = useCreateEvent({
    mutation: {
      onSuccess: () => {
        toast({ title: "Event created successfully!" });
        queryClient.invalidateQueries({ queryKey: ["/api/organizers/events"] });
        setAddDialogOpen(false);
      }
    }
  });

  const deleteEventMut = useDeleteEvent({
    mutation: {
      onSuccess: () => {
        toast({ title: "Event deleted" });
        queryClient.invalidateQueries({ queryKey: ["/api/organizers/events"] });
      }
    }
  });

  const announcementMut = useCreateAnnouncement({
    mutation: {
      onSuccess: () => {
        toast({ title: "Announcement sent!" });
        setAnnounceData({ title: "", message: "" });
      }
    }
  });

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [eventData, setEventData] = useState({
    name: "", description: "", collegeName: "", location: "", fees: 0,
    registrationDeadline: "", eventDate: ""
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [announceData, setAnnounceData] = useState({ title: "", message: "" });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    createEventMut.mutate({ 
      data: { 
        ...eventData, 
        tags: selectedTags,
        registrationDeadline: new Date(eventData.registrationDeadline).toISOString(),
        eventDate: new Date(eventData.eventDate).toISOString()
      } 
    });
  };

  const handleAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    announcementMut.mutate({ data: announceData });
  };

  return (
    <DashboardLayout role="organizer">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Organizer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your events and community.</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20 rounded-xl px-6 h-12"><Plus className="w-5 h-5 mr-2" /> New Event</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create New Event</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Event Name</Label>
                  <Input required value={eventData.name} onChange={e => setEventData({...eventData, name: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Description</Label>
                  <Textarea required className="h-24" value={eventData.description} onChange={e => setEventData({...eventData, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>College/Venue</Label>
                  <Input required value={eventData.collegeName} onChange={e => setEventData({...eventData, collegeName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>City/Location</Label>
                  <Input required value={eventData.location} onChange={e => setEventData({...eventData, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Event Date & Time</Label>
                  <Input type="datetime-local" required value={eventData.eventDate} onChange={e => setEventData({...eventData, eventDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Registration Deadline</Label>
                  <Input type="datetime-local" required value={eventData.registrationDeadline} onChange={e => setEventData({...eventData, registrationDeadline: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Entry Fees ($)</Label>
                  <Input type="number" min="0" required value={eventData.fees} onChange={e => setEventData({...eventData, fees: Number(e.target.value)})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map(tag => (
                      <button type="button" key={tag} onClick={() => setSelectedTags(p => p.includes(tag) ? p.filter(t=>t!==tag) : [...p, tag])}
                        className={cn("px-3 py-1 text-xs rounded-full border", selectedTags.includes(tag) ? "bg-primary text-primary-foreground" : "bg-card text-foreground")}
                      >{tag}</button>
                    ))}
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full h-12" disabled={createEventMut.isPending}>
                {createEventMut.isPending ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="bg-card border border-border/50 h-auto p-1.5 rounded-xl shadow-sm mb-8">
          <TabsTrigger value="events" className="rounded-lg py-2 px-4"><Calendar className="w-4 h-4 mr-2"/>Manage Events</TabsTrigger>
          <TabsTrigger value="announcements" className="rounded-lg py-2 px-4"><Megaphone className="w-4 h-4 mr-2"/>Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-0">
          <Card className="overflow-hidden border-border/50 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">Event Name</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-center">Registrations</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {isLoading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center">Loading events...</td></tr>
                  ) : events?.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">You haven't created any events yet.</td></tr>
                  ) : (
                    events?.map(event => (
                      <tr key={event.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{event.name}</td>
                        <td className="px-6 py-4">{format(new Date(event.eventDate), "MMM d, yyyy")}</td>
                        <td className="px-6 py-4 capitalize">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", event.status === 'upcoming' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700')}>
                            {event.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono font-medium">{event.registrationCount || 0}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                            if(confirm("Are you sure?")) deleteEventMut.mutate({ id: event.id });
                          }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="mt-0">
          <Card className="p-8 max-w-2xl border-border/50 shadow-lg">
            <div className="mb-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Broadcast Announcement</h3>
                <p className="text-muted-foreground text-sm">Send a notification to all your registered attendees.</p>
              </div>
            </div>
            
            <form onSubmit={handleAnnouncement} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input required placeholder="e.g. Venue Change for Hackathon" value={announceData.title} onChange={e => setAnnounceData({...announceData, title: e.target.value})} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea required placeholder="Type your announcement here..." className="h-32 rounded-xl resize-none" value={announceData.message} onChange={e => setAnnounceData({...announceData, message: e.target.value})} />
              </div>
              <Button type="submit" className="h-12 w-full rounded-xl" disabled={announcementMut.isPending}>
                {announcementMut.isPending ? "Sending..." : "Send Announcement"}
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
