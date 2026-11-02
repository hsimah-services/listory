/**
 * @generated SignedSource<<44c0509954e7746666ee46ab8886ab9e>>
 * @relayHash 19dd8491e9ae7156371c0391ead8820f
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 19dd8491e9ae7156371c0391ead8820f

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ChecklistRecordQuery$variables = {
  id: string;
};
export type ChecklistRecordQuery$data = {
  readonly listoryChecklist: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"ChecklistDetails_checklist" | "ChecklistForm_checklist">;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"ChecklistDetails_lists">;
};
export type ChecklistRecordQuery = {
  response: ChecklistRecordQuery$data;
  variables: ChecklistRecordQuery$variables;
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v5 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ListoryList",
    "kind": "LinkedField",
    "name": "nodes",
    "plural": true,
    "selections": [
      (v2/*:: as any*/),
      (v3/*:: as any*/)
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ChecklistRecordQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "ListoryChecklist",
        "kind": "LinkedField",
        "name": "listoryChecklist",
        "plural": false,
        "selections": [
          (v2/*:: as any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ChecklistDetails_checklist"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ChecklistForm_checklist"
          }
        ],
        "storageKey": null
      },
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "ChecklistDetails_lists"
      }
    ],
    "type": "RootQuery",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "ChecklistRecordQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "ListoryChecklist",
        "kind": "LinkedField",
        "name": "listoryChecklist",
        "plural": false,
        "selections": [
          (v2/*:: as any*/),
          (v3/*:: as any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "completedAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v4/*:: as any*/),
            "concreteType": "ListoryChecklistToListoryChecklistItemConnection",
            "kind": "LinkedField",
            "name": "items",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ListoryChecklistItem",
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
                  },
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
                    "concreteType": "ListoryList",
                    "kind": "LinkedField",
                    "name": "sourceList",
                    "plural": false,
                    "selections": [
                      (v3/*:: as any*/),
                      (v2/*:: as any*/)
                    ],
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
            "args": null,
            "concreteType": "ListoryChecklistToListoryListConnection",
            "kind": "LinkedField",
            "name": "sourceLists",
            "plural": false,
            "selections": (v5/*:: as any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v4/*:: as any*/),
        "concreteType": "RootQueryToListoryListSearchConnection",
        "kind": "LinkedField",
        "name": "listoryListSearch",
        "plural": false,
        "selections": (v5/*:: as any*/),
        "storageKey": "listoryListSearch(first:100)"
      }
    ]
  },
  "params": {
    "cacheID": "19dd8491e9ae7156371c0391ead8820f",
    "id": "19dd8491e9ae7156371c0391ead8820f",
    "metadata": {},
    "name": "ChecklistRecordQuery",
    "operationKind": "query",
    "text": "query ChecklistRecordQuery(\n  $id: ID!\n) {\n  listoryChecklist(id: $id) {\n    id\n    ...ChecklistDetails_checklist\n    ...ChecklistForm_checklist\n  }\n  ...ChecklistDetails_lists\n}\n\nfragment ChecklistDetails_checklist on ListoryChecklist {\n  id\n  title\n  completedAt\n  items(first: 100) {\n    nodes {\n      id\n      name\n      checked\n      sourceList {\n        title\n        id\n      }\n    }\n  }\n  sourceLists {\n    nodes {\n      id\n      title\n    }\n  }\n}\n\nfragment ChecklistDetails_lists on RootQuery {\n  listoryListSearch(first: 100) {\n    nodes {\n      id\n      title\n    }\n  }\n}\n\nfragment ChecklistForm_checklist on ListoryChecklist {\n  id\n  title\n}\n"
  }
};
})();

(node as any).hash = "e0fe357c7380b650f4442c3b69380d81";

export default node;
