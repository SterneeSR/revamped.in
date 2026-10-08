export function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: 'Upload',
      desc: 'Upload your photo or signature.',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
    {
      num: 2,
      title: 'Adjust',
      desc: 'Crop and position as needed.',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
    {
      num: 3,
      title: 'Resize',
      desc: 'Resize and compress to required size.',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
    },
    {
      num: 4,
      title: 'Validate',
      desc: 'Check if it matches the requirements.',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      num: 5,
      title: 'Download',
      desc: 'Download your ready-to-use file.',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-14 md:py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950">
            How It Works
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Prepare your exam files in a few simple steps.
          </p>
        </div>

        {/* Compact Process Diagram matching Reference image_0 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex flex-col relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {step.num}
                </div>
                <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                {idx < steps.length - 1 && (
                  <span className="hidden lg:block text-neutral-300 ml-auto font-mono text-sm">
                    ›
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-neutral-950">{step.title}</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
