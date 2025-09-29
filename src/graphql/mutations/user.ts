import { builder } from '../builder';
import { db } from '../../db/config';
import { AuthUtils } from '../../auth/utils';

// Mutación para registrar un nuevo usuario
builder.mutationField('registerUser', t =>
  t.prismaField({
    type: 'User',
    args: {
      name: t.arg.string({ required: true }),
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
      type: t.arg.string({ defaultValue: 'NATURAL' }),
      phone: t.arg.string(),
      whatsapp: t.arg.string(),
    },
    resolve: async (query, _, args) => {
      try {
        // Verificar si el email ya existe
        const existingAuth = await db.auth.findUnique({
          where: { email: args.email },
        });

        if (existingAuth) {
          throw new Error('El email ya está registrado');
        }

        // Hash de la contraseña
        const hashedPassword = await AuthUtils.hashPassword(args.password);

        // Crear el usuario y la autenticación en una transacción
        const result = await db.$transaction(async tx => {
          // Crear el registro de autenticación
          const auth = await tx.auth.create({
            data: {
              provider: 'CREDENTIALS',
              email: args.email,
              password: hashedPassword,
            },
          });

          // Crear el usuario
          const user = await tx.user.create({
            data: {
              name: args.name,
              email: args.email,
              type: (args.type as 'NATURAL' | 'LEGAL') || 'NATURAL',
              phone: args.phone || null,
              whatsapp: args.whatsapp || null,
              authId: auth.id,
            },
            ...query,
          });

          return user;
        });

        return result;
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw new Error('Error al registrar usuario');
      }
    },
  })
);

// Mutación para login de usuario que devuelve usuario y token
builder.mutationField('loginUser', t =>
  t.prismaField({
    type: 'User',
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (query, _, args) => {
      try {
        // Buscar el usuario por email
        const auth = await db.auth.findUnique({
          where: { email: args.email },
          include: {
            user: true,
          },
        });

        if (!auth || !auth.user) {
          throw new Error('Credenciales inválidas');
        }

        // Verificar la contraseña
        if (!auth.password) {
          throw new Error('Credenciales inválidas');
        }

        const isValidPassword = await AuthUtils.comparePassword(
          args.password,
          auth.password
        );

        if (!isValidPassword) {
          throw new Error('Credenciales inválidas');
        }

        // Generar token JWT solo después de validar credenciales
        const token = AuthUtils.generateToken(auth.user);

        // Agregar el token al objeto usuario para que esté disponible en la respuesta
        const userWithToken = {
          ...auth.user,
          token: token,
        };

        return userWithToken;
      } catch (error) {
        console.error('Error al hacer login:', error);
        throw new Error('Error al hacer login');
      }
    },
  })
);

// NOTA: La mutación generateToken fue eliminada por razones de seguridad
// Los tokens solo deben generarse durante el login exitoso

// Mutación simple para crear usuario (mantener compatibilidad)
builder.mutationField('createUser', t =>
  t.prismaField({
    type: 'User',
    args: {
      name: t.arg.string({ required: true }),
      email: t.arg.string(),
      type: t.arg.string({ defaultValue: 'NATURAL' }),
      phone: t.arg.string(),
      whatsapp: t.arg.string(),
    },
    resolve: (query, _root, args) =>
      db.user.create({
        ...query,
        data: {
          name: args.name,
          email: args.email ?? null,
          type: (args.type as 'NATURAL' | 'LEGAL') || 'NATURAL',
          phone: args.phone ?? null,
          whatsapp: args.whatsapp ?? null,
        },
      }),
  })
);
