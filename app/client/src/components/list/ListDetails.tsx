import { useEffect, useRef } from "react";
import { graphql, useFragment } from "react-relay";
import { List, ListItem } from "@astryxdesign/core/List";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import type { ListDetails_list$key } from "./__generated__/ListDetails_list.graphql";

export type ListDetailsProps = {
  listRef: ListDetails_list$key;
};

export function ListDetails({ listRef }: ListDetailsProps) {
  const { list, heading, items } = useListDetails({ listRef });
  return (
    <Stack gap={4}>
      <Text as="h2" type="display-3" tabIndex={-1} ref={heading}>
        {list.title}
      </Text>
      <Text>Created {new Date(list.createdAt).toLocaleDateString()}</Text>
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
  return { list, heading, items };
}
