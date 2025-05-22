
// Use server directive is required for Genkit flows.
'use server';

/**
 * @fileOverview A software development task generation AI agent.
 *
 * - generateTask - A function that handles the task generation process.
 * - GenerateTaskInput - The input type for the generateTask function.
 * - GenerateTaskOutput - The return type for the generateTask function.
 */

import {ai} from '@/ai/genkit';
import {z}from 'genkit';

const GenerateTaskInputSchema = z.object({
  prompt: z.string().describe('A prompt for generating a software development task title and description.'),
});
export type GenerateTaskInput = z.infer<typeof GenerateTaskInputSchema>;

const GenerateTaskOutputSchema = z.object({
  title: z.string().describe('The generated task title.'),
  description: z.string().describe('The generated task description.'),
});
export type GenerateTaskOutput = z.infer<typeof GenerateTaskOutputSchema>;

export async function generateTask(input: GenerateTaskInput): Promise<GenerateTaskOutput> {
  return generateTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTaskPrompt',
  input: {schema: GenerateTaskInputSchema},
  output: {schema: GenerateTaskOutputSchema},
  prompt: `You are an assistant for a software development team. Generate a concise task title and a detailed description for a software development task based on the following prompt:\n\nPrompt: {{{prompt}}}`,
});

const generateTaskFlow = ai.defineFlow(
  {
    name: 'generateTaskFlow',
    inputSchema: GenerateTaskInputSchema,
    outputSchema: GenerateTaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
