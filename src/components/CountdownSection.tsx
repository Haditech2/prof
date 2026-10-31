import React, { useState, useEffect } from 'react';
import { CountdownStyle, EventData } from '../types';
import { Clock, Sparkles, CheckCircle2 } from 'lucide-react';

interface CountdownSectionProps {
  event: EventData;
  activeStyle?: CountdownStyle;
  onStyleChange?: (style: CountdownStyle) => void;
  standalone?: boolean;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({
  event,
  activeStyle,
  onStyleChange,
  standalone = true
}) => {
  const currentStyle = activeStyle || event.countdownStyle || 'editorial';
  
  // Simulation mode for testing event-day and post-event states
  const [simulationState, setSimulationState] = useState<'normal' | 'event-day' | 'post-event'>('normal');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEventDay: false,
    isPast: false
  });

  useEffect(() => {
    if (simulationState === 'event-day') {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isEventDay: true,
        isPast: false
      });
      return;
    }

    if (simulationState === 'post-event') {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isEventDay: false,
        isPast: true
      });
      return;
    }

    const calculateTime = () => {
      try {
        const [year, month, day] = event.date.split('-').map(Number);
        const [hours, minutes] = (event.startTime || '14:00').split(':').map(Number);
        
        const targetDate = new Date(year, month - 1, day, hours, minutes, 0).getTime();
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
          // If within 24 hours of start
          const oneDayMs = 24 * 60 * 60 * 1000;
          if (Math.abs(difference) <= oneDayMs) {
            setTimeLeft({
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0,
              isEventDay: true,
              isPast: false
            });
          } else {
            setTimeLeft({
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0,
              isEventDay: false,
              isPast: true
            });
          }
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hrs = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days,
          hours: hrs,
          minutes: mins,
          seconds: secs,
          isEventDay: false,
          isPast: false
        });
      } catch {
        setTimeLeft({
          days: 45,
          hours: 12,
          minutes: 30,
          seconds: 15,
          isEventDay: false,
          isPast: false
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [event.date, event.startTime, simulationState]);

  const stylesList: { id: CountdownStyle; name: string }[] = [
    { id: 'editorial', name: 'Editorial Serif' },
    { id: 'gold-luxe', name: 'Gold Luxe Digital' },
    { id: 'circular', name: 'Circular Minimal' },
    { id: 'flip', name: 'Flip Clock Cards' },
    { id: 'glass', name: 'Frosted Glass' },
    { id: 'banner', name: 'Velvet Banner' }
  ];

  return (
    <div className={`w-full ${standalone ? 'py-12 px-4 max-w-6xl mx-auto' : ''}`}>
      {standalone && (
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-[#F2E3B3]/30 text-xs text-[#F2E3B3] font-medium tracking-widest uppercase mb-3">
            <Clock className="w-3.5 h-3.5 text-[#D6A323]" />
            <span>Precision Real-Time Countdown</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif-luxury font-semibold text-white">
            Every Second Until the Moment
          </h2>
          <p className="text-sm text-white/70 max-w-lg mt-2 font-sans-modern">
            Synchronized with {event.timezone}. Accurately counting down to celebrate with {event.celebrants}.
          </p>

          {/* Style Switcher Controls & Simulator */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider mr-1">
              Choose Style:
            </span>
            {stylesList.map((st) => (
              <button
                key={st.id}
                onClick={() => onStyleChange && onStyleChange(st.id)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  currentStyle === st.id
                    ? 'bg-[#FFF4DC] text-[#006B66] border-[#D6A323] shadow-sm font-semibold'
                    : 'bg-white/5 text-white/80 border-white/10 hover:border-[#D6A323]/50'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>

          {/* Simulation Toggle Buttons */}
          <div className="mt-3 flex items-center space-x-3 text-xs">
            <span className="text-white/60">State Preview:</span>
            <button
              onClick={() => setSimulationState('normal')}
              className={`underline ${simulationState === 'normal' ? 'text-[#F2E3B3] font-semibold' : 'text-white/50 hover:text-white'}`}
            >
              Real-time
            </button>
            <span className="text-white/30">•</span>
            <button
              onClick={() => setSimulationState('event-day')}
              className={`underline ${simulationState === 'event-day' ? 'text-[#D6A323] font-semibold' : 'text-white/50 hover:text-white'}`}
            >
              Simulate Event Day
            </button>
            <span className="text-white/30">•</span>
            <button
              onClick={() => setSimulationState('post-event')}
              className={`underline ${simulationState === 'post-event' ? 'text-white font-semibold' : 'text-white/50 hover:text-white'}`}
            >
              Simulate Post-Event
            </button>
          </div>
        </div>
      )}

      {/* State A: Event Day Celebration Message */}
      {timeLeft.isEventDay ? (
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#006B66] via-[#004D49] to-[#003330] text-white text-center shadow-xl border border-[#D6A323]/40 max-w-3xl mx-auto animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center border border-[#D6A323] mb-4">
            <Sparkles className="w-8 h-8 text-[#D6A323] animate-pulse" />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#FFF4DC] font-semibold block mb-2">
            Today Is The Day
          </span>
          <h3 className="text-3xl md:text-5xl font-serif-luxury font-bold mb-4">
            The moment we've been waiting for is here.
          </h3>
          <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto leading-relaxed font-sans-modern">
            Welcome to the celebration of {event.celebrants}. Please join us at {event.venueName} starting at {event.startTime}.
          </p>
        </div>
      ) : timeLeft.isPast ? (
        /* State B: Post-Event Message */
        <div className="p-8 md:p-10 rounded-3xl bg-white/10 text-white text-center shadow-lg border border-white/10 max-w-2xl mx-auto">
          <CheckCircle2 className="w-12 h-12 text-[#F2E3B3] mx-auto mb-3" />
          <h3 className="text-2xl md:text-3xl font-serif-luxury font-semibold text-[#F2E3B3] mb-2">
            A Beautiful Celebration Remembered
          </h3>
          <p className="text-sm text-white/70 leading-relaxed font-sans-modern">
            This event has concluded. We extend our warmest gratitude to all guests, family, and friends who celebrated with us and shared in our joy.
          </p>
        </div>
      ) : (
        /* State C: Active Real-time Countdown Renderers */
        <div className="w-full flex justify-center">
          {/* Style 1: Minimal Editorial Serif */}
          {currentStyle === 'editorial' && (
            <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-2xl w-full text-center py-4">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-3xl md:text-5xl lg:text-6xl font-serif-luxury font-light text-white tracking-tight">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#F2E3B3] font-semibold mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Style 2: Gold Luxe Digital */}
          {currentStyle === 'gold-luxe' && (
            <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl w-full">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 md:p-6 rounded-2xl bg-white/10 backdrop-blur border border-white/15 text-center shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6A323] to-transparent" />
                  <span className="text-2xl md:text-4xl lg:text-5xl font-mono font-bold text-white tracking-widest block drop-shadow-md">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-[#F2E3B3] font-medium block mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Style 3: Circular Minimal */}
          {currentStyle === 'circular' && (
            <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl w-full text-center">
              {[
                { label: 'Days', value: timeLeft.days, max: 365 },
                { label: 'Hours', value: timeLeft.hours, max: 24 },
                { label: 'Minutes', value: timeLeft.minutes, max: 60 },
                { label: 'Seconds', value: timeLeft.seconds, max: 60 }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-[#F2E3B3]/30 flex flex-col items-center justify-center bg-white/5 shadow-sm hover:border-[#F2E3B3] transition-all">
                    <span className="text-xl md:text-3xl font-serif-luxury font-bold text-[#F2E3B3]">
                      {String(item.value).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider text-white/70 font-medium mt-2">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Style 4: Flip-Clock Glass Cards */}
          {currentStyle === 'flip' && (
            <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-xl w-full text-center">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Mins', value: timeLeft.minutes },
                { label: 'Secs', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full bg-[#003330] text-white rounded-xl shadow-lg border border-[#D6A323]/40 overflow-hidden relative">
                    <div className="py-3 md:py-5 px-2">
                      <span className="text-2xl md:text-4xl font-bold font-mono text-[#FFF4DC]">
                        {String(item.value).padStart(2, '0')}
                      </span>
                    </div>
                    {/* Horizontal dividing split line for flip effect */}
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/60 shadow-sm" />
                  </div>
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/70 font-semibold mt-1.5">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Style 5: Frosted Glass Ivory */}
          {currentStyle === 'glass' && (
            <div className="grid grid-cols-4 gap-3 md:gap-5 max-w-2xl w-full text-center">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <span className="text-2xl md:text-4xl font-serif-luxury font-semibold text-[#F2E3B3] block">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#F2E3B3]/80 font-semibold block mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Style 6: Velvet Banner */}
          {currentStyle === 'banner' && (
            <div className="w-full max-w-4xl bg-gradient-to-r from-[#003330] via-[#006B66] to-[#003330] text-white p-6 md:p-8 rounded-3xl border border-[#D6A323]/30 shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#FFF4DC] font-semibold">
                    Live Event Clock
                  </span>
                  <h4 className="text-xl md:text-2xl font-serif-luxury font-medium mt-1">
                    Counting down every heartbeat
                  </h4>
                </div>
                <div className="grid grid-cols-4 gap-4 md:gap-6 text-center">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Minutes', value: timeLeft.minutes },
                    { label: 'Seconds', value: timeLeft.seconds }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md px-3 py-2 md:px-4 md:py-3 rounded-xl border border-white/10">
                      <span className="text-xl md:text-3xl font-mono font-bold text-[#FFF4DC]">
                        {String(item.value).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-white/70 block mt-0.5">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
