export const generateQuery = (query: GetAllQuery) => {
  const relationsModel = query?.include?.reduce(
    (acc, curr) => ({ ...acc, [curr]: true }),
    {},
  );
  const sort = query.sort?.split(' ');
  const sortValue = sort?.[1] || 'desc';
  const sortFields = sort?.[0]?.split('.') || ['id'];
  const sortQuery: any = {};
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
    order: sortQuery,
    select: query?.fields,
    ...(query?.include?.length ? { relations: relationsModel } : {}),
  } as any;
};
