(() => {
 'use strict';
 const menu=document.querySelector('.nav'),toggle=document.querySelector('.menu-toggle');
 function closeMenu(){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','開啟網站選單');}
 toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'關閉網站選單':'開啟網站選單');});
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){closeMenu();toggle.focus();}});
 const tabs=Array.from(document.querySelectorAll('.tab'));
 function selectTab(id,focus=false){tabs.forEach(t=>{const active=t.dataset.tab===id;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;if(active&&focus)t.focus();});document.querySelectorAll('.tab-panel').forEach(p=>{const active=p.id==='tab-'+id;p.hidden=!active;p.classList.toggle('active',active);});}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(tab.dataset.tab));tab.addEventListener('keydown',e=>{let j=i;if(e.key==='ArrowRight')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft')j=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=tabs.length-1;else return;e.preventDefault();selectTab(tabs[j].dataset.tab,true);});});
 document.querySelectorAll('[data-open-tab]').forEach(b=>b.addEventListener('click',()=>{selectTab(b.dataset.openTab,true);document.querySelector('.tabs').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
 const regions=[['north','北區'],['central','中區'],['south','南區']];
 const data={q1:[[110,90],[85,68],[100,84]],q2:[[120,102],[90,72],[110,95]],q3:[[132,119],[105,89],[123,110]]};
 const period=document.getElementById('report-period'),region=document.getElementById('report-region'),status=document.getElementById('report-status');
 function compute(q,r){const rows=regions.map(([id,name],i)=>({id,name,n:data[q][i][0],s:data[q][i][1]})).filter(x=>r==='all'||x.id===r);const n=rows.reduce((a,b)=>a+b.n,0),s=rows.reduce((a,b)=>a+b.s,0);return{rows,n,s,rate:s/n*100};}
 function showReport(){const q=period.value,r=region.value,current=compute(q,r),previous=compute(q==='q3'?'q2':'q1',r),delta=current.rate-previous.rate;const valid=current.rows.length>0&&current.n>0&&current.rows.every(x=>Number.isInteger(x.n)&&Number.isInteger(x.s)&&x.n>0&&x.s>=0&&x.s<=x.n)&&new Set(current.rows.map(x=>x.id)).size===current.rows.length;if(!valid){status.classList.add('pending');status.textContent='示範資料未通過範圍或唯一性驗證，請檢查資料。';return;}const title='2026 '+q.toUpperCase()+' · '+(r==='all'?'全部區域':regions.find(x=>x[0]===r)[1]);const rate=current.rate.toFixed(1)+'%',signed=(delta>=0?'+':'')+delta.toFixed(1)+' 個百分點';
   status.classList.remove('pending');status.textContent='驗證完成：'+current.rows.length+' 個區域、'+current.n+' 份有效問卷。已核對樣本加總與滿意份數範圍。';
   document.getElementById('report-kpis').innerHTML='<div class="report-stat"><span>有效問卷</span><strong>'+current.n+'</strong><small>份 · 合成資料</small></div><div class="report-stat"><span>滿意比例</span><strong>'+rate+'</strong><small>加權計算</small></div><div class="report-stat"><span>與前季比較</span><strong>'+(delta>=0?'+':'')+delta.toFixed(1)+'</strong><small>個百分點</small></div>';
   document.getElementById('excel-summary').textContent=title+'｜有效問卷 '+current.n+' 份｜滿意比例 '+rate;
   document.querySelector('#excel-table tbody').innerHTML=current.rows.map(x=>'<tr><th scope="row">'+x.name+'</th><td>'+x.n+'</td><td>'+x.s+'</td><td>'+(x.s/x.n*100).toFixed(1)+'%</td></tr>').join('');
   document.querySelector('#excel-table tfoot').innerHTML='<tr><th scope="row">總計</th><td>'+current.n+'</td><td>'+current.s+'</td><td>'+rate+'</td></tr>';
   document.getElementById('slide-context').textContent=title+' / 有效問卷 '+current.n+' 份';
   document.getElementById('slide-insight').innerHTML='<strong>'+rate+'</strong><p>整體滿意比例<br>較前季 <b>'+signed+'</b></p><p>此摘要僅描述合成資料的變化，<br>不推論營運成效或因果關係。</p>';
   document.getElementById('slide-chart').innerHTML=current.rows.map(x=>{const p=x.s/x.n*100;return'<div><div class="slide-bar-label"><span>'+x.name+'</span><b>'+p.toFixed(1)+'%</b></div><div class="slide-bar-track"><i style="width:'+p.toFixed(3)+'%"></i></div></div>';}).join('');
 }
 document.getElementById('report-form').addEventListener('submit',e=>{e.preventDefault();showReport();});
 [period,region].forEach(el=>el.addEventListener('change',()=>{status.classList.add('pending');status.textContent='參數已調整，請按「驗證並預覽報表」更新結果；其他分頁仍顯示上次預覽。';}));
 showReport();
})();
