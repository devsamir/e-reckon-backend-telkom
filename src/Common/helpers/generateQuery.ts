import {
  Between,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

export const generateQuery = (query: GetAllQuery) => {
  // Relations
  const relationsModel = query?.include?.reduce(
    (acc, curr) => ({ ...acc, [curr]: true }),
    {},
  );

  // Sort
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

  // Domain
  const domain = query.domain.reduce((acc, curr) => {
    if (curr?.[0] && curr?.[1] && curr?.[2]) {
      if (curr[1] === 'like') {
        acc[curr[0]] = Like(`%${curr[2]}%`);
      } else if (curr[1] === 'gte' || curr[1] === 'lte') {
        const d = query.domain.filter((f) => f?.[0] === curr?.[0]);
        if (d.length === 2) {
          const isLteExist = d.find((i) => i?.[1] === 'lte');
          const isGteExist = d.find((i) => i?.[1] === 'gte');

          if (isLteExist && isGteExist) {
            acc[curr[0]] = Between(isGteExist?.[2], isLteExist?.[2]);
          }
        } else if (curr[1] === 'gte') {
          acc[curr[0]] = MoreThanOrEqual(curr[2]);
        } else if (curr[1] === 'lte') {
          acc[curr[0]] = LessThanOrEqual(curr[2]);
        }

        // lte
      } else if (curr[1] === 'in') {
        acc[curr[0]] = In(curr[2]);
      } else if (curr[1] === 'not in') {
        acc[curr[0]] = Not(In(curr[2]));
      } else {
        acc[curr[0]] = curr[2];
      }
    }

    return acc;
  }, {});

  return {
    where: domain,
    skip: query.offset,
    take: query.limit,
    order: sortQuery,
    select: query?.fields,
    ...(query?.include?.length ? { relations: relationsModel } : {}),
  } as any;
};
