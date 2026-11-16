/* Standalone, deterministic portfolio demos. No network requests or AI calls. */
(() => {
  'use strict';
  const make = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text != null) node.textContent = text; return node; };
  let counter = 0;
  const money = value => new Intl.NumberFormat('zh-TW', {maximumFractionDigits: 0}).format(value);
  const frame = (mount, title, intro) => {
    mount.classList.add('pdemo');
    const top = make('div', 'pdemo-heading');
    const text = make('div'); text.append(make('span', 'pdemo-kicker', 'INTERACTIVE EXPLORATION'), make('h3', '', title));
    top.append(text);
    const body = make('div', 'pdemo-body');
    mount.append(top, make('p', 'pdemo-intro', intro), body);
    return body;
  };
  const field = (label, values, onChange) => {
    const wrap = make('label', 'pdemo-field'); const select = make('select');
    values.forEach(([value, title]) => { const option = make('option', '', title); option.value = value; select.append(option); });
    wrap.append(make('span', '', label), select); select.addEventListener('change', () => onChange(select.value)); return {wrap, select};
  };
  const choiceButtons = (labels, onSelect, label) => {
    const group = make('div', 'pdemo-choices'); group.setAttribute('role', 'group'); group.setAttribute('aria-label', label);
    const buttons = labels.map((text, index) => {
      const button = make('button', '', text); button.type = 'button'; button.setAttribute('aria-pressed', String(index === 0));
      button.addEventListener('click', () => { buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === index))); onSelect(index); });
      group.append(button); return button;
    });
    return group;
  };
  function writing(mount) {
    const body = frame(mount, '同一個任務，選擇適合的語氣', '情境：與合作夥伴協調進度會議。切換語氣，觀察相同資訊如何被整理。');
    const output = make('div', 'pdemo-paper'); output.setAttribute('aria-live', 'polite');
    const samples = [
      ['主旨：本週進度會議調整建議', '您好，\n\n為完成資料驗證與報表檢查，想與您協調將本週進度會議調整至下週三。預計屆時提供完整結果，供會議討論與確認。\n\n若此時段不便，也請告知您的合適時間。謝謝您的理解。'],
      ['主旨：調整本週進度會議', '您好，\n\n想請問本週的進度會議是否方便改至下週三？我正在完成最後的資料驗證，預計屆時可一併分享結果。\n\n謝謝您的協助，期待和您討論！'],
      ['主旨：會議改至下週三', '您好，\n\n因資料驗證仍在進行，建議將本週會議改至下週三，屆時提供完整結果。\n\n再請確認是否方便，謝謝。']
    ];
    const render = i => { output.replaceChildren(make('strong', '', samples[i][0]), make('p', '', samples[i][1])); };
    body.append(choiceButtons(['正式商務', '親切合作', '精簡直接'], render, '選擇郵件語氣'), output, make('p', 'pdemo-footnote', '人工校閱重點：日期、承諾時程、收件對象與機密資訊。'));
    render(0);
  }
  function excel(mount) {
    const body = frame(mount, '換一個篩選，重新檢視數字', '合成銷售資料：比較 7–9 月三個區域的營收、訂單與毛利率。');
    const records = [
      ['北區', '7 月', 120000, 72000, 80], ['北區', '8 月', 150000, 87000, 100], ['北區', '9 月', 180000, 102000, 120],
      ['中區', '7 月', 90000, 58500, 60], ['中區', '8 月', 105000, 67200, 70], ['中區', '9 月', 120000, 74400, 80],
      ['南區', '7 月', 75000, 48750, 50], ['南區', '8 月', 90000, 56700, 60], ['南區', '9 月', 105000, 65100, 70]
    ];
    const metrics = make('div', 'pdemo-metrics');
    const chart = make('div', 'pdemo-chart'); chart.setAttribute('role', 'img');
    const table = make('table', 'pdemo-table');
    const wrap = make('div', 'pdemo-table-wrap'); wrap.append(table);
    const live = make('div', 'pdemo-results'); live.setAttribute('aria-live', 'polite'); live.append(metrics, chart, wrap);
    const render = selected => {
      const rows = records.filter(r => selected === 'all' || r[0] === selected);
      const revenue = rows.reduce((a,r) => a+r[2],0), cost = rows.reduce((a,r) => a+r[3],0), orders = rows.reduce((a,r) => a+r[4],0);
      metrics.replaceChildren();
      [['營收 TWD', money(revenue)], ['訂單數', money(orders)], ['毛利率', ((revenue-cost)/revenue*100).toFixed(1)+'%']].forEach(([label,value]) => { const metric = make('div'); metric.append(make('span','',label), make('strong','',value)); metrics.append(metric); });
      const months = ['7 月','8 月','9 月'].map(month => ({month, revenue: rows.filter(r=>r[1]===month).reduce((a,r)=>a+r[2],0), cost:rows.filter(r=>r[1]===month).reduce((a,r)=>a+r[3],0), orders:rows.filter(r=>r[1]===month).reduce((a,r)=>a+r[4],0)}));
      chart.replaceChildren(); const max = Math.max(...months.map(m=>m.revenue));
      chart.setAttribute('aria-label', months.map(m=>m.month+'營收 '+money(m.revenue)+' 元').join('，'));
      months.forEach(m => { const row=make('div','pdemo-bar-row'); const track=make('div','pdemo-bar-track'); const bar=make('div','pdemo-bar'); bar.style.width=(m.revenue/max*100)+'%'; track.append(bar); row.append(make('span','',m.month),track,make('strong','',money(m.revenue))); chart.append(row); });
      const caption=make('caption','','合成資料彙總（TWD）'); const head=make('thead'); const tr=make('tr'); ['月份','營收','成本','訂單'].forEach(t=>{ const th=make('th','',t); th.scope='col'; tr.append(th); }); head.append(tr); const tbody=make('tbody');
      months.forEach(m=>{ const tr=make('tr'); [m.month,money(m.revenue),money(m.cost),money(m.orders)].forEach(value=>tr.append(make('td','',value))); tbody.append(tr); }); table.replaceChildren(caption,head,tbody);
    };
    const select=field('區域', [['all','全部區域'],['北區','北區'],['中區','中區'],['南區','南區']], render);
    body.append(select.wrap,live,make('p','pdemo-footnote','驗證方式：毛利率 =（營收 − 成本）÷ 營收；月別加總需與 KPI 一致。'));
    render('all');
  }
  function prompts(mount) {
    const body=frame(mount,'把一個規則，套用到多份成果','選擇輸出格式，查看同一組規則如何形成可重複使用的 Skill 與批次任務。');
    const formats={slides:{name:'簡報', ext:'pptx',rule:'每份 5 頁；摘要 → 觀察 → 圖表 → 行動 → 檢核'},docs:{name:'文件',ext:'docx',rule:'每份包含：摘要、關鍵發現、建議與來源'},visuals:{name:'視覺內容',ext:'png',rule:'每份包含：標題、3 個重點與一致的深藍／紫色樣式'}};
    let selected='slides';
    const rule=make('div','pdemo-rule'); const code=make('pre','pdemo-code'); const jobs=make('div','pdemo-jobs'); jobs.setAttribute('aria-live','polite');
    const renderRule=()=>{ const f=formats[selected]; code.textContent='Skill: office-content-batch\n輸入：3 組合成主題 + 統一格式\n規則：'+f.rule+'\n品質關卡：欄位完整 → 數值核對 → 人工審閱'; jobs.replaceChildren(make('p','pdemo-footnote','選擇輸出格式，查看批次內容。')); };
    const format=field('輸出格式',[['slides','PowerPoint 簡報'],['docs','Word 文件'],['visuals','視覺素材']],value=>{selected=value;renderRule();});
    const button=make('button','pdemo-action','預覽 3 筆批次結果'); button.type='button';
    button.addEventListener('click',()=>{
      const f=formats[selected]; jobs.replaceChildren();
      ['銷售週報','新進人員指南','專案進度摘要'].forEach((topic,index)=>{ const item=make('div','pdemo-job'); const info=make('div'); info.append(make('strong','',topic),make('small','',String(index+1).padStart(2,'0')+'_'+topic+'.'+f.ext)); item.append(make('span','pdemo-job-index',String(index+1).padStart(2,'0')),info,make('span','pdemo-job-status','內容預覽')); jobs.append(item); });
    });
    rule.append(code); body.append(format.wrap,rule,button,jobs); renderRule();
  }
  function knowledge(mount) {
    const body=frame(mount,'答案之外，也看得到依據','以虛構的員工手冊為素材，示範提問、摘要與回到原文查核的流程。');
    const entries=[
      {q:'新人第一天要完成什麼？',answer:'完成帳號啟用、資訊安全入門課程，並向直屬主管確認本週目標。',source:'《模擬員工手冊》§ 2.1 到職流程',passage:'到職首日應完成工作帳號啟用與資訊安全入門課程，並與直屬主管確認第一週的工作目標。'},
      {q:'差旅申請需要哪些資訊？',answer:'申請時需填寫出差目的、日期、預估費用與行程，並於出發前取得主管確認。',source:'《模擬員工手冊》§ 4.2 差旅申請',passage:'差旅申請應列明出差目的、起訖日期、行程及預估費用；出發前須完成主管確認。'},
      {q:'可以把客戶資料貼進 AI 嗎？',answer:'依本示範手冊，不得將客戶個資、機密文件或憑證輸入未經核准的外部 AI 工具。',source:'《模擬員工手冊》§ 5.3 資料使用',passage:'客戶個人資料、公司機密文件與系統憑證不得輸入未經核准的外部 AI 工具。使用合成資料進行教學前仍須檢查其內容。'}
    ];
    const buttons=make('div','pdemo-question-list'); const answer=make('div','pdemo-answer'); answer.setAttribute('aria-live','polite');
    const sourceId='pdemo-source-'+(++counter);
    const render=index=>{ const e=entries[index]; Array.from(buttons.children).forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index))); const title=make('strong','','回答'); const p=make('p','',e.answer); const details=make('details','pdemo-source'); details.id=sourceId; const summary=make('summary','','[來源 1] '+e.source); details.append(summary,make('blockquote','',e.passage)); answer.replaceChildren(title,p,details); };
    entries.forEach((e,i)=>{const button=make('button','',e.q);button.type='button';button.setAttribute('aria-pressed',String(i===0));button.addEventListener('click',()=>render(i));buttons.append(button);});
    body.append(buttons,answer);render(0);
  }
  function coding(mount) {
    const body=frame(mount,'讓 AI 參與，讓驗收有依據','示例任務：新增報表期間檢查。依序查看需求、修改、檢查與人工驗收。');
    const stages=[
      {title:'01 · 需求拆解',copy:'先定義可接受的行為，再請 Claude Code／Codex 協助實作。',code:'輸入：報表開始日期、結束日期\n規則：開始日期不可晚於結束日期\n錯誤：顯示清楚訊息並停止輸出\n完成條件：正常期間與錯誤期間皆可驗證'},
      {title:'02 · Agent 修改',copy:'以小範圍差異檢視邏輯，確認沒有帶入不相關的設定或資料。',code:'--- report.py（修改前）\n+++ report.py（示範修改）\n+ if start_date > end_date:\n+     raise ValueError("開始日期不可晚於結束日期")\n  return build_report(start_date, end_date)'},
      {title:'03 · Review & Test',copy:'檢查邊界條件、錯誤訊息與既有流程；測試案例涵蓋以下期間條件。',code:'案例 A：11/01 → 11/30  預期：允許\n案例 B：11/30 → 11/01  預期：阻擋\n案例 C：11/13 → 11/13  預期：允許'},
      {title:'04 · 人工驗收',copy:'由人員確認實際輸出、業務定義與使用情境，再決定是否交付。',code:'□ 使用示範資料執行流程\n□ 比對 Excel 與 PowerPoint 的數值\n□ 確認格式與可編輯性\n□ 檢查敏感資料與錯誤處理\n□ 審閱差異後，保留驗收紀錄'}
    ];
    const output=make('div','pdemo-dev-output'); output.setAttribute('aria-live','polite');
    const render=index=>{ const s=stages[index]; output.replaceChildren(make('strong','',s.title),make('p','',s.copy),make('pre','pdemo-code',s.code)); };
    body.append(choiceButtons(['需求','Agent 修改','Review / Test','人工驗收'],render,'開發流程步驟'),output);render(0);
  }
  const demos={writing,excel,prompts,knowledge,coding};
  function init(){document.querySelectorAll('[data-demo]').forEach(mount=>{if(mount.dataset.demoReady)return; const build=demos[mount.dataset.demo];if(build){mount.dataset.demoReady='true';build(mount);}});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
