import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb.js';
import { authService } from '../../../src/modules/auth/auth.service.js';
import { TokenFamily, User } from '../../../src/modules/user/user.model.js';
import { hashPassword } from '../../../src/common/utils/password.js';
const fakeData = { ip: '198:0,0.0.1', userAgent: 'test-agent', label: 'test-label' };
const password = '123456Aa';
const email = 'test@gmail.com';
beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe('authservice.getSession / revokeSession', () => {
  it('returns token family with exact userId given', async () => {
    const user = await User.create({
      name: 'test',
      email,
      password: await hashPassword(password),
      emailVerified: true,
    });
    await authService.login({ email, password }, fakeData);
    const result = await authService.getSessions(user._id.toString());

    expect(result).toHaveLength(1);
    expect(result[0].ip).toBe(fakeData.ip);
    expect(result[0].device).toBe(fakeData.label);
    expect(result[0].id).toBeDefined();
  });
  it('does not return sessions belonging to a different user', async () => {
    const userA = await User.create({
      name: 'A',
      email: 'a@gmail.com',
      password: await hashPassword(password),
      emailVerified: true,
    });
    const userB = await User.create({
      name: 'B',
      email: 'b@gmail.com',
      password: await hashPassword(password),
      emailVerified: true,
    });

    await authService.login({ email: 'a@gmail.com', password }, fakeData);
    await authService.login({ email: 'b@gmail.com', password }, fakeData);

    const resultForA = await authService.getSessions(userA._id.toString());

    expect(resultForA).toHaveLength(1);
    // prove it's genuinely A's session, not B's, by checking against the DB directly
    const familyForA = await TokenFamily.findOne({ userId: userA._id });
    expect(resultForA[0].id).toBe(familyForA!._id.toString());
  });

  it('revokes a session and deletes it from the database', async () => {
    const user = await User.create({
      name: 'test',
      email,
      password: await hashPassword(password),
      emailVerified: true,
    });
    await authService.login({ email, password }, fakeData);
    const family = await TokenFamily.findOne({ userId: user._id });
    expect(family).not.toBeNull();
    const result = await authService.revokeSession(user._id.toString(), family!._id.toString());
    expect(result).toBe(true);

    const deletedFamily = await TokenFamily.findById(family!._id);
    expect(deletedFamily).toBeNull();
  });
  it('throws and does not delete when the session belongs to a different user', async () => {
    const userA = await User.create({
      name: 'A',
      email: 'a@gmail.com',
      password: await hashPassword(password),
      emailVerified: true,
    });
    const userB = await User.create({
      name: 'B',
      email: 'b@gmail.com',
      password: await hashPassword(password),
      emailVerified: true,
    });

    await authService.login({ email: 'b@gmail.com', password }, fakeData);
    const familyB = await TokenFamily.findOne({ userId: userB._id });

    // userA tries to revoke userB's session — should be rejected
    await expect(
      authService.revokeSession(userA._id.toString(), familyB!._id.toString())
    ).rejects.toThrow('Session not found');

    // and it should genuinely still exist afterward, untouched
    const stillExists = await TokenFamily.findById(familyB!._id);
    expect(stillExists).not.toBeNull();
  });
});
