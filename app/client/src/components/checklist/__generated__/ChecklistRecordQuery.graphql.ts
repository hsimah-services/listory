/**
 * @generated SignedSource<<09912d30b3aa3cf04c572ad97c1303f8>>
 * @relayHash 0e44acdf9a7a4f51fe55baf811601f7f
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 0e44acdf9a7a4f51fe55baf811601f7f

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ChecklistRecordQuery$variables = {
  id: string;
};
export type ChecklistRecordQuery$data = {
  readonly listoryChecklist: {
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"ChecklistDetails_checklist">;
  } | null | undefined;
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
  (v3/*:: as any*/),
  (v2/*:: as any*/)
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
                    "selections": (v4/*:: as any*/),
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
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ListoryList",
                "kind": "LinkedField",
                "name": "nodes",
                "plural": true,
                "selections": (v4/*:: as any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "0e44acdf9a7a4f51fe55baf811601f7f",
    "id": "0e44acdf9a7a4f51fe55baf811601f7f",
    "metadata": {},
    "name": "ChecklistRecordQuery",
    "operationKind": "query",
    "text": "query ChecklistRecordQuery(\n  $id: ID!\n) {\n  listoryChecklist(id: $id) {\n    id\n    ...ChecklistDetails_checklist\n  }\n}\n\nfragment ChecklistDetails_checklist on ListoryChecklist {\n  id\n  title\n  completedAt\n  items(first: 100) {\n    nodes {\n      id\n      name\n      checked\n      sourceList {\n        title\n        id\n      }\n    }\n  }\n  sourceLists {\n    nodes {\n      title\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "942fbf3af4e551f69eb4b0d2f94e4c48";

export default node;
