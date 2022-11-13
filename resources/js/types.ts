import { ShallowRef } from 'vue';
import { CancelTokenSource } from 'axios';
import { Page } from '@inertiajs/inertia';

export interface VoidFunction {
  (): void;
}

export type Id = string

export interface ModalObj {
  loading: false,
  component: unknown,
  removeBeforeEventListener: VoidFunction,
  removeSuccessEventListener?: VoidFunction,
  cancelToken: ShallowRef<CancelTokenSource | null>,
  interceptor: number,
  page: Page,
  onClose?: (details: ModalObj) => void,
  props: object,
  pageProps: object,
  close: (id: Id) => void,
}

export interface ModalLoading {
  cancelToken: ShallowRef<CancelTokenSource | null>,
  loading: true,
  close: (id: Id) => void,
}

export type ModalItem = ModalObj | ModalLoading
