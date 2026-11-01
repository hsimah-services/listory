/**
 * @generated SignedSource<<abfa3c0e3823cf8bb6a6d947df2875ef>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ListDetails_list$data = {
  readonly createdAt: string;
  readonly id: string;
  readonly items: {
    readonly nodes: ReadonlyArray<{
      readonly id: string;
      readonly name: string;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly title: string;
  readonly " $fragmentType": "ListDetails_list";
};
export type ListDetails_list$key = {
  readonly " $data"?: ListDetails_list$data;
  readonly " $fragmentSpreads": FragmentRefs<"ListDetails_list">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ListDetails_list",
  "selections": [
    (v0/*:: as any*/),
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
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        }
      ],
      "concreteType": "ListoryListToListoryListItemConnection",
      "kind": "LinkedField",
      "name": "items",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ListoryListItem",
          "kind": "LinkedField",
          "name": "nodes",
          "plural": true,
          "selections": [
            (v0/*:: as any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "name",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "items(first:100)"
    }
  ],
  "type": "ListoryList",
  "abstractKey": null
};
})();

(node as any).hash = "fe26730ecbccbea3e98766c19aa6d26c";

export default node;
