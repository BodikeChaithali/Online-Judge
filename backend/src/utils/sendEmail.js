import dns from "dns";
import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT) || 465;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE
        ? process.env.SMTP_SECURE === "true"
        : port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }
  return transporter;
};

export const sendOtpEmail = async (to, otp, firstName) => {
  const appName = process.env.APP_NAME || "OnlineJudge";

  if (!process.env.SMTP_HOST) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP is not configured (set SMTP_* in backend/.env)");
    }
    console.log(`[DEV] SMTP not configured. OTP for ${to}: ${otp}`);
    return;
  }

  await getTransporter().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject: `${otp} is your ${appName} verification code`,
    text:
      `Hi ${firstName},\n\n` +
      `Your ${appName} verification code is: ${otp}\n\n` +
      `It expires in 10 minutes. If you didn't try to create an account, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px">
        <h2 style="margin:0 0 12px">Verify your email</h2>
        <p>Hi ${firstName}, use this code to finish creating your ${appName} account:</p>
        <p style="font-size:34px;font-weight:bold;letter-spacing:8px;margin:20px 0">${otp}</p>
        <p style="color:#555">This code expires in 10 minutes. If you didn't try to sign up, you can ignore this email.</p>
      </div>`,
  });
};

export const isRecipientRejected = (err) =>
  Boolean(err) &&
  ((Array.isArray(err.rejected) && err.rejected.length > 0) ||
    [550, 551, 553].includes(err.responseCode));

export const maskEmail = (email) => {
  const [local = "", domain = ""] = String(email).split("@");
  if (!local || !domain) return "***";
  return `${local[0]}${"*".repeat(Math.min(Math.max(local.length - 1, 3), 6))}@${domain}`;
};

const NO_RECORD = new Set(["ENODATA", "ENOTFOUND", "NXDOMAIN"]);
const DNS_TIMEOUT_MS = 4000;
const DOMAIN_CACHE_MS = 60 * 60 * 1000;
const domainCache = new Map();

const withTimeout = (promise) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () =>
        reject(Object.assign(new Error("DNS timeout"), { code: "ETIMEOUT" })),
      DNS_TIMEOUT_MS,
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

export const canReceiveMail = async (email, resolver = dns.promises) => {
  const domain = String(email).split("@").pop().toLowerCase();
  const cached = domainCache.get(domain);
  if (cached && cached.until > Date.now()) return cached.ok;

  const hasMx = async () => {
    try {
      const records = await withTimeout(resolver.resolveMx(domain));
      return records.some((r) => r.exchange && r.exchange !== ".");
    } catch (err) {
      if (NO_RECORD.has(err.code)) return false;
      throw err;
    }
  };
  const hasAddress = async () => {
    for (const lookup of ["resolve4", "resolve6"]) {
      try {
        const records = await withTimeout(resolver[lookup](domain));
        if (records.length > 0) return true;
      } catch (err) {
        if (!NO_RECORD.has(err.code)) throw err;
      }
    }
    return false;
  };

  let ok;
  try {
    ok = (await hasMx()) || (await hasAddress());
  } catch {
    return true;
  }
  if (domainCache.size > 1000) domainCache.clear();
  domainCache.set(domain, { ok, until: Date.now() + DOMAIN_CACHE_MS });
  return ok;
};

export const verifyEmailTransport = async () => {
  if (!process.env.SMTP_HOST) {
    console.warn(
      process.env.NODE_ENV === "production"
        ? "[email] SMTP_HOST is not set: sign-up emails will FAIL until you set SMTP_* in .env"
        : "[email] SMTP not configured (development: codes are printed in this console)",
    );
    return;
  }
  try {
    await getTransporter().verify();
    console.log("[email] SMTP connection OK");
  } catch (err) {
    console.error("[email] SMTP check FAILED:", err.message);
  }
};
