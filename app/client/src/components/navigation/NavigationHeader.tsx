import { useMatch } from "react-router";
import { UserMenu } from "../user/UserMenu";
import { TopNav, TopNavHeading, TopNavItem } from "@astryxdesign/core/TopNav";
import * as stylex from "@stylexjs/stylex";
import {
  ChecklistIndexURI,
  HomeURI,
  ListIndexURI,
} from "../../routes/__generated__/routes";

const NAV_ITEMS = [
  { path: ListIndexURI.getURI({}), label: "Lists" },
  { path: ChecklistIndexURI.getURI({}), label: "Checklists" },
];

export function NavigationHeader() {
  return (
    <>
      <TopNav
        xstyle={styles.nav}
        label="Main navigation"
        heading={
          <TopNavHeading heading="Listory" headingHref={HomeURI.getURI({})} />
        }
        startContent={NAV_ITEMS.map((item) => (
          <NavigationHeader_Item key={item.path} path={item.path} label={item.label} />
        ))}
        endContent={<UserMenu />}
      />
    </>
  );
}

function NavigationHeader_Item({ path, label }: NavigationHeader_ItemProps) {
  // Matches the item's own page and any page nested beneath it.
  const isSelected = useMatch({ path, end: false }) !== null;
  return (
    <TopNavItem
      href={path}
      label={label}
      xstyle={[styles.tab, isSelected && styles.selectedTab]}
      isSelected={isSelected}
    />
  );
}

interface NavigationHeader_ItemProps {
  path: string;
  label: string;
}

const styles = stylex.create({
  nav: {
    backgroundColor: "var(--color-background-muted)",
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: "var(--color-accent)",
  },
  tab: {
    color: "var(--color-text-accent)",
    borderRadius: "var(--radius-element)",
    backgroundColor: {
      default: "transparent",
      ":hover": "var(--color-accent-muted)",
    },
    transition:
      "background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)",
  },
  selectedTab: {
    color: "var(--color-on-accent)",
    backgroundColor: {
      default: "var(--color-accent)",
      ":hover": "var(--color-text-accent)",
    },
    boxShadow: "var(--shadow-low)",
    fontWeight: 700,
  },
});
