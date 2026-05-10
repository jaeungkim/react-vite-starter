---
description: Form conventions — react-hook-form + Zod + shadcn Form wrapper.
---

# Forms

## 1. Required stack

- `react-hook-form` for state.
- `zod` + `@hookform/resolvers/zod` for validation.
- shadcn `<Form>` / `<FormField>` / `<FormItem>` / `<FormLabel>` / `<FormControl>` / `<FormMessage>` for rendering and a11y.

Do NOT mix form libraries. Do NOT hand-roll form state with `useState`.

## 2. Placement

- Schema: `pages/{domain}/schemas/{form}.schema.ts` (or `features/{feature}/schemas.ts`).
- Form component: same domain folder.
- If a server route validates the same payload, it imports the schema from the client location — one schema, two consumers.

## 3. Canonical pattern

```ts
// schemas/profile.schema.ts
import { z } from 'zod';

export const profileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email(),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;
```

```tsx
// components/ProfileForm.tsx
'use client'; // Next.js only; omit in Vite

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { profileSchema, type ProfileFormValues } from '../schemas/profile.schema';
import { useUpdateProfile } from 'apis/profile';

export function ProfileForm() {
  const updateProfile = useUpdateProfile();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: '', email: '' },
    mode: 'onTouched',
  });

  const onSubmit = (values: ProfileFormValues) =>
    updateProfile.mutate(values, {
      onError: (e) => form.setError('root', { message: e.message }),
    });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Save
        </Button>
      </form>
    </Form>
  );
}
```

## 4. Rules

- Type via `z.infer`. NEVER redeclare.
- Always provide `defaultValues`.
- `mode: 'onTouched'` for forms > 3 fields; `onBlur` for very short forms.
- Cross-field validation uses `.superRefine()`.
- Server errors: `form.setError('root' | '{field}', { message })`.
- Submit handler delegates to a mutation hook from `apis/{domain}`. Do not call `fetch`/`axios` inline.
- Disable submit with `form.formState.isSubmitting`.

## 5. Arrays

Use `useFieldArray`. Define the inner shape as its own Zod schema referenced from the array schema.
