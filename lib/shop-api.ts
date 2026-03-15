const API_BASE = 'https://goldfish-app-ohjd4.ondigitalocean.app/api';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export interface ShopItem {
  id: number;
  name: string;
  description?: string;
  cost: number;
  image_url?: string;
  category?: string;
  is_active: boolean;
}

export interface PurchaseResult {
  success: boolean;
  message?: string;
  new_balance?: number;
  error?: string;
}

// Get all active shop items (public endpoint)
export async function getShopItems(): Promise<{ success: boolean; items?: ShopItem[]; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/shop/items`, {
      headers: getAuthHeaders(),
    });
    
    if (res.ok) {
      const data = await res.json();
      return { success: true, items: data.items || data };
    }
    
    return { success: false, error: 'Failed to fetch shop items' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

// Purchase an item
export async function purchaseItem(itemId: number): Promise<PurchaseResult> {
  try {
    const res = await fetch(`${API_BASE}/shop/purchase`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ item_id: itemId }),
    });
    
    const data = await res.json();
    
    if (res.ok) {
      return { 
        success: true, 
        message: data.message,
        new_balance: data.new_balance 
      };
    }
    
    return { success: false, error: data.error || 'Purchase failed' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

// Get user's purchased items (inventory)
export async function getInventory(): Promise<{ success: boolean; items?: ShopItem[]; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/shop/inventory`, {
      headers: getAuthHeaders(),
    });
    
    if (res.ok) {
      const data = await res.json();
      return { success: true, items: data.items || data };
    }
    
    return { success: false, error: 'Failed to fetch inventory' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}
