import { useState, useEffect } from "react";
import { Box, Flex, Tag, Switch, IconButton } from "@chakra-ui/react";
import { MdDelete, MdVisibility } from "react-icons/md";

import Page from "../../components/common/Page";
import { ApiCommand } from "../../lib/Api";
import useToastNotification from "../../lib/hooks/useToastNotification";
import CQTable from "../../components/common/CQTable";
import CQPagination from "../../components/common/CQPagination";
import useApi from "../../lib/hooks/useApi";
import urlConstants from "../../lib/constants/url.constants";

const {
  getUsers: getUsersUrl,
  updateUserStatus: updateUserStatusUrl,
  deleteUser: deleteUserUrl,
} = urlConstants.users;

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const showToast = useToastNotification();

  const { loading: isFetchUsersLoading, sendRequest: getUsers } =
    useApi<GetUserResopnse>();
  const { sendRequest: updateUser } = useApi();
  const { sendRequest: deleteUser } = useApi();

  const USER_COLUMNS = [
    {
      key: "username",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "role",
      label: "Role",
      render: (value: string) => (
        <Tag size="sm" colorScheme={value === "artist" ? "blue" : "green"}>
          {value === "artist" ? "Artist" : "Super Admin"}
        </Tag>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: any, row: any) => (
        <Switch
          colorScheme="teal"
          isChecked={value}
          onChange={() => toogleUserStatus(row)}
        />
      ),
    },
  ];

  const toogleUserStatus = (row: any) => {
    updateUser({
      callback: (data, error: string | null) => {
        if (error) {
          showToast({
            title: "Failed",
            description: error,
            status: "error",
          });
          return;
        }
        setUsers((prev) =>
          prev.map((user) =>
            user.id === row.id ? { ...user, isActive: !user.isActive } : user
          )
        );

        showToast({
          title: "Success",
          description: `User ${
            row.isActive ? "deactivated" : "activated"
          } successfully`,
          status: "success",
        });
      },
      command: ApiCommand.PUT,
      url: updateUserStatusUrl(row.id),
    });
  };

  const fetchUsers = () => {
    getUsers({
      callback: (data: GetUserResopnse | null, error: string | null) => {
        if (error) {
          showToast({
            title: "Failed",
            description: error,
            status: "error",
          });
          return;
        }
        if (!data) return null;
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
      },
      command: ApiCommand.GET,
      url: getUsersUrl,
      options: {
        page: currentPage,
        limit: pageSize,
      },
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleDeleteUser = (id: string) => {
    deleteUser({
      callback: (data, error: string | null) => {
        if (error) {
          showToast({
            title: "Failed",
            description: error,
            status: "error",
          });
          return;
        }
        showToast({
          title: "Success",
          description: "User deleted successfully.",
          status: "success",
        });
        fetchUsers();
      },
      command: ApiCommand.DELETE,
      url: deleteUserUrl(id),
    });
  };

  return (
    <Page>
      <Flex flexDirection="column" height="full" justifyContent="space-between">
        <Box backgroundColor="white" borderRadius="lg">
          <CQTable
            columns={USER_COLUMNS}
            data={users}
            loading={isFetchUsersLoading}
            actions={(row) => (
              <>
                <IconButton
                  aria-label="Delete User"
                  icon={<MdDelete />}
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                  disabled={row.role === "super_admin"}
                  onClick={() => handleDeleteUser(row.id)}
                />
              </>
            )}
          />
        </Box>

        <CQPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </Flex>
    </Page>
  );
};

export default Users;
