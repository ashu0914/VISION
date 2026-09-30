import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Footer7 } from '@/components/ui/footer-7';
import PalomarHero from '@/components/PalomarHero';
import SiteHeader from '@/components/SiteHeader';

// ── Config ──
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const OTP_TEMPLATE = import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID;
const CONTACT_TEMPLATE = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// ── Social links ──
const socialLinks = [
  {
    id: '1', name: 'Instagram',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    href: 'https://www.instagram.com/vision._travel',
  },
  {
    id: '2', name: 'LinkedIn',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    href: 'https://www.linkedin.com/in/vision-travel-14b961416',
  },
  {
    id: '3', name: 'Facebook',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    href: 'https://www.facebook.com/share/1ErEoH5VKm/',
  },
];

const CONTACT_PHONE = "+91 93159 49833";
const CONTACT_EMAIL = "vision.1820abhi@gmail.com";

// ── Generate 6-digit OTP ──
function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ── Execute reCAPTCHA v3 (Graceful Fallback) ──
async function tryRecaptcha(action) {
  try {
    if (!window.grecaptcha || !RECAPTCHA_SITE_KEY) return null;
    return await new Promise((resolve) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action })
          .then(resolve)
          .catch((err) => {
            console.warn('reCAPTCHA execution warning:', err);
            resolve(null);
          });
      });
    });
  } catch (e) {
    console.warn('reCAPTCHA error:', e);
    return null;
  }
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', numberOfPax: '', message: '', tripType: [],
  });

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const generatedOtp = useRef('');
  const otpExpiry = useRef(0);
  const otpInputRefs = useRef([]);
  const timerRef = useRef(null);

  // Form status
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Reset OTP if email changes
    if (name === 'email') {
      setOtpSent(false);
      setOtpVerified(false);
      setOtpInput(['', '', '', '', '', '']);
      setOtpError('');
    }
  };

  const handleCheckboxChange = (type, checked) => {
    setFormData((prev) => {
      const current = prev.tripType;
      if (checked) return { ...prev, tripType: [...current, type] };
      return { ...prev, tripType: current.filter((t) => t !== type) };
    });
  };

  // ── Start countdown timer ──
  const startTimer = (seconds) => {
    setOtpTimer(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Send OTP ──
  const handleSendOTP = async () => {
    if (!formData.name || !formData.email) {
      setOtpError('Please fill name and email first');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      // reCAPTCHA verification (non-blocking)
      await tryRecaptcha('send_otp');

      // Generate OTP
      const otp = generateOTP();
      generatedOtp.current = otp;
      otpExpiry.current = Date.now() + 5 * 60 * 1000; // 5 min

      // Send OTP via EmailJS
      const response = await emailjs.send(SERVICE_ID, OTP_TEMPLATE, {
        to_email: formData.email,
        to_name: formData.name,
        otp_code: otp,
      }, PUBLIC_KEY);

      console.log('EmailJS OTP Response:', response);

      setOtpSent(true);
      startTimer(300); // 5 min countdown
      setOtpInput(['', '', '', '', '', '']);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err) {
      console.error('OTP send error detail:', err);
      const errMsg = err?.text || err?.message || 'Failed to send OTP. Check email or try again.';
      setOtpError(errMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Handle OTP input ──
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Only digits
    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);
    setOtpError('');

    // Auto-focus next
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits entered
    if (newOtp.every((d) => d !== '') && newOtp.join('').length === 6) {
      verifyOTP(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpInput[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split('');
      setOtpInput(digits);
      otpInputRefs.current[5]?.focus();
      verifyOTP(pasted);
    }
  };

  // ── Verify OTP ──
  const verifyOTP = (code) => {
    if (Date.now() > otpExpiry.current) {
      setOtpError('OTP has expired. Please resend.');
      return;
    }
    if (code === generatedOtp.current) {
      setOtpVerified(true);
      setOtpError('');
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setOtpError('Invalid OTP. Please try again.');
      setOtpInput(['', '', '', '', '', '']);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }
  };

  // ── Submit Form ──
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      setOtpError('Please verify your email first');
      return;
    }

    setStatus('sending');

    try {
      await tryRecaptcha('submit_form');

      await emailjs.send(SERVICE_ID, CONTACT_TEMPLATE, {
        from_name: formData.name,
        from_email: formData.email,
        pax: formData.numberOfPax,
        trip_type: formData.tripType.join(', ') || 'Not specified',
        message: formData.message,
      }, PUBLIC_KEY);

      setStatus('sent');
      setFormData({ name: '', email: '', numberOfPax: '', message: '', tripType: [] });
      setOtpSent(false);
      setOtpVerified(false);
    } catch (err) {
      console.error('Submit error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const tripTypeOptions = [
    'Adventure Trek', 'Beach Getaway', 'Honeymoon',
    'Family Vacation', 'Solo Backpacking', 'Luxury Tour',
    'Spiritual / Pilgrimage', 'Corporate Retreat', 'Other',
  ];

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <>
    <SiteHeader />
    <PalomarHero />
    <section className="relative min-h-screen w-full overflow-hidden bg-[#06121a]">

      {/* ── Background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#06121a]/70 via-[#06121a]/50 to-[#06121a]/95" />

        {/* Animated floating particles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/15 rounded-full"
              style={{
                width: `${Math.random() * 16 + 6}px`,
                height: `${Math.random() * 16 + 6}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `contactBubble ${Math.random() * 18 + 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 8}s`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center w-full min-h-screen pt-28 pb-12 px-4 md:px-8 lg:px-12">

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl flex-grow">
          {/* Left: Title + Phone */}
          <div className="flex flex-col justify-end p-4 lg:p-8">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-lg"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Let's plan your next unforgettable journey
            </h1>
            <p className="mt-6 text-white/60 text-lg max-w-md">
              From mountain trails to coastal escapes — tell us your dream, we'll build the route.
            </p>

            {/* Phone card */}
            <a
              href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
              className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-fit no-underline"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-[#7fd8ff]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <div>
                <span className="block text-xs text-white/50 uppercase tracking-wide">Call us</span>
                <span className="text-white font-medium">{CONTACT_PHONE}</span>
              </div>
            </a>
          </div>

          {/* Right: Form Card */}
          <div className="bg-[#06121a]/90 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              Let's talk! ✈️
            </h2>

            {/* Email + Socials */}
            <div className="mb-6">
              <p className="text-white/50 text-sm mb-2">Mail us at</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#7fd8ff] hover:underline font-medium">
                {CONTACT_EMAIL}
              </a>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-white/40 text-sm">OR</span>
                {socialLinks.map((link) => (
                  <Button key={link.id} variant="outline" size="icon" asChild>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                      {link.icon}
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <hr className="my-6 border-white/10" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-white/50 text-sm">Tell us about your dream trip</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" name="name" placeholder="e.g. Rahul Sharma" value={formData.name} onChange={handleChange} required disabled={otpVerified} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required disabled={otpVerified} />
                </div>
              </div>

              {/* ── OTP Section ── */}
              {!otpVerified && (
                <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <p className="text-white/70 text-sm font-medium">📧 Email Verification</p>
                    {otpSent && otpTimer > 0 && (
                      <span className="text-xs text-[#7fd8ff] font-mono">⏳ {formatTime(otpTimer)}</span>
                    )}
                  </div>

                  {!otpSent ? (
                    <Button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={otpLoading || !formData.email || !formData.name}
                      className="w-full h-10 text-sm bg-[#7fd8ff] text-[#06121a] hover:bg-[#5cc4f0] font-semibold"
                    >
                      {otpLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          Sending OTP...
                        </span>
                      ) : '🔐 Send OTP to Email'}
                    </Button>
                  ) : (
                    <>
                      <p className="text-white/50 text-xs">Enter the 6-digit code sent to <span className="text-[#7fd8ff]">{formData.email}</span></p>
                      
                      {/* OTP Input Boxes */}
                      <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                        {otpInput.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => (otpInputRefs.current[idx] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-11 h-12 text-center text-lg font-bold rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#7fd8ff] focus:outline-none focus:ring-1 focus:ring-[#7fd8ff] transition-all"
                          />
                        ))}
                      </div>

                      {/* Resend */}
                      {otpTimer === 0 && (
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          className="text-[#7fd8ff] text-xs hover:underline w-full text-center"
                        >
                          Didn't receive? Resend OTP
                        </button>
                      )}
                    </>
                  )}

                  {otpError && (
                    <p className="text-red-400 text-xs text-center">{otpError}</p>
                  )}
                </div>
              )}

              {/* Verified badge */}
              {otpVerified && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-emerald-400 text-lg">✅</span>
                  <span className="text-emerald-300 text-sm font-medium">Email verified successfully!</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="numberOfPax">Number of Pax (Travellers)</Label>
                <Input id="numberOfPax" name="numberOfPax" type="number" min="1" placeholder="e.g. 4" value={formData.numberOfPax} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Where do you want to go?</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Dates, destinations, budget, group size — anything that helps us plan your perfect trip..."
                  className="min-h-[100px]"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-3">
                <p className="text-white/50 text-sm">I'm looking for...</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {tripTypeOptions.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <Checkbox
                        id={option.replace(/[\s\/]/g, '-').toLowerCase()}
                        checked={formData.tripType.includes(option)}
                        onCheckedChange={(checked) => handleCheckboxChange(option, checked)}
                      />
                      <Label htmlFor={option.replace(/[\s\/]/g, '-').toLowerCase()} className="text-sm font-normal cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
                disabled={status === 'sending' || !otpVerified}
              >
                {status === 'sending' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Sending...
                  </span>
                ) : status === 'sent' ? '✅ Sent — thank you!' : status === 'error' ? '❌ Failed — try again' : 'Send Message'}
              </Button>

              {!otpVerified && (
                <p className="text-white/30 text-xs text-center">Please verify your email to send the message</p>
              )}

              {status === 'sent' && (
                <p className="text-[#7fd8ff] text-sm text-center animate-fade-in">
                  ✈ We'll get back to you within 24 hours!
                </p>
              )}

              {/* reCAPTCHA branding (required by Google) */}
              <p className="text-white/20 text-[10px] text-center leading-tight">
                Protected by reCAPTCHA. Google{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy</a>{' & '}
                <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms</a>.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Bubble animation keyframes */}
      <style>{`
        @keyframes contactBubble {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
    <Footer7 />
    </>
  );
}
