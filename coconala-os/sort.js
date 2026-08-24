// 優先順位: 3,000円相談を最優先。その中で新規→期限→対応状況→新しい順。
function daysUntilDue(c){
  if(!c.due_date) return Infinity;
  const today=new Date(); today.setHours(0,0,0,0);
  const due=new Date(c.due_date+'T00:00:00');
  return Math.floor((due-today)/86400000);
}
function priorityRank(c){
  if(c.status==='完了') return 900;
  const consult=c.case_type==='3,000円相談';
  const d=daysUntilDue(c);
  if(consult){
    if(c.status==='相談受付') return 0;
    if(d<0) return 1;
    if(d===0) return 2;
    if(d<=2) return 3;
    if(['要件整理','見積提示','修正','納品待ち'].includes(c.status)) return 4;
    return 5;
  }
  if(d<0) return 20;
  if(d===0) return 21;
  if(d<=2) return 22;
  if(['修正','納品待ち'].includes(c.status)) return 23;
  if(['開発中','テスト','購入済'].includes(c.status)) return 24;
  return 30;
}
function sortCasesForAction(list){
  return [...list].sort((a,b)=>{
    const ra=priorityRank(a), rb=priorityRank(b);
    if(ra!==rb) return ra-rb;
    const da=daysUntilDue(a), db=daysUntilDue(b);
    if(da!==db) return da-db;
    const ta=Date.parse(a.updated_at||a.created_at||a.last_contact_date||0)||0;
    const tb=Date.parse(b.updated_at||b.created_at||b.last_contact_date||0)||0;
    return tb-ta;
  });
}
function priorityLabel(c){
  if(c.status==='完了') return '完了';
  if(c.case_type==='3,000円相談'&&c.status==='相談受付') return '🆕 最優先';
  const d=daysUntilDue(c);
  if(d<0) return '🚨 期限超過';
  if(d===0) return '🔥 今日';
  if(d<=2) return '⚡ 期限近';
  if(c.case_type==='3,000円相談') return '💴 相談優先';
  return '通常';
}
function dueText(c){
  if(!c.due_date) return '—';
  const d=daysUntilDue(c);
  if(d<0) return `${c.due_date} (${Math.abs(d)}日超過)`;
  if(d===0) return `${c.due_date} (今日)`;
  if(d===1) return `${c.due_date} (明日)`;
  return `${c.due_date} (${d}日)`;
}
render=function(){
  const st=$('filterStatus').value;
  const q=$('search').value.trim().toLowerCase();
  const filtered=cases.filter(c=>(!st||c.status===st)&&(!q||(`${c.customer} ${c.title} ${c.next_action||''}`).toLowerCase().includes(q)));
  const list=sortCasesForAction(filtered);
  const wrap=$('caseList');
  wrap.innerHTML='';
  if(!list.length){
    wrap.innerHTML='<div class="empty">案件はまだありません。</div>';
  }else{
    const table=document.createElement('table');
    table.className='case-table';
    table.innerHTML='<thead><tr><th>優先</th><th>顧客</th><th>案件</th><th>状態</th><th>次にやる</th><th>納期</th><th>金額</th><th></th></tr></thead><tbody></tbody>';
    const tbody=table.querySelector('tbody');
    list.forEach(c=>{
      const tr=document.createElement('tr');
      if(c.case_type==='3,000円相談') tr.classList.add('consult-row');
      if(c.status==='相談受付') tr.classList.add('new-row');
      if(c.status==='完了') tr.classList.add('done-row');
      tr.innerHTML=`
        <td data-label="優先"><span class="priority-pill p${priorityRank(c)}">${priorityLabel(c)}</span></td>
        <td data-label="顧客">${escapeHtml(c.customer)}</td>
        <td data-label="案件"><strong>${escapeHtml(c.title)}</strong><div class="row-sub">${escapeHtml(c.case_type)}</div></td>
        <td data-label="状態"><span class="badge">${escapeHtml(c.status)}</span></td>
        <td data-label="次にやる">${escapeHtml(c.next_action||'未設定')}</td>
        <td data-label="納期">${escapeHtml(dueText(c))}</td>
        <td data-label="金額" class="num"><strong>${yen(c.amount)}</strong><div class="row-sub">手取 ${yen(net(c))}</div></td>
        <td class="open-cell"><button data-id="${c.id}" class="editBtn">開く</button></td>`;
      tbody.appendChild(tr);
    });
    wrap.appendChild(table);
  }
  const active=cases.filter(c=>c.status!=='完了');
  const consults=active.filter(c=>c.case_type==='3,000円相談');
  $('kActive').textContent=active.length;
  $('kConsult').textContent=consults.length;
  $('kSales').textContent=yen(active.reduce((s,c)=>s+Number(c.amount||0),0));
  $('kNet').textContent=yen(active.reduce((s,c)=>s+net(c),0));
  document.querySelectorAll('.editBtn').forEach(b=>b.onclick=()=>openEdit(b.dataset.id));
};
