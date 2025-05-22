"use client";

import type { Quest } from '@/types/quest';
import { useState, useEffect, useCallback } from 'react';

const QUESTS_STORAGE_KEY = 'questlog-quests';

export function useLocalStorageQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedQuests = localStorage.getItem(QUESTS_STORAGE_KEY);
      if (storedQuests) {
        setQuests(JSON.parse(storedQuests));
      }
    } catch (error) {
      console.error("Failed to load quests from local storage:", error);
    }
    setIsLoading(false);
  }, []);

  const updateLocalStorage = useCallback((updatedQuests: Quest[]) => {
    try {
      localStorage.setItem(QUESTS_STORAGE_KEY, JSON.stringify(updatedQuests));
    } catch (error) {
      console.error("Failed to save quests to local storage:", error);
    }
  }, []);

  const addQuest = useCallback((newQuestData: Omit<Quest, 'id' | 'createdAt' | 'status'>): Quest => {
    const newQuest: Quest = {
      ...newQuestData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      status: 'active',
    };
    setQuests(prevQuests => {
      const updatedQuests = [newQuest, ...prevQuests];
      updateLocalStorage(updatedQuests);
      return updatedQuests;
    });
    return newQuest;
  }, [updateLocalStorage]);

  const updateQuest = useCallback((questId: string, updates: Partial<Omit<Quest, 'id' | 'createdAt'>>) => {
    setQuests(prevQuests => {
      const updatedQuests = prevQuests.map(quest =>
        quest.id === questId ? { ...quest, ...updates } : quest
      );
      updateLocalStorage(updatedQuests);
      return updatedQuests;
    });
  }, [updateLocalStorage]);

  const deleteQuest = useCallback((questId: string) => {
    setQuests(prevQuests => {
      const updatedQuests = prevQuests.filter(quest => quest.id !== questId);
      updateLocalStorage(updatedQuests);
      return updatedQuests;
    });
  }, [updateLocalStorage]);

  const toggleQuestStatus = useCallback((questId: string) => {
    setQuests(prevQuests => {
      const updatedQuests = prevQuests.map(quest =>
        quest.id === questId
          ? { ...quest, status: quest.status === 'active' ? 'completed' : 'active' }
          : quest
      );
      updateLocalStorage(updatedQuests);
      return updatedQuests;
    });
  }, [updateLocalStorage]);

  return {
    quests,
    isLoading,
    addQuest,
    updateQuest,
    deleteQuest,
    toggleQuestStatus,
  };
}
