import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { useData } from '@/context/DataContext';
import { X } from 'lucide-react';

export function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getList, updateList, deleteList, loading } = useData();

  const list = getList(id!);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list?.title ?? '');
  const [items, setItems] = useState<string[]>(list?.items ?? []);
  const [newItem, setNewItem] = useState('');

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!list) {
    return <div className="p-4">List not found.</div>;
  }

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

  const handleSave = async () => {
    await updateList(id!, title, items);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteList(id!);
    navigate('/lists');
  };

  const handleEdit = () => {
    setTitle(list.title);
    setItems([...list.items]);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <Card
        header={
          <CardHeader title={<CardTitle>Edit List</CardTitle>} />
        }
        content={
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">List Name</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-item">Add Item</Label>
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
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </CardFooter>
        }
      />
    );
  }

  return (
    <Card
      header={
        <CardHeader title={<CardTitle>{list.title}</CardTitle>}>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </CardHeader>
      }
      content={
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {list.items.length} items
          </p>
          {list.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items in this list.</p>
          ) : (
            <ul className="space-y-1">
              {list.items.map((item, index) => (
                <li
                  key={index}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      }
    />
  );
}
