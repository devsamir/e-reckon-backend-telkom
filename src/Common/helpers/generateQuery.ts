export const generateQuery = (query: GetAllQuery) => {
  const selectedFields = query?.fields?.reduce(
    (acc, curr) => ({ ...acc, [curr]: true }),
    {},
  );

  const includedModel = query?.include?.reduce(
    (acc, curr) => ({ ...acc, [curr]: true }),
    {},
  );
  const sort = query.sort?.split(' ');
  const sortValue = sort?.[1] || 'desc';
  const sortFields = sort?.[0]?.split('.') || ['id'];
  const sortQuery = {};
  sortFields.reduce((acc, curr, idx) => {
    if (idx < sortFields.length - 1) {
      acc[curr] = {};
    } else {
      acc[curr] = sortValue;
    }
    return acc[curr];
  }, sortQuery);

  return {
    where: query.domain,
    skip: query.offset,
    take: query.limit,
    orderBy: sortQuery,
    select: selectedFields,
    ...(query?.include?.length ? { include: includedModel } : {}),
  };
};
