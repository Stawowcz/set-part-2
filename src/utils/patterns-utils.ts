export const suspiciousPatterns = [
  "test\\.",
  "test\\(",
  "function",
  "=>",
  "allTheThings",
  "eval",
  "console\\.",
  "document\\.",
  "\\{\\}",
  "\\(\\);",
] as const;

export type SuspiciousPattern = typeof suspiciousPatterns[number];


export const forbiddenCssClasses = [
  "btn_inventory_misaligned",
  "btn_hidden",
  "btn_stretched",
  "btn_offset_x",
  "btn_offset_y",
  "align_right",
  "align_left",
] as const;

export type ForbiddenCssClass = typeof forbiddenCssClasses[number];
