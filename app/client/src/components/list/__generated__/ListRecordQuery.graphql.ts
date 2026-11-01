/**
 * @generated SignedSource<<79bd1c858d122bd60a8d99ca2654022e>>
 * @relayHash 1d7efba54f45566476ff9c68f3feb9eb
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 1d7efba54f45566476ff9c68f3feb9eb

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ListRecordQuery$variables = {
  id: string;
};
export type ListRecordQuery$data = {
  readonly listoryList: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"ListDetails_list" | "ListForm_list">;
  } | null | undefined;
};
export type ListRecordQuery = {
  response: ListRecordQuery$data;
  variables: ListRecordQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ListRecordQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "ListoryList",
        "kind": "LinkedField",
        "name": "listoryList",
        "plural": false,
        "selections": [
          (v2/*:: as any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ListDetails_list"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ListForm_list"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootQuery",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "ListRecordQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "ListoryList",
        "kind": "LinkedField",
        "name": "listoryList",
        "plural": false,
        "selections": [
          (v2/*:: as any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 100
              }
            ],
            "concreteType": "ListoryListToListoryListItemConnection",
            "kind": "LinkedField",
            "name": "items",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ListoryListItem",
                "kind": "LinkedField",
                "name": "nodes",
                "plural": true,
                "selections": [
                  (v2/*:: as any*/),
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
            "storageKey": "items(first:100)"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1d7efba54f45566476ff9c68f3feb9eb",
    "id": "1d7efba54f45566476ff9c68f3feb9eb",
    "metadata": {},
    "name": "ListRecordQuery",
    "operationKind": "query",
    "text": "query ListRecordQuery(\n  $id: ID!\n) {\n  listoryList(id: $id) {\n    id\n    ...ListDetails_list\n    ...ListForm_list\n  }\n}\n\nfragment ListDetails_list on ListoryList {\n  id\n  title\n  createdAt\n  items(first: 100) {\n    nodes {\n      id\n      name\n    }\n  }\n}\n\nfragment ListForm_list on ListoryList {\n  id\n  title\n}\n"
  }
};
})();

(node as any).hash = "7f74140d848d2624621ac5fe5716b1f6";

export default node;
