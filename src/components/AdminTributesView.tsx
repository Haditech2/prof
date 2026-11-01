import React, { useEffect, useState } from 'react';
import { AdminTribute, tributesApi } from '../lib/tributesApi';
import { GuestWish } from '../types';
import {
  CheckCircle2,
  Clock,
  Inbox,
  LogOut,
  Pencil,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
  X
} from 'lucide-react';

interface AdminTributesViewProps {
  onSuccessToast?: (message: string) => void;
  onPublishedCountChange?: (published: GuestWish[]) => void;
}

interface EditState {
  tribute: AdminTribute;
  author: string;
  role: string;
  affiliation: string;
  title: string;
  message: string;
  status: 'pending' | 'published';
}

type Tab = 'pending' | 'published';

export const AdminTributesView: React.FC<AdminTributesViewProps> = ({
  onSuccessToast,
  onPublishedCountChange
}) => {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [tributes, setTributes] = useState<AdminTribute[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('pending');
  const [edit, setEdit] = useState<EditState | null>(null);
  const [saving, setEditSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    tributesApi
      .session()
      .then((session) => setAuthenticated(session.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setCheckingSession(false));
  }, []);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const list = await tributesApi.listAll();
      setTributes(list);
      onPublishedCountChange?.(
        list
          .filter((item) => item.status === 'published')
          .map(({ status: _status, ...wish }) => wish)
      );
    } catch {
      setTributes([]);
    } finally {
      setLoading(false);
    }
  }, [onPublishedCountChange]);

  useEffect(() => {
    if (authenticated) refresh();
  }, [authenticated, refresh]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      await tributesApi.login(email, password);
      setAuthenticated(true);
      setPassword('');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Sign-in failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await tributesApi.logout();
    } finally {
      setAuthenticated(false);
      setTributes([]);
    }
  };

  const handleToggleStatus = async (tribute: AdminTribute) => {
    const nextStatus = tribute.status === 'published' ? 'pending' : 'published';
    try {
      const updated = await tributesApi.update(tribute.id, { status: nextStatus });
      setTributes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      onSuccessToast?.(
        nextStatus === 'published'
          ? `Tribute by ${updated.author} is now live.`
          : `Tribute by ${updated.author} moved back to review.`
      );
      refresh();
    } catch (error) {
      onSuccessToast?.(error instanceof Error ? error.message : 'Update failed.');
    }
  };

  const handleDelete = async (tribute: AdminTribute) => {
    if (!window.confirm(`Delete the tribute by ${tribute.author}? This cannot be undone.`)) return;
    setDeletingId(tribute.id);
    try {
      await tributesApi.remove(tribute.id);
      setTributes((prev) => prev.filter((item) => item.id !== tribute.id));
      onSuccessToast?.('Tribute deleted.');
      refresh();
    } catch (error) {
      onSuccessToast?.(error instanceof Error ? error.message : 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!edit) return;
    setEditSaving(true);
    try {
      const updated = await tributesApi.update(edit.tribute.id, {
        author: edit.author,
        role: edit.role,
        affiliation: edit.affiliation,
        title: edit.title,
        message: edit.message,
        status: edit.status
      });
      setTributes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setEdit(null);
      onSuccessToast?.('Tribute updated.');
      refresh();
    } catch (error) {
      onSuccessToast?.(error instanceof Error ? error.message : 'Update failed.');
    } finally {
      setEditSaving(false);
    }
  };

  const visible = tributes.filter((item) => item.status === tab);
  const pendingCount = tributes.filter((item) => item.status === 'pending').length;
  const publishedCount = tributes.filter((item) => item.status === 'published').length;

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF4DC]">
        <p className="font-serif-luxury italic text-[#5B6B63]">Checking the secretariat pass…</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#FFF4DC] pt-28 md:pt-36 pb-20 px-4">
        <form
          onSubmit={handleLogin}
          className="max-w-sm mx-auto p-6 sm:p-8 rounded-2xl bg-[#FFFBF2] border border-[#D6A323]/40 shadow-md space-y-4"
        >
          <div className="text-center">
            <span className="w-11 h-11 mx-auto rounded-full bg-[#008F87]/15 border border-[#D6A323]/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#008F87]" />
            </span>
            <h1 className="mt-3 font-serif-luxury text-2xl font-bold text-[#252A2A]">
              Secretariat Sign-In
            </h1>
            <p className="mt-1 text-xs text-[#5B6B63]">Administrator access to tributes &amp; felicitations.</p>
          </div>

          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@nsuk.edu.ng"
            className="w-full px-3 py-2.5 rounded-xl border border-[#D6A323]/30 bg-white text-sm focus:outline-none focus:border-[#008F87]"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2.5 rounded-xl border border-[#D6A323]/30 bg-white text-sm focus:outline-none focus:border-[#008F87]"
          />

          {loginError && <p className="text-xs text-red-600">{loginError}</p>}

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full py-2.5 rounded-full bg-[#008F87] hover:bg-[#006B66] text-white text-sm font-medium shadow-md transition-colors disabled:opacity-60"
          >
            {loggingIn ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF4DC] pt-28 md:pt-36 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-[#FFFBF2] border border-[#D6A323]/30 shadow-xs">
          <div>
            <span className="eyebrow">Moderation Desk</span>
            <h1 className="font-serif-luxury text-2xl font-bold text-[#252A2A]">
              Tributes &amp; Felicitations
            </h1>
            <p className="text-xs text-[#5B6B63] mt-0.5">
              {pendingCount} awaiting review · {publishedCount} published
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="w-9 h-9 rounded-full bg-[#FFF4DC] border border-[#D6A323]/40 flex items-center justify-center text-[#006B66] hover:border-[#008F87] transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border border-[#D6A323]/40 bg-[#FFF4DC] hover:border-red-300 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2">
          {([
            { id: 'pending', label: 'Pending review', icon: Clock, count: pendingCount },
            { id: 'published', label: 'Published', icon: CheckCircle2, count: publishedCount }
          ] as const).map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                tab === id
                  ? 'bg-[#008F87] text-white border-[#008F87]'
                  : 'bg-[#FFFBF2] text-[#5B6B63] border-[#D6A323]/30 hover:border-[#008F87]/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label} ({count})
            </button>
          ))}
        </div>

        {/* List */}
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D6A323]/50 bg-[#FFFBF2]/60 px-6 py-12 text-center">
            <Inbox className="w-6 h-6 mx-auto text-[#A97912]" />
            <p className="mt-2 font-serif-luxury text-lg text-[#252A2A]">
              {tab === 'pending' ? 'Nothing awaiting review.' : 'No published tributes yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((tribute) => (
              <article
                key={tribute.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#FFFBF2] border border-[#D6A323]/30 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-serif-luxury font-bold text-sm text-[#252A2A] truncate">
                      {tribute.author}
                    </h3>
                    <p className="text-[11px] text-[#A97912] truncate">{tribute.role || 'Well-wisher'}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() =>
                        setEdit({
                          tribute,
                          author: tribute.author,
                          role: tribute.role || '',
                          affiliation: tribute.affiliation || '',
                          title: tribute.title || '',
                          message: tribute.message,
                          status: tribute.status
                        })
                      }
                      className="w-8 h-8 rounded-lg bg-[#FFF4DC] border border-[#D6A323]/40 flex items-center justify-center text-[#006B66] hover:border-[#008F87]"
                      title="Edit"
                      aria-label={`Edit tribute by ${tribute.author}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(tribute)}
                      className={`inline-flex items-center gap-1 px-3 h-8 rounded-lg text-[11px] font-semibold border transition-colors ${
                        tribute.status === 'published'
                          ? 'bg-[#FFF4DC] border-[#D6A323]/40 text-[#A97912] hover:text-[#B45309]'
                          : 'bg-[#008F87] border-[#008F87] text-white hover:bg-[#006B66]'
                      }`}
                      title={tribute.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {tribute.status === 'published' ? (
                        <><Clock className="w-3.5 h-3.5" /> Unpublish</>
                      ) : (
                        <><Send className="w-3.5 h-3.5" /> Publish</>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(tribute)}
                      disabled={deletingId === tribute.id}
                      className="w-8 h-8 rounded-lg bg-[#FEF2F2] border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                      title="Delete"
                      aria-label={`Delete tribute by ${tribute.author}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#47554F] leading-relaxed line-clamp-4 font-serif-luxury italic">
                  “{tribute.message}”
                </p>

                <div className="text-[10px] text-[#9AA8A0] flex items-center justify-between">
                  <span>{new Date(tribute.createdAt).toLocaleString()}</span>
                  <span>{tribute.likes} likes</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {edit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEdit(null);
          }}
        >
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#FFFBF2] border border-[#D6A323]/40 shadow-2xl space-y-3 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-lg font-bold text-[#252A2A]">Edit Tribute</h3>
              <button
                onClick={() => setEdit(null)}
                className="w-8 h-8 rounded-full bg-[#FFF4DC] border border-[#D6A323]/40 flex items-center justify-center text-[#5B6B63]"
                aria-label="Close editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              value={edit.author}
              onChange={(e) => setEdit({ ...edit, author: e.target.value })}
              placeholder="Author name"
              className="w-full px-3 py-2 rounded-xl border border-[#D6A323]/30 bg-white text-sm focus:outline-none focus:border-[#008F87]"
            />
            <input
              value={edit.role}
              onChange={(e) => setEdit({ ...edit, role: e.target.value })}
              placeholder="Role / description"
              className="w-full px-3 py-2 rounded-xl border border-[#D6A323]/30 bg-white text-sm focus:outline-none focus:border-[#008F87]"
            />
            <input
              value={edit.affiliation}
              onChange={(e) => setEdit({ ...edit, affiliation: e.target.value })}
              placeholder="Affiliation"
              className="w-full px-3 py-2 rounded-xl border border-[#D6A323]/30 bg-white text-sm focus:outline-none focus:border-[#008F87]"
            />
            <input
              value={edit.title}
              onChange={(e) => setEdit({ ...edit, title: e.target.value })}
              placeholder="Tribute title (optional)"
              className="w-full px-3 py-2 rounded-xl border border-[#D6A323]/30 bg-white text-sm focus:outline-none focus:border-[#008F87]"
            />
            <textarea
              value={edit.message}
              onChange={(e) => setEdit({ ...edit, message: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 rounded-xl border border-[#D6A323]/30 bg-white text-sm focus:outline-none focus:border-[#008F87]"
            />

            <label className="flex items-center gap-2 text-xs text-[#5B6B63]">
              <input
                type="checkbox"
                checked={edit.status === 'published'}
                onChange={(e) => setEdit({ ...edit, status: e.target.checked ? 'published' : 'pending' })}
                className="accent-[#008F87]"
              />
              Published and visible to everyone
            </label>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setEdit(null)}
                className="px-4 py-2 rounded-full text-xs font-medium border border-[#D6A323]/40"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving || !edit.author.trim() || !edit.message.trim()}
                className="px-5 py-2 rounded-full text-xs font-medium bg-[#008F87] text-white hover:bg-[#006B66] shadow-md disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTributesView;
