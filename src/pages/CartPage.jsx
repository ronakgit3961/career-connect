import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import confetti from 'canvas-confetti';
import {
  selectCartItems,
  removeFromCart,
  updateCartItemNote,
  clearCart
} from '../store/slices/cartSlice';
import { batchApplyFromCart } from '../store/slices/applicationsSlice';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ShoppingBag,
  Trash2,
  Send,
  ArrowRight,
  CheckCircle2,
  FileText,
  DollarSign,
  Briefcase,
  Sparkles,
  Info
} from 'lucide-react';

export const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const lastCheckedOut = useSelector((state) => state.cart.lastCheckedOut);
  const isSubmitting = useSelector((state) => state.applications.submitting);
  const { user } = useAuth();
  const { addToast } = useToast();

  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const handleRemove = (jobId, title) => {
    dispatch(removeFromCart(jobId));
    addToast({
      type: 'info',
      title: 'Item Removed',
      message: `${title} removed from your Job Basket.`
    });
  };

  const handleClear = () => {
    dispatch(clearCart());
    addToast({
      type: 'info',
      title: 'Cart Emptied',
      message: 'All items removed from your Job Basket.'
    });
  };

  const handleNoteChange = (jobId, note) => {
    dispatch(updateCartItemNote({ jobId, coverNote: note }));
  };

  const handleBatchCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      await dispatch(
        batchApplyFromCart({
          cartItems,
          candidateData: {
            name: user.name,
            email: user.email,
            resumeUrl: user.resumeName || 'Alex_Rivera_Resume_2026.pdf',
            defaultCoverNote: 'Batch application submitted via CareerConnect Application Cart.'
          }
        })
      ).unwrap();

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 }
      });

      setCheckoutComplete(true);
      addToast({
        type: 'success',
        title: 'Batch Applications Dispatched!',
        message: `Successfully applied to ${cartItems.length} companies simultaneously!`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Batch Checkout Failed',
        message: err || 'Simulated error in state explorer. Try disabling simulated errors.'
      });
    }
  };

  const avgSalary =
    cartItems.length > 0
      ? Math.round(
          cartItems.reduce((acc, curr) => acc + (curr.maxSalary || 0), 0) / cartItems.length
        )
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Top Banner explaining the Mini-Project */}
      <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
              Mini-Project: Redux Application Shopping Cart ("Job Basket")
            </h3>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-300">
              Demonstrates Redux Toolkit state architecture, persistent basket caching, real-time item property mutation, and bulk checkout dispatches.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Application Basket
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {cartItems.length} {cartItems.length === 1 ? 'position' : 'positions'} queued for batch submission
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 transition"
          >
            <Trash2 size={13} />
            <span>Clear Entire Basket</span>
          </button>
        )}
      </div>

      {/* Checkout Receipt Screen if just completed */}
      {checkoutComplete && lastCheckedOut && (
        <div className="rounded-3xl border border-emerald-300 bg-white p-8 shadow-xl dark:border-emerald-800 dark:bg-slate-900 text-center space-y-5 animate-slide-up">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Batch Applications Submitted!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
              Your applications have been routed directly to the hiring managers. You can track recruitment pipeline status in real-time from your Dashboard.
            </p>
          </div>

          <div className="mx-auto max-w-lg rounded-2xl bg-slate-50 p-4 text-left dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Submission Receipt
            </p>
            {lastCheckedOut.map((app) => (
              <div key={app.id} className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {app.jobTitle} ({app.company})
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {app.id}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700"
            >
              <span>View Dashboard Pipeline</span>
              <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setCheckoutComplete(false)}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Dismiss Receipt
            </button>
          </div>
        </div>
      )}

      {/* Main Cart Content */}
      {cartItems.length === 0 && !checkoutComplete ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/50">
            <ShoppingBag size={28} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            Your Application Basket is Empty
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Browse open positions and click "Add to Basket" to queue multiple roles for 1-click batch application.
          </p>
          <div className="mt-6">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700"
            >
              <span>Explore Vacancies</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.jobId}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 transition hover:border-indigo-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl shadow-inner dark:bg-slate-800">
                      {item.logo || '🏢'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        <Link to={`/jobs/${item.jobId}`} className="hover:text-indigo-600">
                          {item.title}
                        </Link>
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {item.company} • {item.location} ({item.workplaceType})
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.jobId, item.title)}
                    className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/40"
                    title="Remove position from basket"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    ${(item.minSalary / 1000).toFixed(0)}k - ${(item.maxSalary / 1000).toFixed(0)}k / yr
                  </span>
                  <span>•</span>
                  <span>{item.type}</span>
                  <span>•</span>
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-indigo-700 font-medium dark:bg-indigo-950 dark:text-indigo-300">
                    {item.category}
                  </span>
                </div>

                {/* Per-job customized note input */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Customized Pitch for {item.company} (Optional):
                  </label>
                  <input
                    type="text"
                    value={item.coverNote || ''}
                    onChange={(e) => handleNoteChange(item.jobId, e.target.value)}
                    placeholder="e.g. Highlighted 3+ years in React state optimization..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary Card */}
          <div>
            <div className="sticky top-24 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Batch Application Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Queued Vacancies:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{cartItems.length}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Target Compensation Average:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ${avgSalary.toLocaleString()} / yr
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>ATS Match Average:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">91%</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Active Resume:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {user.resumeName || 'Alex_Rivera_Resume_2026.pdf'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleBatchCheckout}
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:opacity-50 active:scale-95"
                >
                  <Send size={15} />
                  <span>
                    {isSubmitting
                      ? 'Dispatching Batch Applications...'
                      : `Checkout & Apply to All (${cartItems.length})`}
                  </span>
                </button>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 text-[11px] text-slate-500 dark:bg-slate-800/40 leading-relaxed">
                <span className="font-bold text-slate-700 dark:text-slate-300">Fast-Track Guarantee:</span> Each company receives your tailored note and verified candidate portfolio profile.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
