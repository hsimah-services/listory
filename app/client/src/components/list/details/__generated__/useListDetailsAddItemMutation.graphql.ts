/**
 * @generated SignedSource<<16c9e202be0b37cd1f555d2666b38638>>
 * @relayHash 84a6636f1f4e5ec685d688fb0374d8ae
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 84a6636f1f4e5ec685d688fb0374d8ae

import { ConcreteRequest } from 'relay-runtime';
export type CreateListoryListItemInput = {
  clientMutationId?: string | null | undefined;
  list?: string | null | undefined;
  name: string;
};
export type useListDetailsAddItemMutation$variables = {
  input: CreateListoryListItemInput;
};
export type useListDetailsAddItemMutation$data = {
  readonly createListoryListItem: {
    readonly listoryListItem: {
      readonly id: string;
      readonly name: string;
    } | null | undefined;
  } | null | undefined;
};
export type useListDetailsAddItemMutation = {
  response: useListDetailsAddItemMutation$data;
  variables: useListDetailsAddItemMutation$variables;
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
    "concreteType": "CreateListoryListItemPayload",
    "kind": "LinkedField",
    "name": "createListoryListItem",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "ListoryListItem",
        "kind": "LinkedField",
        "name": "listoryListItem",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          }
        ],
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
    "name": "useListDetailsAddItemMutation",
    "selections": (v1/*:: as any*/),
    "type": "RootMutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "useListDetailsAddItemMutation",
    "selections": (v1/*:: as any*/)
  },
  "params": {
    "cacheID": "84a6636f1f4e5ec685d688fb0374d8ae",
    "id": "84a6636f1f4e5ec685d688fb0374d8ae",
    "metadata": {},
    "name": "useListDetailsAddItemMutation",
    "operationKind": "mutation",
    "text": "mutation useListDetailsAddItemMutation(\n  $input: CreateListoryListItemInput!\n) {\n  createListoryListItem(input: $input) {\n    listoryListItem {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "53adcff1b4f708bd6468514942be056b";

export default node;
