import { gql } from '@apollo/client';

export const LIST_FIELDS = gql`
  fragment ListFields on ListoryList {
    databaseId
    title
  }
`;

export const CHECKLIST_FIELDS = gql`
  fragment ChecklistFields on ListoryChecklist {
    databaseId
    title
    completedAt
    completed
    sourceLists {
      databaseId
      title
      items
    }
    items {
      name
      checked
      sourceListId
    }
  }
`;
