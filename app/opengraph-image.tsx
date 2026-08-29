import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { profile } from '@/data/portfolio';

/**
 * The link preview card.
 *
 * Previously the site pointed social platforms at the raw portrait (599×514)
 * while declaring it 1200×630, so every share rendered an undersized, badly
 * cropped box. This renders a real card at the correct size, in the site's own
 * visual language, at build time.
 */
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${profile.name} — ${profile.headline}`;

export default async function OpengraphImage() {
  const portrait = readFileSync(join(process.cwd(), 'public', 'new profile.jpg'));
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#04060c',
          backgroundImage:
            'radial-gradient(900px 500px at 50% -10%, rgba(77,141,255,0.30), transparent 70%), radial-gradient(600px 400px at 100% 100%, rgba(252,61,33,0.12), transparent 70%)',
          padding: 72,
          alignItems: 'center',
          gap: 64,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 21,
              letterSpacing: 6,
              color: '#8AB4FF',
              textTransform: 'uppercase',
            }}
          >
            {profile.headline}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 96,
              fontWeight: 700,
              color: '#F5F5F7',
              letterSpacing: -4,
              lineHeight: 1.02,
              marginTop: 26,
            }}
          >
            REGGIE LOVETT
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 27,
              color: '#989EAA',
              marginTop: 26,
              lineHeight: 1.4,
              maxWidth: 620,
            }}
          >
            {profile.tagline}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 44 }}>
            <div
              style={{
                display: 'flex',
                width: 11,
                height: 11,
                borderRadius: 999,
                background: '#34D399',
              }}
            />
            <div style={{ display: 'flex', fontSize: 19, letterSpacing: 4, color: '#6E7480' }}>
              {profile.school.toUpperCase()}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            width: 340,
            height: 440,
            borderRadius: 32,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          <img
            src={portraitSrc}
            alt=""
            width={340}
            height={440}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    ),
    size,
  );
}
