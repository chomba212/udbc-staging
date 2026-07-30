/** Types taken from sqooli_v1.json's EnrollmentRequest schema. */
export type EnrollmentRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string | null;
  dob: string | null;
  gender: string | null;
  country: string;
  county: string | null;
  subProgramId: number;
  intake: string;
  studyMode: string;
  previousSchool?: string | null;
  grade?: string | null;
  subjectIds?: number[] | null;
};

export type EnrollmentResult = {
  id?: number;
  referenceNumber?: string;
  message?: string;
  status?: boolean;
  [key: string]: unknown;
};

export type EnrollmentOption = { id: number; name: string; [key: string]: unknown };
