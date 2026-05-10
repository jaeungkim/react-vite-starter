import { client } from '@/apis/client';
import type { Example, GetExamplesParams } from './example.types';

export const getExamples = async (params?: GetExamplesParams) => {
  const { data } = await client.get<Example[]>('/examples', { params });
  return data;
};
