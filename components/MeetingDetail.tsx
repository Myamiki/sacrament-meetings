import type { SacramentMeeting } from '@/lib/types';
import PrintButton from './PrintButton';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({
  meeting,
}: MeetingDetailProps) {
  return (
    <article className="meeting-detail">
      <header className="detail-header">
        <div>
          <p className="eyebrow">My Ward <span>/</span> Program archive</p>
          <h1>Sacrament Meeting</h1>
          <p className="detail-date">{meeting.date}</p>
        </div>
        <PrintButton />
      </header>

      <div className="detail-meta" aria-label="Meeting information">
        <div><span>Meeting type</span><strong>{meeting.meetingType}</strong></div>
        <div><span>Presiding</span><strong>{meeting.presiding}</strong></div>
        <div><span>Conducting</span><strong>{meeting.conducting}</strong></div>
      </div>

      <div className="detail-layout">
        <aside className="detail-sidebar">
          <section className="sidebar-section">
            <p className="section-kicker">Before we begin</p>
            <h2>Announcements</h2>
            {meeting.announcements && meeting.announcements.length > 0 ? (
              <ul className="announcement-list">
                {meeting.announcements.map((announcement) => <li key={announcement}>{announcement}</li>)}
              </ul>
            ) : (
              <p className="muted-copy">No announcements.</p>
            )}
          </section>

          <section className="sidebar-section">
            <p className="section-kicker">Ward notes</p>
            <h2>Business</h2>
            {meeting.wardBusiness.length > 0 ? (
              <ul className="announcement-list">
                {meeting.wardBusiness.map((item) => <li key={item.description}>{item.description}</li>)}
              </ul>
            ) : (
              <p className="muted-copy">No ward business.</p>
            )}
            <p className="stake-status">
              <span>Stake business</span>
              <strong>{meeting.stakeBusiness ? 'Yes' : 'No'}</strong>
            </p>
          </section>
        </aside>

        <div className="agenda-flow">
          <p className="section-kicker">Order of worship</p>
          <h2 className="agenda-heading">Today&apos;s program</h2>

          <section className="agenda-item">
            <span className="agenda-number">01</span>
            <div><h3>Opening</h3><p><strong>Hymn {meeting.openingHymn.number}</strong> {meeting.openingHymn.title}</p><p><strong>Prayer</strong> {meeting.openingPrayer}</p></div>
          </section>

          <section className="agenda-item agenda-highlight">
            <span className="agenda-number">02</span>
            <div><h3>The sacrament</h3><p><strong>Hymn {meeting.sacramentHymn.number}</strong> {meeting.sacramentHymn.title}</p></div>
          </section>

          <section className="agenda-item">
            <span className="agenda-number">03</span>
            <div>
              <h3>Messages &amp; music</h3>
              <ul className="speaker-list">
                {meeting.speakers.length > 0 ? meeting.speakers.map((item) => <li key={`${item.name}-${item.topic}`}><span>{item.type === 'speaker' ? 'Speaker' : 'Musical number'}</span><strong>{item.name}</strong>{item.topic && <em>{item.topic}</em>}</li>) : <li><span>Program</span><strong>No speakers listed</strong></li>}
              </ul>
            </div>
          </section>

          <section className="agenda-item">
            <span className="agenda-number">04</span>
            <div><h3>Closing</h3><p><strong>Hymn {meeting.closingHymn.number}</strong> {meeting.closingHymn.title}</p><p><strong>Prayer</strong> {meeting.closingPrayer}</p></div>
          </section>
        </div>
      </div>
    </article>
  );
}