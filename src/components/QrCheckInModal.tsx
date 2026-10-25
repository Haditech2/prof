import React, { useState } from 'react';
import { RSVPResponse } from '../types';
import { QrCode, Search, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface QrCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  rsvps: RSVPResponse[];
  onCheckInGuest: (rsvpId: string) => void;
  onSuccessToast?: (msg: string) => void;
}

export const QrCheckInModal: React.FC<QrCheckInModalProps> = ({
  isOpen,
  onClose,
  rsvps,
  onCheckInGuest,
  onSuccessToast
}) => {
  const [ticketInput, setTicketInput] = useState('');
  const [scannedResult, setScannedResult] = useState<RSVPResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleVerifyTicket = (codeToVerify?: string) => {
    const code = (codeToVerify || ticketInput).trim().toUpperCase();
    if (!code) return;

    const match = rsvps.find(r => r.qrTicketCode.toUpperCase() === code);

    if (match) {
      setScannedResult(match);
      setErrorMessage('');
      if (!match.checkedIn) {
        onCheckInGuest(match.id);
        if (onSuccessToast) onSuccessToast(`Guest ${match.fullName} verified and checked in!`);
      }
    } else {
      setScannedResult(null);
      setErrorMessage(`Ticket code "${code}" was not found in the verified attendee registry.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#C9A227]/40 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B6B3A]/10 border border-[#C9A227]/30 flex items-center justify-center text-[#0B6B3A]">
              <QrCode className="w-5 h-5 text-[#C9A227]" />
            </div>
            <div>
              <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F17]">
                Venue QR Reception Scanner
              </h3>
              <p className="text-xs text-gray-500 font-sans-modern">
                Scan or enter the encrypted code from the guest's Digital Pass.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verification Input & Quick Code Triggers */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Ticket Code (e.g. EA-AY-88219)"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyTicket()}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs font-mono uppercase focus:outline-hidden focus:border-[#C9A227]"
              />
            </div>
            <button
              onClick={() => handleVerifyTicket()}
              className="px-5 py-2.5 rounded-xl bg-[#0B6B3A] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#064E2B] transition-all"
            >
              Verify
            </button>
          </div>

          {/* Quick Demo Scan Helpers */}
          <div className="bg-[#F6FAF7] p-3 rounded-2xl border border-[#C9A227]/20">
            <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1.5">
              Simulate Door Arrival (Click sample guest ticket):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {rsvps.slice(0, 4).map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setTicketInput(r.qrTicketCode);
                    handleVerifyTicket(r.qrTicketCode);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-[10px] font-mono text-gray-700 hover:border-[#C9A227] hover:text-[#0B6B3A]"
                >
                  {r.fullName.split(' ')[0]}: {r.qrTicketCode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Feedback Result */}
        {scannedResult && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 animate-fade-in">
            <div className="flex items-center space-x-2 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Verification Successful & Checked In
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase text-gray-500 block">Guest Name</span>
                <span className="font-bold text-gray-900">{scannedResult.fullName}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-gray-500 block">Category</span>
                <span className="font-semibold text-emerald-800">{scannedResult.groupCategory}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-gray-500 block">Party Size</span>
                <span className="font-semibold text-gray-800">{scannedResult.guestCount} Guests</span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-gray-500 block">Dietary</span>
                <span className="font-semibold text-gray-800">{scannedResult.dietary}</span>
              </div>
            </div>

            {scannedResult.plusOneNames && scannedResult.plusOneNames.length > 0 && (
              <p className="text-[11px] text-gray-600 border-t border-emerald-200/60 pt-2">
                Accompanying: <strong>{scannedResult.plusOneNames.join(', ')}</strong>
              </p>
            )}
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
