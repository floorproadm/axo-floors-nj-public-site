import type { CompanySettings } from '@/hooks/useCompanySettings';
import { resolveLogoUrl } from '@/hooks/useCompanySettings';

export function safeBrandPrimary(color?: string | null, fallback = '#0066FF'): string {
  if (!color) return fallback;
  const c = color.trim().toLowerCase();
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(c)) return fallback;
  const hex = c.length === 4
    ? '#' + c.slice(1).split('').map((ch) => ch + ch).join('')
    : c;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  if (brightness > 235) return fallback;
  return hex;
}

export async function resolveBrandLogo(
  settings:
    | Pick<
        CompanySettings,
        'email_logo_url' | 'logo_url' | 'proposal_logo_light_url' | 'proposal_logo_dark_url'
      >
    | null
    | undefined,
  variant: 'light' | 'dark' = 'light',
): Promise<string> {
  if (!settings) return '';
  const proposalLogo =
    variant === 'dark' ? settings.proposal_logo_dark_url : settings.proposal_logo_light_url;
  const p = proposalLogo?.trim();
  if (p && /^https?:\/\//i.test(p)) return p;
  const emailLogo = settings.email_logo_url?.trim();
  if (emailLogo && /^https?:\/\//i.test(emailLogo)) return emailLogo;
  return await resolveLogoUrl(settings.logo_url);
}
