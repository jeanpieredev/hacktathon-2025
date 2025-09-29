import { builder } from '../builder';

// Definir el enum UserType
builder.enumType('UserType', {
  values: {
    NATURAL: { value: 'NATURAL' },
    LEGAL: { value: 'LEGAL' },
  },
});

builder.prismaObject('User', {
  fields: (t: any) => ({
    id: t.exposeInt('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email', { nullable: true }),
    type: t.exposeString('type'),
    phone: t.exposeString('phone', { nullable: true }),
    whatsapp: t.exposeString('whatsapp', { nullable: true }),
    // Campo temporal para el token (solo se usa en login)
    token: t.string({
      nullable: true,
      resolve: (parent: any) => parent.token || null,
    }),
  }),
});
