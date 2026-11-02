/**
 * @generated SignedSource<<2c9e252bf2dc6af0a234cd10697a91d6>>
 * @relayHash 85f67a6e82e24c867b459ceddabf0683
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 85f67a6e82e24c867b459ceddabf0683

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HomePageQuery$variables = Record<PropertyKey, never>;
export type HomePageQuery$data = {
  readonly active: {
    readonly nodes: ReadonlyArray<{
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"HomePage_checklist">;
    } | null | undefined> | null | undefined;
    readonly totalCount: number | null | undefined;
  } | null | undefined;
  readonly lists: {
    readonly totalCount: number | null | undefined;
  } | null | undefined;
};
export type HomePageQuery = {
  response: HomePageQuery$data;
  variables: HomePageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 5
  },
  {
    "kind": "Literal",
    "name": "where",
    "value": {
      "completed": false
    }
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": "lists",
  "args": [
    {
      "kind": "Literal",
      "name": "first",
      "value": 1
    }
  ],
  "concreteType": "RootQueryToListoryListSearchConnection",
  "kind": "LinkedField",
  "name": "listoryListSearch",
  "plural": false,
  "selections": [
    (v1/*:: as any*/)
  ],
  "storageKey": "listoryListSearch(first:1)"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "HomePageQuery",
    "selections": [
      {
        "alias": "active",
        "args": (v0/*:: as any*/),
        "concreteType": "RootQueryToListoryChecklistSearchConnection",
        "kind": "LinkedField",
        "name": "listoryChecklistSearch",
        "plural": false,
        "selections": [
          (v1/*:: as any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "ListoryChecklist",
            "kind": "LinkedField",
            "name": "nodes",
            "plural": true,
            "selections": [
              (v2/*:: as any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "HomePage_checklist"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "listoryChecklistSearch(first:5,where:{\"completed\":false})"
      },
      (v3/*:: as any*/)
    ],
    "type": "RootQuery",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "HomePageQuery",
    "selections": [
      {
        "alias": "active",
        "args": (v0/*:: as any*/),
        "concreteType": "RootQueryToListoryChecklistSearchConnection",
        "kind": "LinkedField",
        "name": "listoryChecklistSearch",
        "plural": false,
        "selections": [
          (v1/*:: as any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "ListoryChecklist",
            "kind": "LinkedField",
            "name": "nodes",
            "plural": true,
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
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 100
                  }
                ],
                "concreteType": "ListoryChecklistToListoryChecklistItemConnection",
                "kind": "LinkedField",
                "name": "items",
                "plural": false,
                "selections": [
                  (v1/*:: as any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ListoryChecklistItem",
                    "kind": "LinkedField",
                    "name": "nodes",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "checked",
                        "storageKey": null
                      },
                      (v2/*:: as any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "items(first:100)"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "listoryChecklistSearch(first:5,where:{\"completed\":false})"
      },
      (v3/*:: as any*/)
    ]
  },
  "params": {
    "cacheID": "85f67a6e82e24c867b459ceddabf0683",
    "id": "85f67a6e82e24c867b459ceddabf0683",
    "metadata": {},
    "name": "HomePageQuery",
    "operationKind": "query",
    "text": "query HomePageQuery {\n  active: listoryChecklistSearch(where: {completed: false}, first: 5) {\n    totalCount\n    nodes {\n      id\n      ...HomePage_checklist\n    }\n  }\n  lists: listoryListSearch(first: 1) {\n    totalCount\n  }\n}\n\nfragment HomePage_checklist on ListoryChecklist {\n  id\n  title\n  items(first: 100) {\n    totalCount\n    nodes {\n      checked\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "955ba50f2cf14bf75e0b6edd4e77545b";

export default node;
