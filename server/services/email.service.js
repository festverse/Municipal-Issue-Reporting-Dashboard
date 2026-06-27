/**
 * @file services/email.service.js
 * @description Handles automated email alerts, broadcasts, and status notifications.
 * Supports Ethereal test accounts out of the box (prints live preview URLs to console)
 * and real SMTP credentials when configured in .env.
 */

const nodemailer = require('nodemailer');

let cachedTransporter = null;

/**
 * Get or initialize the Nodemailer transporter.
 */
const getTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log('[EMAIL] Using configured SMTP credentials from .env');
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return cachedTransporter;
  }

  // Fallback to Ethereal auto-generated test account
  console.log('[EMAIL] No SMTP credentials found in .env. Generating Ethereal test account...');
  const testAccount = await nodemailer.createTestAccount();
  console.log(`[EMAIL] Ethereal test account generated: ${testAccount.user}`);

  cachedTransporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return cachedTransporter;
};

/**
 * Base helper to send an email and log Ethereal preview URLs.
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Civic Portal Municipal Command'}" <${process.env.EMAIL_FROM_ADDRESS || 'command@civicportal.gov'}>`,
      to,
      subject,
      text: text || subject,
      html,
    });

    console.log(`\n==================================================`);
    console.log(`✉️  EMAIL SENT TO: ${to}`);
    console.log(`🏷️  SUBJECT: ${subject}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🌐 LIVE WEB PREVIEW URL: ${previewUrl}`);
    }
    console.log(`==================================================\n`);
    return info;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send email to ${to}:`, error);
    return null;
  }
};

/* ------------------------------------------------------------------ */
/*  Dedicated Email Templates                                          */
/* ------------------------------------------------------------------ */

/**
 * Email #1: Citizen Report Submitted & Pending Engineer Selection
 */
const sendCitizenReportSubmittedEmail = async (citizenEmail) => {
  const subject = 'Your Municipal Report Has Been Submitted [Action Required within 1 Hour]';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="color: #2563eb; margin: 0;">Civic Portal Municipal Command</h2>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Official Citizen Service Alert</p>
      </div>
      <div style="padding: 20px 0;">
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">Dear Citizen,</p>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          <strong>Your report has been successfully submitted</strong> to the municipal tracking network. We have initiated automated AI triage and are currently locating an available specialized engineer for your sector.
        </p>
        <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 0 12px 12px 0;">
          <p style="color: #1e40af; font-size: 15px; margin: 0; font-weight: bold;">
            ⏱️ SLA Commitment: We will assign an engineer to take care of this matter within 1 hour.
          </p>
        </div>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          Within this limited 1-hour window, the assigned engineer will be selected based on availability and departmental specialization. You will receive a follow-up email the exact moment an engineer accepts this assignment.
        </p>
      </div>
      <div style="padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">© 2026 Civic Portal Enterprise • End-to-End Verified</p>
      </div>
    </div>
  `;
  return sendEmail({ to: citizenEmail, subject, html });
};

/**
 * Broadcast Email: Sent to ALL Engineers when a new issue is reported
 */
const sendEngineerBroadcastEmail = async (engineerEmail, ticket) => {
  const subject = `[MUNICIPAL ALERT] New Issue Reported: ${ticket.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="color: #b91c1c; margin: 0;">⚠️ Municipal Infrastructure Alert</h2>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Broadcast to All Registered Engineers</p>
      </div>
      <div style="padding: 20px 0;">
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">Dear Engineer,</p>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          A new issue has been reported by a citizen on the Civic Portal network. All engineers are receiving this alert for situational awareness across municipal zones.
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 10px;">${ticket.title}</h3>
          <p style="color: #475569; font-size: 14px; margin: 0 0 15px 0; white-space: pre-wrap;">${ticket.description}</p>
          <p style="color: #64748b; font-size: 13px; margin: 0;"><strong>Priority Level:</strong> ${ticket.priority || 'MEDIUM'}</p>
          <p style="color: #64748b; font-size: 13px; margin: 5px 0 0 0;"><strong>Reported At:</strong> ${new Date(ticket.created_at || Date.now()).toLocaleString()}</p>
        </div>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          The automated dispatch system is currently selecting a specific engineer to assign to this task. If you are selected, you will receive a direct assignment offer email with the choice to Accept or Decline.
        </p>
      </div>
      <div style="padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">© 2026 Civic Portal Enterprise • Department of Field Operations</p>
      </div>
    </div>
  `;
  return sendEmail({ to: engineerEmail, subject, html });
};

/**
 * Offer Email: Sent to the specific selected engineer with Accept/Decline instructions
 */
const sendEngineerAssignmentOfferEmail = async (engineerEmail, ticket) => {
  const subject = `[ACTION REQUIRED] You Have Been Selected for Assignment: ${ticket.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="color: #4338ca; margin: 0;">📌 Primary Engineer Assignment Offer</h2>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Pending Engineer Acceptance</p>
      </div>
      <div style="padding: 20px 0;">
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">Dear Engineer (${engineerEmail}),</p>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          The system has chosen you as the primary engineer to take care of the following reported issue. You have full autonomy to decide whether or not you wish to accept this assignment.
        </p>
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 0 12px 12px 0;">
          <p style="color: #991b1b; font-size: 15px; margin: 0; font-weight: bold;">
            ⚠️ If you decline, the system will automatically reassign another engineer to take care of this issue within the 1-hour SLA window.
          </p>
        </div>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 10px;">${ticket.title}</h3>
          <p style="color: #475569; font-size: 14px; margin: 0 0 15px 0; white-space: pre-wrap;">${ticket.description}</p>
          <p style="color: #64748b; font-size: 13px; margin: 0;"><strong>Priority Level:</strong> ${ticket.priority || 'MEDIUM'}</p>
        </div>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          Please log into your <strong>City Executive Dashboard</strong> or open the ticket details page to officially click <strong>Accept Assignment</strong> or <strong>Decline Assignment</strong>.
        </p>
      </div>
      <div style="padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">© 2026 Civic Portal Enterprise • Field Engineering Directorate</p>
      </div>
    </div>
  `;
  return sendEmail({ to: engineerEmail, subject, html });
};

/**
 * Email #2: Citizen Confirmation of Assigned Engineer
 */
const sendCitizenEngineerAssignedEmail = async (citizenEmail, engineerEmail, ticket) => {
  const subject = `[UPDATE] Engineer Assigned to Your Issue: ${ticket.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="color: #059669; margin: 0;">✅ Municipal Engineer Assigned</h2>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Official Tracking Update</p>
      </div>
      <div style="padding: 20px 0;">
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">Dear Citizen,</p>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          Good news! A specialized municipal engineer has officially accepted the assignment for your reported issue within the guaranteed SLA window.
        </p>
        <div style="background-color: #ecfdf5; border-left: 4px solid #059669; padding: 20px; margin: 20px 0; border-radius: 0 12px 12px 0;">
          <p style="color: #065f46; font-size: 16px; margin: 0; font-weight: bold;">
            👨‍💻 Assigned Engineer: ${engineerEmail}
          </p>
          <p style="color: #065f46; font-size: 15px; margin: 10px 0 0 0;">
            This person is assigned to take care of this issue and you will receive an update once the issue gets resolved. Rest assured and let the engineer take some time to take care of it.
          </p>
        </div>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          You can track live progress, view attached photo evidence, or engage in community discussions anytime by logging into the Civic Portal dashboard.
        </p>
      </div>
      <div style="padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">© 2026 Civic Portal Enterprise • End-to-End Verified</p>
      </div>
    </div>
  `;
  return sendEmail({ to: citizenEmail, subject, html });
};

/**
 * Email #3: Citizen Confirmation of Issue Resolved / Fulfilled
 */
const sendCitizenIssueResolvedEmail = async (citizenEmail, engineerEmail, ticket) => {
  const subject = `[RESOLVED] Your Reported Issue Has Been Completed: ${ticket.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
        <h2 style="color: #10b981; margin: 0;">🎉 Issue Successfully Completed</h2>
        <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Final Municipal Resolution Confirmation</p>
      </div>
      <div style="padding: 20px 0;">
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">Dear Citizen,</p>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          We are thrilled to inform you that the municipal engineer assigned to your report (<strong>${engineerEmail}</strong>) has officially marked the reported issue as <strong>completed and fulfilled</strong>!
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 10px;">${ticket.title}</h3>
          <p style="color: #475569; font-size: 14px; margin: 0 0 10px 0; white-space: pre-wrap;">${ticket.description}</p>
          <span style="display: inline-block; padding: 4px 12px; background-color: #10b981; color: white; font-size: 12px; font-weight: bold; border-radius: 20px;">RESOLVED</span>
        </div>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          Thank you for your proactive civic pride and for helping improve our neighborhood! You have earned verified civic credits for this successful resolution.
        </p>
      </div>
      <div style="padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">© 2026 Civic Portal Enterprise • End-to-End Verified</p>
      </div>
    </div>
  `;
  return sendEmail({ to: citizenEmail, subject, html });
};

module.exports = {
  getTransporter,
  sendEmail,
  sendCitizenReportSubmittedEmail,
  sendEngineerBroadcastEmail,
  sendEngineerAssignmentOfferEmail,
  sendCitizenEngineerAssignedEmail,
  sendCitizenIssueResolvedEmail,
};
