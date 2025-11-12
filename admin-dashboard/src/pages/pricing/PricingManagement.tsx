import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
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
  Switch,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdLayers,
  MdLibraryAdd,
  MdPlaylistAdd,
} from "react-icons/md";

import Page from "../../components/common/Page";
import useToastNotification from "../../lib/hooks/useToastNotification";
import Api from "../../lib/Api";
import urlConstants from "../../lib/constants/url.constants";
import type {
  ApiResponse,
  AudienceType,
  PriceUnit,
  ServiceAddon,
  ServiceCategory,
  ServicePackage,
  ServiceSegment,
  ServiceSegmentType,
} from "../../lib/types/api";

type ServiceFormState = {
  name: string;
  slug: string;
  summary?: string;
  description?: string;
  isActive: boolean;
};

type SegmentFormState = {
  name: string;
  description?: string;
  type: ServiceSegmentType;
  displayOrder?: number;
};

type PackageFormState = {
  name: string;
  description?: string;
  audience?: AudienceType;
  basePrice?: string;
  priceUnit: PriceUnit;
  priceFrom: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  displayOrder?: number;
};

type AddonFormState = {
  name: string;
  description?: string;
  audience?: AudienceType;
  price?: string;
  priceUnit: PriceUnit;
  priceFrom: boolean;
  displayOrder?: number;
};

const defaultServiceForm: ServiceFormState = {
  name: "",
  slug: "",
  summary: "",
  description: "",
  isActive: true,
};

const defaultSegmentForm: SegmentFormState = {
  name: "",
  description: "",
  type: "GENERAL",
  displayOrder: 0,
};

const defaultPackageForm: PackageFormState = {
  name: "",
  description: "",
  audience: "UNIVERSAL",
  basePrice: "",
  priceUnit: "PER_JOB",
  priceFrom: true,
  minQuantity: undefined,
  maxQuantity: undefined,
  displayOrder: 0,
};

const defaultAddonForm: AddonFormState = {
  name: "",
  description: "",
  audience: "UNIVERSAL",
  price: "",
  priceUnit: "PER_JOB",
  priceFrom: true,
  displayOrder: 0,
};

const audienceOptions: AudienceType[] = [
  "UNIVERSAL",
  "RESIDENTIAL",
  "COMMERCIAL",
  "INDUSTRIAL",
];

const segmentTypeOptions: ServiceSegmentType[] = [
  "GENERAL",
  "RESIDENTIAL",
  "COMMERCIAL",
  "INDUSTRIAL",
  "SPECIALTY",
  "ADD_ON",
];

const priceUnitOptions: PriceUnit[] = [
  "PER_JOB",
  "PER_ROOM",
  "PER_WINDOW",
  "PER_PANEL",
  "PER_ITEM",
  "PER_SQUARE_METER",
  "PER_HOUR",
  "BY_QUOTE",
];

type ModalMode = "create" | "edit";

interface ServiceModalState {
  mode: ModalMode;
  service?: ServiceCategory;
}

interface SegmentModalState {
  mode: ModalMode;
  service: ServiceCategory;
  segment?: ServiceSegment;
}

interface PackageModalState {
  mode: ModalMode;
  service: ServiceCategory;
  segment?: ServiceSegment;
  pkg?: ServicePackage;
}

interface AddonModalState {
  mode: ModalMode;
  service: ServiceCategory;
  addon?: ServiceAddon;
}

const PricingManagement = () => {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [serviceForm, setServiceForm] =
    useState<ServiceFormState>(defaultServiceForm);
  const [segmentForm, setSegmentForm] =
    useState<SegmentFormState>(defaultSegmentForm);
  const [packageForm, setPackageForm] =
    useState<PackageFormState>(defaultPackageForm);
  const [addonForm, setAddonForm] =
    useState<AddonFormState>(defaultAddonForm);

  const [serviceModalState, setServiceModalState] =
    useState<ServiceModalState | null>(null);
  const [segmentModalState, setSegmentModalState] =
    useState<SegmentModalState | null>(null);
  const [packageModalState, setPackageModalState] =
    useState<PackageModalState | null>(null);
  const [addonModalState, setAddonModalState] =
    useState<AddonModalState | null>(null);

  const serviceModal = useDisclosure();
  const segmentModal = useDisclosure();
  const packageModal = useDisclosure();
  const addonModal = useDisclosure();

  const showToast = useToastNotification();

  const fetchServices = async () => {
    setLoading(true);
    const response = await Api.get<ApiResponse<ServiceCategory[]>>(
      urlConstants.services.list,
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Failed to load services",
        description:
          response.error ||
          response.data?.message ||
          "Unable to fetch services.",
        status: "error",
      });
    } else {
      setServices(response.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForms = () => {
    setServiceForm(defaultServiceForm);
    setSegmentForm(defaultSegmentForm);
    setPackageForm(defaultPackageForm);
    setAddonForm(defaultAddonForm);
  };

  const openCreateServiceModal = () => {
    resetForms();
    setServiceModalState({ mode: "create" });
    serviceModal.onOpen();
  };

  const openEditServiceModal = (service: ServiceCategory) => {
    setServiceForm({
      name: service.name,
      slug: service.slug,
      summary: service.summary ?? "",
      description: service.description ?? "",
      isActive: service.isActive,
    });
    setServiceModalState({ mode: "edit", service });
    serviceModal.onOpen();
  };

  const handleServiceSubmit = async () => {
    const payload = {
      name: serviceForm.name,
      slug: serviceForm.slug,
      summary: serviceForm.summary,
      description: serviceForm.description,
      isActive: serviceForm.isActive,
    };

    if (serviceModalState?.mode === "edit" && serviceModalState.service) {
      const response = await Api.patch<ApiResponse<ServiceCategory>>(
        urlConstants.services.update(serviceModalState.service.id),
        payload,
      );
      if (response.error || !response.data?.success) {
        showToast({
          title: "Update failed",
          description:
            response.error ||
            response.data?.message ||
            "Unable to update service.",
          status: "error",
        });
        return;
      }
      showToast({
        title: "Service updated",
        description: `${serviceForm.name} has been updated.`,
        status: "success",
      });
    } else {
      const response = await Api.post<ApiResponse<ServiceCategory>>(
        urlConstants.services.create,
        payload,
      );
      if (response.error || !response.data?.success) {
        showToast({
          title: "Create failed",
          description:
            response.error ||
            response.data?.message ||
            "Unable to create service.",
          status: "error",
        });
        return;
      }
      showToast({
        title: "Service created",
        description: `${serviceForm.name} has been added.`,
        status: "success",
      });
    }
    serviceModal.onClose();
    await fetchServices();
  };

  const handleDeleteService = async (service: ServiceCategory) => {
    const response = await Api.delete<ApiResponse<unknown>>(
      urlConstants.services.remove(service.id),
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Delete failed",
        description:
          response.error ||
          response.data?.message ||
          "Unable to delete service.",
        status: "error",
      });
      return;
    }
    showToast({
      title: "Service removed",
      description: `${service.name} has been deleted.`,
      status: "success",
    });
    await fetchServices();
  };

  const openSegmentModal = (
    service: ServiceCategory,
    segment?: ServiceSegment,
  ) => {
    if (segment) {
      setSegmentForm({
        name: segment.name,
        description: segment.description ?? "",
        type: segment.type,
        displayOrder: segment.displayOrder ?? 0,
      });
      setSegmentModalState({ mode: "edit", service, segment });
    } else {
      setSegmentForm(defaultSegmentForm);
      setSegmentModalState({ mode: "create", service });
    }
    segmentModal.onOpen();
  };

  const handleSegmentSubmit = async () => {
    if (!segmentModalState) return;
    const payload = {
      name: segmentForm.name,
      description: segmentForm.description,
      type: segmentForm.type,
      displayOrder: segmentForm.displayOrder,
    };

    if (segmentModalState.mode === "edit" && segmentModalState.segment) {
      const response = await Api.patch<ApiResponse<ServiceSegment>>(
        urlConstants.services.updateSegment(
          segmentModalState.service.id,
          segmentModalState.segment.id,
        ),
        payload,
      );
      if (response.error || !response.data?.success) {
        showToast({
          title: "Update failed",
          description:
            response.error ||
            response.data?.message ||
            "Unable to update segment.",
          status: "error",
        });
        return;
      }
      showToast({
        title: "Segment updated",
        description: `${segmentForm.name} was updated.`,
        status: "success",
      });
    } else {
      const response = await Api.post<ApiResponse<ServiceSegment>>(
        urlConstants.services.createSegment(segmentModalState.service.id),
        payload,
      );
      if (response.error || !response.data?.success) {
        showToast({
          title: "Create failed",
          description:
            response.error ||
            response.data?.message ||
            "Unable to create segment.",
          status: "error",
        });
        return;
      }
      showToast({
        title: "Segment created",
        description: `${segmentForm.name} was added.`,
        status: "success",
      });
    }
    segmentModal.onClose();
    await fetchServices();
  };

  const handleDeleteSegment = async (
    service: ServiceCategory,
    segment: ServiceSegment,
  ) => {
    const response = await Api.delete<ApiResponse<unknown>>(
      urlConstants.services.deleteSegment(service.id, segment.id),
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Delete failed",
        description:
          response.error ||
          response.data?.message ||
          "Unable to delete segment.",
        status: "error",
      });
      return;
    }
    showToast({
      title: "Segment removed",
      description: `${segment.name} was deleted.`,
      status: "success",
    });
    await fetchServices();
  };

  const openPackageModal = (
    service: ServiceCategory,
    segment?: ServiceSegment,
    pkg?: ServicePackage,
  ) => {
    if (pkg) {
      setPackageForm({
        name: pkg.name,
        description: pkg.description ?? "",
        audience: pkg.audience ?? "UNIVERSAL",
        basePrice:
          pkg.basePrice !== null && pkg.basePrice !== undefined
            ? String(pkg.basePrice)
            : "",
        priceUnit: pkg.priceUnit,
        priceFrom: pkg.priceFrom,
        minQuantity: pkg.minQuantity ?? undefined,
        maxQuantity: pkg.maxQuantity ?? undefined,
        displayOrder: pkg.displayOrder ?? 0,
      });
      setPackageModalState({ mode: "edit", service, segment, pkg });
    } else {
      setPackageForm(defaultPackageForm);
      setPackageModalState({ mode: "create", service, segment });
    }
    packageModal.onOpen();
  };

  const handlePackageSubmit = async () => {
    if (!packageModalState) return;
    const payload = {
      name: packageForm.name,
      description: packageForm.description,
      audience: packageForm.audience,
      basePrice:
        packageForm.basePrice && packageForm.basePrice.trim() !== ""
          ? Number(packageForm.basePrice)
          : undefined,
      priceUnit: packageForm.priceUnit,
      priceFrom: packageForm.priceFrom,
      minQuantity: packageForm.minQuantity,
      maxQuantity: packageForm.maxQuantity,
      displayOrder: packageForm.displayOrder,
      segmentId: packageModalState.segment?.id,
      segmentName: packageModalState.segment
        ? undefined
        : packageForm.name,
    };

    if (packageModalState.mode === "edit" && packageModalState.pkg) {
      const response = await Api.patch<ApiResponse<ServicePackage>>(
        urlConstants.services.updatePackage(
          packageModalState.service.id,
          packageModalState.pkg.id,
        ),
        payload,
      );
      if (response.error || !response.data?.success) {
        showToast({
          title: "Update failed",
          description:
            response.error ||
            response.data?.message ||
            "Unable to update package.",
          status: "error",
        });
        return;
      }
      showToast({
        title: "Package updated",
        description: `${packageForm.name} was updated.`,
        status: "success",
      });
    } else {
      const response = await Api.post<ApiResponse<ServicePackage>>(
        urlConstants.services.createPackage(packageModalState.service.id),
        { ...payload, segmentId: packageModalState.segment?.id },
      );
      if (response.error || !response.data?.success) {
        showToast({
          title: "Create failed",
          description:
            response.error ||
            response.data?.message ||
            "Unable to create package.",
          status: "error",
        });
        return;
      }
      showToast({
        title: "Package created",
        description: `${packageForm.name} was added.`,
        status: "success",
      });
    }
    packageModal.onClose();
    await fetchServices();
  };

  const handleDeletePackage = async (
    service: ServiceCategory,
    pkg: ServicePackage,
  ) => {
    const response = await Api.delete<ApiResponse<unknown>>(
      urlConstants.services.deletePackage(service.id, pkg.id),
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Delete failed",
        description:
          response.error ||
          response.data?.message ||
          "Unable to delete package.",
        status: "error",
      });
      return;
    }
    showToast({
      title: "Package removed",
      description: `${pkg.name} was deleted.`,
      status: "success",
    });
    await fetchServices();
  };

  const openAddonModal = (
    service: ServiceCategory,
    addon?: ServiceAddon,
  ) => {
    if (addon) {
      setAddonForm({
        name: addon.name,
        description: addon.description ?? "",
        audience: addon.audience ?? "UNIVERSAL",
        price:
          addon.price !== null && addon.price !== undefined
            ? String(addon.price)
            : "",
        priceUnit: addon.priceUnit,
        priceFrom: addon.priceFrom,
        displayOrder: addon.displayOrder ?? 0,
      });
      setAddonModalState({ mode: "edit", service, addon });
    } else {
      setAddonForm(defaultAddonForm);
      setAddonModalState({ mode: "create", service });
    }
    addonModal.onOpen();
  };

  const handleAddonSubmit = async () => {
    if (!addonModalState) return;
    const payload = {
      name: addonForm.name,
      description: addonForm.description,
      audience: addonForm.audience,
      price:
        addonForm.price && addonForm.price.trim() !== ""
          ? Number(addonForm.price)
          : undefined,
      priceUnit: addonForm.priceUnit,
      priceFrom: addonForm.priceFrom,
      displayOrder: addonForm.displayOrder,
    };

    if (addonModalState.mode === "edit" && addonModalState.addon) {
      const response = await Api.patch<ApiResponse<ServiceAddon>>(
        urlConstants.services.updateAddon(
          addonModalState.service.id,
          addonModalState.addon.id,
        ),
        payload,
      );
      if (response.error || !response.data?.success) {
        showToast({
          title: "Update failed",
          description:
            response.error ||
            response.data?.message ||
            "Unable to update add-on.",
          status: "error",
        });
        return;
      }
      showToast({
        title: "Add-on updated",
        description: `${addonForm.name} was updated.`,
        status: "success",
      });
    } else {
      const response = await Api.post<ApiResponse<ServiceAddon>>(
        urlConstants.services.createAddon(addonModalState.service.id),
        payload,
      );
      if (response.error || !response.data?.success) {
        showToast({
          title: "Create failed",
          description:
            response.error ||
            response.data?.message ||
            "Unable to create add-on.",
          status: "error",
        });
        return;
      }
      showToast({
        title: "Add-on created",
        description: `${addonForm.name} was added.`,
        status: "success",
      });
    }
    addonModal.onClose();
    await fetchServices();
  };

  const handleDeleteAddon = async (
    service: ServiceCategory,
    addon: ServiceAddon,
  ) => {
    const response = await Api.delete<ApiResponse<unknown>>(
      urlConstants.services.deleteAddon(service.id, addon.id),
    );
    if (response.error || !response.data?.success) {
      showToast({
        title: "Delete failed",
        description:
          response.error ||
          response.data?.message ||
          "Unable to delete add-on.",
        status: "error",
      });
      return;
    }
    showToast({
      title: "Add-on removed",
      description: `${addon.name} was deleted.`,
      status: "success",
    });
    await fetchServices();
  };

  const packagesBySegment = useMemo(() => {
    return services.reduce<Record<string, ServicePackage[]>>((acc, service) => {
      service.packages.forEach((pkg) => {
        const key = pkg.segmentId ?? `${service.id}-general`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(pkg);
      });
      return acc;
    }, {});
  }, [services]);

  return (
    <Page>
      <Flex align="center" justify="space-between" mb={6}>
        <Box>
          <Heading size="lg">Pricing Management</Heading>
          <Text color="gray.600">
            Configure service offerings, packages, and add-ons.
          </Text>
        </Box>
        <Button
          leftIcon={<MdAdd />}
          colorScheme="teal"
          onClick={openCreateServiceModal}
        >
          New Service
        </Button>
      </Flex>

      <Accordion allowMultiple defaultIndex={[0]}>
        {services.map((service) => (
          <AccordionItem key={service.id} borderWidth="1px" borderRadius="md">
            <AccordionButton px={5} py={4}>
              <Flex flex="1" textAlign="left" align="center" gap={3}>
                <Heading size="md">{service.name}</Heading>
                <Badge colorScheme={service.isActive ? "green" : "gray"}>
                  {service.isActive ? "Active" : "Inactive"}
                </Badge>
                {service.summary && (
                  <Text color="gray.500" noOfLines={1}>
                    {service.summary}
                  </Text>
                )}
              </Flex>
              <Wrap spacing={2} mr={4}>
                <WrapItem>
                  <Tooltip label="Add segment">
                    <IconButton
                      aria-label="Add segment"
                      size="sm"
                      icon={<MdLayers />}
                      onClick={(event) => {
                        event.stopPropagation();
                        openSegmentModal(service);
                      }}
                    />
                  </Tooltip>
                </WrapItem>
                <WrapItem>
                  <Tooltip label="Add package">
                    <IconButton
                      aria-label="Add package"
                      size="sm"
                      icon={<MdLibraryAdd />}
                      onClick={(event) => {
                        event.stopPropagation();
                        openPackageModal(service);
                      }}
                    />
                  </Tooltip>
                </WrapItem>
                <WrapItem>
                  <Tooltip label="Add add-on">
                    <IconButton
                      aria-label="Add add-on"
                      size="sm"
                      icon={<MdPlaylistAdd />}
                      onClick={(event) => {
                        event.stopPropagation();
                        openAddonModal(service);
                      }}
                    />
                  </Tooltip>
                </WrapItem>
                <WrapItem>
                  <Tooltip label="Edit service">
                    <IconButton
                      aria-label="Edit service"
                      size="sm"
                      icon={<MdEdit />}
                      onClick={(event) => {
                        event.stopPropagation();
                        openEditServiceModal(service);
                      }}
                    />
                  </Tooltip>
                </WrapItem>
                <WrapItem>
                  <Tooltip label="Delete service">
                    <IconButton
                      aria-label="Delete service"
                      size="sm"
                      colorScheme="red"
                      icon={<MdDelete />}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteService(service);
                      }}
                    />
                  </Tooltip>
                </WrapItem>
              </Wrap>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px={6} py={4}>
              {service.description && (
                <Text mb={4} color="gray.600">
                  {service.description}
                </Text>
              )}

              <Stack spacing={6}>
                {service.segments.length > 0 && (
                  <Box>
                    <Heading size="sm" mb={3}>
                      Segments & Packages
                    </Heading>
                    <Stack spacing={4}>
                      {service.segments.map((segment) => (
                        <Box
                          key={segment.id}
                          borderWidth="1px"
                          borderRadius="md"
                          p={4}
                        >
                          <Flex align="center" justify="space-between" mb={3}>
                            <Box>
                              <Flex align="center" gap={2}>
                                <Heading size="sm">{segment.name}</Heading>
                                <Badge>{segment.type}</Badge>
                              </Flex>
                              {segment.description && (
                                <Text color="gray.500">
                                  {segment.description}
                                </Text>
                              )}
                            </Box>
                            <Wrap spacing={2}>
                              <WrapItem>
                                <Button
                                  size="sm"
                                  leftIcon={<MdLibraryAdd />}
                                  onClick={() =>
                                    openPackageModal(service, segment)
                                  }
                                >
                                  Add package
                                </Button>
                              </WrapItem>
                              <WrapItem>
                                <IconButton
                                  aria-label="Edit segment"
                                  icon={<MdEdit />}
                                  size="sm"
                                  onClick={() =>
                                    openSegmentModal(service, segment)
                                  }
                                />
                              </WrapItem>
                              <WrapItem>
                                <IconButton
                                  aria-label="Delete segment"
                                  icon={<MdDelete />}
                                  size="sm"
                                  colorScheme="red"
                                  onClick={() =>
                                    handleDeleteSegment(service, segment)
                                  }
                                />
                              </WrapItem>
                            </Wrap>
                          </Flex>

                          <Divider mb={3} />

                          <Stack spacing={3}>
                            {(segment.packages ?? []).length === 0 && (
                              <Text color="gray.500">
                                No packages assigned to this segment yet.
                              </Text>
                            )}
                            {(segment.packages ?? []).map((pkg) => (
                              <Flex
                                key={pkg.id}
                                borderWidth="1px"
                                borderRadius="md"
                                p={3}
                                align="center"
                                justify="space-between"
                              >
                                <Box>
                                  <Heading size="sm">{pkg.name}</Heading>
                                  {pkg.description && (
                                    <Text color="gray.500">
                                      {pkg.description}
                                    </Text>
                                  )}
                                  <Wrap mt={1} spacing={2}>
                                    <Badge colorScheme="purple">
                                      {pkg.priceUnit.replace("_", " ")}
                                    </Badge>
                                    <Badge colorScheme="teal">
                                      {pkg.priceFrom ? "From" : "Fixed"}
                                    </Badge>
                                    {pkg.basePrice !== null &&
                                      pkg.basePrice !== undefined && (
                                        <Badge colorScheme="blue">
                                          ${pkg.basePrice}
                                        </Badge>
                                      )}
                                  </Wrap>
                                </Box>
                                <Wrap spacing={2}>
                                  <WrapItem>
                                    <IconButton
                                      aria-label="Edit package"
                                      icon={<MdEdit />}
                                      size="sm"
                                      onClick={() =>
                                        openPackageModal(
                                          service,
                                          segment,
                                          pkg,
                                        )
                                      }
                                    />
                                  </WrapItem>
                                  <WrapItem>
                                    <IconButton
                                      aria-label="Delete package"
                                      icon={<MdDelete />}
                                      size="sm"
                                      colorScheme="red"
                                      onClick={() =>
                                        handleDeletePackage(service, pkg)
                                      }
                                    />
                                  </WrapItem>
                                </Wrap>
                              </Flex>
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                <Box>
                  <Heading size="sm" mb={3}>
                    General Packages
                  </Heading>
                  <Stack spacing={3}>
                    {(packagesBySegment[`${service.id}-general`] ?? []).length ===
                    0 ? (
                      <Text color="gray.500">
                        No general packages for this service.
                      </Text>
                    ) : (
                      (packagesBySegment[`${service.id}-general`] ?? []).map(
                        (pkg) => (
                          <Flex
                            key={pkg.id}
                            borderWidth="1px"
                            borderRadius="md"
                            p={3}
                            align="center"
                            justify="space-between"
                          >
                            <Box>
                              <Heading size="sm">{pkg.name}</Heading>
                              {pkg.description && (
                                <Text color="gray.500">{pkg.description}</Text>
                              )}
                              <Wrap mt={1} spacing={2}>
                                <Badge colorScheme="purple">
                                  {pkg.priceUnit.replace("_", " ")}
                                </Badge>
                                <Badge colorScheme="teal">
                                  {pkg.priceFrom ? "From" : "Fixed"}
                                </Badge>
                                {pkg.basePrice !== null &&
                                  pkg.basePrice !== undefined && (
                                    <Badge colorScheme="blue">
                                      ${pkg.basePrice}
                                    </Badge>
                                  )}
                              </Wrap>
                            </Box>
                            <Wrap spacing={2}>
                              <WrapItem>
                                <IconButton
                                  aria-label="Edit package"
                                  icon={<MdEdit />}
                                  size="sm"
                                  onClick={() =>
                                    openPackageModal(service, undefined, pkg)
                                  }
                                />
                              </WrapItem>
                              <WrapItem>
                                <IconButton
                                  aria-label="Delete package"
                                  icon={<MdDelete />}
                                  size="sm"
                                  colorScheme="red"
                                  onClick={() =>
                                    handleDeletePackage(service, pkg)
                                  }
                                />
                              </WrapItem>
                            </Wrap>
                          </Flex>
                        ),
                      )
                    )}
                  </Stack>
                </Box>

                <Box>
                  <Heading size="sm" mb={3}>
                    Add-ons
                  </Heading>
                  <Stack spacing={3}>
                    {service.addOns.length === 0 ? (
                      <Text color="gray.500">
                        No add-ons configured for this service.
                      </Text>
                    ) : (
                      service.addOns.map((addon) => (
                        <Flex
                          key={addon.id}
                          borderWidth="1px"
                          borderRadius="md"
                          p={3}
                          align="center"
                          justify="space-between"
                        >
                          <Box>
                            <Heading size="sm">{addon.name}</Heading>
                            {addon.description && (
                              <Text color="gray.500">
                                {addon.description}
                              </Text>
                            )}
                            <Wrap mt={1} spacing={2}>
                              <Badge colorScheme="purple">
                                {addon.priceUnit.replace("_", " ")}
                              </Badge>
                              <Badge colorScheme="teal">
                                {addon.priceFrom ? "From" : "Fixed"}
                              </Badge>
                              {addon.price !== null &&
                                addon.price !== undefined && (
                                  <Badge colorScheme="blue">
                                    ${addon.price}
                                  </Badge>
                                )}
                            </Wrap>
                          </Box>
                          <Wrap spacing={2}>
                            <WrapItem>
                              <IconButton
                                aria-label="Edit add-on"
                                icon={<MdEdit />}
                                size="sm"
                                onClick={() => openAddonModal(service, addon)}
                              />
                            </WrapItem>
                            <WrapItem>
                              <IconButton
                                aria-label="Delete add-on"
                                icon={<MdDelete />}
                                size="sm"
                                colorScheme="red"
                                onClick={() =>
                                  handleDeleteAddon(service, addon)
                                }
                              />
                            </WrapItem>
                          </Wrap>
                        </Flex>
                      ))
                    )}
                  </Stack>
                </Box>
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        ))}
        {!loading && services.length === 0 && (
          <Box
            borderWidth="1px"
            borderRadius="md"
            p={6}
            textAlign="center"
            color="gray.500"
          >
            No services configured yet. Start by creating a service.
          </Box>
        )}
      </Accordion>

      {/* Service Modal */}
      <Modal
        isOpen={serviceModal.isOpen}
        onClose={serviceModal.onClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {serviceModalState?.mode === "edit"
              ? "Edit Service"
              : "Create Service"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Service name</FormLabel>
                <Input
                  value={serviceForm.name}
                  onChange={(event) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Slug</FormLabel>
                <Input
                  value={serviceForm.slug}
                  onChange={(event) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      slug: event.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Summary</FormLabel>
                <Input
                  value={serviceForm.summary}
                  onChange={(event) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      summary: event.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={serviceForm.description}
                  onChange={(event) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Active</FormLabel>
                <Switch
                  isChecked={serviceForm.isActive}
                  onChange={(event) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      isActive: event.target.checked,
                    }))
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={serviceModal.onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleServiceSubmit}>
              {serviceModalState?.mode === "edit" ? "Save changes" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Segment Modal */}
      <Modal
        isOpen={segmentModal.isOpen}
        onClose={segmentModal.onClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {segmentModalState?.mode === "edit"
              ? "Edit Segment"
              : "Add Segment"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Segment name</FormLabel>
                <Input
                  value={segmentForm.name}
                  onChange={(event) =>
                    setSegmentForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={segmentForm.description}
                  onChange={(event) =>
                    setSegmentForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Segment type</FormLabel>
                <Select
                  value={segmentForm.type}
                  onChange={(event) =>
                    setSegmentForm((prev) => ({
                      ...prev,
                      type: event.target.value as ServiceSegmentType,
                    }))
                  }
                >
                  {segmentTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.replace("_", " ")}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Display order</FormLabel>
                <NumberInput
                  value={segmentForm.displayOrder ?? 0}
                  onChange={(_, value) =>
                    setSegmentForm((prev) => ({
                      ...prev,
                      displayOrder: value,
                    }))
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={segmentModal.onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleSegmentSubmit}>
              {segmentModalState?.mode === "edit" ? "Save changes" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Package Modal */}
      <Modal
        isOpen={packageModal.isOpen}
        onClose={packageModal.onClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {packageModalState?.mode === "edit"
              ? "Edit Package"
              : "Add Package"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Package name</FormLabel>
                <Input
                  value={packageForm.name}
                  onChange={(event) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={packageForm.description}
                  onChange={(event) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Audience</FormLabel>
                <Select
                  value={packageForm.audience}
                  onChange={(event) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      audience: event.target.value as AudienceType,
                    }))
                  }
                >
                  {audienceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Base price</FormLabel>
                <NumberInput
                  value={packageForm.basePrice ?? ""}
                  onChange={(valueString) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      basePrice: valueString,
                    }))
                  }
                >
                  <NumberInputField placeholder="e.g. 199" />
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Price unit</FormLabel>
                <Select
                  value={packageForm.priceUnit}
                  onChange={(event) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      priceUnit: event.target.value as PriceUnit,
                    }))
                  }
                >
                  {priceUnitOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.replace("_", " ")}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Price is a starting value</FormLabel>
                <Switch
                  isChecked={packageForm.priceFrom}
                  onChange={(event) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      priceFrom: event.target.checked,
                    }))
                  }
                />
              </FormControl>
              <Flex gap={4}>
                <FormControl>
                  <FormLabel>Min quantity</FormLabel>
                  <NumberInput
                    value={packageForm.minQuantity ?? undefined}
                    onChange={(_, value) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        minQuantity: Number.isNaN(value) ? undefined : value,
                      }))
                    }
                  >
                    <NumberInputField placeholder="Optional" />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Max quantity</FormLabel>
                  <NumberInput
                    value={packageForm.maxQuantity ?? undefined}
                    onChange={(_, value) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        maxQuantity: Number.isNaN(value) ? undefined : value,
                      }))
                    }
                  >
                    <NumberInputField placeholder="Optional" />
                  </NumberInput>
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel>Display order</FormLabel>
                <NumberInput
                  value={packageForm.displayOrder ?? 0}
                  onChange={(_, value) =>
                    setPackageForm((prev) => ({
                      ...prev,
                      displayOrder: value,
                    }))
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={packageModal.onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handlePackageSubmit}>
              {packageModalState?.mode === "edit" ? "Save changes" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add-on Modal */}
      <Modal
        isOpen={addonModal.isOpen}
        onClose={addonModal.onClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {addonModalState?.mode === "edit" ? "Edit Add-on" : "Add Add-on"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Add-on name</FormLabel>
                <Input
                  value={addonForm.name}
                  onChange={(event) =>
                    setAddonForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={addonForm.description}
                  onChange={(event) =>
                    setAddonForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Audience</FormLabel>
                <Select
                  value={addonForm.audience}
                  onChange={(event) =>
                    setAddonForm((prev) => ({
                      ...prev,
                      audience: event.target.value as AudienceType,
                    }))
                  }
                >
                  {audienceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Price</FormLabel>
                <NumberInput
                  value={addonForm.price ?? ""}
                  onChange={(valueString) =>
                    setAddonForm((prev) => ({
                      ...prev,
                      price: valueString,
                    }))
                  }
                >
                  <NumberInputField placeholder="Optional" />
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Price unit</FormLabel>
                <Select
                  value={addonForm.priceUnit}
                  onChange={(event) =>
                    setAddonForm((prev) => ({
                      ...prev,
                      priceUnit: event.target.value as PriceUnit,
                    }))
                  }
                >
                  {priceUnitOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.replace("_", " ")}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Price is a starting value</FormLabel>
                <Switch
                  isChecked={addonForm.priceFrom}
                  onChange={(event) =>
                    setAddonForm((prev) => ({
                      ...prev,
                      priceFrom: event.target.checked,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Display order</FormLabel>
                <NumberInput
                  value={addonForm.displayOrder ?? 0}
                  onChange={(_, value) =>
                    setAddonForm((prev) => ({
                      ...prev,
                      displayOrder: value,
                    }))
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={addonModal.onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleAddonSubmit}>
              {addonModalState?.mode === "edit" ? "Save changes" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  );
};

export default PricingManagement;

