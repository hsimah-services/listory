/**
 * @generated SignedSource<<bdc1a5852ae4666f54c3a2a518c040f8>>
 * @relayHash 20016724b03ebfd4e622133f9f66b6ee
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 20016724b03ebfd4e622133f9f66b6ee

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ListPageQuery$variables = {
  term?: string | null | undefined;
};
export type ListPageQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ListList_query">;
};
export type ListPageQuery = {
  response: ListPageQuery$data;
  variables: ListPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": "",
    "kind": "LocalArgument",
    "name": "term"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "term",
    "variableName": "term"
  }
],
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 25
  },
  {
    "fields": (v1/*:: as any*/),
    "kind": "ObjectValue",
    "name": "where"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ListPageQuery",
    "selections": [
      {
        "args": (v1/*:: as any*/),
        "kind": "FragmentSpread",
        "name": "ListList_query"
      }
    ],
    "type": "RootQuery",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "ListPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*:: as any*/),
        "concreteType": "RootQueryToListoryListSearchConnection",
        "kind": "LinkedField",
        "name": "listoryListSearch",
        "plural": false,
        "selections": [
          (v3/*:: as any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "RootQueryToListoryListSearchConnectionEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ListoryList",
                "kind": "LinkedField",
                "name": "node",
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
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ListoryListToListoryListItemConnection",
                    "kind": "LinkedField",
                    "name": "items",
                    "plural": false,
                    "selections": [
                      (v3/*:: as any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v2/*:: as any*/),
        "filters": [
          "where"
        ],
        "handle": "connection",
        "key": "ListList_listoryListSearch",
        "kind": "LinkedHandle",
        "name": "listoryListSearch"
      }
    ]
  },
  "params": {
    "cacheID": "20016724b03ebfd4e622133f9f66b6ee",
    "id": "20016724b03ebfd4e622133f9f66b6ee",
    "metadata": {},
    "name": "ListPageQuery",
    "operationKind": "query",
    "text": "query ListPageQuery(\n  $term: String = \"\"\n) {\n  ...ListList_query_4hh6ED\n}\n\nfragment ListList_query_4hh6ED on RootQuery {\n  listoryListSearch(first: 25, where: {term: $term}) {\n    totalCount\n    edges {\n      node {\n        id\n        title\n        items {\n          totalCount\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d5874425760cef920f59902a676faca3";

export default node;
