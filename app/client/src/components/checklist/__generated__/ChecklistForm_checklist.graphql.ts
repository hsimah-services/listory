/**
 * @generated SignedSource<<d6cabf40e2d6ab3f23501eb1e4b1bb58>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ChecklistForm_checklist$data = {
  readonly id: string;
  readonly title: string;
  readonly " $fragmentType": "ChecklistForm_checklist";
};
export type ChecklistForm_checklist$key = {
  readonly " $data"?: ChecklistForm_checklist$data;
  readonly " $fragmentSpreads": FragmentRefs<"ChecklistForm_checklist">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ChecklistForm_checklist",
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
  "type": "ListoryChecklist",
  "abstractKey": null
};

(node as any).hash = "64c02c2b51961938d26171032557337a";

export default node;
