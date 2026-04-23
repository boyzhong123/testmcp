'use server';

import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.qiye.163.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });
}

function getSmtpUser() {
  return process.env.SMTP_USER || 'sales@chivox.com';
}

export interface ContactFormData {
  company: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: string;
}

export interface ContactFormResult {
  success: boolean;
  error?: string;
}

export async function sendContactEmail(data: ContactFormData): Promise<ContactFormResult> {
  const { company, name, phone, email, message, source } = data;

  if (!company?.trim() || !name?.trim() || !phone?.trim()) {
    return { success: false, error: '请填写完整信息' };
  }

  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone.trim())) {
    return { success: false, error: '请输入正确的手机号码' };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { success: false, error: '请输入正确的邮箱地址' };
  }

  try {
    console.log('[DEBUG] SMTP_PASS length:', (process.env.SMTP_PASS || '').length, 'first 4:', (process.env.SMTP_PASS || '').slice(0, 4));
    const smtpUser = getSmtpUser();
    const transporter = createTransporter();
    
    const submitTime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:500px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);padding:24px 28px;">
      <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600;">新的咨询请求</h1>
    </div>
    <div style="padding:28px;">
      <div style="margin-bottom:16px;">
        <div style="color:#6b7280;font-size:13px;margin-bottom:4px;">公司</div>
        <div style="color:#111;font-size:15px;font-weight:500;">${escapeHtml(company)}</div>
      </div>
      <div style="margin-bottom:16px;">
        <div style="color:#6b7280;font-size:13px;margin-bottom:4px;">联系人</div>
        <div style="color:#111;font-size:15px;font-weight:500;">${escapeHtml(name)}</div>
      </div>
      <div style="margin-bottom:16px;">
        <div style="color:#6b7280;font-size:13px;margin-bottom:4px;">手机号码</div>
        <div style="color:#3b82f6;font-size:15px;font-weight:500;">${escapeHtml(phone)}</div>
      </div>
      ${email ? `
      <div style="margin-bottom:16px;">
        <div style="color:#6b7280;font-size:13px;margin-bottom:4px;">邮箱</div>
        <div style="color:#3b82f6;font-size:15px;">${escapeHtml(email)}</div>
      </div>
      ` : ''}
      ${message ? `
      <div style="margin-bottom:16px;">
        <div style="color:#6b7280;font-size:13px;margin-bottom:4px;">留言</div>
        <div style="color:#111;font-size:15px;white-space:pre-wrap;">${escapeHtml(message)}</div>
      </div>
      ` : ''}
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;">
        <div style="display:flex;justify-content:space-between;color:#9ca3af;font-size:12px;">
          <span>来源：${escapeHtml(source || '官网')}</span>
          <span>${submitTime}</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

    await transporter.sendMail({
      from: `"Chivox MCP 官网" <${smtpUser}>`,
      to: smtpUser,
      replyTo: email || undefined,
      subject: `[${source || '官网咨询'}] ${company} - ${name}`,
      html: htmlContent,
    });

    return { success: true };
  } catch (err) {
    console.error('Email sending error:', err);
    return { success: false, error: '邮件发送失败，请稍后重试' };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
