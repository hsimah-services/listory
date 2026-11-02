/**
 * @generated SignedSource<<9c4bef190217b0f7e178ead65dc970f5>>
 * @relayHash 4341d8e027f25151d3e3ddb9d03c2062
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 4341d8e027f25151d3e3ddb9d03c2062

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
},
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
];
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
            "args": (v3/*:: as any*/),
            "concreteType": "ListoryListToListoryListItemConnection",
            "kind": "LinkedField",
            "name": "items",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ListoryListToListoryListItemConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ListoryListItem",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v2/*:: as any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__typename",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "PageInfo",
                "kind": "LinkedField",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasNextPage",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "items(first:100)"
          },
          {
            "alias": null,
            "args": (v3/*:: as any*/),
            "filters": null,
            "handle": "connection",
            "key": "ListDetails_items",
            "kind": "LinkedHandle",
            "name": "items"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4341d8e027f25151d3e3ddb9d03c2062",
    "id": "4341d8e027f25151d3e3ddb9d03c2062",
    "metadata": {},
    "name": "ListRecordQuery",
    "operationKind": "query",
    "text": "query ListRecordQuery(\n  $id: ID!\n) {\n  listoryList(id: $id) {\n    id\n    ...ListDetails_list\n    ...ListForm_list\n  }\n}\n\nfragment ListDetails_list on ListoryList {\n  id\n  title\n  createdAt\n  items(first: 100) {\n    edges {\n      node {\n        id\n        name\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ListForm_list on ListoryList {\n  id\n  title\n}\n"
  }
};
})();

(node as any).hash = "7f74140d848d2624621ac5fe5716b1f6";

export default node;
