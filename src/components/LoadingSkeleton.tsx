/**
 * IntentRescue AI: Analysis Perceptual Shimmer
 * Features multi-stage skeleton loading for medical synthesis.
 * Focus on UX & Efficiency.
 */
export function LoadingSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      <div className="bg-slate-200 h-64 w-full rounded-[3.5rem]" />
      <div className="flex gap-10">
        <div className="flex-1 space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded-lg" />
          <div className="h-4 w-full bg-slate-100 rounded-lg" />
          <div className="h-4 w-5/6 bg-slate-100 rounded-lg" />
          <div className="h-4 w-4/6 bg-slate-100 rounded-lg" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-6 w-1/4 bg-slate-200 rounded-lg" />
          <div className="h-4 w-full bg-slate-100 rounded-lg" />
          <div className="h-4 w-1/2 bg-slate-100 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-10">
        <div className="bg-slate-200 h-64 rounded-[3rem]" />
        <div className="bg-slate-200 h-64 rounded-[3rem]" />
      </div>
    </div>
  );
}
