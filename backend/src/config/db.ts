import mongoose from "mongoose"
import {env} from './env.js'
import { logger } from "../common/utils/logger.js"

export const connectDB = async () => {
    try {
        await mongoose.connect(env.mongoUri)
        logger.info('Database connected successully')
    } catch (error) {
        logger.fatal({error}, 'Database connection, failed')
        process.exit(1)
    }
}