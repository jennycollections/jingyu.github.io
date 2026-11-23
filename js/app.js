// THE PROGRAM: draws the pages, filters, notes and numbers. You normally do not need to edit this file.
let projects=[], notes=[];   // filled from projects/index.json and notes/index.json in start() at the bottom
let lang="en";
function term(v){return lang==="de"?(TERM_DE[v]||v):v;}
function setLanguage(next){const openId=location.hash.startsWith("#project/")?location.hash.slice(9):null;lang=next;document.documentElement.lang=next;document.getElementById('langEN').classList.toggle('active',next==='en');document.getElementById('langDE').classList.toggle('active',next==='de');const t=I18N[next];const ids={navHome:'home',navAbout:'about',navProjects:'projects',navNotes:'notes',navContact:'contact',heroEyebrow:'hero',heroIntro:'intro',heroProjectsBtn:'explore',heroAboutBtn:'aboutMe',aboutKicker:'about',aboutTitle:'aboutTitle',aboutP1:'about1',aboutP2:'about2',aboutP3:'about3',factEducation:'education',factFocus:'focus',factMethods:'methods',factEducationValue:'eduValue',factFocusValue:'focusValue',factMethodsValue:'methodsValue',projectsKicker:'projectLibrary',projectsTitle:'projectTitle',notesKicker:'notesKicker',notesTitle:'notesTitle',industryLabel:'industry',methodLabel:'method',softwareLabel:'software',clearFiltersBtn:'clear',contactKicker:'contact',contactTitle:'contactTitle',contactText:'contactText',emailBtn:'email',footerText:'footer'};for(const [id,key] of Object.entries(ids)){const el=document.getElementById(id);if(el && t[key] !== undefined)el.innerHTML=t[key];}document.getElementById('heroTitle').innerHTML=t.heroTitle;renderAllFilters();renderProjects();renderNotes();renderStats();renderAbout();if(openId)openProject(openId);if(location.hash.startsWith("#note/"))openNote(decodeURIComponent(location.hash.slice(6)),true);}
function renderNotes(){const list=document.getElementById("notesList"),detail=document.getElementById("noteDetail"),t=I18N[lang];if(!notes.length){list.innerHTML=`<div class="note-empty"><strong>${t.notesEmpty}</strong>${t.notesEmptyHelp}</div>`;detail.classList.remove("open");detail.innerHTML="";return;}const sorted=[...notes].sort((a,b)=>b.date.localeCompare(a.date));list.innerHTML=sorted.map(n=>`<button class="note-card" type="button" onclick="openNote('${n.id}')"><div class="note-date">${escapeHtml(formatNoteDate(n.date))} · ${escapeHtml(n.author||NOTE_AUTHOR)}</div><h3>${escapeHtml(lang==="de"?(n.titleDe||n.title):n.title)}</h3><p>${escapeHtml(lang==="de"?(n.excerptDe||n.excerpt):n.excerpt)}</p></button>`).join("");}
function formatNoteDate(value){return new Intl.DateTimeFormat(lang==="de"?"de-DE":"en-GB",{day:"2-digit",month:"short",year:"numeric"}).format(new Date(value+"T12:00:00"));}
// ===== Optional features: leave empty to switch off =====
let gcReady=false;const gcQueue=[];
if(GOATCOUNTER_CODE){window.goatcounter={no_onload:true,endpoint:`https://${GOATCOUNTER_CODE}.goatcounter.com/count`};const sc=document.createElement("script");sc.async=true;sc.src="https://gc.zgo.at/count.js";sc.onload=()=>{gcReady=true;gcQueue.splice(0).forEach(f=>f());};document.head.appendChild(sc);}
function trackView(path,title){if(!GOATCOUNTER_CODE)return;const go=()=>window.goatcounter.count({path,title});gcReady?go():gcQueue.push(go);}
function loadViews(id){const el=document.getElementById("noteViews");if(!el||!GOATCOUNTER_CODE)return;fetch(`https://${GOATCOUNTER_CODE}.goatcounter.com/counter/${encodeURIComponent("/notes/"+id)}.json`).then(r=>r.json()).then(d=>{el.textContent=`${d.count} ${lang==="de"?"Aufrufe":"views"}`;}).catch(()=>{});}
function loadComments(id){const box=document.getElementById("noteComments");if(!box)return;const g=GISCUS;if(!(g.repo&&g.repoId&&g.category&&g.categoryId)){box.innerHTML=`<div class="comments-placeholder">${lang==="de"?"Hier erscheinen Kommentare, sobald Giscus eingerichtet ist.":"Comments will appear here once Giscus is set up."}</div>`;return;}const c=document.createElement("script");c.src="https://giscus.app/client.js";c.async=true;c.crossOrigin="anonymous";Object.entries({repo:g.repo,"repo-id":g.repoId,category:g.category,"category-id":g.categoryId,mapping:"specific",term:"note-"+id,strict:"1","reactions-enabled":"1","emit-metadata":"0","input-position":"top",theme:"light",lang:lang}).forEach(([k,v])=>c.setAttribute("data-"+k,v));box.innerHTML="";box.appendChild(c);}
function openNote(id,quiet){const n=notes.find(x=>x.id===id);if(!n)return;const t=I18N[lang],d=document.getElementById("noteDetail"),ttl=lang==="de"?(n.titleDe||n.title):n.title,ex=lang==="de"?(n.excerptDe||n.excerpt):n.excerpt,body=lang==="de"?(n.bodyDe||n.body):n.body;
  d.innerHTML=`<button class="detail-back" type="button" onclick="closeNote()">${t.noteBack}</button><h3 class="note-title">${escapeHtml(ttl)}</h3><div class="note-meta"><span>${escapeHtml(formatNoteDate(n.date))}</span><span>${escapeHtml(n.author||NOTE_AUTHOR)}</span><span id="noteViews"></span></div><p class="detail-summary">${escapeHtml(ex)}</p><div class="note-body">${escapeHtml(body)}</div><div class="note-comments" id="noteComments"></div>`;
  document.getElementById("notesList").style.display="none";document.querySelector("#notes .section-head").style.display="none";
  d.classList.add("open");history.replaceState(null,"","#note/"+encodeURIComponent(id));window.scrollTo({top:0,behavior:"auto"});
  if(!quiet){trackView("/notes/"+id,ttl);}loadViews(id);loadComments(id);}
function closeNote(){const d=document.getElementById("noteDetail");d.classList.remove("open");d.innerHTML="";document.getElementById("notesList").style.display="";document.querySelector("#notes .section-head").style.display="";if(location.hash.startsWith("#note/"))history.replaceState(null,"","#notes");}
function openNoteFromHash(){const h=location.hash;if(!h.startsWith("#note/"))return false;const id=decodeURIComponent(h.slice(6));if(!notes.some(x=>x.id===id))return false;showPage("notes");openNote(id);return true;}

const selectedFilters = {industry:new Set(),method:new Set(),software:new Set()};
function allValues(config){return config.groups.flatMap(g=>g.items.length?g.items:[g.name]);}
function groupValues(group){return group.items.length?[group.name,...group.items]:[group.name];}
function isGroupSelected(key,group){const vals=groupValues(group),set=selectedFilters[key];return vals.every(v=>set.has(v));}
function isGroupPartial(key,group){const vals=groupValues(group),set=selectedFilters[key];return vals.some(v=>set.has(v))&&!vals.every(v=>set.has(v));}
function renderFilter(key){
  const config=filterConfig[key],root=config.element;
  const selected=[...selectedFilters[key]];
  const label=selected.length?`${selected.length} selected`:config.allLabel[lang];
  root.innerHTML=`<button class="filter-trigger" type="button" aria-expanded="${root.classList.contains('open')}" onclick="toggleFilterMenu('${key}')"><span class="filter-selection">${escapeHtml(label)}</span><span aria-hidden="true">⌄</span></button><div class="filter-menu">${config.groups.map((g,i)=>{
    const vals=groupValues(g),checked=isGroupSelected(key,g),partial=isGroupPartial(key,g),expanded=root.querySelector(`[data-group="${key}-${i}"]`)?.classList.contains('expanded')||false;
    return `<div class="filter-group ${expanded?'expanded':''}" data-group="${key}-${i}"><div class="filter-parent"><input type="checkbox" id="${key}-parent-${i}" ${checked?'checked':''} ${partial?'data-partial="true"':''} onchange="toggleFilterGroup('${key}',${i},this.checked)"><label for="${key}-parent-${i}">${escapeHtml(term(g.name))}</label>${g.items.length?`<button class="filter-expand" type="button" aria-label="Expand ${escapeHtml(g.name)}" onclick="toggleFilterGroupView('${key}',${i})">${expanded?'▾':'▸'}</button>`:''}</div>${g.items.length?`<div class="filter-children">${g.items.map((v,j)=>`<div class="filter-child"><input type="checkbox" id="${key}-child-${i}-${j}" ${selectedFilters[key].has(v)?'checked':''} onchange="toggleFilterValue('${key}',${JSON.stringify(v).replace(/"/g,'&quot;')},this.checked)"><label for="${key}-child-${i}-${j}">${escapeHtml(term(v))}</label></div>`).join('')}</div>`:''}</div>`;
  }).join('')}</div>`;
  root.querySelectorAll('input[data-partial="true"]').forEach(el=>{el.indeterminate=true;});
}
function toggleFilterMenu(key){const root=filterConfig[key].element;root.classList.toggle('open');const b=root.querySelector('.filter-trigger');b.setAttribute('aria-expanded',String(root.classList.contains('open')));}
document.addEventListener('click',event=>{if(!event.target.closest('.hier-filter')){Object.values(filterConfig).forEach(config=>{if(config.element.classList.contains('open')){config.element.classList.remove('open');const trigger=config.element.querySelector('.filter-trigger');if(trigger)trigger.setAttribute('aria-expanded','false');}});}});
function toggleFilterGroupView(key,index){const root=filterConfig[key].element,group=root.querySelector(`[data-group="${key}-${index}"]`);group.classList.toggle('expanded');const btn=group.querySelector('.filter-expand');btn.textContent=group.classList.contains('expanded')?'▾':'▸';}
function toggleFilterGroup(key,index,checked){const group=filterConfig[key].groups[index];groupValues(group).forEach(v=>checked?selectedFilters[key].add(v):selectedFilters[key].delete(v));renderAllFilters();renderProjects();}
function toggleFilterValue(key,value,checked){checked?selectedFilters[key].add(value):selectedFilters[key].delete(value);renderAllFilters();renderProjects();}
function sortFilters(){const loc=lang==='de'?'de':'en',cmp=(x,y)=>term(x).localeCompare(term(y),loc,{sensitivity:'base'});Object.values(filterConfig).forEach(c=>{c.groups.forEach(g=>g.items.sort(cmp));c.groups.sort((a,b)=>cmp(a.name,b.name));});}
// About-page numbers. Years of experience: counted from 01.04.2024 (start of studies and study projects at TUM). Projects and methods: counted from the projects list below.
// Highlight card: shows every project that has a "highlight" field (value + label), rotating every 5 seconds.
let hlTimer=null,hlIndex=0;
function renderStats(){const t=I18N[lang];
  const years=((Date.now()-START_DATE)/(365.25*864e5)).toFixed(1);
  const methods=new Set(projects.flatMap(p=>p.methods||[])).size;
  const cards=[[years,t.statYears],[projects.length,t.statProjects],[methods,t.statMethods]].map(([n,l])=>`<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("");
  const hasHl=projects.some(p=>p.highlight);
  document.getElementById("statGrid").innerHTML=cards+(hasHl?`<div class="stat stat-hl" id="statHighlight" role="button" tabindex="0"></div>`:"");
  clearInterval(hlTimer);if(!hasHl)return;showHighlight();
  if(!matchMedia("(prefers-reduced-motion: reduce)").matches)hlTimer=setInterval(()=>{const el=document.getElementById("statHighlight");if(!el)return;el.classList.add("fade");setTimeout(()=>{hlIndex++;showHighlight();el.classList.remove("fade");},350);},5000);}
function showHighlight(){const list=projects.filter(p=>p.highlight).sort((a,b)=>(a.highlight.rank||9)-(b.highlight.rank||9)),el=document.getElementById("statHighlight");if(!el||!list.length)return;const p=list[hlIndex%list.length],h=p.highlight;
  el.innerHTML=`<b>${escapeHtml(h.value)}</b><span>${escapeHtml(lang==="de"?(h.labelDe||h.label):h.label)}</span>`;
  el.onclick=()=>{showPage("projects");openProject(p.id);};el.onkeydown=e=>{if(e.key==="Enter")el.onclick();};}
function renderAbout(){const t=I18N[lang],set=(id,v)=>{const e=document.getElementById(id);if(e)e.innerHTML=v;};set("aboutCardRole",t.aboutCardRole);set("aboutCardPlace",t.aboutCardPlace);}
function renderAllFilters(){sortFilters();Object.keys(filterConfig).forEach(renderFilter);}
function selectedProjects(){
  return projects.filter(p=>{
    const matches=(key,field)=>selectedFilters[key].size===0||[...selectedFilters[key]].some(v=>{const have=p[field]||[],det=filterConfig[key].details||{};return have.includes(v)||(det[v]||[]).some(d=>have.includes(d));});
    return matches('industry','industries')&&matches('method','methods')&&matches('software','software');
  }).sort((a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:'base'}));
}
function renderProjects(){
  const list=selectedProjects(),grid=document.getElementById('projectGrid'),t=I18N[lang];
  const activeCount=Object.values(selectedFilters).reduce((n,set)=>n+set.size,0);
  document.getElementById('resultCount').textContent=`${list.length} ${list.length===1?t.one:t.many} · ${activeCount?(lang==='de'?'gefilterte Ergebnisse':'filtered results'):(lang==='de'?'A–Z nach Projektnamen':'A–Z by project name')}`;
  const chips=[];
  for(const [key,set] of Object.entries(selectedFilters)) for(const v of set) chips.push(`${key==='industry'?(lang==='de'?'Branche':'Industry'):key==='method'?(lang==='de'?'Ansatz':'Approach'):(lang==='de'?'Tool':'Tool')}: ${term(v)}`);
  document.getElementById('activeFilters').innerHTML=chips.map(c=>`<span class="chip">${escapeHtml(c)}</span>`).join('');
  document.getElementById('projectDetail').classList.remove('open');document.getElementById('projectDetail').innerHTML='';
  if(!list.length){grid.innerHTML=`<div class="empty"><strong>${t.none}</strong>${t.noneHelp}</div>`;return;}
  grid.innerHTML=list.map(p=>`<button class="project-card" type="button" onclick="openProject('${p.id}')"><div class="card-top"><span class="category">${escapeHtml(term(p.industries[0]||'Project'))}</span><span class="arrow">↗</span></div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(lang==='de'?(p.summaryDe||p.summary):p.summary)}</p><div class="card-tags">${[...p.methods.slice(0,3),...p.software.slice(0,2)].map(v=>`<span class="tag">${escapeHtml(term(v))}</span>`).join('')}</div></button>`).join('');
}
function hasFilters(){return Object.values(selectedFilters).some(set=>set.size>0);}
function clearFilters(){Object.values(selectedFilters).forEach(set=>set.clear());renderAllFilters();renderProjects();}
function escapeHtml(value){return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function resourceLink(url,label){
  return url ? `<a class="resource-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>` : `<span class="resource-link disabled" aria-disabled="true">${label} — ${I18N[lang].later}</span>`;
}
function renderProjectResources(p,t){
  if(Array.isArray(p.resources)){
    const icons={dataset:"▤",code:"⌘",report:"▧"};
    const rows=p.resources.filter(r=>r.url).map(r=>`<a class="resource-link" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer"><span class="resource-icon" aria-hidden="true">${icons[r.type]||"↗"}</span><span class="resource-info"><span class="resource-name">${escapeHtml(r.name)}</span><span class="resource-filename">${escapeHtml(r.file||"")}</span></span><span class="resource-arrow" aria-hidden="true">↗</span></a>`).join("");
    const repo=p.githubUrl?`<a class="resource-link repo-link" href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener noreferrer"><span class="resource-icon" aria-hidden="true">⌘</span><span class="resource-info"><span class="resource-name">GitHub Repository</span><span class="resource-filename">View the complete project repository</span></span><span class="resource-arrow" aria-hidden="true">↗</span></a>`:"";
    return rows+repo;
  }
  return `${resourceLink(p.reportUrl,t.report)}${resourceLink(p.codeUrl,t.code)}`;
}
function openProject(id){
  const p = projects.find(item => item.id === id); if(!p) return;
  const detail = document.getElementById("projectDetail");
  const t=I18N[lang], objective=lang==="de"?(p.objectiveDe||p.objective):p.objective, findings=lang==="de"?(p.findingsDe||p.findings):p.findings;
  detail.innerHTML = `
    <button class="detail-back" type="button" onclick="closeProject()">${t.back}</button>
    <div class="kicker">${escapeHtml(p.industries.map(term).join(" · "))}</div>
    <h3>${escapeHtml(p.name)}</h3>
    <div class="detail-meta">${[...p.methods,...p.software].map(x=>`<span class="chip">${escapeHtml(term(x))}</span>`).join("")}</div>
    <div class="detail-columns"><div>
      <h4>${t.objective}</h4><p>${escapeHtml(objective)}</p>
      <h4>${t.approach}</h4><ul>${(lang==="de"?(p.approachDe||p.approach):p.approach).map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul>
      <h4>${t.findings}</h4><p>${escapeHtml(findings)}</p>
    </div><div><h4>${t.resources}</h4><p>${t.resourceIntro}</p>
      <div class="resource-links">${renderProjectResources(p,t)}</div>
      <div class="detail-note">${escapeHtml(p.status)}</div>
    </div></div>`;
  detail.classList.add("open");
  document.getElementById("projectGrid").style.display="none";
  document.querySelector(".project-toolbar").style.display="none";
  history.replaceState(null,"",`#project/${p.id}`);
}
function closeProject(updateHash=true){
  document.getElementById("projectGrid").style.display="grid";
  document.querySelector(".project-toolbar").style.display="block";
  document.getElementById("projectDetail").classList.remove("open");
  document.getElementById("projectDetail").innerHTML="";
  if(updateHash) history.replaceState(null,"","#projects");
}
function showPage(pageId){
  document.querySelectorAll('main .page').forEach(page => page.classList.toggle('active', page.id === pageId));
  document.querySelectorAll('#navlinks a').forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + pageId));
  history.replaceState(null, '', '#' + pageId);
  window.scrollTo({top:0, behavior:'auto'});
  if(pageId !== 'projects') closeProject(false); if(pageId !== 'notes') closeNote();
}
function toggleNav(){const n=document.getElementById("navlinks"),b=document.querySelector(".menu");const o=n.classList.toggle("open");b.setAttribute("aria-expanded",String(o));}
function closeNav(){document.getElementById("navlinks").classList.remove("open");document.querySelector(".menu").setAttribute("aria-expanded","false");}

// ===== START-UP: load projects and notes from their folders, then draw the page =====
async function loadJSON(path){try{const r=await fetch(path,{cache:"no-cache"});if(!r.ok)throw new Error(r.status);return await r.json();}catch(e){console.warn("Could not load "+path,e);return [];}}
async function start(){
  document.getElementById("year").textContent=new Date().getFullYear();
  projects=await loadJSON("projects/index.json");
  notes=await loadJSON("notes/index.json");
  renderAllFilters();renderProjects();renderNotes();setLanguage("en");
  const h=location.hash;
  if(openNoteFromHash())return;
  if(h.startsWith("#project/")){showPage("projects");openProject(decodeURIComponent(h.slice(9)));return;}
  showPage(["#about","#projects","#contact","#notes"].includes(h)?h.slice(1):"home");
}
start();

// ===== MENU: close the small-screen menu after any link click, a tap outside it, or Escape =====
document.addEventListener("click",e=>{if(e.target.closest("#navlinks a")||!e.target.closest(".top"))closeNav();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeNav();});
