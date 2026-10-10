// test/integration/notification/markRead.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { Types } from 'mongoose';
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb';
import { notificationService } from '../../../src/modules/notification/notification.service';
import { Notification } from '../../../src/modules/notification/notification.model';
import { ApiError } from '../../../src/common/errors/apiErrors';

describe('notificationService.markRead', () => {
  beforeAll(async () => connectTestDb());
  beforeEach(async () => clearTestDb());
  afterAll(async () => disconnectTestDb());

  it('should mark a specific notification as read', async () => {
    const userId = new Types.ObjectId().toString();
    const doc = await Notification.create({
      userId,
      type: 'new_sign_in',
      title: 'Title',
      message: 'Message',
    });

    const updated = await notificationService.markRead(userId, doc._id.toString());

    expect(updated.read).toBe(true);

    const dbDoc = await Notification.findById(doc._id);
    expect(dbDoc?.readAt).not.toBeNull();
  });

  it('should throw ApiError if notification belongs to another user', async () => {
    const userId = new Types.ObjectId().toString();
    const otherUserId = new Types.ObjectId().toString();

    const doc = await Notification.create({
      userId: otherUserId,
      type: 'new_sign_in',
      title: 'Title',
      message: 'Message',
    });

    await expect(
      notificationService.markRead(userId, doc._id.toString())
    ).rejects.toThrow(ApiError);
  });
});