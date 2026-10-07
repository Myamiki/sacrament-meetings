import { ImageResponse } from 'next/og';

export const alt = 'Sacrament Meetings';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f1e8',
          color: '#172033',
        }}
      >
        <div
          style={{
            width: 1080,
            height: 510,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '72px 88px',
            border: '2px solid #ded8ca',
            borderTop: '10px solid #d97706',
            background: '#fbfaf6',
          }}
        >
          <div
            style={{
              color: '#b45309',
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Sunday meeting planner
          </div>
          <div
            style={{
              marginTop: 30,
              fontFamily: 'Georgia, serif',
              fontSize: 88,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
            }}
          >
            Sacrament Meetings
          </div>
          <div
            style={{
              width: 100,
              height: 4,
              marginTop: 38,
              background: '#c98d66',
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
