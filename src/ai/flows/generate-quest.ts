// Use server directive is required for Genkit flows.
'use server';

/**
 * @fileOverview A quest generation AI agent.
 *
 * - generateQuest - A function that handles the quest generation process.
 * - GenerateQuestInput - The input type for the generateQuest function.
 * - GenerateQuestOutput - The return type for the generateQuest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuestInputSchema = z.object({
  prompt: z.string().describe('A prompt for generating a quest title and description.'),
});
export type GenerateQuestInput = z.infer<typeof GenerateQuestInputSchema>;

const GenerateQuestOutputSchema = z.object({
  title: z.string().describe('The generated quest title.'),
  description: z.string().describe('The generated quest description.'),
});
export type GenerateQuestOutput = z.infer<typeof GenerateQuestOutputSchema>;

export async function generateQuest(input: GenerateQuestInput): Promise<GenerateQuestOutput> {
  return generateQuestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuestPrompt',
  input: {schema: GenerateQuestInputSchema},
  output: {schema: GenerateQuestOutputSchema},
  prompt: `You are a quest generator for a role playing game. Generate a creative quest title and description based on the following prompt:\n\nPrompt: {{{prompt}}}`,
});

const generateQuestFlow = ai.defineFlow(
  {
    name: 'generateQuestFlow',
    inputSchema: GenerateQuestInputSchema,
    outputSchema: GenerateQuestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
