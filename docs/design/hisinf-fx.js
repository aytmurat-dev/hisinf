(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function reveal(root){
    if(!root||reduce||!('IntersectionObserver' in window))return;
    const els=[...root.querySelectorAll('[data-reveal]')];
    const io=new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting){const el=e.target,d=+(el.dataset.reveal||0);
        el.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'none'}],{duration:700,delay:d,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});
        io.unobserve(el);}
    }),{threshold:.12});
    els.forEach(el=>io.observe(el));
  }
  const NIB="url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><g transform='rotate(45 14 14)'><path d='M14 1 L19 9 L19 19 L14 27 L9 19 L9 9 Z' fill='%232b2118' stroke='%23f5efe3' stroke-width='1.6' stroke-linejoin='round'/><path d='M14 1 L19 9 L19 19 L14 27 L9 19 L9 9 Z' fill='none' stroke='%232b2118' stroke-width='1' stroke-linejoin='round'/><line x1='14' y1='15' x2='14' y2='26' stroke='%23f5efe3' stroke-width='1'/><circle cx='14' cy='13' r='1.6' fill='%23f5efe3'/></g></svg>\") 4 24, auto";
  const NIB_HOT="url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><g transform='rotate(45 14 14)'><path d='M14 1 L19 9 L19 19 L14 27 L9 19 L9 9 Z' fill='%238c2f1b' stroke='%23f5efe3' stroke-width='1.6' stroke-linejoin='round'/><path d='M14 1 L19 9 L19 19 L14 27 L9 19 L9 9 Z' fill='none' stroke='%232b2118' stroke-width='1' stroke-linejoin='round'/><line x1='14' y1='15' x2='14' y2='26' stroke='%23f5efe3' stroke-width='1'/><circle cx='14' cy='13' r='1.6' fill='%23f5efe3'/></g></svg>\") 4 24, pointer";
  function cursor(root){
    if(!root||matchMedia('(hover: none)').matches||root.__cur)return;root.__cur=1;
    root.style.position=root.style.position||'relative';
    root.style.cursor=NIB;
    root.addEventListener('mouseover',e=>{const h=e.target.closest&&e.target.closest('a,button,select,label,[data-hot]');if(h&&!h.__nib){h.__nib=1;h.style.cursor=NIB_HOT;}});
    if(reduce)return;
    root.addEventListener('mousedown',e=>{
      if(e.target.closest('input,textarea'))return;
      const r=root.getBoundingClientRect(),s=r.width/root.offsetWidth||1;
      const x=(e.clientX-r.left)/s,y=(e.clientY-r.top)/s;
      const d=document.createElement('span');
      d.style.cssText='position:absolute;left:'+x+'px;top:'+y+'px;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;border:1.5px solid var(--primary);pointer-events:none;z-index:999';
      root.appendChild(d);
      d.animate([{transform:'scale(.4)',opacity:.9},{transform:'scale(3.2)',opacity:0}],{duration:520,easing:'cubic-bezier(.2,.7,.2,1)'}).onfinish=()=>d.remove();
    });
  }
  function tilt(root){
    if(!root||reduce)return;
    root.querySelectorAll('[data-tilt]').forEach(el=>{
      el.style.transition='transform .35s cubic-bezier(.2,.7,.2,1)';
      el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-3px)`;});
      el.addEventListener('mouseleave',()=>{el.style.transform='none';});
    });
  }
  function curl(root){
    if(!root)return;
    root.querySelectorAll('[data-curl]').forEach(el=>{
      if(el.__curl)return;el.__curl=1;
      if(getComputedStyle(el).position==='static')el.style.position='relative';
      const f=document.createElement('span');
      f.style.cssText='position:absolute;right:-1px;top:-1px;width:0;height:0;pointer-events:none;background:linear-gradient(225deg,var(--bg) 50%,var(--surface-2) 50%);box-shadow:-3px 3px 6px var(--shadow);transition:width .45s cubic-bezier(.2,.7,.2,1),height .45s cubic-bezier(.2,.7,.2,1);z-index:2';
      el.appendChild(f);
      el.addEventListener('mouseenter',()=>{f.style.width=f.style.height='46px';});
      el.addEventListener('mouseleave',()=>{f.style.width=f.style.height='0';});
    });
  }
  function draw(root){
    if(!root||reduce)return;
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.transition='stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1)';e.target.style.strokeDashoffset=0;io.unobserve(e.target);}}),{threshold:.2});
    root.querySelectorAll('[data-draw]').forEach(p=>{const L=p.getTotalLength?p.getTotalLength():1000;p.style.strokeDasharray=L;p.style.strokeDashoffset=L;io.observe(p);});
  }
  function all(root){reveal(root);cursor(root);tilt(root);curl(root);draw(root);}
  window.HFX={reveal,cursor,tilt,curl,draw,all,
    run(root,tries=0){if(window.HFX&&root)return all(root);if(tries<20)setTimeout(()=>window.HFX.run(root,tries+1),100);}};
})();
