/**
 * @generated SignedSource<<3abc0c2c217a9e22ef1918212a1e7c32>>
 * @relayHash 1161a0fb5d3f3f0e92f0202b4b363695
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 1161a0fb5d3f3f0e92f0202b4b363695

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ListRecordQuery$variables = {
  id: string;
};
export type ListRecordQuery$data = {
  readonly listoryList: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"ListDetails_list">;
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
    "cacheID": "1161a0fb5d3f3f0e92f0202b4b363695",
    "id": "1161a0fb5d3f3f0e92f0202b4b363695",
    "metadata": {},
    "name": "ListRecordQuery",
    "operationKind": "query",
    "text": "query ListRecordQuery(\n  $id: ID!\n) {\n  listoryList(id: $id) {\n    id\n    ...ListDetails_list\n  }\n}\n\nfragment ListDetails_list on ListoryList {\n  id\n  title\n  createdAt\n  items(first: 100) {\n    nodes {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e0979dfa64e5b582ac01e1f2340a722e";

export default node;
