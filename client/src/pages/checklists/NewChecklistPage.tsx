import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { useData } from '@/context/DataContext';

export function NewChecklistPage() {
  const navigate = useNavigate();
  const { lists, createChecklist } = useData();
  const [title, setTitle] = useState('');
  const [selectedListIds, setSelectedListIds] = useState<Set<number>>(new Set());

  const handleToggleList = (listId: number) => {
    setSelectedListIds((prev) => {
      const next = new Set(prev);
      if (next.has(listId)) {
        next.delete(listId);
      } else {
        next.add(listId);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const checklist = await createChecklist(
      title.trim(),
      Array.from(selectedListIds)
    );
    navigate(`/checklists/${checklist.id}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card
        header={
          <CardHeader title={<CardTitle>Create New Checklist</CardTitle>} />
        }
        content={
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Checklist Name</Label>
              <Input
                id="title"
                placeholder="e.g., Park BBQ Picnic - March 15"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Select Lists to Merge</Label>
              {lists.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No permanent lists available. Create some lists first.
                </p>
              ) : (
                <div className="space-y-2">
                  {lists.map((list) => (
                    <label
                      key={list.id}
                      className="flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer hover:bg-accent"
                    >
                      <Checkbox
                        checked={selectedListIds.has(parseInt(list.id, 10))}
                        onCheckedChange={() => handleToggleList(parseInt(list.id, 10))}
                      />
                      <div>
                        <span className="text-sm font-medium">{list.title}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({list.items.length} items)
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        }
        footer={
          <CardFooter className="gap-2">
            <Button type="submit" disabled={!title.trim()}>
              Create Checklist
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/checklists')}>
              Cancel
            </Button>
          </CardFooter>
        }
      />
    </form>
  );
}
