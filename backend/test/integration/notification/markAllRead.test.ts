// test/integration/notification/markAllRead.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { Types } from 'mongoose';
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb';
import { notificationService } from '../../../src/modules/notification/notification.service';
import { Notification } from '../../../src/modules/notification/notification.model';

describe('notificationService.markAllRead', () => {
  beforeAll(async () => connectTestDb());
  beforeEach(async () => clearTestDb());
  afterAll(async () => disconnectTestDb());

  it('should mark all unread notifications as read for a given user', async () => {
    const userId = new Types.ObjectId().toString();
    const otherUserId = new Types.ObjectId().toString();

    await Notification.create([
      { userId, type: 'new_sign_in', title: 'T1', message: 'M1', readAt: null },
      { userId, type: 'password_changed', title: 'T2', message: 'M2', readAt: null },
      { userId: otherUserId, type: 'email_changed', title: 'T3', message: 'M3', readAt: null },
    ]);

    const modifiedCount = await notificationService.markAllRead(userId);

    expect(modifiedCount).toBe(2);

    const remainingUnread = await Notification.countDocuments({ userId, readAt: null });
    expect(remainingUnread).toBe(0);

    const otherUnread = await Notification.countDocuments({ userId: otherUserId, readAt: null });
    expect(otherUnread).toBe(1);
  });
});