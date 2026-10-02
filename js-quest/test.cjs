const fs=require('fs'),vm=require('vm'),assert=require('assert');
const sandbox={window:null};sandbox.window=sandbox;vm.createContext(sandbox);
for(const file of ['levels','player','enemy','codeRunner'])vm.runInContext(fs.readFileSync(__dirname+'/js/'+file+'.js','utf8'),sandbox);
const Q=sandbox.Quest;
function run(code,level){let result;const context={self:{postMessage:x=>result=x},console};vm.createContext(context);vm.runInContext('('+Q.workerMain.toString()+')()',context);const state={map:Q.map,hero:new Q.Player(level.hero),enemies:level.enemies.map(e=>new Q.Enemy(e)),items:JSON.parse(JSON.stringify(level.items)),door:level.door?{...level.door,open:false}:null,waves:JSON.parse(JSON.stringify(level.waves||[])),wave:1};context.self.onmessage({data:{code,state}});return result}
for(const l of Q.levels){const r=run(l.solution,l);assert(!r.error,'Level '+l.id+': '+r.error);assert(r.state.hero.health>0);if(l.id===1)assert(r.state.door.open);if(l.id===2||l.id===3)assert(r.state.items.every(i=>i.collected));if(l.id>=4)assert(r.state.enemies.every(e=>e.health===0));assert(l.requiredConcepts.every(c=>r.concepts.includes(c)));if(l.id===6){assert.equal(r.actions.filter(a=>a.type==='attack').length,5);assert.equal(r.actions.filter(a=>a.type==='wave').length,2);assert(r.actions.filter(a=>a.type==='wave').every(a=>a.enemies.every(e=>e.health===25)))}console.log('PASS level '+l.id)}
assert(run('while (true) {}',Q.levels[0]).error.includes('bucle'));
assert(run('hero.attack(',Q.levels[3]).error);
assert(run('window.location.href = "x";',Q.levels[0]).error);
assert(run('console.constructor("return self")();',Q.levels[0]).error);
assert(run('fetch("https://example.com");',Q.levels[0]).error);
assert(run('hero.moveRight(999);',Q.levels[1]).error);
const lost=run('for(let i=0;i<12;i++){hero.moveLeft();hero.moveRight();}',Q.levels[3]);assert(!lost.error);assert.equal(lost.state.hero.health,0);
const wrong=run('hero.moveRight();',Q.levels[1]);assert(!wrong.state.items[0].collected);
const near=run('while(enemy.health>0){hero.attack();}',Q.levels[3]);assert(!near.error);assert.equal(near.state.enemies[0].health,0);
let storage={};sandbox.localStorage={getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v};vm.runInContext(fs.readFileSync(__dirname+'/js/progress.js','utf8'),sandbox);const progress=new Q.ProgressManager();assert(!progress.unlocked(2));progress.complete(Q.levels[0],2);assert(progress.unlocked(2));assert.equal(progress.data.xp,100);progress.complete(Q.levels[0],3);assert.equal(progress.data.xp,100);assert.equal(new Q.ProgressManager().stars,3);
for(const file of fs.readdirSync(__dirname+'/dist/js'))new vm.Script(fs.readFileSync(__dirname+'/js/'+file,'utf8'));
console.log('PASS infinite loop, syntax errors, isolated APIs, action limit, defeat, incorrect solution, while, persistence, replay rewards, syntax');
vm.runInContext(fs.readFileSync(__dirname+'/js/levelManager.js','utf8'),sandbox);const manager=new Q.LevelManager(Q.levels,progress);for(const l of Q.levels){assert(manager.evaluate(l,run(l.solution,l),l.solution).won)}assert(!manager.evaluate(Q.levels[1],run('hero.moveRight();',Q.levels[1]),'hero.moveRight();').won);assert(!manager.evaluate(Q.levels[3],lost,'').won);assert(!manager.canOpen(7));console.log('PASS data-driven objectives and locked-level selection');
