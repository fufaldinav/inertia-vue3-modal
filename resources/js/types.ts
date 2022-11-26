import { ShallowRef } from 'vue';
import { CancelTokenSource } from 'axios';
import {
  GlobalEvent, GlobalEventResult, Page, VisitOptions,
} from '@inertiajs/inertia';

export interface VoidFunction {
  (): void;
}

export type Id = string

export interface ModalObj {
  id: string;
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
  close: () => void,
}

export interface ModalLoading {
  id: string;
  cancelToken: ShallowRef<CancelTokenSource | null>,
  loading: true,
  close: () => void,
}

export type ModalItem = ModalObj | ModalLoading

export type VisitModalOptions = VisitOptions & {
  redirectBack?: boolean | ((event: GlobalEvent<'success'>) => GlobalEventResult<'success'>),
  modalProps?: object,
  pageProps?: object,
  onClose?: (details: ModalObj) => void,
}

export type VisitInModalFn = `visitInModal${string}`;
