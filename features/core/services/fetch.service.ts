// Service générique pour les appels API avec authentification

export interface FetchOptions {
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
}

export class FetchService {
  private static readonly BASE_URL = process.env.NODE_ENV === 'development' 
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1');

  static async fetchData<T>(
    endpoint: string,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    dataKey?: string,
    options?: FetchOptions
  ): Promise<void> {
    try {
      setLoading(true);
      
      const url = endpoint.startsWith('http') ? endpoint : `${this.BASE_URL}/${endpoint}`;
      
      const response = await fetch(url, {
        method: options?.method || 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          ...options?.headers
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${dataKey || 'data'}: ${response.statusText}`);
      }
      
      if (response.status === 204) {
        setState([]);
        return;
      }
      
      const data = await response.json();
      console.log(`${dataKey || 'Data'}:`, data);
      setState(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error(`Failed to fetch ${dataKey || 'data'}:`, err);
      setState([]);
    } finally {
      setLoading(false);
    }
  }

  static async makeRequest<T>(
    endpoint: string,
    options: FetchOptions & { method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' },
    dataKey?: string
  ): Promise<T> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${this.BASE_URL}/${endpoint}`;
      
      const response = await fetch(url, {
        method: options.method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${options.method} ${dataKey || 'data'}: ${response.statusText}`);
      }
      
      if (response.status === 204) {
        return undefined as T;
      }
      
      const data = await response.json();
      console.log(`${options.method} ${dataKey || 'Data'}:`, data);
      return data;
    } catch (err) {
      console.error(`Failed to ${options.method} ${dataKey || 'data'}:`, err);
      throw err;
    }
  }

  static async get<T>(
    endpoint: string,
    dataKey?: string,
    options?: Omit<FetchOptions, 'method' | 'body'>
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' }, dataKey);
  }

  static async post<T>(
    endpoint: string,
    body: any,
    dataKey?: string,
    options?: Omit<FetchOptions, 'method' | 'body'>
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'POST', body }, dataKey);
  }

  static async put<T>(
    endpoint: string,
    body: any,
    dataKey?: string,
    options?: Omit<FetchOptions, 'method' | 'body'>
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PUT', body }, dataKey);
  }

  static async delete<T>(
    endpoint: string,
    dataKey?: string,
    options?: Omit<FetchOptions, 'method' | 'body'>
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' }, dataKey);
  }

  static async patch<T>(
    endpoint: string,
    body: any,
    dataKey?: string,
    options?: Omit<FetchOptions, 'method' | 'body'>
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PATCH', body }, dataKey);
  }
}
