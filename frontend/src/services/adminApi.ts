const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface AdminLoginResponse {
  success: boolean;
  message?: string;
}

export interface AdminHealthResponse {
  success: boolean;
  health: {
    database?: {
      status: string;
      message?: string;
    };
    ai?: {
      status: string;
      message?: string;
    };
    github?: {
      status: string;
      message?: string;
    };
  };
}

export interface AdminStatsResponse {
  success: boolean;
  stats: {
    repositories: number;
    pullRequests: number;
    reviews: number;
    webhooks: number;
    completed: number;
    running: number;
    queued: number;
    failed: number;
  };
  recentReviews?: any[];
  recentWebhooks?: any[];
  activities?: any[];
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/api/health`, {
      method: 'GET',
      credentials: 'include',
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error(
      `Backend trả về response không phải JSON (${response.status})`,
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`,
    );
  }

  return data;
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      username,
      password,
    }),
  });

  return parseResponse<AdminLoginResponse>(response);
}

export async function logoutAdmin(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
}

export async function getAdminHealth(): Promise<AdminHealthResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/api/health`, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.status === 401) {
    throw new Error('ADMIN_UNAUTHORIZED');
  }

  return parseResponse<AdminHealthResponse>(response);
}

export async function getAdminStats(): Promise<AdminStatsResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/api/stats`, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.status === 401) {
    throw new Error('ADMIN_UNAUTHORIZED');
  }

  return parseResponse<AdminStatsResponse>(response);
}