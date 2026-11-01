/**
 * @generated SignedSource<<731d8035af882c7e9f3e906009217e24>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ListList_query$data = {
  readonly listoryListSearch: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly items: {
          readonly totalCount: number | null | undefined;
        } | null | undefined;
        readonly title: string;
      } | null | undefined;
    } | null | undefined> | null | undefined;
    readonly totalCount: number | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "ListList_query";
};
export type ListList_query$key = {
  readonly " $data"?: ListList_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"ListList_query">;
};

import ListListPaginationQuery_graphql from './ListListPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "listoryListSearch"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
};
return {
  "argumentDefinitions": [
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
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*:: as any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "count",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*:: as any*/)
      },
      "fragmentPathInResult": [],
      "operation": ListListPaginationQuery_graphql
    }
  },
  "name": "ListList_query",
  "selections": [
    {
      "alias": "listoryListSearch",
      "args": [
        {
          "fields": [
            {
              "kind": "Variable",
              "name": "term",
              "variableName": "term"
            }
          ],
          "kind": "ObjectValue",
          "name": "where"
        }
      ],
      "concreteType": "RootQueryToListoryListSearchConnection",
      "kind": "LinkedField",
      "name": "__ListList_listoryListSearch_connection",
      "plural": false,
      "selections": [
        (v1/*:: as any*/),
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
                    (v1/*:: as any*/)
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
    }
  ],
  "type": "RootQuery",
  "abstractKey": null
};
})();

(node as any).hash = "6c10b1c1313153283364b393fca79723";

export default node;
