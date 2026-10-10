//src/modules/user.model.ts
import mongoose, {Schema , Types, Document } from "mongoose";
import { USER_ROLES } from "./user.constants.js";
import { UserRole } from "../../types/authTypes.js";

interface IUser extends Document {
    name:string
    email:string
    password?:string
    googleId?:string
    role:UserRole
    emailVerified:boolean
    otpCodeHash?:string
    otpExpiry?:Date
    otpAttempts:number
    lastOtpSentAt?:Date
    passwordResetToken?: string
    passwordResetExpiry?: Date
    isActive:boolean
    createdAt:Date
    updatedAt:Date
}

interface ITokenFamily extends Document {
    userId: Types.ObjectId;
    currentTokenHash?: string;
    previousTokenHash?: string;
    deviceInfo?: string;
    userAgent?: string;
    ip?: string;
    label?: string;
    lastUsedAt?: Date;   
    revokedAt?: Date;    
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
 
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password: {
        type:String,
        required:function(this:{googleId:string}) { return !this.googleId},
        select:false
    },
    googleId: {
        type:String,
        unique:true,
        sparse:true,
        select:false
    },
    role: {
        type:String,
        enum:USER_ROLES,
        default:'customer'
    },
    emailVerified: {
        type:Boolean,
        default:false
    },
    otpCodeHash: {
        type: String,
        select:false,
        index:true
    },
    otpExpiry: {
        type:Date,
        select:false
    },
    otpAttempts: {
        type:Number,
        select:false,
        default:0
    },
    lastOtpSentAt: {
        type:Date, 
        select:false,

    },
    passwordResetToken: {
        type: String,
        select:false,
        index:true
    },
    passwordResetExpiry: {
        type: Date,
        select:false
    },
    isActive: {
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
}
)



const tokenFamilySchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true,
        index:true
    },
    currentTokenHash: {
        type:String,
         select:false
    },
    previousTokenHash: {
        type:String,
        select:false
    },
    deviceInfo: {
        type:String,

    },
    userAgent: {
        type:String
    },
    ip: {
        type:String
    },
    label: {
        type:String
    },
    createdAt: {
        type:Date
    },
    lastUsedAt: {
        type:Date
    },
    revokedAt: {
        type:Date,
        default:null
    },
    expiresAt: {
        type:Date
    }
},
{
    timestamps:true
}
)



export const User = mongoose.model<IUser>('User', userSchema)
export const TokenFamily = mongoose.model<ITokenFamily>('TokenFamily', tokenFamilySchema)
