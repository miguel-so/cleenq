import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { MdDownload, MdRefresh } from "react-icons/md";

import Page from "../../components/common/Page";
import useToastNotification from "../../lib/hooks/useToastNotification";
import Api from "../../lib/Api";
import urlConstants from "../../lib/constants/url.constants";
import type {
  ApiResponse,
  CustomerSummary,
  PaginationMeta,
  RewardSettings,
  RewardTransaction,
} from "../../lib/types/api";

type SettingsForm = {
  pointsPerDollar: number;
  redemptionThreshold: number;
  redemptionValue: number;
  note?: string;
};

type AdjustmentForm = {
  customerId: string;
  type: RewardTransaction["type"];
  points: number;
  description: string;
  bookingId?: string;
};

const defaultAdjustmentForm: AdjustmentForm = {
  customerId: "",
  type: "ADJUSTMENT",
  points: 0,
  description: "",
  bookingId: "",
};

const RewardsPage = () => {
  const [settings, setSettings] = useState<RewardSettings | null>(null);
  const [settingsForm, setSettingsForm] = useState<SettingsForm | null>(null);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [transactionsMeta, setTransactionsMeta] =
    useState<PaginationMeta | null>(null);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [adjustmentForm, setAdjustmentForm] =
    useState<AdjustmentForm>(defaultAdjustmentForm);

  const adjustmentModal = useDisclosure();
  const showToast = useToastNotification();

  const fetchSettings = async () => {
    const response = await Api.get<ApiResponse<RewardSettings>>(
      urlConstants.rewards.settings,
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Failed to load settings",
        description:
          response.error ||
          response.data?.message ||
          "Unable to load reward settings.",
        status: "error",
      });
      return;
    }
    setSettings(response.data.data);
    setSettingsForm({
      pointsPerDollar: response.data.data.pointsPerDollar,
      redemptionThreshold: response.data.data.redemptionThreshold,
      redemptionValue: Number(response.data.data.redemptionValue),
      note: response.data.data.note ?? "",
    });
  };

  const fetchTransactions = async (cursor?: string) => {
    setLoadingTransactions(true);
    const response = await Api.get<ApiResponse<RewardTransaction[]>>(
      urlConstants.rewards.transactions,
      {
        limit: 25,
        cursor,
      },
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Failed to load transactions",
        description:
          response.error ||
          response.data?.message ||
          "Unable to fetch reward transactions.",
        status: "error",
      });
      setLoadingTransactions(false);
      return;
    }

    setTransactions((prev) =>
      cursor ? [...prev, ...response.data!.data] : response.data!.data,
    );
    setTransactionsMeta(response.data.meta ?? null);
    setLoadingTransactions(false);
  };

  const fetchCustomers = async () => {
    const response = await Api.get<ApiResponse<CustomerSummary[]>>(
      urlConstants.customers.list,
      { limit: 200 },
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Failed to load customers",
        description:
          response.error ||
          response.data?.message ||
          "Unable to fetch customers.",
        status: "error",
      });
      return;
    }
    setCustomers(response.data.data);
  };

  useEffect(() => {
    fetchSettings();
    fetchTransactions();
    fetchCustomers();
  }, []);

  const handleUpdateSettings = async () => {
    if (!settingsForm) return;
    const payload = {
      pointsPerDollar: Number(settingsForm.pointsPerDollar),
      redemptionThreshold: Number(settingsForm.redemptionThreshold),
      redemptionValue: Number(settingsForm.redemptionValue),
      note: settingsForm.note,
    };

    const response = await Api.put<ApiResponse<RewardSettings>>(
      urlConstants.rewards.updateSettings,
      payload,
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Update failed",
        description:
          response.error ||
          response.data?.message ||
          "Unable to update reward settings.",
        status: "error",
      });
      return;
    }
    showToast({
      title: "Settings updated",
      description: "Reward program settings have been saved.",
      status: "success",
    });
    await fetchSettings();
  };

  const openAdjustmentModal = () => {
    setAdjustmentForm(defaultAdjustmentForm);
    adjustmentModal.onOpen();
  };

  const handleCreateAdjustment = async () => {
    if (!adjustmentForm.customerId || !adjustmentForm.points) {
      showToast({
        title: "Missing data",
        description: "Customer and points are required.",
        status: "warning",
      });
      return;
    }

    const payload = {
      customerId: adjustmentForm.customerId,
      type: adjustmentForm.type,
      points: Number(adjustmentForm.points),
      description: adjustmentForm.description,
      bookingId:
        adjustmentForm.bookingId && adjustmentForm.bookingId !== ""
          ? adjustmentForm.bookingId
          : undefined,
    };

    const response = await Api.post<ApiResponse<RewardTransaction>>(
      urlConstants.rewards.adjust,
      payload,
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Adjustment failed",
        description:
          response.error ||
          response.data?.message ||
          "Unable to adjust points.",
        status: "error",
      });
      return;
    }
    showToast({
      title: "Adjustment recorded",
      description: "Reward points adjustment successfully recorded.",
      status: "success",
    });
    adjustmentModal.onClose();
    await fetchTransactions();
  };

  return (
    <Page>
      <Flex align="center" justify="space-between" mb={6}>
        <Box>
          <Heading size="lg">Rewards & Loyalty</Heading>
          <Text color="gray.600">
            Configure reward settings and monitor customer activity.
          </Text>
        </Box>
        <Button leftIcon={<MdRefresh />} onClick={() => fetchTransactions()}>
          Refresh activity
        </Button>
      </Flex>

      <Card borderWidth="1px" mb={8}>
        <CardHeader>
          <Heading size="md">Reward program settings</Heading>
          <Text color="gray.600">
            Configure how points are earned and redeemed across the platform.
          </Text>
        </CardHeader>
        <CardBody>
          {settingsForm && (
            <Stack spacing={4} maxW="600px">
              <Flex gap={4}>
                <FormControl>
                  <FormLabel>Points per $1</FormLabel>
                  <NumberInput
                    min={0}
                    step={0.1}
                    value={settingsForm.pointsPerDollar}
                    onChange={(_, value) =>
                      setSettingsForm((prev) =>
                        prev
                          ? { ...prev, pointsPerDollar: Number(value) }
                          : prev,
                      )
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Redemption threshold (points)</FormLabel>
                  <NumberInput
                    min={0}
                    value={settingsForm.redemptionThreshold}
                    onChange={(_, value) =>
                      setSettingsForm((prev) =>
                        prev
                          ? { ...prev, redemptionThreshold: Number(value) }
                          : prev,
                      )
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel>Voucher value ($) when threshold reached</FormLabel>
                <NumberInput
                  min={0}
                  value={settingsForm.redemptionValue}
                  onChange={(_, value) =>
                    setSettingsForm((prev) =>
                      prev
                        ? { ...prev, redemptionValue: Number(value) }
                        : prev,
                    )
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Program notes</FormLabel>
                <Input
                  value={settingsForm.note ?? ""}
                  onChange={(event) =>
                    setSettingsForm((prev) =>
                      prev ? { ...prev, note: event.target.value } : prev,
                    )
                  }
                  placeholder="Optional note visible internally"
                />
              </FormControl>
              <Flex justify="flex-end" mt={2}>
                <Button colorScheme="teal" onClick={handleUpdateSettings}>
                  Save settings
                </Button>
              </Flex>
            </Stack>
          )}
        </CardBody>
      </Card>

      <Flex align="center" justify="space-between" mb={4}>
        <Box>
          <Heading size="md">Recent reward transactions</Heading>
          <Text color="gray.600">
            Monitor point earnings, redemptions, and manual adjustments.
          </Text>
        </Box>
        <Flex gap={2}>
          <Button leftIcon={<MdAdd />} onClick={openAdjustmentModal}>
            Adjust points
          </Button>
          <Button
            leftIcon={<MdDownload />}
            variant="outline"
            onClick={() => fetchTransactions()}
          >
            Reload
          </Button>
        </Flex>
      </Flex>

      <Box borderWidth="1px" borderRadius="md" overflowX="auto">
        <Table>
          <Thead bg="gray.50">
            <Tr>
              <Th>Date</Th>
              <Th>Customer</Th>
              <Th>Type</Th>
              <Th textAlign="right">Points</Th>
              <Th>Booking</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <Tr key={transaction.id}>
                <Td>
                  {new Date(transaction.createdAt).toLocaleString()}
                </Td>
                <Td>
                  {transaction.customer
                    ? `${transaction.customer.firstName} ${transaction.customer.lastName}`
                    : "—"}
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      transaction.type === "EARN"
                        ? "green"
                        : transaction.type === "REDEEM"
                        ? "red"
                        : "purple"
                    }
                  >
                    {transaction.type}
                  </Badge>
                </Td>
                <Td textAlign="right">{transaction.points}</Td>
                <Td>{transaction.booking?.reference ?? "—"}</Td>
                <Td>{transaction.description ?? "—"}</Td>
              </Tr>
            ))}
            {!loadingTransactions && transactions.length === 0 && (
              <Tr>
                <Td colSpan={6} textAlign="center" color="gray.500" py={6}>
                  No reward transactions yet.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      {transactionsMeta?.hasMore && (
        <Flex justify="center" mt={4}>
          <Button
            onClick={() => fetchTransactions(transactionsMeta.nextCursor ?? undefined)}
            isLoading={loadingTransactions}
          >
            Load more
          </Button>
        </Flex>
      )}

      {/* Adjustment modal */}
      <Modal
        isOpen={adjustmentModal.isOpen}
        onClose={adjustmentModal.onClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adjust reward points</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Customer</FormLabel>
                <Select
                  value={adjustmentForm.customerId}
                  onChange={(event) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      customerId: event.target.value,
                    }))
                  }
                >
                  <option value="">Select customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName} -{" "}
                      {customer.email}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Adjustment type</FormLabel>
                <Select
                  value={adjustmentForm.type}
                  onChange={(event) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      type: event.target.value as RewardTransaction["type"],
                    }))
                  }
                >
                  <option value="EARN">Earn</option>
                  <option value="REDEEM">Redeem</option>
                  <option value="ADJUSTMENT">Manual adjustment</option>
                  <option value="EXPIRY">Expiry</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Points</FormLabel>
                <NumberInput
                  value={adjustmentForm.points}
                  onChange={(_, value) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      points: value,
                    }))
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Related booking (optional)</FormLabel>
                <Input
                  value={adjustmentForm.bookingId ?? ""}
                  onChange={(event) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      bookingId: event.target.value,
                    }))
                  }
                  placeholder="Booking reference or ID"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  value={adjustmentForm.description}
                  onChange={(event) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Reason for adjustment"
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={adjustmentModal.onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleCreateAdjustment}>
              Apply adjustment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  );
};

export default RewardsPage;

