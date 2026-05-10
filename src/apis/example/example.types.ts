export interface Example {
  id: number;
  name: string;
}

export interface GetExamplesParams {
  search?: string;
}

export interface CreateExampleRequest {
  name: string;
  email: string;
}
