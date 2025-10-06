package com.fitnessapp.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.fromName}")
    private String fromName;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            logger.info("Attempting to send password reset email to: {}", toEmail);
            logger.debug("SMTP Configuration - Host: {}, Port: {}, From: {}",
                System.getProperty("spring.mail.host"),
                System.getProperty("spring.mail.port"),
                fromEmail);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject("Password Reset Request - RepBase");

            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

            String emailContent = buildPasswordResetEmail(resetLink);
            helper.setText(emailContent, true);

            mailSender.send(message);
            logger.info("Password reset email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            logger.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error sending email to {}: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Unexpected error sending email: " + e.getMessage(), e);
        }
    }

    private String buildPasswordResetEmail(String resetLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        line-height: 1.6;
                        color: #2D3436;
                        background-color: #F0F3F5;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #FFFFFF;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(45, 52, 54, 0.08);
                    }
                    .header {
                        background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
                        color: white;
                        padding: 30px 40px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 700;
                    }
                    .content {
                        padding: 40px;
                    }
                    .content p {
                        color: #636E72;
                        font-size: 16px;
                        margin-bottom: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 14px 32px;
                        background-color: #FF6B6B;
                        color: white !important;
                        text-decoration: none;
                        border-radius: 12px;
                        font-weight: 600;
                        font-size: 16px;
                        margin: 20px 0;
                    }
                    .button:hover {
                        background-color: #E85555;
                    }
                    .info-box {
                        background-color: #FEF3F2;
                        border-left: 4px solid #FF6B6B;
                        padding: 16px;
                        margin: 20px 0;
                        border-radius: 8px;
                    }
                    .info-box p {
                        margin: 0;
                        color: #636E72;
                        font-size: 14px;
                    }
                    .footer {
                        background-color: #FAFBFC;
                        padding: 24px 40px;
                        text-align: center;
                        border-top: 1px solid #E0E0E0;
                    }
                    .footer p {
                        margin: 0;
                        color: #B2BEC3;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>We received a request to reset your password for your RepBase account. Click the button below to create a new password:</p>

                        <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                            <tr>
                                <td align="center">
                                    <table cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td bgcolor="#FF6B6B" style="border-radius: 12px; padding: 14px 32px;">
                                                <a href="%s" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; display: block;">Reset Password</a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        <div class="info-box">
                            <p><strong>⏰ This link will expire in 1 hour</strong></p>
                        </div>

                        <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #FF6B6B;">%s</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 RepBase. All rights reserved.</p>
                        <p>This is an automated email, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(resetLink, resetLink);
    }
}
