import { useRoute } from "wouter";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGetEvent, useRegisterForEvent } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building, Tag, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function EventDetail() {
  const [, params] = useRoute("/events/:id");
  const eventId = params?.id ? parseInt(params.id) : 0;
  const { data: event, isLoading } = useGetEvent(eventId);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const registerMut = useRegisterForEvent({
    mutation: {
      onSuccess: () => {
        toast({ title: "Success!", description: "You are successfully registered for this event." });
        queryClient.invalidateQueries({ queryKey: ["/api/events", eventId] });
        queryClient.invalidateQueries({ queryKey: ["/api/users/registrations"] });
      },
      onError: (err) => {
        toast({ title: "Registration Failed", description: err.error, variant: "destructive" });
      }
    }
  });

  if (isLoading) {
    return <DashboardLayout role="user"><div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div></DashboardLayout>;
  }

  if (!event) return <DashboardLayout role="user">Event not found.</DashboardLayout>;

  const isClosed = event.status === "closed" || event.status === "cancelled" || new Date() > new Date(event.registrationDeadline);

  return (
    <DashboardLayout role="user">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Banner Area */}
        <div className="w-full h-48 md:h-64 rounded-3xl bg-gradient-to-tr from-primary to-secondary relative overflow-hidden shadow-xl shadow-primary/20">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-0 inset-x-0 p-8 text-white">
            <Badge variant="secondary" className="mb-3 bg-white/20 hover:bg-white/30 text-white border-white/10 backdrop-blur-md">
              {event.status.replace("_", " ").toUpperCase()}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight">{event.name}</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-8 border-border/50 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">About this Event</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
              
              {event.tags && event.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border/50">
                  <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-secondary/10 text-secondary-foreground text-sm py-1">
                        <Tag className="w-3 h-3 mr-1" /> {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Organized by</p>
                    <p className="font-semibold">{event.organizationName || event.organizerName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Event Date</p>
                    <p className="font-semibold">{format(new Date(event.eventDate), "MMM d, yyyy")}</p>
                    <p className="text-sm">{format(new Date(event.eventDate), "h:mm a")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{event.collegeName}</p>
                    <p className="text-sm">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Registration Deadline</p>
                    <p className="font-semibold text-amber-600">{format(new Date(event.registrationDeadline), "MMM d, h:mm a")}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50">
                <div className="flex justify-between items-end mb-4">
                  <p className="text-sm text-muted-foreground">Entry Fee</p>
                  <p className="text-2xl font-bold text-primary">{event.fees && event.fees > 0 ? `$${event.fees}` : "Free"}</p>
                </div>
                
                {event.isRegistered ? (
                  <Button disabled className="w-full h-12 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 opacity-100">
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Registered
                  </Button>
                ) : (
                  <Button 
                    className="w-full h-12 text-lg shadow-lg shadow-primary/25" 
                    onClick={() => registerMut.mutate({ id: eventId })}
                    disabled={isClosed || registerMut.isPending}
                  >
                    {registerMut.isPending ? "Processing..." : isClosed ? "Registration Closed" : "Register Now"}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
