/**
 * @generated SignedSource<<6d78cca0811e4ea4c19b8ca0673b3f3a>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HomePage_checklist$data = {
  readonly id: string;
  readonly items: {
    readonly nodes: ReadonlyArray<{
      readonly checked: boolean;
    } | null | undefined> | null | undefined;
    readonly totalCount: number | null | undefined;
  } | null | undefined;
  readonly title: string;
  readonly " $fragmentType": "HomePage_checklist";
};
export type HomePage_checklist$key = {
  readonly " $data"?: HomePage_checklist$data;
  readonly " $fragmentSpreads": FragmentRefs<"HomePage_checklist">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "HomePage_checklist",
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
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        }
      ],
      "concreteType": "ListoryChecklistToListoryChecklistItemConnection",
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
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "ListoryChecklistItem",
          "kind": "LinkedField",
          "name": "nodes",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "checked",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "items(first:100)"
    }
  ],
  "type": "ListoryChecklist",
  "abstractKey": null
};

(node as any).hash = "b569f2050f48534785291cae0ace534a";

export default node;
