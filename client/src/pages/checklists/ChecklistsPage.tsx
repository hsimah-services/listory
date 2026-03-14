import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useData } from '@/context/DataContext';

export function ChecklistsPage() {
  const { checklists, loading, deleteChecklist } = useData();
  const [search, setSearch] = useState('');

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const filteredChecklists = checklists.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const activeChecklists = filteredChecklists.filter((c) => !c.completed);
  const completedChecklists = filteredChecklists.filter((c) => c.completed);

  const handleDelete = async (id: string) => {
    await deleteChecklist(id);
  };

  const renderTable = (items: typeof filteredChecklists) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((checklist) => {
          const checked = checklist.items.filter((i) => i.checked).length;
          const total = checklist.items.length;
          return (
            <TableRow key={checklist.id}>
              <TableCell>
                <Link
                  to={`/checklists/${checklist.id}`}
                  className="font-medium hover:underline"
                >
                  {checklist.title}
                </Link>
              </TableCell>
              <TableCell>{total} items</TableCell>
              <TableCell>
                {checked}/{total}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(checklist.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <Card
        header={
          <CardHeader title={<CardTitle>Checklists</CardTitle>}>
            <Button asChild>
              <Link to="/checklists/new">New Checklist</Link>
            </Button>
          </CardHeader>
        }
        content={
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search checklists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {filteredChecklists.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {search ? 'No checklists match your search.' : 'No checklists yet. Create your first checklist!'}
              </p>
            ) : (
              <div className="space-y-6">
                {activeChecklists.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Active</h3>
                    {renderTable(activeChecklists)}
                  </div>
                )}
                {completedChecklists.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Completed</h3>
                    {renderTable(completedChecklists)}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        }
      />
      <Outlet />
    </div>
  );
}
