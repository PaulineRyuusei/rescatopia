const STORE_KEY = "rescatopia_data_v1";
const imageFallback = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=80";
const seed = {
  animals: [
    {id:"R-001",name:"Luna",species:"Perro",sex:"Hembra",age:"2 años",description:"Cariñosa, tranquila y fan de los paseos. Convive bien con personas.",photo:"https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80",intake:"2026-10-12",status:"Disponible",published:true},
    {id:"R-002",name:"Milo",species:"Gato",sex:"Macho",age:"8 meses",description:"Curioso y juguetón. Le encantan las siestas cerca de una ventana.",photo:"https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=700&q=80",intake:"2026-10-18",status:"Disponible",published:true},
    {id:"R-003",name:"Frida",species:"Perro",sex:"Hembra",age:"3 años",description:"Una compañera dulce que disfruta la compañía y los espacios tranquilos.",photo:"https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=700&q=80",intake:"2026-09-29",status:"En tratamiento",published:false},
    {id:"R-004",name:"Simón",species:"Gato",sex:"Macho",age:"1 año",description:"Amigable, observador y listo para llenar tu hogar de ronroneos.",photo:"https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=700&q=80",intake:"2026-10-03",status:"Disponible",published:true},
    {id:"R-005",name:"Nala",species:"Perro",sex:"Hembra",age:"4 años",description:"Sociable y paciente. Busca una familia que disfrute caminar con ella.",photo:"https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=700&q=80",intake:"2026-08-14",status:"Adoptado",published:false}
  ],
  medical: [
    {id:"M-101",animalId:"R-001",type:"Vacuna",date:"2026-11-03",description:"Aplicación de vacuna múltiple. Próxima revisión según calendario veterinario.",responsible:"Dra. Elena"},
    {id:"M-102",animalId:"R-003",type:"Tratamiento",date:"2026-11-10",description:"Seguimiento de tratamiento dermatológico. Revisar evolución en próxima consulta.",responsible:"Dr. Mateo"},
    {id:"M-103",animalId:"R-002",type:"Consulta",date:"2026-10-22",description:"Valoración general y revisión de peso. Sin observaciones relevantes.",responsible:"Dra. Elena"}
  ],
  applications: [
    {id:"A-201",animalId:"R-001",name:"Andrea López",email:"andrea@email.com",phone:"722 123 4567",address:"Metepec, Estado de México",message:"Tengo espacio en casa y experiencia cuidando perros. Me gustaría conocer a Luna.",date:"2026-11-18",status:"Pendiente"},
    {id:"A-202",animalId:"R-002",name:"Carlos Méndez",email:"carlos@email.com",phone:"722 987 6543",address:"Toluca, Estado de México",message:"Busco adoptar un gato. En casa somos dos adultos y no tenemos otras mascotas.",date:"2026-11-19",status:"En revisión"}
  ],
  activity: [
    {icon:"💌",title:"Nueva solicitud de adopción",detail:"Andrea López · Luna",date:"2026-11-18"},
    {icon:"🩺",title:"Expediente médico actualizado",detail:"Frida · Tratamiento",date:"2026-11-10"},
    {icon:"🐾",title:"Nuevo registro médico",detail:"Luna · Vacuna",date:"2026-11-03"}
  ]
};
let data = loadData();
let toastTimer;

function loadData(){
  try { const saved=localStorage.getItem(STORE_KEY); return saved?JSON.parse(saved):structuredClone(seed); }
  catch(e){ return JSON.parse(JSON.stringify(seed)); }
}
function saveData(){ localStorage.setItem(STORE_KEY,JSON.stringify(data)); renderAll(); }
function escapeHTML(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function animalById(id){return data.animals.find(a=>a.id===id);}
function fmtDate(d){if(!d)return "—";const [y,m,day]=d.split("-");return `${day}/${m}/${y}`;}
function toast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600);}
function statusClass(s){return ({ "Disponible":"available","En tratamiento":"treatment","En evaluación":"evaluation","Adoptado":"adopted","Pendiente":"pending","En revisión":"review","Aprobada":"approved","Rechazada":"rejected","Completada":"completed"})[s]||"pending";}
function setView(name){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${name}`));
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  document.querySelector(".main-nav").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
  renderAll();
}
document.querySelectorAll("[data-view]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();setView(el.dataset.view);}));
document.getElementById("mobileMenu").addEventListener("click",()=>document.querySelector(".main-nav").classList.toggle("open"));

function renderPublic(){
  const search=(document.getElementById("petSearch")?.value||"").toLowerCase();
  const species=document.getElementById("speciesFilter")?.value||"all";
  const pets=data.animals.filter(a=>a.status==="Disponible"&&a.published&&(species==="all"||a.species===species)&&(`${a.name} ${a.description}`.toLowerCase().includes(search)));
  document.getElementById("publicAvailable").textContent=data.animals.filter(a=>a.status==="Disponible").length;
  document.getElementById("publicAdopted").textContent=data.animals.filter(a=>a.status==="Adoptado").length;
  document.getElementById("publicPets").innerHTML=pets.map(a=>`
    <article class="pet-card">
      <div class="pet-photo"><img src="${escapeHTML(a.photo||imageFallback)}" alt="${escapeHTML(a.name)}" onerror="this.src='${imageFallback}'"><span class="pet-tag">♡ Busca familia</span></div>
      <div class="pet-card-body"><div class="pet-card-title"><h3>${escapeHTML(a.name)}</h3><span class="pet-age">${escapeHTML(a.age)}</span></div>
      <p class="pet-desc">${escapeHTML(a.description)}</p><div class="pet-card-bottom"><span class="pet-kind">${a.species==="Perro"?"🐶":"🐱"} ${escapeHTML(a.species)} · ${escapeHTML(a.sex)}</span><button class="btn-small" data-action="apply" data-id="${a.id}">Quiero adoptar →</button></div></div>
    </article>`).join("");
  document.getElementById("emptyPublic").classList.toggle("hidden",pets.length>0);
}
function renderDashboard(){
  const count=s=>data.animals.filter(a=>a.status===s).length;
  document.getElementById("metricTotal").textContent=data.animals.length;
  document.getElementById("metricAvailable").textContent=count("Disponible");
  document.getElementById("metricTreatment").textContent=count("En tratamiento");
  document.getElementById("metricAdopted").textContent=count("Adoptado");
  document.getElementById("pendingBadge").textContent=data.applications.filter(a=>["Pendiente","En revisión"].includes(a.status)).length;
  document.getElementById("recentActivity").innerHTML=data.activity.slice(0,5).map(a=>`<div class="activity-item"><span class="activity-icon">${a.icon}</span><div class="activity-copy"><b>${escapeHTML(a.title)}</b><small>${escapeHTML(a.detail)}</small></div><span class="activity-time">${fmtDate(a.date)}</span></div>`).join("")||'<p class="form-hint">Todavía no hay actividad.</p>';
  const pending=data.applications.filter(a=>["Pendiente","En revisión"].includes(a.status)).slice(0,4);
  document.getElementById("dashboardApplications").innerHTML=pending.map(a=>`<div class="compact-item"><span class="activity-icon">💌</span><div class="activity-copy"><b>${escapeHTML(a.name)}</b><small>Interés en ${escapeHTML(animalById(a.animalId)?.name||"un animal")}</small></div><span class="status ${statusClass(a.status)}">${escapeHTML(a.status)}</span></div>`).join("")||'<p class="form-hint">No hay solicitudes pendientes.</p>';
}
function renderAnimals(){
  const q=(document.getElementById("adminAnimalSearch")?.value||"").toLowerCase(),s=document.getElementById("statusFilter")?.value||"all";
  const list=data.animals.filter(a=>(s==="all"||a.status===s)&&`${a.name} ${a.id} ${a.species}`.toLowerCase().includes(q));
  document.getElementById("animalsTable").innerHTML=list.map(a=>`<tr><td><div class="animal-cell"><img class="animal-thumb" src="${escapeHTML(a.photo||imageFallback)}" onerror="this.src='${imageFallback}'" alt=""><span>${escapeHTML(a.name)}<small style="display:block;color:#aaa;font-weight:500;margin-top:3px">${a.id}</small></span></div></td><td>${escapeHTML(a.species)}</td><td>${escapeHTML(a.age)}</td><td><span class="status ${statusClass(a.status)}">${escapeHTML(a.status)}</span></td><td>${fmtDate(a.intake)}</td><td><div class="row-actions"><button class="mini-action" data-action="edit-animal" data-id="${a.id}">Editar</button><button class="mini-action" data-action="animal-medical" data-id="${a.id}">Salud</button></div></td></tr>`).join("");
  document.getElementById("emptyAnimals").classList.toggle("hidden",list.length>0);
}
function renderMedical(){
  const q=(document.getElementById("medicalSearch")?.value||"").toLowerCase(),t=document.getElementById("medicalTypeFilter")?.value||"all";
  const list=data.medical.filter(m=>(t==="all"||m.type===t)&&(`${animalById(m.animalId)?.name||""} ${m.description} ${m.responsible}`.toLowerCase().includes(q)));
  const icons={Vacuna:"💉",Consulta:"🩺",Tratamiento:"💊"};
  document.getElementById("medicalList").innerHTML=list.map(m=>`<article class="medical-card"><span class="medical-icon">${icons[m.type]||"🩺"}</span><div><h3>${escapeHTML(m.type)} · ${escapeHTML(animalById(m.animalId)?.name||"Animal")}</h3><p>${escapeHTML(m.description)}</p><span class="medical-meta">${fmtDate(m.date)} · Responsable: ${escapeHTML(m.responsible)}</span></div></article>`).join("");
  document.getElementById("emptyMedical").classList.toggle("hidden",list.length>0);
}
function renderApplications(){
  const q=(document.getElementById("applicationSearch")?.value||"").toLowerCase(),s=document.getElementById("applicationStatusFilter")?.value||"all";
  const list=data.applications.filter(a=>(s==="all"||a.status===s)&&`${a.name} ${animalById(a.animalId)?.name||""} ${a.email}`.toLowerCase().includes(q));
  document.getElementById("applicationsList").innerHTML=list.map(a=>`<article class="application-card"><div class="application-top"><div><h3>${escapeHTML(a.name)}</h3><p class="sub">Solicita adoptar a <b>${escapeHTML(animalById(a.animalId)?.name||"Animal")}</b></p></div><span class="status ${statusClass(a.status)}">${escapeHTML(a.status)}</span></div><div class="application-info"><div><small>Correo</small><b>${escapeHTML(a.email)}</b></div><div><small>Teléfono</small><b>${escapeHTML(a.phone)}</b></div><div><small>Ubicación</small><b>${escapeHTML(a.address)}</b></div><div><small>Fecha</small><b>${fmtDate(a.date)}</b></div></div><p class="application-message">“${escapeHTML(a.message)}”</p><div class="application-actions">${a.status!=="En revisión"&&a.status!=="Aprobada"&&a.status!=="Completada"?`<button class="btn-small" data-action="app-status" data-id="${a.id}" data-status="En revisión">En revisión</button>`:""}${a.status!=="Aprobada"&&a.status!=="Completada"&&a.status!=="Rechazada"?`<button class="btn-small" data-action="app-status" data-id="${a.id}" data-status="Aprobada">Aprobar</button>`:""}${!["Rechazada","Completada"].includes(a.status)?`<button class="mini-action" data-action="app-status" data-id="${a.id}" data-status="Rechazada">Rechazar</button>`:""}${a.status==="Aprobada"?`<button class="btn-small" data-action="complete-adoption" data-id="${a.id}">Confirmar entrega</button>`:""}</div></article>`).join("");
  document.getElementById("emptyApplications").classList.toggle("hidden",list.length>0);
}
function renderAll(){renderPublic();renderDashboard();renderAnimals();renderMedical();renderApplications();}
["petSearch","speciesFilter","adminAnimalSearch","statusFilter","medicalSearch","medicalTypeFilter","applicationSearch","applicationStatusFilter"].forEach(id=>{const el=document.getElementById(id);el.addEventListener("input",()=>{if(id.includes("pet"))renderPublic();else if(id.includes("admin")||id==="statusFilter")renderAnimals();else if(id.includes("medical"))renderMedical();else renderApplications();});});

const backdrop=document.getElementById("modalBackdrop"),modalContent=document.getElementById("modalContent");
function openModal(title,eyebrow,html){document.getElementById("modalTitle").textContent=title;document.getElementById("modalEyebrow").textContent=eyebrow;modalContent.innerHTML=html;backdrop.classList.remove("hidden");}
function closeModal(){backdrop.classList.add("hidden");modalContent.innerHTML="";}
document.getElementById("closeModal").addEventListener("click",closeModal);
backdrop.addEventListener("click",e=>{if(e.target===backdrop)closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});

function animalForm(animal){
  const a=animal||{name:"",species:"Perro",sex:"Hembra",age:"",description:"",photo:"",intake:new Date().toISOString().slice(0,10),status:"En evaluación",published:false};
  openModal(animal?"Editar perfil":"Registrar animal","ADMINISTRACIÓN DE ANIMALES",`
  <form id="animalForm"><div class="form-grid">
    <div class="field"><label>Nombre *</label><input name="name" required maxlength="45" value="${escapeHTML(a.name)}" placeholder="Ej. Canela"></div>
    <div class="field"><label>Especie *</label><select name="species"><option ${a.species==="Perro"?"selected":""}>Perro</option><option ${a.species==="Gato"?"selected":""}>Gato</option><option ${!["Perro","Gato"].includes(a.species)?"selected":""}>Otro</option></select></div>
    <div class="field"><label>Sexo</label><select name="sex"><option ${a.sex==="Hembra"?"selected":""}>Hembra</option><option ${a.sex==="Macho"?"selected":""}>Macho</option><option ${a.sex==="No especificado"?"selected":""}>No especificado</option></select></div>
    <div class="field"><label>Edad aproximada</label><input name="age" value="${escapeHTML(a.age)}" placeholder="Ej. 1 año"></div>
    <div class="field"><label>Fecha de ingreso</label><input type="date" name="intake" value="${a.intake}"></div>
    <div class="field"><label>Estado</label><select name="status">${["En evaluación","En tratamiento","Disponible","Adoptado"].map(s=>`<option ${a.status===s?"selected":""}>${s}</option>`).join("")}</select></div>
    <div class="field full"><label>URL de fotografía</label><input name="photo" type="url" value="${escapeHTML(a.photo)}" placeholder="https://..."></div>
    <div class="field full"><label>Descripción</label><textarea name="description" placeholder="Cuéntanos sobre su personalidad...">${escapeHTML(a.description)}</textarea></div>
    <div class="field full"><label><input type="checkbox" name="published" style="width:auto;vertical-align:middle" ${a.published?"checked":""}> Mostrar en el portal público (solo si está disponible)</label></div>
  </div><div class="form-actions"><button type="button" class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit">Guardar animal</button></div></form>`);
  document.getElementById("animalForm").addEventListener("submit",e=>{
    e.preventDefault();const f=new FormData(e.target);const obj={id:animal?.id||`R-${String(Date.now()).slice(-6)}`,name:f.get("name").trim(),species:f.get("species"),sex:f.get("sex"),age:f.get("age").trim()||"Edad no especificada",description:f.get("description").trim(),photo:f.get("photo").trim()||imageFallback,intake:f.get("intake"),status:f.get("status"),published:f.get("published")==="on"&&f.get("status")==="Disponible"};
    if(animal)Object.assign(animal,obj);else data.animals.unshift(obj);
    data.activity.unshift({icon:"🐾",title:animal?"Perfil de animal actualizado":"Nuevo animal registrado",detail:obj.name,date:new Date().toISOString().slice(0,10)});saveData();closeModal();toast("Información del animal guardada.");
  });
}
function medicalForm(animalId){
  const options=data.animals.map(a=>`<option value="${a.id}" ${a.id===animalId?"selected":""}>${escapeHTML(a.name)} (${a.id})</option>`).join("");
  if(!options){toast("Primero registra un animal.");return;}
  openModal("Nuevo registro médico","EXPEDIENTE DE SALUD",`<form id="medicalForm"><div class="form-grid">
    <div class="field full"><label>Animal *</label><select name="animalId" required>${options}</select></div>
    <div class="field"><label>Tipo de registro *</label><select name="type"><option>Vacuna</option><option>Consulta</option><option>Tratamiento</option></select></div>
    <div class="field"><label>Fecha *</label><input type="date" name="date" required value="${new Date().toISOString().slice(0,10)}"></div>
    <div class="field full"><label>Descripción *</label><textarea name="description" required placeholder="Describe la atención realizada..."></textarea></div>
    <div class="field full"><label>Responsable</label><input name="responsible" placeholder="Nombre del veterinario o responsable"></div>
  </div><div class="form-actions"><button type="button" class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary">Guardar registro</button></div></form>`);
  document.getElementById("medicalForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.target);data.medical.unshift({id:`M-${Date.now()}`,animalId:f.get("animalId"),type:f.get("type"),date:f.get("date"),description:f.get("description").trim(),responsible:f.get("responsible").trim()||"No especificado"});data.activity.unshift({icon:"🩺",title:"Expediente médico actualizado",detail:`${animalById(f.get("animalId"))?.name} · ${f.get("type")}`,date:f.get("date")});saveData();closeModal();toast("Registro médico guardado.");});
}
function applyForm(animal){
  openModal(`Quiero adoptar a ${animal.name}`,"FORMULARIO DE ADOPCIÓN",`<p class="form-hint" style="margin:0 0 17px">Cuéntanos un poco sobre ti. El equipo del refugio revisará tu solicitud y se pondrá en contacto contigo.</p><form id="applyForm"><div class="form-grid">
  <div class="field"><label>Nombre completo *</label><input name="name" required maxlength="80"></div>
  <div class="field"><label>Correo electrónico *</label><input type="email" name="email" required></div>
  <div class="field"><label>Teléfono *</label><input name="phone" required maxlength="25"></div>
  <div class="field"><label>Ciudad o municipio *</label><input name="address" required></div>
  <div class="field full"><label>¿Por qué te gustaría adoptar? *</label><textarea name="message" required minlength="10" placeholder="Cuéntanos sobre tu hogar y cómo cuidarías a tu nuevo compañero..."></textarea></div>
  </div><p class="form-hint">Al enviar este formulario, tus datos se guardarán en este navegador como parte de la demostración académica. No introduzcas información personal real.</p><div class="form-actions"><button type="button" class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary">Enviar solicitud</button></div></form>`);
  document.getElementById("applyForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.target);data.applications.unshift({id:`A-${Date.now()}`,animalId:animal.id,name:f.get("name").trim(),email:f.get("email").trim(),phone:f.get("phone").trim(),address:f.get("address").trim(),message:f.get("message").trim(),date:new Date().toISOString().slice(0,10),status:"Pendiente"});data.activity.unshift({icon:"💌",title:"Nueva solicitud de adopción",detail:`${f.get("name")} · ${animal.name}`,date:new Date().toISOString().slice(0,10)});saveData();closeModal();toast("¡Solicitud registrada! El refugio podrá revisarla.");});
}
function handleAction(el){
  const action=el.dataset.action,id=el.dataset.id;
  if(action==="new-animal")animalForm();
  if(action==="edit-animal")animalForm(animalById(id));
  if(action==="new-medical")medicalForm();
  if(action==="animal-medical"){setView("medical");document.getElementById("medicalSearch").value=animalById(id)?.name||"";renderMedical();}
  if(action==="apply"){const a=animalById(id);if(a)applyForm(a);}
  if(action==="close-modal")closeModal();
  if(action==="app-status"){const a=data.applications.find(x=>x.id===id);if(a){a.status=el.dataset.status;data.activity.unshift({icon:"💌",title:"Solicitud actualizada",detail:`${a.name} · ${a.status}`,date:new Date().toISOString().slice(0,10)});saveData();toast(`Solicitud marcada como ${a.status.toLowerCase()}.`);}}
  if(action==="complete-adoption"){const app=data.applications.find(x=>x.id===id);if(app){const a=animalById(app.animalId);if(a){a.status="Adoptado";a.published=false;}app.status="Completada";data.activity.unshift({icon:"🏡",title:"Adopción confirmada",detail:`${a?.name||"Animal"} · ${app.name}`,date:new Date().toISOString().slice(0,10)});saveData();toast("¡Adopción confirmada! El perfil ya no aparece en el portal.");}}
}
document.addEventListener("click",e=>{const el=e.target.closest("[data-action]");if(el){e.preventDefault();handleAction(el);}});
renderAll();
