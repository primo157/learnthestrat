import React, { useId, useState } from 'react';
import { ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { isValidEmail, submitLead } from './leads';
import { track } from './analytics';

// Email capture form used in the hero and the final CTA.
// `subscribed` / `onSuccess` are owned by the page so both forms show the
// success state once the visitor has signed up from either one.
export default function EmailCaptureForm({ source, subscribed, onSuccess, inputRef, note }) {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [error, setError] = useState('');
  const id = useId();
  const errorId = `${id}-error`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;

    const value = email.trim();
    if (!isValidEmail(value)) {
      setStatus('error');
      setError(value ? 'Please enter a valid email address.' : 'Please enter your email address.');
      return;
    }

    setStatus('loading');
    setError('');
    track('catalyst_form_submit', { location: source });

    try {
      await submitLead({ email: value, source, website });
      track('catalyst_lead_success', { location: source });
      setStatus('idle');
      onSuccess(value);
    } catch (err) {
      track('catalyst_lead_error', { location: source });
      setStatus('error');
      setError(err.message);
    }
  };

  if (subscribed) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full p-5 sm:p-6 rounded-xl border border-green-500/40 bg-green-500/10 backdrop-blur-xl text-left"
      >
        <div className="flex gap-3 items-start">
          <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white text-base sm:text-lg">Check your inbox.</p>
            <p className="text-gray-300 text-sm sm:text-base mt-1 leading-relaxed">
              The Catalyst Guide is on its way to <span className="text-green-300 font-semibold break-all">{subscribed}</span>.
              If you don't see it in a few minutes, check your spam or promotions folder.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasError = status === 'error' && error;

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
        <input
          ref={inputRef}
          id={`${id}-email`}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck="false"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          disabled={status === 'loading'}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? errorId : undefined}
          className={`flex-1 min-w-0 px-5 py-4 sm:py-5 rounded-lg bg-black/60 backdrop-blur-xl border-2 text-white text-base placeholder-gray-500 outline-none transition-colors duration-300 disabled:opacity-60 ${
            hasError ? 'border-red-500/60 focus:border-red-400' : 'border-green-500/30 focus:border-green-400 hover:border-green-500/50'
          }`}
        />

        {/* Honeypot — hidden from people and assistive tech */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
        />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="group relative px-6 sm:px-8 py-4 sm:py-5 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 text-base shadow-2xl shadow-green-500/40 overflow-hidden whitespace-nowrap disabled:cursor-wait"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600 group-hover:from-green-500 group-hover:via-green-600 group-hover:to-green-700 transition-all duration-300"></div>
          <span className="relative z-10 text-black flex items-center justify-center gap-2">
            {status === 'loading' ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Sending...
              </>
            ) : (
              <>
                Get the Free Catalyst Guide
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </div>

      <div aria-live="polite">
        {hasError && (
          <p id={errorId} className="flex items-center gap-2 mt-3 text-sm text-red-400 font-medium text-left">
            <AlertCircle size={16} className="flex-shrink-0" /> {error}
          </p>
        )}
      </div>

      {note && <p className="mt-3 text-xs sm:text-sm text-gray-500 font-semibold">{note}</p>}
    </form>
  );
}
