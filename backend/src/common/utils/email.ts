import nodemailer from 'nodemailer'
import { env } from '../../config/env.js'
import { logger } from '../../common/utils/logger.js'

export const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465,
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  family: 4, // Forces IPv4 to resolve ENETUNREACH
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
} as nodemailer.TransportOptions)

export const verifySmtpConnection = async (): Promise<void> => {
  try {
    await transporter.verify()
    logger.info('SMTP Connection Pool established and ready')
  } catch (error) {
    logger.error({ error }, 'CRITICAL: Failed to connect to SMTP server')
    throw error
  }
}

export const emailService = {
  sendOtpEmail: async (
    email: string,
    name: string,
    plainOtp: string
  ): Promise<void> => {
    try {
      await transporter.sendMail({
        from: `"NoteApp" <${env.smtpUser}>`,
        to: email,
        subject: 'Verify your NoteApp email address',
        text: `Hi ${name},\n\nThank you for registering. Your verification code is: ${plainOtp}\n\nEnter this code in the app to verify your email. This code will expire in 5 minutes.\n\nIf you did not create an account, you can ignore this email.`,
        html: `<!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f5; padding: 40px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e4e4e7; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                      <tr>
                        <td style="padding: 32px 32px 0 32px; text-align: left;">
                          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #18181b;">NoteApp</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 32px; color: #3f3f46; font-size: 16px; line-height: 24px;">
                          <p style="margin: 0 0 16px 0;">Hi <strong>${name}</strong>,</p>
                          <p style="margin: 0 0 24px 0;">
                            Thanks for signing up for NoteApp! Use the code below to verify your email address.
                          </p>
                          <div style="text-align: center; margin: 32px 0;">
                            <span style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 16px 32px; font-size: 28px; font-weight: 700; letter-spacing: 6px; border-radius: 6px; font-family: 'Courier New', monospace;">
                              ${plainOtp}
                            </span>
                          </div>
                          <p style="margin: 0 0 8px 0; font-size: 14px; color: #71717a;">
                            This code will expire in <strong>5 minutes</strong>.
                          </p>
                          <p style="margin: 0; font-size: 14px; color: #71717a;">
                            If you did not sign up for NoteApp, you can safely ignore this email.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 24px 32px; background-color: #fafafa; border-top: 1px solid #e4e4e7; text-align: center; font-size: 12px; color: #a1a1aa;">
                          <p style="margin: 0;">© ${new Date().getFullYear()} NoteApp. All rights reserved.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>`,
      })
      logger.info({ email }, 'Verification email sent successfully')
    } catch (err) {
      logger.error({ err, email }, 'Failed to send verification email')
      throw err
    }
  },

  sendPasswordResetEmail: async (
    email: string,
    name: string,
    plainToken: string
  ): Promise<void> => {
    const resetUrl = `${env.clientUrl}/reset-password?token=${plainToken}`

    try {
      await transporter.sendMail({
        from: `"Sandbox Security" <${env.smtpUser}>`,
        to: email,
        subject: 'Reset your NoteApp password',
        text: `Hi ${name},\n\nWe received a request to reset your password. Reset it here:\n${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
        html: `
          <!DOCTYPE html>
          <html>
            <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:sans-serif;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f4f5; padding:40px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; background-color:#ffffff; border-radius:8px; border:1px solid #e4e4e7;">
                      <tr>
                        <td style="padding:32px;">
                          <h1 style="margin:0 0 16px; font-size:24px; color:#18181b;">NoteApp Security</h1>
                          <p style="color:#3f3f46; font-size:16px;">Hi <strong>${name}</strong>,</p>
                          <p style="color:#3f3f46; font-size:16px;">We received a request to reset the password for your account.</p>
                          <div style="text-align:center; margin:32px 0;">
                            <a href="${resetUrl}" style="background-color:#dc2626; color:#ffffff; padding:12px 28px; font-size:15px; font-weight:600; text-decoration:none; border-radius:6px; display:inline-block;">Reset Password</a>
                          </div>
                          <p style="font-size:14px; color:#71717a; margin:0 0 8px 0;">This link expires in <strong>1 hour</strong>.</p>
                          <p style="font-size:14px; color:#71717a; margin:0;">If you did not request this, your account is safe and you can ignore this email.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      })
      logger.info({ email }, 'Password reset email sent')
    } catch (error) {
      logger.error({ error, email }, 'Failed to send password reset email')
      throw error
    }
  },

  sendNotificationEmail: async (
    email: string,
    name: string,
    title: string,
    message: string,
    actionUrl?: string,
    actionText?: string
  ): Promise<void> => {
    const ctaHtml = actionUrl && actionText ? `
      <div style="text-align:center; margin:32px 0;">
        <a href="${actionUrl}" style="background-color:#2563eb; color:#ffffff; padding:12px 28px; font-size:15px; font-weight:600; text-decoration:none; border-radius:6px; display:inline-block;">${actionText}</a>
      </div>
    ` : ''

    try {
      await transporter.sendMail({
        from: `"Sandbox Notifications" <${env.smtpUser}>`,
        to: email,
        subject: title,
        text: `Hi ${name},\n\n${message}${actionUrl ? `\n\nView here: ${actionUrl}` : ''}`,
        html: `
          <!DOCTYPE html>
          <html>
            <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:sans-serif;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f4f5; padding:40px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; background-color:#ffffff; border-radius:8px; border:1px solid #e4e4e7;">
                      <tr>
                        <td style="padding:32px;">
                          <h2 style="margin:0 0 16px; font-size:20px; color:#18181b;">${title}</h2>
                          <p style="color:#3f3f46; font-size:16px;">Hi <strong>${name}</strong>,</p>
                          <p style="color:#3f3f46; font-size:16px; line-height:24px;">${message}</p>
                          ${ctaHtml}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      })
      logger.info({ email, title }, 'Notification email sent')
    } catch (error) {
      logger.error({ error, email }, 'Failed to send notification email')
      throw error
    }
  },

  sendNewsletterEmail: async (
    email: string,
    subject: string,
    contentHtml: string,
    unsubscribeToken: string
  ): Promise<void> => {
    const unsubscribeUrl = `${env.clientUrl}/unsubscribe?token=${unsubscribeToken}`

    try {
      await transporter.sendMail({
        from: `"NoteApp Digest" <${env.smtpUser}>`,
        to: email,
        subject,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
        text: `Check out our latest news from NoteApp!\n\nTo unsubscribe: ${unsubscribeUrl}`,
        html: `
          <!DOCTYPE html>
          <html>
            <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:sans-serif;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f4f5; padding:40px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; background-color:#ffffff; border-radius:8px; border:1px solid #e4e4e7;">
                      <tr>
                        <td style="padding:32px;">
                          ${contentHtml}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:20px; background-color:#fafafa; border-top:1px solid #e4e4e7; text-align:center; font-size:12px; color:#a1a1aa;">
                          <p style="margin:0 0 8px 0;">You received this because you are subscribed to NoteApp updates.</p>
                          <a href="${unsubscribeUrl}" style="color:#71717a; text-decoration:underline;">Unsubscribe here</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      })
      logger.info({ email }, 'Newsletter email sent')
    } catch (error) {
      logger.error({ error, email }, 'Failed to send newsletter email')
      throw error
    }
  },
}