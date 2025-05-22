
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorageTasks } from "@/hooks/use-local-storage-tasks"; // Updated hook
import { ListChecks, CheckCircle2, Activity, PieChart, BarChartHorizontalBig } from "lucide-react"; // Updated icons
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { tasks, isLoading } = useLocalStorageTasks(); // Renamed quests to tasks
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTasks = tasks.filter(t => t.status === 'active').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const mostCommonCategory = tasks.length > 0 
    ? Object.entries(
        tasks.reduce((acc, task) => {
          acc[task.category] = (acc[task.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).sort(([,a],[,b]) => b-a)[0]?.[0] || 'N/A'
    : 'N/A';

  if (!mounted || isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Developer Dashboard</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-6 bg-muted-foreground/20 rounded w-1/2"></div>
                <div className="h-6 w-6 bg-muted-foreground/20 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-muted-foreground/20 rounded w-1/3 mb-1"></div>
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
         <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted-foreground/20 rounded w-1/4"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-8 bg-muted-foreground/20 rounded w-full"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
            </CardContent>
          </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-primary">Developer Dashboard</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground w-full md:w-auto">
            <Link href="/tasks">
                <span className="flex items-center">
                    View All Tasks
                    <ListChecks className="ml-2 h-5 w-5" />
                </span>
            </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Open Tasks"
          value={activeTasks.toString()}
          icon={<Activity className="h-5 w-5 text-muted-foreground" />}
          description="Tasks awaiting your attention."
        />
        <DashboardCard
          title="Closed Tasks"
          value={completedTasks.toString()}
          icon={<CheckCircle2 className="h-5 w-5 text-muted-foreground" />}
          description="Tasks successfully resolved."
        />
        <DashboardCard
          title="Overall Progress"
          value={`${completionPercentage}%`}
          icon={<PieChart className="h-5 w-5 text-muted-foreground" />}
          description={`${completedTasks} of ${totalTasks} tasks resolved.`}
          footerContent={ totalTasks > 0 && <Progress value={completionPercentage} className="h-2 mt-2" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Task Category Focus</CardTitle>
          <CardDescription>Your most common type of work.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <BarChartHorizontalBig className="h-8 w-8 text-primary" />
            <p className="text-2xl font-semibold capitalize">{mostCommonCategory}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            You seem to be focusing on {mostCommonCategory} tasks. Keep up the great work!
          </p>
        </CardContent>
      </Card>

      {tasks.length === 0 && (
        <Card className="text-center py-12">
            <CardHeader>
                <CardTitle className="text-2xl">Your Task Board is Empty!</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-lg text-muted-foreground mb-6">
                    No tasks recorded yet. It's time to start a new assignment!
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/tasks">
                        Create Your First Task
                    </Link>
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

interface DashboardCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    description?: string;
    footerContent?: React.ReactNode;
}

function DashboardCard({ title, value, icon, description, footerContent }: DashboardCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-primary">{value}</div>
                {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
                {footerContent}
            </CardContent>
        </Card>
    );
}
