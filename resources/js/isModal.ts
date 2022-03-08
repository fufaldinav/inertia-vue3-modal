import { inject } from 'vue';
import { injectIsModal } from './symbols';
import { ModalRef } from './types';

export default (): false | ModalRef => inject(injectIsModal, false);
