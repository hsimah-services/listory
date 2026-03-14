import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useData } from '@/context/DataContext';

export function HomePage() {
  const { lists, checklists, loading } = useData();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const activeChecklists = checklists.filter((c) => !c.completed);
  const completedChecklists = checklists.filter((c) => c.completed);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card
          header={
            <CardHeader title={<CardTitle>Permanent Lists</CardTitle>} />
          }
          content={
            <CardContent>
              <p className="text-3xl font-bold">{lists.length}</p>
              <p className="text-sm text-muted-foreground">reusable templates</p>
              <div className="mt-4">
                <Button asChild>
                  <Link to="/lists">View Lists</Link>
                </Button>
              </div>
            </CardContent>
          }
        />

        <Card
          header={
            <CardHeader title={<CardTitle>Active Checklists</CardTitle>} />
          }
          content={
            <CardContent>
              <p className="text-3xl font-bold">{activeChecklists.length}</p>
              <p className="text-sm text-muted-foreground">in progress</p>
              <div className="mt-4">
                <Button asChild>
                  <Link to="/checklists">View Checklists</Link>
                </Button>
              </div>
            </CardContent>
          }
        />

        <Card
          header={
            <CardHeader title={<CardTitle>Completed</CardTitle>} />
          }
          content={
            <CardContent>
              <p className="text-3xl font-bold">{completedChecklists.length}</p>
              <p className="text-sm text-muted-foreground">checklists finished</p>
            </CardContent>
          }
        />
      </div>

      <div className="flex gap-4">
        <Button asChild>
          <Link to="/lists/new">New List</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/checklists/new">New Checklist</Link>
        </Button>
      </div>
    </div>
  );
}
