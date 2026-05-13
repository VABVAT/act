export function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export function resolveImageUrl(value: string | null | undefined) {
  if (!value) {
    return "/catalog/ivory-meher-main.svg";
  }

  return value;
}
