import './Enrol.css';
import { photo5 } from '../assets/images';

const STEPS = [
  { icon: '⚏', title: 'Scan or Visit', desc: 'Scan the QR code on our flier or visit udbc.sqooli.africa. No app needed.', tint: 'blue' },
  { icon: '📞', title: 'Register', desc: 'Enter name, phone & email. Get a 6-digit OTP via SMS to verify.', tint: 'yellow' },
  { icon: '📋', title: 'Choose Grade', desc: 'Select Certificate or Diploma and your starting grade. G1 recommended for new students.', tint: 'blue' },
  { icon: '💰', title: 'Pay', desc: 'Pay via M-PESA, Tigopesa, or Airtel Money. Instant confirmation.', tint: 'yellow' },
  { icon: '🎓', title: 'Start Learning', desc: 'Welcome Kit delivered to WhatsApp & email instantly. First lesson ready in minutes.', tint: 'blue' },
];

const PAYMENTS = [
  ['🟩', 'M-PESA', 'Tanzania (primary) — STK Push to your phone'],
  ['🟦', 'Tigopesa', 'Tanzania — same digital wallet flow'],
  ['🟥', 'Airtel Money', 'Tanzania — Airtel subscribers'],
  ['🟩', 'M-PESA (Kenya)', 'Kenya — KES equivalent at checkout'],
  ['⬛', 'Voucher / Lesson Code', 'All countries — church-distributed codes'],
];

export default function Enrol() {
  return (
    <section id="enrol" className="enrol section-pad">
      <div className="container">
        <div className="enrol__top">
          <div>
            <p className="eyebrow">How to Enrol</p>
            <h2 className="enrol__title">Enrolment takes under 10 minutes</h2>
            <p className="enrol__lead">Start from your phone. No paperwork. No travel.</p>

            <div className="enrol__steps">
              {STEPS.map((s) => (
                <div className="estep" key={s.title}>
                  <span className={`estep__icon estep__icon--${s.tint}`}>{s.icon}</span>
                  <div>
                    <strong>{s.title}</strong>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="/enroll/" className="btn btn-yellow enrol__cta">Enrol Now – July 2026 Intake</a>
          </div>

          <div className="enrol__media">
            <img src={photo5} alt="Students enrolling at UDBC" />
          </div>
        </div>

        <div className="enrol__tables">
          <div>
            <p className="eyebrow">Payment Options</p>
            <div className="ptable">
              <div className="ptable__row ptable__head"><span>Method</span><span>Available In</span></div>
              {PAYMENTS.map(([icon, method, avail]) => (
                <div className="ptable__row" key={method}>
                  <span className="ptable__method"><i>{icon}</i>{method}</span>
                  <span>{avail}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">Referral Rewards Programme</p>
            <div className="ptable">
              <div className="ptable__row ptable__head"><span>Referrals Made</span><span>Reward</span></div>
              {PAYMENTS.map(([, method]) => (
                <div className="ptable__row" key={method}>
                  <span>1 successful referral</span>
                  <span>1 week free grade extension</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
