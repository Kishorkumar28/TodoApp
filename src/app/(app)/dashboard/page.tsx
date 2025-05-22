"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorageQuests } from "@/hooks/use-local-storage-quests";
import { ListChecks, CheckSquare, ShieldAlert, Activity, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { quests, isLoading } = useLocalStorageQuests();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const activeQuests = quests.filter(q => q.status === 'active').length;
  const completedQuests = quests.filter(q => q.status === 'completed').length;
  const totalQuests = quests.length;
  const completionPercentage = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  const mostCommonCategory = quests.length > 0 
    ? Object.entries(
        quests.reduce((acc, quest) => {
          acc[quest.category] = (acc[quest.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).sort(([,a],[,b]) => b-a)[0]?.[0] || 'N/A'
    : 'N/A';

  if (!mounted || isLoading) {
    // Render a skeleton or loading state that matches the dashboard structure
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Adventurer's Dashboard</h1>
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
        <h1 className="text-3xl font-bold text-primary">Adventurer's Dashboard</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground w-full md:w-auto">
            <Link href="/quests">
                View All Quests
                <ListChecks className="ml-2 h-5 w-5" />
            </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Active Quests"
          value={activeQuests.toString()}
          icon={<ShieldAlert className="h-5 w-5 text-muted-foreground" />}
          description="Quests awaiting your heroism."
        />
        <DashboardCard
          title="Completed Quests"
          value={completedQuests.toString()}
          icon={<CheckSquare className="h-5 w-5 text-muted-foreground" />}
          description="Victories achieved and tales told."
        />
        <DashboardCard
          title="Overall Progress"
          value={`${completionPercentage}%`}
          icon={<BarChart3 className="h-5 w-5 text-muted-foreground" />}
          description={`${completedQuests} of ${totalQuests} quests conquered.`}
          footerContent={ totalQuests > 0 && <Progress value={completionPercentage} className="h-2 mt-2" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quest Focus</CardTitle>
          <CardDescription>Your most common type of adventure.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-primary" />
            <p className="text-2xl font-semibold capitalize">{mostCommonCategory}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            You seem to be focusing on {mostCommonCategory} quests. Keep up the great work!
          </p>
        </CardContent>
      </Card>

      {quests.length === 0 && (
        <Card className="text-center py-12">
            <CardHeader>
                <CardTitle className="text-2xl">Your Log is Empty!</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-lg text-muted-foreground mb-6">
                    No quests recorded yet. It's time to embark on a new adventure!
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/quests">
                        Forge Your First Quest
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
