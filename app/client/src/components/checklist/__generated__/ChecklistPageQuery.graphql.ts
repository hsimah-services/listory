/**
 * @generated SignedSource<<88cd4790574838ea9cfa396c35b6441c>>
 * @relayHash b54d4c02fda753e3e9aa13b7211cdefd
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID b54d4c02fda753e3e9aa13b7211cdefd

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ChecklistPageQuery$variables = {
  completed?: boolean | null | undefined;
  term?: string | null | undefined;
};
export type ChecklistPageQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ChecklistForm_query" | "ChecklistList_query">;
};
export type ChecklistPageQuery = {
  response: ChecklistPageQuery$data;
  variables: ChecklistPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "completed"
},
v1 = {
  "defaultValue": "",
  "kind": "LocalArgument",
  "name": "term"
},
v2 = [
  {
    "kind": "Variable",
    "name": "completed",
    "variableName": "completed"
  },
  {
    "kind": "Variable",
    "name": "term",
    "variableName": "term"
  }
],
v3 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v7 = [
  (v3/*:: as any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*:: as any*/),
      (v1/*:: as any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ChecklistPageQuery",
    "selections": [
      {
        "args": (v2/*:: as any*/),
        "kind": "FragmentSpread",
        "name": "ChecklistList_query"
      },
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "ChecklistForm_query"
      }
    ],
    "type": "RootQuery",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*:: as any*/),
      (v0/*:: as any*/)
    ],
    "kind": "Operation",
    "name": "ChecklistPageQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          (v3/*:: as any*/),
          {
            "fields": (v2/*:: as any*/),
            "kind": "ObjectValue",
            "name": "where"
          }
        ],
        "concreteType": "RootQueryToListoryChecklistSearchConnection",
        "kind": "LinkedField",
        "name": "listoryChecklistSearch",
        "plural": false,
        "selections": [
          (v4/*:: as any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "ListoryChecklist",
            "kind": "LinkedField",
            "name": "nodes",
            "plural": true,
            "selections": [
              (v5/*:: as any*/),
              (v6/*:: as any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "completedAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v7/*:: as any*/),
                "concreteType": "ListoryChecklistToListoryChecklistItemConnection",
                "kind": "LinkedField",
                "name": "items",
                "plural": false,
                "selections": [
                  (v4/*:: as any*/),
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
                      (v5/*:: as any*/)
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
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v7/*:: as any*/),
        "concreteType": "RootQueryToListoryListSearchConnection",
        "kind": "LinkedField",
        "name": "listoryListSearch",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ListoryList",
            "kind": "LinkedField",
            "name": "nodes",
            "plural": true,
            "selections": [
              (v5/*:: as any*/),
              (v6/*:: as any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ListoryListToListoryListItemConnection",
                "kind": "LinkedField",
                "name": "items",
                "plural": false,
                "selections": [
                  (v4/*:: as any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "listoryListSearch(first:100)"
      }
    ]
  },
  "params": {
    "cacheID": "b54d4c02fda753e3e9aa13b7211cdefd",
    "id": "b54d4c02fda753e3e9aa13b7211cdefd",
    "metadata": {},
    "name": "ChecklistPageQuery",
    "operationKind": "query",
    "text": "query ChecklistPageQuery(\n  $term: String = \"\"\n  $completed: Boolean\n) {\n  ...ChecklistList_query_2c7s9g\n  ...ChecklistForm_query\n}\n\nfragment ChecklistForm_query on RootQuery {\n  listoryListSearch(first: 100) {\n    nodes {\n      id\n      title\n      items {\n        totalCount\n      }\n    }\n  }\n}\n\nfragment ChecklistList_query_2c7s9g on RootQuery {\n  listoryChecklistSearch(first: 100, where: {term: $term, completed: $completed}) {\n    totalCount\n    nodes {\n      id\n      title\n      completedAt\n      items(first: 100) {\n        totalCount\n        nodes {\n          checked\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f61361bb7188381382851152c4f181d5";

export default node;
