import { builder } from '../builder';
import { db } from '../../db/config';
import { requireAuth } from '../../auth/middleware';

// Mutación para crear una nueva empresa
builder.mutationField('createCompany', t =>
  t.prismaField({
    type: 'Company',
    args: {
      name: t.arg.string({ required: true }),
      ruc: t.arg.string(),
      description: t.arg.string(),
      phone: t.arg.string(),
      whatsapp: t.arg.string(),
      email: t.arg.string(),
    },
    resolve: async (query, _, args, context) => {
      try {
        // Requerir autenticación
        const user = requireAuth(context);

        // Verificar que el RUC no esté en uso (si se proporciona)
        if (args.ruc) {
          const existingCompany = await db.company.findUnique({
            where: { ruc: args.ruc },
          });

          if (existingCompany) {
            throw new Error('El RUC ya está registrado');
          }
        }

        // Crear la empresa
        const company = await db.company.create({
          ...query,
          data: {
            name: args.name,
            ruc: args.ruc || null,
            description: args.description || null,
            phone: args.phone || null,
            whatsapp: args.whatsapp || null,
            email: args.email || null,
            ownerId: user.id, // Usar el ID del usuario autenticado
          },
        });

        return company;
      } catch (error) {
        console.error('Error al crear empresa:', error);
        throw new Error('Error al crear empresa');
      }
    },
  })
);

// Mutación para actualizar una empresa
builder.mutationField('updateCompany', t =>
  t.prismaField({
    type: 'Company',
    args: {
      id: t.arg.int({ required: true }),
      name: t.arg.string(),
      ruc: t.arg.string(),
      description: t.arg.string(),
      phone: t.arg.string(),
      whatsapp: t.arg.string(),
      email: t.arg.string(),
    },
    resolve: async (query, _, args, context) => {
      try {
        // Requerir autenticación
        const user = requireAuth(context);

        // Verificar que la empresa existe y pertenece al usuario
        const existingCompany = await db.company.findUnique({
          where: { id: args.id },
        });

        if (!existingCompany) {
          throw new Error('La empresa no existe');
        }

        // Verificar que el usuario es el propietario
        if (existingCompany.ownerId !== user.id) {
          throw new Error('No tienes permisos para actualizar esta empresa');
        }

        // Verificar que el RUC no esté en uso por otra empresa (si se proporciona)
        if (args.ruc && args.ruc !== existingCompany.ruc) {
          const companyWithRuc = await db.company.findUnique({
            where: { ruc: args.ruc },
          });

          if (companyWithRuc) {
            throw new Error('El RUC ya está registrado por otra empresa');
          }
        }

        // Actualizar la empresa
        const company = await db.company.update({
          ...query,
          where: { id: args.id },
          data: {
            ...(args.name && { name: args.name }),
            ...(args.ruc !== undefined && { ruc: args.ruc || null }),
            ...(args.description !== undefined && { description: args.description || null }),
            ...(args.phone !== undefined && { phone: args.phone || null }),
            ...(args.whatsapp !== undefined && { whatsapp: args.whatsapp || null }),
            ...(args.email !== undefined && { email: args.email || null }),
          },
        });

        return company;
      } catch (error) {
        console.error('Error al actualizar empresa:', error);
        throw new Error('Error al actualizar empresa');
      }
    },
  })
);

// Mutación para eliminar una empresa
builder.mutationField('deleteCompany', t =>
  t.prismaField({
    type: 'Company',
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (query, _, args, context) => {
      try {
        // Requerir autenticación
        const user = requireAuth(context);

        // Verificar que la empresa existe y pertenece al usuario
        const existingCompany = await db.company.findUnique({
          where: { id: args.id },
        });

        if (!existingCompany) {
          throw new Error('La empresa no existe');
        }

        // Verificar que el usuario es el propietario
        if (existingCompany.ownerId !== user.id) {
          throw new Error('No tienes permisos para eliminar esta empresa');
        }

        // Eliminar la empresa
        const company = await db.company.delete({
          ...query,
          where: { id: args.id },
        });

        return company;
      } catch (error) {
        console.error('Error al eliminar empresa:', error);
        throw new Error('Error al eliminar empresa');
      }
    },
  })
);

// Mutación para agregar certificado a una empresa
builder.mutationField('addCompanyCertificate', t =>
  t.prismaField({
    type: 'CompanyCertificate',
    args: {
      companyId: t.arg.int({ required: true }),
      type: t.arg.string({ required: true }),
      issuedBy: t.arg.string(),
    },
    resolve: async (query, _, args, context) => {
      try {
        // Requerir autenticación
        const user = requireAuth(context);

        // Verificar que la empresa existe y pertenece al usuario
        const company = await db.company.findUnique({
          where: { id: args.companyId },
        });

        if (!company) {
          throw new Error('La empresa no existe');
        }

        // Verificar que el usuario es el propietario
        if (company.ownerId !== user.id) {
          throw new Error('No tienes permisos para agregar certificados a esta empresa');
        }

        // Validar el tipo de certificado
        const validTypes = ['GREEN_COMPANY', 'SANITARY_APPROVED', 'FAIR_TRADE', 'OTHER'];
        if (!validTypes.includes(args.type)) {
          throw new Error('Tipo de certificado inválido');
        }

        // Crear el certificado
        const certificate = await db.companyCertificate.create({
          ...query,
          data: {
            companyId: args.companyId,
            type: args.type as any,
            issuedBy: args.issuedBy || null,
          },
        });

        return certificate;
      } catch (error) {
        console.error('Error al agregar certificado:', error);
        throw new Error('Error al agregar certificado');
      }
    },
  })
);

// Mutación para eliminar certificado de una empresa
builder.mutationField('removeCompanyCertificate', t =>
  t.prismaField({
    type: 'CompanyCertificate',
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (query, _, args, context) => {
      try {
        // Requerir autenticación
        const user = requireAuth(context);

        // Verificar que el certificado existe y pertenece a una empresa del usuario
        const existingCertificate = await db.companyCertificate.findUnique({
          where: { id: args.id },
          include: { company: true },
        });

        if (!existingCertificate) {
          throw new Error('El certificado no existe');
        }

        // Verificar que el usuario es el propietario de la empresa
        if (existingCertificate.company.ownerId !== user.id) {
          throw new Error('No tienes permisos para eliminar este certificado');
        }

        // Eliminar el certificado
        const certificate = await db.companyCertificate.delete({
          ...query,
          where: { id: args.id },
        });

        return certificate;
      } catch (error) {
        console.error('Error al eliminar certificado:', error);
        throw new Error('Error al eliminar certificado');
      }
    },
  })
);
