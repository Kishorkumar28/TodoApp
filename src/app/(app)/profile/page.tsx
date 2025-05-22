import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, CheckCircle, Lightbulb } from "lucide-react"; // Updated icons
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "Developer One", // Changed from Player One
    email: "dev.one@example.com",
    joinDate: "January 1, 2024",
    tasksCompleted: 42, // Changed from questsCompleted
    favoriteCategory: "Feature Development", // Changed from Exploration
    avatarUrl: "https://placehold.co/100x100.png" 
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary shadow-lg">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="developer avatar" /> {/* Updated data-ai-hint */}
            <AvatarFallback className="text-3xl">
              {user.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold text-primary">{user.name}</CardTitle>
          <CardDescription className="text-lg">{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <InfoItem icon={<CalendarDays className="text-accent" />} label="Joined Team" value={user.joinDate} /> {/* Updated label and icon */}
            <InfoItem icon={<CheckCircle className="text-accent" />} label="Tasks Completed" value={user.tasksCompleted.toString()} /> {/* Updated label and icon */}
            <InfoItem icon={<Lightbulb className="text-accent" />} label="Preferred Task Type" value={user.favoriteCategory} /> {/* Updated label and icon */}
          </div>
          <div className="text-center mt-8">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/tasks">View My Tasks</Link> {/* Updated text and link */}
            </Button>
          </div>
           <p className="text-xs text-center text-muted-foreground pt-4">
            This is a mock profile page. User data is not persisted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-card-foreground/5 rounded-md">
      <div className="flex-shrink-0 text-accent">{icon}</div>
      <div>
        <p className="font-semibold text-muted-foreground">{label}</p>
        <p className="text-foreground">{value}</p>
      </div>
    </div>
  );
}
