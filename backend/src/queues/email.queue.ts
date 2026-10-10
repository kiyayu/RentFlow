//src/queues/email.queue.ts
import { Queue } from "bullmq";
import { bullConnection } from "../config/bullConnection.js";

export const emailQueue = new Queue('email',  {
    connection:bullConnection,
    defaultJobOptions: {
        attempts:5,
        backoff: {
            type: 'exponential',
            delay:1000
        },
        removeOnComplete: {
            age:3600,
            count:1000
        },
        removeOnFail: {
            age: 86400
        }
    }
    
    }

)

