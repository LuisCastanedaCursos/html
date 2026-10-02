Quest.LevelManager = class {
 constructor(levels,progress){this.levels=levels;this.progress=progress;this.validators={greeting:s=>Boolean(s.door?.open),collect:s=>s.items.length>0&&s.items.every(i=>i.collected),variableCollect:(s,c)=>this.validators.collect(s)&&c.has('let'),defeat:s=>s.enemies.every(e=>e.health<=0)&&!s.waves.length,conditionalDefeat:(s,c)=>this.validators.defeat(s)&&c.has('if'),loopDefeat:(s,c)=>this.validators.defeat(s)&&c.has('for')};}
 get(id){return this.levels.find(level=>level.id===id)}
 canOpen(id){return Boolean(this.get(id))&&this.progress.unlocked(id)}
 evaluate(level,result,code){const concepts=new Set(result.concepts),s=result.state;const won=s.hero.health>0&&Boolean(this.validators[level.winCondition]?.(s,concepts));const lines=code.split('\n').filter(l=>l.trim()&&!l.trim().startsWith('//')).length;return {won,stars:1+(lines<=7?1:0)+(level.requiredConcepts.every(c=>concepts.has(c))?1:0)}}
};
