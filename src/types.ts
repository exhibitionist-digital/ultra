export type ImportMap = { imports: Record<string, any> };

export type Navigate = (to: string, opts?:{ replace?: boolean }) => void