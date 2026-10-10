// test/fixtures/users.ts

export const validRegisterInput = () => ({
  name: 'Sara Test',
  email: `sara-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`,
  password: 'StrongPass123',
})

export const validLoginInput = (email: string, password: string) => ({
  email,
  password,
})