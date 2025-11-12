import {
  Avatar,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { MdMenu } from "react-icons/md";

interface HeaderProps {
  onCollapse: () => void;
}

const AdminHeader = ({ onCollapse }: HeaderProps) => {

  return (
    <Flex
      backgroundColor="white"
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
      paddingX={4}
      paddingY={2}
      borderBottom="1px solid #E2E8F0"
      shadow="sm"
    >
      <IconButton
        aria-label="Menu Collapse"
        icon={<MdMenu />}
        onClick={onCollapse}
        variant="ghost"
        size="lg"
      />
      <Flex alignItems="center" gap={6}>
        <Avatar size="sm" name="Doe" bg="teal.300" />
      </Flex>
    </Flex>
  );
};

export default AdminHeader;
