
// ─── FIREBASE CONFIG ───────────────────
const firebaseConfig = {
  apiKey: "AIzaSyA7nnJY9Eq08mDbjDmegGBki8zSKI5RkTE",
  authDomain: "control-y-ahorro.firebaseapp.com",
  projectId: "control-y-ahorro",
  storageBucket: "control-y-ahorro.firebasestorage.app",
  messagingSenderId: "1074694673223",
  appId: "1:1074694673223:web:0058bebdf739f1d46c7262"
};
firebase.initializeApp(firebaseConfig);
const db   = firebase.firestore();
const auth = firebase.auth();

// ─── CURRENT USER ───────────────────
let currentUser = null;
auth.onAuthStateChanged(user => {
  currentUser = user;
  const avatar   = document.getElementById('userAvatar');
  const loginBtn = document.getElementById('loginBtn');
  if (user) {
    avatar.src   = user.photoURL || '';
    avatar.style.display = 'block';
    loginBtn.style.display = 'none';
  } else {
    avatar.style.display = 'none';
    loginBtn.style.display = 'block';
  }
  // refresh muro if on it
  if (document.getElementById('screen-muro').classList.contains('active')) {
    renderMuroAuth();
  }
});

function signInGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(e => console.error(e));
}
function signOut() {
  if (confirm('¿Cerrar sesión?')) auth.signOut();
}

// ─── NAVIGATION + HISTORY API ──────────
const SCREENS = ['home','aprende','organiza','interactiva','muro','glosario','recursos','escape'];

function goTo(id) {
  SCREENS.forEach(s => {
    const el = document.getElementById('screen-' + s);
    if (el) el.classList.remove('active');
    const btn = document.getElementById('nav-' + s);
    if (btn) btn.classList.remove('active');
  });

  const screen = document.getElementById('screen-' + id);
  if (screen) screen.classList.add('active');

  const navBtn = document.getElementById('nav-' + id);
  if (navBtn) navBtn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // push history state for back button support (iOS & Android)
  if (history.state?.screen !== id) {
    history.pushState({ screen: id }, '', '#' + id);
  }

  // lazy-load section data
  if (id === 'muro')     renderMuroAuth();
  if (id === 'glosario') renderGlossary();
  if (id === 'recursos') startTipRotator();
}

// Handle browser back/forward
window.addEventListener('popstate', e => {
  const id = e.state?.screen || 'home';
  goTo(id);
});

// Handle hash on load
window.addEventListener('load', () => {
  const hash = location.hash.replace('#', '');
  if (hash && SCREENS.includes(hash)) goTo(hash);
  else {
    history.replaceState({ screen: 'home' }, '', '#home');
  }
  initCoins();
  initStars();
  initChallengeTrackers();
  renderQuiz();
  rotateBubble();
});

// ─── DARK MODE ──────────────────────────
let dark = localStorage.getItem('darkMode') === 'true';
applyTheme();
function toggleDark() {
  dark = !dark;
  localStorage.setItem('darkMode', dark);
  applyTheme();
}
function applyTheme() {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.getElementById('darkToggle').textContent = dark ? '☀️' : '🌙';
}

// ─── HAMBURGER ───────────────────────────
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ─── FLOATING COINS ──────────────────────
function initCoins() {
  const bg = document.getElementById('coinsBg');
  const emojis = ['🪙','💰','💵','💴','💶','🏦'];
  for (let i = 0; i < 16; i++) {
    const c = document.createElement('div');
    c.className = 'coin-float';
    c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    c.style.left = Math.random() * 100 + '%';
    c.style.animationDuration = (8 + Math.random() * 12) + 's';
    c.style.animationDelay    = (Math.random() * 10) + 's';
    c.style.fontSize = (1.1 + Math.random() * 1.4) + 'rem';
    bg.appendChild(c);
  }
}

// ─── STARS ───────────────────────────────
function initStars() {
  const bg = document.getElementById('starsBg');
  for (let i = 0; i < 55; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = 1 + Math.random() * 3;
    s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-duration:${2+Math.random()*4}s;animation-delay:${Math.random()*4}s`;
    bg.appendChild(s);
  }
}

// ─── ROTATING BUBBLE ─────────────────────
const bubbleMessages = [
  '¡Hola! Soy <b>Monedín</b> 👋<br>¡Cuida tu dinero!',
  '💡 ¿Sabías que ahorrar<br>$10 al día = $3,600 al año?',
  '🐜 ¡Cuidado con el<br>gasto hormiga!',
  '🎯 Define una <b>meta</b><br>y empieza a ahorrar hoy',
  '📊 Usa la regla<br><b>50 · 30 · 20</b>',
  '🏦 ¡Págarte a ti<br>primero siempre!',
  '💪 ¡Tú puedes lograr<br>tus metas financieras!',
];
let bubbleIdx = 0;
function rotateBubble() {
  const el = document.getElementById('heroBubble');
  if (!el) return;
  el.innerHTML = bubbleMessages[bubbleIdx % bubbleMessages.length];
  bubbleIdx++;
  setTimeout(rotateBubble, 4000);
}

// ─── TOPIC TABS ──────────────────────────
function showTopic(id, btn) {
  document.querySelectorAll('.topic-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('topic-' + id).classList.add('active');
  btn.classList.add('active');
}

// ─── TOOL TABS ───────────────────────────
function showTool(id, btn) {
  document.querySelectorAll('.tool-panel').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tool-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('tool-' + id).classList.add('active');
  btn.classList.add('active');
}

// ─── BUDGET CALCULATOR ───────────────────
function calcBudget() {
  const ing = parseFloat(document.getElementById('b-ingreso').value) || 0;
  const ids  = ['b-comida','b-transporte','b-escolar','b-entrete','b-hormiga-g','b-otros'];
  const gas  = ids.reduce((s, id) => s + (parseFloat(document.getElementById(id).value) || 0), 0);
  const sal  = ing - gas;
  const pct  = ing > 0 ? Math.min((gas / ing) * 100, 100) : 0;

  document.getElementById('res-ing').textContent = '$' + ing.toFixed(0);
  document.getElementById('res-gas').textContent = '$' + gas.toFixed(0);
  document.getElementById('res-sal').textContent = (sal >= 0 ? '+$' : '-$') + Math.abs(sal).toFixed(0);
  document.getElementById('res-sal').style.color = sal >= 0 ? '#4ade80' : '#f87171';
  document.getElementById('budgetResult').style.display = 'flex';
  setTimeout(() => {
    const bar = document.getElementById('res-bar');
    bar.style.width = pct + '%';
    bar.style.background = pct > 85 ? '#ef4444' : pct > 65 ? '#f59e0b' : '#4ade80';
  }, 100);

  const fb = document.getElementById('budget-fb');
  if (sal < 0) {
    fb.innerHTML = `<div class="gold-box" style="border-color:#ef4444"><h3>⚠️ ¡Estás gastando más de lo que tienes!</h3><p>Tus gastos superan tus ingresos por <b>$${Math.abs(sal).toFixed(0)}</b>. Monedín te sugiere revisar los gastos opcionales y el gasto hormiga. ¡Pequeños cambios hacen una gran diferencia!</p></div>`;
  } else if (sal < ing * 0.2) {
    fb.innerHTML = `<div class="highlight"><h3>🟡 Puedes mejorar tu ahorro</h3><p>Te sobran <b>$${sal.toFixed(0)}</b>, pero lo ideal es ahorrar al menos el 20% (<b>$${(ing*0.2).toFixed(0)}</b>). Intenta reducir gastos de entretenimiento o gasto hormiga. ¡Estás cerca!</p></div>`;
  } else {
    fb.innerHTML = `<div class="highlight" style="border-color:#16a34a;background:#dcfce7"><h3 style="color:#14532d">🎉 ¡Excelente! Tu presupuesto está bien organizado</h3><p style="color:#166534">Estás ahorrando <b>$${sal.toFixed(0)}</b> (${(sal/ing*100).toFixed(0)}% de tus ingresos). ¡Monedín está muy orgulloso de ti! 🏆 Sigue así.</p></div>`;
  }
}

// ─── HORMIGA CALCULATOR ──────────────────
function calcHormiga() {
  const ids = ['h-cafe','h-snack','h-apps','h-taxi','h-otros'];
  const dia = ids.reduce((s, id) => s + (parseFloat(document.getElementById(id).value) || 0), 0);
  const mes  = dia * 30;
  const anio = dia * 365;
  document.getElementById('h-dia').textContent  = '$' + dia.toFixed(0);
  document.getElementById('h-mes').textContent  = '$' + mes.toFixed(0);
  document.getElementById('h-anio').textContent = '$' + anio.toFixed(0);
  document.getElementById('hormigaResult').style.display = 'flex';

  const fb = document.getElementById('hormiga-fb');
  if (dia > 0) {
    const equiv = anio > 5000 ? 'un viaje de fin de semana 🏖️' : anio > 2000 ? 'unos buenos audífonos y más 🎧' : 'varios gustos importantes 🎁';
    fb.innerHTML = `<div class="gold-box" style="margin-top:14px"><h3>😮 ¡Eso equivale a ${equiv}!</h3><p>Con <b>$${dia.toFixed(0)} al día</b> en gastos hormiga, en un año pierdes <b>$${anio.toFixed(0)}</b>. Si los ahorraras, podrías lograr metas importantes. ¿Vale la pena?</p></div>`;
  }
}

// ─── META CALCULATOR ─────────────────────
function calcMeta() {
  const nombre = document.getElementById('m-nombre').value || 'tu meta';
  const costo  = parseFloat(document.getElementById('m-costo').value) || 0;
  const dias   = parseInt(document.getElementById('m-dias').value) || 1;
  const tengo  = parseFloat(document.getElementById('m-tengo').value) || 0;
  const falta  = Math.max(costo - tengo, 0);
  const porDia = falta / dias;
  const porSem = porDia * 7;
  const pct    = costo > 0 ? Math.min((tengo / costo) * 100, 100) : 0;

  document.getElementById('m-dia').textContent   = '$' + porDia.toFixed(2);
  document.getElementById('m-sem').textContent   = '$' + porSem.toFixed(2);
  document.getElementById('m-falta').textContent = '$' + falta.toFixed(0);
  document.getElementById('metaResult').style.display = 'flex';
  document.getElementById('meta-progress').style.display = 'block';
  setTimeout(() => {
    document.getElementById('m-bar').style.width = pct + '%';
  }, 100);
  document.getElementById('m-msg').textContent = pct > 0
    ? `¡Ya tienes el ${pct.toFixed(0)}% de tu meta "${nombre}"! 💪`
    : `¡Empieza hoy y en ${dias} días tendrás "${nombre}"!`;
}

// ─── QUIZ SYSTEM ─────────────────────────
const QUIZ_BANK = [
  { q:"¿Cuál es un ejemplo de 'gasto hormiga'?", opts:["Pagar la colegiatura","Comprar un refresco diario","Pagar el transporte escolar","Comprar útiles"], c:1, fb:"✅ ¡Correcto! $20 diarios = $600 al mes que podrías ahorrar. 🐜" },
  { q:"Según la regla 50-30-20, ¿qué % va al ahorro?", opts:["50%","30%","20%","10%"], c:2, fb:"✅ ¡Exacto! El 20% siempre va al ahorro. 💰" },
  { q:"Tienes $500 de mesada. Aplicando 50-30-20, ¿cuánto ahorras?", opts:["$50","$100","$150","$250"], c:1, fb:"✅ ¡Bien! 20% de $500 = $100 para ahorro. 🏦" },
  { q:"¿Qué significa hacer un presupuesto?", opts:["Gastar rápido","Planear cómo usar tu dinero antes de gastarlo","Pedir dinero prestado","Ahorrar el 100%"], c:1, fb:"✅ ¡Perfecto! Un presupuesto es un PLAN para tu dinero. 📋" },
  { q:"¿Cuál es la mejor estrategia de ahorro?", opts:["Ahorrar lo que sobre","Esperar a ganar más","Separar el ahorro antes de gastar","Guardar solo en días especiales"], c:2, fb:"✅ ¡Exactamente! 'Págarte a ti primero' es el secreto. 🌟" },
  { q:"Si gastas $20 en refresco cada día, ¿cuánto es al mes?", opts:["$200","$400","$600","$800"], c:2, fb:"✅ $20 × 30 días = $600. ¡Eso es mucho dinero! 🐜" },
  { q:"¿Cuál NO es un gasto necesario?", opts:["Transporte escolar","Comida","Videojuegos","Material escolar"], c:2, fb:"✅ Los videojuegos son un deseo, no una necesidad. 🎮" },
  { q:"¿Qué es el 'interés compuesto'?", opts:["Pagar deudas","Ganar interés sobre tu ahorro Y sobre los intereses previos","Un tipo de gasto hormiga","Una regla de presupuesto"], c:1, fb:"✅ ¡Correcto! El interés compuesto hace crecer tu dinero con el tiempo. 📈" },
  { q:"¿Cuándo debes separar tu ahorro?", opts:["Al final del mes si sobra","Al inicio, antes de gastar","Cuando quieras comprar algo","Solo en diciembre"], c:1, fb:"✅ ¡Sí! Separa el ahorro primero. 'Págarte a ti mismo' es clave. 🏦" },
  { q:"¿Qué es un fondo de emergencia?", opts:["Dinero para diversión","Dinero ahorrado para gastos inesperados","Un tipo de deuda","Un plan de inversión"], c:1, fb:"✅ ¡Correcto! Un fondo de emergencia te protege de gastos inesperados. 🛡️" },
  { q:"¿Cuál es la fórmula del presupuesto sano?", opts:["Ingresos = Gastos","Gastos > Ingresos","Ingresos > Gastos","Deudas = Ahorro"], c:2, fb:"✅ ¡Tus ingresos siempre deben ser mayores que tus gastos! ⚖️" },
  { q:"¿Qué significa 'liquidez'?", opts:["Tener muchas deudas","Qué tan fácil es convertir algo en dinero en efectivo","Un tipo de ahorro","Gastar mucho"], c:1, fb:"✅ ¡Correcto! El efectivo es el activo más líquido que existe. 💧" },
  { q:"¿Cuál es el primer paso para ahorrar?", opts:["Buscar más ingresos","Pedir un préstamo","Conocer cuánto ganas y en qué gastas","Invertir en bolsa"], c:2, fb:"✅ ¡Exacto! Sin saber cuánto ganas y gastas, es imposible ahorrar. 📊" },
  { q:"Una deuda con tarjeta de crédito sin pagar genera...", opts:["Menos interés","Más interés cada mes","Ningún problema","Un descuento"], c:1, fb:"✅ Las deudas de tarjeta generan intereses que se acumulan. ¡Cuidado! 💳" },
  { q:"¿Qué es mejor para tus finanzas?", opts:["Comprar a crédito todo","Gastar todo antes de fin de mes","Ahorrar aunque sea poco cada semana","No pensar en el dinero"], c:2, fb:"✅ ¡Constancia! Poco a poco se va llenando el pilón. 🪙" },
];

let quizQuestions = [];
let currentQ = 0;
let answered  = false;
let score     = 0;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderQuiz() {
  quizQuestions = shuffleArray(QUIZ_BANK).slice(0, 5);
  currentQ = 0; score = 0; answered = false;
  showQuestion();
}

function showQuestion() {
  if (currentQ >= quizQuestions.length) { showResult(); return; }
  const data = quizQuestions[currentQ];
  document.getElementById('quizProg').textContent = `Pregunta ${currentQ+1} de ${quizQuestions.length}`;
  document.getElementById('quizQ').textContent = data.q;
  const optsEl = document.getElementById('quizOpts');
  optsEl.innerHTML = '';
  data.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.textContent = opt;
    btn.onclick = () => answerQuiz(i);
    optsEl.appendChild(btn);
  });
  document.getElementById('quizFB').className = 'quiz-fb';
  document.getElementById('quizFB').textContent = '';
  const next = document.getElementById('quizNext');
  next.className = 'btn-green quiz-next';
  next.textContent = currentQ === quizQuestions.length - 1 ? '🏆 Ver resultado' : 'Siguiente →';
  answered = false;
}

function answerQuiz(idx) {
  if (answered) return;
  answered = true;
  const data = quizQuestions[currentQ];
  const opts = document.querySelectorAll('.quiz-opt');
  opts[idx].classList.add(idx === data.c ? 'correct' : 'wrong');
  if (idx !== data.c) opts[data.c].classList.add('correct');
  if (idx === data.c) score++;
  const fb = document.getElementById('quizFB');
  fb.textContent = (idx === data.c ? '' : '❌ Incorrecto. ') + data.fb;
  fb.className   = 'quiz-fb show ' + (idx === data.c ? 'good' : 'bad');
  document.getElementById('quizNext').classList.add('show');
}

function nextQuestion() { currentQ++; showQuestion(); }

function showResult() {
  const pct = Math.round((score / quizQuestions.length) * 100);
  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '😊' : '📚';
  const msg   = pct >= 80 ? '¡Eres un experto financiero!' : pct >= 60 ? '¡Vas muy bien, sigue aprendiendo!' : '¡No te rindas, practica más!';
  document.getElementById('quizBox').innerHTML = `
    <div style="text-align:center;padding:20px">
      <div style="font-size:4rem;margin-bottom:14px">${emoji}</div>
      <h3 style="font-family:'Fredoka One',cursive;font-size:1.5rem;color:var(--green-dark);margin-bottom:8px">${msg}</h3>
      <p style="color:var(--slate);margin-bottom:6px">Respondiste <b>${score} de ${quizQuestions.length}</b> preguntas correctamente</p>
      <p style="font-size:2rem;font-weight:900;color:var(--green);margin-bottom:22px">${pct}%</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <button class="btn-green" onclick="renderQuiz();document.getElementById('quizBox').innerHTML='';renderQuizBox()">🔄 Nuevas preguntas</button>
        <button class="btn-gold" onclick="goTo('escape')">🔐 Ir al Escape Room</button>
      </div>
    </div>`;
}

function renderQuizBox() {
  const box = document.getElementById('quizBox');
  box.innerHTML = `
    <div class="quiz-header"><h3>¿Cuánto sabes sobre finanzas?</h3><span class="quiz-progress" id="quizProg"></span></div>
    <div class="quiz-q" id="quizQ"></div>
    <div class="quiz-opts" id="quizOpts"></div>
    <div class="quiz-fb" id="quizFB"></div>
    <div class="quiz-actions"><button class="btn-green quiz-next" id="quizNext" onclick="nextQuestion()">Siguiente →</button></div>`;
  renderQuiz();
}

// ─── CHALLENGE TRACKERS ──────────────────
const CH_DAYS = { 1: 7, 2: 7, 3: 30 };

function initChallengeTrackers() {
  [1, 2, 3].forEach(n => {
    const el   = document.getElementById('ch' + n + '-tracker');
    const days = CH_DAYS[n];
    const saved = JSON.parse(localStorage.getItem('ch' + n + '-days') || '[]');
    const text  = localStorage.getItem('ch' + n + '-text') || '';
    if (text) {
      document.getElementById('ch' + n + '-text').value = text;
      document.getElementById('ch' + n + '-saved').classList.add('show');
    }
    el.innerHTML = '';
    for (let d = 1; d <= days; d++) {
      const btn = document.createElement('button');
      btn.className = 'ch-day' + (saved.includes(d) ? ' done' : '');
      btn.textContent = d;
      btn.title = 'Día ' + d;
      btn.onclick = () => toggleDay(n, d, btn);
      el.appendChild(btn);
    }
  });
}

function toggleDay(n, d, btn) {
  btn.classList.toggle('done');
  let saved = JSON.parse(localStorage.getItem('ch' + n + '-days') || '[]');
  if (btn.classList.contains('done')) saved.push(d);
  else saved = saved.filter(x => x !== d);
  localStorage.setItem('ch' + n + '-days', JSON.stringify(saved));
}

function saveChallenge(n) {
  const text = document.getElementById('ch' + n + '-text').value.trim();
  if (!text) { alert('Por favor escribe tu compromiso antes de guardar.'); return; }
  localStorage.setItem('ch' + n + '-text', text);
  document.getElementById('ch' + n + '-saved').classList.add('show');
}

// ─── CASE STUDY ─────────────────────────
function checkCase() {
  const total    = parseFloat(document.getElementById('c-total').value) || 0;
  const ahorro   = parseFloat(document.getElementById('c-ahorro').value) || 0;
  const hormiga  = parseFloat(document.getElementById('c-hormiga').value) || 0;
  const mesAhorro= parseFloat(document.getElementById('c-mesahorro').value) || 0;

  // Real answers
  const rTotal     = 310;  // 80+120+60+50 = 310
  const rAhorro    = 90;   // 400-310
  const rHormiga   = 60;   // snacks/refrescos
  const rMesAhorro = 240;  // 60/semana × 4 semanas

  const totalOk    = Math.abs(total - rTotal)     < 20;
  const ahorroOk   = Math.abs(ahorro - rAhorro)   < 20;
  const hormigaOk  = Math.abs(hormiga - rHormiga) < 15;
  const mesOk      = Math.abs(mesAhorro - rMesAhorro) < 40;

  const score4 = [totalOk, ahorroOk, hormigaOk, mesOk].filter(Boolean).length;

  let msg = '';
  if (!totalOk)    msg += `\n🔹 Total de gastos: La respuesta correcta es <b>$310</b> (transporte $80 + comida $120 + snacks $60 + datos $50). Tu respuesta: $${total}.`;
  else             msg += `\n✅ Total de gastos: ¡Correcto! $310.`;
  if (!ahorroOk)   msg += `\n🔹 Le queda para ahorrar: Son <b>$90</b> ($400 ingresos − $310 gastos). Tu respuesta: $${ahorro}.`;
  else             msg += `\n✅ Le queda para ahorrar: ¡Correcto! $90.`;
  if (!hormigaOk)  msg += `\n🔹 Gasto hormiga: Son los <b>$60 en snacks y refrescos</b>, gastos pequeños que se podrían evitar. Tu respuesta: $${hormiga}.`;
  else             msg += `\n✅ Gasto hormiga: ¡Correcto! $60.`;
  if (!mesOk)      msg += `\n🔹 Ahorro mensual si elimina hormiga: Sería <b>$240 al mes</b> ($60/semana × 4 semanas). Tu respuesta: $${mesAhorro}.`;
  else             msg += `\n✅ Ahorro mensual posible: ¡Correcto! $240.`;

  const intro = score4 === 4
    ? '🏆 ¡Perfecto! Respondiste todo correctamente. Eres un analista financiero en potencia. '
    : score4 >= 2
    ? '👍 ¡Buen intento! Acertaste ' + score4 + ' de 4. Aquí la retroalimentación de cada respuesta: '
    : '📚 Sigue practicando. Acertaste ' + score4 + ' de 4. No te rindas, aquí te explico: ';

  const suggestion = score4 < 4
    ? '<br><br>💡 <b>Consejo de Monedín:</b> Revisa la sección de <b>Gasto Hormiga</b> y la <b>Calculadora de Presupuesto</b> para reforzar estos conceptos. ¡Cada error es una oportunidad de aprender!'
    : '<br><br>🌟 <b>Monedín dice:</b> ¡Ahora ve al Escape Room y demuestra que eres un crack financiero!';

  const el = document.getElementById('aiResponse');
  el.classList.add('show');
  document.getElementById('aiText').innerHTML = intro + msg.replace(/\n/g, '<br>') + suggestion;
}

// ─── MURO COMUNITARIO ────────────────────
function renderMuroAuth() {
  const loginBox = document.getElementById('wallLoginBox');
  const wallContent = document.getElementById('wallContent');
  if (currentUser) {
    loginBox.style.display = 'none';
    wallContent.style.display = 'block';
    loadWallPosts();
  } else {
    loginBox.style.display = 'block';
    wallContent.style.display = 'none';
  }
}

async function publishPost() {
  if (!currentUser) { alert('Inicia sesión primero.'); return; }
  const reto  = document.getElementById('wall-reto').value;
  const texto = document.getElementById('wall-texto').value.trim();
  if (!reto)  { alert('Selecciona un reto.'); return; }
  if (!texto) { alert('Escribe tu compromiso.'); return; }
  if (texto.length > 300) { alert('Máximo 300 caracteres.'); return; }

  try {
    await db.collection('commitments').add({
      uid:       currentUser.uid,
      name:      currentUser.displayName || 'Estudiante',
      photoURL:  currentUser.photoURL || '',
      reto,
      texto,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('wall-reto').value = '';
    document.getElementById('wall-texto').value = '';
  } catch(e) { alert('Error al publicar: ' + e.message); }
}

function loadWallPosts() {
  const postsEl = document.getElementById('wallPosts');
  const countEl = document.getElementById('wallCount');
  postsEl.innerHTML = '<div class="wall-empty">⏳ Cargando compromisos...</div>';

  db.collection('commitments')
    .orderBy('timestamp', 'desc')
    .limit(50)
    .onSnapshot(snap => {
      countEl.textContent = snap.size + ' compromiso' + (snap.size !== 1 ? 's' : '') + ' del grupo 💪';
      if (snap.empty) {
        postsEl.innerHTML = '<div class="wall-empty">🌱 Sé el primero en publicar tu compromiso de ahorro.</div>';
        return;
      }
      postsEl.innerHTML = '';
      snap.forEach(doc => {
        const d = doc.data();
        const ts = d.timestamp?.toDate ? d.timestamp.toDate().toLocaleDateString('es-MX', { day:'numeric', month:'short', year:'numeric' }) : 'Reciente';
        const isOwn = currentUser && d.uid === currentUser.uid;
        const div = document.createElement('div');
        div.className = 'wall-post';
        div.innerHTML = `
          <div class="wall-post-header">
            <img class="wall-post-avatar" src="${d.photoURL || 'https://ui-avatars.com/api/?name='+encodeURIComponent(d.name)+'&background=0f766e&color=fff'}" alt="${d.name}">
            <div><div class="wall-post-name">${d.name}</div><div class="wall-post-time">${ts}</div></div>
          </div>
          <span class="wall-post-tag">${d.reto}</span>
          <div class="wall-post-text">${d.texto}</div>
          ${isOwn ? `<button class="wall-post-delete" onclick="deletePost('${doc.id}')">🗑️ Eliminar mi publicación</button>` : ''}`;
        postsEl.appendChild(div);
      });
    }, err => {
      postsEl.innerHTML = '<div class="wall-empty">❌ Error al cargar. Recarga la página.</div>';
      console.error(err);
    });
}

async function deletePost(id) {
  if (!confirm('¿Eliminar tu publicación?')) return;
  await db.collection('commitments').doc(id).delete();
}

// ─── GLOSARIO ────────────────────────────
const GLOSSARY = [
  { t:'Ingreso',           d:'Todo el dinero que recibes: mesada, sueldo, regalos o cualquier otra fuente de dinero.' },
  { t:'Gasto',             d:'Dinero que usas para pagar algo. Puede ser necesario (comida, transporte) u opcional (diversión).' },
  { t:'Presupuesto',       d:'Plan que decides de antemano para organizar cómo vas a usar tu dinero.' },
  { t:'Ahorro',            d:'Parte de tu dinero que guardas para el futuro o para una meta específica.' },
  { t:'Gasto hormiga',     d:'Pequeños gastos frecuentes que parecen insignificantes pero que sumados representan mucho dinero.' },
  { t:'Interés',           d:'Costo de usar dinero prestado (deuda) o ganancia por prestar tu dinero (ahorro).' },
  { t:'Interés compuesto', d:'Interés que se calcula sobre el capital inicial más los intereses ya ganados. ¡Hace crecer el dinero exponencialmente!' },
  { t:'Deuda',             d:'Dinero que debes a alguien y que tienes la obligación de devolver, generalmente con intereses.' },
  { t:'Inversión',         d:'Usar dinero para comprar algo (acciones, negocio) con la esperanza de ganar más dinero en el futuro.' },
  { t:'Liquidez',          d:'Qué tan fácil es convertir un bien en dinero en efectivo. El efectivo es el activo más líquido.' },
  { t:'Fondo de emergencia',d:'Dinero ahorrado específicamente para gastos inesperados como enfermedades o reparaciones urgentes.' },
  { t:'Inflación',         d:'Aumento generalizado de los precios con el tiempo, lo que reduce el poder de compra del dinero.' },
  { t:'Crédito',           d:'Capacidad de obtener dinero prestado con el compromiso de pagarlo después, generalmente con intereses.' },
  { t:'AFORE',             d:'Administradora de Fondos para el Retiro. Guarda y hace crecer el dinero de tu pensión cuando seas mayor.' },
  { t:'CETES',             d:'Certificados de la Tesorería. Una forma segura de invertir dinero en el gobierno de México.' },
  { t:'Regla 50-30-20',    d:'Método de presupuesto: 50% de tus ingresos para necesidades, 30% para deseos y 20% para ahorro.' },
  { t:'Activo',            d:'Algo que tienes y que tiene valor: dinero, propiedades, acciones, etc.' },
  { t:'Pasivo',            d:'Una deuda u obligación financiera que debes pagar.' },
  { t:'Finanzas personales',d:'El manejo del dinero a nivel individual o familiar: presupuesto, ahorro, inversión y control de gastos.' },
  { t:'Saldo',             d:'Diferencia entre ingresos y gastos. Si es positivo, te sobra dinero. Si es negativo, debes más de lo que tienes.' },
];

function renderGlossary(filter = '') {
  const grid = document.getElementById('glossaryGrid');
  const filtered = GLOSSARY.filter(g =>
    g.t.toLowerCase().includes(filter.toLowerCase()) ||
    g.d.toLowerCase().includes(filter.toLowerCase())
  );
  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--slate);text-align:center;padding:20px">No se encontraron resultados para "' + filter + '"</p>';
    return;
  }
  grid.innerHTML = filtered.map(g => `
    <div class="glossary-item">
      <h4>🪙 ${g.t}</h4>
      <p>${g.d}</p>
    </div>`).join('');
}

function filterGlossary(val) { renderGlossary(val); }

// ─── TIP ROTATOR ─────────────────────────
const TIPS = [
  '💡 Separa tu ahorro al inicio de la semana, antes de gastar en cualquier otra cosa.',
  '🐜 Un refresco diario puede costarte hasta $600 al mes. ¡Lleva agua de casa!',
  '📊 Usa la regla 50-30-20: necesidades, deseos y ahorro en proporciones claras.',
  '🎯 Define una meta específica para tu ahorro. Sin meta, el dinero se va solo.',
  '📱 Revisa tus suscripciones digitales. ¿Cuántas realmente usas cada mes?',
  '🛒 Antes de comprar algo, pregúntate: ¿Lo necesito o solo lo quiero ahora?',
  '📅 Registra tus gastos diariamente. Basta con una nota en tu celular.',
  '💪 El mejor momento para empezar a ahorrar fue ayer. El segundo mejor es HOY.',
  '🏦 Un fondo de emergencia te protege de gastos inesperados sin endeudarte.',
  '🌱 Pequeños hábitos constantes crean grandes resultados financieros con el tiempo.',
];
let tipIdx = 0;
let tipInterval = null;

function startTipRotator() {
  if (tipInterval) return;
  showTip();
  tipInterval = setInterval(showTip, 5000);
}

function showTip() {
  const el = document.getElementById('tipText');
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = TIPS[tipIdx % TIPS.length];
    el.style.opacity = '1';
    tipIdx++;
  }, 300);
}
