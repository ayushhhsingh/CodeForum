export default function QuestionsLoading() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_20%_30%,rgba(249,115,22,0.12),transparent_22%)]" />
            <div className="relative z-10 mx-auto max-w-6xl px-4 pb-32 pt-28">
                <div className="mb-10 flex items-center justify-between gap-4">
                    <div className="space-y-3">
                        <div className="h-3 w-44 animate-pulse rounded-full bg-white/15" />
                        <div className="h-10 w-64 animate-pulse rounded-lg bg-white/20" />
                        <div className="h-4 w-80 animate-pulse rounded-full bg-white/10" />
                    </div>
                    <div className="h-11 w-36 animate-pulse rounded-full bg-white/15" />
                </div>
                <div className="space-y-6">
                    <div className="h-36 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
                    <div className="h-36 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
                    <div className="h-36 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
                </div>
            </div>
        </main>
    );
}
