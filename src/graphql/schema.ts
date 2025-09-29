import { builder } from './builder';

// Importa los tipos
import './types/User';

// Importa queries y mutations (módulos)
import './queries/user';
import './mutations/user';

// Importa queries y mutations
import './root';

export const schema = builder.toSchema();
