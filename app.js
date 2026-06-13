const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const workouts = {
  martes: {
    title:"Martes · Pecho + Tríceps",
    blocks:[
      ["Calentamiento · 8 min",["Caminadora o bici suave · 3 min","Movilidad hombro/pecho · 3 min","Aperturas ligeras · 2x15"]],
      ["Fuerza",["Press pecho máquina · 4x8–12 · 75–90s","Press inclinado máquina/mancuernas · 3x10","Peck Deck · 3x12–15","Extensión tríceps polea · 3x12","Tríceps cuerda · 2x15"]],
      ["Funcional + cardio",["3 rondas: Battle Rope 30s + Farmer Walk 30m + Plancha 30s","Bicicleta: 30s fuerte / 60s suave x 8"]]
    ]
  },
  miercoles: {
    title:"Miércoles · Espalda + Bíceps",
    blocks:[
      ["Calentamiento · 8 min",["Remo suave · 3 min","Movilidad escapular · 3 min","Jalón ligero · 2x15"]],
      ["Fuerza",["Jalón al pecho · 4x8–12","Remo sentado máquina · 3x10–12","Remo Hammer/apoyo pecho · 3x10–12","Curl bíceps máquina · 3x10–12","Curl martillo · 2x12"]],
      ["Funcional + cardio",["3 rondas: Slam Ball 12 + Farmer Walk 30m + Kettlebell Deadlift 15","Remo: 40s fuerte / 60s suave x 7"]]
    ]
  },
  viernes: {
    title:"Viernes · Pierna + Core",
    blocks:[
      ["Calentamiento · 8 min",["Bicicleta suave · 3 min","Movilidad cadera/tobillo/rodilla · 4 min","Sentadilla sin peso · 1x12"]],
      ["Fuerza",["Prensa · 4x10–12","Curl femoral · 3x12","Extensión cuádriceps · 3x12–15","Hip Thrust · 3x10–12","Pantorrillas · 3x15–20"]],
      ["Core + cardio",["Plancha 3x40s + Pallof Press 3x12 + Crunch máquina 3x15","Caminadora inclinada · 10 min"]]
    ]
  },
  sabado: {
    title:"Sábado · Hombro + Full Body",
    blocks:[
      ["Calentamiento · 8 min",["Elíptica suave · 3 min","Movilidad hombro/columna · 4 min"]],
      ["Fuerza",["Press hombro máquina · 4x8–12","Elevaciones laterales · 3x12–15","Pájaros/reverse peck deck · 3x12–15","Face Pull · 3x15"]],
      ["Circuito metabólico",["4 rondas: Battle Rope 30s + Farmer Walk 30m + Step Ups 12 + Kettlebell Swing 15","Elíptica · 8–10 min"]]
    ]
  },
  domingo: {
    title:"Domingo · Pierna + Movilidad",
    blocks:[
      ["Calentamiento · 8 min",["Bicicleta suave · 3 min","Activación glúteo con banda · 2x15"]],
      ["Fuerza",["Prensa pies altos · 4x12","Hip Thrust · 4x12","Curl femoral · 3x12","Abductores · 3x15","Pantorrillas · 3x15–20"]],
      ["Funcional + movilidad",["3 rondas: Caminata con mancuernas 40m + Step Ups 12 + Bird Dog 10/lado","Movilidad cadera/tobillo/espalda · 10 min"]]
    ]
  }
};

let charts = {};
const defaultSettings = {startWeight:112, goalWeight:95, stepGoal:10000, proteinGoal:180};

function getSettings(){return JSON.parse(localStorage.getItem("settings")||JSON.stringify(defaultSettings));}
function setSettings(s){localStorage.setItem("settings",JSON.stringify(s));}
function getLogs(){return JSON.parse(localStorage.getItem("logs")||"[]").sort((a,b)=>a.date.localeCompare(b.date));}
function setLogs(logs){localStorage.setItem("logs",JSON.stringify(logs));}
function getPhotos(){return JSON.parse(localStorage.getItem("photos")||"[]");}
function setPhotos(p){localStorage.setItem("photos",JSON.stringify(p));}
function today(){return new Date().toISOString().slice(0,10);}

function switchTab(tab){
  $$(".tabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  $$(".screen").forEach(s=>s.classList.toggle("active",s.id===tab));
  renderAll();
}
$$(".tabs button").forEach(btn=>btn.addEventListener("click",()=>switchTab(btn.dataset.tab)));

function renderWorkout(day="martes"){
  const w = workouts[day];
  $$(".day-selector button").forEach(b=>b.classList.toggle("active",b.dataset.day===day));
  const html = `<article class="card"><h2>${w.title}</h2><p class="muted">Marca los ejercicios al completarlos. Los checks se guardan en este celular.</p>${
    w.blocks.map(([title,items])=>`<h3>${title}</h3>${items.map(item=>{
      const key = `workout_${day}_${item}`;
      const checked = localStorage.getItem(key)==="1" ? "checked" : "";
      return `<div class="exercise"><label><input type="checkbox" data-store="${key}" ${checked}> ${item}</label></div>`;
    }).join("")}`).join("")
  }</article>`;
  $("#workoutContainer").innerHTML=html;
  $$("input[data-store]").forEach(cb=>cb.addEventListener("change",()=>localStorage.setItem(cb.dataset.store,cb.checked?"1":"0")));
}
document.addEventListener("click", e=>{
  if(e.target.matches(".day-selector button")) renderWorkout(e.target.dataset.day);
});

function initDates(){
  $("#logDate").value=today();
  $("#photoDate").value=today();
}

function saveDaily(){
  const d=today();
  const states={};
  $$(".daily").forEach(cb=>states[cb.dataset.key]=cb.checked);
  localStorage.setItem("daily_"+d,JSON.stringify(states));
}
function loadDaily(){
  const states=JSON.parse(localStorage.getItem("daily_"+today())||"{}");
  $$(".daily").forEach(cb=>{cb.checked=!!states[cb.dataset.key]; cb.onchange=saveDaily;});
}

function saveLog(){
  const log={
    date:$("#logDate").value||today(),
    weight:parseFloat($("#logWeight").value)||null,
    waist:parseFloat($("#logWaist").value)||null,
    steps:parseInt($("#logSteps").value)||null,
    energy:parseInt($("#logEnergy").value)||null,
    workouts:parseInt($("#logWorkouts").value)||null,
    notes:$("#logNotes").value||""
  };
  let logs=getLogs().filter(x=>x.date!==log.date);
  logs.push(log);
  setLogs(logs);
  renderAll();
  alert("Registro guardado.");
}
$("#saveLog").addEventListener("click",saveLog);

function renderKPIs(){
  const settings=getSettings(), logs=getLogs();
  const last=[...logs].reverse().find(x=>x.weight||x.waist||x.steps) || {};
  const weight=last.weight||settings.startWeight;
  $("#kpiWeight").textContent=weight.toFixed(1)+" kg";
  $("#kpiWaist").textContent=last.waist ? last.waist+" cm" : "-- cm";
  const recent=logs.slice(-7);
  const avgSteps = recent.length ? Math.round(recent.reduce((s,x)=>s+(x.steps||0),0)/recent.filter(x=>x.steps).length || 0) : 0;
  $("#kpiSteps").textContent=avgSteps ? avgSteps.toLocaleString("es-MX") : "--";
  const daily=JSON.parse(localStorage.getItem("daily_"+today())||"{}");
  const adherence=Math.round(Object.values(daily).filter(Boolean).length/6*100)||0;
  $("#kpiAdherence").textContent=adherence+"%";
  const total=settings.startWeight-settings.goalWeight;
  const done=Math.max(0, Math.min(100, ((settings.startWeight-weight)/total)*100));
  $("#goalBar").style.width=done+"%";
  $("#goalText").textContent=`Progreso hacia ${settings.goalWeight} kg: ${Math.round(done)}%`;
}

function makeChart(id,type,labels,data,label){
  const ctx=$("#"+id);
  if(!ctx) return;
  if(charts[id]) charts[id].destroy();
  charts[id]=new Chart(ctx,{type, data:{labels, datasets:[{label,data,tension:.3,borderWidth:2}]},
    options:{responsive:true,plugins:{legend:{display:true}},scales:{y:{beginAtZero:false}}}
  });
}
function renderCharts(){
  const logs=getLogs();
  makeChart("weightChart","line",logs.map(x=>x.date),logs.map(x=>x.weight).filter(x=>x!==null),"Peso kg");
  makeChart("waistChart","line",logs.map(x=>x.date),logs.map(x=>x.waist).filter(x=>x!==null),"Cintura cm");
  makeChart("stepsChart","bar",logs.map(x=>x.date),logs.map(x=>x.steps||0),"Pasos");
}

function renderHistory(){
  const logs=[...getLogs()].reverse();
  $("#historyTable").innerHTML = logs.length ? logs.map(l=>`
    <div class="history-row">
      <b>${l.date}</b><br>
      Peso: ${l.weight??"--"} kg · Cintura: ${l.waist??"--"} cm · Pasos: ${l.steps??"--"} · Energía: ${l.energy??"--"} · Entrenos: ${l.workouts??"--"}/5
      ${l.notes?`<p class="muted">${l.notes}</p>`:""}
    </div>`).join("") : `<p class="muted">Aún no hay registros.</p>`;
}

function savePhoto(){
  const file=$("#photoInput").files[0];
  if(!file){alert("Selecciona una foto.");return;}
  const reader=new FileReader();
  reader.onload=()=>{
    const photos=getPhotos();
    photos.push({date:$("#photoDate").value||today(),type:$("#photoType").value,src:reader.result});
    setPhotos(photos);
    renderPhotos();
    $("#photoInput").value="";
  };
  reader.readAsDataURL(file);
}
$("#savePhoto").addEventListener("click",savePhoto);

function renderPhotos(){
  const photos=[...getPhotos()].reverse();
  $("#photoGallery").innerHTML=photos.length ? photos.map((p,i)=>`
    <div class="photo-card"><img src="${p.src}" alt="${p.type} ${p.date}"><div><b>${p.type}</b><br>${p.date}<br><button class="danger" onclick="deletePhoto(${photos.length-1-i})">Eliminar</button></div></div>
  `).join("") : `<p class="muted">Aún no hay fotos guardadas.</p>`;
}
window.deletePhoto=function(idx){const p=getPhotos();p.splice(idx,1);setPhotos(p);renderPhotos();}

function loadSettings(){
  const s=getSettings();
  $("#setStartWeight").value=s.startWeight; $("#setGoalWeight").value=s.goalWeight; $("#setStepGoal").value=s.stepGoal; $("#setProteinGoal").value=s.proteinGoal;
}
$("#saveSettings").addEventListener("click",()=>{
  setSettings({startWeight:parseFloat($("#setStartWeight").value)||112, goalWeight:parseFloat($("#setGoalWeight").value)||95, stepGoal:parseInt($("#setStepGoal").value)||10000, proteinGoal:parseInt($("#setProteinGoal").value)||180});
  renderAll(); alert("Metas guardadas.");
});

$("#exportData").addEventListener("click",()=>{
  const data={settings:getSettings(),logs:getLogs(),photos:getPhotos()};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="coach-fitness-carlos-wolf-backup.json"; a.click();
});
$("#importData").addEventListener("change",e=>{
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{const data=JSON.parse(reader.result); if(data.settings)setSettings(data.settings); if(data.logs)setLogs(data.logs); if(data.photos)setPhotos(data.photos); renderAll(); alert("Respaldo importado.");}
    catch(err){alert("Archivo inválido.");}
  };
  reader.readAsText(file);
});
$("#clearData").addEventListener("click",()=>{
  if(confirm("¿Borrar todos los datos guardados en esta app?")){
    localStorage.clear(); renderAll(); alert("Datos borrados.");
  }
});

let deferredPrompt;
window.addEventListener("beforeinstallprompt", e=>{
  e.preventDefault(); deferredPrompt=e; $("#installBtn").classList.remove("hidden");
});
$("#installBtn").addEventListener("click",async()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt=null; $("#installBtn").classList.add("hidden");
});

function renderAll(){renderKPIs(); renderCharts(); renderHistory(); renderPhotos(); loadSettings();}
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js"));}
initDates(); loadDaily(); renderWorkout("martes"); renderAll();
