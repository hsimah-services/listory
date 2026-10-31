/**
 * @generated SignedSource<<364400cbaf6e6c52a9f65483fdb8f476>>
 * @relayHash 16d39c6c5035435c9980c4131011b209
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 16d39c6c5035435c9980c4131011b209

import { ConcreteRequest } from 'relay-runtime';
export type HomePageQuery$variables = Record<PropertyKey, never>;
export type HomePageQuery$data = {
  readonly listoryLists: {
    readonly totalCount: number | null | undefined;
  } | null | undefined;
};
export type HomePageQuery = {
  response: HomePageQuery$data;
  variables: HomePageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "first",
        "value": 1
      }
    ],
    "concreteType": "RootQueryToListoryListConnection",
    "kind": "LinkedField",
    "name": "listoryLists",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalCount",
        "storageKey": null
      }
    ],
    "storageKey": "listoryLists(first:1)"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "HomePageQuery",
    "selections": (v0/*:: as any*/),
    "type": "RootQuery",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "HomePageQuery",
    "selections": (v0/*:: as any*/)
  },
  "params": {
    "cacheID": "16d39c6c5035435c9980c4131011b209",
    "id": "16d39c6c5035435c9980c4131011b209",
    "metadata": {},
    "name": "HomePageQuery",
    "operationKind": "query",
    "text": "query HomePageQuery {\n  listoryLists(first: 1) {\n    totalCount\n  }\n}\n"
  }
};
})();

(node as any).hash = "fd24a62d07103521a23977602caaafb9";

export default node;
