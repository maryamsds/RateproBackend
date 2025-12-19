// services/audience/enrichmentService.js
// Simple heuristics for enrichment; designed to be easily extended without extra deps
function inferLocationFromPhone(phone) {
  if (!phone) return {};
  // Fallback prefix-based hints
  if (phone.startsWith('+1')) return { country: 'US/CA', countryCode: '1' };
  if (phone.startsWith('+44')) return { country: 'UK', countryCode: '44' };
  if (phone.startsWith('+91')) return { country: 'IN', countryCode: '91' };
  if (phone.startsWith('+61')) return { country: 'AU', countryCode: '61' };
  if (phone.startsWith('+81')) return { country: 'JP', countryCode: '81' };
  return {};
}

function inferFromEmail(email) {
  if (!email || !email.includes('@')) return {};
  const [local, domain] = email.split('@');
  const domainParts = domain.split('.');
  const company = domainParts.length > 1 ? domainParts[domainParts.length - 2] : domainParts[0];

  // naive gender inference from first name fragment
  const firstToken = local.split(/[._-]/)[0];
  const gender = ['mr', 'sir'].includes(firstToken?.toLowerCase()) ? 'male'
    : ['mrs', 'ms', 'miss'].includes(firstToken?.toLowerCase()) ? 'female'
      : undefined;

  return { company, domain, gender };
}

function enrichContact(contact = {}) {
  const { phone, email } = contact;
  const phoneHints = inferLocationFromPhone(phone);
  const emailHints = inferFromEmail(email);

  const enrichment = {
    ...phoneHints,
    ...emailHints,
    source: 'auto',
    inferredAt: new Date(),
  };

  return enrichment;
}

module.exports = {
  enrichContact,
};
