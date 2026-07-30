import { useEffect, useState } from 'react';
import { sqooli } from './sqooli';

export type ProgramOption = { id: number; name: string; programName: string; duration: string };
export type IntakeOption = { id: number; name: string; startDate: string; endDate: string };

const fallbackPrograms: ProgramOption[] = [
  // Verified live Sqooli sub-programme IDs. These keep enrolment working when
  // the options lookup is temporarily unavailable on the hosting server.
  { id: 2, name: 'Full-Time Certificate of Theology', programName: 'Certificate of Theology — First Intake 2026', duration: '12 week(s)' },
  { id: 3, name: 'Part-Time Certificate of Theology', programName: 'Certificate of Theology — First Intake 2026', duration: '12 week(s)' },
];
const fallbackIntakes: IntakeOption[] = [{ id: 0, name: 'July Intake 2026', startDate: '', endDate: '' }];
const fallbackCountries = ['Kenya', 'Uganda', 'Tanzania', 'Burundi', 'DR Congo'];
const unwrap = <T,>(value: T[] | { data?: T[]; value?: T[] }) => Array.isArray(value) ? value : value.data ?? value.value ?? [];

function theologyPrograms(options: ProgramOption[]) {
  const seen = new Set<string>();
  return options.filter(option => {
    const name = option.name.toLowerCase().replace(/\s+/g, ' ').trim();
    // Sqooli currently names these "Certificate in Theology". Accept both
    // "in" and "of" so a wording change does not replace live records with
    // local fallback entries that do not have a valid Sqooli programme ID.
    const isTheologyStudyMode =
      (name.includes('full-time') || name.includes('part-time')) &&
      name.includes('certificate') &&
      name.includes('theology');
    if (!isTheologyStudyMode || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}

export function useEnrollmentOptions() {
  const [programs, setPrograms] = useState(fallbackPrograms);
  const [intakes, setIntakes] = useState(fallbackIntakes);
  const [countries, setCountries] = useState(fallbackCountries);
  const [source, setSource] = useState<'loading' | 'sqooli' | 'fallback'>('loading');

  useEffect(() => {
    Promise.all([sqooli.getPrograms(), sqooli.getIntakes(), sqooli.getCountries()])
      .then(([programData, intakeData, countryData]) => {
        const loadedPrograms = theologyPrograms(unwrap(programData) as ProgramOption[]);
        const loadedIntakes = unwrap(intakeData) as IntakeOption[];
        const loadedCountries = Array.from(new Set([...fallbackCountries, ...Object.keys(countryData as Record<string, string[]>)]));
        if (loadedPrograms.length) setPrograms(loadedPrograms);
        if (loadedIntakes.length) setIntakes(loadedIntakes);
        if (loadedCountries.length) setCountries(loadedCountries);
        setSource('sqooli');
      })
      .catch(() => setSource('fallback'));
  }, []);

  return { programs, intakes, countries, source };
}
