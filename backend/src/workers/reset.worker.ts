//src/workers/reset.worker.ts
import { Worker } from "bullmq";
import { bullConnection } from "../config/bullConnection.js";
import { logger } from "../common/utils/logger.js";
import { emailService } from "../common/utils/email.js";

export const resetWorker = new Worker('reset',
    async (job) => {
        const { email, name, resetToken } = job.data
        await emailService.sendPasswordResetEmail(email, name, resetToken)

    }
     ,
    {
    connection:bullConnection
})
resetWorker.on('failed', (job, err) => {
        if(job){
            logger.warn(`Job ${job.id} failed on attmpt ${job.attemptsMade} of ${job.opts.attempts} Error: ${err.message} `)
        }
    })
