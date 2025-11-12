export type AudienceType =
  | "RESIDENTIAL"
  | "COMMERCIAL"
  | "INDUSTRIAL"
  | "UNIVERSAL";

export type ServiceSegmentType =
  | "RESIDENTIAL"
  | "COMMERCIAL"
  | "INDUSTRIAL"
  | "ADD_ON"
  | "SPECIALTY"
  | "GENERAL";

export type PriceUnit =
  | "PER_JOB"
  | "PER_SQUARE_METER"
  | "PER_ROOM"
  | "PER_WINDOW"
  | "PER_PANEL"
  | "PER_ITEM"
  | "PER_HOUR"
  | "BY_QUOTE";

export type BookingStatus =
  | "PENDING"
  | "QUOTED"
  | "CONFIRMED"
  | "SCHEDULED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type AssignmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

export interface PaginationMeta {
  total: number;
  limit: number;
  cursor: string | null;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  description?: string | null;
  audience?: AudienceType | null;
  price?: string | number | null;
  priceUnit: PriceUnit;
  priceFrom: boolean;
  metadata?: Record<string, unknown> | null;
  isActive: boolean;
  displayOrder: number;
}

export interface ServicePackage {
  id: string;
  name: string;
  description?: string | null;
  audience?: AudienceType | null;
  basePrice?: string | number | null;
  priceUnit: PriceUnit;
  priceFrom: boolean;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  metadata?: Record<string, unknown> | null;
  isActive: boolean;
  displayOrder: number;
  segmentId?: string | null;
  segment?: {
    id: string;
    name: string;
    type: ServiceSegmentType;
  } | null;
}

export interface ServiceSegment {
  id: string;
  name: string;
  description?: string | null;
  type: ServiceSegmentType;
  displayOrder: number;
  packages?: ServicePackage[];
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  summary?: string | null;
  description?: string | null;
  isActive: boolean;
  segments: ServiceSegment[];
  packages: ServicePackage[];
  addOns: ServiceAddon[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  tierLevel: number;
  minPoints: number;
  maxPoints?: number | null;
  discountPercent: number;
  monthlyFee?: string | number | null;
  annualFee?: string | number | null;
  perks?: string[];
  isActive: boolean;
}

export interface CustomerSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  rewardPoints?: number;
  memberships?: Array<{
    id: string;
    status: string;
    membershipPlan: MembershipPlan;
    startedAt: string;
    expiresAt?: string | null;
  }>;
}

export interface CustomerMembership {
  id: string;
  customerId: string;
  membershipPlanId: string;
  status: string;
  startedAt: string;
  expiresAt?: string | null;
  autoRenew: boolean;
  notes?: string | null;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  membershipPlan: MembershipPlan;
}

export interface Cleaner {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  notes?: string | null;
}

export interface BookingItem {
  id: string;
  servicePackageId: string;
  quantity: number;
  unitPrice: string | number;
  discount: string | number;
  total: string | number;
  servicePackage?: ServicePackage;
}

export interface BookingAddon {
  id: string;
  serviceAddonId: string;
  quantity: number;
  unitPrice: string | number;
  total: string | number;
  serviceAddon?: ServiceAddon;
}

export interface Booking {
  id: string;
  reference: string;
  status: BookingStatus;
  scheduledAt?: string | null;
  requestedAt: string;
  subtotal: string | number;
  discount: string | number;
  tax: string | number;
  total: string | number;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
  };
  serviceCategory?: {
    id: string;
    name: string;
    slug: string;
  };
  membershipPlan?: MembershipPlan | null;
  items: BookingItem[];
  addOns: BookingAddon[];
  cleanerAssignments: Array<{
    id: string;
    status: AssignmentStatus;
    cleaner?: Cleaner;
  }>;
}

export interface RewardSettings {
  id: number;
  pointsPerDollar: number;
  redemptionThreshold: number;
  redemptionValue: string | number;
  note?: string | null;
}

export interface RewardTransaction {
  id: string;
  customerId: string;
  bookingId?: string | null;
  processedByAdminId?: string | null;
  points: number;
  type: "EARN" | "REDEEM" | "ADJUSTMENT" | "EXPIRY";
  description?: string | null;
  createdAt: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  booking?: {
    id: string;
    reference: string;
    status: BookingStatus;
  };
  processedByAdmin?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface AnalyticsOverview {
  metrics: {
    bookings: {
      total: number;
      pending: number;
      confirmed: number;
      scheduled: number;
      inProgress: number;
      completed: number;
      cancelled: number;
    };
    revenue: number;
    customers: number;
    cleaners: number;
    activeServices: number;
  };
  recentBookings: Booking[];
  topServices: Array<{
    service?: {
      id: string;
      name: string;
      slug: string;
    };
    totalBookings: number;
  }>;
}

