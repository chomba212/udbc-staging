import type { EnrollmentOption, EnrollmentRequest, EnrollmentResult } from './types';

// The Sqooli API does not permit browser cross-origin requests. In production,
// use the PHP relay bundled with the UDBC site; Vite's proxy remains available
// when running the landing site locally.
const defaultBaseUrl = import.meta.env.DEV ? '/sqooli-api' : '/sqooli-api.php';
const baseUrl = (import.meta.env.VITE_SQOOLI_API_BASE_URL ?? defaultBaseUrl).replace(/\/$/, '');
const apiVersion = import.meta.env.VITE_SQOOLI_API_VERSION ?? '1.0';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = baseUrl.endsWith('.php')
    ? new URL(baseUrl, window.location.origin)
    : new URL(`${baseUrl}${path}`, window.location.origin);
  if (baseUrl.endsWith('.php')) url.searchParams.set('path', path);
  url.searchParams.set('api-version', apiVersion);
  const response = await fetch(url, { ...init, headers: { Accept: 'application/json', ...init?.headers } });
  if (!response.ok) {
    const body = await response.text();
    let message = body;
    try {
      const parsed = JSON.parse(body) as { message?: string; title?: string; errors?: Record<string, string[]> };
      message = parsed.message ?? parsed.title ?? Object.values(parsed.errors ?? {}).flat().join(' ');
    } catch {
      // Use the plain-text response when the API does not return JSON.
    }
    throw new Error(message || `Sqooli API request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export const sqooli = {
  getPrograms: () => request<EnrollmentOption[] | { data?: EnrollmentOption[]; value?: EnrollmentOption[] }>('/Enrollment/programs'),
  getIntakes: () => request<EnrollmentOption[] | { data?: EnrollmentOption[]; value?: EnrollmentOption[] }>('/Enrollment/intakes'),
  getCountries: () => request<Record<string, string[]>>('/Enrollment/countries'),
  getEnrollment: (referenceNumber: string) => request<EnrollmentResult>(`/Enrollment/${encodeURIComponent(referenceNumber)}`),
  getStatus: (enrollmentId: number) => request<EnrollmentResult>(`/Enrollment/${enrollmentId}/status`),
  createEnrollment: (payload: EnrollmentRequest) => request<EnrollmentResult>('/Enrollment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }),
};
