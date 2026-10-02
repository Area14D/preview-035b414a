// Studio WhatsApp number (international format, no +)
const WHATSAPP = '85296457564';
const RATE = 680;

// Daylight / blackout switch
document.querySelectorAll('.switch button').forEach(btn => {
  btn.addEventListener('click', () => {
    const night = btn.dataset.mode === 'night';
    document.body.classList.toggle('night', night);
    document.body.classList.toggle('day', !night);
    document.querySelectorAll('.switch button').forEach(b =>
      b.setAttribute('aria-pressed', String(b === btn)));
  });
});

// Solid nav after the hero
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('solid', window.scrollY > window.innerHeight * 0.8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Estimate: every 10 booked hours includes 1 free hour
const form = document.getElementById('bookform');
const est = document.getElementById('est');
const note = document.getElementById('est-note');
function estimate() {
  const hours = Math.max(0, parseInt(form.hours.value, 10) || 0);
  const free = Math.floor(hours / 11);
  const paid = hours - free;
  est.textContent = 'HK$' + (paid * RATE).toLocaleString('en-HK');
  note.textContent = free
    ? `${paid} paid + ${free} free hour${free > 1 ? 's' : ''}. Studio only, lighting not included.`
    : 'Studio only. Lighting not included.';
}
form.hours.addEventListener('input', estimate);
estimate();

// Minimum date: today
const today = new Date();
form.date.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

// Build the WhatsApp message
form.addEventListener('submit', e => {
  e.preventDefault();
  const msg = document.getElementById('formmsg');
  if (!form.date.value || !form.name.value.trim()) {
    msg.textContent = 'Please add a date and your name. 請填日期同名稱。';
    return;
  }
  const lines = [
    'Hi AREA 14D, I would like to check availability:',
    `Date 日期: ${form.date.value}`,
    `Time 時間: ${form.start.value}, ${form.hours.value} hours`,
    `Crew 人數: ${form.crew.value}`,
    `Type 類型: ${form.type.value}`,
    `Lighting 燈光: ${form.light.value}`,
    `Name 名稱: ${form.name.value.trim()}`,
  ];
  if (form.notes.value.trim()) lines.push(`Notes 備註: ${form.notes.value.trim()}`);
  msg.textContent = 'Opening WhatsApp… 開緊 WhatsApp…';
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
});
