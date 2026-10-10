// test/integration/notification/unreadCount.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { Types } from 'mongoose';
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb';
import { notificationService } from '../../../src/modules/notification/notification.service';
import { Notification } from '../../../src/modules/notification/notification.model';

describe('notificationService.unreadCount', () => {
  beforeAll(async () => connectTestDb());
  beforeEach(async () => clearTestDb());
  afterAll(async () => disconnectTestDb());

  it('should return correct unread count for a user', async () => {
    const userId = new Types.ObjectId().toString();

    await Notification.create([
      { userId, type: 'new_sign_in', title: 'T1', message: 'M1', readAt: null },
      { userId, type: 'password_changed', title: 'T2', message: 'M2', readAt: null },
      { userId, type: 'email_changed', title: 'T3', message: 'M3', readAt: new Date() },
    ]);

    const count = await notificationService.unreadCount(userId);

    expect(count).toBe(2);
  });
});