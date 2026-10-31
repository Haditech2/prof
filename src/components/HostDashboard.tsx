import React, { useState } from 'react';
import { EventData, RSVPResponse, GuestGroup, AttendanceStatus } from '../types';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Search, 
  Download, 
  QrCode, 
  UserPlus, 
  Trash2, 
  Utensils, 
  Music, 
  Check, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface HostDashboardProps {
  event: EventData;
  rsvps: RSVPResponse[];
  onToggleCheckIn: (rsvpId: string) => void;
  onDeleteRsvp: (rsvpId: string) => void;
  onAddGuestManual: (newGuest: RSVPResponse) => void;
  onOpenCheckInScanner: () => void;
  onViewEventPage: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const HostDashboard: React.FC<HostDashboardProps> = ({
  event,
  rsvps,
  onToggleCheckIn,
  onDeleteRsvp,
  onAddGuestManual,
  onOpenCheckInScanner,
  onViewEventPage,
  onSuccessToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Manual Add Form State
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualCount, setManualCount] = useState(1);
  const [manualCategory, setManualCategory] = useState<GuestGroup>('General');
  const [manualDietary, setManualDietary] = useState('None');

  // KPI Calculations
  const totalRsvps = rsvps.length;
  const attendingList = rsvps.filter(r => r.attendance === 'attending');
  const totalConfirmedGuests = attendingList.reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  const declinedCount = rsvps.filter(r => r.attendance === 'declined').length;
  const tentativeCount = rsvps.filter(r => r.attendance === 'tentative').length;
  const checkedInCount = rsvps.filter(r => r.checkedIn).length;
  const responseRate = totalRsvps > 0 ? Math.round((attendingList.length / totalRsvps) * 100) : 0;

  // Filtered List
  const filteredGuests = rsvps.filter(r => {
    const matchesSearch = !searchQuery.trim() || 
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.qrTicketCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.attendance === statusFilter;
    const matchesGroup = groupFilter === 'all' || r.groupCategory === groupFilter;

    return matchesSearch && matchesStatus && matchesGroup;
  });

  // Export CSV
  const exportToCsv = () => {
    const headers = [
      'Ticket Code',
      'Full Name',
      'Attendance',
      'Party Size',
      'Accompanying Names',
      'Email',
      'Phone',
      'Category',
      'Dietary Preference',
      'Special Message',
      'Song Request',
      'Venue Checked In',
      'Check In Timestamp'
    ];

    const rows = rsvps.map(r => [
      `"${r.qrTicketCode}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.attendance.toUpperCase()}"`,
      r.guestCount,
      `"${(r.plusOneNames || []).join(', ')}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.groupCategory}"`,
      `"${r.dietary}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${(r.songRequest || '').replace(/"/g, '""')}"`,
      r.checkedIn ? 'YES' : 'NO',
      `"${r.checkedInAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.slug}-guest-directory.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onSuccessToast) onSuccessToast('Guest list exported as CSV!');
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const ticketCode = `EA-${event.slug.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newGuest: RSVPResponse = {
      id: `rsvp-manual-${Date.now()}`,
      eventId: event.id,
      fullName: manualName.trim(),
      email: manualEmail.trim() || 'secretariat@nsuk.edu.ng',
      phone: manualPhone.trim() || 'N/A',
      attendance: 'attending',
      guestCount: manualCount,
      plusOneNames: [],
      dietary: manualDietary as any,
      message: 'Directly registered by event host concierge.',
      groupCategory: manualCategory,
      submittedAt: new Date().toISOString(),
      qrTicketCode: ticketCode,
      checkedIn: false
    };

    onAddGuestManual(newGuest);
    setIsAddModalOpen(false);
    setManualName('');
    setManualEmail('');
    setManualPhone('');
    setManualCount(1);

    if (onSuccessToast) onSuccessToast(`Guest ${newGuest.fullName} successfully added to registry!`);
  };

  return (
    <div className="min-h-screen bg-[#FFF4DC] pt-28 md:pt-36 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#FFFBF2] border border-[#D6A323]/30 shadow-xs">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#008F87]/10 border border-[#D6A323]/30 text-xs font-semibold uppercase tracking-wider text-[#008F87] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6A323]" />
              <span>Event Concierge & Guest Directory</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif-luxury font-bold text-[#252A2A]">
              {event.title}
            </h1>
            <p className="text-xs text-[#252A2A]/70 font-sans-modern mt-1">
              Date: <strong>{event.date}</strong> • Venue: <strong>{event.venueName}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenCheckInScanner}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#008F87] to-[#006B66] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:scale-[1.02] transition-all flex items-center space-x-1.5 border border-[#D6A323]/40"
            >
              <QrCode className="w-4 h-4 text-[#D6A323]" />
              <span>Scan QR Check-In</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#FFFBF2] text-[#008F87] border border-[#D6A323]/40 text-xs font-semibold uppercase tracking-wider hover:bg-[#FFF4DC] transition-all flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4 text-[#D6A323]" />
              <span>Add Guest</span>
            </button>

            <button
              onClick={exportToCsv}
              className="px-4 py-2.5 rounded-xl bg-[#D6A323] text-[#003330] font-semibold text-xs uppercase tracking-wider shadow-xs hover:brightness-105 transition-all flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onViewEventPage}
              className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all flex items-center space-x-1"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#FFFBF2] p-5 rounded-2xl border border-[#D6A323]/30 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Total Responses</span>
              <Users className="w-4 h-4 text-[#D6A323]" />
            </div>
            <div className="text-2xl md:text-3xl font-bold font-serif-luxury text-[#252A2A]">
              {totalRsvps}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Submitted submissions</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-500/30 shadow-xs bg-gradient-to-br from-emerald-50/50 to-white">
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Confirmed Guests</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl md:text-3xl font-bold font-serif-luxury text-emerald-900">
              {totalConfirmedGuests}
            </div>
            <div className="text-[10px] text-emerald-700 mt-1">
              Includes +1s ({responseRate}% rate)
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blue-500/30 shadow-xs bg-gradient-to-br from-blue-50/40 to-white">
            <div className="flex items-center justify-between text-blue-800 mb-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Checked-In at Venue</span>
              <Check className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl md:text-3xl font-bold font-serif-luxury text-blue-900">
              {checkedInCount}
            </div>
            <div className="text-[10px] text-blue-700 mt-1">
              Of {totalConfirmedGuests} expected
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-500/30 shadow-xs">
            <div className="flex items-center justify-between text-amber-800 mb-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Tentative / Pending</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl md:text-3xl font-bold font-serif-luxury text-amber-900">
              {tentativeCount}
            </div>
            <div className="text-[10px] text-amber-700 mt-1">Awaiting confirmation</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-300 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold">Declined / Regrets</span>
              <UserX className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl md:text-3xl font-bold font-serif-luxury text-gray-700">
              {declinedCount}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Sending blessings</div>
          </div>
        </div>

        {/* Dietary & Song Request Quick Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#FFFBF2] p-5 rounded-2xl border border-[#D6A323]/30 shadow-xs flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-gray-600">
                Dietary Requirements Logged
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {['Halal', 'Vegetarian', 'Pescatarian', 'Gluten-Free'].map(item => {
                  const count = rsvps.filter(r => r.dietary === item).length;
                  return (
                    <span key={item} className="px-2.5 py-0.5 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-700">
                      {item}: <strong>{count}</strong>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-[#FFFBF2] p-5 rounded-2xl border border-[#D6A323]/30 shadow-xs flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-800">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-gray-600">
                Song Requests from Guests
              </h4>
              <p className="text-xs text-gray-700 mt-1 line-clamp-1">
                {rsvps.filter(r => !!r.songRequest).map(r => r.songRequest).slice(0, 3).join(' • ') || 'No song requests yet.'}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-[#FFFBF2] p-4 rounded-2xl border border-[#D6A323]/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#D6A323] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or ticket code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#008F87]"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="attending">Confirmed Attending</option>
              <option value="declined">Declined</option>
              <option value="tentative">Tentative</option>
            </select>

            {/* Group Filter */}
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="VIP">VIP</option>
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
              <option value="Bridal Party">Bridal Party</option>
              <option value="Colleagues">Colleagues</option>
              <option value="General">General</option>
            </select>
          </div>

        </div>

        {/* Guest List Table */}
        <div className="bg-[#FFFBF2] rounded-3xl border border-[#D6A323]/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF4DC] border-b border-[#D6A323]/20 text-[#252A2A]/70 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Guest / Party</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Dietary</th>
                  <th className="py-4 px-4">Ticket Code</th>
                  <th className="py-4 px-4 text-center">Venue Check-In</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      No guests found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map(guest => (
                    <tr key={guest.id} className="hover:bg-gray-50/60 transition-colors">
                      
                      {/* Name & Party */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-9 h-9 rounded-full border border-[#D6A323]/60 p-0.5 overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={guest.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                              alt={guest.fullName}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[#252A2A]">
                              {guest.fullName}
                            </div>
                            {guest.plusOneNames && guest.plusOneNames.length > 0 && (
                              <div className="text-[11px] text-gray-500 mt-0.5">
                                +1: {guest.plusOneNames.join(', ')}
                              </div>
                            )}
                            {guest.message && (
                              <div className="text-[10px] text-gray-400 italic line-clamp-1 mt-0.5 max-w-[200px]">
                                "{guest.message}"
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-4 text-gray-600">
                        <div>{guest.email}</div>
                        <div className="text-gray-400 font-mono text-[11px]">{guest.phone}</div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          guest.groupCategory === 'VIP' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          guest.groupCategory === 'Family' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          guest.groupCategory === 'Bridal Party' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {guest.groupCategory}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          guest.attendance === 'attending' ? 'bg-emerald-600 text-white' :
                          guest.attendance === 'tentative' ? 'bg-amber-500 text-white' :
                          'bg-gray-400 text-white'
                        }`}>
                          {guest.attendance.toUpperCase()} ({guest.guestCount})
                        </span>
                      </td>

                      {/* Dietary */}
                      <td className="py-4 px-4 text-gray-600">
                        <span className="font-medium">{guest.dietary}</span>
                        {guest.dietaryDetails && (
                          <span className="block text-[10px] text-gray-400">{guest.dietaryDetails}</span>
                        )}
                      </td>

                      {/* Ticket Code */}
                      <td className="py-4 px-4 font-mono font-bold text-gray-800">
                        {guest.qrTicketCode}
                      </td>

                      {/* Check-In Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => onToggleCheckIn(guest.id)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                            guest.checkedIn
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                              : 'bg-gray-100 text-gray-600 hover:bg-[#D6A323] hover:text-[#003330]'
                          }`}
                        >
                          {guest.checkedIn ? '✓ Checked In' : 'Mark Arrival'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Remove guest ${guest.fullName}?`)) {
                              onDeleteRsvp(guest.id);
                            }
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete guest"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Manual Add Guest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FFFBF2] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#D6A323]/40 shadow-2xl">
            <h3 className="text-xl font-serif-luxury font-bold text-[#252A2A] mb-4">
              Register Guest Manually
            </h3>
            <form onSubmit={handleManualAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold uppercase text-gray-600 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  placeholder="e.g. Chief Adeleke"
                />
              </div>

              <div>
                <label className="font-semibold uppercase text-gray-600 block mb-1">Email</label>
                <input
                  type="email"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  placeholder="adeleke@example.com"
                />
              </div>

              <div>
                <label className="font-semibold uppercase text-gray-600 block mb-1">Phone</label>
                <input
                  type="tel"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  placeholder="+234 802 334 5566"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold uppercase text-gray-600 block mb-1">Party Size</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={manualCount}
                    onChange={(e) => setManualCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold uppercase text-gray-600 block mb-1">Category</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as GuestGroup)}
                    className="w-full px-3 py-2 rounded-xl border text-sm"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="Bridal Party">Bridal Party</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#008F87] text-white font-semibold hover:bg-[#006B66]"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
