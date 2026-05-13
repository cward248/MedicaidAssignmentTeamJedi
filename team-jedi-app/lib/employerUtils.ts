// Utility for employer verification
// Alec Schulte Final Presentation Edits

export function generateEmployerLink(applicationId: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const params = new URLSearchParams({
    application: applicationId,
  });

  return `${baseUrl}/employer-verify?${params.toString()}`;
}