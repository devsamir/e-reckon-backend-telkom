export const generateQuery = (query: GetAllQuery) => {
  const selectedFields = query?.fields?.reduce(
    (acc, curr) => ({ ...acc, [curr]: true }),
    {},
  );

  const includedModel = query?.include?.reduce(
    (acc, curr) => ({ ...acc, [curr]: true }),
    {},
  );

  return {
    where: query.domain,
    skip: query.offset,
    take: query.limit,
    orderBy: {
      [query.sort_by || 'id']: query.sort_direction || 'desc',
    },
    select: selectedFields,
    ...(query?.include?.length ? { include: includedModel } : {}),
  };
};
