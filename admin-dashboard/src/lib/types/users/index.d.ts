type User = {
  username: string;
  email: string;
  role?: number;
  id?: string;
  createdAt?: string;
  isActive?: boolean;
};

type GetUserResopnse = {
  users: User[];
  pagination: Pagination;
}