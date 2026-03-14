import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { useData } from '@/context/DataContext';
import { X } from 'lucide-react';

export function NewListPage() {
  const navigate = useNavigate();
  const { addList } = useData();
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    const trimmed = newItem.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems([...items, trimmed]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const list = await addList(title.trim(), items);
    navigate(`/lists/${list.id}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card
        header={
          <CardHeader title={<CardTitle>Create New List</CardTitle>} />
        }
        content={
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">List Name</Label>
              <Input
                id="title"
                placeholder="e.g., BBQ, Picnic, Travel..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-item">Items</Label>
              <div className="flex gap-2">
                <Input
                  id="new-item"
                  placeholder="Add an item..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button type="button" variant="outline" onClick={handleAddItem}>
                  Add
                </Button>
              </div>
            </div>

            {items.length > 0 && (
              <ul className="space-y-1">
                {items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        }
        footer={
          <CardFooter className="gap-2">
            <Button type="submit" disabled={!title.trim()}>
              Create List
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/lists')}>
              Cancel
            </Button>
          </CardFooter>
        }
      />
    </form>
  );
}
