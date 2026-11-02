/**
 * @generated SignedSource<<ab3a7342eb202e2db25ce48e8cf05a51>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ChecklistDetails_lists$data = {
  readonly listoryListSearch: {
    readonly nodes: ReadonlyArray<{
      readonly id: string;
      readonly title: string;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "ChecklistDetails_lists";
};
export type ChecklistDetails_lists$key = {
  readonly " $data"?: ChecklistDetails_lists$data;
  readonly " $fragmentSpreads": FragmentRefs<"ChecklistDetails_lists">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ChecklistDetails_lists",
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

(node as any).hash = "d508f5bf5f231ec4476f7c3b61820d46";

export default node;
