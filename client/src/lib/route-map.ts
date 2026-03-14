import React from 'react';

const HomePage = React.lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const ListsPage = React.lazy(() => import('@/pages/lists/ListsPage').then(m => ({ default: m.ListsPage })));
const NewListPage = React.lazy(() => import('@/pages/lists/NewListPage').then(m => ({ default: m.NewListPage })));
const ListDetailPage = React.lazy(() => import('@/pages/lists/ListDetailPage').then(m => ({ default: m.ListDetailPage })));
const ChecklistsPage = React.lazy(() => import('@/pages/checklists/ChecklistsPage').then(m => ({ default: m.ChecklistsPage })));
const NewChecklistPage = React.lazy(() => import('@/pages/checklists/NewChecklistPage').then(m => ({ default: m.NewChecklistPage })));
const ChecklistDetailPage = React.lazy(() => import('@/pages/checklists/ChecklistDetailPage').then(m => ({ default: m.ChecklistDetailPage })));

export interface RouteChild {
  path: string;
  element: React.ComponentType;
  label?: string;
}

export interface RouteConfig {
  path: string;
  label?: string;
  element: React.ComponentType;
  children?: RouteChild[];
}

export const routeMap: RouteConfig[] = [
  {
    path: '/',
    element: HomePage,
  },
  {
    path: '/lists',
    label: 'Lists',
    element: ListsPage,
    children: [
      { path: 'new', element: NewListPage },
      { path: ':id', element: ListDetailPage },
    ],
  },
  {
    path: '/checklists',
    label: 'Checklists',
    element: ChecklistsPage,
    children: [
      { path: 'new', element: NewChecklistPage },
      { path: ':id', element: ChecklistDetailPage },
    ],
  },
];

export const navItems = routeMap
  .filter((route) => route.label)
  .map((route) => ({
    path: route.path,
    label: route.label!,
  }));
