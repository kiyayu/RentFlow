// test/integration/notification/list.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { Types } from 'mongoose';
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb';
import { notificationService } from '../../../src/modules/notification/notification.service';
import { Notification } from '../../../src/modules/notification/notification.model';

describe('notificationService.list', () => {
  beforeAll(async () => connectTestDb());
  beforeEach(async () => clearTestDb());
  afterAll(async () => disconnectTestDb());

  it('should list user notifications with pagination', async () => {
    const userId = new Types.ObjectId().toString();
    const otherUserId = new Types.ObjectId().toString();

    await Notification.create([
      { userId, type: 'new_sign_in', title: 'T1', message: 'M1' },
      { userId, type: 'password_changed', title: 'T2', message: 'M2' },
      { userId, type: 'email_changed', title: 'T3', message: 'M3' },
      { userId: otherUserId, type: 'new_sign_in', title: 'Other', message: 'M4' },
    ]);

    const result = await notificationService.list(userId, { page: 1, limit: 2 });

    expect(result.items).toHaveLength(2);
    expect(result.pagination.total).toBe(3);
    expect(result.pagination.totalPage).toBe(2);
    expect(result.pagination.currentPage).toBe(1);
  });

  it('should filter unread notifications when unreadOnly is true', async () => {
    const userId = new Types.ObjectId().toString();

    await Notification.create([
      { userId, type: 'new_sign_in', title: 'Unread', message: 'M1', readAt: null },
      { userId, type: 'password_changed', title: 'Read', message: 'M2', readAt: new Date() },
    ]);

    const result = await notificationService.list(userId, { unreadOnly: true });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe('Unread');
    expect(result.items[0].read).toBe(false);
  });
});