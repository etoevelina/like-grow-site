'use client';

import { useEffect, useState } from 'react';
import { getAdminStats, AdminStats } from '@/lib/admin-api';
import { Users, Sparkles, ShoppingBag, FileText, Link2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    const result = await getAdminStats();
    if (result.success && result.data) {
      setStats(result.data);
    } else {
      setError(result.error || 'Failed to load stats');
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Users', value: stats?.users_count ?? 0, icon: Users, color: 'text-blue-500' },
    { label: 'Avatars', value: stats?.avatars_count ?? 0, icon: Sparkles, color: 'text-purple-500' },
    { label: 'Shop Items', value: stats?.shop_items_count ?? 0, icon: ShoppingBag, color: 'text-green-500' },
    { label: 'Prompts', value: stats?.prompts_count ?? 0, icon: FileText, color: 'text-orange-500' },
    { label: 'Saved Posts', value: stats?.saved_posts_count ?? 0, icon: Link2, color: 'text-pink-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your application</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map(stat => (
          <Card key={stat.label} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a 
              href="/admin/prompts" 
              className="block p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-foreground">Manage Prompts</p>
                  <p className="text-sm text-muted-foreground">Edit AI prompts and descriptions</p>
                </div>
              </div>
            </a>
            <a 
              href="/admin/shop" 
              className="block p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-foreground">Manage Shop</p>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove shop items</p>
                </div>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">System Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Total Users</span>
                <span className="font-medium text-foreground">{stats?.users_count ?? 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Active Avatars</span>
                <span className="font-medium text-foreground">{stats?.avatars_count ?? 0}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Content Submissions</span>
                <span className="font-medium text-foreground">{stats?.saved_posts_count ?? 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
