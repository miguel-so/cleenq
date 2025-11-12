import { List, ListItem } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import {
  MdCleaningServices,
  MdEmojiEvents,
  MdEventAvailable,
  MdPeopleAlt,
  MdPriceChange,
  MdSpaceDashboard,
  MdWorkspacePremium,
} from "react-icons/md";

import { NavItem } from "./NavItem";
import { Path } from "../../lib/constants/path.constants";

const items: NavbarItem[] = [
  {
    type: "link",
    label: "Dashboard",
    icon: MdSpaceDashboard,
    path: Path.DASHBOARD,
  },
  {
    type: "link",
    label: "Pricing",
    icon: MdPriceChange,
    path: Path.PRICING,
  },
  {
    type: "link",
    label: "Memberships",
    icon: MdWorkspacePremium,
    path: Path.MEMBERSHIPS,
  },
  {
    type: "link",
    label: "Rewards",
    icon: MdEmojiEvents,
    path: Path.REWARDS,
  },
  {
    type: "link",
    label: "Bookings",
    icon: MdEventAvailable,
    path: Path.BOOKINGS,
  },
  {
    type: "link",
    label: "Customers",
    icon: MdPeopleAlt,
    path: Path.CUSTOMERS,
  },
  {
    type: "link",
    label: "Cleaners",
    icon: MdCleaningServices,
    path: Path.CLEANERS,
  },
];

interface NavigationProps {
  collapse: boolean;
}

export const Navigation = ({ collapse }: NavigationProps) => {
  const location = useLocation();

  return (
    <List w="full" my={8}>
      {items.map((item, index) => (
        <ListItem key={index}>
          <NavItem
            item={item}
            isActive={location.pathname === item.path}
            collapse={collapse}
          />
        </ListItem>
      ))}
    </List>
  );
};
