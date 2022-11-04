export const generateQuery = (query: GetAllQuery) => {
  const selectedFields = query?.fields?.reduce(
    (acc, curr) => ({ ...acc, [curr]: true }),
    {},
  );

  const includedModel = query?.include?.reduce(
    (acc, curr) => ({ ...acc, [curr]: true }),
    {},
  );

  const sort = query?.sort?.split(' ');
  return {
    where: query.domain,
    skip: query.offset,
    take: query.limit,
    orderBy: {
      [sort?.[0] || 'id']: sort?.[1] || 'desc',
    },
    select: selectedFields,
    ...(query?.include?.length ? { include: includedModel } : {}),
  };
};
