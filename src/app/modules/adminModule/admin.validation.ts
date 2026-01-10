import { z } from 'zod';

export const getDashboardAnalytics = z.object({
  query: z.object({
    clientYear: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number (e.g. 2025)'),
  }),
});
