import { Attachment } from '../types';

export const generateEml = (
  to: string,
  cc: string,
  bcc: string,
  subject: string,
  body: string,
  isHtml: boolean,
  attachments: Attachment[]
): string => {
  let eml = '';
  eml += `To: ${to}\n`;
  if (cc) eml += `Cc: ${cc}\n`;
  if (bcc) eml += `Bcc: ${bcc}\n`;
  eml += `Subject: ${subject}\n`;
  eml += `X-Unsent: 1\n`;
  
  const boundary = "----=_NextPart_" + Math.random().toString(36).substring(2);
  
  eml += `MIME-Version: 1.0\n`;
  eml += `Content-Type: multipart/mixed; boundary="${boundary}"\n\n`;
  
  eml += `This is a multi-part message in MIME format.\n\n`;
  
  // Body part
  eml += `--${boundary}\n`;
  if (isHtml) {
    eml += `Content-Type: text/html; charset="utf-8"\n`;
  } else {
    eml += `Content-Type: text/plain; charset="utf-8"\n`;
  }
  eml += `Content-Transfer-Encoding: base64\n\n`;
  
  // Base64 encode the body (handling UTF-8)
  const base64Body = btoa(unescape(encodeURIComponent(body)));
  const bodyLines = base64Body.match(/.{1,76}/g) || [];
  eml += bodyLines.join('\n') + `\n\n`;
  
  // Attachments
  if (attachments && attachments.length > 0) {
    attachments.forEach(att => {
      eml += `--${boundary}\n`;
      eml += `Content-Type: ${att.type || 'application/octet-stream'}; name="${att.name}"\n`;
      eml += `Content-Disposition: attachment; filename="${att.name}"\n`;
      eml += `Content-Transfer-Encoding: base64\n\n`;
      
      // Extract base64 data (remove data:image/png;base64, prefix)
      const base64Data = att.data.includes(',') ? att.data.split(',')[1] : att.data;
      
      const lines = base64Data.match(/.{1,76}/g) || [];
      eml += lines.join('\n') + `\n\n`;
    });
  }
  
  eml += `--${boundary}--\n`;
  
  return eml;
};

export const downloadEml = (emlContent: string, filename: string) => {
  const blob = new Blob([emlContent], { type: 'message/rfc822' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.eml') ? filename : `${filename}.eml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
