import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { graphql, useFragment } from "react-relay";
import { Button } from "@astryxdesign/core/Button";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { useCanWrite } from "../../relay/useCanWrite";
import {
  ListDetailURI,
  ListIndexURI,
} from "../../routes/__generated__/routes";
import { useListFormCreateMutation } from "./form/useListFormCreateMutation";
import { useListFormUpdateMutation } from "./form/useListFormUpdateMutation";
import type { ListForm_list$key } from "./__generated__/ListForm_list.graphql";

const TITLE_MAX_LENGTH = 200;

export function ListForm({ listRef }: { listRef?: ListForm_list$key }) {
  const {
    list,
    onCancel,
    canWrite,
    title,
    setTitle,
    error,
    pending,
    tooLong,
    submit,
  } = useListForm({ listRef });
  return (
    <Stack gap={4}>
      <Text as="h2" type="display-3">
        {list ? "Edit list" : "New list"}
      </Text>
      <form onSubmit={submit}>
        <Stack gap={4}>
          {error && <Text role="alert">{error}</Text>}
          <TextInput
            hasAutoFocus
            label="Title"
            value={title}
            onChange={setTitle}
            placeholder="e.g. BBQ, Picnic, Travel"
            isRequired
            isDisabled={!canWrite || pending}
            status={
              tooLong
                ? {
                    type: "error",
                    message: `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`,
                  }
                : undefined
            }
          />
          <Stack direction="horizontal" gap={2}>
            <Button
              type="submit"
              label={list ? "Update" : "Create"}
              isLoading={pending}
              isDisabled={!canWrite || !title.trim() || tooLong}
            />
            <Button
              type="button"
              label="Cancel"
              variant="ghost"
              isDisabled={pending}
              onClick={onCancel}
            />
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
}

function useListForm({ listRef }: { listRef?: ListForm_list$key }) {
  const list = useFragment(
    graphql`
      fragment ListForm_list on ListoryList {
        id
        title
      }
    `,
    listRef ?? null,
  );
  const create = useListFormCreateMutation();
  const update = useListFormUpdateMutation();
  const navigate = useNavigate();
  const canWrite = useCanWrite();
  const [title, setTitle] = useState(list?.title ?? "");
  const [error, setError] = useState("");
  const pending = create.pending || update.pending;
  const tooLong = title.length > TITLE_MAX_LENGTH;
  const failed = (failure: Error) =>
    setError(
      `${failure.message} Check your lists before retrying; changes may have been saved.`,
    );
  function completed(id?: string) {
    if (!id) {
      failed(new Error("The server did not confirm the saved list."));
      return;
    }
    navigate(ListDetailURI.getURI({ id }));
  }
  function onCancel() {
    if (list) navigate(ListDetailURI.getURI({ id: list.id }));
    else navigate(ListIndexURI.getURI({}));
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !canWrite || !title.trim() || tooLong) return;
    setError("");
    if (list)
      update.save(
        { input: { id: list.id, title } },
        (response) => completed(response.updateListoryList?.listoryList?.id),
        failed,
      );
    else
      create.save(
        { input: { title } },
        (response) => completed(response.createListoryList?.listoryList?.id),
        failed,
      );
  }
  return {
    list,
    onCancel,
    canWrite,
    title,
    setTitle,
    error,
    pending,
    tooLong,
    submit,
  };
}
