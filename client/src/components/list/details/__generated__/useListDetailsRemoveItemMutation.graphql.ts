/**
 * @generated SignedSource<<77b960b0fd175d925b2fda5bd74b29fa>>
 * @relayHash a6067a79398b369191e3e539b21a415d
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID a6067a79398b369191e3e539b21a415d

import { ConcreteRequest } from 'relay-runtime';
export type DeleteListoryListItemInput = {
  clientMutationId?: string | null | undefined;
  id: string;
};
export type useListDetailsRemoveItemMutation$variables = {
  input: DeleteListoryListItemInput;
};
export type useListDetailsRemoveItemMutation$data = {
  readonly deleteListoryListItem: {
    readonly deletedId: string | null | undefined;
  } | null | undefined;
};
export type useListDetailsRemoveItemMutation = {
  response: useListDetailsRemoveItemMutation$data;
  variables: useListDetailsRemoveItemMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "DeleteListoryListItemPayload",
    "kind": "LinkedField",
    "name": "deleteListoryListItem",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "deletedId",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useListDetailsRemoveItemMutation",
    "selections": (v1/*:: as any*/),
    "type": "RootMutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "useListDetailsRemoveItemMutation",
    "selections": (v1/*:: as any*/)
  },
  "params": {
    "cacheID": "a6067a79398b369191e3e539b21a415d",
    "id": "a6067a79398b369191e3e539b21a415d",
    "metadata": {},
    "name": "useListDetailsRemoveItemMutation",
    "operationKind": "mutation",
    "text": "mutation useListDetailsRemoveItemMutation(\n  $input: DeleteListoryListItemInput!\n) {\n  deleteListoryListItem(input: $input) {\n    deletedId\n  }\n}\n"
  }
};
})();

(node as any).hash = "44e78232c700f9fb9ce79643470a1c9a";

export default node;
