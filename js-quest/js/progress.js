Quest.ProgressManager = class {
 constructor(){this.key='js-quest-progress-v1';this.data={completed:{},xp:0,coins:0,settings:{sound:false},tutorial:false};try{const v=JSON.parse(localStorage.getItem(this.key));if(v&&typeof v==='object'){this.data.completed=Object.fromEntries(Object.entries(v.completed||{}).filter(([id,s])=>Number(id)>=1&&Number(id)<=6&&Number.isInteger(s)&&s>=1&&s<=3));this.data.xp=Math.max(0,Number(v.xp)||0);this.data.coins=Math.max(0,Number(v.coins)||0);this.data.settings.sound=v.settings?.sound===true;this.data.tutorial=v.tutorial===true;}}catch{}this.canSave=true;}
 save(){try{localStorage.setItem(this.key,JSON.stringify(this.data));return true}catch{this.canSave=false;return false}}
 unlocked(id){return id===1||Boolean(this.data.completed[id-1])}
 complete(level,stars){const previous=this.data.completed[level.id]||0;this.data.completed[level.id]=Math.max(previous,stars);if(!previous){this.data.xp+=level.rewards.xp;this.data.coins+=level.rewards.coins}this.save();return !previous}
 get stars(){return Object.values(this.data.completed).reduce((a,b)=>a+b,0)}
 get next(){return Quest.levels.find(l=>!this.data.completed[l.id])?.id||6}
};
