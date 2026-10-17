import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    sector: z.string(),
    category: z.string(),
    summary: z.string(),
    image: z.object({
      src: z.string().startsWith('/images/'),
      srcSmall: z.string().startsWith('/images/').optional(),
      alt: z.string().min(1),
      placeholder: z.boolean(),
    }),
    client: z.object({
      name: z.string().min(1),
      logo: z.string().startsWith('/images/'),
      placeholder: z.boolean(),
    }).refine(client => client.placeholder || client.name !== 'Bedrijfslogo', {
      message: 'Vul de goedgekeurde bedrijfsnaam in bij een echt klantlogo',
    }),
    status: z.enum(['project', 'in-ontwikkeling']).default('project'),
    featured: z.boolean().default(false),
    order: z.number(),
    proofLabel: z.string().optional(),
    situation: z.string().optional(),
    solution: z.string().optional(),
    humanRole: z.string().optional(),
    result: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.featured) {
      for (const key of ['proofLabel', 'situation', 'solution', 'humanRole'] as const) {
        if (!data[key]?.trim()) ctx.addIssue({ code: 'custom', path: [key], message: 'Verplicht voor een uitgelicht project' });
      }
    }
    if (data.status === 'in-ontwikkeling' && data.result) {
      ctx.addIssue({ code: 'custom', path: ['result'], message: 'Een project in ontwikkeling krijgt geen behaald resultaat' });
    }
  }),
});

export const collections = { cases };
