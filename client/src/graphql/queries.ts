import { gql } from '@apollo/client';
import { LIST_FIELDS, CHECKLIST_FIELDS } from '@/graphql/fragments';

export const GET_LISTS = gql`
  query GetLists {
    listoryLists(first: 100) {
      nodes {
        ...ListFields
        items
      }
    }
  }
  ${LIST_FIELDS}
`;

export const GET_LIST = gql`
  query GetList($id: ID!) {
    listoryList(id: $id, idType: DATABASE_ID) {
      ...ListFields
      items
    }
  }
  ${LIST_FIELDS}
`;

export const GET_CHECKLISTS = gql`
  query GetChecklists {
    listoryChecklists(first: 100) {
      nodes {
        ...ChecklistFields
      }
    }
  }
  ${CHECKLIST_FIELDS}
`;

export const GET_CHECKLIST = gql`
  query GetChecklist($id: ID!) {
    listoryChecklist(id: $id, idType: DATABASE_ID) {
      ...ChecklistFields
    }
  }
  ${CHECKLIST_FIELDS}
`;
