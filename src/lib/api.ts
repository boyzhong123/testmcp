const DEFAULT_BASE = 'http://localhost:8081/api';

export function getApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE).replace(/\/+$/, '');
}

const TOKEN_KEY = 'chivox_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${getApiBase()}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    const msg =
      (data && typeof data === 'object' && 'error' in data && typeof (data as { error: unknown }).error === 'string')
        ? (data as { error: string }).error
        : res.statusText || `HTTP ${res.status}`;
    throw new ApiError(msg, res.status);
  }
  return data as T;
}

// ---------- Types ----------

export interface ApiUser {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKeyRecord {
  id: number;
  user_id?: number;
  name: string;
  api_key: string;
  enabled: boolean;
  created_at: string;
  core_types: string[];
}

export interface ApiCoreType {
  value: string;
  label: string;
}

// ---------- Auth ----------

export function authRegister(params: { email: string; password: string; name: string }) {
  return request<{ user: ApiUser }>('/auth/register', { method: 'POST', body: params, auth: false });
}

export function authLogin(params: { email: string; password: string }) {
  return request<{ token: string; user: ApiUser }>('/auth/login', { method: 'POST', body: params, auth: false });
}

export function authMe() {
  return request<{ user: ApiUser }>('/auth/me');
}

// ---------- Keys ----------

function normalizeKey(raw: RawApiKey): ApiKeyRecord {
  const coreTypes = Array.isArray(raw.core_types)
    ? raw.core_types.map(ct => typeof ct === 'string' ? ct : ct.core_type)
    : [];
  return {
    id: raw.id,
    user_id: raw.user_id,
    name: raw.name,
    api_key: raw.api_key,
    enabled: raw.enabled,
    created_at: raw.created_at,
    core_types: coreTypes,
  };
}

type RawApiKey = {
  id: number;
  user_id?: number;
  name: string;
  api_key: string;
  enabled: boolean;
  created_at: string;
  core_types?: Array<string | { core_type: string }>;
};

export async function listKeys(): Promise<ApiKeyRecord[]> {
  const data = await request<{ keys: RawApiKey[] }>('/keys');
  return (data.keys || []).map(normalizeKey);
}

export async function createKey(params: { name: string; core_types: string[] }): Promise<ApiKeyRecord> {
  const data = await request<{ api_key: RawApiKey }>('/keys', { method: 'POST', body: params });
  return normalizeKey(data.api_key);
}

export async function revealKey(id: number): Promise<string> {
  const data = await request<{ api_key: string }>(`/keys/${id}/reveal`);
  return data.api_key;
}

export async function resetKey(id: number): Promise<ApiKeyRecord> {
  const data = await request<{ api_key: RawApiKey }>(`/keys/${id}/reset`, { method: 'POST' });
  return normalizeKey(data.api_key);
}

export async function toggleKey(id: number): Promise<ApiKeyRecord> {
  const data = await request<{ api_key: RawApiKey }>(`/keys/${id}/toggle`, { method: 'PUT' });
  return normalizeKey(data.api_key);
}

export async function deleteKey(id: number): Promise<void> {
  await request<{ message: string }>(`/keys/${id}`, { method: 'DELETE' });
}

export async function updateKeyCoreTypes(id: number, core_types: string[]): Promise<void> {
  await request<{ message: string }>(`/keys/${id}/core-types`, { method: 'PUT', body: { core_types } });
}

// ---------- CoreTypes ----------

export async function listCoreTypes(): Promise<ApiCoreType[]> {
  const data = await request<{ core_types: ApiCoreType[] }>('/core-types');
  return data.core_types || [];
}
