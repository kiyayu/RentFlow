//src/workers/email.worker.ts

import {Worker} from 'bullmq'
import { bullConnection } from '../config/bullConnection.js'
import { emailService } from '../common/utils/email.js'
import { logger } from '../common/utils/logger.js'

export const emailWorker = new Worker(
    'email',
    async (job) => {
        const {email, name, otp} = job.data
        await emailService.sendOtpEmail(email, name,  otp)
    },
    {
        connection:bullConnection
    }
  
) 
  emailWorker.on('failed', (job, err) => {
        if(job){
            logger.warn(`Job ${job.id} failed on attmpt ${job.attemptsMade} of ${job.opts.attempts} Error: ${err.message} `)
        }
    })