import { useMemo, useReducer } from "react";

function toggle(curValue, newValue) {
  return typeof newValue === "boolean" ? newValue : !curValue;
}

export function useToggle(initialValue = false) {
  return useReducer(toggle, initialValue);
}

export function useBoolean(initialValue = false) {
  const [value, toggle] = useToggle(initialValue);
  const handlers = useMemo(
    () => ({
      toggle,
      on: () => toggle(true),
      off: () => toggle(false),
    }),
    [toggle]
  );
  return [value, handlers];
}
