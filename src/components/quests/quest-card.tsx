"use client";

import type { Quest } from '@/types/quest';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { QuestIcon } from './quest-icon';
import { Edit3, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface QuestCardProps {
  quest: Quest;
  onToggleStatus: (id: string) => void;
  onEdit: (quest: Quest) => void;
  onDelete: (id:string) => void;
}

export function QuestCard({ quest, onToggleStatus, onEdit, onDelete }: QuestCardProps) {
  const isCompleted = quest.status === 'completed';

  return (
    <Card 
      className={cn(
        "transition-all duration-300 ease-in-out transform hover:shadow-lg",
        isCompleted ? "bg-card/60 border-green-500/50 shadow-green-500/10" : "shadow-md",
        "hover:scale-[1.02]"
      )}
      data-testid={`quest-card-${quest.id}`}
    >
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <div className="flex-shrink-0 pt-1">
          <QuestIcon category={quest.category} className={cn("h-8 w-8", isCompleted ? "text-green-400" : "text-primary")} />
        </div>
        <div className="flex-grow">
          <CardTitle className={cn("text-xl leading-tight", isCompleted && "line-through text-muted-foreground")}>
            {quest.title}
          </CardTitle>
          <p className="text-xs text-muted-foreground pt-1">
            Posted {formatDistanceToNow(new Date(quest.createdAt), { addSuffix: true })}
            {quest.assignedTo && ` | Assigned to: ${quest.assignedTo}`}
          </p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
           {isCompleted ? (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground/50" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <CardDescription className={cn(isCompleted && "line-through text-muted-foreground/80")}>
          {quest.description}
        </CardDescription>
        <div className="mt-3">
          <Badge variant={isCompleted ? "secondary" : "outline"} className={cn(isCompleted ? "border-green-500/50 text-green-500": "capitalize")}>
            {isCompleted ? "Completed" : quest.category}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`complete-${quest.id}`}
            checked={isCompleted}
            onCheckedChange={() => onToggleStatus(quest.id)}
            aria-label={isCompleted ? "Mark as active" : "Mark as complete"}
            className={cn(isCompleted ? "border-green-500 data-[state=checked]:bg-green-500" : "border-primary data-[state=checked]:bg-primary")}
          />
          <label
            htmlFor={`complete-${quest.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {isCompleted ? 'Completed!' : 'Mark Complete'}
          </label>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(quest)} aria-label="Edit quest">
            <Edit3 className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label="Delete quest">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Abandon Quest?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the quest "{quest.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(quest.id)} className="bg-destructive hover:bg-destructive/90">
                  Abandon
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
