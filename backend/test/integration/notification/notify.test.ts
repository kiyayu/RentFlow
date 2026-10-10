// test/integration/notification/notify.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { Types } from 'mongoose';
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb';
import { notificationService } from '../../../src/modules/notification/notification.service';
import { Notification } from '../../../src/modules/notification/notification.model';

describe('notificationService.notify', () => {
  beforeAll(async () => connectTestDb());
  beforeEach(async () => clearTestDb());
  afterAll(async () => disconnectTestDb());

  it('should create a notification in the database', async () => {
    const userId = new Types.ObjectId().toString();

    await notificationService.notify({
      userId,
      type: 'new_sign_in',
      emailTo: 'janzo@gmail.com',
      name: 'janzo',
      meta: { device: 'test-device', ip: '198.0.0.1' },
    });

    const notification = await Notification.findOne({ userId });

    expect(notification).not.toBeNull();
    expect(notification?.userId.toString()).toBe(userId);
    expect(notification?.type).toBe('new_sign_in');
  });

  it('should not throw if an error occurs during notify execution', async () => {
    await expect(
      notificationService.notify({
        userId: 'invalid-object-id',
        type: 'new_sign_in',
        emailTo: 'janzo@gmail.com',
        name: 'janzo',
      })
    ).resolves.not.toThrow();
  });
});