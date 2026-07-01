import { z } from 'zod';

export const requestFormSchema = z.object({
  firstName: z.string().min(1, { message: 'This field must be filled.' }),
  lastName: z.string().min(1, { message: 'This field must be filled.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(1, { message: 'This field must be filled.' }),
  message: z.string().optional(),
  package: z.string().optional(),
});

export type RequestFormSchema = z.infer<typeof requestFormSchema>;
