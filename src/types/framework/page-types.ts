export type GotoOptions = {
  timeout?: number;
  waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
};

export type LocatorWaitOptions = {
  timeout?: number;
  state?: "attached" | "detached" | "visible" | "hidden";
};
