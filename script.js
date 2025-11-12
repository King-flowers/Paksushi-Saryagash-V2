/* ===== ДАННЫЕ (можно заменить на реальные позже) ===== */
const DATA = {
  sets: [
    {name:'Сет "Бинго"', desc:'Много суши, пицца, крылышки, фри', price:15500, img:'images/Set-Bingo.jpg', tags:['sushi-heavy']},
    {name:'Сет "Старт"', desc:'12 роллов, 2 пиццы, фирменный соус', price:13200, img:'images/Set-Start.jpg', tags:['sushi-heavy','balanced']},
    {name:'Сет "Олигарх"', desc:'Пицца, наггетсы, роллы, напиток', price:11200, img:'images/Set-Oligarh.jpg', tags:['pizza-heavy','balanced']},
    {name:'Сет "Антарктида"', desc:'Суши, крылышки, ножки, пицца', price:9800, img:'images/Set-Antarktida.jpg', tags:['balanced']},
    {name:'Сет "Студент"', desc:'Супер роллы, пицца, картошка фри', price:12700, img:'images/Set-Student.jpg', tags:['sushi-heavy']},
    {name:'Сет "Техас"', desc:'Острые роллы, пицца, чай', price:9500, img:'images/Set-Texas.jpg', tags:['spicy']}
  ],
  sushi: [
    {name:'Филадельфия', price:2500, img:'images/Filadelfia.jpg'},
    {name:'Калифорния', price:2300, img:'images/Kalifornia.jpg'},
    {name:'Унаги', price:2700, img:'images/Unagi.jpg'},
    {name:'Сяке Маки', price:2200, img:'images/Syake-maki.jpg'},
    {name:'Спайси Ролл', price:2600, img:'images/Spaicy-roll.jpg'},
    {name:'Темпура', price:2800, img:'images/Tempura.jpg'}
  ],
  pizza: [
    {name:'Пепперони', price:3200, img:'images/Pepperoni.jpg'},
    {name:'Маргарита', price:3000, img:'images/Margarita.jpg'},
    {name:'BBQ Чикен', price:3500, img:'images/BBQ-chiken.jpg'},
    {name:'Мясная', price:3600, img:'images/Myasnaya.jpg'}
  ],
  snacks: [
    {name:'Наггетсы', price:1500, img:'images/Nagetsi.jpg'},
    {name:'Крылышки', price:1800, img:'images/Krilishki.jpg'},
    {name:'Ножки куриные', price:2000, img:'images/Nozhki.jpg'},
    {name:'Картошка фри', price:900, img:'images/Kortoshka-fri.jpg'}
  ],
  drinks: [
    {name:'Coca‑Cola 0.5L', price:600, img:'images/cola.jpg'},
    {name:'Fanta 0.5L', price:600, img:'images/fanta.jpg'},
    {name:'Зелёный чай', price:800, img:'images/tea.jpg'},
    {name:'Минералка', price:500, img:'images/water.jpg'}
  ]
};

const WA_NUMBER = "77788745750"; // +7 778 874 5750
function kzt(n){ return new Intl.NumberFormat('ru-RU').format(n) + " ₸"; }

/* ===== Рендер карточек ===== */
function makeCard(item, kind){
  const wrap = document.createElement('div');
  wrap.className = 'card';

  const img = document.createElement('img');
  img.className = 'img';
  img.src = item.img || 'images/placeholder.jpg';
  img.alt = item.name || 'Блюдо';
  wrap.appendChild(img);

  const price = document.createElement('div');
  price.className = 'price';
  price.textContent = kzt(item.price);
  wrap.appendChild(price);

  const info = document.createElement('div');
  info.className = 'info';

  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = item.name;
  info.appendChild(title);

  if(item.desc){
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = item.desc;
    info.appendChild(desc);
  }

  const actions = document.createElement('div');
  actions.className = 'actions';

  const btn = document.createElement('button');
  const isSet = (kind === 'sets');
  btn.className = 'btn';
  btn.textContent = isSet ? `Заказать сет «${item.name.replace(/^Сет\s+/,'')}»` : `Заказать «${item.name}»`;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const text = isSet
      ? `Здравствуйте, я хочу заказать сет "${item.name.replace(/^Сет\s+/,'')}"`
      : `Здравствуйте, хочу заказать "${item.name}"`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });
  actions.appendChild(btn);
  info.appendChild(actions);

  wrap.appendChild(info);

  // Открытие модалки по клику на карточку (кроме кнопки)
  wrap.addEventListener('click', () => openModal(item, isSet));

  return wrap;
}

function renderList(key, rootId, items){
  const root = document.getElementById(rootId);
  root.innerHTML = '';
  items.forEach(item => root.appendChild(makeCard(item, key)));
}

function renderAll(){
  renderList('sets','sets-list', getFilteredSets());
  renderList('sushi','sushi-list', DATA.sushi);
  renderList('pizza','pizza-list', DATA.pizza);
  renderList('snacks','snacks-list', DATA.snacks);
  renderList('drinks','drinks-list', DATA.drinks);
}

/* ===== Поиск и фильтры сетов ===== */
const activeTags = new Set();
const searchInput = document.getElementById('set-search');
const clearBtn = document.getElementById('search-clear');
const chipsRoot = document.getElementById('chips');

chipsRoot.addEventListener('click', (e) => {
  if(e.target.classList.contains('chip')){
    const tag = e.target.dataset.tag;
    if(activeTags.has(tag)){
      activeTags.delete(tag);
      e.target.classList.remove('active');
    }else{
      activeTags.add(tag);
      e.target.classList.add('active');
    }
    renderAll();
  }
});

searchInput.addEventListener('input', () => renderAll());
clearBtn.addEventListener('click', () => { searchInput.value=''; renderAll(); });

function getFilteredSets(){
  const q = (searchInput.value || '').trim().toLowerCase();
  return DATA.sets.filter(item => {
    // поиск по названию/описанию
    const text = (item.name + ' ' + (item.desc || '')).toLowerCase();
    const matchQ = q === '' || text.includes(q);
    // теги
    const matchTags = activeTags.size === 0 || (item.tags || []).some(t => activeTags.has(t));
    return matchQ && matchTags;
  });
}

/* ===== Модальное окно ===== */
const modal = document.getElementById('modal');
const mImg = document.getElementById('m-img');
const mTitle = document.getElementById('m-title');
const mDesc = document.getElementById('m-desc');
const mOrder = document.getElementById('m-order');
const mClose = document.getElementById('modal-close');

function openModal(item, isSet){
  mImg.src = item.img || 'images/placeholder.jpg';
  mTitle.textContent = item.name;
  mDesc.textContent = item.desc || '';
  mOrder.onclick = () => {
    const text = isSet
      ? `Здравствуйте, я хочу заказать сет "${item.name.replace(/^Сет\s+/,'')}"`
      : `Здравствуйте, хочу заказать "${item.name}"`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
}

mClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

/* ===== Старт ===== */
renderAll();
