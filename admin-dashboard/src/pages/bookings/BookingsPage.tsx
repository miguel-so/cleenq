import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
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
import { MdRefresh, MdStickyNote2 } from "react-icons/md";

import Page from "../../components/common/Page";
import useToastNotification from "../../lib/hooks/useToastNotification";
import Api from "../../lib/Api";
import urlConstants from "../../lib/constants/url.constants";
import type {
  ApiResponse,
  Booking,
  BookingStatus,
  Cleaner,
  PaginationMeta,
  ServiceCategory,
} from "../../lib/types/api";

interface Filters {
  status?: BookingStatus | "";
  serviceCategoryId?: string;
  search?: string;
}

const statusOptions: BookingStatus[] = [
  "PENDING",
  "QUOTED",
  "CONFIRMED",
  "SCHEDULED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [filters, setFilters] = useState<Filters>({ status: "", search: "" });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedCleanerId, setSelectedCleanerId] = useState<string>("");

  const assignCleanerModal = useDisclosure();
  const showToast = useToastNotification();

  const fetchBookings = async (cursor?: string, reset = false) => {
    setLoading(true);
    const response = await Api.get<ApiResponse<Booking[]>>(
      urlConstants.bookings.list,
      {
        limit: 25,
        cursor,
        status: filters.status || undefined,
        serviceCategoryId: filters.serviceCategoryId || undefined,
        search: filters.search?.trim() || undefined,
      },
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Failed to load bookings",
        description:
          response.error ||
          response.data?.message ||
          "Unable to fetch booking records.",
        status: "error",
      });
      setLoading(false);
      return;
    }
    setBookings((prev) =>
      reset ? response.data!.data : [...prev, ...response.data!.data],
    );
    setMeta(response.data.meta ?? null);
    setLoading(false);
  };

  const fetchServices = async () => {
    const response = await Api.get<ApiResponse<ServiceCategory[]>>(
      urlConstants.services.list,
    );
    if (response.error || !response.data?.success) {
      return;
    }
    setServices(response.data.data);
  };

  const fetchCleaners = async () => {
    const response = await Api.get<ApiResponse<Cleaner[]>>(
      urlConstants.cleaners.list,
    );
    if (response.error || !response.data?.success) {
      return;
    }
    setCleaners(response.data.data);
  };

  useEffect(() => {
    fetchServices();
    fetchCleaners();
  }, []);

  useEffect(() => {
    fetchBookings(undefined, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.serviceCategoryId]);

  const handleStatusUpdate = async (booking: Booking, status: BookingStatus) => {
    const response = await Api.patch<ApiResponse<Booking>>(
      urlConstants.bookings.updateStatus(booking.id),
      {
        status,
        notes: `Status changed via admin portal`,
      },
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Update failed",
        description:
          response.error ||
          response.data?.message ||
          "Unable to update booking status.",
        status: "error",
      });
      return;
    }
    setBookings((prev) =>
      prev.map((item) => (item.id === booking.id ? response.data!.data : item)),
    );
    showToast({
      title: "Status updated",
      description: `Booking ${booking.reference} status updated to ${status}.`,
      status: "success",
    });
  };

  const openAssignCleanerModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedCleanerId("");
    assignCleanerModal.onOpen();
  };

  const handleAssignCleaner = async () => {
    if (!selectedBooking || !selectedCleanerId) return;
    const response = await Api.post<ApiResponse<unknown>>(
      urlConstants.bookings.assignCleaner(selectedBooking.id),
      {
        cleanerId: selectedCleanerId,
        status: "ASSIGNED",
      },
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Assignment failed",
        description:
          response.error ||
          response.data?.message ||
          "Unable to assign cleaner.",
        status: "error",
      });
      return;
    }
    showToast({
      title: "Cleaner assigned",
      description: "Cleaner assignment recorded.",
      status: "success",
    });
    assignCleanerModal.onClose();
    await fetchBookings(undefined, true);
  };

  const serviceMap = useMemo(() => {
    const map = new Map<string, string>();
    services.forEach((service) => map.set(service.id, service.name));
    return map;
  }, [services]);

  const cleanerAssignments = (booking: Booking) =>
    booking.cleanerAssignments.map((assignment) =>
      assignment.cleaner
        ? `${assignment.cleaner.firstName} ${assignment.cleaner.lastName}`
        : "Unassigned",
    );

  return (
    <Page>
      <Flex align="center" justify="space-between" mb={6}>
        <Box>
          <Heading size="lg">Booking Management</Heading>
          <Text color="gray.600">
            Track booking lifecycle, update statuses, and coordinate cleaners.
          </Text>
        </Box>
        <Button leftIcon={<MdRefresh />} onClick={() => fetchBookings(undefined, true)}>
          Refresh
        </Button>
      </Flex>

      <Box borderWidth="1px" borderRadius="md" p={4} mb={6}>
        <Flex gap={4} wrap="wrap">
          <FormControl maxW="220px">
            <FormLabel>Status</FormLabel>
            <Select
              value={filters.status ?? ""}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  status: event.target.value as BookingStatus | "",
                }))
              }
            >
              <option value="">All</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl maxW="260px">
            <FormLabel>Service</FormLabel>
            <Select
              value={filters.serviceCategoryId ?? ""}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  serviceCategoryId: event.target.value,
                }))
              }
            >
              <option value="">All</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl maxW="240px">
            <FormLabel>Search</FormLabel>
            <Input
              placeholder="Reference or customer"
              value={filters.search ?? ""}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  search: event.target.value,
                }))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  fetchBookings(undefined, true);
                }
              }}
            />
          </FormControl>
          <Flex align="flex-end">
            <Button
              variant="outline"
              onClick={() => fetchBookings(undefined, true)}
            >
              Apply
            </Button>
          </Flex>
        </Flex>
      </Box>

      <Box borderWidth="1px" borderRadius="md" overflowX="auto">
        <Table>
          <Thead bg="gray.50">
            <Tr>
              <Th>Reference</Th>
              <Th>Customer</Th>
              <Th>Service</Th>
              <Th>Scheduled</Th>
              <Th>Status</Th>
              <Th textAlign="right">Total</Th>
              <Th>Cleaners</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking) => (
              <Tr key={booking.id}>
                <Td>
                  <Flex align="center" gap={2}>
                    <Text fontWeight="medium">{booking.reference}</Text>
                    <Tooltip label={booking.notes ?? ""}>
                      <span>
                        <IconButton
                          aria-label="View notes"
                          icon={<MdStickyNote2 />}
                          size="sm"
                          variant="ghost"
                          isDisabled={!booking.notes}
                        />
                      </span>
                    </Tooltip>
                  </Flex>
                </Td>
                <Td>
                  {booking.customer
                    ? `${booking.customer.firstName} ${booking.customer.lastName}`
                    : "—"}
                  <Text color="gray.500" fontSize="sm">
                    {booking.customer?.email}
                  </Text>
                </Td>
                <Td>{booking.serviceCategory?.name ?? "—"}</Td>
                <Td>
                  {booking.scheduledAt
                    ? new Date(booking.scheduledAt).toLocaleString()
                    : "Not scheduled"}
                </Td>
                <Td>
                  <Select
                    value={booking.status}
                    size="sm"
                    onChange={(event) =>
                      handleStatusUpdate(
                        booking,
                        event.target.value as BookingStatus,
                      )
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                </Td>
                <Td textAlign="right">
                  ${Number(booking.total).toFixed(2)}
                </Td>
                <Td>
                  {cleanerAssignments(booking).map((name, index) => (
                    <Badge key={index} colorScheme="purple" mr={1}>
                      {name}
                    </Badge>
                  ))}
                  {booking.cleanerAssignments.length === 0 && (
                    <Badge colorScheme="gray">Unassigned</Badge>
                  )}
                </Td>
                <Td>
                  <Tooltip label="Assign cleaner">
                    <IconButton
                      aria-label="Assign cleaner"
                      icon={<MdRefresh />}
                      size="sm"
                      onClick={() => openAssignCleanerModal(booking)}
                    />
                  </Tooltip>
                </Td>
              </Tr>
            ))}
            {!loading && bookings.length === 0 && (
              <Tr>
                <Td colSpan={8} textAlign="center" color="gray.500" py={6}>
                  No bookings match the current filters.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      {meta?.hasMore && (
        <Flex justify="center" mt={4}>
          <Button
            onClick={() => fetchBookings(meta.nextCursor ?? undefined)}
            isLoading={loading}
          >
            Load more
          </Button>
        </Flex>
      )}

      <Modal
        isOpen={assignCleanerModal.isOpen}
        onClose={assignCleanerModal.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign cleaner</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Text>
                Assign a cleaner to booking{" "}
                <strong>{selectedBooking?.reference}</strong>.
              </Text>
              <FormControl>
                <FormLabel>Cleaner</FormLabel>
                <Select
                  value={selectedCleanerId}
                  onChange={(event) => setSelectedCleanerId(event.target.value)}
                >
                  <option value="">Select cleaner</option>
                  {cleaners.map((cleaner) => (
                    <option key={cleaner.id} value={cleaner.id}>
                      {cleaner.firstName} {cleaner.lastName}{" "}
                      {cleaner.email ? `- ${cleaner.email}` : ""}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={assignCleanerModal.onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleAssignCleaner}
              isDisabled={!selectedCleanerId}
            >
              Assign cleaner
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  );
};

export default BookingsPage;

