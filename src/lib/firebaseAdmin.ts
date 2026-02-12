// File cleared during migration to Prisma/Railway.
// This file is kept to prevent "Module not found" errors in legacy code until fully removed.
export const db = {} as any;
export const getDb = () => ({ collection: () => ({ get: async () => ({ docs: [] }) }) });
