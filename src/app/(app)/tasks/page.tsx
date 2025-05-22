
"use client";

import { useState, useMemo } from 'react';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskForm } from '@/components/tasks/task-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLocalStorageTasks } from '@/hooks/use-local-storage-tasks';
import type { Task, TaskCategory } from '@/types/task';
import { PlusCircle, ListFilter, CheckSquare, Square, Loader2, ClipboardList } from 'lucide-react'; // Updated ClipboardList
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TaskFormValues = Omit<Task, 'id' | 'createdAt' | 'status'>;

export default function TasksPage() {
  const { tasks, isLoading, addTask, updateTask, deleteTask, toggleTaskStatus } = useLocalStorageTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');

  const { toast } = useToast();

  const handleFormSubmit = (data: TaskFormValues) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      toast({ title: "Task Updated", description: `"${data.title}" has been successfully updated.` });
    } else {
      addTask(data);
      toast({ title: "Task Created!", description: `New task "${data.title}" has been added to your board.` });
    }
    setEditingTask(undefined);
    setIsFormOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    deleteTask(id);
    toast({ title: "Task Deleted", description: `Task "${taskToDelete?.title}" has been removed.`, variant: "destructive" });
  };
  
  const handleToggleStatus = (id: string) => {
    toggleTaskStatus(id);
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast({
        title: task.status === 'active' ? "Task marked active!" : "Task Complete!",
        description: `"${task.title}" status updated.`,
      });
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(task => filterCategory === 'all' || task.category === filterCategory);
  }, [tasks, searchTerm, filterCategory]);

  const activeTasks = filteredTasks.filter(t => t.status === 'active');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  const taskCategories: (TaskCategory | 'all')[] = ['all', 'bug', 'feature', 'chore', 'documentation', 'refactor', 'general'];


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary flex items-center">
          <ClipboardList className="mr-3 h-10 w-10" /> Your Task Board
        </h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
          setIsFormOpen(isOpen);
          if (!isOpen) setEditingTask(undefined);
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full md:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingTask ? 'Edit Your Task' : 'Create a New Task'}
              </DialogTitle>
            </DialogHeader>
            <TaskForm
              onSubmit={handleFormSubmit}
              initialData={editingTask}
              isEditing={!!editingTask}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 p-4 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-base"
          />
          <Select 
            value={filterCategory} 
            onValueChange={(value: TaskCategory | 'all') => setFilterCategory(value)}
          >
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Filter by category..." />
            </SelectTrigger>
            <SelectContent>
              {taskCategories.map(cat => (
                <SelectItem key={cat} value={cat} className="capitalize text-base">
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mb-6">
          <TabsTrigger value="active" className="text-base py-2.5">
            <Square className="mr-2 h-5 w-5"/> Active ({activeTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-base py-2.5">
             <CheckSquare className="mr-2 h-5 w-5"/> Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {activeTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No active tasks. Time to create some new assignments!</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed">
          {completedTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No tasks completed yet. The project awaits!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {filteredTasks.length === 0 && tasks.length > 0 && (
         <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No tasks match your current filters.</p>
          </div>
      )}

    </div>
  );
}
