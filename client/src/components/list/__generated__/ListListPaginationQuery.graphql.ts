/**
 * @generated SignedSource<<a1dd458c4326dc95f900fe4c0bcbabb0>>
 * @relayHash 02015e20d830640fb94f1f2de13d05c5
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 02015e20d830640fb94f1f2de13d05c5

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ListListPaginationQuery$variables = {
  count?: number | null | undefined;
  cursor?: string | null | undefined;
  term?: string | null | undefined;
};
export type ListListPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"ListList_query">;
};
export type ListListPaginationQuery = {
  response: ListListPaginationQuery$data;
  variables: ListListPaginationQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": 25,
    "kind": "LocalArgument",
    "name": "count"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cursor"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "term"
  }
],
v1 = {
  "kind": "Variable",
  "name": "term",
  "variableName": "term"
},
v2 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  {
    "fields": [
      (v1/*:: as any*/)
    ],
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
    "name": "ListListPaginationQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          },
          (v1/*:: as any*/)
        ],
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
    "name": "ListListPaginationQuery",
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
    "cacheID": "02015e20d830640fb94f1f2de13d05c5",
    "id": "02015e20d830640fb94f1f2de13d05c5",
    "metadata": {},
    "name": "ListListPaginationQuery",
    "operationKind": "query",
    "text": "query ListListPaginationQuery(\n  $count: Int = 25\n  $cursor: String\n  $term: String\n) {\n  ...ListList_query_4j0hnM\n}\n\nfragment ListList_query_4j0hnM on RootQuery {\n  listoryListSearch(first: $count, after: $cursor, where: {term: $term}) {\n    totalCount\n    edges {\n      node {\n        id\n        title\n        items {\n          totalCount\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6c10b1c1313153283364b393fca79723";

export default node;
