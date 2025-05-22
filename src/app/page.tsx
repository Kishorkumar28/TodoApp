
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppWindow, Sparkles, Database, ClipboardList } from "lucide-react"; // Updated icons
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <AppWindow className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold">DevTrack</span>
          </Link>
          <nav className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Streamline Your Software <span className="text-primary">Development Workflow!</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
              DevTrack helps your team manage tasks efficiently. Generate tasks with AI, track progress, and deliver projects successfully.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/tasks">Get Started with Tasks</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Tools for Efficient Development
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Sparkles className="h-10 w-10 text-accent" />}
                title="AI-Assisted Task Creation"
                description="Let our AI help draft clear and actionable tasks based on your project needs. Speed up your planning phase!"
              />
              <FeatureCard
                icon={<ClipboardList className="h-10 w-10 text-primary" />}
                title="Efficient Task Management"
                description="View, update, assign, and complete tasks with an intuitive interface. Keep your projects on track."
              />
              <FeatureCard
                icon={<Database className="h-10 w-10 text-secondary" />}
                title="Browser-Based Storage"
                description="Your tasks are saved directly in your browser for quick access. No account needed to get started."
              />
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
             <div className="flex flex-col items-center justify-center gap-8 text-center">
                <div className="">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Track Your Progress Clearly
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        DevTrack provides a clean and organized interface with task cards, status indicators, and progress summaries to keep your development cycle transparent.
                    </p>
                    <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/auth/signup"><span>Sign Up Now</span></Link>
                    </Button>
                </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-card border-t">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} DevTrack. All rights reserved. Code. Collaborate. Conquer.
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="bg-background/50 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
      <CardHeader className="items-center">
        <div className="p-4 bg-primary/10 rounded-full mb-4">
            {icon}
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
