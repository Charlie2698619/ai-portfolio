(() => {
 'use strict';
 const names={editorial:'暖紙編輯',night:'午夜實驗室',sage:'森林工作室',classic:'經典深藍'};
 const dialog=document.getElementById('theme-dialog');let trigger=null;
 function applyTheme(theme,announce=false){if(!names[theme])return;document.documentElement.dataset.theme=theme;document.querySelectorAll('[data-set-theme]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.setTheme===theme)));document.querySelectorAll('[data-theme-open]').forEach(b=>b.title='目前風格：'+names[theme]);try{localStorage.setItem('charlie-portfolio-theme-v3',theme);}catch{}if(announce)document.getElementById('theme-status').textContent='已套用'+names[theme]+'風格';document.querySelector('meta[name="theme-color"]').content={editorial:'#f7f2e9',night:'#14171a',sage:'#edf2e9',classic:'#14243a'}[theme];}
 let initial='sage';try{const param=new URLSearchParams(location.search).get('theme');const remembered=localStorage.getItem('charlie-portfolio-theme-v3');initial=names[param]?param:(names[remembered]?remembered:initial);}catch{}applyTheme(initial);
 document.querySelectorAll('[data-theme-open]').forEach(b=>b.addEventListener('click',()=>{trigger=b;const menuButton=document.querySelector('.menu-toggle');if(b.closest('.nav')&&menuButton.getAttribute('aria-expanded')==='true'){document.querySelector('.nav').classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','開啟網站選單');trigger=menuButton;}dialog.showModal();}));
 const close=()=>dialog.close();dialog.querySelector('.dialog-close').addEventListener('click',close);
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
 dialog.addEventListener('close',()=>trigger?.focus());
 dialog.querySelectorAll('[data-set-theme]').forEach(b=>b.addEventListener('click',()=>{applyTheme(b.dataset.setTheme,true);close();}));
 // Existing case links also open their small interaction so it is ready on arrival.
 document.querySelectorAll('a[href^="#project-"]').forEach(a=>a.addEventListener('click',()=>{const section=document.getElementById(a.getAttribute('href').slice(1));const detail=section?.querySelector('.interactive-expand');if(detail)detail.open=true;}));
})();
