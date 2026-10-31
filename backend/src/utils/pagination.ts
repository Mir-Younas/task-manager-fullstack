export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const getPaginationSkip = ({
  page,
  limit,
}: PaginationParams): number => {
  return (page - 1) * limit;
};

export const getPaginationMeta = (
  total: number,
  { page, limit }: PaginationParams,
): PaginationMeta => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};
