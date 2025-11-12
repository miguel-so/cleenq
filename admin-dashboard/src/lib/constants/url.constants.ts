const urlConstants = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
    verifyEmail: (token: string) => `/api/auth/verify-email/${token}`,
    me: "/api/auth/me",
  },
  services: {
    list: "/api/services",
    create: "/api/services",
    update: (serviceId: string) => `/api/services/${serviceId}`,
    remove: (serviceId: string) => `/api/services/${serviceId}`,
    createSegment: (serviceId: string) => `/api/services/${serviceId}/segments`,
    updateSegment: (serviceId: string, segmentId: string) =>
      `/api/services/${serviceId}/segments/${segmentId}`,
    deleteSegment: (serviceId: string, segmentId: string) =>
      `/api/services/${serviceId}/segments/${segmentId}`,
    createPackage: (serviceId: string) => `/api/services/${serviceId}/packages`,
    updatePackage: (serviceId: string, packageId: string) =>
      `/api/services/${serviceId}/packages/${packageId}`,
    deletePackage: (serviceId: string, packageId: string) =>
      `/api/services/${serviceId}/packages/${packageId}`,
    createAddon: (serviceId: string) => `/api/services/${serviceId}/addons`,
    updateAddon: (serviceId: string, addonId: string) =>
      `/api/services/${serviceId}/addons/${addonId}`,
    deleteAddon: (serviceId: string, addonId: string) =>
      `/api/services/${serviceId}/addons/${addonId}`,
  },
  memberships: {
    plans: "/api/memberships/plans",
    plan: (planId: string) => `/api/memberships/plans/${planId}`,
    members: "/api/memberships/members",
    member: (membershipId: string) => `/api/memberships/members/${membershipId}`,
  },
  rewards: {
    settings: "/api/rewards/settings",
    updateSettings: "/api/rewards/settings",
    transactions: "/api/rewards/transactions",
    adjust: "/api/rewards/adjustments",
    customerSummary: (customerId: string) =>
      `/api/rewards/customers/${customerId}/summary`,
  },
  bookings: {
    list: "/api/bookings",
    create: "/api/bookings",
    update: (bookingId: string) => `/api/bookings/${bookingId}`,
    updateStatus: (bookingId: string) => `/api/bookings/${bookingId}/status`,
    assignCleaner: (bookingId: string) =>
      `/api/bookings/${bookingId}/assignments`,
    updateAssignment: (bookingId: string, assignmentId: string) =>
      `/api/bookings/${bookingId}/assignments/${assignmentId}`,
    summary: (bookingId: string) => `/api/bookings/${bookingId}/summary`,
  },
  cleaners: {
    list: "/api/cleaners",
    create: "/api/cleaners",
    update: (cleanerId: string) => `/api/cleaners/${cleanerId}`,
    remove: (cleanerId: string) => `/api/cleaners/${cleanerId}`,
  },
  customers: {
    list: "/api/customers",
    create: "/api/customers",
    update: (customerId: string) => `/api/customers/${customerId}`,
    remove: (customerId: string) => `/api/customers/${customerId}`,
    detail: (customerId: string) => `/api/customers/${customerId}`,
  },
  users: {
    getUsers: "/api/users",
    updateUserStatus: (userId: string) => `/api/users/${userId}/status`,
    deleteUser: (userId: string) => `/api/users/${userId}`,
  },
  categories: {
    createCategory: "/api/categories",
    getCategories: "/api/categories",
    editCategory: (categoryId: string) => `/api/categories/${categoryId}`,
    deleteCategory: (categoryId: string) => `/api/categories/${categoryId}`,
  },
  analytics: {
    overview: "/api/analytics/overview",
  },
};

export default urlConstants;
