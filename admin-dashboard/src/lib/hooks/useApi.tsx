import { useState } from 'react';

import Api from '../Api';

const getError = (
  error:
    | string
    | { message: string; _embedded: { errors: { message: string }[] } }
    | undefined,
): string => {
  if (typeof error === 'string') return error;
  if (typeof error?._embedded?.errors?.[0]?.message === 'string') {
    return error._embedded.errors[0].message;
  }
  if (typeof error?.message === 'string') return error?.message;
  return 'Error occurred';
};

const useApi = <T,>(): UseApiHookState<T> => {
  const defaultState: UseApiState<T> = {
    data: null,
    error: null,
    loading: false,
    statusCode: '',
  };

  const [state, setState] = useState<UseApiState<T>>(defaultState);

  const sendRequest = ({
    command,
    url,
    options = {},
    callback,
  }: SendRequestParams<T>): void => {
    setState({
      ...defaultState,
      loading: true,
    });

    (async () => {
      const newState: UseApiState<T> = {
        ...defaultState,
        loading: false,
      };

      try {
        const { data, error, statusCode } = await Api[command]<T>(url, options);
  
        newState.data = data ?? null;
        newState.statusCode = statusCode ?? null;
        newState.error = statusCode === 200 || statusCode === 201 ? null : getError(error);

      } catch (error: any) {
        newState.data = null;
        newState.statusCode = null;
        newState.error = getError(error)
      }


      setState(newState);
      callback?.(newState.data, newState.error, newState.statusCode);
    })();
  };

  return {
    ...state,
    sendRequest,
  };
};

export default useApi;
