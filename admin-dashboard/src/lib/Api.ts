import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export enum ApiCommand {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PUT = "put",
  PATCH = "patch",
}

class Api {
  static readonly axiosConfig: AxiosRequestConfig = {
    baseURL: process.env.REACT_APP_API_URL,
  };

  static readonly instance: AxiosInstance = axios.create(Api.axiosConfig);

  static get client(): AxiosInstance {
    return Api.instance;
  }

  static buildQueryParam([key, value]: [string, any]): string {
    if (Array.isArray(value)) {
      return value
        .map((paramVal) => {
          return `${key}=${paramVal}`;
        })
        .join("&");
    }
    return `${key}=${value}`;
  }

  static buildRequestString(
    url: string,
    queryParams: Record<string, any> = {},
  ): string {
    let queryString = Object.entries(queryParams)
      .map(Api.buildQueryParam)
      .join("&");
    if (queryString) queryString = `?${queryString}`;
    return `${url}${queryString}`;
  }

  static async get<T>(
    url: string,
    queryParams: Record<string, any> = {}
  ): Promise<any> {
    const queryString = Api.buildRequestString(url, queryParams);

    try {
      const response = await Api.client.get<T>(queryString);
      return { data: response.data, statusCode: response.status };
    } catch (err: any) {
      return {
        error: err?.response?.data?.message || "get error",
      };
    }
  }

  static async post<T>(
    url: string,
    options: Record<string, any> = {},
  ): Promise<any> {
    const queryString = Api.buildRequestString(url);

    try {
      const response = await Api.client.post<T>(queryString, options);
      return { data: response.data, statusCode: response.status };
    } catch (err: any) {
      return {
        error: err?.response?.data?.message || "post error",
      };
    }
  }

  static async put<T>(
    url: string,
    options: Record<string, any> = {},
  ): Promise<any> {
    const queryString = Api.buildRequestString(url);

    try {
      const response = await Api.client.put<T>(queryString, options);
      return { data: response.data, statusCode: response.status };
    } catch (err: any) {
      return {
        error: err?.response?.data?.message || "put error",
      };
    }
  }

  static async delete<T>(
    url: string,
    queryParams: Record<string, any> = {},
  ): Promise<any> {
    const queryString = Api.buildRequestString(url, queryParams);

    try {
      const response = await Api.client.delete<T>(queryString);
      return { data: response.data, statusCode: response.status };
    } catch (err: any) {
      return {
        error: err?.response?.data?.message || "delete error",
      };
    }
  }

  static async patch<T>(
    url: string,
    options: Record<string, any> = {},
  ): Promise<any> {
    const queryString = Api.buildRequestString(url);

    try {
      const response = await Api.client.patch<T>(queryString, options);
      return { data: response.data, statusCode: response.status };
    } catch (err: any) {
      return {
        error: err?.response?.data?.message || "patch error",
      };
    }
  }
}

Api.instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cq_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Api;
