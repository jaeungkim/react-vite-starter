import { useSuspenseQuery } from '@tanstack/react-query';

import { exampleQueries } from '@/apis/example';

export default function ExampleList() {
  const { data } = useSuspenseQuery(exampleQueries.list());
  return <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>;
}
