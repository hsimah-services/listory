/**
 * @generated SignedSource<<9fa9c932b7c0e1d64be23e76c1684bb5>>
 * @relayHash c456a560ae7edda969c7bd007c4d976b
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c456a560ae7edda969c7bd007c4d976b

import { ConcreteRequest } from 'relay-runtime';
export type UpdateListoryChecklistItemInput = {
  checked?: boolean | null | undefined;
  checklist?: string | null | undefined;
  clientMutationId?: string | null | undefined;
  id: string;
  name?: string | null | undefined;
  sourceList?: string | null | undefined;
};
export type useChecklistDetailsToggleItemMutation$variables = {
  input: UpdateListoryChecklistItemInput;
};
export type useChecklistDetailsToggleItemMutation$data = {
  readonly updateListoryChecklistItem: {
    readonly listoryChecklistItem: {
      readonly checked: boolean;
      readonly checklist: {
        readonly completedAt: string | null | undefined;
        readonly id: string;
      } | null | undefined;
      readonly id: string;
    } | null | undefined;
  } | null | undefined;
};
export type useChecklistDetailsToggleItemMutation = {
  response: useChecklistDetailsToggleItemMutation$data;
  variables: useChecklistDetailsToggleItemMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UpdateListoryChecklistItemPayload",
    "kind": "LinkedField",
    "name": "updateListoryChecklistItem",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "ListoryChecklistItem",
        "kind": "LinkedField",
        "name": "listoryChecklistItem",
        "plural": false,
        "selections": [
          (v1/*:: as any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "checked",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ListoryChecklist",
            "kind": "LinkedField",
            "name": "checklist",
            "plural": false,
            "selections": [
              (v1/*:: as any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "completedAt",
                "storageKey": null
              }
            ],
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
    "name": "useChecklistDetailsToggleItemMutation",
    "selections": (v2/*:: as any*/),
    "type": "RootMutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "useChecklistDetailsToggleItemMutation",
    "selections": (v2/*:: as any*/)
  },
  "params": {
    "cacheID": "c456a560ae7edda969c7bd007c4d976b",
    "id": "c456a560ae7edda969c7bd007c4d976b",
    "metadata": {},
    "name": "useChecklistDetailsToggleItemMutation",
    "operationKind": "mutation",
    "text": "mutation useChecklistDetailsToggleItemMutation(\n  $input: UpdateListoryChecklistItemInput!\n) {\n  updateListoryChecklistItem(input: $input) {\n    listoryChecklistItem {\n      id\n      checked\n      checklist {\n        id\n        completedAt\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6df23cba8b83a9c456e6f82ff0606e92";

export default node;
