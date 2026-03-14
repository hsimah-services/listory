import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select } from '@/components/ui/Select';
import { useData } from '@/context/DataContext';
import { Plus, Trash2 } from 'lucide-react';

export function ChecklistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getChecklist,
    lists,
    toggleChecklistItem,
    addListToChecklist,
    removeListFromChecklist,
    deleteChecklist,
    loading,
  } = useData();

  const [selectedAddListId, setSelectedAddListId] = useState('');

  const checklist = getChecklist(id!);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!checklist) {
    return <div className="p-4">Checklist not found.</div>;
  }

  const handleToggle = async (itemName: string, currentChecked: boolean) => {
    await toggleChecklistItem(id!, itemName, !currentChecked);
  };

  const handleAddList = async () => {
    if (!selectedAddListId) return;
    await addListToChecklist(id!, parseInt(selectedAddListId, 10));
    setSelectedAddListId('');
  };

  const handleRemoveList = async (listId: number) => {
    await removeListFromChecklist(id!, listId);
  };

  const handleDelete = async () => {
    await deleteChecklist(id!);
    navigate('/checklists');
  };

  const checkedCount = checklist.items.filter((i) => i.checked).length;
  const totalCount = checklist.items.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Lists not yet added to this checklist
  const sourceListIds = new Set(checklist.sourceLists.map((l) => l.id));
  const availableLists = lists.filter((l) => !sourceListIds.has(l.id));

  // Group items by source list
  const itemsBySource = new Map<string, typeof checklist.items>();
  for (const item of checklist.items) {
    const key = item.sourceListId ? String(item.sourceListId) : 'adhoc';
    if (!itemsBySource.has(key)) {
      itemsBySource.set(key, []);
    }
    itemsBySource.get(key)!.push(item);
  }

  return (
    <div className="space-y-6">
      <Card
        header={
          <CardHeader title={<CardTitle>{checklist.title}</CardTitle>}>
            <div className="flex items-center gap-4">
              {checklist.completed && (
                <span className="text-sm font-medium text-green-600">Completed</span>
              )}
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        }
        content={
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                <span>{checkedCount} of {totalCount} items</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {checklist.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items in this checklist.</p>
            ) : (
              <ul className="space-y-1">
                {checklist.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center gap-3 rounded-md border px-3 py-2"
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={() => handleToggle(item.name, item.checked)}
                    />
                    <span
                      className={item.checked ? 'line-through text-muted-foreground' : ''}
                    >
                      {item.name}
                    </span>
                    {item.sourceListId && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        {checklist.sourceLists.find((l) => l.id === String(item.sourceListId))?.title}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        }
      />

      <Card
        header={
          <CardHeader title={<CardTitle>Source Lists</CardTitle>}>
            <CardDescription>Lists merged into this checklist</CardDescription>
          </CardHeader>
        }
        content={
          <CardContent className="space-y-4">
            {checklist.sourceLists.length > 0 && (
              <ul className="space-y-2">
                {checklist.sourceLists.map((list) => (
                  <li
                    key={list.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <span className="text-sm font-medium">{list.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveList(parseInt(list.id, 10))}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            {availableLists.length > 0 && (
              <div className="flex gap-2">
                <Select
                  value={selectedAddListId}
                  onChange={(e) => setSelectedAddListId(e.target.value)}
                >
                  <option value="">Add a list...</option>
                  {availableLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.title} ({list.items.length} items)
                    </option>
                  ))}
                </Select>
                <Button
                  variant="outline"
                  onClick={handleAddList}
                  disabled={!selectedAddListId}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        }
      />
    </div>
  );
}
