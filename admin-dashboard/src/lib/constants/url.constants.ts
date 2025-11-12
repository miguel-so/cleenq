const urlConstants = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
    verifyEmail: (token: string) => `/api/auth/verify-email/${token}`,
  },
  users: {
    getUsers: "/api/admin/users",
    updateUserStatus: (id: string) => `/api/admin/users/${id}/toggle-status`,
    deleteUser: (id: string) => `/api/admin/users/${id}`,
  },
  categories: {
    getCategories: "/api/categories",
    createCategory: "/api/categories",
    editCategory: (id: string) => `/api/categories/${id}`,
    deleteCategory: (id: string) => `/api/categories/${id}`,
  },
};

export default urlConstants;
