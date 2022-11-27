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
  parentId: string | null;
  url: string;
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
  parentId: string | null;
  url: string;
  cancelToken: ShallowRef<CancelTokenSource | null>,
  loading: true,
  close: () => void,
}

export type ModalItem = ModalObj | ModalLoading

export type VisitModalOptions = VisitOptions & {
  onRedirect?: (event: GlobalEvent<'success'>) => GlobalEventResult<'success'>,
  modalProps?: object,
  pageProps?: object,
  onClose?: (details: ModalObj) => void,
  closeOnSave?: boolean,
}

export type VisitInModalFn = `visitInModal${string}`;

export interface LastPage extends Omit<Page, 'url'> {
  url: URL
}
