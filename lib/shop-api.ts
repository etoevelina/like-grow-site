import { API_URL } from './api-config';

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
  sort_order?: number;
}

export interface PurchaseResult {
  success: boolean;
  message?: string;
  avatar?: {
    id: number;
    user_id: number;
    level: number;
    experience: number;
    coins: number;
    state: string;
    current_image_url?: string;
    current_video_url?: string;
    accessories?: string[];
  };
  purchased?: string;
  item?: ShopItem;
  image_updated?: boolean;
  video_updated?: boolean;
  error?: string;
}

// Get all active shop items (public endpoint)
export async function getShopItems(): Promise<{ success: boolean; items?: ShopItem[]; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/shop/items`, {
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

// Purchase an item from shop
export async function purchaseItem(itemId: number): Promise<PurchaseResult> {
  try {
    const res = await fetch(`${API_URL}/avatar/purchase`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ accessory_id: itemId }),
    });
    
    const data = await res.json();
    
    if (res.ok) {
      return { 
        success: true,
        avatar: data.avatar,
        purchased: data.purchased,
        item: data.item,
        image_updated: data.image_updated,
        video_updated: data.video_updated,
        message: data.message,
      };
    }
    
    return { success: false, error: data.error || 'Purchase failed' };
  } catch (e) {
    return { success: false, error: 'Network error' };
  }
}

// Note: Backend has no /shop/inventory endpoint. Purchased items are on avatar.accessories (shop item ids).
