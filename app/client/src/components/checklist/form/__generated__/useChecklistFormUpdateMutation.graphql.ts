/**
 * @generated SignedSource<<d6d07064ca87f6467c630d1d63925179>>
 * @relayHash 79cc262f7ba9d7fdf81fc9cded19d2ae
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 79cc262f7ba9d7fdf81fc9cded19d2ae

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UpdateListoryChecklistInput = {
  clientMutationId?: string | null | undefined;
  completedAt?: string | null | undefined;
  id: string;
  sourceLists?: ReadonlyArray<string | null | undefined> | null | undefined;
  title?: string | null | undefined;
};
export type useChecklistFormUpdateMutation$variables = {
  input: UpdateListoryChecklistInput;
};
export type useChecklistFormUpdateMutation$data = {
  readonly updateListoryChecklist: {
    readonly listoryChecklist: {
      readonly id: string;
      readonly title: string;
      readonly " $fragmentSpreads": FragmentRefs<"ChecklistForm_checklist">;
    } | null | undefined;
  } | null | undefined;
};
export type useChecklistFormUpdateMutation = {
  response: useChecklistFormUpdateMutation$data;
  variables: useChecklistFormUpdateMutation$variables;
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
    "name": "useChecklistFormUpdateMutation",
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
                "args": null,
                "kind": "FragmentSpread",
                "name": "ChecklistForm_checklist"
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
    "name": "useChecklistFormUpdateMutation",
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
    "cacheID": "79cc262f7ba9d7fdf81fc9cded19d2ae",
    "id": "79cc262f7ba9d7fdf81fc9cded19d2ae",
    "metadata": {},
    "name": "useChecklistFormUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation useChecklistFormUpdateMutation(\n  $input: UpdateListoryChecklistInput!\n) {\n  updateListoryChecklist(input: $input) {\n    listoryChecklist {\n      id\n      title\n      ...ChecklistForm_checklist\n    }\n  }\n}\n\nfragment ChecklistForm_checklist on ListoryChecklist {\n  id\n  title\n}\n"
  }
};
})();

(node as any).hash = "59bc29229bc0a1b46bdf3a53f7df4b8a";

export default node;
