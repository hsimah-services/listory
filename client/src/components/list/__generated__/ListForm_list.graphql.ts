/**
 * @generated SignedSource<<57385d2c3a74412b041599e14422348b>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ListForm_list$data = {
  readonly id: string;
  readonly title: string;
  readonly " $fragmentType": "ListForm_list";
};
export type ListForm_list$key = {
  readonly " $data"?: ListForm_list$data;
  readonly " $fragmentSpreads": FragmentRefs<"ListForm_list">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ListForm_list",
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
  "type": "ListoryList",
  "abstractKey": null
};

(node as any).hash = "50ee06bdc6818a9cb51b385968865b22";

export default node;
