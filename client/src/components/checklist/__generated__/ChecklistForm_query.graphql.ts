/**
 * @generated SignedSource<<ea0b837a4a1b7077a12eee8b71b1e0cf>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ChecklistForm_query$data = {
  readonly listoryListSearch: {
    readonly nodes: ReadonlyArray<{
      readonly id: string;
      readonly items: {
        readonly totalCount: number | null | undefined;
      } | null | undefined;
      readonly title: string;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "ChecklistForm_query";
};
export type ChecklistForm_query$key = {
  readonly " $data"?: ChecklistForm_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"ChecklistForm_query">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ChecklistForm_query",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        }
      ],
      "concreteType": "RootQueryToListoryListSearchConnection",
      "kind": "LinkedField",
      "name": "listoryListSearch",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ListoryList",
          "kind": "LinkedField",
          "name": "nodes",
          "plural": true,
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "totalCount",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "listoryListSearch(first:100)"
    }
  ],
  "type": "RootQuery",
  "abstractKey": null
};

(node as any).hash = "713b4bf06a709564ad1af9937ab80d18";

export default node;
