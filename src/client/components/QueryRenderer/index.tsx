import { UseQueryResult } from "@tanstack/react-query";

export default function QueryRenderer<T>({
  query,
  loading,
  success,
  error = <>Error</>,
}: {
  query: UseQueryResult<T>;
  loading: React.ReactNode;
  error?: React.ReactNode;
  success: (data: T) => React.ReactNode;
}) {
  if (query.isLoading) {
    return loading;
  }

  if (query.isError || !query.data) {
    return error;
  }

  return success(query.data);
}
