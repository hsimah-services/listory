/**
 * @generated SignedSource<<18eb85941c893ade0836c4dce0f0f2ae>>
 * @relayHash a18d782a4da38821714d87a359e24fa0
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID a18d782a4da38821714d87a359e24fa0

import { ConcreteRequest } from 'relay-runtime';
export type DeleteListoryChecklistInput = {
  clientMutationId?: string | null | undefined;
  id: string;
};
export type useChecklistDetailsDeleteMutation$variables = {
  input: DeleteListoryChecklistInput;
};
export type useChecklistDetailsDeleteMutation$data = {
  readonly deleteListoryChecklist: {
    readonly deletedId: string | null | undefined;
  } | null | undefined;
};
export type useChecklistDetailsDeleteMutation = {
  response: useChecklistDetailsDeleteMutation$data;
  variables: useChecklistDetailsDeleteMutation$variables;
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
    "name": "useChecklistDetailsDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "DeleteListoryChecklistPayload",
        "kind": "LinkedField",
        "name": "deleteListoryChecklist",
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
    "name": "useChecklistDetailsDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*:: as any*/),
        "concreteType": "DeleteListoryChecklistPayload",
        "kind": "LinkedField",
        "name": "deleteListoryChecklist",
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
    "cacheID": "a18d782a4da38821714d87a359e24fa0",
    "id": "a18d782a4da38821714d87a359e24fa0",
    "metadata": {},
    "name": "useChecklistDetailsDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation useChecklistDetailsDeleteMutation(\n  $input: DeleteListoryChecklistInput!\n) {\n  deleteListoryChecklist(input: $input) {\n    deletedId\n  }\n}\n"
  }
};
})();

(node as any).hash = "da4f7ee731414618d89a980d0f04e19c";

export default node;
