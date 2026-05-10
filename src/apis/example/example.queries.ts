import { queryOptions } from '@tanstack/react-query';

import { getExamples } from './exampleApi';
import type { GetExamplesParams } from './example.types';

export const exampleQueries = {
  all: () => ['example'] as const,
  lists: () => [...exampleQueries.all(), 'list'] as const,
  list: (params?: GetExamplesParams) =>
    queryOptions({
      queryKey: [...exampleQueries.lists(), params],
      queryFn: () => getExamples(params),
    }),
};
