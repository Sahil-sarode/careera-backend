import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useSignup } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { INTEREST_OPTIONS, cn } from "@/lib/utils";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    collegeName: "",
    pastExperience: "",
    referralCode: ""
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const signupMutation = useSignup({
    mutation: {
      onSuccess: () => {
        toast({ title: "Account created!", description: "Welcome to Careera!" });
        setLocation("/dashboard");
      },
      onError: (err) => {
        toast({ title: "Signup failed", description: err.error, variant: "destructive" });
      }
    }
  });

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInterests.length === 0) {
      toast({ title: "Missing fields", description: "Please select at least one interest", variant: "destructive" });
      return;
    }
    signupMutation.mutate({ 
      data: { ...formData, interests: selectedInterests } 
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-white">C</span>
          </div>
          <span className="font-display font-bold text-2xl text-foreground">Careera</span>
        </Link>
        
        <Card className="p-8 shadow-2xl border-border/50 rounded-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold mb-2">Student Registration</h2>
            <p className="text-muted-foreground">Join to discover events tailored to your career goals.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input required className="h-12 rounded-xl" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
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
                <Label>College Name</Label>
                <Input required className="h-12 rounded-xl" value={formData.collegeName} onChange={e => setFormData({...formData, collegeName: e.target.value})} />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Interests (Select multiple)</Label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                      selectedInterests.includes(interest)
                        ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
                        : "bg-background text-foreground border-border hover:border-secondary/50"
                    )}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Past Experience (Optional)</Label>
              <Textarea 
                placeholder="Briefly describe your skills or past hackathons/projects..." 
                className="resize-none h-24 rounded-xl" 
                value={formData.pastExperience} 
                onChange={e => setFormData({...formData, pastExperience: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label>Referral Code (Optional)</Label>
              <Input className="h-12 rounded-xl" value={formData.referralCode} onChange={e => setFormData({...formData, referralCode: e.target.value})} />
            </div>

            <Button type="submit" className="w-full h-14 rounded-xl text-lg font-semibold shadow-lg shadow-primary/25" disabled={signupMutation.isPending}>
              {signupMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
