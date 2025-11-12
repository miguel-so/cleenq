type UseApiState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
  statusCode: string | number | null;
};

type SendRequestParams<T> = {
  callback?: (
    data: T | null,
    error: string | null,
    statusCode: string | number | null
  ) => void;
  command: 'get' | 'post' | 'put' | 'delete';
  options?: Record<string, any>;
  url: string;
};

type UseApiHookState<T> = UseApiState<T> & {
  sendRequest: (params: SendRequestParams<T>) => void;
};

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

type SelectOption = {
  value: string;
  label: string;
}