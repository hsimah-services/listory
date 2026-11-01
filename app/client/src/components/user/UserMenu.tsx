import { useState } from "react";
import { Avatar } from "@astryxdesign/core/Avatar";
import { DropdownMenu } from "@astryxdesign/core/DropdownMenu";
import { Text } from "@astryxdesign/core/Text";
import { SESSION } from "../../lib/session";

export function UserMenu() {
  const { message, items } = useUserMenu();
  return (
    <>
      <DropdownMenu
        button={{
          label: "Account menu",
          variant: "ghost",
          isIconOnly: true,
          icon: <Avatar size="sm" alt="Account" tooltip={false} />,
        }}
        hasChevron={false}
        presentation="popover"
        alignment="end"
        items={items}
      />
      {message && <Text role="status">{message}</Text>}
    </>
  );
}

function useUserMenu() {
  const [message, setMessage] = useState("");
  const items = [
    {
      label: "Sign out",
      onClick: () => {
        if (window.confirm("Sign out? Unsaved changes in Listory tabs will be discarded.")) {
          void SESSION.logout().catch(() =>
            setMessage("Could not sign out. Please try again."),
          );
        }
      },
    },
  ];
  return { message, items };
}
