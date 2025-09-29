import { builder } from '../builder';
import { db } from '../../db/config';

builder.queryField('users', t =>
  t.prismaField({
    type: ['User'],
    resolve: query => db.user.findMany({ ...query }),
  })
);

builder.queryField('user', t =>
  t.prismaField({
    type: 'User',
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: (query, _root, args) =>
      db.user.findUnique({ ...query, where: { id: args.id } }),
  })
);
