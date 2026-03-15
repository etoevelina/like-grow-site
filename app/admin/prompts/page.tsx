'use client';

import { useEffect, useState } from 'react';
import { getPrompts, updatePrompt, createPrompt, Prompt } from '@/lib/admin-api';
import { Plus, Save, X, Edit2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit dialog state
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Create dialog state
  const [showCreate, setShowCreate] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    loadPrompts();
  }, []);

  async function loadPrompts() {
    setLoading(true);
    const result = await getPrompts();
    if (result.success && result.data) {
      setPrompts(result.data);
    } else {
      setError(result.error || 'Failed to load prompts');
    }
    setLoading(false);
  }

  function openEdit(prompt: Prompt) {
    setEditingPrompt(prompt);
    setEditContent(prompt.content);
    setEditDescription(prompt.description || '');
  }

  function closeEdit() {
    setEditingPrompt(null);
    setEditContent('');
    setEditDescription('');
  }

  async function handleSave() {
    if (!editingPrompt) return;
    
    setSaving(true);
    const result = await updatePrompt(editingPrompt.key, editContent, editDescription);
    if (result.success) {
      await loadPrompts();
      closeEdit();
    } else {
      setError(result.error || 'Failed to save');
    }
    setSaving(false);
  }

  async function handleCreate() {
    if (!newKey.trim() || !newContent.trim()) return;
    
    setSaving(true);
    const result = await createPrompt(newKey.trim(), newContent, newDescription);
    if (result.success) {
      await loadPrompts();
      setShowCreate(false);
      setNewKey('');
      setNewContent('');
      setNewDescription('');
    } else {
      setError(result.error || 'Failed to create');
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prompts</h1>
          <p className="text-muted-foreground mt-1">Manage AI prompts for avatar generation</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Prompt
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error}
          <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-2">
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {prompts.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No prompts found</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowCreate(true)}>
                Create your first prompt
              </Button>
            </CardContent>
          </Card>
        ) : (
          prompts.map(prompt => (
            <Card key={prompt.key} className="bg-card border-border">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-mono">{prompt.key}</CardTitle>
                  {prompt.description && (
                    <p className="text-sm text-muted-foreground mt-1">{prompt.description}</p>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={() => openEdit(prompt)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-muted-foreground bg-muted p-3 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-32">
                  {prompt.content.slice(0, 300)}{prompt.content.length > 300 ? '...' : ''}
                </pre>
                <p className="text-xs text-muted-foreground mt-2">
                  Updated: {new Date(prompt.updated_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPrompt} onOpenChange={open => !open && closeEdit()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Prompt: {editingPrompt?.key}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Short description of this prompt"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={15}
                className="font-mono text-sm"
                placeholder="Prompt content..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeEdit} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Prompt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="newKey">Key</Label>
              <Input
                id="newKey"
                value={newKey}
                onChange={e => setNewKey(e.target.value)}
                placeholder="prompt_key"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newDescription">Description</Label>
              <Input
                id="newDescription"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Short description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newContent">Content</Label>
              <Textarea
                id="newContent"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={10}
                className="font-mono text-sm"
                placeholder="Prompt content..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreate(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={saving || !newKey.trim() || !newContent.trim()}>
                {saving ? (
                  <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
