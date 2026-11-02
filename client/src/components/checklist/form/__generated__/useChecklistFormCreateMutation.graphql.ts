/**
 * @generated SignedSource<<82e71647190193f7202a82d178a84383>>
 * @relayHash 9642716ad9e8684f7721dc1b89a91e66
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 9642716ad9e8684f7721dc1b89a91e66

import { ConcreteRequest } from 'relay-runtime';
export type useChecklistFormCreateMutation$variables = {
  sourceLists?: ReadonlyArray<string | null | undefined> | null | undefined;
  title: string;
};
export type useChecklistFormCreateMutation$data = {
  readonly createListoryChecklist: {
    readonly listoryChecklist: {
      readonly id: string;
      readonly title: string;
    } | null | undefined;
  } | null | undefined;
};
export type useChecklistFormCreateMutation = {
  response: useChecklistFormCreateMutation$data;
  variables: useChecklistFormCreateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sourceLists"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "title"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "sourceLists",
            "variableName": "sourceLists"
          },
          {
            "kind": "Variable",
            "name": "title",
            "variableName": "title"
          }
        ],
        "kind": "ObjectValue",
        "name": "input"
      }
    ],
    "concreteType": "CreateListoryChecklistPayload",
    "kind": "LinkedField",
    "name": "createListoryChecklist",
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*:: as any*/),
      (v1/*:: as any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "useChecklistFormCreateMutation",
    "selections": (v2/*:: as any*/),
    "type": "RootMutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*:: as any*/),
      (v0/*:: as any*/)
    ],
    "kind": "Operation",
    "name": "useChecklistFormCreateMutation",
    "selections": (v2/*:: as any*/)
  },
  "params": {
    "cacheID": "9642716ad9e8684f7721dc1b89a91e66",
    "id": "9642716ad9e8684f7721dc1b89a91e66",
    "metadata": {},
    "name": "useChecklistFormCreateMutation",
    "operationKind": "mutation",
    "text": "mutation useChecklistFormCreateMutation(\n  $title: String!\n  $sourceLists: [ID]\n) {\n  createListoryChecklist(input: {title: $title, sourceLists: $sourceLists}) {\n    listoryChecklist {\n      id\n      title\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "ee0f0e419894a1b51c9d1e938739e452";

export default node;
