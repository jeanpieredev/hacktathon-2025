import { builder } from './builder';

// Importa los tipos
import './types/User';
import './types/Company';

// Importa queries y mutations (módulos)
import './queries/user';
import './queries/company';
import './mutations/user';
import './mutations/company';

// Importa queries y mutations
import './root';

export const schema = builder.toSchema();
