import { createBEM } from './bem';
import { createComponent } from './component';
import { createI18N } from './i18n';
export function createNamespace(name) {
  name = 'vcmp-' + name;
  return [createComponent(name), createBEM(name), createI18N(name)];
}