const canvas = document.getElementById('card');
const ctx = canvas.getContext('2d');

// State
const state = {
  firstName: 'Darwin',
  lastName:  'Nunez',
  rating:    84,
  position:  'ST',
  stars:     4,
  bgImage:   null,
  bgColor:   '#44cc00',
  playerImg: null,
  playerX:   0,
  playerY:   0,
  playerScale: 1.0,
  playerMirror: false,
  logoImg:   null,
  flagImg:   null,
  flagEmoji: '',
  ratingColor: '#ffffff',
  nameColor:   '#c8ff00',
  textShadow:  'strong',
  cardW: 400,
  cardH: 560,
  cardEffect: 'gold',
  shineOffset: 0,
};

// ── Shine animation ──────────────────────────────────────────
let animRunning = false;
function startShine(){
  if(animRunning) return;
  animRunning = true;
  (function tick(){
    if(!animRunning) return;
    state.shineOffset = (state.shineOffset + 0.0018) % 1;
    draw();
    requestAnimationFrame(tick);
  })();
}
function stopShine(){ animRunning = false; }

// ── Bind inputs ──────────────────────────────────────────────
function bind(id, key, transform){
  const el = document.getElementById(id);
  if(!el) return;
  el.addEventListener('input', ()=>{ state[key] = transform ? transform(el.value) : el.value; draw(); });
}
bind('firstName','firstName');
bind('lastName','lastName');
bind('rating','rating', v=>Math.max(1,Math.min(110,parseInt(v)||0)));
bind('position','position');
bind('bgColor','bgColor');
bind('ratingColor','ratingColor');
bind('nameColor','nameColor');
bind('textShadow','textShadow');

document.getElementById('playerScale').addEventListener('input', function(){
  state.playerScale = parseFloat(this.value)/100;
  document.getElementById('scaleVal').textContent = this.value + '%';
  draw();
});

// Stars
document.querySelectorAll('#starsPick button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    state.stars = parseInt(btn.dataset.v);
    document.querySelectorAll('#starsPick button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    draw();
  });
});

// FIFA Effect buttons
document.querySelectorAll('#effectPick .effect-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('#effectPick .effect-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    state.cardEffect = btn.dataset.e;
    if(state.cardEffect !== 'none'){ startShine(); }
    else { stopShine(); draw(); }
  });
});

// Reset / Mirror
document.getElementById('resetPos').addEventListener('click',()=>{
  state.playerX = 0; state.playerY = 0; draw();
});
document.getElementById('mirrorPlayer').addEventListener('click',()=>{
  state.playerMirror = !state.playerMirror; draw();
});

// Card dimensions
document.querySelectorAll('.dim-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.dim-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    state.cardW = parseInt(btn.dataset.w);
    state.cardH = parseInt(btn.dataset.h);
    canvas.width  = state.cardW;
    canvas.height = state.cardH;
    draw();
  });
});

// ── Image uploads ──────────────────────────────────────────
function setupUpload(fileId, thumbId, stateKey){
  const input = document.getElementById(fileId);
  const thumb = document.getElementById(thumbId);
  input.addEventListener('change', function(){
    const file = this.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = e=>{
      const img = new Image();
      img.onload = ()=>{ state[stateKey]=img; draw(); };
      img.src = e.target.result;
      thumb.src = e.target.result;
      thumb.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });
}
setupUpload('bgFile','bgThumb','bgImage');
setupUpload('playerFile','playerThumb','playerImg');
setupUpload('logoFile','logoThumb','logoImg');

// ── Drag & drop pe zonele de upload ──────────────────────────
function setupDragDrop(zoneId, stateKey, thumbId) {
  const zone  = document.getElementById(zoneId);
  const thumb = thumbId ? document.getElementById(thumbId) : null;
  if (!zone) return;

  zone.addEventListener('dragenter', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', e => {
    if (!zone.contains(e.relatedTarget)) zone.classList.remove('drag-over');
  });
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => { state[stateKey] = img; draw(); };
      img.src = ev.target.result;
      if (thumb) { thumb.src = ev.target.result; thumb.style.display = 'block'; }
    };
    reader.readAsDataURL(file);
  });
}
setupDragDrop('bgZone',     'bgImage',   'bgThumb');
setupDragDrop('playerZone', 'playerImg', 'playerThumb');
setupDragDrop('logoZone',   'logoImg',   'logoThumb');

// ══════════════════════════════════════════════════════════════════
// DATE CLUBURI & ȚĂRI + SELECTOARE (adăugat v5)
// ══════════════════════════════════════════════════════════════════

const CLUBS = [
  { name: "Atletico Madrid", logo: "https://media.api-sports.io/football/teams/530.png" },
  { name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png" },
  { name: "Bayern Munchen", logo: "https://media.api-sports.io/football/teams/157.png" },
  { name: "Bayer Leverkusen", logo: "https://media.api-sports.io/football/teams/168.png" },
  { name: "Borussia Dortmund", logo: "https://media.api-sports.io/football/teams/165.png" },
  { name: "Borussia M'gladbach", logo: "https://media.api-sports.io/football/teams/163.png" }, // doar în lista 1
  { name: "Chelsea", logo: "https://media.api-sports.io/football/teams/49.png" },
  { name: "Inter", logo: "https://media.api-sports.io/football/teams/505.png" },
  { name: "Juventus", logo: "https://media.api-sports.io/football/teams/496.png" },
  { name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png" },
  { name: "Manchester City", logo: "https://media.api-sports.io/football/teams/50.png" },
  { name: "Manchester United", logo: "https://media.api-sports.io/football/teams/33.png" },
  { name: "Milan", logo: "https://media.api-sports.io/football/teams/489.png" },
  { name: "Napoli", logo: "https://media.api-sports.io/football/teams/492.png" },
  { name: "Paris Saint-Germain", logo: "https://media.api-sports.io/football/teams/85.png" },
  { name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png" },
  { name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png" },
  { name: "Tottenham", logo: "https://media.api-sports.io/football/teams/47.png" },
  { name: "Aston Villa", logo: "https://media.api-sports.io/football/teams/66.png" },
  { name: "Roma", logo: "https://media.api-sports.io/football/teams/497.png" },
  { name: "Lazio", logo: "https://media.api-sports.io/football/teams/487.png" },
  { name: "Benfica", logo: "https://media.api-sports.io/football/teams/211.png" },
  { name: "Porto", logo: "https://media.api-sports.io/football/teams/212.png" },
  { name: "Ajax", logo: "https://media.api-sports.io/football/teams/194.png" },
  { name: "PSV", logo: "https://media.api-sports.io/football/teams/197.png" },
  { name: "Sevilla", logo: "https://media.api-sports.io/football/teams/536.png" },
  { name: "Valencia", logo: "https://media.api-sports.io/football/teams/532.png" },
  { name: "Villarreal", logo: "https://media.api-sports.io/football/teams/533.png" },
  { name: "RB Leipzig", logo: "https://media.api-sports.io/football/teams/173.png" },
  { name: "Celtic", logo: "https://media.api-sports.io/football/teams/257.png" },
  { name: "Rangers", logo: "https://media.api-sports.io/football/teams/256.png" },
  { name: "Galatasaray", logo: "https://media.api-sports.io/football/teams/645.png" },
  { name: "Fenerbahce", logo: "https://media.api-sports.io/football/teams/611.png" },
  { name: "Besiktas", logo: "https://media.api-sports.io/football/teams/609.png" },
  { name: "Sporting", logo: "https://media.api-sports.io/football/teams/228.png" },
  { name: "Dinamo Kiev", logo: "https://media.api-sports.io/football/teams/369.png" },
  { name: "Marseille", logo: "https://media.api-sports.io/football/teams/81.png" },
  { name: "Lyon", logo: "https://media.api-sports.io/football/teams/80.png" },
  { name: "Monaco", logo: "https://media.api-sports.io/football/teams/91.png" },
  { name: "Atalanta", logo: "https://media.api-sports.io/football/teams/499.png" },
  { name: "Fiorentina", logo: "https://media.api-sports.io/football/teams/502.png" },
  { name: "Eintracht Frankfurt", logo: "https://media.api-sports.io/football/teams/169.png" },
  { name: "Werder Bremen", logo: "https://media.api-sports.io/football/teams/162.png" },
  { name: "Newcastle", logo: "https://media.api-sports.io/football/teams/34.png" },
  { name: "West Ham", logo: "https://media.api-sports.io/football/teams/48.png" },
  { name: "Legends", logo: "https://cdn-p2.frzdb.net/fifamobile/images/leagueLogos_22/2118.png?v=848rffjv3wehttps://image.pngaaa.com/236/6778236-middle.png.png" },
];

const COUNTRIES = [
  {"name": "Afghanistan", "code": "AF", "flag": "🇦🇫"},
  {"name": "Albania", "code": "AL", "flag": "🇦🇱"},
  {"name": "Algeria", "code": "DZ", "flag": "🇩🇿"},
  {"name": "Andorra", "code": "AD", "flag": "🇦🇩"},
  {"name": "Angola", "code": "AO", "flag": "🇦🇴"},
  {"name": "Argentina", "code": "AR", "flag": "🇦🇷"},
  {"name": "Armenia", "code": "AM", "flag": "🇦🇲"},
  {"name": "Australia", "code": "AU", "flag": "🇦🇺"},
  {"name": "Austria", "code": "AT", "flag": "🇦🇹"},
  {"name": "Azerbaijan", "code": "AZ", "flag": "🇦🇿"},
  {"name": "Bahamas", "code": "BS", "flag": "🇧🇸"},
  {"name": "Bahrain", "code": "BH", "flag": "🇧🇭"},
  {"name": "Bangladesh", "code": "BD", "flag": "🇧🇩"},
  {"name": "Barbados", "code": "BB", "flag": "🇧🇧"},
  {"name": "Belarus", "code": "BY", "flag": "🇧🇾"},
  {"name": "Belgium", "code": "BE", "flag": "🇧🇪"},
  {"name": "Belize", "code": "BZ", "flag": "🇧🇿"},
  {"name": "Benin", "code": "BJ", "flag": "🇧🇯"},
  {"name": "Bhutan", "code": "BT", "flag": "🇧🇹"},
  {"name": "Bolivia", "code": "BO", "flag": "🇧🇴"},
  {"name": "Bosnia and Herzegovina", "code": "BA", "flag": "🇧🇦"},
  {"name": "Botswana", "code": "BW", "flag": "🇧🇼"},
  {"name": "Brazil", "code": "BR", "flag": "🇧🇷"},
  {"name": "Brunei", "code": "BN", "flag": "🇧🇳"},
  {"name": "Bulgaria", "code": "BG", "flag": "🇧🇬"},
  {"name": "Burkina Faso", "code": "BF", "flag": "🇧🇫"},
  {"name": "Burundi", "code": "BI", "flag": "🇧🇮"},
  {"name": "Cambodia", "code": "KH", "flag": "🇰🇭"},
  {"name": "Cameroon", "code": "CM", "flag": "🇨🇲"},
  {"name": "Canada", "code": "CA", "flag": "🇨🇦"},
  {"name": "Cape Verde", "code": "CV", "flag": "🇨🇻"},
  {"name": "Central African Republic", "code": "CF", "flag": "🇨🇫"},
  {"name": "Chad", "code": "TD", "flag": "🇹🇩"},
  {"name": "Chile", "code": "CL", "flag": "🇨🇱"},
  {"name": "China", "code": "CN", "flag": "🇨🇳"},
  {"name": "Colombia", "code": "CO", "flag": "🇨🇴"},
  {"name": "Comoros", "code": "KM", "flag": "🇰🇲"},
  {"name": "Congo", "code": "CG", "flag": "🇨🇬"},
  {"name": "Costa Rica", "code": "CR", "flag": "🇨🇷"},
  {"name": "Croatia", "code": "HR", "flag": "🇭🇷"},
  {"name": "Cuba", "code": "CU", "flag": "🇨🇺"},
  {"name": "Cyprus", "code": "CY", "flag": "🇨🇾"},
  {"name": "Czech Republic", "code": "CZ", "flag": "🇨🇿"},
  {"name": "Denmark", "code": "DK", "flag": "🇩🇰"},
  {"name": "Djibouti", "code": "DJ", "flag": "🇩🇯"},
  {"name": "Dominica", "code": "DM", "flag": "🇩🇲"},
  {"name": "Dominican Republic", "code": "DO", "flag": "🇩🇴"},
  {"name": "Ecuador", "code": "EC", "flag": "🇪🇨"},
  {"name": "Egypt", "code": "EG", "flag": "🇪🇬"},
  {"name": "El Salvador", "code": "SV", "flag": "🇸🇻"},
  {"name": "England", "code": "GB-ENG", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
  {"name": "Equatorial Guinea", "code": "GQ", "flag": "🇬🇶"},
  {"name": "Eritrea", "code": "ER", "flag": "🇪🇷"},
  {"name": "Estonia", "code": "EE", "flag": "🇪🇪"},
  {"name": "Eswatini", "code": "SZ", "flag": "🇸🇿"},
  {"name": "Ethiopia", "code": "ET", "flag": "🇪🇹"},
  {"name": "Fiji", "code": "FJ", "flag": "🇫🇯"},
  {"name": "Finland", "code": "FI", "flag": "🇫🇮"},
  {"name": "France", "code": "FR", "flag": "🇫🇷"},
  {"name": "Gabon", "code": "GA", "flag": "🇬🇦"},
  {"name": "Gambia", "code": "GM", "flag": "🇬🇲"},
  {"name": "Georgia", "code": "GE", "flag": "🇬🇪"},
  {"name": "Germany", "code": "DE", "flag": "🇩🇪"},
  {"name": "Ghana", "code": "GH", "flag": "🇬🇭"},
  {"name": "Greece", "code": "GR", "flag": "🇬🇷"},
  {"name": "Grenada", "code": "GD", "flag": "🇬🇩"},
  {"name": "Guatemala", "code": "GT", "flag": "🇬🇹"},
  {"name": "Guinea", "code": "GN", "flag": "🇬🇳"},
  {"name": "Guinea-Bissau", "code": "GW", "flag": "🇬🇼"},
  {"name": "Guyana", "code": "GY", "flag": "🇬🇾"},
  {"name": "Haiti", "code": "HT", "flag": "🇭🇹"},
  {"name": "Honduras", "code": "HN", "flag": "🇭🇳"},
  {"name": "Hungary", "code": "HU", "flag": "🇭🇺"},
  {"name": "Iceland", "code": "IS", "flag": "🇮🇸"},
  {"name": "India", "code": "IN", "flag": "🇮🇳"},
  {"name": "Indonesia", "code": "ID", "flag": "🇮🇩"},
  {"name": "Iran", "code": "IR", "flag": "🇮🇷"},
  {"name": "Iraq", "code": "IQ", "flag": "🇮🇶"},
  {"name": "Ireland", "code": "IE", "flag": "🇮🇪"},
  {"name": "Israel", "code": "IL", "flag": "🇮🇱"},
  {"name": "Italy", "code": "IT", "flag": "🇮🇹"},
  {"name": "Ivory Coast", "code": "CI", "flag": "🇨🇮"},
  {"name": "Jamaica", "code": "JM", "flag": "🇯🇲"},
  {"name": "Japan", "code": "JP", "flag": "🇯🇵"},
  {"name": "Jordan", "code": "JO", "flag": "🇯🇴"},
  {"name": "Kazakhstan", "code": "KZ", "flag": "🇰🇿"},
  {"name": "Kenya", "code": "KE", "flag": "🇰🇪"},
  {"name": "Kiribati", "code": "KI", "flag": "🇰🇮"},
  {"name": "Kuwait", "code": "KW", "flag": "🇰🇼"},
  {"name": "Kyrgyzstan", "code": "KG", "flag": "🇰🇬"},
  {"name": "Laos", "code": "LA", "flag": "🇱🇦"},
  {"name": "Latvia", "code": "LV", "flag": "🇱🇻"},
  {"name": "Lebanon", "code": "LB", "flag": "🇱🇧"},
  {"name": "Lesotho", "code": "LS", "flag": "🇱🇸"},
  {"name": "Liberia", "code": "LR", "flag": "🇱🇷"},
  {"name": "Libya", "code": "LY", "flag": "🇱🇾"},
  {"name": "Liechtenstein", "code": "LI", "flag": "🇱🇮"},
  {"name": "Lithuania", "code": "LT", "flag": "🇱🇹"},
  {"name": "Luxembourg", "code": "LU", "flag": "🇱🇺"},
  {"name": "Madagascar", "code": "MG", "flag": "🇲🇬"},
  {"name": "Malawi", "code": "MW", "flag": "🇲🇼"},
  {"name": "Malaysia", "code": "MY", "flag": "🇲🇾"},
  {"name": "Maldives", "code": "MV", "flag": "🇲🇻"},
  {"name": "Mali", "code": "ML", "flag": "🇲🇱"},
  {"name": "Malta", "code": "MT", "flag": "🇲🇹"},
  {"name": "Mauritania", "code": "MR", "flag": "🇲🇷"},
  {"name": "Mauritius", "code": "MU", "flag": "🇲🇺"},
  {"name": "Mexico", "code": "MX", "flag": "🇲🇽"},
  {"name": "Moldova", "code": "MD", "flag": "🇲🇩"},
  {"name": "Monaco", "code": "MC", "flag": "🇲🇨"},
  {"name": "Mongolia", "code": "MN", "flag": "🇲🇳"},
  {"name": "Montenegro", "code": "ME", "flag": "🇲🇪"},
  {"name": "Morocco", "code": "MA", "flag": "🇲🇦"},
  {"name": "Mozambique", "code": "MZ", "flag": "🇲🇿"},
  {"name": "Myanmar", "code": "MM", "flag": "🇲🇲"},
  {"name": "Namibia", "code": "NA", "flag": "🇳🇦"},
  {"name": "Nepal", "code": "NP", "flag": "🇳🇵"},
  {"name": "Netherlands", "code": "NL", "flag": "🇳🇱"},
  {"name": "New Zealand", "code": "NZ", "flag": "🇳🇿"},
  {"name": "Nicaragua", "code": "NI", "flag": "🇳🇮"},
  {"name": "Niger", "code": "NE", "flag": "🇳🇪"},
  {"name": "Nigeria", "code": "NG", "flag": "🇳🇬"},
  {"name": "North Korea", "code": "KP", "flag": "🇰🇵"},
  {"name": "North Macedonia", "code": "MK", "flag": "🇲🇰"},
  {"name": "Norway", "code": "NO", "flag": "🇳🇴"},
  {"name": "Oman", "code": "OM", "flag": "🇴🇲"},
  {"name": "Pakistan", "code": "PK", "flag": "🇵🇰"},
  {"name": "Palestine", "code": "PS", "flag": "🇵🇸"},
  {"name": "Panama", "code": "PA", "flag": "🇵🇦"},
  {"name": "Papua New Guinea", "code": "PG", "flag": "🇵🇬"},
  {"name": "Paraguay", "code": "PY", "flag": "🇵🇾"},
  {"name": "Peru", "code": "PE", "flag": "🇵🇪"},
  {"name": "Philippines", "code": "PH", "flag": "🇵🇭"},
  {"name": "Poland", "code": "PL", "flag": "🇵🇱"},
  {"name": "Portugal", "code": "PT", "flag": "🇵🇹"},
  {"name": "Qatar", "code": "QA", "flag": "🇶🇦"},
  {"name": "Romania", "code": "RO", "flag": "🇷🇴"},
  {"name": "Russia", "code": "RU", "flag": "🇷🇺"},
  {"name": "Rwanda", "code": "RW", "flag": "🇷🇼"},
  {"name": "Saudi Arabia", "code": "SA", "flag": "🇸🇦"},
  {"name": "Scotland", "code": "GB-SCT", "flag": "https://flagcdn.com/gb-sct.svg"},
  {"name": "Senegal", "code": "SN", "flag": "🇸🇳"},
  {"name": "Serbia", "code": "RS", "flag": "🇷🇸"},
  {"name": "Singapore", "code": "SG", "flag": "🇸🇬"},
  {"name": "Slovakia", "code": "SK", "flag": "🇸🇰"},
  {"name": "Slovenia", "code": "SI", "flag": "🇸🇮"},
  {"name": "Somalia", "code": "SO", "flag": "🇸🇴"},
  {"name": "South Africa", "code": "ZA", "flag": "🇿🇦"},
  {"name": "South Korea", "code": "KR", "flag": "🇰🇷"},
  {"name": "South Sudan", "code": "SS", "flag": "🇸🇸"},
  {"name": "Spain", "code": "ES", "flag": "🇪🇸"},
  {"name": "Sri Lanka", "code": "LK", "flag": "🇱🇰"},
  {"name": "Sudan", "code": "SD", "flag": "🇸🇩"},
  {"name": "Suriname", "code": "SR", "flag": "🇸🇷"},
  {"name": "Sweden", "code": "SE", "flag": "🇸🇪"},
  {"name": "Switzerland", "code": "CH", "flag": "🇨🇭"},
  {"name": "Syria", "code": "SY", "flag": "🇸🇾"},
  {"name": "Taiwan", "code": "TW", "flag": "🇹🇼"},
  {"name": "Tajikistan", "code": "TJ", "flag": "🇹🇯"},
  {"name": "Tanzania", "code": "TZ", "flag": "🇹🇿"},
  {"name": "Thailand", "code": "TH", "flag": "🇹🇭"},
  {"name": "Togo", "code": "TG", "flag": "🇹🇬"},
  {"name": "Trinidad and Tobago", "code": "TT", "flag": "🇹🇹"},
  {"name": "Tunisia", "code": "TN", "flag": "🇹🇳"},
  {"name": "Turkey", "code": "TR", "flag": "🇹🇷"},
  {"name": "Turkmenistan", "code": "TM", "flag": "🇹🇲"},
  {"name": "Uganda", "code": "UG", "flag": "🇺🇬"},
  {"name": "Ukraine", "code": "UA", "flag": "🇺🇦"},
  {"name": "United Arab Emirates", "code": "AE", "flag": "🇦🇪"},
  {"name": "United Kingdom", "code": "GB", "flag": "🇬🇧"},
  {"name": "United States", "code": "US", "flag": "🇺🇸"},
  {"name": "Uruguay", "code": "UY", "flag": "🇺🇾"},
  {"name": "Uzbekistan", "code": "UZ", "flag": "🇺🇿"},
  {"name": "Vatican City", "code": "VA", "flag": "🇻🇦"},
  {"name": "Venezuela", "code": "VE", "flag": "🇻🇪"},
  {"name": "Vietnam", "code": "VN", "flag": "🇻🇳"},
  {"name": "Wales", "code": "GB-WLS", "flag": "🏴󠁧󠁢󠁷󠁬󠁳󠁿"},
  {"name": "Yemen", "code": "YE", "flag": "🇾🇪"},
  {"name": "Zambia", "code": "ZM", "flag": "🇿🇲"},
  {"name": "Zimbabwe", "code": "ZW", "flag": "🇿🇼"},
];
function loadImgFromUrl(url){
  return new Promise((res,rej)=>{
    const img = new Image(); img.crossOrigin='anonymous';
    img.onload=()=>res(img); img.onerror=()=>rej();
    img.src=url;
  });
}

// ── Generic search dropdown builder ───────────────────────────
function makeSearchDropdown({ inputId, clearId, dropdownId, iconId, iconType, items, onSelect }){
  const input    = document.getElementById(inputId);
  const clearBtn = document.getElementById(clearId);
  const dropdown = document.getElementById(dropdownId);
  const iconEl   = iconId ? document.getElementById(iconId) : null;

  function getFiltered(q){
    if(!q) return items.slice(0,10);
    const lq = q.toLowerCase();
    return items.filter(i=>i.name.toLowerCase().includes(lq)).slice(0,10);
  }

  function renderDropdown(q){
    const results = getFiltered(q);
    dropdown.innerHTML='';
    results.forEach(item=>{
      const div = document.createElement('div');
      div.className='cs-option';
      if(iconType==='logo'){
        const img = document.createElement('img');
        img.className='cs-option-logo'; img.src=item.logo; img.alt='';
        img.onerror=()=>img.style.display='none';
        div.appendChild(img);
      } else {
        const sp = document.createElement('span');
        sp.className='cs-option-flag'; sp.textContent=item.flag;
        div.appendChild(sp);
      }
      const name = document.createElement('span');
      name.textContent=item.name; div.appendChild(name);
      div.addEventListener('mousedown', e=>{ e.preventDefault(); onSelect(item); closeDropdown(); });
      dropdown.appendChild(div);
    });
    // "Adaugă manual" dacă nu e match exact
    if(q && !items.find(i=>i.name.toLowerCase()===q.toLowerCase())){
      const div = document.createElement('div');
      div.className='cs-option';
      const sp = document.createElement('span');
      sp.className='cs-option-add'; sp.textContent=`+ Adaugă manual: "${q}"`;
      div.appendChild(sp);
      div.addEventListener('mousedown', e=>{ e.preventDefault(); onSelect({name:q,logo:'',flag:'',code:''}); closeDropdown(); });
      dropdown.appendChild(div);
    }
    dropdown.classList.toggle('open', dropdown.children.length>0);
  }

  function closeDropdown(){ dropdown.classList.remove('open'); }

  input.addEventListener('focus', ()=>renderDropdown(input.value));
  input.addEventListener('input', ()=>{
    renderDropdown(input.value);
    clearBtn.classList.toggle('show', input.value.length>0);
  });
  input.addEventListener('blur',  ()=>setTimeout(closeDropdown,150));

  clearBtn.addEventListener('click', ()=>{
    input.value='';
    clearBtn.classList.remove('show');
    if(iconEl){ if(iconType==='logo'){iconEl.src='';iconEl.style.display='none';}else{iconEl.textContent='';} }
    onSelect(null);
    closeDropdown();
  });
}

// ── CLUB selector ──────────────────────────────────────────────
makeSearchDropdown({
  inputId:'csClubInput', clearId:'csClubClear',
  dropdownId:'csClubDropdown', iconId:'csClubIcon', iconType:'logo',
  items: CLUBS,
  onSelect: async (club) => {
    const icon  = document.getElementById('csClubIcon');
    const thumb = document.getElementById('logoThumb');
    if(!club || !club.logo){
      state.logoImg = null;
      icon.style.display='none'; thumb.style.display='none';
      draw(); return;
    }
    document.getElementById('csClubInput').value = club.name;
    document.getElementById('csClubClear').classList.add('show');
    icon.src=club.logo; icon.style.display='block';
    try {
      const img = await loadImgFromUrl(club.logo);
      state.logoImg = img;
      thumb.src=club.logo; thumb.style.display='block';
    } catch(e){ state.logoImg=null; }
    draw();
  }
});

// ── NATIONALITY selector ───────────────────────────────────────
makeSearchDropdown({
  inputId:'csNatInput', clearId:'csNatClear',
  dropdownId:'csNatDropdown', iconId:'csNatFlag', iconType:'flag',
  items: COUNTRIES,
  onSelect: async (country) => {
    const flagIcon    = document.getElementById('csNatFlag');
    const flagRow     = document.getElementById('flagPreviewRow');
    const flagThumb   = document.getElementById('flagThumbPreview');
    const flagNameEl  = document.getElementById('flagNamePreview');
    if(!country || !country.code){
      state.flagImg=null; state.flagEmoji='';
      flagIcon.textContent=''; flagRow.classList.remove('vis');
      draw(); return;
    }
    document.getElementById('csNatInput').value  = country.name;
    document.getElementById('csNatClear').classList.add('show');
    flagIcon.textContent = country.flag;
    state.flagEmoji = country.flag;
    // Construiește URL steag
    const code = country.code.toLowerCase();
    const flagUrl = `https://flagcdn.com/w80/${code}.png`;
    try {
      const img = await loadImgFromUrl(flagUrl);
      state.flagImg = img;
      flagThumb.src=flagUrl; flagNameEl.textContent=`${country.flag} ${country.name}`;
      flagRow.classList.add('vis');
    } catch(e){ state.flagImg=null; flagRow.classList.remove('vis'); }
    draw();
  }
});
// ══════════════════════════════════════════════════════════════
// BIBLIOTECA PERSONALĂ DE FUNDALURI (localStorage + folder local)
// ══════════════════════════════════════════════════════════════
const BG_LIB_KEY = 'playerCardBgLibrary_v1';
let bgLibSelectedId  = null;
let bgFolderImages   = []; // imagini din folder (sesiune curentă, calitate completă)

function bgLibLoad(){
  try{ return JSON.parse(localStorage.getItem(BG_LIB_KEY)) || []; }
  catch(e){ return []; }
}
function bgLibSave(lib){
  try{ localStorage.setItem(BG_LIB_KEY, JSON.stringify(lib)); }
  catch(e){
    alert('Spațiu insuficient în browser (localStorage plin).\nȘterge câteva imagini salvate pentru a face loc.');
  }
}

// Comprimă imaginea la max 1920px și JPEG 0.93 înainte de a o salva
function bgLibCompress(file, maxW=1920, q=0.93){
  return new Promise(res=>{
    const reader = new FileReader();
    reader.onload = e=>{
      const img = new Image();
      img.onload = ()=>{
        const sc = Math.min(1, maxW / Math.max(img.width, img.height));
        const w  = Math.round(img.width*sc), h = Math.round(img.height*sc);
        const c  = document.createElement('canvas');
        c.width=w; c.height=h;
        const cx = c.getContext('2d');
        cx.imageSmoothingEnabled = true;
        cx.imageSmoothingQuality = 'high';
        cx.drawImage(img,0,0,w,h);
        res(c.toDataURL('image/jpeg', q));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Încarcă un fișier ca Image object (calitate completă, fără compresie)
function loadFileAsImage(file){
  return new Promise(res=>{
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload  = ()=>res({img, url});
    img.onerror = ()=>res(null);
    img.src = url;
  });
}

function bgLibApply(item){
  bgLibSelectedId = item.id;
  document.querySelectorAll('.bg-lib-item').forEach(t=>t.classList.remove('active'));
  const tile = document.querySelector(`.bg-lib-item[data-id="${CSS.escape(String(item.id))}"]`);
  if(tile) tile.classList.add('active');
  // Folder images: use cached Image object directly
  if(item._imgObj){
    state.bgImage = item._imgObj;
    draw();
    const thumb = document.getElementById('bgThumb');
    thumb.src = item.src; thumb.style.display='block';
    return;
  }
  // Saved images: load from dataUrl
  const img = new Image();
  img.onload = ()=>{ state.bgImage = img; draw(); };
  img.src = item.dataUrl || item.src;
  const thumb = document.getElementById('bgThumb');
  thumb.src = item.dataUrl || item.src; thumb.style.display='block';
}

function bgLibMakeTile(item, isFolder){
  const tile = document.createElement('div');
  tile.className = 'bg-lib-item' + (item.id===bgLibSelectedId ? ' active' : '');
  tile.dataset.id = String(item.id);
  const src = isFolder ? item.src : item.dataUrl;
  tile.innerHTML = `
    <img src="${src}" alt="${item.name}"/>
    <div class="bg-overlay"></div>
    ${isFolder ? '<div class="folder-badge">📁</div>' : `<button class="del-btn" title="Șterge din bibliotecă">✕</button>`}
    <div class="img-name">${item.name}</div>
    ${!isFolder ? `<div class="bg-lib-rename" id="rename_${CSS.escape(String(item.id))}">
      <input type="text" value="${item.name}" maxlength="30"/>
      <button class="rename-ok">OK</button>
    </div>` : ''}`;

  // Click => aplică fundal
  tile.addEventListener('click', e=>{
    if(e.target.classList.contains('del-btn')) return;
    if(e.target.closest && e.target.closest('.bg-lib-rename')) return;
    bgLibApply(item);
  });

  if(!isFolder){
    // Dublu-click => redenumire
    tile.addEventListener('dblclick', e=>{
      if(e.target.classList.contains('del-btn')) return;
      const renameEl = document.getElementById(`rename_${CSS.escape(String(item.id))}`);
      if(renameEl){ renameEl.classList.add('open'); renameEl.querySelector('input').focus(); renameEl.querySelector('input').select(); }
    });
    const renameEl = tile.querySelector('.bg-lib-rename');
    if(renameEl){
      const confirmRename = ()=>{
        const newName = renameEl.querySelector('input').value.trim().slice(0,30) || item.name;
        const lib = bgLibLoad();
        const idx = lib.findIndex(i=>i.id===item.id);
        if(idx!==-1){ lib[idx].name=newName; bgLibSave(lib); }
        item.name = newName;
        tile.querySelector('.img-name').textContent = newName;
        renameEl.classList.remove('open');
      };
      renameEl.querySelector('.rename-ok').addEventListener('click', e=>{e.stopPropagation();confirmRename();});
      renameEl.querySelector('input').addEventListener('keydown', e=>{
        if(e.key==='Enter'){e.stopPropagation();confirmRename();}
        if(e.key==='Escape'){e.stopPropagation();renameEl.classList.remove('open');}
      });
    }
    // Ștergere
    const delBtn = tile.querySelector('.del-btn');
    if(delBtn) delBtn.addEventListener('click', e=>{
      e.stopPropagation();
      const lib = bgLibLoad();
      const idx = lib.findIndex(i=>i.id===item.id);
      if(idx!==-1) lib.splice(idx,1);
      bgLibSave(lib);
      if(bgLibSelectedId===item.id){
        bgLibSelectedId=null; state.bgImage=null;
        document.getElementById('bgThumb').style.display='none';
        draw();
      }
      bgLibRender();
    });
  }
  return tile;
}

function bgLibRender(){
  const lib   = bgLibLoad();
  const grid  = document.getElementById('bgLibGrid');
  const count = document.getElementById('bgLibCount');
  const total = lib.length + bgFolderImages.length;
  if(count) count.textContent = total > 0 ? total : '';
  grid.innerHTML = '';

  // ── Tile "+" pentru adăugare individuală ──
  const addTile = document.createElement('div');
  addTile.className = 'bg-lib-add';
  addTile.title = 'Adaugă imagini individuale (salvate permanent)';
  addTile.innerHTML = `
    <input type="file" accept="image/*" multiple/>
    <div class="plus">＋</div>
    <div class="plus-lbl">Adaugă</div>`;
  addTile.querySelector('input').addEventListener('change', async function(){
    const files = Array.from(this.files);
    if(!files.length) return;
    const lib = bgLibLoad();
    for(const file of files){
      const dataUrl = await bgLibCompress(file);
      const name    = file.name.replace(/\.[^.]+$/, '').slice(0,30);
      lib.push({ id: Date.now()+Math.random(), name, dataUrl });
    }
    bgLibSave(lib);
    bgLibRender();
    this.value='';
  });
  grid.appendChild(addTile);

  // ── Imagini din folder (sesiune) ──
  if(bgFolderImages.length > 0){
    const sep = document.createElement('div');
    sep.className = 'bg-lib-sep';
    sep.textContent = `📁 Folder (${bgFolderImages.length})`;
    grid.appendChild(sep);
    bgFolderImages.forEach(item=> grid.appendChild(bgLibMakeTile(item, true)));
  }

  // ── Imagini salvate (localStorage) ──
  if(lib.length > 0){
    const sep2 = document.createElement('div');
    sep2.className = 'bg-lib-sep';
    sep2.textContent = `💾 Salvate (${lib.length})`;
    grid.appendChild(sep2);
    lib.forEach(item=> grid.appendChild(bgLibMakeTile(item, false)));
  }

  // ── Empty state ──
  if(lib.length === 0 && bgFolderImages.length === 0){
    const empty = document.createElement('div');
    empty.className = 'bg-lib-empty';
    empty.style.gridColumn = 'span 2';
    empty.innerHTML = 'Nicio imagine.<br>📁 Deschide un folder sau apasă <b>＋</b>.';
    grid.appendChild(empty);
  }
}

// ── Folder loader ──────────────────────────────────────────────
document.getElementById('bgFolderInput').addEventListener('change', async function(){
  const files = Array.from(this.files).filter(f=> f.type.startsWith('image/'));
  if(!files.length) return;

  // Eliberează blob URL-urile vechi
  bgFolderImages.forEach(i=>{ if(i.src && i.src.startsWith('blob:')) URL.revokeObjectURL(i.src); });
  bgFolderImages = [];

  const btn = document.getElementById('bgFolderBtn');
  btn.style.opacity = '0.6';

  // Sortează alfabetic după nume
  files.sort((a,b)=> a.name.localeCompare(b.name));

  for(const file of files){
    const result = await loadFileAsImage(file);
    if(!result) continue;
    bgFolderImages.push({
      id:   'folder_' + file.name,
      name: file.name.replace(/\.[^.]+$/, '').slice(0,30),
      src:  result.url,
      _imgObj: result.img
    });
  }

  btn.style.opacity = '1';
  // Actualizează textul butonului cu numărul de imagini
  const folderName = files[0].webkitRelativePath
    ? files[0].webkitRelativePath.split('/')[0]
    : 'folder';
  btn.childNodes[1].textContent = ` 📁 ${folderName} (${bgFolderImages.length} imagini)`;

  bgLibRender();
  this.value='';
});

// Inițializare la pornire
bgLibRender();

// ── Drag player image ──────────────────────────────────────

canvas.addEventListener('mousedown', e=>{
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top)  * scaleY;
  if(isOnPlayer(mx, my)){
    dragging = true;
    dragStartX = e.clientX; dragStartY = e.clientY;
    origX = state.playerX; origY = state.playerY;
    canvas.style.cursor = 'grabbing';
  }
});
window.addEventListener('mousemove', e=>{
  if(!dragging) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const dx = (e.clientX - dragStartX) * scaleX;
  const dy = (e.clientY - dragStartY) * scaleX;
  state.playerX = origX + dx;
  state.playerY = origY + dy;
  draw();
});
window.addEventListener('mouseup', ()=>{ dragging=false; canvas.style.cursor='move'; });

// Scroll to scale
canvas.addEventListener('wheel', e=>{
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.05 : 0.05;
  state.playerScale = Math.max(0.3, Math.min(3, state.playerScale + delta));
  document.getElementById('playerScale').value = Math.round(state.playerScale*100);
  document.getElementById('scaleVal').textContent = Math.round(state.playerScale*100)+'%';
  draw();
}, {passive:false});

// Touch drag
let touchStartX=0, touchStartY=0, touchOrigX=0, touchOrigY=0;
canvas.addEventListener('touchstart', e=>{
  const t = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const mx = (t.clientX - rect.left)*sx, my = (t.clientY - rect.top)*sx;
  if(isOnPlayer(mx,my)){
    touchStartX=t.clientX; touchStartY=t.clientY;
    touchOrigX=state.playerX; touchOrigY=state.playerY;
    dragging=true;
  }
},{passive:true});
canvas.addEventListener('touchmove', e=>{
  if(!dragging) return;
  e.preventDefault();
  const t = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  state.playerX = touchOrigX + (t.clientX-touchStartX)*sx;
  state.playerY = touchOrigY + (t.clientY-touchStartY)*sx;
  draw();
},{passive:false});
canvas.addEventListener('touchend', ()=>{ dragging=false; });

function isOnPlayer(mx, my){
  if(!state.playerImg) return false;
  const {pw, ph, px, py} = getPlayerRect();
  return mx >= px && mx <= px+pw && my >= py && my <= py+ph;
}
function getPlayerRect(){
  const W=canvas.width, H=canvas.height;
  const img = state.playerImg;
  if(!img) return {pw:0,ph:0,px:0,py:0};
  const aspect = img.naturalWidth / img.naturalHeight;
  const ph = H * 0.92 * state.playerScale;
  const pw = ph * aspect;
  const px = W/2 - pw/2 + state.playerX;
  const py = H - ph + state.playerY;
  return {pw, ph, px, py};
}

// ── DRAW ──────────────────────────────────────────────────
function draw(){
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  // 1. Background
  ctx.imageSmoothingEnabled  = true;
  ctx.imageSmoothingQuality  = 'high';
  if(state.bgImage){
    // cover-fit
    const bw = state.bgImage.naturalWidth, bh = state.bgImage.naturalHeight;
    const scale = Math.max(W/bw, H/bh);
    const dw = bw*scale, dh = bh*scale;
    ctx.drawImage(state.bgImage, (W-dw)/2, (H-dh)/2, dw, dh);
  } else {
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0,0,W,H);
    // decorative lightning bolt
    drawLightning(W, H);
  }

  // 2. Player image
  if(state.playerImg){
    const {pw, ph, px, py} = getPlayerRect();
    ctx.save();
    if(state.playerMirror){
      ctx.translate(px + pw/2, 0);
      ctx.scale(-1,1);
      ctx.drawImage(state.playerImg, -pw/2, py, pw, ph);
    } else {
      ctx.drawImage(state.playerImg, px, py, pw, ph);
    }
    ctx.restore();
  }

  // 3. Left overlay gradient for text readability
  const leftOvl = ctx.createLinearGradient(0,0,W*0.38,0);
  leftOvl.addColorStop(0,'rgba(0,0,0,0.55)');
  leftOvl.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle = leftOvl;
  ctx.fillRect(0,0,W,H);

  // 4. Bottom overlay for name/stars
  const botOvl = ctx.createLinearGradient(0,H*0.72,0,H);
  botOvl.addColorStop(0,'rgba(0,0,0,0)');
  botOvl.addColorStop(1,'rgba(0,0,0,0.5)');
  ctx.fillStyle = botOvl;
  ctx.fillRect(0,0,W,H);

  // ── Text shadow helper ──
  function setShadow(){
    if(state.textShadow==='strong'){ ctx.shadowColor='rgba(0,0,0,0.95)'; ctx.shadowBlur=14; ctx.shadowOffsetX=2; ctx.shadowOffsetY=2; }
    else if(state.textShadow==='medium'){ ctx.shadowColor='rgba(0,0,0,0.7)'; ctx.shadowBlur=7; ctx.shadowOffsetX=1; ctx.shadowOffsetY=1; }
    else { ctx.shadowColor='transparent'; ctx.shadowBlur=0; ctx.shadowOffsetX=0; ctx.shadowOffsetY=0; }
  }
  function clearShadow(){ ctx.shadowColor='transparent'; ctx.shadowBlur=0; ctx.shadowOffsetX=0; ctx.shadowOffsetY=0; }

  const rFS = Math.round(H * 0.155); // rating font size
  const pFS = Math.round(H * 0.07);  // position font size
  const leftX = Math.round(W * 0.065);

  // 5. Rating
  setShadow();
  ctx.font = `100 ${rFS}px "eFootball Stencil"`;
  ctx.fillStyle = state.ratingColor;
  ctx.textBaseline = 'top';
  ctx.fillText(String(state.rating), leftX, Math.round(H*0.04));

  // 6. Position
  ctx.font = `100 ${pFS}px "eFootball Stencil"`;
  ctx.fillStyle = state.ratingColor;
  ctx.fillText(state.position, leftX, Math.round(H*0.04 + rFS + H*0.005));

  // 7. Club logo
  const logoY = Math.round(H*0.04 + rFS + pFS + H*0.02);
  const logoSize = Math.round(H * 0.095);
  if(state.logoImg){
    clearShadow();
    const lNatW = state.logoImg.naturalWidth  || logoSize;
    const lNatH = state.logoImg.naturalHeight || logoSize;
    const lAspect = lNatW / lNatH;
    let lDrawW = logoSize, lDrawH = logoSize;
    if(lAspect >= 1){ lDrawH = logoSize / lAspect; }
    else            { lDrawW = logoSize * lAspect; }
    ctx.drawImage(state.logoImg, leftX, logoY, lDrawW, lDrawH);
  } else {
    // Default club emoji when no logo selected
    ctx.save();
    const emojiFS = Math.round(logoSize * 0.85);
    ctx.font = `${emojiFS}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.82;
    ctx.fillText('🌍', leftX + logoSize/2, logoY + logoSize/2);
    ctx.restore();
  }

  // 7b. Nationality flag (below club logo)
  const flagSize = Math.round(H * 0.075);
  const flagY = logoY + logoSize + Math.round(H * 0.015);
  if(state.flagImg){
    clearShadow();
    // Rounded clip for flag
    ctx.save();
    const fr = 4;
    ctx.beginPath();
    ctx.moveTo(leftX+fr, flagY);
    ctx.lineTo(leftX+flagSize-fr, flagY);
    ctx.quadraticCurveTo(leftX+flagSize, flagY, leftX+flagSize, flagY+fr);
    ctx.lineTo(leftX+flagSize, flagY+flagSize*0.67-fr);
    ctx.quadraticCurveTo(leftX+flagSize, flagY+flagSize*0.67, leftX+flagSize-fr, flagY+flagSize*0.67);
    ctx.lineTo(leftX+fr, flagY+flagSize*0.67);
    ctx.quadraticCurveTo(leftX, flagY+flagSize*0.67, leftX, flagY+flagSize*0.67-fr);
    ctx.lineTo(leftX, flagY+fr);
    ctx.quadraticCurveTo(leftX, flagY, leftX+fr, flagY);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(state.flagImg, leftX, flagY, flagSize, flagSize*0.67);
    ctx.restore();
  }

  // 8. Player name — rotated vertical on left edge
  ctx.save();
  const nameFS = Math.round(H * 0.078);
  const abbr = state.firstName ? state.firstName.charAt(0).toUpperCase() + '.' : '';
  const displayName = (abbr + ' ' + state.lastName).trim();
  ctx.font = `italic 100 ${nameFS}px "eFootball Stencil"`;
  ctx.textBaseline = 'top';

  setShadow();
  ctx.fillStyle = state.nameColor;

  // Measure text to position it
  const metrics = ctx.measureText(displayName);
  const tWidth = metrics.width;

  const nameX = Math.round(W * 0.15);
  const nameBottomY = Math.round(H * 0.93);

  ctx.translate(nameX, nameBottomY);
  ctx.rotate(-Math.PI/2);
  ctx.fillText(displayName, 0, -nameFS*0.85);
  ctx.restore();
  clearShadow();

  // 9. Stars at bottom
const numStars = Math.max(1, Math.min(5, state.stars));
const starFS = Math.round(H * 0.055);

ctx.font = `${starFS}px serif`;
ctx.textBaseline = 'alphabetic';

setShadow();

const starFilled = '★'.repeat(numStars);
const starEmpty  = '☆'.repeat(5-numStars);

const allStars = starFilled + starEmpty;

// daca are efect activ -> centru
let starX;

if(state.cardEffect !== 'none'){
   const totalWidth = ctx.measureText(allStars).width;
   starX = (W - totalWidth)/2; // centrare
}
else{
   starX = Math.round(W * 0.055); // pozitia veche
}

let starY;

if(state.cardEffect !== 'none'){
  starY = Math.round(H * 0.94); // mai sus când e centrat
} else {
  starY = Math.round(H * 0.975); // poziția veche
}

// stele aurii
ctx.fillStyle='#ffd700';
ctx.fillText(starFilled, starX, starY);

// stele goale
const filledW = ctx.measureText(starFilled).width;

ctx.fillStyle='rgba(200,200,200,.7)';
ctx.fillText(starEmpty, starX + filledW, starY);



  clearShadow();

  // 10. FIFA Card Effects (on top of everything)
  if(state.cardEffect !== 'none'){
    drawFIFAEffects(W, H);
  }
}

// Decorative lightning / chevron shapes when no bg image
function drawLightning(W, H){
  const c = state.bgColor;
  // lighter variant
  const lighter = lightenColor(c, 30);
  const darker  = darkenColor(c, 20);

  ctx.save();

  // big chevron right
  ctx.beginPath();
  ctx.moveTo(W*0.45, 0);
  ctx.lineTo(W*0.82, 0);
  ctx.lineTo(W*0.55, H*0.55);
  ctx.lineTo(W*0.75, H);
  ctx.lineTo(W*0.42, H);
  ctx.lineTo(W*0.14, H*0.45);
  ctx.closePath();
  ctx.fillStyle = lighter;
  ctx.fill();

  // small accent
  ctx.beginPath();
  ctx.moveTo(W*0.62, 0);
  ctx.lineTo(W, 0);
  ctx.lineTo(W, H*0.3);
  ctx.lineTo(W*0.7, H*0.55);
  ctx.lineTo(W*0.55, H*0.3);
  ctx.closePath();
  ctx.fillStyle = lightenColor(c, 50);
  ctx.fill();

  ctx.restore();
}

function lightenColor(hex, pct){
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `rgb(${Math.min(255,r+pct*2)},${Math.min(255,g+pct*2)},${Math.min(255,b+pct)})`;
}
function darkenColor(hex, pct){
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `rgb(${Math.max(0,r-pct)},${Math.max(0,g-pct)},${Math.max(0,b-pct)})`;
}

// ── FIFA CARD EFFECTS ─────────────────────────────────────
function getEffectColors(e){
  switch(e){
    case 'gold':    return ['#7a5000','#c8860a','#ffd700','#fff4a0','#ffd700','#c8860a','#7a5000'];
    case 'silver':  return ['#444','#999','#ddd','#ffffff','#ddd','#999','#444'];
    case 'inform':  return ['#0d3b1a','#1a7a35','#2dbd4e','#80ffaa','#2dbd4e','#1a7a35','#0d3b1a'];
    case 'special': return ['#ff0080','#ff6600','#ffff00','#00ff80','#0088ff','#aa00ff','#ff0080'];
    case 'toty':    return ['#1a0a40','#5a10cc','#9932cc','#e0a0ff','#9932cc','#5a10cc','#1a0a40'];
    // ── Noi efecte UCL / competiții europene ──
    case 'ucl':    return ['#00205b','#0052b4','#1a9fff','#c8e8ff','#1a9fff','#0052b4','#00205b'];
    case 'uel':    return ['#4a1500','#cc4400','#ff6600','#ffcc88','#ff6600','#cc4400','#4a1500'];
    case 'uecl':   return ['#003322','#007744','#00cc77','#88ffcc','#00cc77','#007744','#003322'];
    // ── TOTT — Team of the Tournament ──
    case 'tott':   return ['#6a0030','#cc0066','#ff44aa','#ffccee','#ff44aa','#cc0066','#6a0030'];
    // ── FUT Heroes ──
    case 'heroes': return ['#3a1a00','#884400','#cc6600','#ffcc44','#ff8800','#884400','#3a1a00'];
    // ── Path to Glory ──
    case 'ptg':    return ['#550011','#bb0033','#ff2244','#ff99aa','#ff2244','#bb0033','#550011'];
    // ── Thunderstruck ──
    case 'thunderstruck': return ['#1a1400','#887700','#ffdd00','#fffaaa','#50b4ff','#0066cc','#1a1400'];
    // ── Winter Wildcards ──
    case 'wildcards': return ['#0a1e33','#2266aa','#55aaff','#cceeff','#aaddff','#2266aa','#0a1e33'];
    default:        return ['#666','#999','#fff','#fff','#999','#666'];
  }
}

function drawFIFAEffects(W, H){
  const colors = getEffectColors(state.cardEffect);
  const bw = Math.round(W * 0.022); // border width

  ctx.save();

  // ── Border frame (metallic gradient) ──
  const borderGrad = ctx.createLinearGradient(0, 0, W, H);
  colors.forEach((c, i) => borderGrad.addColorStop(i / (colors.length - 1), c));

  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = bw * 2;
  ctx.strokeRect(bw, bw, W - bw*2, H - bw*2);

  // Inner thin border with glow
  ctx.shadowColor = colors[3];
  ctx.shadowBlur = 12;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bw*2.2, bw*2.2, W - bw*4.4, H - bw*4.4);
  ctx.shadowBlur = 0;

  // ── Corner diamond ornaments ──
  drawCornerOrnaments(W, H, colors[3], colors[2], bw);

  // ── Diagonal shine sweep ──
  drawShine(W, H);

  // ── Special: holographic edge shimmer ──
  if(state.cardEffect === 'special' || state.cardEffect === 'toty'){
    drawHolographicEdge(W, H, colors);
  }

  // ── UCL: dark-blue vignette + star cluster ──
  if(state.cardEffect === 'ucl'){
    // Bottom dark gradient
    const vg = ctx.createLinearGradient(0, H*0.6, 0, H);
    vg.addColorStop(0, 'rgba(0,32,91,0)');
    vg.addColorStop(1, 'rgba(0,32,91,0.55)');
    ctx.fillStyle = vg; ctx.fillRect(0,0,W,H);
    // UCL star ring bottom-center
    const cx = W/2, cy = H*0.88;
    const starR = W*0.045;
    const numS = 8;
    ctx.save();
    for(let i=0;i<numS;i++){
      const a = (i/numS)*Math.PI*2 - Math.PI/2;
      const sx = cx + Math.cos(a)*W*0.28;
      const sy = cy + Math.sin(a)*H*0.045;
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = '#c8e8ff';
      ctx.shadowColor = '#1a9fff'; ctx.shadowBlur = 8;
      ctx.font = `bold ${Math.round(starR*1.1)}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('★', sx, sy);
    }
    ctx.restore();
  }

  // ── UEL: warm orange diagonal stripes ──
  if(state.cardEffect === 'uel'){
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = W*0.045;
    for(let i=-3;i<=6;i++){
      const x = i*(W*0.22);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + H*0.4, H);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // ── UECL: green hexagon pattern (faint) ──
  if(state.cardEffect === 'uecl'){
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#00cc77';
    ctx.lineWidth = 1.2;
    const hw = W*0.07, hh = H*0.055;
    for(let row=-1;row<Math.ceil(H/hh/1.5)+1;row++){
      for(let col=-1;col<Math.ceil(W/hw)+1;col++){
        const ox = col*hw + (row%2)*hw*0.5;
        const oy = row*hh*1.5;
        ctx.beginPath();
        for(let p=0;p<6;p++){
          const pa = (p/6)*Math.PI*2 - Math.PI/6;
          const px2 = ox + Math.cos(pa)*hw*0.48;
          const py2 = oy + Math.sin(pa)*hh*0.48;
          p===0 ? ctx.moveTo(px2,py2) : ctx.lineTo(px2,py2);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // ── TOTT: pink-gold prismatic overlay ──
  if(state.cardEffect === 'tott'){
    ctx.save();
    const pg = ctx.createLinearGradient(0,0,W,H);
    pg.addColorStop(0,   'rgba(255,68,170,0.09)');
    pg.addColorStop(0.5, 'rgba(255,215,0,0.07)');
    pg.addColorStop(1,   'rgba(255,68,170,0.09)');
    ctx.fillStyle = pg; ctx.fillRect(0,0,W,H);
    // Trophy-style ribbon badge top-center
    ctx.fillStyle = 'rgba(255,68,170,0.25)';
    ctx.beginPath();
    ctx.moveTo(W*0.38, 0);
    ctx.lineTo(W*0.62, 0);
    ctx.lineTo(W*0.62, H*0.06);
    ctx.lineTo(W*0.5, H*0.08);
    ctx.lineTo(W*0.38, H*0.06);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // ── HEROES: dark dramatic hero glow ──
  if(state.cardEffect === 'heroes'){
    ctx.save();
    // Dark vignette top + sides
    const hg = ctx.createRadialGradient(W/2, H*0.5, H*0.15, W/2, H*0.5, H*0.85);
    hg.addColorStop(0, 'rgba(0,0,0,0)');
    hg.addColorStop(1, 'rgba(20,8,0,0.55)');
    ctx.fillStyle = hg; ctx.fillRect(0,0,W,H);
    // Amber glow center-bottom
    const ag = ctx.createRadialGradient(W/2, H*0.9, 0, W/2, H*0.9, H*0.5);
    ag.addColorStop(0, 'rgba(255,150,0,0.18)');
    ag.addColorStop(1, 'rgba(255,100,0,0)');
    ctx.fillStyle = ag; ctx.fillRect(0,0,W,H);
    // Hero shield ornament bottom center
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 10;
    const sx = W/2, sy = H*0.92, sw = W*0.09, sh = H*0.055;
    ctx.beginPath();
    ctx.moveTo(sx - sw, sy - sh);
    ctx.lineTo(sx + sw, sy - sh);
    ctx.lineTo(sx + sw, sy);
    ctx.lineTo(sx, sy + sh);
    ctx.lineTo(sx - sw, sy);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  }

  // ── PATH TO GLORY: red-to-dark diagonal burn ──
  if(state.cardEffect === 'ptg'){
    ctx.save();
    const rg = ctx.createLinearGradient(0, H, W, 0);
    rg.addColorStop(0, 'rgba(180,0,30,0.22)');
    rg.addColorStop(0.5, 'rgba(100,0,10,0.08)');
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rg; ctx.fillRect(0,0,W,H);
    // Diagonal speed lines
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#ff2244';
    ctx.lineWidth = 1;
    for(let i=0;i<5;i++){
      const yp = H*(0.55 + i*0.1);
      ctx.beginPath();
      ctx.moveTo(0, yp);
      ctx.lineTo(W*0.7, yp - H*0.1);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // ── THUNDERSTRUCK: electric yellow + blue bolt glow ──
  if(state.cardEffect === 'thunderstruck'){
    ctx.save();
    // Yellow glow top-center
    const tg = ctx.createRadialGradient(W/2, 0, 0, W/2, 0, H*0.6);
    tg.addColorStop(0, 'rgba(255,221,0,0.18)');
    tg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = tg; ctx.fillRect(0,0,W,H);
    // Blue glow bottom-center
    const bg2 = ctx.createRadialGradient(W/2, H, 0, W/2, H, H*0.55);
    bg2.addColorStop(0, 'rgba(80,180,255,0.18)');
    bg2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bg2; ctx.fillRect(0,0,W,H);
    // Central lightning bolt silhouette
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#ffdd00';
    ctx.shadowColor = '#ffdd00'; ctx.shadowBlur = 20;
    const bx = W/2, by = H*0.08, bh = H*0.28, bw2 = W*0.08;
    ctx.beginPath();
    ctx.moveTo(bx - bw2*0.4, by);
    ctx.lineTo(bx + bw2, by);
    ctx.lineTo(bx, by + bh*0.5);
    ctx.lineTo(bx + bw2*0.6, by + bh*0.5);
    ctx.lineTo(bx - bw2*0.8, by + bh);
    ctx.lineTo(bx - bw2*0.1, by + bh*0.55);
    ctx.lineTo(bx - bw2*0.9, by + bh*0.55);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.restore();
  }

  // ── WINTER WILDCARDS: icy blue vignette + snowflake ornaments ──
  if(state.cardEffect === 'wildcards'){
    ctx.save();
    // Cool blue overlay
    const wg = ctx.createLinearGradient(0, 0, 0, H);
    wg.addColorStop(0, 'rgba(136,204,255,0.14)');
    wg.addColorStop(1, 'rgba(0,50,120,0.18)');
    ctx.fillStyle = wg; ctx.fillRect(0,0,W,H);
    // Snowflake ornaments at corners
    ctx.font = `${Math.round(W*0.055)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(200,240,255,0.5)';
    ctx.shadowColor = '#88ccff'; ctx.shadowBlur = 8;
    const sp = bw*2.8;
    [[sp, sp],[W-sp, sp],[sp, H-sp],[W-sp, H-sp]].forEach(([sx,sy]) => {
      ctx.fillText('❄', sx, sy);
    });
    ctx.restore();
  }

  ctx.restore();
}

function drawCornerOrnaments(W, H, colorInner, colorOuter, bw){
  const effect = state.cardEffect;

  // ── Efectele noi primesc spini/aripioare specifice ──
  if(['ucl','uel','uecl','tott','heroes','ptg','thunderstruck','wildcards'].includes(effect)){
    drawSpecialCornerSpikes(W, H, colorInner, colorOuter, bw, effect);
    return;
  }

  // ── Efectele clasice: diamond-uri ──
  const s = W * 0.058;
  const pad = bw * 1.2;
  const corners = [
    [pad + s*0.5, pad + s*0.5],
    [W - pad - s*0.5, pad + s*0.5],
    [pad + s*0.5, H - pad - s*0.5],
    [W - pad - s*0.5, H - pad - s*0.5],
  ];
  ctx.save();
  corners.forEach(([cx, cy])=>{
    ctx.beginPath();
    ctx.moveTo(cx, cy - s*0.52);
    ctx.lineTo(cx + s*0.3, cy);
    ctx.lineTo(cx, cy + s*0.52);
    ctx.lineTo(cx - s*0.3, cy);
    ctx.closePath();
    ctx.fillStyle = colorOuter;
    ctx.globalAlpha = 0.85;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx, cy - s*0.28);
    ctx.lineTo(cx + s*0.17, cy);
    ctx.lineTo(cx, cy + s*0.28);
    ctx.lineTo(cx - s*0.17, cy);
    ctx.closePath();
    ctx.fillStyle = colorInner;
    ctx.globalAlpha = 1;
    ctx.fill();
  });
  ctx.restore();
}

// Desenează ornamente de colț specifice fiecărui efect special
// Inspirat din cardul UCL: spini ascuțiți care ies în afara cardului
function drawSpecialCornerSpikes(W, H, colorInner, colorOuter, bw, effect){
  ctx.save();

  // Gradient metalic pentru spini
  const makeGrad = (x0,y0,x1,y1) => {
    const g = ctx.createLinearGradient(x0,y0,x1,y1);
    g.addColorStop(0, colorOuter);
    g.addColorStop(0.5, colorInner);
    g.addColorStop(1, colorOuter);
    return g;
  };

  const sz = W * 0.13;   // dimensiunea ornamentului
  const sp = bw * 0.8;   // offset față de margine

  // Cele 4 colțuri: [x, y, dirX, dirY, rotAngle]
  // dirX/Y = direcția în care ies spinii (+1 sau -1)
  const corners = [
    [sp,   sp,   -1, -1],  // top-left
    [W-sp, sp,    1, -1],  // top-right
    [sp,   H-sp, -1,  1],  // bottom-left
    [W-sp, H-sp,  1,  1],  // bottom-right
  ];

  corners.forEach(([cx, cy, dx, dy]) => {
    ctx.save();
    ctx.translate(cx, cy);

    if(effect === 'ucl'){
      // ── UCL: stea cu 5 varfuri autentica FIFA UCL + spike exterior ──
      const star5 = (scx, scy, oR, iR, rot) => {
        ctx.beginPath();
        for(let p = 0; p < 10; p++){
          const a = (p / 10) * Math.PI * 2 + rot;
          const r = (p % 2 === 0) ? oR : iR;
          const px2 = scx + Math.cos(a) * r;
          const py2 = scy + Math.sin(a) * r;
          p === 0 ? ctx.moveTo(px2, py2) : ctx.lineTo(px2, py2);
        }
        ctx.closePath();
      };

      const sCx = dx * sz * -0.007;
      const sCy = dy * sz * -0.007;
      const oR  = sz * 0.68;
      const iR  = sz * 0.28;
      // Un varf al stelei pointeaza diagonal spre exteriorul cardului
      const rot = Math.atan2(dy, dx) - Math.PI / 2;

      // 1) Halo exterior difuz
      ctx.shadowColor = '#4db8ff';
      ctx.shadowBlur  = 30;
      ctx.fillStyle   = 'rgba(26,159,255,0.18)';
      ctx.globalAlpha = 1;
      star5(sCx, sCy, oR * 1.45, iR * 1.45, rot);
      ctx.fill();

      // 2) Corp principal stea – gradient radial alb → albastru UCL → navy
      const radG = ctx.createRadialGradient(sCx, sCy, 0, sCx, sCy, oR);
      radG.addColorStop(0,    '#ffffff');
      radG.addColorStop(0.25, '#c8e8ff');
      radG.addColorStop(0.6,  '#1a9fff');
      radG.addColorStop(1,    '#003080');
      ctx.fillStyle   = radG;
      ctx.globalAlpha = 0.97;
      ctx.shadowColor = '#1a9fff';
      ctx.shadowBlur  = 20;
      star5(sCx, sCy, oR, iR, rot);
      ctx.fill();

      // 3) Contur luminos alb-albastru
      ctx.strokeStyle = '#c8e8ff';
      ctx.lineWidth   = 1.6;
      ctx.globalAlpha = 0.90;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur  = 8;
      star5(sCx, sCy, oR, iR, rot);
      ctx.stroke();

      // 4) Spike ascutit care iese din colt spre exterior (ca in FIFA)
      ctx.shadowColor = '#1a9fff';
      ctx.shadowBlur  = 14;
      const spkG = makeGrad(dx * -sz * 0.1, dy * -sz * 0.1, dx * sz * 0.95, dy * sz * 0.95);
      ctx.fillStyle   = spkG;
      ctx.globalAlpha = 0.88;
      ctx.beginPath();
      ctx.moveTo(dx * sz * 0.05,  dy * sz * 0.05);
      ctx.lineTo(dx * sz * 0.95,  dy * sz * 0.18);
      ctx.lineTo(dx * sz * 0.62,  dy * sz * 0.45);
      ctx.lineTo(dx * sz * 0.18,  dy * sz * 0.95);
      ctx.lineTo(dx * sz * 0.05,  dy * sz * 0.05);
      ctx.closePath();
      ctx.fill();

      // Contur spike
      ctx.strokeStyle = colorInner;
      ctx.lineWidth   = 0.9;
      ctx.globalAlpha = 0.65;
      ctx.beginPath();
      ctx.moveTo(dx * sz * 0.05,  dy * sz * 0.05);
      ctx.lineTo(dx * sz * 0.95,  dy * sz * 0.18);
      ctx.lineTo(dx * sz * 0.62,  dy * sz * 0.45);
      ctx.lineTo(dx * sz * 0.18,  dy * sz * 0.95);
      ctx.lineTo(dx * sz * 0.05,  dy * sz * 0.05);
      ctx.closePath();
      ctx.stroke();

     

    } else if(effect === 'uel'){
      // ── UEL: spini în formă de flacără dublă ──
      ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 12;
      // Flacăra principală
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(dx * sz * 0.9, dy * sz * 0.15);
      ctx.lineTo(dx * sz * 0.65, dy * sz * 0.4);
      ctx.lineTo(dx * sz * 0.8, dy * sz * 0.6);
      ctx.lineTo(dx * sz * 0.45, dy * sz * 0.38);
      ctx.lineTo(dx * sz * 0.15, dy * sz * 0.9);
      ctx.lineTo(0, dy * sz * 0.5);
      ctx.closePath();
      ctx.fillStyle = makeGrad(0,0,dx*sz,dy*sz);
      ctx.globalAlpha = 0.88;
      ctx.fill();
      // Vârf ascuțit lateral
      ctx.beginPath();
      ctx.moveTo(dx * sz * 0.55, 0);
      ctx.lineTo(dx * sz * 1.15, dy * sz * 0.12);
      ctx.lineTo(dx * sz * 0.7, dy * sz * 0.32);
      ctx.closePath();
      ctx.fillStyle = colorInner;
      ctx.globalAlpha = 0.7;
      ctx.fill();

    } else if(effect === 'uecl'){
      // ── UECL: hex-spike – două triunghiuri hexagonale ascuțite ──
      ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 10;
      ctx.fillStyle = makeGrad(0,0,dx*sz,dy*sz);
      ctx.globalAlpha = 0.88;
      // Spike exterior mare
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(dx * sz * 0.95, dy * sz * 0.22);
      ctx.lineTo(dx * sz * 0.72, dy * sz * 0.52);
      ctx.lineTo(dx * sz * 0.38, dy * sz * 0.28);
      ctx.lineTo(dx * sz * 0.22, dy * sz * 0.72);
      ctx.lineTo(0, dy * sz * 0.42);
      ctx.closePath();
      ctx.fill();
      // Accent hexagonal
      ctx.beginPath();
      ctx.moveTo(dx * sz * 0.38, dy * sz * 0.05);
      ctx.lineTo(dx * sz * 0.72, dy * sz * 0.05);
      ctx.lineTo(dx * sz * 0.88, dy * sz * 0.22);
      ctx.lineTo(dx * sz * 0.72, dy * sz * 0.38);
      ctx.lineTo(dx * sz * 0.38, dy * sz * 0.38);
      ctx.lineTo(dx * sz * 0.22, dy * sz * 0.22);
      ctx.closePath();
      ctx.fillStyle = colorInner;
      ctx.globalAlpha = 0.5;
      ctx.fill();

    } else if(effect === 'tott'){
      // ── TOTT: spike elegant în formă de coroană ──
      ctx.shadowColor = '#ff44aa'; ctx.shadowBlur = 14;
      ctx.fillStyle = makeGrad(0,0,dx*sz,dy*sz);
      ctx.globalAlpha = 0.9;
      // Corp principal
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(dx * sz * 1.0, dy * sz * 0.18);
      ctx.lineTo(dx * sz * 0.78, dy * sz * 0.42);
      ctx.lineTo(dx * sz * 1.08, dy * sz * 0.38);  // vârf crown exterior
      ctx.lineTo(dx * sz * 0.62, dy * sz * 0.65);
      ctx.lineTo(dx * sz * 0.18, dy * sz * 1.0);
      ctx.lineTo(0, dy * sz * 0.62);
      ctx.lineTo(dx * sz * 0.38, dy * sz * 1.08);  // vârf crown jos
      ctx.closePath();
      ctx.fill();
      // Perluță centrală
      ctx.beginPath();
      ctx.arc(dx*sz*0.28, dy*sz*0.28, sz*0.07, 0, Math.PI*2);
      ctx.fillStyle = colorInner;
      ctx.globalAlpha = 1;
      ctx.fill();

    } else if(effect === 'heroes'){
      // ── HEROES: spike în formă de spadă/scut ──
      ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 14;
      ctx.fillStyle = makeGrad(0,0,dx*sz*0.9,dy*sz*0.9);
      ctx.globalAlpha = 0.92;
      // Forma de scut-spike
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(dx * sz * 0.88, dy * sz * 0.12);
      ctx.lineTo(dx * sz * 1.08, dy * sz * 0.45);  // vârf exterior lung
      ctx.lineTo(dx * sz * 0.72, dy * sz * 0.52);
      ctx.lineTo(dx * sz * 0.52, dy * sz * 0.72);
      ctx.lineTo(dx * sz * 0.45, dy * sz * 1.08);  // vârf exterior jos
      ctx.lineTo(dx * sz * 0.12, dy * sz * 0.88);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      // Linie de detaliu
      ctx.strokeStyle = colorInner;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.7;
      ctx.stroke();
      // Accent central
      ctx.beginPath();
      ctx.moveTo(dx*sz*0.25, dy*sz*0.05);
      ctx.lineTo(dx*sz*0.55, dy*sz*0.35);
      ctx.lineTo(dx*sz*0.05, dy*sz*0.25);
      ctx.closePath();
      ctx.fillStyle = colorInner;
      ctx.globalAlpha = 0.6;
      ctx.fill();

    } else if(effect === 'ptg'){
      // ── PATH TO GLORY: spike dinamic – foc+viteză ──
      ctx.shadowColor = '#ff2244'; ctx.shadowBlur = 16;
      ctx.fillStyle = makeGrad(0,0,dx*sz,dy*sz);
      ctx.globalAlpha = 0.92;
      // Corp aerodinamic
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(dx * sz * 1.18, dy * sz * 0.08);  // spike lung principal
      ctx.lineTo(dx * sz * 0.68, dy * sz * 0.35);
      ctx.lineTo(dx * sz * 0.88, dy * sz * 0.55);
      ctx.lineTo(dx * sz * 0.35, dy * sz * 0.68);
      ctx.lineTo(dx * sz * 0.08, dy * sz * 1.18);  // spike lung jos
      ctx.lineTo(0, dy * sz * 0.72);
      ctx.lineTo(dx * sz * 0.22, dy * sz * 0.22);
      ctx.closePath();
      ctx.fill();
      // Al doilea spike mic
      ctx.beginPath();
      ctx.moveTo(dx * sz * 0.62, 0);
      ctx.lineTo(dx * sz * 1.1, dy * sz * 0.28);
      ctx.lineTo(dx * sz * 0.72, dy * sz * 0.42);
      ctx.closePath();
      ctx.fillStyle = colorInner;
      ctx.globalAlpha = 0.6;
      ctx.fill();

    } else if(effect === 'thunderstruck'){
      // ── THUNDERSTRUCK: fulger electric ascuțit ──
      ctx.shadowColor = '#ffdd00'; ctx.shadowBlur = 18;
      ctx.fillStyle = makeGrad(0,0,dx*sz,dy*sz);
      ctx.globalAlpha = 0.95;
      // Forma de fulger
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(dx * sz * 1.2, dy * sz * 0.05);   // vârf orizontal
      ctx.lineTo(dx * sz * 0.6, dy * sz * 0.45);
      ctx.lineTo(dx * sz * 1.0, dy * sz * 0.42);   // dintisor
      ctx.lineTo(dx * sz * 0.45, dy * sz * 1.15);  // vârf vertical lung
      ctx.lineTo(dx * sz * 0.38, dy * sz * 0.62);
      ctx.lineTo(0, dy * sz * 0.65);
      ctx.lineTo(dx * sz * 0.05, dy * sz * 1.2);   // vârf colț
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      // Glow albastru secundar
      ctx.shadowColor = '#50b4ff'; ctx.shadowBlur = 12;
      ctx.strokeStyle = '#aaddff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.45;
      ctx.stroke();

    } else if(effect === 'wildcards'){
      // ── WINTER WILDCARDS: cristal de gheață ──
      ctx.shadowColor = '#88ccff'; ctx.shadowBlur = 14;
      ctx.fillStyle = makeGrad(0,0,dx*sz*0.9,dy*sz*0.9);
      ctx.globalAlpha = 0.82;
      // Forma de cristal asimetric
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(dx * sz * 0.95, dy * sz * 0.1);
      ctx.lineTo(dx * sz * 0.78, dy * sz * 0.42);
      ctx.lineTo(dx * sz * 1.05, dy * sz * 0.35);  // vârf cristal
      ctx.lineTo(dx * sz * 0.55, dy * sz * 0.65);
      ctx.lineTo(dx * sz * 0.42, dy * sz * 0.78);
      ctx.lineTo(dx * sz * 0.35, dy * sz * 1.05);  // vârf cristal jos
      ctx.lineTo(dx * sz * 0.1, dy * sz * 0.95);
      ctx.lineTo(0, dy * sz * 0.5);
      ctx.closePath();
      ctx.fill();
      // Reflexie internă
      ctx.strokeStyle = '#cceeff';
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(dx*sz*0.15, dy*sz*0.15);
      ctx.lineTo(dx*sz*0.55, dy*sz*0.15);
      ctx.lineTo(dx*sz*0.15, dy*sz*0.55);
      ctx.stroke();
    }

    ctx.restore();
  });
  ctx.restore();
}

function drawShine(W, H){
  const t = state.shineOffset;
  // Diagonal sweep across the card
  const x0 = -W * 1.5 + t * W * 3.5;
  const x1 = x0 + W * 0.7;

  const shineGrad = ctx.createLinearGradient(x0, 0, x1, H);
  shineGrad.addColorStop(0,    'rgba(255,255,255,0)');
  shineGrad.addColorStop(0.35, 'rgba(255,255,255,0)');
  shineGrad.addColorStop(0.48, 'rgba(255,255,255,0.13)');
  shineGrad.addColorStop(0.5,  'rgba(255,255,255,0.22)');
  shineGrad.addColorStop(0.52, 'rgba(255,255,255,0.13)');
  shineGrad.addColorStop(0.65, 'rgba(255,255,255,0)');
  shineGrad.addColorStop(1,    'rgba(255,255,255,0)');

  ctx.save();
  ctx.fillStyle = shineGrad;
  ctx.globalAlpha = 1;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function drawHolographicEdge(W, H, colors){
  ctx.save();
  const t = state.shineOffset;
  // Animated rainbow edge overlay
  const hueShift = Math.round(t * 360);
  for(let i = 0; i < 4; i++){
    const hue = (hueShift + i * 90) % 360;
    ctx.save();
    ctx.strokeStyle = `hsla(${hue},100%,70%,0.25)`;
    ctx.lineWidth = 3;
    const p = 6 + i * 4;
    ctx.strokeRect(p, p, W - p*2, H - p*2);
    ctx.restore();
  }
  ctx.restore();
}

// ── Export PNG ─────────────────────────────────────────────
document.getElementById('exportBtn').addEventListener('click', ()=>{
  draw(); // ensure fresh render at full resolution
  const link = document.createElement('a');
  const name = (state.firstName.charAt(0) + '_' + state.lastName).replace(/\s+/g,'_');
  link.download = `card_${name}_${state.rating}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// ── Initial draw ───────────────────────────────────────────
draw();
startShine(); // gold effect is active by default

// live bind for text inputs (already bound via bind() but cover change too)
['firstName','lastName','rating','position','bgColor','ratingColor','nameColor'].forEach(id=>{
  const el = document.getElementById(id);
  if(el) el.addEventListener('change', draw);
});

// ══════════════════════════════════════════════════════════════════
// EFECTE ANIMATE — Overlay Canvas System (adăugat în v3)
// ══════════════════════════════════════════════════════════════════

const overlayCanvas = document.getElementById('effectOverlay');
const octx = overlayCanvas.getContext('2d');

function syncOverlaySize(){
  overlayCanvas.width  = canvas.width;
  overlayCanvas.height = canvas.height;
}
syncOverlaySize();

const animState = { effect:'none', tick:0, particles:[] };
let overlayRunning = false;

function startOverlayAnim(){
  if(overlayRunning) return;
  overlayRunning = true;
  (function loop(){
    if(!overlayRunning) return;
    syncOverlaySize();
    animState.tick += 0.022;
    drawOverlay();
    requestAnimationFrame(loop);
  })();
}
function stopOverlayAnim(){
  overlayRunning = false;
  octx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
}

// ── Particle class ─────────────────────────────────────────────
class AnimParticle {
  constructor(W, H, type){ this.type = type; this.init(W, H, true); }
  init(W, H, randomLife){
    if(this.type === 'fire'){
      this.x  = W * (0.05 + Math.random() * 0.9);
      this.y  = H + 10;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = -(0.6 + Math.random() * 1.4);
      this.life  = randomLife ? Math.random() : 1.0;
      this.decay = 0.008 + Math.random() * 0.012;
      this.size  = 3 + Math.random() * 8;
      const hue  = 8 + Math.random() * 38;
      this.color = `hsl(${hue},100%,${48 + Math.random()*22}%)`;
    } else if(this.type === 'ice'){
      this.x     = W * Math.random();
      this.y     = H * Math.random();
      this.vx    = (Math.random() - 0.5) * 0.35;
      this.vy    = -0.15 - Math.random() * 0.45;
      this.life  = randomLife ? Math.random() : 1.0;
      this.decay = 0.003 + Math.random() * 0.006;
      this.size  = 3 + Math.random() * 9;
      this.angle = Math.random() * Math.PI * 2;
      this.spin  = (Math.random() - 0.5) * 0.04;
    } else if(this.type === 'gem'){
      // TOTS rainbow gem diamonds
      this.x     = W * (0.05 + Math.random() * 0.9);
      this.y     = H * (0.2 + Math.random() * 0.8);
      this.vx    = (Math.random() - 0.5) * 0.6;
      this.vy    = -0.4 - Math.random() * 1.2;
      this.life  = randomLife ? Math.random() : 1.0;
      this.decay = 0.004 + Math.random() * 0.009;
      this.size  = 3 + Math.random() * 7;
      this.angle = Math.random() * Math.PI * 2;
      this.spin  = (Math.random() - 0.5) * 0.06;
      this.hue   = Math.random() * 360;
    } else if(this.type === 'ember'){
      // HERO dark dramatic embers
      this.x     = W * (0.05 + Math.random() * 0.9);
      this.y     = H + 5;
      this.vx    = (Math.random() - 0.5) * 0.9;
      this.vy    = -(0.6 + Math.random() * 2.2);
      this.life  = randomLife ? Math.random() : 1.0;
      this.decay = 0.005 + Math.random() * 0.012;
      this.size  = 2 + Math.random() * 6;
      this.color = `hsl(${10+Math.random()*25},100%,${38+Math.random()*28}%)`;
    } else if(this.type === 'dust'){
      // ICON golden dust motes
      this.angle0 = Math.random() * Math.PI * 2;  // orbit angle
      this.radius = W * (0.1 + Math.random() * 0.4);
      this.orbitSpeed = (Math.random() - 0.5) * 0.012;
      this.x     = W/2 + Math.cos(this.angle0) * this.radius;
      this.y     = H/2 + Math.sin(this.angle0) * this.radius * 0.7;
      this.vy    = -0.2 - Math.random() * 0.5;
      this.life  = randomLife ? Math.random() : 1.0;
      this.decay = 0.003 + Math.random() * 0.007;
      this.size  = 1.5 + Math.random() * 4;
      this.angle = Math.random() * Math.PI * 2;
      this.spin  = (Math.random() - 0.5) * 0.04;
    } else if(this.type === 'confetti'){
      // MOTM celebration confetti
      this.x     = W * Math.random();
      this.y     = -10 - Math.random() * H * 0.3;
      this.vx    = (Math.random() - 0.5) * 2.2;
      this.vy    = 1.2 + Math.random() * 2.8;
      this.life  = randomLife ? Math.random() : 1.0;
      this.decay = 0.003 + Math.random() * 0.005;
      this.size  = 5 + Math.random() * 9;
      this.angle = Math.random() * Math.PI * 2;
      this.spin  = (Math.random() - 0.5) * 0.1;
      this.color = `hsl(${Math.floor(Math.random()*7)*52},90%,62%)`;
    } else if(this.type === 'spark'){
      // SHOWDOWN impact sparks
      const a    = Math.random() * Math.PI * 2;
      const spd  = 1.5 + Math.random() * 6;
      this.x     = W * 0.5; this.y = H * 0.5;
      this.vx    = Math.cos(a) * spd; this.vy = Math.sin(a) * spd;
      this.life  = randomLife ? Math.random() : 1.0;
      this.decay = 0.025 + Math.random() * 0.045;
      this.size  = 1.5 + Math.random() * 4;
      this.ox    = this.x; this.oy = this.y;
    }
  }
  update(W, H){
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    if(this.type === 'fire'){
      this.vx  += (Math.random() - 0.5) * 0.25;
      this.size *= 0.985;
    }
    if(this.type === 'ice')    this.angle += this.spin;
    if(this.type === 'gem')  { this.angle += this.spin; }
    if(this.type === 'ember'){ this.vx += (Math.random()-0.5)*0.15; this.size *= 0.992; }
    if(this.type === 'dust') { this.angle0 += this.orbitSpeed; this.x = W/2 + Math.cos(this.angle0)*this.radius + this.vx; this.y += this.vy; this.angle += this.spin; }
    if(this.type === 'confetti'){ this.angle += this.spin; this.vx *= 0.995; }
    if(this.type === 'spark'){ this.vx *= 0.92; this.vy *= 0.92; this.ox = this.x - this.vx*5; this.oy = this.y - this.vy*5; }
    if(this.life <= 0 || this.y < -30 || this.y > H+30) this.init(W, H, false);
  }
  draw(ctx){
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    if(this.type === 'fire'){
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      g.addColorStop(0,   'rgba(255,255,220,0.95)');
      g.addColorStop(0.25, this.color);
      g.addColorStop(1,   'rgba(200,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if(this.type === 'ice'){
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.strokeStyle = `rgba(160,230,255,${this.life})`;
      ctx.lineWidth = 1.2;
      ctx.shadowColor = '#88eeff';
      ctx.shadowBlur = 6;
      for(let i = 0; i < 6; i++){
        const a = i * Math.PI / 3;
        ctx.beginPath(); ctx.moveTo(0,0);
        const ex = Math.cos(a)*this.size, ey = Math.sin(a)*this.size;
        ctx.lineTo(ex, ey); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ex*0.5, ey*0.5);
        ctx.lineTo(ex*0.5+Math.cos(a+Math.PI/2)*this.size*0.28,
                   ey*0.5+Math.sin(a+Math.PI/2)*this.size*0.28);
        ctx.stroke();
      }
    } else if(this.type === 'gem'){
      // Diamond gem shape
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      const s = this.size;
      const hue = (this.hue + ctx.globalAlpha * 120) % 360;
      const g = ctx.createRadialGradient(0, -s*0.3, 0, 0, 0, s*1.2);
      g.addColorStop(0,   `hsla(${hue},100%,95%,1)`);
      g.addColorStop(0.4, `hsla(${(hue+40)%360},100%,70%,0.9)`);
      g.addColorStop(1,   `hsla(${(hue+120)%360},100%,50%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s*0.55, 0);
      ctx.lineTo(0, s*1.3);
      ctx.lineTo(-s*0.55, 0);
      ctx.closePath();
      ctx.fill();
      ctx.shadowColor = `hsl(${hue},100%,70%)`;
      ctx.shadowBlur  = 10;
      ctx.strokeStyle = `hsla(${hue},100%,90%,0.5)`;
      ctx.lineWidth   = 0.6;
      ctx.stroke();
    } else if(this.type === 'ember'){
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      g.addColorStop(0,   'rgba(255,240,200,0.95)');
      g.addColorStop(0.4, this.color);
      g.addColorStop(1,   'rgba(120,0,0,0)');
      ctx.fillStyle   = g;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.fill();
    } else if(this.type === 'dust'){
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      const g = ctx.createRadialGradient(0,0,0, 0,0,this.size);
      g.addColorStop(0,   'rgba(255,240,120,0.95)');
      g.addColorStop(0.5, 'rgba(255,180,0,0.6)');
      g.addColorStop(1,   'rgba(200,100,0,0)');
      ctx.fillStyle   = g;
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur  = 12;
      // Star shape
      ctx.beginPath();
      for(let p = 0; p < 6; p++){
        const a = p * Math.PI/3;
        const r = p%2===0 ? this.size : this.size*0.4;
        p===0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r)
              : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      }
      ctx.closePath();
      ctx.fill();
    } else if(this.type === 'confetti'){
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 4;
      // Rectangular confetti strip
      ctx.fillRect(-this.size*0.3, -this.size*0.9, this.size*0.6, this.size*1.8);
    } else if(this.type === 'spark'){
      // Streak line spark
      ctx.strokeStyle = `rgba(255,${160+Math.floor(this.life*95)},0,${this.life})`;
      ctx.lineWidth   = this.size * 0.7;
      ctx.lineCap     = 'round';
      ctx.shadowColor = '#ff8800';
      ctx.shadowBlur  = 10;
      ctx.beginPath();
      ctx.moveTo(this.ox, this.oy);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function initParticles(type, count, W, H){
  animState.particles = [];
  for(let i = 0; i < count; i++) animState.particles.push(new AnimParticle(W, H, type));
}

// ── Rounded rect helper ────────────────────────────────────────
function roundRectPath(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

// ── Draw overlay dispatcher ────────────────────────────────────
function drawOverlay(){
  const W = overlayCanvas.width, H = overlayCanvas.height;
  octx.clearRect(0, 0, W, H);
  const t = animState.tick;
  switch(animState.effect){
    case 'pulse':       drawPulseOverlay(W, H, t);       break;
    case 'fire':        drawFireOverlay(W, H, t);        break;
    case 'plasma':      drawPlasmaOverlay(W, H, t);      break;
    case 'ice':         drawIceOverlay(W, H, t);         break;
    case 'aurora':      drawAuroraOverlay(W, H, t);      break;
    case 'tots':        drawTOTSOverlay(W, H, t);        break;
    case 'hero':        drawHeroOverlay(W, H, t);        break;
    case 'icon':        drawIconOverlay(W, H, t);        break;
    case 'rulebreaker': drawRulebreakerOverlay(W, H, t); break;
    case 'showdown':    drawShowdownOverlay(W, H, t);    break;
    case 'motm':        drawMOTMOverlay(W, H, t);        break;
    case 'flashback':   drawFlashbackOverlay(W, H, t);   break;
  }
}

// ── PULSE ──────────────────────────────────────────────────────
function drawPulseOverlay(W, H, t){
  // Slow, gentle expanding rings — FIFA UT card glow style
  const numRings = 3;
  for(let i = 0; i < numRings; i++){
    const phase = ((t * 0.28 + i / numRings) % 1);
    const maxR  = Math.hypot(W, H) * 0.62;
    const r     = phase * maxR;
    const alpha = (1 - phase) * 0.18;
    const hue   = (200 + i * 40) % 360; // calm blue-purple hues, no rainbow chaos
    const rw    = r * (W / maxR) * 1.05;
    const rh    = r * (H / maxR) * 1.05;
    octx.save();
    octx.globalAlpha = alpha;
    octx.strokeStyle = `hsl(${hue},80%,72%)`;
    octx.lineWidth   = 1.8 - phase * 1.5;
    octx.shadowColor = `hsl(${hue},90%,65%)`;
    octx.shadowBlur  = 14;
    roundRectPath(octx, W/2 - rw/2, H/2 - rh/2, rw, rh, 14);
    octx.stroke();
    octx.restore();
  }

  // Subtle breathing center glow (very calm)
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.9);
  const g = octx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.55);
  g.addColorStop(0, `rgba(160,180,255,${pulse * 0.06})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  octx.fillStyle = g;
  octx.fillRect(0, 0, W, H);

  // Slow, steady border glow — single color that shifts slowly
  const borderPulse = 0.5 + 0.5 * Math.sin(t * 0.7);
  const hb = (160 + t * 12) % 360;
  octx.save();
  octx.strokeStyle = `hsla(${hb},85%,68%,${0.25 + borderPulse * 0.22})`;
  octx.lineWidth   = 2.5;
  octx.shadowColor = `hsl(${hb},90%,65%)`;
  octx.shadowBlur  = 18;
  const bp = 5;
  roundRectPath(octx, bp, bp, W - bp*2, H - bp*2, 12);
  octx.stroke();
  octx.restore();
}

// ── FIRE ── Layered sine-wave flame tongues — FIFA ingame style
function drawFireOverlay(W, H, t){
  // Draw flame layer as filled wavy path from card bottom
  function flameLayer(heightRatio, colTop, colBot, freq, speed, waveAmp, alpha){
    const baseY = H + 2, topY = H * (1 - heightRatio);
    octx.save(); octx.globalAlpha = alpha;
    octx.beginPath(); octx.moveTo(-2, baseY);
    for(let i = 0; i <= 80; i++){
      const x  = (i/80) * (W+4) - 2;
      const p  = x / W * Math.PI * 2;
      const w  = Math.sin(p*freq + t*speed)*0.5
               + Math.sin(p*freq*1.62 + t*speed*0.73 + 1.1)*0.33
               + Math.sin(p*freq*0.48 + t*speed*1.28 + 2.6)*0.17;
      octx.lineTo(x, topY + w * H * waveAmp);
    }
    octx.lineTo(W+2, baseY); octx.closePath();
    const grad = octx.createLinearGradient(0, topY - H*waveAmp*0.5, 0, baseY);
    grad.addColorStop(0, colTop); grad.addColorStop(0.45, colBot); grad.addColorStop(1, colBot);
    octx.fillStyle = grad; octx.fill(); octx.restore();
  }

  // Flames only at bottom of card — short, FIFA-style
  flameLayer(0.22,'rgba(60,0,0,0)',    'rgba(110,0,0,0.45)',   2.8,0.7, 0.10,0.70);
  flameLayer(0.15,'rgba(200,10,0,0)',  'rgba(220,20,0,0.38)',  3.8,0.9, 0.08,0.62);
  flameLayer(0.09,'rgba(255,60,0,0)',  'rgba(255,60,0,0.28)',  5.0,1.1, 0.06,0.52);
  flameLayer(0.05,'rgba(255,140,0,0)', 'rgba(255,120,0,0.18)', 6.2,1.4, 0.05,0.42);

  // Side edge glows — thin strip on left and right
  const sAlphaL = 0.22 + 0.02*Math.sin(t*0.7);
  const lgS = octx.createLinearGradient(0, 0, W*0.12, 0);
  lgS.addColorStop(0, `rgba(255,44,0,${sAlphaL})`); lgS.addColorStop(1,'rgba(255,44,0,0)');
  octx.fillStyle = lgS; octx.fillRect(0, 0, W*0.12, H);
  const sAlphaR = 0.20 + 0.02*Math.sin(t*0.7+0.9);
  const rgS = octx.createLinearGradient(W, 0, W*0.88, 0);
  rgS.addColorStop(0, `rgba(255,44,0,${sAlphaR})`); rgS.addColorStop(1,'rgba(255,44,0,0)');
  octx.fillStyle = rgS; octx.fillRect(W*0.88, 0, W*0.12, H);

  // FIFA border glow — subtle red-orange outline
  const bp = 4, bgl = 0.55 + 0.08*Math.sin(t*0.5);
  octx.save();
  octx.strokeStyle = `rgba(255,${55+Math.floor(bgl*65)},0,${0.55+bgl*0.06})`;
  octx.lineWidth = 3.0; octx.shadowColor = '#ff2200'; octx.shadowBlur = 18;
  roundRectPath(octx, bp, bp, W-bp*2, H-bp*2, 12); octx.stroke();
  octx.restore();
}

// ── PLASMA ─────────────────────────────────────────────────────
function drawPlasmaOverlay(W, H, t){
  const pad = W * 0.028;

  // Dark blue electric vignette — deep, cinematic
  const vG = octx.createRadialGradient(W/2, H/2, H*0.18, W/2, H/2, H*0.78);
  vG.addColorStop(0, 'rgba(0,0,0,0)');
  vG.addColorStop(1, `rgba(0,10,60,${0.32 + 0.06*Math.sin(t*0.9)})`);
  octx.fillStyle = vG; octx.fillRect(0, 0, W, H);

  // Outer clean glowing border — steady electric blue/purple, no cartoon chaos
  const mainHue = (200 + t * 18) % 360; // slow hue drift, blue to purple range
  octx.save();
  octx.strokeStyle = `hsla(${mainHue},100%,68%,0.72)`;
  octx.lineWidth   = 2.8;
  octx.shadowColor = `hsl(${mainHue},100%,65%)`;
  octx.shadowBlur  = 22;
  roundRectPath(octx, pad, pad, W-pad*2, H-pad*2, 12);
  octx.stroke();
  octx.restore();

  // Two subtle inner electric rings — very precise, less chaotic
  for(let layer = 1; layer < 3; layer++){
    const lhue  = (mainHue + layer*30) % 360;
    const lpad  = pad + layer*5;
    const alpha = 0.35 - layer*0.12;
    octx.save();
    octx.strokeStyle = `hsla(${lhue},100%,72%,${alpha})`;
    octx.lineWidth   = 1.4 - layer*0.3;
    octx.shadowColor = `hsl(${lhue},100%,70%)`;
    octx.shadowBlur  = 12 - layer*3;
    // Slightly wavy border (mild lightning, controlled)
    drawLightningBorder(lpad, lpad, W-lpad*2, H-lpad*2, t*0.6 + layer*0.8);
    octx.restore();
  }

  // Corner bright nodes — clean spark dots
  [[pad,pad],[W-pad,pad],[pad,H-pad],[W-pad,H-pad]].forEach(([cx,cy],i) => {
    const hue = (mainHue + i*25) % 360;
    const r   = 3 + 2 * Math.abs(Math.sin(t*1.8 + i));
    const g   = octx.createRadialGradient(cx,cy,0, cx,cy, r*4);
    g.addColorStop(0, `hsla(${hue},100%,95%,0.9)`);
    g.addColorStop(1, `hsla(${hue},100%,65%,0)`);
    octx.fillStyle = g;
    octx.beginPath();
    octx.arc(cx, cy, r*4, 0, Math.PI*2);
    octx.fill();
  });

  // Single slow scan line — clean, FIFA diagnostic style
  const scanY = ((t * 0.22 % 1) * (H + 40)) - 20;
  const sG = octx.createLinearGradient(0, scanY-8, 0, scanY+8);
  sG.addColorStop(0,   'rgba(80,180,255,0)');
  sG.addColorStop(0.5, `rgba(100,200,255,${0.18 + 0.06*Math.sin(t*4)})`);
  sG.addColorStop(1,   'rgba(80,180,255,0)');
  octx.fillStyle = sG; octx.fillRect(0, scanY-8, W, 16);
}

function drawLightningBorder(x, y, w, h, t){
  const segs = 14, chaos = 7;
  drawLightningLine(x,     y,     x+w,   y,     segs, chaos, t);
  drawLightningLine(x+w,   y,     x+w,   y+h,   segs, chaos, t+1.1);
  drawLightningLine(x+w,   y+h,   x,     y+h,   segs, chaos, t+2.2);
  drawLightningLine(x,     y+h,   x,     y,     segs, chaos, t+3.3);
  octx.stroke();
}
function drawLightningLine(x1,y1,x2,y2,segs,chaos,t){
  octx.beginPath();
  octx.moveTo(x1, y1);
  const dx = (x2-x1)/segs, dy = (y2-y1)/segs;
  const len = Math.hypot(x2-x1, y2-y1);
  const nx = -(y2-y1)/len, ny = (x2-x1)/len;
  for(let i = 1; i < segs; i++){
    const j = chaos * (Math.sin(t*8+i*3.9)*0.65 + Math.sin(t*15+i*2.3)*0.35);
    octx.lineTo(x1 + dx*i + nx*j, y1 + dy*i + ny*j);
  }
  octx.lineTo(x2, y2);
}

// ── ICE ────────────────────────────────────────────────────────
function drawIceOverlay(W, H, t){
  // Blue radial vignette
  const vG = octx.createRadialGradient(W/2, H/2, H*0.22, W/2, H/2, H*0.76);
  vG.addColorStop(0, 'rgba(0,0,0,0)');
  vG.addColorStop(1, `rgba(0,170,255,${0.14 + 0.06 * Math.sin(t*1.5)})`);
  octx.fillStyle = vG;
  octx.fillRect(0, 0, W, H);

  // Snowflake particles
  animState.particles.forEach(p => { p.update(W, H); p.draw(octx); });

  // Frost edge panels
  [[0,0,W*0.07,H],[W*0.93,0,W*0.07,H],[0,0,W,H*0.07],[0,H*0.93,W,H*0.07]].forEach(([x,y,w,h],i) => {
    octx.save();
    octx.globalAlpha = 0.15 + 0.06 * Math.sin(t * 2.2 + i);
    octx.fillStyle = 'rgba(180,235,255,1)';
    octx.fillRect(x, y, w, h);
    octx.restore();
  });

  // Animated ice border
  const bp = W * 0.024;
  octx.save();
  octx.strokeStyle = `rgba(160,235,255,${0.5 + 0.35 * Math.sin(t*2.2)})`;
  octx.lineWidth = 3.5;
  octx.shadowColor = '#88eeff';
  octx.shadowBlur  = 28;
  roundRectPath(octx, bp, bp, W-bp*2, H-bp*2, 12);
  octx.stroke();
  // Second inner ring
  octx.strokeStyle = `rgba(200,248,255,${0.25 + 0.2 * Math.sin(t*2.2 + 1)})`;
  octx.lineWidth = 1.5;
  octx.shadowBlur = 10;
  roundRectPath(octx, bp*2.8, bp*2.8, W-bp*5.6, H-bp*5.6, 8);
  octx.stroke();
  octx.restore();
}

// ── AURORA ─────────────────────────────────────────────────────
function drawAuroraOverlay(W, H, t){
  // Dark space vignette base — makes aurora pop like real night sky
  const sky = octx.createRadialGradient(W/2, H*0.4, 0, W/2, H*0.5, H*0.85);
  sky.addColorStop(0, 'rgba(0,0,0,0)');
  sky.addColorStop(1, `rgba(0,5,20,0.28)`);
  octx.fillStyle = sky; octx.fillRect(0, 0, W, H);

  // Flowing aurora bands — realistic green/teal/blue-purple palette
  const auroraPalette = [
    [140, 100], // green-teal
    [170, 100], // teal
    [195, 90 ], // blue-teal
    [280, 80 ], // purple
    [150, 90 ], // green
  ];
  for(let i = 0; i < 5; i++){
    const [baseHue, sat] = auroraPalette[i];
    const hue   = baseHue + Math.sin(t*0.18 + i) * 18;
    const bandY = H * (0.06 + i * 0.19);
    const amp   = H * 0.038;
    const freq  = 0.0055 + i * 0.002;
    const spd   = t * (0.45 + i * 0.12);
    const alpha = 0.07 + 0.04 * Math.sin(t * 0.55 + i * 1.2);

    octx.save();
    octx.globalAlpha = alpha;
    const grad = octx.createLinearGradient(0, bandY - amp*2, 0, bandY + amp*3.5);
    grad.addColorStop(0,   'rgba(0,0,0,0)');
    grad.addColorStop(0.28,`hsla(${hue},${sat}%,65%,1)`);
    grad.addColorStop(0.6, `hsla(${(hue+18)%360},${sat}%,72%,0.55)`);
    grad.addColorStop(1,   'rgba(0,0,0,0)');
    octx.fillStyle = grad;

    octx.beginPath();
    octx.moveTo(0, H);
    for(let x = 0; x <= W; x += 2){
      const wy = bandY
        + Math.sin(x * freq + spd) * amp
        + Math.sin(x * freq * 1.7 + spd * 0.6) * amp * 0.32;
      octx.lineTo(x, wy);
    }
    octx.lineTo(W, H);
    octx.closePath();
    octx.fill();
    octx.restore();
  }

  // Subtle star field — tiny glints
  for(let i = 0; i < 14; i++){
    const sx   = W * ((Math.sin(i * 3.7 + 0.3) * 0.5 + 0.5));
    const sy   = H * ((Math.sin(i * 2.1 + 1.1) * 0.5 + 0.5) * 0.65);
    const sr   = 0.8 + 0.6 * Math.abs(Math.sin(t * 0.8 + i));
    const alph = 0.25 + 0.35 * Math.abs(Math.sin(t * 0.9 + i * 1.4));
    octx.save();
    octx.globalAlpha = alph;
    octx.fillStyle   = 'rgba(220,240,255,1)';
    octx.beginPath();
    octx.arc(sx, sy, sr, 0, Math.PI*2);
    octx.fill();
    octx.restore();
  }

  // Elegant aurora border — blue-green slow shift
  const hb  = (150 + t * 8) % 360;
  const bph = 0.45 + 0.35 * Math.sin(t * 0.65);
  const bp  = 5;
  octx.save();
  octx.strokeStyle = `hsla(${hb},85%,65%,${bph * 0.6})`;
  octx.lineWidth   = 2.5;
  octx.shadowColor = `hsl(${hb},100%,65%)`;
  octx.shadowBlur  = 20;
  roundRectPath(octx, bp, bp, W-bp*2, H-bp*2, 12);
  octx.stroke();
  octx.restore();
}

// ── TOTS ── Team of the Season — FIFA premium shimmer style
function drawTOTSOverlay(W, H, t){
  // Dark cinematic vignette — TOTS cards are dark and rich
  const vg = octx.createRadialGradient(W/2,H*0.45,H*0.12, W/2,H*0.5,H*0.88);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, `rgba(5,0,18,0.35)`);
  octx.fillStyle = vg; octx.fillRect(0,0,W,H);

  // Slow rotating prismatic halo — subtle, elegant
  for(let i = 0; i < 3; i++){
    const angle = t * 0.22 + i * Math.PI * 2/3;
    const gx = W/2 + Math.cos(angle)*W*0.28;
    const gy = H/2 + Math.sin(angle)*H*0.22;
    const hue = (t*20 + i*120) % 360;
    const rg = octx.createRadialGradient(gx,gy,0, gx,gy,W*0.45);
    rg.addColorStop(0,   `hsla(${hue},100%,72%,0.10)`);
    rg.addColorStop(1,   'rgba(0,0,0,0)');
    octx.fillStyle = rg; octx.fillRect(0,0,W,H);
  }

  // Gem particle rain (keep existing particle system)
  animState.particles.forEach(p => { p.update(W, H); p.draw(octx); });

  // Diagonal shimmer sweep — FIFA card signature shine
  const sweep = ((t * 0.38) % 1) * (W + H) - H*0.5;
  octx.save();
  octx.globalAlpha = 0.14;
  const sg = octx.createLinearGradient(sweep-45, 0, sweep+45, H);
  sg.addColorStop(0,   'rgba(255,255,255,0)');
  sg.addColorStop(0.5, 'rgba(255,255,255,1)');
  sg.addColorStop(1,   'rgba(255,255,255,0)');
  octx.fillStyle = sg; octx.fillRect(0, 0, W, H);
  octx.restore();

  // Triple prismatic border — smooth rainbow shift, not flashing
  for(let ring = 0; ring < 3; ring++){
    const hue  = (t*25 + ring*120) % 360;
    const pad  = 5 + ring*5;
    const alpha= 0.55 - ring*0.16;
    octx.save();
    octx.strokeStyle = `hsla(${hue},100%,72%,${alpha})`;
    octx.lineWidth   = 2.5 - ring*0.6;
    octx.shadowColor = `hsl(${hue},100%,68%)`;
    octx.shadowBlur  = 20 - ring*5;
    roundRectPath(octx, pad, pad, W-pad*2, H-pad*2, 13);
    octx.stroke();
    octx.restore();
  }

  // Corner burst flashes — subtle, timed (not aggressive)
  const flashPhase = (t * 0.8) % 1;
  if(flashPhase < 0.18){
    const fAlpha = Math.sin(flashPhase/0.18 * Math.PI) * 0.22;
    [[0,0],[W,0],[0,H],[W,H]].forEach(([cx,cy]) => {
      const fg = octx.createRadialGradient(cx,cy,0, cx,cy,W*0.35);
      const hf  = (t*30) % 360;
      fg.addColorStop(0, `hsla(${hf},100%,92%,${fAlpha})`);
      fg.addColorStop(1, 'rgba(0,0,0,0)');
      octx.fillStyle = fg; octx.fillRect(0,0,W,H);
    });
  }
}

// ── HERO → HALLOWEEN ── Spooky night atmosphere
function drawHeroOverlay(W, H, t){
  // Deep dark night vignette — purple/black
  const vg = octx.createRadialGradient(W/2, H*0.45, H*0.1, W/2, H*0.5, H*0.9);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, `rgba(10,0,18,0.5)`);
  octx.fillStyle = vg; octx.fillRect(0,0,W,H);

  // Slow swirling orange jack-o-lantern glow from bottom
  const jgx = W/2 + Math.sin(t*0.3)*W*0.08;
  const jg = octx.createRadialGradient(jgx, H*0.88, 0, jgx, H*0.88, H*0.55);
  jg.addColorStop(0,   `rgba(255,120,0,${0.18 + 0.06*Math.sin(t*0.8)})`);
  jg.addColorStop(0.5, `rgba(200,50,0,${0.1 + 0.04*Math.sin(t*0.9+1)})`);
  jg.addColorStop(1,   'rgba(0,0,0,0)');
  octx.fillStyle = jg; octx.fillRect(0, H*0.35, W, H*0.65);

  // Purple mystic mist at top — slow drift
  const mistG = octx.createLinearGradient(0, 0, 0, H*0.4);
  mistG.addColorStop(0,   `rgba(60,0,90,${0.22 + 0.06*Math.sin(t*0.5)})`);
  mistG.addColorStop(1,   'rgba(30,0,50,0)');
  octx.fillStyle = mistG; octx.fillRect(0, 0, W, H*0.4);

  // Floating ember particles (reuse existing)
  animState.particles.forEach(p => { p.update(W, H); p.draw(octx); });

  // Floating ghost shapes — simple translucent blobs drifting slowly
  for(let i = 0; i < 4; i++){
    const gx  = W*(0.15 + 0.22*i) + Math.sin(t*0.28 + i*1.5)*W*0.07;
    const gy  = H*(0.18 + 0.14*i) + Math.sin(t*0.35 + i*2.1)*H*0.05;
    const gr  = W*(0.05 + 0.02*i);
    const ga  = 0.05 + 0.03*Math.abs(Math.sin(t*0.4 + i));
    const gg  = octx.createRadialGradient(gx, gy, 0, gx, gy, gr*2.2);
    gg.addColorStop(0, `rgba(220,200,255,${ga})`);
    gg.addColorStop(1, 'rgba(180,160,240,0)');
    octx.fillStyle = gg;
    octx.beginPath();
    octx.arc(gx, gy, gr*2.2, 0, Math.PI*2);
    octx.fill();
  }

  // Flickering candle-like orange side glows
  const flickL = 0.18 + 0.06*Math.sin(t*5.5 + 0.3) + 0.04*Math.sin(t*11.2);
  const lgH = octx.createLinearGradient(0, 0, W*0.18, 0);
  lgH.addColorStop(0, `rgba(255,100,0,${flickL})`);
  lgH.addColorStop(1, 'rgba(255,80,0,0)');
  octx.fillStyle = lgH; octx.fillRect(0, 0, W*0.18, H);

  const flickR = 0.16 + 0.06*Math.sin(t*5.5 + 1.5) + 0.04*Math.sin(t*9.8);
  const rgH = octx.createLinearGradient(W, 0, W*0.82, 0);
  rgH.addColorStop(0, `rgba(255,90,0,${flickR})`);
  rgH.addColorStop(1, 'rgba(255,80,0,0)');
  octx.fillStyle = rgH; octx.fillRect(W*0.82, 0, W*0.18, H);

  // Steady purple/orange halloween border — not pulsive, gentle flicker
  const bp  = 5;
  const bph = 0.5 + 0.28*Math.sin(t * 0.7);
  octx.save();
  octx.strokeStyle = `rgba(160,0,200,${0.45 + bph*0.25})`;
  octx.lineWidth   = 2.8;
  octx.shadowColor = '#aa00cc';
  octx.shadowBlur  = 22;
  roundRectPath(octx, bp, bp, W-bp*2, H-bp*2, 12);
  octx.stroke();
  // Inner orange Halloween ring
  octx.strokeStyle = `rgba(255,${80+Math.floor(bph*60)},0,${0.3 + bph*0.18})`;
  octx.lineWidth   = 1.5;
  octx.shadowColor = '#ff6600';
  octx.shadowBlur  = 14;
  roundRectPath(octx, bp+6, bp+6, W-bp*2-12, H-bp*2-12, 9);
  octx.stroke();
  octx.restore();
}

// ── ICON ── Gold divine light with orbiting dust
function drawIconOverlay(W, H, t){
  // Divine light rays from top center
  const numRays = 16;
  for(let i = 0; i < numRays; i++){
    const angle = (i/numRays)*Math.PI*2 + t*0.08;
    const len   = Math.hypot(W,H) * 0.7;
    const alpha = (0.04 + 0.025*Math.sin(t*1.2+i)) * (i%2===0?1.6:0.8);
    const hue   = 42 + Math.sin(t+i)*8;
    octx.save();
    octx.globalAlpha = alpha;
    const rg = octx.createLinearGradient(
      W/2, H*0.15,
      W/2+Math.cos(angle)*len, H*0.15+Math.sin(angle)*len
    );
    rg.addColorStop(0,   `hsl(${hue},100%,90%)`);
    rg.addColorStop(1,   `hsla(${hue},80%,60%,0)`);
    octx.strokeStyle = rg;
    octx.lineWidth   = 18 - (i%2)*8;
    octx.beginPath();
    octx.moveTo(W/2, H*0.15);
    octx.lineTo(W/2+Math.cos(angle)*len, H*0.15+Math.sin(angle)*len);
    octx.stroke();
    octx.restore();
  }

  // Orbiting gold dust
  animState.particles.forEach(p => { p.update(W, H); p.draw(octx); });

  // Gold shimmer vignette top
  const topG = octx.createLinearGradient(0,0,0,H*0.38);
  topG.addColorStop(0,   `rgba(255,210,0,${0.18+0.07*Math.sin(t*1.4)})`);
  topG.addColorStop(1,   'rgba(255,180,0,0)');
  octx.fillStyle = topG; octx.fillRect(0,0,W,H*0.38);

  // Glowing gold border
  const bp = 6;
  for(let l = 0; l < 3; l++){
    const lp = bp + l*4.5;
    octx.save();
    octx.strokeStyle = `rgba(255,${190+l*22},0,${0.55-l*0.15})`;
    octx.lineWidth   = 3.5 - l;
    octx.shadowColor = '#ffd700';
    octx.shadowBlur  = 28 - l*8;
    roundRectPath(octx, lp, lp, W-lp*2, H-lp*2, 12-l*2);
    octx.stroke();
    octx.restore();
  }

  // Crown glow at top center
  const cgr = octx.createRadialGradient(W/2,0,0, W/2,0,H*0.28);
  cgr.addColorStop(0,   `rgba(255,230,80,${0.22+0.1*Math.sin(t*2)})`);
  cgr.addColorStop(1,   'rgba(255,150,0,0)');
  octx.fillStyle = cgr; octx.fillRect(0,0,W,H*0.28);
}

// ── RULEBREAKER ── Controlled neon green glitch — less pulsive
function drawRulebreakerOverlay(W, H, t){
  // Subtle dark vignette with green tint
  const vg = octx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.85);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, `rgba(0,8,2,0.3)`);
  octx.fillStyle = vg; octx.fillRect(0,0,W,H);

  // Occasional glitch scanline tears — less frequent, more controlled
  const glitchActive = Math.sin(t*2.8) > 0.65;
  if(glitchActive){
    const numGlitches = 2 + Math.floor(Math.abs(Math.sin(t*3))*2);
    for(let i = 0; i < numGlitches; i++){
      const gy    = H*(0.15 + i*0.22 + 0.04*Math.sin(t*4+i));
      const gh    = 2 + Math.abs(Math.sin(t*5+i))*6;
      const offX  = (Math.sin(t*8+i)-0.5)*18;
      const alpha = 0.08 + 0.06*Math.abs(Math.sin(t*4+i));
      octx.save();
      octx.globalAlpha = alpha;
      octx.fillStyle   = 'rgba(0,255,80,1)';
      octx.fillRect(offX, gy, W, gh);
      octx.restore();
    }
  }

  // Stable neon green border — steady glow, minimal shake
  const shakeX = glitchActive ? (Math.sin(t*22)-0.5)*2.5 : 0;
  const shakeY = glitchActive ? (Math.sin(t*18)-0.5)*1.5 : 0;
  const bp  = 5;
  const bph = 0.65 + 0.2*Math.sin(t * 0.6); // slow, gentle pulse
  for(let l = 0; l < 3; l++){
    const lp = bp + l*5;
    octx.save();
    octx.strokeStyle = `rgba(0,${195+l*18},${45+l*10},${bph - l*0.18})`;
    octx.lineWidth   = 2.8 - l*0.55;
    octx.shadowColor = '#00ff50';
    octx.shadowBlur  = 22 - l*5;
    octx.translate(shakeX, shakeY);
    roundRectPath(octx, lp, lp, W-lp*2, H-lp*2, 11);
    octx.stroke();
    octx.restore();
  }

  // Chromatic aberration twin border (subtle)
  ['rgba(255,0,0,0.1)','rgba(0,100,255,0.1)'].forEach((col, ci) => {
    const off = ci===0?-1.5:1.5;
    octx.save();
    octx.strokeStyle = col;
    octx.lineWidth   = 1.5;
    roundRectPath(octx, bp+off, bp, W-bp*2-off*2, H-bp*2, 11);
    octx.stroke();
    octx.restore();
  });

  // Sparse digital rain drips — right edge, slow
  for(let d = 0; d < 4; d++){
    const dx    = W*0.84 + d*(W*0.04);
    const dy    = ((t*90 + d*65) % (H+30)) - 15;
    const alpha = 0.35 + 0.25*Math.sin(t*2+d);
    octx.save();
    octx.globalAlpha  = alpha;
    octx.font         = `bold 10px monospace`;
    octx.fillStyle    = '#00ff55';
    octx.shadowColor  = '#00ff55';
    octx.shadowBlur   = 8;
    octx.fillText(Math.random()>0.5?'1':'0', dx, dy);
    octx.restore();
  }

  // Corner zap arcs — steady, not flashing
  [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(([cx,cy,sx,sy],i)=>{
    const a   = 0.28 + 0.15*Math.abs(Math.sin(t*1.2+i));
    const len = W*0.11;
    octx.save();
    octx.strokeStyle = `rgba(0,255,80,${a})`;
    octx.lineWidth   = 1.5;
    octx.shadowColor = '#00ff80'; octx.shadowBlur = 10;
    octx.beginPath();
    octx.moveTo(cx, cy); octx.lineTo(cx+sx*len, cy);
    octx.moveTo(cx, cy); octx.lineTo(cx, cy+sy*len);
    octx.stroke();
    octx.restore();
  });
}

// ── SHOWDOWN ── FIFA Showdown — cinematic clash, energy rays background
function drawShowdownOverlay(W, H, t){
  // Heavy dark vignette
  const dv = octx.createRadialGradient(W/2, H/2, H*0.08, W/2, H/2, H*0.95);
  dv.addColorStop(0, 'rgba(0,0,0,0)');
  dv.addColorStop(1, 'rgba(0,0,0,0.50)');
  octx.fillStyle = dv; octx.fillRect(0,0,W,H);

  // ── FIFA-style background: radial light rays from center ──
  // Like the starburst pattern on official Showdown cards
  const numRays = 24;
  const spin    = t * 0.08; // slow rotation
  octx.save();
  octx.translate(W/2, H/2);
  for(let i = 0; i < numRays; i++){
    const a1 = spin + (i / numRays) * Math.PI * 2;
    const a2 = spin + ((i + 0.42) / numRays) * Math.PI * 2;
    const len = Math.hypot(W, H);
    const isLeft = Math.cos((a1+a2)/2) < 0;
    const rayAlpha = 0.045 + 0.015*Math.sin(t*0.6 + i*0.8);
    // Left rays blue-tinted, right rays red-tinted
    const rayColor = isLeft
      ? `rgba(60,120,255,${rayAlpha})`
      : `rgba(220,40,0,${rayAlpha})`;
    octx.beginPath();
    octx.moveTo(0, 0);
    octx.lineTo(Math.cos(a1)*len, Math.sin(a1)*len);
    octx.lineTo(Math.cos(a2)*len, Math.sin(a2)*len);
    octx.closePath();
    octx.fillStyle = rayColor;
    octx.fill();
  }
  octx.restore();

  // Diagonal speed lines — left side blue, right side red
  // Fast moving horizontal streaks suggesting impact
  for(let d = 0; d < 10; d++){
    const yOff  = (d / 10) * H;
    const phase = (t * (1.4 + d*0.12) + d*0.37) % 1;
    const xPos  = phase * W * 0.48;           // left side streaks
    const alen  = W*(0.08 + 0.06*(d%3)*0.5);
    const sal   = (1-phase) * (0.12 + 0.04*(d%2));
    octx.save();
    const sg = octx.createLinearGradient(xPos, 0, xPos+alen, 0);
    sg.addColorStop(0, `rgba(80,160,255,0)`);
    sg.addColorStop(0.5,`rgba(100,170,255,${sal})`);
    sg.addColorStop(1, `rgba(80,160,255,0)`);
    octx.fillStyle = sg;
    octx.fillRect(xPos, yOff - 1.5, alen, 3);
    octx.restore();
  }
  for(let d = 0; d < 10; d++){
    const yOff  = (d / 10) * H + H*0.05;
    const phase = (t * (1.4 + d*0.10) + d*0.55) % 1;
    const xPos  = W - phase * W*0.48 - W*(0.08+0.06*(d%3)*0.5);  // right side streaks
    const alen  = W*(0.08 + 0.06*(d%3)*0.5);
    const sal   = (1-phase) * (0.12 + 0.04*(d%2));
    octx.save();
    const sg = octx.createLinearGradient(xPos, 0, xPos+alen, 0);
    sg.addColorStop(0, `rgba(255,60,0,0)`);
    sg.addColorStop(0.5,`rgba(255,80,0,${sal})`);
    sg.addColorStop(1, `rgba(255,60,0,0)`);
    octx.fillStyle = sg;
    octx.fillRect(xPos, yOff - 1.5, alen, 3);
    octx.restore();
  }

  // Two-color clash vignettes — blue left, red right
  const leftG = octx.createLinearGradient(0, 0, W*0.46, 0);
  leftG.addColorStop(0, `rgba(0,55,200,${0.24+0.05*Math.sin(t*0.7)})`);
  leftG.addColorStop(1, 'rgba(0,0,0,0)');
  octx.fillStyle = leftG; octx.fillRect(0,0,W,H);
  const rightG = octx.createLinearGradient(W, 0, W*0.54, 0);
  rightG.addColorStop(0, `rgba(200,12,0,${0.24+0.05*Math.sin(t*0.7+1)})`);
  rightG.addColorStop(1, 'rgba(0,0,0,0)');
  octx.fillStyle = rightG; octx.fillRect(0,0,W,H);



  // Slow expanding shockwave from center
  const shockPhase = (t*0.45) % 1;
  if(shockPhase < 0.65){
    const sr    = shockPhase * Math.hypot(W,H)*0.60;
    const salpha= (1-shockPhase/0.65)*0.30;
    octx.save();
    octx.globalAlpha = salpha;
    octx.strokeStyle = 'rgba(255,200,80,1)';
    octx.lineWidth   = 2.5*(1-shockPhase);
    octx.shadowColor = '#ff9900'; octx.shadowBlur = 30;
    octx.beginPath(); octx.arc(W/2, H/2, sr, 0, Math.PI*2); octx.stroke();
    octx.restore();
  }

  // Two-toned border
  const bp = 5;
  octx.save(); octx.lineWidth = 3; octx.shadowBlur = 22;
  octx.strokeStyle = 'rgba(40,120,255,0.62)'; octx.shadowColor = '#2266ff';
  octx.save(); octx.beginPath(); octx.rect(-1,-1,W/2+1,H+2); octx.clip();
  roundRectPath(octx,bp,bp,W-bp*2,H-bp*2,12); octx.stroke(); octx.restore();
  octx.strokeStyle = 'rgba(220,30,0,0.62)'; octx.shadowColor = '#dd1100';
  octx.save(); octx.beginPath(); octx.rect(W/2,-1,W/2+1,H+2); octx.clip();
  roundRectPath(octx,bp,bp,W-bp*2,H-bp*2,12); octx.stroke(); octx.restore();
  octx.restore();
}


// ── MOTM ── Man of the Match — gold confetti celebration
function drawMOTMOverlay(W, H, t){
  // Warm amber glow from center bottom
  const bg = octx.createRadialGradient(W/2,H*0.85,0, W/2,H*0.5,H*0.8);
  bg.addColorStop(0,   `rgba(255,200,0,${0.14+0.06*Math.sin(t*1.8)})`);
  bg.addColorStop(1,   'rgba(0,0,0,0)');
  octx.fillStyle = bg; octx.fillRect(0,0,W,H);

  // Confetti shower
  animState.particles.forEach(p => { p.update(W, H); p.draw(octx); });

  // Spinning star burst rings
  for(let r = 0; r < 2; r++){
    const spin  = t*(r===0?0.4:-0.3);
    const numPt = 8 + r*4;
    const outerR= W*(0.38+r*0.08);
    const innerR= outerR*0.72;
    octx.save();
    octx.globalAlpha = 0.08 + r*0.04;
    octx.translate(W/2, H/2); octx.rotate(spin);
    octx.beginPath();
    for(let p = 0; p < numPt*2; p++){
      const a  = (p/numPt)*Math.PI;
      const pr = p%2===0?outerR:innerR;
      p===0?octx.moveTo(Math.cos(a)*pr, Math.sin(a)*pr)
           :octx.lineTo(Math.cos(a)*pr, Math.sin(a)*pr);
    }
    octx.closePath();
    octx.fillStyle = 'rgba(255,220,0,1)'; octx.fill();
    octx.restore();
  }

  // Glowing yellow-gold border
  const bp = 5;
  const bph= 0.55+0.45*Math.sin(t*2.5);
  octx.save();
  octx.strokeStyle = `rgba(255,${200+Math.floor(bph*55)},0,${bph*0.85})`;
  octx.lineWidth   = 4.5;
  octx.shadowColor = '#ffdd00'; octx.shadowBlur = 38;
  roundRectPath(octx, bp, bp, W-bp*2, H-bp*2, 12);
  octx.stroke();
  octx.strokeStyle = `rgba(255,255,180,${bph*0.45})`;
  octx.lineWidth   = 2;  octx.shadowBlur = 15;
  roundRectPath(octx, bp+6, bp+6, W-bp*2-12, H-bp*2-12, 9);
  octx.stroke();
  octx.restore();

  // Sparkle dots at corners
  [[W*0.05,H*0.06],[W*0.95,H*0.06],[W*0.05,H*0.94],[W*0.95,H*0.94]].forEach(([sx,sy],i)=>{
    const a = 0.5+0.5*Math.sin(t*3+i);
    const r = 3+a*5;
    octx.save();
    octx.globalAlpha = a*0.9;
    const sg = octx.createRadialGradient(sx,sy,0, sx,sy,r*2.5);
    sg.addColorStop(0,'rgba(255,255,200,1)');sg.addColorStop(1,'rgba(255,200,0,0)');
    octx.fillStyle=sg; octx.shadowColor='#fff380'; octx.shadowBlur=20;
    octx.beginPath(); octx.arc(sx,sy,r,0,Math.PI*2); octx.fill();
    octx.restore();
  });
}

// ── FLASHBACK ── Retro VHS sepia + scan lines + glitch
function drawFlashbackOverlay(W, H, t){
  // Sepia warm overlay
  const sep = 0.12+0.04*Math.sin(t*0.8);
  octx.save();
  octx.globalAlpha = sep;
  const sg = octx.createLinearGradient(0,0,W,H);
  sg.addColorStop(0,'rgba(160,110,40,1)');
  sg.addColorStop(0.5,'rgba(120,80,20,1)');
  sg.addColorStop(1,'rgba(170,120,50,1)');
  octx.fillStyle=sg; octx.fillRect(0,0,W,H);
  octx.restore();

  // CRT scanlines
  octx.save();
  octx.globalAlpha = 0.09;
  for(let y = 0; y < H; y+=4){
    octx.fillStyle='rgba(0,0,0,1)';
    octx.fillRect(0, y, W, 2);
  }
  octx.restore();

  // Rolling VHS noise band
  const bandY = ((t*0.3)%1)*H;
  const ng = octx.createLinearGradient(0,bandY,0,bandY+18);
  ng.addColorStop(0,'rgba(255,255,255,0)');
  ng.addColorStop(0.4,'rgba(200,180,140,0.18)');
  ng.addColorStop(1,'rgba(255,255,255,0)');
  octx.fillStyle=ng; octx.fillRect(0,bandY,W,18);

  // Occasional horizontal glitch tear
  if(Math.sin(t*11)>0.82){
    const tearY = H*(0.2+Math.random()*0.6);
    const tearH = 2+Math.random()*8;
    octx.save(); octx.globalAlpha=0.35;
    octx.fillStyle='rgba(200,180,120,1)';
    octx.fillRect(0,tearY,W,tearH);
    octx.restore();
  }

  // Old film vignette (heavy)
  const fv = octx.createRadialGradient(W/2,H/2,H*0.2, W/2,H/2,H*0.72);
  fv.addColorStop(0,'rgba(0,0,0,0)');
  fv.addColorStop(1,`rgba(30,15,0,${0.55+0.1*Math.sin(t*0.5)})`);
  octx.fillStyle=fv; octx.fillRect(0,0,W,H);

  // Warm amber animated border
  const bp=5, bph=0.6+0.35*Math.sin(t*1.8);
  octx.save();
  octx.strokeStyle=`rgba(190,140,60,${bph*0.9})`;
  octx.lineWidth=4;
  octx.shadowColor='#c89040'; octx.shadowBlur=22;
  roundRectPath(octx,bp,bp,W-bp*2,H-bp*2,12); octx.stroke();
  octx.strokeStyle=`rgba(255,200,100,${bph*0.4})`;
  octx.lineWidth=1.5; octx.shadowBlur=10;
  roundRectPath(octx,bp+6,bp+6,W-bp*2-12,H-bp*2-12,9); octx.stroke();
  octx.restore();

  // "REC" dot top right
  const recAlpha = (Math.sin(t*4)>0)?0.9:0.15;
  octx.save();
  octx.globalAlpha=recAlpha;
  octx.fillStyle='#ff2200'; octx.shadowColor='#ff2200'; octx.shadowBlur=10;
  octx.beginPath(); octx.arc(W-24,20,6,0,Math.PI*2); octx.fill();
  octx.fillStyle='rgba(255,80,50,0.9)';
  octx.font='bold 11px monospace'; octx.fillText('REC',W-16,24);
  octx.restore();
}

// ══════════════════════════════════════════════════════════════════
// REMOVE BACKGROUND — buton direct pe imaginea jucătorului
// ══════════════════════════════════════════════════════════════════

function removeBgSetStatus(msg, type) {
  const el = document.getElementById('removeBgStatus');
  el.style.display = 'block';
  el.textContent = msg;
  el.style.background = type === 'ok'
    ? 'rgba(45,189,78,.18)'  : type === 'err'
    ? 'rgba(255,60,95,.18)'  : 'rgba(200,255,0,.1)';
  el.style.color  = type === 'ok' ? '#2dbd4e' : type === 'err' ? '#ff3c5f' : '#c8ff00';
  el.style.border = `1px solid ${type==='ok'?'#2dbd4e':type==='err'?'#ff3c5f':'#c8ff00'}`;
}

// Sync toleranță slider label — eliminat, păstrat stub pentru compatibilitate
// (slider a fost înlocuit cu AI-based removal)

document.getElementById('removeBgBtn').addEventListener('click', async () => {
  if (!state.playerImg) {
    removeBgSetStatus('❌ Nicio imagine de jucător încărcată.', 'err');
    return;
  }

  const btn     = document.getElementById('removeBgBtn');
  const progEl  = document.getElementById('removeBgProgress');
  const barEl   = document.getElementById('removeBgBar');

  btn.disabled       = true;
  btn.textContent    = '⏳ SE PROCESEAZĂ...';
  progEl.style.display = 'block';
  barEl.style.width    = '0%';
  removeBgSetStatus('📥 Se încarcă modelul AI… (prima dată ~25 MB)', 'load');

  try {
    // ── 1. Convertim imaginea curentă în Blob PNG ─────────────────
    const srcCanvas = document.createElement('canvas');
    srcCanvas.width  = state.playerImg.naturalWidth  || state.playerImg.width;
    srcCanvas.height = state.playerImg.naturalHeight || state.playerImg.height;
    srcCanvas.getContext('2d').drawImage(state.playerImg, 0, 0);
    const srcBlob = await new Promise(res => srcCanvas.toBlob(res, 'image/png'));

    // ── 2. Import dinamic @imgly/background-removal ───────────────
    const CDN = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/';
    let removeBackground;
    try {
      ({ removeBackground } = await import(CDN + 'background-removal.js'));
    } catch(importErr) {
      // Fallback: load as script + wait for global
      await new Promise((res, rej) => {
        if (window.ImglyBackgroundRemoval) { res(); return; }
        const s = document.createElement('script');
        s.src = CDN + 'background-removal.js';
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
      removeBackground = window.ImglyBackgroundRemoval?.removeBackground
                      || window.removeBackground;
      if (!removeBackground) throw new Error('Librăria AI nu a putut fi încărcată.');
    }

    removeBgSetStatus('🤖 Procesare AI în curs…', 'load');
    barEl.style.width = '5%';

    // ── 3. Procesare ──────────────────────────────────────────────
    const resultBlob = await removeBackground(srcBlob, {
      publicPath: CDN,
      progress: (key, current, total) => {
        if (total > 0) barEl.style.width = Math.round(current / total * 100) + '%';
      },
      model: 'medium', // 'small' = mai rapid, 'medium' = echilibru, 'large' = calitate maximă
    });

    barEl.style.width = '100%';

    // ── 4. Aplicăm rezultatul (dataURL pentru a evita taint canvas) ─
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        state.playerImg = img;
        draw();
        const thumb = document.getElementById('playerThumb');
        thumb.src = ev.target.result;
        thumb.style.display = 'block';
        removeBgSetStatus('✅ Fundal eliminat cu succes!', 'ok');
        btn.disabled    = false;
        btn.textContent = '✂️ ȘTERGE FUNDAL';
        setTimeout(() => { progEl.style.display = 'none'; barEl.style.width = '0%'; }, 800);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(resultBlob);

  } catch(err) {
    console.error('BG removal AI error:', err);
    removeBgSetStatus('❌ ' + err.message, 'err');
    btn.disabled       = false;
    btn.textContent    = '✂️ ȘTERGE FUNDAL';
    progEl.style.display = 'none';
  }
});

// ══════════════════════════════════════════════════════════════════
// ȘTERGERE FUNDAL — Flood-fill BFS cu detecție automată culoare
// ══════════════════════════════════════════════════════════════════

/**
 * Detectează culoarea dominantă a marginilor imaginii și o elimină
 * prin flood-fill BFS cu toleranță configurabilă (distanță Euclidianã RGB).
 * Funcționează pentru orice culoare de fundal, nu doar alb.
 *
 * @param {HTMLImageElement} imgEl
 * @param {number} tolerance  — distanță max RGB (0-100). Default: 35
 */
function removeWhiteBackground(imgEl, tolerance) {
  if (tolerance === undefined) {
    const slider = document.getElementById('removeBgTolerance');
    tolerance = slider ? parseInt(slider.value) : 35;
  }

  const W = imgEl.naturalWidth  || imgEl.width;
  const H = imgEl.naturalHeight || imgEl.height;
  const tmp = document.createElement('canvas');
  tmp.width = W; tmp.height = H;
  const tctx = tmp.getContext('2d', { willReadFrequently: true });
  tctx.drawImage(imgEl, 0, 0);
  const data = tctx.getImageData(0, 0, W, H);
  const px = data.data;

  // ── 1. Detecție culoare fundal din marginile imaginii ──────────
  // Eșantionăm ~200 pixeli de pe cele 4 borduri și luăm mediana
  const edgeSamples = [];
  const step = Math.max(1, Math.floor(Math.max(W, H) / 50));
  for (let x = 0; x < W; x += step) {
    edgeSamples.push((0 * W + x) * 4);          // sus
    edgeSamples.push(((H-1) * W + x) * 4);      // jos
  }
  for (let y = 0; y < H; y += step) {
    edgeSamples.push((y * W + 0) * 4);           // stânga
    edgeSamples.push((y * W + (W-1)) * 4);       // dreapta
  }

  // Mediana pe fiecare canal (robustă la sprite-uri cu logo în colț)
  const rs = [], gs = [], bs = [];
  for (const i of edgeSamples) {
    if (px[i+3] < 10) continue; // ignoră pixeli deja transparenți
    rs.push(px[i]); gs.push(px[i+1]); bs.push(px[i+2]);
  }
  const median = arr => { const s = [...arr].sort((a,b)=>a-b); return s[Math.floor(s.length/2)] || 0; };
  const bgR = median(rs), bgG = median(gs), bgB = median(bs);

  // ── 2. Funcție distanță RGB ────────────────────────────────────
  const colorDist = (pIdx) => {
    const dr = px[pIdx]   - bgR;
    const dg = px[pIdx+1] - bgG;
    const db = px[pIdx+2] - bgB;
    return Math.sqrt(dr*dr + dg*dg + db*db);
  };

  // ── 3. BFS flood-fill din toate cele 4 borduri ─────────────────
  const visited = new Uint8Array(W * H);
  const queue = [];
  const enqueue = (x, y) => {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const idx = y * W + x;
    if (visited[idx]) return;
    const pIdx = idx * 4;
    if (px[pIdx+3] > 5 && colorDist(pIdx) <= tolerance) {
      visited[idx] = 1;
      queue.push(x, y);
    }
  };

  for (let x = 0; x < W; x++) { enqueue(x, 0); enqueue(x, H-1); }
  for (let y = 0; y < H; y++) { enqueue(0, y); enqueue(W-1, y); }

  let qi = 0;
  while (qi < queue.length) {
    const cx = queue[qi++], cy = queue[qi++];
    enqueue(cx+1, cy); enqueue(cx-1, cy);
    enqueue(cx, cy+1); enqueue(cx, cy-1);
  }

  // ── 4. Transparentizare cu margine moale ───────────────────────
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      if (!visited[idx]) continue;
      const pIdx = idx * 4;
      const neighbors = [
        (y > 0   && !visited[(y-1)*W+x]),
        (y < H-1 && !visited[(y+1)*W+x]),
        (x > 0   && !visited[y*W+(x-1)]),
        (x < W-1 && !visited[y*W+(x+1)]),
      ].filter(Boolean).length;
      px[pIdx+3] = neighbors > 0 ? 60 : 0; // margine moale
    }
  }

  tctx.putImageData(data, 0, 0);
  return tmp.toDataURL('image/png');
}

function applyCleanPlayerImage(cleanBase64, statusCb) {
  const finalImg = new Image();
  finalImg.onload = () => {
    state.playerImg = finalImg;
    draw();
    const thumb = document.getElementById('playerThumb');
    thumb.src = cleanBase64;
    thumb.style.display = 'block';
  };
  finalImg.src = cleanBase64;
}

function applyPlayerFromBase64(base64, statusCb) {
  if (statusCb) statusCb('✂️ Ștergere fundal...', 'load');
  const img = new Image();
  img.onload = () => {
    const cleanData = removeWhiteBackground(img);
    applyCleanPlayerImage(cleanData);
  };
  img.src = base64;
}

// ══════════════════════════════════════════════════════════════════
// REMOVE BACKGROUND — stub (gettySetStatus păstrat pentru compatibilitate)
// ══════════════════════════════════════════════════════════════════

function gettySetStatus(msg, type) {
  // Funcție goală — eliminată din UI, păstrată pentru compatibilitate internă
  void msg; void type;
}

// ── Animated effect button handlers ────────────────────────────
document.querySelectorAll('#animEffectPick .anim-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#animEffectPick .anim-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    animState.effect = btn.dataset.a;
    animState.tick   = 0;
    const gifBtn = document.getElementById('exportGifBtn');
    if(animState.effect === 'none'){
      stopOverlayAnim();
      // gifBtn rămâne vizibil
    } else {
      const W = canvas.width, H = canvas.height;
      if(animState.effect === 'fire')        initParticles('fire',    70, W, H);
      if(animState.effect === 'ice')         initParticles('ice',     55, W, H);
      if(animState.effect === 'tots')        initParticles('gem',     50, W, H);
      if(animState.effect === 'hero')        initParticles('ember',   55, W, H);
      if(animState.effect === 'icon')        initParticles('dust',    60, W, H);
      if(animState.effect === 'showdown')    initParticles('spark',   80, W, H);
      if(animState.effect === 'motm')        initParticles('confetti',65, W, H);
      startOverlayAnim();
      gifBtn.classList.add('visible'); // mereu vizibil, indiferent de efect
    }
  });
});

// Sync overlay size when card dimensions change
document.querySelectorAll('.dim-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    setTimeout(() => {
      syncOverlaySize();
      if(animState.effect === 'fire')     initParticles('fire',    70, canvas.width, canvas.height);
      if(animState.effect === 'ice')      initParticles('ice',     55, canvas.width, canvas.height);
      if(animState.effect === 'tots')     initParticles('gem',     50, canvas.width, canvas.height);
      if(animState.effect === 'hero')     initParticles('ember',   55, canvas.width, canvas.height);
      if(animState.effect === 'icon')     initParticles('dust',    60, canvas.width, canvas.height);
      if(animState.effect === 'showdown') initParticles('spark',   80, canvas.width, canvas.height);
      if(animState.effect === 'motm')     initParticles('confetti',65, canvas.width, canvas.height);
    }, 40);
  });
});

// ── GIF EXPORT ─────────────────────────────────────────────────
function loadScript(src){
  return new Promise((res, rej) => {
    if(document.querySelector(`script[src="${src}"]`)){ res(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

document.getElementById('exportGifBtn').addEventListener('click', async () => {
  const btn       = document.getElementById('exportGifBtn');
  const progEl    = document.getElementById('gifProgress');
  const barEl     = document.getElementById('gifBar');
  btn.textContent = '⏳ SE PROCESEAZĂ...';
  btn.disabled    = true;
  progEl.style.display = 'block';
  barEl.style.width    = '0%';

  // Încarcă gif.js + worker ca Blob URL (evită blocarea CORS pentru Web Workers)
  let workerBlobURL = null;
  try {
    if(typeof GIF === 'undefined'){
      await loadScript('https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js');
    }
    // Fetch worker code și creează Blob URL local — fix CORS
    const workerResp = await fetch('https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js');
    if(!workerResp.ok) throw new Error('Worker fetch failed');
    const workerCode = await workerResp.text();
    const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
    workerBlobURL = URL.createObjectURL(workerBlob);
  } catch(e) {
    btn.textContent = '🎞 EXPORTĂ GIF ANIMAT';
    btn.disabled = false;
    progEl.style.display = 'none';
    alert('Nu s-a putut încărca biblioteca GIF.\nVerificați conexiunea la internet și încercați din nou.');
    return;
  }

  const W = canvas.width, H = canvas.height;
  const totalFrames = 200;   // mai multe frame-uri = animație mai fluidă
  const frameDelay  = 40;

  const comp = document.createElement('canvas');
  comp.width = W; comp.height = H;
  const cctx = comp.getContext('2d');

  const gif = new GIF({
    workers:      2,
    quality:      4,   // 1=maxim, 10=rapid — 4 e un echilibru bun
    width:        W,
    height:       H,
    workerScript: workerBlobURL  // ← Blob URL local, fără CORS
  });

  // Oprește animația live și parcurge frame-urile manual
  overlayRunning  = false;
  const savedTick = animState.tick;
  animState.tick  = 0;
  if(animState.effect === 'fire')     initParticles('fire',    60, W, H);
  if(animState.effect === 'ice')      initParticles('ice',     45, W, H);
  if(animState.effect === 'tots')     initParticles('gem',     45, W, H);
  if(animState.effect === 'hero')     initParticles('ember',   48, W, H);
  if(animState.effect === 'icon')     initParticles('dust',    50, W, H);
  if(animState.effect === 'showdown') initParticles('spark',   65, W, H);
  if(animState.effect === 'motm')     initParticles('confetti',55, W, H);

  const tickStep = (Math.PI * 2) / totalFrames * 0.4;

  for(let f = 0; f < totalFrames; f++){
    animState.tick = f * tickStep;
    if(['fire','ice','tots','hero','icon','showdown','motm'].includes(animState.effect)){
      for(let s = 0; s < 3; s++) animState.particles.forEach(p => p.update(W, H));
    }
    draw();
    octx.clearRect(0, 0, W, H);
    drawOverlay();

    cctx.clearRect(0, 0, W, H);
    cctx.drawImage(canvas, 0, 0);
    cctx.drawImage(overlayCanvas, 0, 0);
    gif.addFrame(cctx, { copy: true, delay: frameDelay });

    barEl.style.width = `${Math.round((f + 1) / totalFrames * 50)}%`;
    await new Promise(r => setTimeout(r, 0)); // yield la browser
  }

  // Repornește animația live
  animState.tick = savedTick;
  startOverlayAnim();

  barEl.style.width = '52%';

  gif.on('progress', p => {
    barEl.style.width = `${52 + Math.round(p * 48)}%`;
  });

  gif.on('finished', blob => {
    // Eliberează Blob URL worker
    if(workerBlobURL) URL.revokeObjectURL(workerBlobURL);
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const name = (state.firstName.charAt(0) + '_' + state.lastName).replace(/\s+/g,'_');
    link.download = `card_${name}_${state.rating}_animat.gif`;
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    btn.textContent      = '🎞 EXPORTĂ GIF ANIMAT';
    btn.disabled         = false;
    progEl.style.display = 'none';
    barEl.style.width    = '0%';
  });

  gif.on('error', err => {
    console.error('GIF render error:', err);
    if(workerBlobURL) URL.revokeObjectURL(workerBlobURL);
    btn.textContent      = '🎞 EXPORTĂ GIF ANIMAT';
    btn.disabled         = false;
    progEl.style.display = 'none';
    alert('Eroare la generarea GIF-ului. Încercați cu un card mai mic.');
  });

  gif.render();
});
