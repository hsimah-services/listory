/**
 * @generated SignedSource<<2afafe544d6da0ab4e3f3ff15d024f63>>
 * @relayHash afbc52d940426475c71c010076fd1e2f
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID afbc52d940426475c71c010076fd1e2f

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CreateListoryListInput = {
  clientMutationId?: string | null | undefined;
  title: string;
};
export type useListFormCreateMutation$variables = {
  input: CreateListoryListInput;
};
export type useListFormCreateMutation$data = {
  readonly createListoryList: {
    readonly listoryList: {
      readonly id: string;
      readonly title: string;
      readonly " $fragmentSpreads": FragmentRefs<"ListForm_list">;
    } | null | undefined;
  } | null | undefined;
};
export type useListFormCreateMutation = {
  response: useListFormCreateMutation$data;
  variables: useListFormCreateMutation$variables;
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
  "name": "title",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useListFormCreateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "CreateListoryListPayload",
        "kind": "LinkedField",
        "name": "createListoryList",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ListoryList",
            "kind": "LinkedField",
            "name": "listoryList",
            "plural": false,
            "selections": [
              (v2/*:: as any*/),
              (v3/*:: as any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ListForm_list"
              }
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
    "name": "useListFormCreateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "CreateListoryListPayload",
        "kind": "LinkedField",
        "name": "createListoryList",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ListoryList",
            "kind": "LinkedField",
            "name": "listoryList",
            "plural": false,
            "selections": [
              (v2/*:: as any*/),
              (v3/*:: as any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "afbc52d940426475c71c010076fd1e2f",
    "id": "afbc52d940426475c71c010076fd1e2f",
    "metadata": {},
    "name": "useListFormCreateMutation",
    "operationKind": "mutation",
    "text": "mutation useListFormCreateMutation(\n  $input: CreateListoryListInput!\n) {\n  createListoryList(input: $input) {\n    listoryList {\n      id\n      title\n      ...ListForm_list\n    }\n  }\n}\n\nfragment ListForm_list on ListoryList {\n  id\n  title\n}\n"
  }
};
})();

(node as any).hash = "cb6e2cbb1bbbb584a0e1bfdd4ce286da";

export default node;
