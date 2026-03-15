const API_BASE = 'https://goldfish-app-ohjd4.ondigitalocean.app/api';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Stats
export interface AdminStats {
  users_count: number;
  avatars_count: number;
  shop_items_count: number;
  prompts_count: number;
  saved_posts_count: number;
}

export async function getAdminStats(): Promise<{ success: boolean; data?: AdminStats; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    
    if (res.status === 403) {
      return { success: false, error: 'Access denied. Admin role required.' };
    }
    
    return { success: false, error: 'Failed to fetch stats' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function checkAdminAccess(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/check`, {
      headers: getAuthHeaders(),
    });
    
    if (res.ok) {
      const data = await res.json();
      return data.ok === true && data.role === 'admin';
    }
    
    return false;
  } catch {
    return false;
  }
}

// Prompts
export interface Prompt {
  key: string;
  content: string;
  description?: string;
  updated_at: string;
}

export async function getPrompts(): Promise<{ success: boolean; data?: Prompt[]; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/prompts`, {
      headers: getAuthHeaders(),
    });
    
    if (res.ok) {
      const data = await res.json();
      return { success: true, data: data.prompts };
    }
    
    return { success: false, error: 'Failed to fetch prompts' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function getPrompt(key: string): Promise<{ success: boolean; data?: Prompt; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/prompts/${key}`, {
      headers: getAuthHeaders(),
    });
    
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    
    return { success: false, error: 'Prompt not found' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function updatePrompt(key: string, content: string, description?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/prompts/${key}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content, description }),
    });
    
    if (res.ok) {
      return { success: true };
    }
    
    const data = await res.json();
    return { success: false, error: data.error || 'Failed to update prompt' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function createPrompt(key: string, content: string, description?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/prompts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ key, content, description }),
    });
    
    if (res.ok) {
      return { success: true };
    }
    
    const data = await res.json();
    return { success: false, error: data.error || 'Failed to create prompt' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

// Shop Items
export interface ShopItem {
  id: number;
  name: string;
  description?: string;
  cost: number;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function getShopItems(): Promise<{ success: boolean; data?: ShopItem[]; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/shop/items`, {
      headers: getAuthHeaders(),
    });
    
    if (res.ok) {
      const data = await res.json();
      return { success: true, data: data.items };
    }
    
    return { success: false, error: 'Failed to fetch shop items' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function getShopItem(id: number): Promise<{ success: boolean; data?: ShopItem; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/shop/items/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    
    return { success: false, error: 'Item not found' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function createShopItem(formData: FormData): Promise<{ success: boolean; data?: ShopItem; error?: string }> {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/admin/shop/items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    
    const data = await res.json();
    return { success: false, error: data.error || 'Failed to create item' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function updateShopItem(id: number, formData: FormData): Promise<{ success: boolean; data?: ShopItem; error?: string }> {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/admin/shop/items/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    
    const data = await res.json();
    return { success: false, error: data.error || 'Failed to update item' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function deleteShopItem(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/shop/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (res.ok) {
      return { success: true };
    }
    
    const data = await res.json();
    return { success: false, error: data.error || 'Failed to delete item' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}
