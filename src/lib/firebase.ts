// Mock Firebase for build compatibility
// We are using a local state dashboard now, so real Firebase is not needed for the frontend build.
export const db = {} as any;
export const auth = {} as any;
export const storage = {} as any;
export const app = {} as any;
export const initializeApp = () => { };
export const getFirestore = () => { };
export const getAuth = () => { };
