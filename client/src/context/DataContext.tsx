import { createContext, useContext, type ReactNode } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_LISTS, GET_CHECKLISTS } from '@/graphql/queries';
import {
  CREATE_LIST, UPDATE_LIST, DELETE_LIST,
  CREATE_CHECKLIST, DELETE_CHECKLIST,
  TOGGLE_CHECKLIST_ITEM,
  ADD_LIST_TO_CHECKLIST,
  REMOVE_LIST_FROM_CHECKLIST,
} from '@/graphql/mutations';
import type { List, Checklist, ChecklistItem } from '@/types';

interface DataContextType {
  lists: List[];
  checklists: Checklist[];
  addList: (title: string, items: string[]) => Promise<List>;
  updateList: (id: string, title: string, items: string[]) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  getList: (id: string) => List | undefined;
  createChecklist: (title: string, sourceListIds: number[]) => Promise<Checklist>;
  deleteChecklist: (id: string) => Promise<void>;
  toggleChecklistItem: (checklistId: string, itemName: string, checked: boolean) => Promise<void>;
  addListToChecklist: (checklistId: string, listId: number) => Promise<void>;
  removeListFromChecklist: (checklistId: string, listId: number) => Promise<void>;
  getChecklist: (id: string) => Checklist | undefined;
  loading: boolean;
  error: Error | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface GraphQLList {
  databaseId: number;
  title: string;
  items: string[] | null;
}

interface GraphQLChecklistItem {
  name: string;
  checked: boolean;
  sourceListId: number | null;
}

interface GraphQLChecklist {
  databaseId: number;
  title: string;
  completedAt: string | null;
  completed: boolean;
  sourceLists: GraphQLList[] | null;
  items: GraphQLChecklistItem[] | null;
}

interface ListsQueryData {
  listoryLists: { nodes: GraphQLList[] };
}

interface ChecklistsQueryData {
  listoryChecklists: { nodes: GraphQLChecklist[] };
}

interface CreateListData {
  createListoryList: { listoryList: GraphQLList };
}

interface CreateChecklistData {
  createListoryChecklist: { checklist: GraphQLChecklist };
}

function transformList(gqlList: GraphQLList): List {
  return {
    id: String(gqlList.databaseId),
    title: gqlList.title,
    items: gqlList.items ?? [],
  };
}

function transformChecklist(gqlChecklist: GraphQLChecklist): Checklist {
  return {
    id: String(gqlChecklist.databaseId),
    title: gqlChecklist.title,
    completedAt: gqlChecklist.completedAt,
    completed: gqlChecklist.completed,
    sourceLists: (gqlChecklist.sourceLists ?? []).map(transformList),
    items: (gqlChecklist.items ?? []).map((item: GraphQLChecklistItem): ChecklistItem => ({
      name: item.name,
      checked: item.checked,
      sourceListId: item.sourceListId,
    })),
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { data: listsData, loading: listsLoading, error: listsError } = useQuery<ListsQueryData>(GET_LISTS);
  const { data: checklistsData, loading: checklistsLoading, error: checklistsError } = useQuery<ChecklistsQueryData>(GET_CHECKLISTS);

  const [createListMutation] = useMutation<CreateListData>(CREATE_LIST, { refetchQueries: [{ query: GET_LISTS }] });
  const [updateListMutation] = useMutation(UPDATE_LIST, { refetchQueries: [{ query: GET_LISTS }] });
  const [deleteListMutation] = useMutation(DELETE_LIST, { refetchQueries: [{ query: GET_LISTS }, { query: GET_CHECKLISTS }] });
  const [createChecklistMutation] = useMutation<CreateChecklistData>(CREATE_CHECKLIST, { refetchQueries: [{ query: GET_CHECKLISTS }] });
  const [deleteChecklistMutation] = useMutation(DELETE_CHECKLIST, { refetchQueries: [{ query: GET_CHECKLISTS }] });
  const [toggleItemMutation] = useMutation(TOGGLE_CHECKLIST_ITEM, { refetchQueries: [{ query: GET_CHECKLISTS }] });
  const [addListMutation] = useMutation(ADD_LIST_TO_CHECKLIST, { refetchQueries: [{ query: GET_CHECKLISTS }] });
  const [removeListMutation] = useMutation(REMOVE_LIST_FROM_CHECKLIST, { refetchQueries: [{ query: GET_CHECKLISTS }] });

  const lists: List[] = (listsData?.listoryLists?.nodes ?? []).map(transformList);
  const checklists: Checklist[] = (checklistsData?.listoryChecklists?.nodes ?? []).map(transformChecklist);

  const loading = listsLoading || checklistsLoading;
  const error = listsError || checklistsError || null;

  const addList = async (title: string, items: string[]): Promise<List> => {
    const { data } = await createListMutation({
      variables: {
        input: {
          title,
          status: 'PUBLISH',
          items,
        },
      },
    });
    return transformList(data!.createListoryList.listoryList);
  };

  const updateList = async (id: string, title: string, items: string[]): Promise<void> => {
    await updateListMutation({
      variables: {
        input: {
          id,
          title,
          items,
        },
      },
    });
  };

  const deleteList = async (id: string): Promise<void> => {
    await deleteListMutation({ variables: { input: { id } } });
  };

  const getList = (id: string) => lists.find((list) => list.id === id);

  const createChecklistFn = async (title: string, sourceListIds: number[]): Promise<Checklist> => {
    const { data } = await createChecklistMutation({
      variables: {
        input: {
          title,
          sourceListIds,
        },
      },
    });
    return transformChecklist(data!.createListoryChecklist.checklist);
  };

  const deleteChecklist = async (id: string): Promise<void> => {
    await deleteChecklistMutation({ variables: { input: { id: parseInt(id, 10) } } });
  };

  const toggleChecklistItemFn = async (checklistId: string, itemName: string, checked: boolean): Promise<void> => {
    await toggleItemMutation({
      variables: {
        input: {
          checklistId: parseInt(checklistId, 10),
          itemName,
          checked,
        },
      },
    });
  };

  const addListToChecklistFn = async (checklistId: string, listId: number): Promise<void> => {
    await addListMutation({
      variables: {
        input: {
          checklistId: parseInt(checklistId, 10),
          listId,
        },
      },
    });
  };

  const removeListFromChecklistFn = async (checklistId: string, listId: number): Promise<void> => {
    await removeListMutation({
      variables: {
        input: {
          checklistId: parseInt(checklistId, 10),
          listId,
        },
      },
    });
  };

  const getChecklist = (id: string) => checklists.find((c) => c.id === id);

  return (
    <DataContext.Provider
      value={{
        lists,
        checklists,
        addList,
        updateList,
        deleteList,
        getList,
        createChecklist: createChecklistFn,
        deleteChecklist,
        toggleChecklistItem: toggleChecklistItemFn,
        addListToChecklist: addListToChecklistFn,
        removeListFromChecklist: removeListFromChecklistFn,
        getChecklist,
        loading,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
