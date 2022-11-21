import { usePage } from '@inertiajs/inertia-vue3';
import { computed } from 'vue';
import isModal from './isModal';

export default () => {
  const modal = isModal();
  const parent = usePage();
  if (modal) {
    return {
      isModal: true,
      parent,
      props: computed(() => (modal && !modal.loading ? modal.page.props : {})),
      url: computed(() => modal && !modal.loading && modal.page.url),
      component: computed(() => modal && !modal.loading && modal.page.component),
      version: computed(() => modal && !modal.loading && modal.page.version),
    };
  }
  return parent;
};
