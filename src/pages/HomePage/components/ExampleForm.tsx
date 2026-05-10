import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  exampleFormSchema,
  type ExampleFormValues,
} from '@/pages/HomePage/schemas/exampleForm.schema';

export default function ExampleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleFormSchema),
    defaultValues: { name: '', email: '' },
  });

  const onSubmit = (values: ExampleFormValues) => {
    toast.success(`Submitted: ${values.name} <${values.email}>`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-sm flex-col gap-3"
      noValidate
    >
      <input
        {...register('name')}
        placeholder="Name"
        className="border-input rounded-md border px-3 py-2 text-sm"
      />
      {errors.name && (
        <span className="text-destructive text-sm">{errors.name.message}</span>
      )}
      <input
        {...register('email')}
        placeholder="Email"
        className="border-input rounded-md border px-3 py-2 text-sm"
      />
      {errors.email && (
        <span className="text-destructive text-sm">{errors.email.message}</span>
      )}
      <Button type="submit" disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
