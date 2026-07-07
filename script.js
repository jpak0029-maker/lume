// ===== Build LED grid =====
(function(){
  const grid = document.getElementById('ledGrid');
  if(grid){
    for(let i=0;i<35;i++){
      const led = document.createElement('i');
      led.style.animationDelay = (Math.random()*2.4).toFixed(2)+'s';
      grid.appendChild(led);
    }
  }
})();

// ===== Scroll reveal =====
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ===== Count-up stats =====
const countIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count; let n = 0;
    const step = Math.max(1, Math.round(target/40));
    const t = setInterval(()=>{ n += step; if(n>=target){n=target;clearInterval(t);} el.textContent = n; },28);
    countIO.unobserve(el);
  });
},{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>countIO.observe(el));

// ===== Sticky buy bar =====
const buybar = document.getElementById('buybar');
const hero = document.querySelector('.hero');
const offer = document.getElementById('offer');
const barIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    // show bar after hero scrolls away, hide when offer card is in view
    if(e.target === hero){ buybar.classList.toggle('show', !e.isIntersecting); }
    if(e.target === offer && e.isIntersecting){ buybar.classList.remove('show'); }
  });
},{threshold:.2});
if(hero) barIO.observe(hero);
if(offer) barIO.observe(offer);

// ===== Cart / modal =====
const modal = document.getElementById('modal');
const PRICE = 79.99;
let qty = 1;
const fmt = n => '$'+n.toFixed(2);

function render(){
  document.getElementById('qtyVal').textContent = qty;
  document.getElementById('linePrice').textContent = fmt(PRICE*qty);
  document.getElementById('subtotal').textContent = fmt(PRICE*qty);
  document.getElementById('total').textContent = fmt(PRICE*qty);
}
function openModal(){ modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }

document.querySelectorAll('[data-buy]').forEach(b=>b.addEventListener('click',()=>{ openModal(); toast(); }));
document.getElementById('navBuy').addEventListener('click',openModal);
document.getElementById('modalClose').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{ if(e.target===modal) closeModal(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });

document.getElementById('qtyPlus').addEventListener('click',()=>{ qty=Math.min(9,qty+1); render(); });
document.getElementById('qtyMinus').addEventListener('click',()=>{ qty=Math.max(1,qty-1); render(); });

// After deploying the "lume checkout" project on Vercel, paste its URL here:
const CHECKOUT_URL = 'https://lumecheckout.com';
document.getElementById('checkout').addEventListener('click',()=>{
  window.location.href = CHECKOUT_URL;
});

// ===== Toast =====
let toastTimer;
function toast(){
  const t = document.getElementById('toast');
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'),1800);
}

render();
