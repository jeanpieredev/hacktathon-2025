import { builder } from '../builder';

// Definir el enum CertificateType
builder.enumType('CertificateType', {
  values: {
    GREEN_COMPANY: { value: 'GREEN_COMPANY' },
    SANITARY_APPROVED: { value: 'SANITARY_APPROVED' },
    FAIR_TRADE: { value: 'FAIR_TRADE' },
    OTHER: { value: 'OTHER' },
  },
});

// Definir el tipo CompanyCertificate
builder.prismaObject('CompanyCertificate', {
  fields: (t: any) => ({
    id: t.exposeInt('id'),
    type: t.exposeString('type'),
    issuedBy: t.exposeString('issuedBy', { nullable: true }),
    companyId: t.exposeInt('companyId'),
  }),
});

// Definir el tipo Company
builder.prismaObject('Company', {
  fields: (t: any) => ({
    id: t.exposeInt('id'),
    name: t.exposeString('name'),
    ruc: t.exposeString('ruc', { nullable: true }),
    description: t.exposeString('description', { nullable: true }),
    phone: t.exposeString('phone', { nullable: true }),
    whatsapp: t.exposeString('whatsapp', { nullable: true }),
    email: t.exposeString('email', { nullable: true }),
    
    
    // Relaciones
    ownerId: t.exposeInt('ownerId'),
    owner: t.relation('owner'),
    certificates: t.relation('certificates'),
  }),
});
