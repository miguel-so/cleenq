import { List, ListItem } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom'; // Import useLocation to get current route
import {
  MdOutlinePeople,
  MdOutlineCategory,
  MdFitnessCenter,
  MdPalette,
} from 'react-icons/md';

import { NavItem } from './NavItem';
import { Path } from '../../lib/constants/path.constants';

const items: NavbarItem[] = [
  // {
  //   type: 'link',
  //   label: 'Dashboard',
  //   icon: MdOutlineSpaceDashboard,
  //   path: Path.DASHBOARD,
  // },
  {
    type: 'link',
    label: 'Users',
    icon: MdOutlinePeople,
    path: Path.USERS,
  },
  {
    type: 'link',
    label: 'Categories',
    icon: MdOutlineCategory,
    path: Path.CATEGORIES,
  },
  {
    type: 'link',
    label: 'Artworks',
    icon: MdPalette,
    path: Path.ARTWORKS,
  },
];

interface NavigationProps {
  collapse: boolean;
}

export const Navigation = ({ collapse }: NavigationProps) => {
  const location = useLocation();

  return (
    <List w='full' my={8}>
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
