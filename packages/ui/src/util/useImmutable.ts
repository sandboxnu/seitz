import { computed } from "vue";

export default function useImmutable<T>(thing: T) {
  return computed({
    get: () => thing,
    set: () => {},
  });
}
