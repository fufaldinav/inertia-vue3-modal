import { GlobalEventDetails, GlobalEventNames, GlobalEventTrigger } from '@inertiajs/inertia';

function fireEvent<TEventName extends GlobalEventNames>(
  name: TEventName,
  options: CustomEventInit<GlobalEventDetails<TEventName>>,
): boolean {
  return document.dispatchEvent(new CustomEvent(`inertia:${name}`, options));
}

export const fireErrorEvent: GlobalEventTrigger<'error'> = (errors) => fireEvent(
  'error',
  { detail: { errors } },
);

export const fireSuccessEvent: GlobalEventTrigger<'success'> = (page) => fireEvent(
  'success',
  { detail: { page } },
);
