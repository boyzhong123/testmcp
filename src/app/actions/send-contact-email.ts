'use server';

import nodemailer from 'nodemailer';

// SMTP 配置
const SMTP_CONFIG = {
  host: 'smtp.qiye.163.com',
  port: 465,
  user: 'sales@chivox.com',
  pass: '2a2d$ZBCS4s$QK2L',
};

function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: true,
    auth: {
      user: SMTP_CONFIG.user,
      pass: SMTP_CONFIG.pass,
    },
  });
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
    // 调试日志
    console.log('SMTP Config:', {
      host: SMTP_CONFIG.host,
      port: SMTP_CONFIG.port,
      user: SMTP_CONFIG.user,
      pass: `${SMTP_CONFIG.pass.slice(0, 4)}****`,
    });

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Chivox MCP 官网" <${SMTP_CONFIG.user}>`,
      to: SMTP_CONFIG.user,
      replyTo: email || undefined,
      subject: `[${source || '官网咨询'}] ${company} - ${name}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            新的咨询请求
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; width: 120px; font-weight: 600;">
                公司名称
              </td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">
                ${escapeHtml(company)}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: 600;">
                联系人
              </td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">
                ${escapeHtml(name)}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: 600;">
                手机号码
              </td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">
                <a href="tel:${escapeHtml(phone)}" style="color: #3b82f6;">${escapeHtml(phone)}</a>
              </td>
            </tr>
            ${email ? `
            <tr>
              <td style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: 600;">
                邮箱
              </td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">
                <a href="mailto:${escapeHtml(email)}" style="color: #3b82f6;">${escapeHtml(email)}</a>
              </td>
            </tr>
            ` : ''}
            ${message ? `
            <tr>
              <td style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: 600; vertical-align: top;">
                留言内容
              </td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; white-space: pre-wrap;">
                ${escapeHtml(message)}
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: 600;">
                来源
              </td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">
                ${escapeHtml(source || '官网')}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-weight: 600;">
                提交时间
              </td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">
                ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
              </td>
            </tr>
          </table>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            此邮件由 Chivox MCP 官网自动发送，请勿直接回复。
          </p>
        </div>
      `,
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
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
