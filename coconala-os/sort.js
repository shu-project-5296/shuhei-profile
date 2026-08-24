// 優先順位: 新規相談 > 期限超過/本日 > 期限間近 > 対応待ち重要ステータス > その他 > 完了
function priorityRank(c){
  if(c.status==='完了') return 99;
  if(c.status==='相談受付') return 0;
  if(c.due_date){
    const today=new Date(); today.setHours(0,0,0,0);
    const due=new Date(c.due_date+'T00:00:00');
    const days=Math.floor((due-today)/86400000);
    if(days<0) return 1;
    if(days===0) return 2;
    if(days<=2) return 3;
  }
  if(['修正','納品待ち','要件整理','見積提示'].includes(c.status)) return 4;
  if(c.due_date){
    const today=new Date(); today.setHours(0,0,0,0);
    const due=new Date(c.due_date+'T00:00:00');
    const days=Math.floor((due-today)/86400000);
    if(days<=7) return 5;
  }
  return 6;
}
function sortCasesForAction(list){
  return [...list].sort((a,b)=>{
    const ra=priorityRank(a), rb=priorityRank(b);
    if(ra!==rb) return ra-rb;
    if(ra===0){
      const ta=Date.parse(a.created_at||a.last_contact_date||0)||0;
      const tb=Date.parse(b.created_at||b.last_contact_date||0)||0;
      return tb-ta; // 新規の中では一番新しいものを最上段
    }
    const da=a.due_date?Date.parse(a.due_date):Infinity;
    const db=b.due_date?Date.parse(b.due_date):Infinity;
    if(da!==db) return da-db;
    const ta=Date.parse(a.updated_at||a.created_at||a.last_contact_date||0)||0;
    const tb=Date.parse(b.updated_at||b.created_at||b.last_contact_date||0)||0;
    return tb-ta;
  });
}
render=function(){
  const st=$('filterStatus').value;
  const q=$('search').value.trim().toLowerCase();
  const filtered=cases.filter(c=>(!st||c.status===st)&&(!q||(`${c.customer} ${c.title}`).toLowerCase().includes(q)));
  const list=sortCasesForAction(filtered);
  $('caseList').innerHTML='';
  if(!list.length){$('caseList').innerHTML='<div class="empty">案件はまだありません。</div>';}else{
    list.forEach(c=>{
      const rank=priorityRank(c);
      const d=document.createElement('article'); d.className='case';
      const mark=c.status==='相談受付'?'<span class="badge">🆕 新規</span>':(rank<=3?'<span class="badge">⚡ 優先</span>':'');
      d.innerHTML=`<div><h3>${escapeHtml(c.title)}</h3><div class="meta">${mark}<span>${escapeHtml(c.customer)}</span><span class="badge">${escapeHtml(c.status)}</span><span>${escapeHtml(c.case_type)}</span>${c.due_date?`<span>納期 ${escapeHtml(c.due_date)}</span>`:''}</div><div class="next">${c.next_action?'次：'+escapeHtml(c.next_action):'次のアクション未設定'}</div></div><div class="money"><b>${yen(c.amount)}</b><small>手取り ${yen(net(c))}</small><br><button data-id="${c.id}" class="editBtn">開く</button></div>`;
      $('caseList').appendChild(d);
    });
  }
  const active=cases.filter(c=>c.status!=='完了');
  $('kActive').textContent=active.length;
  $('kConsult').textContent=active.filter(c=>c.case_type==='3,000円相談').length;
  $('kSales').textContent=yen(active.reduce((s,c)=>s+Number(c.amount||0),0));
  $('kNet').textContent=yen(active.reduce((s,c)=>s+net(c),0));
  document.querySelectorAll('.editBtn').forEach(b=>b.onclick=()=>openEdit(b.dataset.id));
};
