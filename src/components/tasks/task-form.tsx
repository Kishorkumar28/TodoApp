
"use client";

import type { Task, TaskCategory } from '@/types/task';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Wand2, Loader2 } from 'lucide-react';
import { generateTask as generateTaskFlow } from '@/ai/flows/generate-task'; // Updated import
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// Updated categories
const taskCategories: TaskCategory[] = ['bug', 'feature', 'chore', 'documentation', 'refactor', 'general'];

const taskFormSchema = z.object({
  title: z.string().min(3, { message: "Task title must be at least 3 characters." }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(500),
  category: z.enum(taskCategories),
  assignedTo: z.string().optional(),
  aiPrompt: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onSubmit: (data: TaskFormValues) => void;
  initialData?: Task;
  isEditing?: boolean;
}

export function TaskForm({ onSubmit, initialData, isEditing = false }: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || 'general', // Updated default category
      assignedTo: initialData?.assignedTo || '',
      aiPrompt: '',
    },
  });
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerateTask() {
    const prompt = form.getValues("aiPrompt");
    if (!prompt) {
      toast({
        title: "AI Prompt Needed",
        description: "Please enter a theme or idea for the AI to generate a task.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateTaskFlow({ prompt });
      if (result.title && result.description) {
        form.setValue("title", result.title);
        form.setValue("description", result.description);
        toast({
          title: "Task Generated!",
          description: "The AI has crafted a new task for you.",
        });
      } else {
        throw new Error("AI did not return title or description.");
      }
    } catch (error) {
      console.error("AI Task Generation Error:", error);
      toast({
        title: "AI Generation Failed",
        description: "Could not generate task. Please try again or enter manually.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function onFormSubmit(data: TaskFormValues) {
    const { aiPrompt, ...taskData } = data;
    onSubmit(taskData);
    if (!isEditing) {
      form.reset(); 
      form.setValue("category", "general"); // Reset category to default after adding
      form.setValue("aiPrompt", ""); 
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="aiPrompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AI Task Idea (Optional)</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input placeholder="e.g., 'implement user authentication API'" {...field} />
                  </FormControl>
                  <Button type="button" onClick={handleGenerateTask} disabled={isGenerating} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">Generate</span>
                  </Button>
                </div>
                <FormDescription>
                  Let AI craft the title and description based on your idea.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the task objectives" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {taskCategories.map(category => (
                      <SelectItem key={category} value={category} className="capitalize">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign To (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Developer Name / Team" {...field} />
                </FormControl>
                <FormDescription>
                  Who is responsible for this task?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting || isGenerating}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Task' : 'Add Task'}
        </Button>
      </form>
    </Form>
  );
}
