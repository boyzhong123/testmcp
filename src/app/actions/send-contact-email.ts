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
    
    const lines: string[] = [
      '您好，收到一条新的官网咨询，请销售当天及时跟进，祝好运。',
      '',
      '---',
      '以下是原始邮件内容：',
      '',
      `公司：${company}`,
      `姓名：${name}`,
      `手机：${phone}`,
    ];
    if (email) lines.push(`邮箱：${email}`);
    if (message) lines.push(`留言：${message}`);
    lines.push('');
    lines.push(`来源：${source || '官网'}`);
    lines.push(`提交时间：${submitTime}`);

    const textContent = lines.join('\n');
    const htmlContent = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'PingFang SC','Microsoft YaHei',sans-serif;font-size:14px;line-height:1.8;color:#222;white-space:pre-wrap;">${escapeHtml(textContent)}</div>`;

    await transporter.sendMail({
      from: `"Chivox MCP 官网" <${smtpUser}>`,
      to: smtpUser,
      replyTo: email || undefined,
      subject: `[${source || '官网咨询'}] ${company} - ${name}`,
      text: textContent,
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
