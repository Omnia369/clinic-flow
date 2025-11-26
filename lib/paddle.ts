import crypto from 'crypto';
import { serialize } from 'php-serialize';

function normalize(value: any): any {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    if (Array.isArray(value)) return value.map(normalize);
    const out: Record<string, any> = {};
    Object.keys(value).sort().forEach(k => {
      out[k] = normalize((value as any)[k]);
    });
    return out;
  }
  return String(value);
}

export function coercePublicKeyFromEnv(raw?: string | null): string | null {
  if (!raw) return null;
  // Allow single-line env with \n sequences
  return raw.replace(/\\n/g, '\n');
}

export function buildSerializedPayload(fields: Record<string, any>): string {
  const copy: Record<string, any> = { ...fields };
  delete copy['p_signature'];
  const ordered: Record<string, any> = {};
  Object.keys(copy)
    .sort()
    .forEach((k) => {
      ordered[k] = normalize(copy[k]);
    });
  return serialize(ordered);
}

export function verifyPaddleSignature(fields: Record<string, any>, publicKeyPem: string): boolean {
  try {
    const sigB64 = fields['p_signature'];
    if (!sigB64) return false;
    const signature = Buffer.from(String(sigB64), 'base64');
    const serialized = buildSerializedPayload(fields);

    const verifier = crypto.createVerify('sha1');
    verifier.update(serialized, 'utf8');
    verifier.end();

    return verifier.verify(publicKeyPem, signature);
  } catch {
    return false;
  }
}
