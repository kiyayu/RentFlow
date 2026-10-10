// test/setup.ts
import { vi } from 'vitest';

vi.mock('../src/queues/email.queue.js', () => ({
  emailQueue: {
    add: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../src/queues/reset.queue.js', () => ({
  resetQueue: {
    add: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../src/queues/notification.queue.js', () => ({
  notificationQueue: {
    add: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  },
}));