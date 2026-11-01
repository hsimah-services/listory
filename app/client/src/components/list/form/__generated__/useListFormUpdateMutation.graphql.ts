/**
 * @generated SignedSource<<04c1b80819e63007d270334465ebbc09>>
 * @relayHash f7fa0dbc7cf5cc763dffe0bf644b856d
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID f7fa0dbc7cf5cc763dffe0bf644b856d

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UpdateListoryListInput = {
  clientMutationId?: string | null | undefined;
  id: string;
  title?: string | null | undefined;
};
export type useListFormUpdateMutation$variables = {
  input: UpdateListoryListInput;
};
export type useListFormUpdateMutation$data = {
  readonly updateListoryList: {
    readonly listoryList: {
      readonly id: string;
      readonly title: string;
      readonly " $fragmentSpreads": FragmentRefs<"ListForm_list">;
    } | null | undefined;
  } | null | undefined;
};
export type useListFormUpdateMutation = {
  response: useListFormUpdateMutation$data;
  variables: useListFormUpdateMutation$variables;
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
    "name": "useListFormUpdateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "UpdateListoryListPayload",
        "kind": "LinkedField",
        "name": "updateListoryList",
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
    "name": "useListFormUpdateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "UpdateListoryListPayload",
        "kind": "LinkedField",
        "name": "updateListoryList",
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
    "cacheID": "f7fa0dbc7cf5cc763dffe0bf644b856d",
    "id": "f7fa0dbc7cf5cc763dffe0bf644b856d",
    "metadata": {},
    "name": "useListFormUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation useListFormUpdateMutation(\n  $input: UpdateListoryListInput!\n) {\n  updateListoryList(input: $input) {\n    listoryList {\n      id\n      title\n      ...ListForm_list\n    }\n  }\n}\n\nfragment ListForm_list on ListoryList {\n  id\n  title\n}\n"
  }
};
})();

(node as any).hash = "cf02a181a88f8edd3307b9d9c95c9fea";

export default node;
