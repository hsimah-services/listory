/**
 * @generated SignedSource<<7ee6be63da96c71a4bbed684c7e35d1d>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ChecklistDetails_checklist$data = {
  readonly completedAt: string | null | undefined;
  readonly id: string;
  readonly items: {
    readonly nodes: ReadonlyArray<{
      readonly checked: boolean;
      readonly id: string;
      readonly name: string;
      readonly sourceList: {
        readonly title: string;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly sourceLists: {
    readonly nodes: ReadonlyArray<{
      readonly id: string;
      readonly title: string;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly title: string;
  readonly " $fragmentType": "ChecklistDetails_checklist";
};
export type ChecklistDetails_checklist$key = {
  readonly " $data"?: ChecklistDetails_checklist$data;
  readonly " $fragmentSpreads": FragmentRefs<"ChecklistDetails_checklist">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ChecklistDetails_checklist",
  "selections": [
    (v0/*:: as any*/),
    (v1/*:: as any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "completedAt",
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
          "concreteType": "ListoryChecklistItem",
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
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "checked",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "ListoryList",
              "kind": "LinkedField",
              "name": "sourceList",
              "plural": false,
              "selections": [
                (v1/*:: as any*/)
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "items(first:100)"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ListoryChecklistToListoryListConnection",
      "kind": "LinkedField",
      "name": "sourceLists",
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
            (v0/*:: as any*/),
            (v1/*:: as any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ListoryChecklist",
  "abstractKey": null
};
})();

(node as any).hash = "1f394f1873cbea892d70772728d61115";

export default node;
