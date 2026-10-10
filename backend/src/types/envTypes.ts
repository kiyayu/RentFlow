 //src/types/envTypes.ts

 export interface EnvTypes {
    port:number
    nodeEnv:string
    mongoUri:string
    redisUri:string
    jwtAccessSecret:string
    jwtRefreshSecret:string
    jwtAccessExpiresIn:string
    jwtRefreshExpiresIn:string
    clientUrl:string
    cookieSecret:string


  // Email
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPass: string
  smtpFrom: string

  // Google OAuth
  googleClientId:     string
  googleClientSecret: string
  googleRedirectUri:  string


 }