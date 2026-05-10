import { z } from 'zod';

export const exampleFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
});

export type ExampleFormValues = z.infer<typeof exampleFormSchema>;
