'use client';

import Image from 'next/image';
import Link from 'next/link';
import { r2xGallery } from '../data/portfolio';

export function R2XGallery() {
  return (
    <section id="r2x" className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300">R²X AGENCY</div>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">MEDIA & DESIGN GALLERY</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {r2xGallery.map((item) => (
            <div key={item.id} className="rounded-xl overflow-hidden border border-white/10 bg-white/5 transition-shadow hover:shadow-lg">
              <div className="relative aspect-[4/3] w-full">
                <Image src={item.image} alt={item.alt} fill className="object-cover" />
              </div>
              <div className="p-4">
                <div className="text-sm uppercase tracking-[0.12em] text-cyan-300">{item.category}</div>
                <h3 className="mt-2 text-lg font-bold text-white">{item.title}</h3>
                <div className="mt-3">
                  <Link href={item.image} target="_blank" className="text-sm text-cyan-200 hover:underline">
                    View full image
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
