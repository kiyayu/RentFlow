//src/queues/reset.queue.ts
import { Queue } from "bullmq";
import { bullConnection } from "../config/bullConnection.js";

export const resetQueue = new Queue('reset', {
    connection:bullConnection,
    defaultJobOptions:{
        attempts:5,
        backoff:{
            type: 'exponential',
            delay:1000
        },
        removeOnComplete:{
            age:3600,
            count:1000
        },
        removeOnFail:{
            age:86400
        }
    }
})