"use client";

import type { Quest, QuestCategory } from '@/types/quest';
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
import { generateQuest as generateQuestFlow } from '@/ai/flows/generate-quest';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const questCategories: QuestCategory[] = ['combat', 'healing', 'exploration', 'crafting', 'diplomacy', 'default'];

const questFormSchema = z.object({
  title: z.string().min(3, { message: "Quest title must be at least 3 characters." }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(500),
  category: z.enum(questCategories),
  assignedTo: z.string().optional(),
  aiPrompt: z.string().optional(),
});

type QuestFormValues = z.infer<typeof questFormSchema>;

interface QuestFormProps {
  onSubmit: (data: QuestFormValues) => void;
  initialData?: Quest;
  isEditing?: boolean;
}

export function QuestForm({ onSubmit, initialData, isEditing = false }: QuestFormProps) {
  const form = useForm<QuestFormValues>({
    resolver: zodResolver(questFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || 'default',
      assignedTo: initialData?.assignedTo || '',
      aiPrompt: '',
    },
  });
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerateQuest() {
    const prompt = form.getValues("aiPrompt");
    if (!prompt) {
      toast({
        title: "AI Prompt Needed",
        description: "Please enter a theme or idea for the AI to generate a quest.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateQuestFlow({ prompt });
      if (result.title && result.description) {
        form.setValue("title", result.title);
        form.setValue("description", result.description);
        toast({
          title: "Quest Generated!",
          description: "The AI has crafted a new quest for you.",
        });
      } else {
        throw new Error("AI did not return title or description.");
      }
    } catch (error) {
      console.error("AI Quest Generation Error:", error);
      toast({
        title: "AI Generation Failed",
        description: "Could not generate quest. Please try again or enter manually.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function onFormSubmit(data: QuestFormValues) {
    const { aiPrompt, ...questData } = data;
    onSubmit(questData);
    if (!isEditing) {
      form.reset(); // Reset form only if adding new, not editing.
      form.setValue("aiPrompt", ""); // Clear AI prompt specifically
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
                <FormLabel>AI Quest Idea (Optional)</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input placeholder="e.g., 'a lost artifact in a dark forest'" {...field} />
                  </FormControl>
                  <Button type="button" onClick={handleGenerateQuest} disabled={isGenerating} className="bg-accent hover:bg-accent/90 text-accent-foreground">
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
              <FormLabel>Quest Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter quest title" {...field} />
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
              <FormLabel>Quest Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the quest objectives" rows={4} {...field} />
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
                    {questCategories.map(category => (
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
                  <Input placeholder="Player Name / Team" {...field} />
                </FormControl>
                <FormDescription>
                  Who is embarking on this quest?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting || isGenerating}>
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Quest' : 'Add Quest'}
        </Button>
      </form>
    </Form>
  );
}
