import { gql } from '@apollo/client';
import { LIST_FIELDS, CHECKLIST_FIELDS } from '@/graphql/fragments';

export const CREATE_LIST = gql`
  mutation CreateList($input: CreateListoryListInput!) {
    createListoryList(input: $input) {
      listoryList {
        ...ListFields
        items
      }
    }
  }
  ${LIST_FIELDS}
`;

export const UPDATE_LIST = gql`
  mutation UpdateList($input: UpdateListoryListInput!) {
    updateListoryList(input: $input) {
      listoryList {
        ...ListFields
        items
      }
    }
  }
  ${LIST_FIELDS}
`;

export const DELETE_LIST = gql`
  mutation DeleteList($input: DeleteListoryListInput!) {
    deleteListoryList(input: $input) {
      deletedId
    }
  }
`;

export const CREATE_CHECKLIST = gql`
  mutation CreateChecklist($input: CreateListoryChecklistInput!) {
    createListoryChecklist(input: $input) {
      checklist {
        ...ChecklistFields
      }
    }
  }
  ${CHECKLIST_FIELDS}
`;

export const UPDATE_CHECKLIST = gql`
  mutation UpdateChecklist($input: UpdateListoryChecklistInput!) {
    updateListoryChecklist(input: $input) {
      checklist {
        ...ChecklistFields
      }
    }
  }
  ${CHECKLIST_FIELDS}
`;

export const DELETE_CHECKLIST = gql`
  mutation DeleteChecklist($input: DeleteListoryChecklistInput!) {
    deleteListoryChecklist(input: $input) {
      deletedId
    }
  }
`;

export const TOGGLE_CHECKLIST_ITEM = gql`
  mutation ToggleChecklistItem($input: ToggleChecklistItemInput!) {
    toggleChecklistItem(input: $input) {
      checklist {
        ...ChecklistFields
      }
    }
  }
  ${CHECKLIST_FIELDS}
`;

export const ADD_LIST_TO_CHECKLIST = gql`
  mutation AddListToChecklist($input: AddListToChecklistInput!) {
    addListToChecklist(input: $input) {
      checklist {
        ...ChecklistFields
      }
    }
  }
  ${CHECKLIST_FIELDS}
`;

export const REMOVE_LIST_FROM_CHECKLIST = gql`
  mutation RemoveListFromChecklist($input: RemoveListFromChecklistInput!) {
    removeListFromChecklist(input: $input) {
      checklist {
        ...ChecklistFields
      }
    }
  }
  ${CHECKLIST_FIELDS}
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
    }
  }
`;
