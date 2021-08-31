export type ImportMap = { imports: Record<string, unknown> };

export type Navigate = (to: string, opts?: { replace?: boolean }) => void;
