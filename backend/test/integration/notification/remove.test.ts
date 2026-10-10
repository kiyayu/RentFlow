// test/integration/notification/remove.test.ts
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { Types } from 'mongoose';
import { connectTestDb, clearTestDb, disconnectTestDb } from '../../helpers/testDb';
import { notificationService } from '../../../src/modules/notification/notification.service';
import { Notification } from '../../../src/modules/notification/notification.model';
import { ApiError } from '../../../src/common/errors/apiErrors';

describe('notificationService.remove', () => {
  beforeAll(async () => connectTestDb());
  beforeEach(async () => clearTestDb());
  afterAll(async () => disconnectTestDb());

  it('should delete a notification document', async () => {
    const userId = new Types.ObjectId().toString();
    const doc = await Notification.create({
      userId,
      type: 'new_sign_in',
      title: 'Title',
      message: 'Message',
    });

    await notificationService.remove(userId, doc._id.toString());

    const dbDoc = await Notification.findById(doc._id);
    expect(dbDoc).toBeNull();
  });

  it('should throw ApiError when deleting non-existent notification', async () => {
    const userId = new Types.ObjectId().toString();
    const randomId = new Types.ObjectId().toString();

    await expect(
      notificationService.remove(userId, randomId)
    ).rejects.toThrow(ApiError);
  });
});