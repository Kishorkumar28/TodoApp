
"use client";

import { useState, useMemo } from 'react';
import { QuestCard } from '@/components/quests/quest-card';
import { QuestForm } from '@/components/quests/quest-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLocalStorageQuests } from '@/hooks/use-local-storage-quests';
import type { Quest } from '@/types/quest';
import { PlusCircle, ListFilter, CheckSquare, Square, Loader2, ListChecks } from 'lucide-react';
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
import type { QuestCategory } from '@/types/quest';

type QuestFormValues = Omit<Quest, 'id' | 'createdAt' | 'status'>;

export default function QuestsPage() {
  const { quests, isLoading, addQuest, updateQuest, deleteQuest, toggleQuestStatus } = useLocalStorageQuests();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<QuestCategory | 'all'>('all');

  const { toast } = useToast();

  const handleFormSubmit = (data: QuestFormValues) => {
    if (editingQuest) {
      updateQuest(editingQuest.id, data);
      toast({ title: "Quest Updated", description: `"${data.title}" has been successfully updated.` });
    } else {
      addQuest(data);
      toast({ title: "Quest Forged!", description: `New quest "${data.title}" has been added to your log.` });
    }
    setEditingQuest(undefined);
    setIsFormOpen(false);
  };

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest(quest);
    setIsFormOpen(true);
  };

  const handleDeleteQuest = (id: string) => {
    const questToDelete = quests.find(q => q.id === id);
    deleteQuest(id);
    toast({ title: "Quest Abandoned", description: `Quest "${questToDelete?.title}" has been removed.`, variant: "destructive" });
  };
  
  const handleToggleStatus = (id: string) => {
    toggleQuestStatus(id);
    const quest = quests.find(q => q.id === id);
    if (quest) {
      toast({
        title: quest.status === 'active' ? "Quest marked active!" : "Quest Complete!",
        description: `"${quest.title}" status updated.`,
      });
    }
  };

  const filteredQuests = useMemo(() => {
    return quests
      .filter(quest => 
        quest.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        quest.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(quest => filterCategory === 'all' || quest.category === filterCategory);
  }, [quests, searchTerm, filterCategory]);

  const activeQuests = filteredQuests.filter(q => q.status === 'active');
  const completedQuests = filteredQuests.filter(q => q.status === 'completed');

  const questCategories: (QuestCategory | 'all')[] = ['all', 'combat', 'healing', 'exploration', 'crafting', 'diplomacy', 'default'];


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl">Loading your heroic deeds...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary flex items-center">
          <ListChecks className="mr-3 h-10 w-10" /> Your Quest Log
        </h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
          setIsFormOpen(isOpen);
          if (!isOpen) setEditingQuest(undefined);
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full md:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> New Quest
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingQuest ? 'Edit Your Quest' : 'Forge a New Quest'}
              </DialogTitle>
            </DialogHeader>
            <QuestForm
              onSubmit={handleFormSubmit}
              initialData={editingQuest}
              isEditing={!!editingQuest}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 p-4 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            placeholder="Search quests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-base"
          />
          <Select 
            value={filterCategory} 
            onValueChange={(value: QuestCategory | 'all') => setFilterCategory(value)}
          >
            <SelectTrigger className="text-base">
              <SelectValue placeholder="Filter by category..." />
            </SelectTrigger>
            <SelectContent>
              {questCategories.map(cat => (
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
            <Square className="mr-2 h-5 w-5"/> Active ({activeQuests.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-base py-2.5">
             <CheckSquare className="mr-2 h-5 w-5"/> Completed ({completedQuests.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {activeQuests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeQuests.map(quest => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleEditQuest}
                  onDelete={handleDeleteQuest}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No active quests. Time to forge some new adventures!</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed">
          {completedQuests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedQuests.map(quest => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleEditQuest}
                  onDelete={handleDeleteQuest}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No quests completed yet. The saga awaits!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {filteredQuests.length === 0 && quests.length > 0 && (
         <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No quests match your current filters.</p>
          </div>
      )}

    </div>
  );
}
