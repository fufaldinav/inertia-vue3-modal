import * as vue from 'vue'
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

import * as router from "@inertiajs/inertia/types/router";
import { VisitInModalFn, VisitModalOptions } from './js/types';
declare module '@inertiajs/inertia/types/router' {
  export interface Router {
    [key: VisitInModalFn]: (url: string, options?: VisitModalOptions) => void
  }
}
