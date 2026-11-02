/**
 * @generated SignedSource<<1b91bf202d85e439fd68f3a16fdfbdae>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ChecklistList_query$data = {
  readonly listoryChecklistSearch: {
    readonly nodes: ReadonlyArray<{
      readonly completedAt: string | null | undefined;
      readonly id: string;
      readonly items: {
        readonly nodes: ReadonlyArray<{
          readonly checked: boolean;
        } | null | undefined> | null | undefined;
        readonly totalCount: number | null | undefined;
      } | null | undefined;
      readonly title: string;
    } | null | undefined> | null | undefined;
    readonly totalCount: number | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "ChecklistList_query";
};
export type ChecklistList_query$key = {
  readonly " $data"?: ChecklistList_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"ChecklistList_query">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
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
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "completed"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "term"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "ChecklistList_query",
  "selections": [
    {
      "alias": null,
      "args": [
        (v0/*:: as any*/),
        {
          "fields": [
            {
              "kind": "Variable",
              "name": "completed",
              "variableName": "completed"
            },
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
      "concreteType": "RootQueryToListoryChecklistSearchConnection",
      "kind": "LinkedField",
      "name": "listoryChecklistSearch",
      "plural": false,
      "selections": [
        (v1/*:: as any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "ListoryChecklist",
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
              "kind": "ScalarField",
              "name": "completedAt",
              "storageKey": null
            },
            {
              "alias": null,
              "args": [
                (v0/*:: as any*/)
              ],
              "concreteType": "ListoryChecklistToListoryChecklistItemConnection",
              "kind": "LinkedField",
              "name": "items",
              "plural": false,
              "selections": [
                (v1/*:: as any*/),
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

(node as any).hash = "c4a6658ba925fac1915cf6c7b5a86d90";

export default node;
