import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useData } from '@/context/DataContext';

export function ListsPage() {
  const { lists, loading, deleteList } = useData();
  const [search, setSearch] = useState('');

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const filteredLists = lists.filter((list) =>
    list.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await deleteList(id);
  };

  return (
    <div className="space-y-6">
      <Card
        header={
          <CardHeader title={<CardTitle>Permanent Lists</CardTitle>}>
            <Button asChild>
              <Link to="/lists/new">New List</Link>
            </Button>
          </CardHeader>
        }
        content={
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search lists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {filteredLists.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {search ? 'No lists match your search.' : 'No lists yet. Create your first list!'}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLists.map((list) => (
                    <TableRow key={list.id}>
                      <TableCell>
                        <Link
                          to={`/lists/${list.id}`}
                          className="font-medium hover:underline"
                        >
                          {list.title}
                        </Link>
                      </TableCell>
                      <TableCell>{list.items.length} items</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(list.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        }
      />
      <Outlet />
    </div>
  );
}
