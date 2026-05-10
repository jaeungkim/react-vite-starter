import { client } from '@/apis/client';

import type {
  CreateExampleRequest,
  Example,
  GetExamplesParams,
} from '@/apis/example/example.types';

export const getExamples = async (params?: GetExamplesParams) => {
  const { data } = await client.get<Example[]>('/users', { params });
  return data;
};

export const createExample = async (body: CreateExampleRequest) => {
  const { data } = await client.post<Example>('/users', body);
  return data;
};
