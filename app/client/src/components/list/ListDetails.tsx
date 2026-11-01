import { useEffect, useRef } from "react";
import { graphql, useFragment } from "react-relay";
import { List, ListItem } from "@astryxdesign/core/List";
import { Button } from "@astryxdesign/core/Button";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { useCanWrite } from "../../relay/useCanWrite";
import { ListEditURI } from "../../routes/__generated__/routes";
import type { ListDetails_list$key } from "./__generated__/ListDetails_list.graphql";

export type ListDetailsProps = {
  listRef: ListDetails_list$key;
};

export function ListDetails({ listRef }: ListDetailsProps) {
  const { list, heading, items, canWrite } = useListDetails({ listRef });
  return (
    <Stack gap={4}>
      <Text as="h2" type="display-3" tabIndex={-1} ref={heading}>
        {list.title}
      </Text>
      <Text>Created {new Date(list.createdAt).toLocaleDateString()}</Text>
      {canWrite && (
        <Stack direction="horizontal" gap={2}>
          <Button label="Edit" href={ListEditURI.getURI({ id: list.id })} />
        </Stack>
      )}
      {items.length === 0 ? (
        <Text>This list has no items yet</Text>
      ) : (
        <List hasDividers>
          {items.map((item) => (
            <ListItem key={item.id} label={item.name} />
          ))}
        </List>
      )}
    </Stack>
  );
}

function useListDetails({ listRef }: { listRef: ListDetails_list$key }) {
  const list = useFragment(
    graphql`
      fragment ListDetails_list on ListoryList {
        id
        title
        createdAt
        items(first: 100) {
          nodes {
            id
            name
          }
        }
      }
    `,
    listRef,
  );
  const heading = useRef<HTMLElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [list.id]);
  const items =
    list.items?.nodes?.flatMap((node) => (node ? [node] : [])) ?? [];
  const canWrite = useCanWrite();
  return { list, heading, items, canWrite };
}
