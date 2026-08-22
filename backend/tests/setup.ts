jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn(),
  cert: jest.fn(),
  getApps: jest.fn(() => []),
}));
jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn(),
}));
jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(),
  })),
}));
