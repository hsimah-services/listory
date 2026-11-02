import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { graphql, useFragment } from "react-relay";
import { Button } from "@astryxdesign/core/Button";
import { CheckboxList, CheckboxListItem } from "@astryxdesign/core/CheckboxList";
import { Link } from "@astryxdesign/core/Link";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { useCanWrite } from "../../relay/useCanWrite";
import {
  ChecklistDetailURI,
  ChecklistIndexURI,
} from "../../routes/__generated__/routes";
import { useChecklistFormCreateMutation } from "./form/useChecklistFormCreateMutation";
import { useChecklistFormUpdateMutation } from "./form/useChecklistFormUpdateMutation";
import type { ChecklistForm_checklist$key } from "./__generated__/ChecklistForm_checklist.graphql";
import type { ChecklistForm_query$key } from "./__generated__/ChecklistForm_query.graphql";

const TITLE_MAX_LENGTH = 200;

export type ChecklistFormProps = {
  /** Create mode: supplies the permanent lists to merge. */
  queryRef?: ChecklistForm_query$key;
  /** Edit mode: renames the checklist. Shows the title only. */
  checklistRef?: ChecklistForm_checklist$key;
};

export function ChecklistForm({ queryRef, checklistRef }: ChecklistFormProps) {
  const state = useChecklistForm({ queryRef, checklistRef });
  return (
    <Stack gap={4}>
      {state.editing && (
        <Text as="h2" type="display-3">
          Edit checklist
        </Text>
      )}
      <form onSubmit={state.submit}>
        <Stack gap={4}>
          {state.error && <Text role="alert">{state.error}</Text>}
          <TextInput
            hasAutoFocus
            label="Title"
            value={state.title}
            onChange={state.setTitle}
            placeholder="e.g. Park BBQ - March 15"
            isRequired
            isDisabled={!state.canWrite || state.pending}
            status={
              state.tooLong
                ? {
                    type: "error",
                    message: `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`,
                  }
                : undefined
            }
          />
          {!state.editing &&
            (state.hasLists ? (
              <CheckboxList
                label="Permanent lists"
                description="Items from every ticked list are copied into the checklist."
                value={state.selected}
                onChange={state.setSelected}
                isDisabled={!state.canWrite || state.pending}
              >
                {state.lists.map((list) => (
                  <CheckboxListItem
                    key={list.id}
                    label={list.title}
                    description={`${list.itemCount} ${list.itemCount === 1 ? "item" : "items"}`}
                    value={list.id}
                  />
                ))}
              </CheckboxList>
            ) : (
              <Text>
                Create a permanent list first. <Link href="/lists/new">New list</Link>
              </Text>
            ))}
          <Stack direction="horizontal" gap={2}>
            <Button
              type="submit"
              label={state.editing ? "Update" : "Create"}
              isLoading={state.pending}
              isDisabled={state.saveDisabled}
            />
            <Button
              type="button"
              label="Cancel"
              variant="ghost"
              isDisabled={state.pending}
              onClick={state.onCancel}
            />
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
}

function useChecklistForm({
  queryRef,
  checklistRef,
}: {
  queryRef?: ChecklistForm_query$key;
  checklistRef?: ChecklistForm_checklist$key;
}) {
  const data = useFragment(
    graphql`
      fragment ChecklistForm_query on RootQuery {
        listoryListSearch(first: 100) {
          nodes {
            id
            title
            items {
              totalCount
            }
          }
        }
      }
    `,
    queryRef ?? null,
  );
  const checklist = useFragment(
    graphql`
      fragment ChecklistForm_checklist on ListoryChecklist {
        id
        title
      }
    `,
    checklistRef ?? null,
  );
  const create = useChecklistFormCreateMutation();
  const update = useChecklistFormUpdateMutation();
  const navigate = useNavigate();
  const canWrite = useCanWrite();
  const editing = checklist !== null;
  const [title, setTitle] = useState(checklist?.title ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const lists = useMemo(
    () =>
      (data?.listoryListSearch?.nodes ?? []).flatMap((list) =>
        list
          ? [
              {
                id: list.id,
                title: list.title,
                itemCount: list.items?.totalCount ?? 0,
              },
            ]
          : [],
      ),
    [data],
  );
  const hasLists = lists.length > 0;
  const pending = create.pending || update.pending;
  const tooLong = title.length > TITLE_MAX_LENGTH;
  const saveDisabled = editing
    ? !canWrite || pending || !title.trim() || tooLong
    : !canWrite ||
      !hasLists ||
      pending ||
      !title.trim() ||
      tooLong ||
      selected.length === 0;
  function failed(failure: Error) {
    setError(
      `${failure.message} Check your checklists before retrying; changes may have been saved.`,
    );
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saveDisabled) return;
    setError("");
    if (checklist) {
      update.save(
        { input: { id: checklist.id, title } },
        (response) => {
          const id = response.updateListoryChecklist?.listoryChecklist?.id;
          if (!id) {
            failed(new Error("The server did not confirm the saved checklist."));
            return;
          }
          navigate(ChecklistDetailURI.getURI({ id }));
        },
        failed,
      );
      return;
    }
    create.save(
      { title, sourceLists: selected },
      (response) => {
        const id = response.createListoryChecklist?.listoryChecklist?.id;
        if (!id) {
          failed(new Error("The server did not confirm the saved checklist."));
          return;
        }
        navigate(ChecklistDetailURI.getURI({ id }));
      },
      failed,
    );
  }
  function onCancel() {
    if (checklist) navigate(ChecklistDetailURI.getURI({ id: checklist.id }));
    else navigate(ChecklistIndexURI.getURI({}));
  }
  return {
    editing,
    lists,
    hasLists,
    canWrite,
    title,
    setTitle,
    selected,
    setSelected,
    error,
    pending,
    tooLong,
    saveDisabled,
    submit,
    onCancel,
  };
}
