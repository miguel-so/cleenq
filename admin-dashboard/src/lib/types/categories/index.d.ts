type Category = {
  name: string;
  description: string;
  id: string;
};

type GetCategoriesResopnse = {
  categories: Category[];
  pagination: Pagination;
};
