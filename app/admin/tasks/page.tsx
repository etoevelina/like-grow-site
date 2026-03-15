'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, ClipboardList, Lock } from 'lucide-react';
import {
  getAdminTasks,
  createAdminTask,
  updateAdminTask,
  deleteAdminTask,
  reorderAdminTasks,
  type AdminTask,
} from '@/lib/admin-api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    description: '',
    xp_reward: 0,
    coins_reward: 0,
    sort_order: 0,
    is_first_blocking: false,
    is_active: true,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const result = await getAdminTasks();
    if (result.success && result.data) {
      setTasks(result.data);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setFormData({
      key: '',
      name: '',
      description: '',
      xp_reward: 0,
      coins_reward: 0,
      sort_order: tasks.length,
      is_first_blocking: false,
      is_active: true,
    });
    setIsCreating(true);
  };

  const handleEdit = (task: AdminTask) => {
    setFormData({
      key: task.key,
      name: task.name,
      description: task.description || '',
      xp_reward: task.xp_reward,
      coins_reward: task.coins_reward,
      sort_order: task.sort_order,
      is_first_blocking: task.is_first_blocking,
      is_active: task.is_active,
    });
    setEditingId(task.id);
  };

  const handleSave = async () => {
    if (!formData.key.trim() || !formData.name.trim()) {
      alert('Key and Name are required');
      return;
    }
    setSaving(true);
    try {
      if (isCreating) {
        const result = await createAdminTask({
          key: formData.key.trim(),
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          xp_reward: formData.xp_reward,
          coins_reward: formData.coins_reward,
          sort_order: formData.sort_order,
          is_first_blocking: formData.is_first_blocking,
          is_active: formData.is_active,
        });
        if (result.success) {
          await loadTasks();
          setIsCreating(false);
        } else {
          alert(result.error);
        }
      } else if (editingId) {
        const result = await updateAdminTask(editingId, {
          key: formData.key.trim(),
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          xp_reward: formData.xp_reward,
          coins_reward: formData.coins_reward,
          sort_order: formData.sort_order,
          is_first_blocking: formData.is_first_blocking,
          is_active: formData.is_active,
        });
        if (result.success) {
          await loadTasks();
          setEditingId(null);
        } else {
          alert(result.error);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this task? Users who completed it will keep their progress.')) return;
    const result = await deleteAdminTask(id);
    if (result.success) {
      await loadTasks();
    } else {
      alert(result.error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  const moveTask = async (index: number, direction: 'up' | 'down') => {
    const newOrder = [...tasks];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    const ids = newOrder.map((t) => t.id);
    const result = await reorderAdminTasks(ids);
    if (result.success && result.data) {
      setTasks(result.data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Quests users can complete for XP and coins</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">No tasks yet</p>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <Card key={task.id} className={!task.is_active ? 'opacity-60' : ''}>
              <CardHeader className="py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-base">{task.name}</CardTitle>
                      <span className="text-xs text-muted-foreground font-mono">{task.key}</span>
                      {task.is_first_blocking && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          <Lock className="w-3 h-3" /> First (blocks others)
                        </span>
                      )}
                      {!task.is_active && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Inactive</span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-green-600 dark:text-green-400">+{task.xp_reward} XP</span>
                      <span className="text-yellow-600 dark:text-yellow-400">+{task.coins_reward} coins</span>
                      <span className="text-muted-foreground">Order: {task.sort_order}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveTask(index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveTask(index, 'down')}
                      disabled={index === tasks.length - 1}
                    >
                      ↓
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(task)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreating || editingId !== null} onOpenChange={handleCancel}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'Create Task' : 'Edit Task'}</DialogTitle>
            <DialogDescription>
              {isCreating ? 'Add a new task (quest) for users' : 'Update task'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Key (unique)</Label>
                <Input
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="e.g. sync_likepost"
                  disabled={!!editingId}
                />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Task name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What the user needs to do"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>XP reward</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.xp_reward}
                  onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Coins reward</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.coins_reward}
                  onChange={(e) => setFormData({ ...formData, coins_reward: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Sort order</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_first_blocking}
                  onChange={(e) => setFormData({ ...formData, is_first_blocking: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">First task (blocks others until completed)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
