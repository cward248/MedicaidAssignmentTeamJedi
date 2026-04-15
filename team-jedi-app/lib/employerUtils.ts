// Utilityfor employer verification

export function generateEmployerLink(employerName: string, taxId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const params = new URLSearchParams({ employer: employerName, taxId });
  return `${baseUrl}/employer-verify?${params.toString()}`;
}