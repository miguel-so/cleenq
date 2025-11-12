import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
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
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";

import Page from "../../components/common/Page";
import useToastNotification from "../../lib/hooks/useToastNotification";
import Api from "../../lib/Api";
import urlConstants from "../../lib/constants/url.constants";
import type {
  ApiResponse,
  CustomerMembership,
  CustomerSummary,
  MembershipPlan,
} from "../../lib/types/api";

type PlanFormState = {
  name: string;
  slug: string;
  tierLevel: number;
  minPoints: number;
  maxPoints?: number | "";
  discountPercent: number;
  monthlyFee?: string;
  annualFee?: string;
  perks: string;
  isActive: boolean;
};

const defaultPlanForm: PlanFormState = {
  name: "",
  slug: "",
  tierLevel: 1,
  minPoints: 0,
  maxPoints: "",
  discountPercent: 0,
  monthlyFee: "",
  annualFee: "",
  perks: "",
  isActive: true,
};

type PlanModalMode = "create" | "edit";

interface PlanModalState {
  mode: PlanModalMode;
  plan?: MembershipPlan;
}

type MemberModalMode = "create" | "edit";

interface MemberModalState {
  mode: MemberModalMode;
  membership?: CustomerMembership;
}

type MembershipFormState = {
  customerId: string;
  membershipPlanId: string;
  status: string;
  expiresAt?: string;
  autoRenew: boolean;
};

const defaultMembershipForm: MembershipFormState = {
  customerId: "",
  membershipPlanId: "",
  status: "ACTIVE",
  expiresAt: "",
  autoRenew: false,
};

const statusOptions = ["ACTIVE", "PAUSED", "CANCELLED", "EXPIRED"];

const MembershipsPage = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [memberships, setMemberships] = useState<CustomerMembership[]>([]);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [planForm, setPlanForm] = useState<PlanFormState>(defaultPlanForm);
  const [membershipForm, setMembershipForm] =
    useState<MembershipFormState>(defaultMembershipForm);
  const [planModalState, setPlanModalState] =
    useState<PlanModalState | null>(null);
  const [memberModalState, setMemberModalState] =
    useState<MemberModalState | null>(null);
  const [loading, setLoading] = useState(false);

  const planModal = useDisclosure();
  const memberModal = useDisclosure();
  const showToast = useToastNotification();

  const fetchPlans = async () => {
    const response = await Api.get<ApiResponse<MembershipPlan[]>>(
      urlConstants.memberships.plans,
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Failed to load plans",
        description:
          response.error ||
          response.data?.message ||
          "Unable to fetch membership plans.",
        status: "error",
      });
      return;
    }
    setPlans(response.data.data);
  };

  const fetchMemberships = async () => {
    const response = await Api.get<ApiResponse<CustomerMembership[]>>(
      urlConstants.memberships.members,
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Failed to load memberships",
        description:
          response.error ||
          response.data?.message ||
          "Unable to fetch member list.",
        status: "error",
      });
      return;
    }
    setMemberships(response.data.data);
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

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchPlans(), fetchMemberships(), fetchCustomers()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const resetPlanForm = () => setPlanForm(defaultPlanForm);
  const resetMembershipForm = () => setMembershipForm(defaultMembershipForm);

  const openCreatePlanModal = () => {
    resetPlanForm();
    setPlanModalState({ mode: "create" });
    planModal.onOpen();
  };

  const openEditPlanModal = (plan: MembershipPlan) => {
    setPlanForm({
      name: plan.name,
      slug: plan.slug,
      tierLevel: plan.tierLevel,
      minPoints: plan.minPoints,
      maxPoints: plan.maxPoints ?? "",
      discountPercent: plan.discountPercent,
      monthlyFee:
        plan.monthlyFee !== null && plan.monthlyFee !== undefined
          ? String(plan.monthlyFee)
          : "",
      annualFee:
        plan.annualFee !== null && plan.annualFee !== undefined
          ? String(plan.annualFee)
          : "",
      perks: (plan.perks ?? []).join("\n"),
      isActive: plan.isActive,
    });
    setPlanModalState({ mode: "edit", plan });
    planModal.onOpen();
  };

  const handlePlanSubmit = async () => {
    const payload = {
      name: planForm.name,
      slug: planForm.slug,
      tierLevel: Number(planForm.tierLevel),
      minPoints: Number(planForm.minPoints),
      maxPoints:
        planForm.maxPoints === "" ? undefined : Number(planForm.maxPoints),
      discountPercent: Number(planForm.discountPercent),
      monthlyFee:
        planForm.monthlyFee && planForm.monthlyFee.trim() !== ""
          ? Number(planForm.monthlyFee)
          : undefined,
      annualFee:
        planForm.annualFee && planForm.annualFee.trim() !== ""
          ? Number(planForm.annualFee)
          : undefined,
      perks: planForm.perks
        ? planForm.perks
            .split("\n")
            .map((perk) => perk.trim())
            .filter(Boolean)
        : [],
      isActive: planForm.isActive,
    };

    if (planModalState?.mode === "edit" && planModalState.plan) {
      const response = await Api.patch<ApiResponse<MembershipPlan>>(
        urlConstants.memberships.plan(planModalState.plan.id),
        payload,
      );
      if (response.error || !response.data?.success) {
        showToast({
          title: "Update failed",
          description:
            response.error ||
            response.data?.message ||
            "Unable to update plan.",
          status: "error",
        });
        return;
      }
      showToast({
        title: "Plan updated",
        description: `${planForm.name} has been updated.`,
        status: "success",
      });
    } else {
      const response = await Api.post<ApiResponse<MembershipPlan>>(
        urlConstants.memberships.plans,
        payload,
      );
      if (response.error || !response.data?.success) {
        showToast({
          title: "Create failed",
          description:
            response.error ||
            response.data?.message ||
            "Unable to create plan.",
          status: "error",
        });
        return;
      }
      showToast({
        title: "Plan created",
        description: `${planForm.name} has been added.`,
        status: "success",
      });
    }
    planModal.onClose();
    await fetchPlans();
  };

  const handleDeletePlan = async (plan: MembershipPlan) => {
    const response = await Api.delete<ApiResponse<unknown>>(
      urlConstants.memberships.plan(plan.id),
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Delete failed",
        description:
          response.error ||
          response.data?.message ||
          "Unable to delete plan.",
        status: "error",
      });
      return;
    }
    showToast({
      title: "Plan removed",
      description: `${plan.name} has been deleted.`,
      status: "success",
    });
    await fetchPlans();
  };

  const openCreateMemberModal = () => {
    resetMembershipForm();
    setMemberModalState({ mode: "create" });
    memberModal.onOpen();
  };

  const openEditMemberModal = (membership: CustomerMembership) => {
    setMembershipForm({
      customerId: membership.customerId,
      membershipPlanId: membership.membershipPlanId,
      status: membership.status,
      expiresAt: membership.expiresAt
        ? membership.expiresAt.substring(0, 10)
        : "",
      autoRenew: membership.autoRenew,
    });
    setMemberModalState({ mode: "edit", membership });
    memberModal.onOpen();
  };

  const handleMembershipSubmit = async () => {
    const payload = {
      customerId: membershipForm.customerId,
      membershipPlanId: membershipForm.membershipPlanId,
      status: membershipForm.status,
      autoRenew: membershipForm.autoRenew,
      expiresAt:
        membershipForm.expiresAt && membershipForm.expiresAt !== ""
          ? new Date(membershipForm.expiresAt).toISOString()
          : undefined,
    };

    if (memberModalState?.mode === "edit" && memberModalState.membership) {
      const response = await Api.patch<ApiResponse<CustomerMembership>>(
        urlConstants.memberships.member(memberModalState.membership.id),
        payload,
      );
      if (response.error || !response.data?.success) {
        showToast({
          title: "Update failed",
          description:
            response.error ||
            response.data?.message ||
            "Unable to update membership.",
          status: "error",
        });
        return;
      }
      showToast({
        title: "Membership updated",
        description: "Member assignment has been updated.",
        status: "success",
      });
    } else {
      const response = await Api.post<ApiResponse<CustomerMembership>>(
        urlConstants.memberships.members,
        payload,
      );
      if (response.error || !response.data?.success) {
        showToast({
          title: "Assign failed",
          description:
            response.error ||
            response.data?.message ||
            "Unable to assign membership.",
          status: "error",
        });
        return;
      }
      showToast({
        title: "Membership assigned",
        description: "Customer membership has been created.",
        status: "success",
      });
    }
    memberModal.onClose();
    await fetchMemberships();
  };

  const planById = useMemo(() => {
    const map = new Map<string, MembershipPlan>();
    plans.forEach((plan) => map.set(plan.id, plan));
    return map;
  }, [plans]);

  return (
    <Page>
      <Flex align="center" justify="space-between" mb={6}>
        <Box>
          <Heading size="lg">Membership Management</Heading>
          <Text color="gray.600">
            Configure membership tiers and manage customer enrollments.
          </Text>
        </Box>
        <Button
          leftIcon={<MdAdd />}
          colorScheme="teal"
          onClick={openCreatePlanModal}
        >
          New plan
        </Button>
      </Flex>

      <Text fontWeight="bold" mb={2}>
        Membership plans
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
        {plans.map((plan) => (
          <Card
            key={plan.id}
            borderWidth="1px"
            borderColor={plan.isActive ? "teal.400" : "gray.200"}
          >
            <CardHeader>
              <Flex align="center" justify="space-between">
                <Box>
                  <Heading size="md">{plan.name}</Heading>
                  <Text color="gray.500">{plan.slug}</Text>
                </Box>
                <Badge colorScheme={plan.isActive ? "green" : "gray"}>
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </Flex>
            </CardHeader>
            <CardBody>
              <Stack spacing={2}>
                <Text>
                  <strong>Tier:</strong> {plan.tierLevel}
                </Text>
                <Text>
                  <strong>Points:</strong> {plan.minPoints} -{" "}
                  {plan.maxPoints ?? "∞"}
                </Text>
                <Text>
                  <strong>Discount:</strong> {plan.discountPercent}% off
                </Text>
                {plan.monthlyFee && (
                  <Text>
                    <strong>Monthly fee:</strong> ${plan.monthlyFee}
                  </Text>
                )}
                {plan.annualFee && (
                  <Text>
                    <strong>Annual fee:</strong> ${plan.annualFee}
                  </Text>
                )}
                {plan.perks && plan.perks.length > 0 && (
                  <Box>
                    <Text fontWeight="semibold">Perks:</Text>
                    <Stack spacing={1} mt={1}>
                      {plan.perks.map((perk, index) => (
                        <Text key={index} color="gray.600">
                          • {perk}
                        </Text>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </CardBody>
            <CardFooter justify="flex-end" gap={2}>
              <Tooltip label="Edit plan">
                <IconButton
                  aria-label="Edit plan"
                  icon={<MdEdit />}
                  onClick={() => openEditPlanModal(plan)}
                />
              </Tooltip>
              <Tooltip label="Delete plan">
                <IconButton
                  aria-label="Delete plan"
                  icon={<MdDelete />}
                  colorScheme="red"
                  onClick={() => handleDeletePlan(plan)}
                />
              </Tooltip>
            </CardFooter>
          </Card>
        ))}
        {!loading && plans.length === 0 && (
          <Box
            borderWidth="1px"
            borderRadius="md"
            p={6}
            textAlign="center"
            color="gray.500"
          >
            No membership plans yet. Create your first plan to get started.
          </Box>
        )}
      </SimpleGrid>

      <Flex align="center" justify="space-between" mt={10} mb={4}>
        <Box>
          <Heading size="md">Customer memberships</Heading>
          <Text color="gray.600">
            Manage customer enrolments and membership statuses.
          </Text>
        </Box>
        <Button leftIcon={<MdAdd />} onClick={openCreateMemberModal}>
          Assign membership
        </Button>
      </Flex>

      <Box borderWidth="1px" borderRadius="md" overflowX="auto">
        <Table>
          <Thead bg="gray.50">
            <Tr>
              <Th>Customer</Th>
              <Th>Email</Th>
              <Th>Plan</Th>
              <Th>Status</Th>
              <Th>Auto renew</Th>
              <Th>Expires</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {memberships.map((membership) => (
              <Tr key={membership.id}>
                <Td>
                  {membership.customer.firstName}{" "}
                  {membership.customer.lastName}
                </Td>
                <Td>{membership.customer.email}</Td>
                <Td>{membership.membershipPlan.name}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      membership.status === "ACTIVE" ? "green" : "gray"
                    }
                  >
                    {membership.status}
                  </Badge>
                </Td>
                <Td>{membership.autoRenew ? "Yes" : "No"}</Td>
                <Td>
                  {membership.expiresAt
                    ? new Date(membership.expiresAt).toLocaleDateString()
                    : "—"}
                </Td>
                <Td>
                  <Tooltip label="Edit membership">
                    <IconButton
                      aria-label="Edit membership"
                      icon={<MdEdit />}
                      size="sm"
                      onClick={() => openEditMemberModal(membership)}
                    />
                  </Tooltip>
                </Td>
              </Tr>
            ))}
            {!loading && memberships.length === 0 && (
              <Tr>
                <Td colSpan={7} textAlign="center" color="gray.500" py={6}>
                  No customer memberships yet.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Plan modal */}
      <Modal isOpen={planModal.isOpen} onClose={planModal.onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {planModalState?.mode === "edit" ? "Edit plan" : "Create plan"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={planForm.name}
                  onChange={(event) =>
                    setPlanForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Slug</FormLabel>
                <Input
                  value={planForm.slug}
                  onChange={(event) =>
                    setPlanForm((prev) => ({
                      ...prev,
                      slug: event.target.value,
                    }))
                  }
                />
              </FormControl>
              <Flex gap={4}>
                <FormControl isRequired>
                  <FormLabel>Tier level</FormLabel>
                  <NumberInput
                    value={planForm.tierLevel}
                    min={0}
                    onChange={(_, value) =>
                      setPlanForm((prev) => ({
                        ...prev,
                        tierLevel: value,
                      }))
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Discount %</FormLabel>
                  <NumberInput
                    value={planForm.discountPercent}
                    min={0}
                    max={100}
                    onChange={(_, value) =>
                      setPlanForm((prev) => ({
                        ...prev,
                        discountPercent: value,
                      }))
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </Flex>
              <Flex gap={4}>
                <FormControl isRequired>
                  <FormLabel>Min points</FormLabel>
                  <NumberInput
                    value={planForm.minPoints}
                    min={0}
                    onChange={(_, value) =>
                      setPlanForm((prev) => ({
                        ...prev,
                        minPoints: value,
                      }))
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Max points</FormLabel>
                  <NumberInput
                    value={planForm.maxPoints === "" ? undefined : planForm.maxPoints}
                    min={0}
                    onChange={(_, value) =>
                      setPlanForm((prev) => ({
                        ...prev,
                        maxPoints: Number.isNaN(value) ? "" : value,
                      }))
                    }
                  >
                    <NumberInputField placeholder="Unlimited" />
                  </NumberInput>
                </FormControl>
              </Flex>
              <Flex gap={4}>
                <FormControl>
                  <FormLabel>Monthly fee</FormLabel>
                  <NumberInput
                    value={planForm.monthlyFee}
                    min={0}
                    onChange={(value) =>
                      setPlanForm((prev) => ({
                        ...prev,
                        monthlyFee: value,
                      }))
                    }
                  >
                    <NumberInputField placeholder="Optional" />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Annual fee</FormLabel>
                  <NumberInput
                    value={planForm.annualFee}
                    min={0}
                    onChange={(value) =>
                      setPlanForm((prev) => ({
                        ...prev,
                        annualFee: value,
                      }))
                    }
                  >
                    <NumberInputField placeholder="Optional" />
                  </NumberInput>
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel>Perks (one per line)</FormLabel>
                <Textarea
                  value={planForm.perks}
                  onChange={(event) =>
                    setPlanForm((prev) => ({
                      ...prev,
                      perks: event.target.value,
                    }))
                  }
                  placeholder="e.g. Priority scheduling"
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Active</FormLabel>
                <Switch
                  isChecked={planForm.isActive}
                  onChange={(event) =>
                    setPlanForm((prev) => ({
                      ...prev,
                      isActive: event.target.checked,
                    }))
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={planModal.onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handlePlanSubmit}>
              {planModalState?.mode === "edit" ? "Save changes" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Membership modal */}
      <Modal isOpen={memberModal.isOpen} onClose={memberModal.onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {memberModalState?.mode === "edit"
              ? "Edit membership"
              : "Assign membership"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Customer</FormLabel>
                <Select
                  value={membershipForm.customerId}
                  onChange={(event) =>
                    setMembershipForm((prev) => ({
                      ...prev,
                      customerId: event.target.value,
                    }))
                  }
                  disabled={memberModalState?.mode === "edit"}
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
                <FormLabel>Membership plan</FormLabel>
                <Select
                  value={membershipForm.membershipPlanId}
                  onChange={(event) =>
                    setMembershipForm((prev) => ({
                      ...prev,
                      membershipPlanId: event.target.value,
                    }))
                  }
                >
                  <option value="">Select plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={membershipForm.status}
                  onChange={(event) =>
                    setMembershipForm((prev) => ({
                      ...prev,
                      status: event.target.value,
                    }))
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Expiry date</FormLabel>
                <Input
                  type="date"
                  value={membershipForm.expiresAt ?? ""}
                  onChange={(event) =>
                    setMembershipForm((prev) => ({
                      ...prev,
                      expiresAt: event.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Auto renew</FormLabel>
                <Switch
                  isChecked={membershipForm.autoRenew}
                  onChange={(event) =>
                    setMembershipForm((prev) => ({
                      ...prev,
                      autoRenew: event.target.checked,
                    }))
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={memberModal.onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleMembershipSubmit}>
              {memberModalState?.mode === "edit" ? "Save changes" : "Assign"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  );
};

export default MembershipsPage;

