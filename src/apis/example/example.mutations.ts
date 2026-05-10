import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createExample } from '@/apis/example/exampleApi';
import { exampleQueries } from '@/apis/example/example.queries';
import type { CreateExampleRequest } from '@/apis/example/example.types';

export function useCreateExample() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateExampleRequest) => createExample(body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: exampleQueries.lists() }),
  });
}
