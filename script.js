const state={interests:[],skills:[],goal:'',name:'Student',branch:'',marks:''};
const careers=[
{name:'AI / ML Engineer',icon:'AI',color:'',interest:['ai','coding','data','research'],skills:['python','ml','problem'],goals:['job','higher','startup'],courses:['Python for Data Science','Statistics for AI','Machine Learning Fundamentals'],tags:['Python','Machine Learning','Statistics']},
{name:'Software Developer',icon:'SD',color:'blue',interest:['coding','ai','design'],skills:['python','cpp','web','problem'],goals:['job','startup'],courses:['Data Structures & Algorithms','Git & GitHub','Full Stack Development'],tags:['DSA','Programming','Git']},
{name:'Data Analyst',icon:'DA',color:'purple',interest:['data','research','business'],skills:['sql','python','problem'],goals:['job','higher'],courses:['SQL & Data Analytics','Excel for Analytics','Power BI Fundamentals'],tags:['SQL','Excel','Analytics']},
{name:'Cybersecurity Analyst',icon:'CY',color:'',interest:['cyber','coding','research'],skills:['cpp','python','problem'],goals:['job','higher'],courses:['Computer Networks','Linux Fundamentals','Cybersecurity Essentials'],tags:['Networks','Linux','Security']},
{name:'UI/UX Designer',icon:'UX',color:'purple',interest:['design','communication','business'],skills:['web','communication','leadership'],goals:['job','startup'],courses:['UI/UX Fundamentals','Figma','User Research'],tags:['Figma','Research','Design']}
];

function openPage(id){
 document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
 document.getElementById(id).classList.add('active');
 document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.page===id));
 const titles={dashboard:'Overview',assessment:'Career Assessment',careers:'Career Explorer',learning:'Learning Path',internships:'Internships',assistant:'AI Assistant'};
 document.getElementById('pageTitle').textContent=titles[id]||'AI CareerPath';
 window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.nav').forEach(n=>n.onclick=()=>openPage(n.dataset.page));

function wireOptions(id,key){
 document.querySelectorAll('#'+id+' button').forEach(b=>b.onclick=()=>{
   b.classList.toggle('selected');
   const v=b.dataset.v;
   if(key==='goal'){document.querySelectorAll('#'+id+' button').forEach(x=>{if(x!==b)x.classList.remove('selected')});state.goal=v;}
   else state[key]=b.classList.contains('selected')?[...state[key],v]:state[key].filter(x=>x!==v);
 });
}
wireOptions('interestOptions','interests');wireOptions('skillOptions','skills');wireOptions('goalOptions','goal');

function nextStep(n){
 document.querySelectorAll('.question-block').forEach(x=>x.classList.add('hidden'));
 document.getElementById('step'+n).classList.remove('hidden');
 document.querySelectorAll('.steps span').forEach((s,i)=>s.classList.toggle('on',i<n));
}
function score(c){
 let s=45;
 s+=Math.min(27,c.interest.filter(x=>state.interests.includes(x)).length*9);
 s+=Math.min(21,c.skills.filter(x=>state.skills.includes(x)).length*7);
 if(c.goals.includes(state.goal))s+=7;
 if(state.marks==='high')s+=3;
 return Math.min(97,s);
}
function finishAssessment(){
 if(state.interests.length<2){alert('Select at least 2 interests.');return}
 if(!state.goal){alert('Select a career goal.');return}
 state.name=document.getElementById('studentName').value.trim()||'Student';
 state.branch=document.getElementById('branch').value||'College Student';
 state.marks=document.getElementById('marks').value||'medium';
 const ranked=careers.map(c=>({...c,score:score(c)})).sort((a,b)=>b.score-a.score);
 localStorage.setItem('careerPathState',JSON.stringify({...state,ranked}));
 renderProfile(ranked);
 openPage('dashboard');
}
function renderProfile(ranked){
 const top=ranked[0];
 document.getElementById('avatar').textContent=state.name[0].toUpperCase();
 document.getElementById('sideName').textContent=state.name;
 document.getElementById('dashCareer').textContent=top.name+' is your strongest current match.';
 document.getElementById('dashReason').textContent='Your interests, existing skills, academic profile and goal point toward this career direction. Use the roadmap to turn the match into action.';
 document.getElementById('dashMatch').textContent=top.score+'%';
 document.getElementById('statCareer').textContent=top.name;
 document.getElementById('statFit').textContent=top.score+'%';
 document.getElementById('statSkills').textContent=Math.min(92,45+state.skills.length*7)+'%';
 document.getElementById('statAction').textContent='Build skills';
 document.getElementById('dashCareers').innerHTML=ranked.slice(0,3).map(c=>`<div class="career-row"><div class="career-icon ${c.color}">${c.icon}</div><div><b>${c.name}</b><small>${c.tags.join(' • ')}</small></div><span class="pct">${c.score}%</span></div>`).join('');
 document.getElementById('learningCareer').textContent=top.name;
 document.getElementById('learningPercent').textContent=Math.min(90,40+state.skills.length*8)+'%';
 document.getElementById('learningBar').style.width=Math.min(90,40+state.skills.length*8)+'%';
 document.getElementById('courseList').innerHTML=top.courses.map((x,i)=>`<div class="course"><span class="course-num">0${i+1}</span><div><b>${x}</b><small>${i===0?'Foundation':i===1?'Core skill':'Career specialization'}</small></div></div>`).join('');
 document.getElementById('internshipTitle').textContent='Prepare for '+top.name+' opportunities.';
 document.getElementById('internshipText').textContent='Build the right skills and portfolio projects before you apply.';
 document.getElementById('internshipScore').textContent=Math.min(89,45+state.skills.length*6)+'%';
 renderExplorer(ranked);
}
function renderExplorer(ranked){
 const source=ranked||careers.map(c=>({...c,score:score(c)})).sort((a,b)=>b.score-a.score);
 document.getElementById('careerExplorer').innerHTML=source.map(c=>`<div class="career-explore-card"><div class="career-icon ${c.color}">${c.icon}</div><h3>${c.name}</h3><p>A practical career direction aligned with ${c.tags.join(', ')}.</p><div class="tag-row">${c.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><button class="card-action" onclick="openPage('learning')">See learning path →</button></div>`).join('');
}
document.querySelectorAll('.filter').forEach(f=>f.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));f.classList.add('active')});

function ask(q){document.getElementById('chatInput').value=q;sendChat()}
function sendChat(){
 const input=document.getElementById('chatInput'),q=input.value.trim();if(!q)return;
 const box=document.getElementById('messages');box.innerHTML+=`<div class="msg user"><p>${safe(q)}</p></div>`;
 let a='Start with the career direction that matches your interests, then close one skill gap at a time through a project. Your goal is progress, not perfection.';
 const l=q.toLowerCase();
 if(l.includes('career'))a=state.goal?`Based on your current profile, your strongest direction is ${document.getElementById('statCareer').textContent}. I would explore the top 2–3 matches before making a decision.`:'Complete the career assessment first. It uses your interests, skills, academics and goals to create personalized matches.';
 if(l.includes('learn'))a='Start with your biggest skill gap. Learn the concept, practice it, and immediately use it in a small project. That gives your learning a clear career purpose.';
 if(l.includes('intern'))a='Choose internships that match your current level, prepare 2–3 relevant projects, keep your resume focused, and apply consistently. Use the Internship page to see what to prepare.';
 setTimeout(()=>box.innerHTML+=`<div class="msg bot"><b>CareerPath AI</b><p>${a}</p></div>`,220);input.value='';
}
function safe(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

const saved=localStorage.getItem('careerPathState');
if(saved){Object.assign(state,JSON.parse(saved));renderProfile(state.ranked)}
else renderExplorer();
