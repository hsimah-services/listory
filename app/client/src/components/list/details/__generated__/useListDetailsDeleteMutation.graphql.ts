/**
 * @generated SignedSource<<9c9d0e57d1bbff34c8e9271fc1280981>>
 * @relayHash 05cc39aac011da29d3cb0dddcbac0282
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 05cc39aac011da29d3cb0dddcbac0282

import { ConcreteRequest } from 'relay-runtime';
export type DeleteListoryListInput = {
  clientMutationId?: string | null | undefined;
  id: string;
};
export type useListDetailsDeleteMutation$variables = {
  input: DeleteListoryListInput;
};
export type useListDetailsDeleteMutation$data = {
  readonly deleteListoryList: {
    readonly deletedId: string | null | undefined;
  } | null | undefined;
};
export type useListDetailsDeleteMutation = {
  response: useListDetailsDeleteMutation$data;
  variables: useListDetailsDeleteMutation$variables;
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
  "name": "deletedId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useListDetailsDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "DeleteListoryListPayload",
        "kind": "LinkedField",
        "name": "deleteListoryList",
        "plural": false,
        "selections": [
          (v2/*:: as any*/)
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
    "name": "useListDetailsDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "DeleteListoryListPayload",
        "kind": "LinkedField",
        "name": "deleteListoryList",
        "plural": false,
        "selections": [
          (v2/*:: as any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteRecord",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedId"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "05cc39aac011da29d3cb0dddcbac0282",
    "id": "05cc39aac011da29d3cb0dddcbac0282",
    "metadata": {},
    "name": "useListDetailsDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation useListDetailsDeleteMutation(\n  $input: DeleteListoryListInput!\n) {\n  deleteListoryList(input: $input) {\n    deletedId\n  }\n}\n"
  }
};
})();

(node as any).hash = "07220fd16e60864696c281848356022f";

export default node;
