import Link from 'next/link';

const TOOLS = [
  {
    title: 'Photo Resizer',
    desc: 'Crop, resize and compress your photograph.',
    href: '/tnpsc/group-ii',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Signature Resizer',
    desc: 'Resize and compress your signature.',
    href: '/tnpsc/group-ii',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    title: 'Image Validator',
    desc: 'Check if your image meets the requirements.',
    href: '/tnpsc/group-ii',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Crop Tool',
    desc: 'Crop and adjust your image easily.',
    href: '/tnpsc/group-ii',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
];

export function QuickTools() {
  return (
    <section id="tools" className="py-14 md:py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950">
            Quick Tools
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Common tools for exam applications and document resizing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group p-5 rounded-2xl border border-neutral-200 hover:border-neutral-900 bg-white hover:shadow-sm transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-950 group-hover:text-white transition-colors shrink-0">
                {tool.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-neutral-950 group-hover:text-neutral-800">
                    {tool.title}
                  </h3>
                  <span className="text-neutral-400 group-hover:text-neutral-900 transition-colors">
                    →
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                  {tool.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
