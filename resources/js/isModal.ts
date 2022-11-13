import { inject } from 'vue';
import { injectIsModal } from './symbols';
import { ModalItem } from './types';

export default (): false | ModalItem => inject(injectIsModal, false);
