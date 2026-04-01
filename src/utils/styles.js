// similar a clsx, si mi proyecto tiene react antiguo y no tiene el paquete clsx entonces puedo usar este
export function clsx(...args) {
  return args
    .flatMap((arg) => {
      if (!arg) return [];

      if (typeof arg === "string") {
        return [arg];
      }

      if (Array.isArray(arg)) {
        return arg.filter(Boolean);
      }

      if (typeof arg === "object") {
        return Object.entries(arg)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key);
      }

      return [];
    })
    .join(" ");
}
