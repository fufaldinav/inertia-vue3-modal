import { ShallowRef } from 'vue';
import { CancelTokenSource } from 'axios';
import { Page } from '@inertiajs/inertia';

export interface VoidFunction {
  (): void;
}

export interface ModalObj {
  loading: false,
  component: unknown,
  removeBeforeEventListener: VoidFunction,
  removeSuccessEventListener?: VoidFunction,
  cancelToken: ShallowRef<CancelTokenSource | null>,
  interceptor: number,
  page: Page,
  props: object,
  pageProps: object,
  close: VoidFunction,
}

export interface ModalLoading {
  cancelToken: ShallowRef<CancelTokenSource | null>,
  loading: true,
}

export type ModalRef = ShallowRef<null | ModalObj | ModalLoading>
