import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, Users, Star, Building } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 bg-background/80 backdrop-blur-md border-b border-border/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="font-display font-bold text-white">C</span>
            </div>
            <span className="font-display font-bold text-xl text-primary">Careera</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-semibold">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="font-semibold shadow-lg shadow-primary/20">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-16">
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 z-0">
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
              alt="Hero background" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-foreground tracking-tight mb-6">
                Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Right Events</span><br />
                for Your Career
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Careera uses AI to recommend hackathons, workshops, and tech talks perfectly tailored to your interests and college.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all">
                    I'm a Student <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/organizer-signup">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl border-2 hover:bg-secondary/5">
                    I'm an Organizer
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">Why Careera?</h2>
              <p className="text-muted-foreground text-lg">Everything you need to grow your network and skills.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Compass, title: "AI Recommendations", desc: "Smart matching based on your interests, college, and past experience." },
                { icon: Building, title: "Campus Centric", desc: "Find events happening right at your college or nearby universities." },
                { icon: Users, title: "Network Building", desc: "Connect with peers, mentors, and industry leaders through events." }
              ].map((feature, i) => (
                <div key={i} className="bg-background rounded-3xl p-8 border border-border/50 shadow-lg shadow-primary/5 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 text-secondary">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground text-background py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-xs">C</span>
          </div>
          <span className="font-display font-bold text-lg">Careera</span>
        </div>
        <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Careera Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
