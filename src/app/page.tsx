import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Zap, Brain, ListChecks } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold">QuestLog</span>
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
              Turn Your Tasks into Epic <span className="text-primary">Quests!</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
              QuestLog transforms your mundane to-do list into an exciting adventure. Generate quests with AI, track your progress, and conquer your goals like a true hero.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/quests">Start Your Adventure</Link>
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
              Features to Aid Your Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-accent" />}
                title="AI-Powered Quest Generation"
                description="Let our AI craft engaging and thematic quests based on your tasks. Never face a boring to-do again!"
              />
              <FeatureCard
                icon={<ListChecks className="h-10 w-10 text-primary" />}
                title="Dynamic Quest Management"
                description="View, complete, edit, and delete quests with ease. Your adventure, your rules."
              />
              <FeatureCard
                icon={<Brain className="h-10 w-10 text-secondary" />}
                title="Local Storage Persistence"
                description="Your quests are saved directly in your browser. No account needed to get started quickly."
              />
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Visualize Your Victories
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        QuestLog provides a visually appealing interface with quest cards, thematic icons, and satisfying completion states to make productivity feel rewarding.
                    </p>
                    <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/auth/signup">Join the Guild</Link>
                    </Button>
                </div>
                <div className="md:w-1/2">
                    <Image 
                        src="https://placehold.co/600x400.png" 
                        alt="QuestLog Interface Preview"
                        data-ai-hint="fantasy rpg interface"
                        width={600} 
                        height={400} 
                        className="rounded-lg shadow-2xl"
                    />
                </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-card border-t">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} QuestLog. All rights reserved. Unleash your potential!
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
