import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useOrganizerSignup } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { OrganizerSignupRequestRole } from "@workspace/api-client-react";

export default function OrganizerSignup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
    collegeName: "",
    location: "",
    role: "Member" as OrganizerSignupRequestRole
  });

  const mutation = useOrganizerSignup({
    mutation: {
      onSuccess: () => {
        toast({ title: "Application Submitted", description: "Your organizer account is pending admin approval." });
        setLocation("/login");
      },
      onError: (err) => {
        toast({ title: "Signup failed", description: err.error, variant: "destructive" });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: formData });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
            <span className="font-display font-bold text-white">C</span>
          </div>
          <span className="font-display font-bold text-2xl text-foreground">Careera</span>
        </Link>
        
        <Card className="p-8 shadow-2xl border-border/50 rounded-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold mb-2">Organizer Registration</h2>
            <p className="text-muted-foreground">Host events, manage attendees, and grow your community.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Your Name</Label>
                <Input required className="h-12 rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input required type="email" className="h-12 rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input required type="password" className="h-12 rounded-xl" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Organization / Club Name</Label>
                <Input required className="h-12 rounded-xl" value={formData.organizationName} onChange={e => setFormData({...formData, organizationName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>College Name</Label>
                <Input required className="h-12 rounded-xl" value={formData.collegeName} onChange={e => setFormData({...formData, collegeName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Location (City/State)</Label>
                <Input required className="h-12 rounded-xl" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Your Role in Organization</Label>
              <Select value={formData.role} onValueChange={(v: any) => setFormData({...formData, role: v})}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="President">President</SelectItem>
                  <SelectItem value="Coordinator">Coordinator</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" variant="secondary" className="w-full h-14 rounded-xl text-lg font-semibold shadow-lg shadow-secondary/25" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Apply as Organizer"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
