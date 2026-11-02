/**
 * @generated SignedSource<<4cf52d3f2b84d568eaae428ea6e3bc1d>>
 * @relayHash 1d80b84e1376267861d657b5ed71596b
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 1d80b84e1376267861d657b5ed71596b

import { ConcreteRequest } from 'relay-runtime';
export type UpdateListoryChecklistInput = {
  clientMutationId?: string | null | undefined;
  completedAt?: string | null | undefined;
  id: string;
  sourceLists?: ReadonlyArray<string | null | undefined> | null | undefined;
  title?: string | null | undefined;
};
export type useChecklistDetailsSourceListsMutation$variables = {
  input: UpdateListoryChecklistInput;
};
export type useChecklistDetailsSourceListsMutation$data = {
  readonly updateListoryChecklist: {
    readonly listoryChecklist: {
      readonly completedAt: string | null | undefined;
      readonly id: string;
      readonly items: {
        readonly nodes: ReadonlyArray<{
          readonly checked: boolean;
          readonly id: string;
          readonly name: string;
          readonly sourceList: {
            readonly title: string;
          } | null | undefined;
        } | null | undefined> | null | undefined;
      } | null | undefined;
      readonly sourceLists: {
        readonly nodes: ReadonlyArray<{
          readonly id: string;
          readonly title: string;
        } | null | undefined> | null | undefined;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type useChecklistDetailsSourceListsMutation = {
  response: useChecklistDetailsSourceListsMutation$data;
  variables: useChecklistDetailsSourceListsMutation$variables;
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
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
  "name": "completedAt",
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "checked",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v8 = {
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
      "selections": [
        (v2/*:: as any*/),
        (v7/*:: as any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useChecklistDetailsSourceListsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "UpdateListoryChecklistPayload",
        "kind": "LinkedField",
        "name": "updateListoryChecklist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ListoryChecklist",
            "kind": "LinkedField",
            "name": "listoryChecklist",
            "plural": false,
            "selections": [
              (v2/*:: as any*/),
              (v3/*:: as any*/),
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
                      (v5/*:: as any*/),
                      (v6/*:: as any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ListoryList",
                        "kind": "LinkedField",
                        "name": "sourceList",
                        "plural": false,
                        "selections": [
                          (v7/*:: as any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "items(first:100)"
              },
              (v8/*:: as any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootMutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "useChecklistDetailsSourceListsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "UpdateListoryChecklistPayload",
        "kind": "LinkedField",
        "name": "updateListoryChecklist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ListoryChecklist",
            "kind": "LinkedField",
            "name": "listoryChecklist",
            "plural": false,
            "selections": [
              (v2/*:: as any*/),
              (v3/*:: as any*/),
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
                      (v5/*:: as any*/),
                      (v6/*:: as any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ListoryList",
                        "kind": "LinkedField",
                        "name": "sourceList",
                        "plural": false,
                        "selections": [
                          (v7/*:: as any*/),
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
              (v8/*:: as any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1d80b84e1376267861d657b5ed71596b",
    "id": "1d80b84e1376267861d657b5ed71596b",
    "metadata": {},
    "name": "useChecklistDetailsSourceListsMutation",
    "operationKind": "mutation",
    "text": "mutation useChecklistDetailsSourceListsMutation(\n  $input: UpdateListoryChecklistInput!\n) {\n  updateListoryChecklist(input: $input) {\n    listoryChecklist {\n      id\n      completedAt\n      items(first: 100) {\n        nodes {\n          id\n          name\n          checked\n          sourceList {\n            title\n            id\n          }\n        }\n      }\n      sourceLists {\n        nodes {\n          id\n          title\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b77c28bb3e89bb8874dc5d2b6ba0556b";

export default node;
