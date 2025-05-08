//custom API hook

import { computed } from "vue";

export default function useImmutable<T>(getter: () => T) {
  return computed({
    get: getter,
    set: () => {},
  });
}
