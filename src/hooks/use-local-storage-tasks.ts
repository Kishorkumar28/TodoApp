
"use client";

import type { Task } from '@/types/task';
import { useState, useEffect, useCallback } from 'react';

const TASKS_STORAGE_KEY = 'devtrack-tasks';

export function useLocalStorageTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from local storage:", error);
    }
    setIsLoading(false);
  }, []);

  const updateLocalStorage = useCallback((updatedTasks: Task[]) => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Failed to save tasks to local storage:", error);
    }
  }, []);

  const addTask = useCallback((newTaskData: Omit<Task, 'id' | 'createdAt' | 'status'>): Task => {
    const newTask: Task = {
      ...newTaskData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      status: 'active',
    };
    setTasks(prevTasks => {
      const updatedTasks = [newTask, ...prevTasks];
      updateLocalStorage(updatedTasks);
      return updatedTasks;
    });
    return newTask;
  }, [updateLocalStorage]);

  const updateTask = useCallback((taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      updateLocalStorage(updatedTasks);
      return updatedTasks;
    });
  }, [updateLocalStorage]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.id !== taskId);
      updateLocalStorage(updatedTasks);
      return updatedTasks;
    });
  }, [updateLocalStorage]);

  const toggleTaskStatus = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'active' ? 'completed' : 'active' }
          : task
      );
      updateLocalStorage(updatedTasks);
      return updatedTasks;
    });
  }, [updateLocalStorage]);

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };
}
