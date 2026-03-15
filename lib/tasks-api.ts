import { API_URL } from './api-config';

export interface Task {
  id: number;
  key: string;
  name: string;
  description: string | null;
  xp_reward: number;
  coins_reward: number;
  sort_order: number;
  is_first_blocking: boolean;
  is_active: boolean;
  completed?: boolean;
  can_complete?: boolean;
}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export async function getTasks(): Promise<{ success: boolean; tasks?: Task[]; error?: string }> {
  try {
    const token = getAccessToken();
    if (!token) return { success: false, error: 'Not authenticated' };
    const res = await fetch(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Failed to load tasks' };
    return { success: true, tasks: data.tasks ?? [] };
  } catch (e) {
    console.error('getTasks error:', e);
    return { success: false, error: 'Network error' };
  }
}

export async function completeTask(
  taskId: number
): Promise<{
  success: boolean;
  task?: Task;
  xp_awarded?: number;
  coins_awarded?: number;
  avatar?: unknown;
  error?: string;
}> {
  try {
    const token = getAccessToken();
    if (!token) return { success: false, error: 'Not authenticated' };
    const res = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Failed to complete task' };
    return {
      success: true,
      task: data.task,
      xp_awarded: data.xp_awarded,
      coins_awarded: data.coins_awarded,
      avatar: data.avatar,
    };
  } catch (e) {
    console.error('completeTask error:', e);
    return { success: false, error: 'Network error' };
  }
}
