import { builder } from '../builder';
import { db } from '../../db/config';
import { requireAuth } from '../../auth/middleware';

// Query para obtener todas las empresas
builder.queryField('companies', t =>
  t.prismaField({
    type: ['Company'],
    resolve: query => db.company.findMany({ ...query }),
  })
);

// Query para obtener una empresa por ID
builder.queryField('company', t =>
  t.prismaField({
    type: 'Company',
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: (query, _root, args) =>
      db.company.findUnique({ ...query, where: { id: args.id } }),
  })
);

// Query para obtener empresas del usuario autenticado
builder.queryField('myCompanies', t =>
  t.prismaField({
    type: ['Company'],
    resolve: (query, _root, _args, context) => {
      // Requerir autenticación
      const user = requireAuth(context);
      
      return db.company.findMany({ 
        ...query, 
        where: { ownerId: user.id } 
      });
    },
  })
);

// Query para obtener empresas por propietario (público, pero limitado)
builder.queryField('companiesByOwner', t =>
  t.prismaField({
    type: ['Company'],
    args: {
      ownerId: t.arg.int({ required: true }),
    },
    resolve: (query, _root, args) =>
      db.company.findMany({ 
        ...query, 
        where: { ownerId: args.ownerId },
        select: {
          id: true,
          name: true,
          description: true,
          phone: true,
          whatsapp: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          certificates: true,
          // No exponer ownerId por privacidad
        }
      }),
  })
);

// Query para buscar empresas por nombre
builder.queryField('searchCompanies', t =>
  t.prismaField({
    type: ['Company'],
    args: {
      searchTerm: t.arg.string({ required: true }),
    },
    resolve: (query, _root, args) =>
      db.company.findMany({
        ...query,
        where: {
          name: {
            contains: args.searchTerm,
            mode: 'insensitive',
          },
        },
      }),
  })
);

// Query para obtener empresa por RUC
builder.queryField('companyByRuc', t =>
  t.prismaField({
    type: 'Company',
    args: {
      ruc: t.arg.string({ required: true }),
    },
    resolve: (query, _root, args) =>
      db.company.findUnique({ ...query, where: { ruc: args.ruc } }),
  })
);
