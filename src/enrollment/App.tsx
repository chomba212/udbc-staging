import { FormEvent, useEffect, useState } from 'react';
import { useEnrollmentOptions } from './api/useEnrollmentOptions';
import { sqooli } from './api';
import udbcLogo from '../assets/images/udbc-logo.jpeg';

type Details = { firstName: string; lastName: string; email: string; phone: string };
type RequiredProfile = { idNumber: string; dob: string; gender: string; county: string };
const countries = ['Kenya', 'Uganda', 'Tanzania', 'Burundi', 'DR Congo'];
const flags = ['🇰🇪', '🇺🇬', '🇹🇿', '🇧🇮', '🇨🇩'];
const countryCodes: Record<string, string> = { Kenya: '+254', Uganda: '+256', Tanzania: '+255', Burundi: '+257', 'DR Congo': '+243' };
const programmes = [
  ['Full-Time Certificate of Theology', 'Weekday classes · campus + online · 12 weeks'],
  ['Part-Time Certificate of Theology', 'Evenings 5:30–8:30 PM + Saturdays · 12 weeks'],
];

export default function App() {
  const { programs, intakes, countries: apiCountries, source } = useEnrollmentOptions();
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<Details>({ firstName: '', lastName: '', email: '', phone: '' });
  const [profile, setProfile] = useState<RequiredProfile>({ idNumber: '', dob: '', gender: '', county: '' });
  const [country, setCountry] = useState('Tanzania');
  const [phoneCode, setPhoneCode] = useState('+255');
  const [programme, setProgramme] = useState(programmes[1][0]);
  const [intake, setIntake] = useState('July Intake 2026');
  const [channel, setChannel] = useState('WhatsApp');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const fullName = `${details.firstName} ${details.lastName}`;
  useEffect(() => { if (programs.length && !programs.some(item => item.name === programme)) setProgramme(programs[0].name); }, [programs, programme]);
  useEffect(() => { if (intakes.length && !intakes.some(item => item.name === intake)) setIntake(intakes[0].name); }, [intakes, intake]);
  useEffect(() => { if (apiCountries.length && !apiCountries.includes(country)) setCountry(apiCountries[0]); }, [apiCountries, country]);
  const edit = (key: keyof Details, value: string) => setDetails({ ...details, [key]: value });
  const editProfile = (key: keyof RequiredProfile, value: string) => setProfile({ ...profile, [key]: value });
  const selectPhoneCode = (code: string) => {
    setPhoneCode(code);
    const matchingCountry = Object.entries(countryCodes).find(([, countryCode]) => countryCode === code)?.[0];
    if (matchingCountry) setCountry(matchingCountry);
  };
  const selectCountry = (selectedCountry: string) => {
    setCountry(selectedCountry);
    const matchingPhoneCode = countryCodes[selectedCountry];
    if (matchingPhoneCode) setPhoneCode(matchingPhoneCode);
  };
  const go = (next: number) => { setStep(next); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const review = (event: FormEvent) => {
    event.preventDefault();
    go(2);
  };
  const submitApplication = async () => {
    if (!agreed || isSubmitting) return;
    const selectedProgram = programs.find(item => item.name === programme);
    if (!selectedProgram || !selectedProgram.id) {
      setSubmissionError('The selected programme is unavailable. Please choose a live Sqooli programme and try again.');
      return;
    }
    setIsSubmitting(true);
    setSubmissionError('');
    try {
      const result = await sqooli.createEnrollment({ ...details, idNumber: null, dob: null, gender: null, county: null, phone: `${phoneCode}${details.phone.replace(/\s/g, '')}`, country, subProgramId: selectedProgram.id, intake, studyMode: programme.startsWith('Part') ? 'Part-time' : 'Full-time' });
      setReferenceNumber(result.referenceNumber ?? (result.id ? `#${result.id}` : ''));
      setSubmitted(true);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'We could not submit your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return <main className="site-shell">
    <header className="topbar"><a className="brand" href="#"><img className="brand-mark" src={udbcLogo} alt="UDBC logo"/><span><strong>UDBC</strong><small>UFUFUO DIGITAL BIBLE COLLEGE</small></span></a><div className="top-actions"><a className="whatsapp" href="https://wa.me/255790533002">● WhatsApp +255 790 533 002</a><span className="no-payment">No payment at application</span></div></header>
    <section className="hero"><span className="intake">▣ {intake.toUpperCase()}</span><h1>LISHA <em>KONDOO</em> ZANGU</h1><p>— John 21:17 · Certificate in Theology</p></section>
    <nav className="steps" aria-label="Application progress">{['Personal Information', 'Review', 'Confirm & Submit'].map((name, index) => <><div className={`step ${step === index + 1 ? 'active' : step > index + 1 ? 'complete' : ''}`} key={name}><span>{index + 1}</span>{name}</div>{index < 2 && <i key={`${name}-line`}/>}</>)}</nav>
    {step === 1 && <section className="screen active"><div className="grid"><form className="card form-card" onSubmit={review}><h2>♟ Personal Information</h2><div className="card-body"><div className="two-col"><Field label="FIRST NAME *" value={details.firstName} onChange={v => edit('firstName', v)}/><Field label="LAST NAME *" value={details.lastName} onChange={v => edit('lastName', v)}/></div><div className="two-col"><Field label="EMAIL *" type="email" value={details.email} onChange={v => edit('email', v)}/><PhoneField code={phoneCode} number={details.phone} onCodeChange={selectPhoneCode} onNumberChange={v => edit('phone', v)}/></div><fieldset><legend>COUNTRY *</legend><div className="pills">{apiCountries.map(item => <button type="button" className={country === item ? 'selected' : ''} onClick={() => selectCountry(item)} key={item}>{countryFlag(item)} {item}</button>)}</div></fieldset><div className="programme"><h3>🎓 Programme <span>{source === 'loading' ? 'Loading Sqooli options…' : 'Live Sqooli options'}</span></h3><label className="intake-select">CHOOSE INTAKE<select value={intake} onChange={e => setIntake(e.target.value)}>{intakes.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}</select></label><p>CHOOSE YOUR SUB-PROGRAMME *</p><ProgrammeOptions options={programs} selected={programme} onSelect={setProgramme}/></div><button className="primary" type="submit">Review Application <span>→</span></button><small className="form-note">3 fields shorter than the old form — ID/passport, DOB, gender & academic background move to post-admission profile completion.</small></div></form><aside className="side"><Summary country={country} programme={programme} intake={intake}/><Help/></aside></div></section>}
    {step === 2 && <section className="screen active"><div className="grid review-grid"><div className="card review-card"><h2>▰ Review Your Application <small>Confirm details before submission — no payment due</small></h2><div className="card-body"><DetailsList heading="PERSONAL DETAILS" rows={[["Full Name", fullName], ["Email", details.email], ["Phone (WhatsApp)", `${phoneCode} ${details.phone}`], ["Country", country]]}/><DetailsList heading="PROGRAMME DETAILS" rows={[["Intake", intake], ["Programme", "Certificate in Theology"], ["Sub-programme", programme], ["Duration", programs.find(item => item.name === programme)?.duration ?? "12 week(s)"]]}/></div><div className="review-actions"><button className="secondary" onClick={() => go(1)}>← &nbsp;Back to edit</button><button className="primary" onClick={() => go(3)}>Everything is correct — Continue &nbsp;→</button></div></div><Help compact/></div></section>}
    {step === 3 && <section className="screen active"><div className="grid confirm-grid"><div className="card confirm-card"><h2>☑ Confirm & Submit</h2><div className="card-body"><h3>How should we confirm your application?</h3><div className="email-row">✉ &nbsp;<b>Email — {details.email}</b><small>Always send your admission letter here</small><span>Default ✓</span></div><p className="option-label">ADD AN EXTRA CHANNEL (choose one)</p><div className="programme-options">{['WhatsApp', 'SMS'].map(item => <button type="button" className={`notification ${channel === item ? 'selected' : ''}`} onClick={() => setChannel(item)} key={item}><b>{item === 'WhatsApp' ? '●' : '◌'} {item}</b><small>{item === 'WhatsApp' ? 'Confirmation + all updates in one thread' : 'Plain text confirmation · works on any phone'}</small></button>)}</div><label className="check"><input checked={agreed} onChange={e => setAgreed(e.target.checked)} type="checkbox"/><span>I confirm my details are correct and accept the UDBC student code of conduct & Sqooli terms.</span></label><button className="primary" type="button" disabled={isSubmitting} onClick={submitApplication}>{isSubmitting ? 'Submitting…' : 'Submit Application'} <span>→</span></button>{!agreed && <small className="agreement-note">Please tick the confirmation box before submitting.</small>}{submissionError && <small className="agreement-note" role="alert">{submissionError}</small>}<div className="next"><b>What happens next — no payment yet</b><ol><li>Instant confirmation on email + {channel}</li><li>Admissions reviews your application (72h)</li><li>If admitted: invitation with payment instructions</li><li>Pay then — M-PESA STK, Paysbill or wallet · kit releases after payment</li></ol></div></div></div>{submitted && <aside className="submitted-card"><div className="success">✓</div><h3>After submit — Karibu!</h3><p>Application UDBC-APP-2026-417 received. Track it any time on WhatsApp or the status page — exam invite follows once documents are verified.</p><span className="sent">● Sent to {channel.toLowerCase()} + email</span></aside>}</div></section>}
    {step === 1 && <section className="screen active"><div className="card form-card"><div className="card-body"><h3>Required enrolment details</h3><div className="two-col"><Field label="ID / PASSPORT NUMBER *" value={profile.idNumber} onChange={v => editProfile('idNumber', v)}/><Field label="DATE OF BIRTH *" type="date" value={profile.dob} onChange={v => editProfile('dob', v)}/></div><div className="two-col"><label>GENDER *<select required value={profile.gender} onChange={e => editProfile('gender', e.target.value)}><option value="" disabled>Select gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></label><Field label="COUNTY / REGION *" value={profile.county} onChange={v => editProfile('county', v)}/></div></div></div></section>}
    <footer>UDBC — Ufufuo Digital Bible College · powered by SQOOLI<br/><small>hello@sqooli.africa · ● +255 790 533 002 (WhatsApp) · © 2026 Sqooli</small></footer>
  </main>;
}
function Field({label, value, type = 'text', onChange}: {label:string; value:string; type?:string; onChange:(v:string)=>void}) { return <label>{label}<input type={type} required value={value} onChange={e => onChange(e.target.value)}/></label>; }
function PhoneField({code, number, onCodeChange, onNumberChange}: {code:string; number:string; onCodeChange:(v:string)=>void; onNumberChange:(v:string)=>void}) { return <label>PHONE NUMBER (WhatsApp preferred) *<div className="phone-input"><select value={code} onChange={e => onCodeChange(e.target.value)} aria-label="Country calling code">{countries.map((country, index) => <option value={countryCodes[country]} key={country}>{flags[index]} {countryCodes[country]}</option>)}</select><input type="tel" inputMode="tel" placeholder="Phone number" required value={number} onChange={e => onNumberChange(e.target.value)}/></div></label>; }
function ProgrammeOptions({options, selected, onSelect}: {options:{id:number; name:string; programName:string; duration:string}[]; selected:string; onSelect:(v:string)=>void}) { return <div className="programme-options">{options.map(item => <button type="button" key={item.id || item.name} className={selected === item.name ? 'selected' : ''} onClick={() => onSelect(item.name)}><b>{item.name}</b><small>{item.programName} · {item.duration}</small></button>)}</div>; }
function countryFlag(country: string) { return ({ Kenya: '🇰🇪', Uganda: '🇺🇬', Tanzania: '🇹🇿', Burundi: '🇧🇮', 'DR Congo': '🇨🇩' } as Record<string, string>)[country] ?? '🏳️'; }
function Summary({country, programme, intake}: {country:string; programme:string; intake:string}) { const rows = [['Intake',intake],['Programme','Certificate in Theology'],['Sub-programme',programme.startsWith('Part') ? 'Part-time' : 'Full-time'],['Duration','12 week(s)'],['Country',country],['Mode','Campus + Online']]; return <div className="card summary"><h2>☑ Application Summary</h2><div className="card-body">{rows.map(([a,b]) => <div className="summary-row" key={a}><span>{a}</span><b>{b}</b></div>)}<div className="notice"><b>No payment now →</b><br/><small>Fees apply only after your application is received and you are admitted — payment instructions follow by email/WhatsApp.</small></div></div></div>; }
function DetailsList({heading, rows}: {heading:string; rows:string[][]}) { return <><div className="detail-heading">{heading}</div>{rows.map(([a,b]) => <div className="detail-row" key={a}><span>{a}</span><b>{b}</b></div>)}</>; }
function Help({compact = false}: {compact?:boolean}) { return <aside className={`help ${compact ? 'compact' : ''}`}><b>● {compact ? 'Unsure about anything?' : 'WhatsApp — everything in one thread'}</b>{compact ? <p>Chat with admissions on WhatsApp before you submit — we reply in minutes, Kiswahili au Kiingereza.</p> : <ul><li>Ask about programmes & requirements</li><li>Get help finishing this form</li><li>Receive your confirmation & updates</li><li>Payment instructions after admission</li></ul>}<a className="whatsapp-button" href="https://wa.me/255790533002">{compact ? 'Ask on WhatsApp' : 'Chat with UDBC on WhatsApp'}</a></aside>; }
