/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'axios/lib/cancel/Cancel' {
  import type {CancelStatic} from "axios";
  const cancel: CancelStatic;
  export default cancel
}
