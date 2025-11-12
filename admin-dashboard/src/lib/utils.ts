export const categoriesToSelectOptionsMapper = (
  categories: Category[]
): SelectOption[] =>
  categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));
