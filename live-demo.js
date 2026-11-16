/* Live browser-only portfolio demos. User input is never transmitted. */
(() => {
  'use strict';
  const root = document.getElementById('live-demo-root');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  const format = new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 });
  root.innerHTML = `
    <div class="ld-shell">
      <div class="ld-topline"><span class="ld-live"><i aria-hidden="true"></i>作品體驗</span><span class="ld-badge">合成資料</span></div>
      <div class="ld-tabs" role="tablist" aria-label="選擇互動作品">
        <button type="button" id="ld-tab-email" role="tab" aria-selected="true" aria-controls="ld-panel-email" data-ld-tab="email"><span>01</span> 商務郵件</button>
        <button type="button" id="ld-tab-sales" role="tab" aria-selected="false" aria-controls="ld-panel-sales" data-ld-tab="sales" tabindex="-1"><span>02</span> 數據分析</button>
        <button type="button" id="ld-tab-batch" role="tab" aria-selected="false" aria-controls="ld-panel-batch" data-ld-tab="batch" tabindex="-1"><span>03</span> 批量生成</button>
      </div>
      <section class="ld-panel" id="ld-panel-email" role="tabpanel" aria-labelledby="ld-tab-email">
        <div class="ld-layout">
          <form id="ld-email-form" class="ld-inputs">
            <span class="ld-kicker">INPUT / 輸入任務</span><h3>改幾個字，看到不同的回覆。</h3>
            <label for="ld-recipient">收件對象 <span>必填</span></label><input id="ld-recipient" maxlength="40" value="合作夥伴" required autocomplete="off">
            <label for="ld-purpose">溝通目的 <span>必填，最多 400 字</span></label><textarea id="ld-purpose" rows="4" maxlength="400" required>協調將本週進度會議改至下週三，預計於會議前提供驗證完成的報表。</textarea>
            <label for="ld-tone">文字語氣</label><select id="ld-tone"><option value="formal">正式商務</option><option value="friendly">親切合作</option><option value="concise">精簡直接</option></select>
          </form>
          <div class="ld-output"><div class="ld-output-head"><span class="ld-kicker">OUTPUT / 即時草稿</span><button type="button" class="ld-text-button" id="ld-copy-email">複製草稿 ↗</button></div><div class="ld-paper"><p class="ld-subject">主旨：工作進度協調</p><textarea id="ld-email-result" readonly rows="10" aria-label="商務郵件即時草稿"></textarea></div><p id="ld-email-status" class="ld-status" role="status" aria-live="polite">草稿已就緒。</p><div class="ld-review"><strong>人工校閱</strong><span>確認日期、承諾時程與收件對象後再使用。</span></div></div>
        </div>
      </section>
      <section class="ld-panel" id="ld-panel-sales" role="tabpanel" aria-labelledby="ld-tab-sales" hidden>
        <div class="ld-layout ld-sales-layout"><div class="ld-inputs"><div class="ld-title-line"><div><span class="ld-kicker">INPUT / 合成銷售資料</span><h3>直接改數字，看 KPI 跟著變。</h3></div><button type="button" class="ld-text-button" id="ld-reset-sales">重設範例 ↺</button></div><p class="ld-input-note">編輯營收、成本與訂單，結果會立即重算。金額單位：TWD。</p><div class="ld-table-scroll"><table class="ld-edit-table"><caption class="ld-sr-only">三個區域的合成銷售資料，可編輯數值</caption><thead><tr><th scope="col">區域</th><th scope="col">營收</th><th scope="col">成本</th><th scope="col">訂單</th></tr></thead><tbody id="ld-sales-inputs"></tbody></table></div><p id="ld-sales-status" class="ld-status" role="status" aria-live="polite"></p><div class="ld-formula"><strong>看懂計算</strong><code>毛利率 =（營收 − 成本）÷ 營收</code><code>平均訂單金額 = 營收 ÷ 訂單數</code></div></div><div class="ld-output"><span class="ld-kicker">OUTPUT / 即時計算結果</span><div id="ld-sales-metrics" class="ld-kpis" aria-live="polite"></div><div class="ld-chart-title">各區營收 <span>TWD · 合成資料</span></div><div id="ld-sales-chart" class="ld-bars" role="img" aria-label="各區營收比較"></div></div></div>
      </section>
      <section class="ld-panel" id="ld-panel-batch" role="tabpanel" aria-labelledby="ld-tab-batch" hidden>
        <div class="ld-layout"><form id="ld-batch-form" class="ld-inputs"><span class="ld-kicker">PROMPT → SKILL → BATCH</span><h3>把相同規則，套用到不同主題。</h3><label for="ld-topics">產製主題 <span>每行一個，最多 3 個</span></label><textarea id="ld-topics" rows="4" maxlength="300" required>銷售週報\n新人工作指南\n專案進度摘要</textarea><label for="ld-format">輸出結構</label><select id="ld-format"><option value="slides">簡報大綱</option><option value="document">文件摘要</option><option value="visual">視覺文案</option></select><div class="ld-skill-rule"><strong>Reusable Skill / 共用規則</strong><p id="ld-skill-rule"></p><span>共用規則 → 批次產出 → 品質檢核</span></div><button class="ld-primary" type="submit">生成批次預覽 <span aria-hidden="true">→</span></button></form><div class="ld-output"><div class="ld-output-head"><span class="ld-kicker">OUTPUT / 可下載成果</span><button type="button" class="ld-text-button" id="ld-download-batch">下載 Markdown ↓</button></div><div id="ld-batch-results" class="ld-batch-results"></div><p id="ld-batch-status" class="ld-status" role="status" aria-live="polite"></p></div></div>
      </section>
      <div class="ld-bottom"><div class="ld-shortcuts"><a href="#project-04">文件問答 ↗</a><a href="#enterprise">Excel / PowerPoint ↗</a><a href="#project-06">Claude Code × Codex ↗</a></div></div>
    </div>`;

  const $ = selector => root.querySelector(selector);
  const tabs = Array.from(root.querySelectorAll('[data-ld-tab]'));
  const choose = (name, focus) => {
    tabs.forEach(tab => { const selected = tab.dataset.ldTab === name; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; if (focus && selected) tab.focus(); });
    root.querySelectorAll('.ld-panel').forEach(panel => { panel.hidden = panel.id !== 'ld-panel-' + name; });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => choose(tab.dataset.ldTab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); choose(tabs[next].dataset.ldTab, true);
    });
  });

  document.querySelectorAll('[data-launch-demo]').forEach(link => link.addEventListener('click', () => choose(link.dataset.launchDemo, false)));

  const emailForm = $('#ld-email-form');
  const emailResult = $('#ld-email-result');
  const emailStatus = $('#ld-email-status');
  const compose = () => {
    const recipient = $('#ld-recipient').value.trim();
    const purpose = $('#ld-purpose').value.trim();
    const valid = !!recipient && !!purpose;
    $('#ld-recipient').setAttribute('aria-invalid', String(!recipient));
    $('#ld-purpose').setAttribute('aria-invalid', String(!purpose));
    $('#ld-copy-email').disabled = !valid;
    if (!valid) { emailResult.value = ''; emailStatus.textContent = '請填寫收件對象與溝通目的。'; return; }
    const tone = $('#ld-tone').value;
    const drafts = {
      formal: `${recipient} 您好：\n\n想與您協調以下事項：\n${purpose}\n\n敬請確認上述安排是否合適；如有其他建議，也請告知。\n\n感謝您的協助。`,
      friendly: `${recipient} 您好，\n\n想和您討論一下：\n${purpose}\n\n再麻煩您看看這樣的安排是否方便，也歡迎提出建議。\n\n謝謝您的幫忙！`,
      concise: `${recipient} 您好，\n\n${purpose}\n\n再請確認是否方便，謝謝。`
    };
    emailResult.value = drafts[tone];
    emailStatus.textContent = '草稿已更新。';
  };
  emailForm.addEventListener('submit', event => event.preventDefault());
  emailForm.addEventListener('input', compose); emailForm.addEventListener('change', compose);
  $('#ld-copy-email').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText('主旨：工作進度協調\n\n' + emailResult.value);
      emailStatus.textContent = '草稿已複製。';
    } catch {
      emailResult.focus(); emailResult.select();
      emailStatus.textContent = '瀏覽器未允許自動複製，已選取草稿；請按 Ctrl+C（Mac：⌘C）複製。';
    }
  });
  compose();

  const seed = [ ['北區', 450000, 261000, 300], ['中區', 315000, 200100, 210], ['南區', 270000, 170550, 180] ];
  const salesRows = $('#ld-sales-inputs');
  seed.forEach((row, index) => {
    const tr = document.createElement('tr'); const name = document.createElement('th'); name.scope = 'row'; name.textContent = row[0]; tr.append(name);
    ['營收', '成本', '訂單'].forEach((label, field) => {
      const td = document.createElement('td'); const input = document.createElement('input');
      input.id = `ld-sale-${index}-${field}`; input.type = 'number'; input.min = '0'; input.max = field === 2 ? '1000000000' : '1000000000000'; input.step = '1'; input.value = row[field + 1]; input.setAttribute('aria-label', row[0] + label); input.required = true; td.append(input); tr.append(td);
    }); salesRows.append(tr);
  });
  const calculate = () => {
    let valid = true;
    const rows = seed.map((row, index) => {
      const values = [0,1,2].map(field => {
        const input = $(`#ld-sale-${index}-${field}`); const value = Number(input.value);
        const ok = input.value.trim() !== '' && Number.isFinite(value) && value >= 0 && value <= Number(input.max) && Number.isInteger(value);
        input.setAttribute('aria-invalid', String(!ok)); if (!ok) valid = false; return value;
      }); return { name: row[0], revenue: values[0], cost: values[1], orders: values[2] };
    });
    const metrics = $('#ld-sales-metrics'), chart = $('#ld-sales-chart');
    if (!valid) { $('#ld-sales-status').textContent = '請輸入範圍內的非負整數；金額上限 1 兆元，訂單上限 10 億筆。'; metrics.replaceChildren(); chart.replaceChildren(); chart.setAttribute('aria-label','資料尚未通過檢查'); return; }
    const revenue = rows.reduce((total,row) => total + row.revenue,0), cost = rows.reduce((total,row) => total + row.cost,0), orders = rows.reduce((total,row) => total + row.orders,0);
    metrics.replaceChildren();
    [['總營收', format.format(revenue), 'TWD'], ['毛利率', revenue ? ((revenue-cost)/revenue*100).toFixed(1)+'%' : '—', revenue ? '依總額加權計算' : '營收為 0，無法計算'], ['訂單數', format.format(orders), '筆'], ['平均訂單金額', orders ? format.format(revenue/orders) : '—', orders ? 'TWD / 筆' : '訂單為 0，無法計算']].forEach(([title,value,note]) => {
      const item = document.createElement('div'); const span = document.createElement('span'); span.textContent = title; const strong = document.createElement('strong'); strong.textContent = value; const small = document.createElement('small'); small.textContent = note; item.append(span,strong,small); metrics.append(item);
    });
    chart.replaceChildren(); const max = Math.max(...rows.map(row=>row.revenue),1);
    rows.forEach(row => { const item=document.createElement('div'); item.className='ld-bar-row'; const label=document.createElement('span'); label.textContent=row.name; const track=document.createElement('div'); track.className='ld-bar-track'; const bar=document.createElement('i'); bar.style.width=(row.revenue/max*100)+'%';track.append(bar);const number=document.createElement('strong');number.textContent=format.format(row.revenue);item.append(label,track,number);chart.append(item); });
    chart.setAttribute('aria-label', rows.map(row=>row.name+'營收 '+format.format(row.revenue)+' 元').join('，'));
    $('#ld-sales-status').textContent = '已依目前輸入重算。' + (cost > revenue ? '目前成本高於營收，毛利率為負值。' : '修改任一數值，即可再次比較。');
  };
  salesRows.addEventListener('input', calculate);
  $('#ld-reset-sales').addEventListener('click', () => { seed.forEach((row,index)=>[0,1,2].forEach(field=>{$(`#ld-sale-${index}-${field}`).value=row[field+1];})); calculate(); });
  calculate();

  const structures = {
    slides: { name:'簡報大綱',rule:'每個主題 5 頁：目標 → 情境 → 觀察 → 行動 → 檢核', sections: ['目標：明確說明本次溝通要達成的結果。','情境：列出受眾、資料範圍與已知限制。','觀察：填入經查證的關鍵資訊，不自行補造數字。','行動：整理負責人、下一步與預定時程。','檢核：確認來源、數字、版面與敏感資訊。']},
    document: { name:'文件摘要',rule:'每份固定 4 段：摘要 → 關鍵資訊 → 下一步 → 來源檢核', sections:['摘要：用 2–3 句交代主題與目的。','關鍵資訊：填入已確認的事實、資料與工作限制。','下一步：列出具體行動、負責人與預定時程。','來源檢核：逐項確認資訊依據，標示尚待確認的內容。']},
    visual: { name:'視覺文案',rule:'每份固定 4 欄：主標 → 副標 → 3 個重點 → 行動提示', sections:['主標：用一句話傳達主題的核心價值。','副標：補充受眾情境與實際用途。','3 個重點：以平行句型整理三項已驗證資訊。','行動提示：說明讀者接下來可以做什麼。']}
  };
  let downloadText = '';
  const rule = () => { $('#ld-skill-rule').textContent = structures[$('#ld-format').value].rule; };
  const generateBatch = event => {
    if (event) event.preventDefault();
    const topics = $('#ld-topics').value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    const valid = topics.length > 0 && topics.length <= 3;
    $('#ld-topics').setAttribute('aria-invalid',String(!valid));
    if (!valid) { $('#ld-batch-status').textContent='請填寫 1–3 個主題，每行一個。先前預覽已清除。'; $('#ld-batch-results').replaceChildren(); $('#ld-download-batch').disabled=true; downloadText=''; return; }
    const structure = structures[$('#ld-format').value];
    const output = $('#ld-batch-results'); output.replaceChildren();
    const chunks = ['# 批次內容大綱\n\n## 共用 Skill 規則\n'+structure.rule];
    topics.forEach((topic,index) => {
      const article=document.createElement('article'); article.className='ld-batch-item';const topline=document.createElement('div');topline.className='ld-batch-top';const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');const title=document.createElement('h4');title.textContent=topic;const badge=document.createElement('small');badge.textContent=structure.name+' / 待填寫';topline.append(number,title,badge);
      const list=document.createElement('ol');structure.sections.forEach(text=>{const li=document.createElement('li');li.textContent=text;list.append(li);});article.append(topline,list);output.append(article);
      chunks.push('## '+(index+1)+'. '+topic+'｜'+structure.name+'\n\n'+structure.sections.map((text,i)=>(i+1)+'. '+text).join('\n'));
    });
    chunks.push('---\n人工驗收：資訊來源、數值、日期、受眾與敏感內容均須自行確認。');
    downloadText=chunks.join('\n\n');$('#ld-download-batch').disabled=false;
    $('#ld-batch-status').textContent='已建立 '+topics.length+' 份大綱，可下載 Markdown。';
  };
  $('#ld-format').addEventListener('change',()=>{rule();$('#ld-batch-status').textContent='輸出規則已更新；按「生成批次預覽」套用目前設定。';$('#ld-download-batch').disabled=true;});
  $('#ld-topics').addEventListener('input',()=>{$('#ld-batch-status').textContent='主題已更新；按「生成批次預覽」更新結果。';$('#ld-download-batch').disabled=true;});
  $('#ld-batch-form').addEventListener('submit',generateBatch);
  $('#ld-download-batch').addEventListener('click',()=>{
    if(!downloadText)return;
    const blob=new Blob(['\uFEFF'+downloadText],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='AI_Portfolio_Batch_Demo.md';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
    $('#ld-batch-status').textContent='Markdown 已建立。';
  });
  rule();generateBatch();
})();
