(function(root){
'use strict';
// Original, bounded vocabulary for the reviewed v1.5 episodes. Append/enrich,
// never remove or rename the existing learner lexicon and Saved Words identities.
const rows=[
 ['tostadora','f','toaster','La tostadora está desenchufada.',['tostadoras']],
 ['boda','f','wedding','Nos hemos equivocado de boda.',['bodas']],
 ['terraza','f','terrace','El piso no tiene terraza.',['terrazas']],
 ['ajedrez','m','chess','Jugamos al ajedrez en el parque.',[]],
 ['portera','f','building caretaker (woman)','La portera abrió la puerta.',['porteras']],
 ['planta','f','plant','La planta está junto a la ventana.',['plantas']],
 ['reflejo','m','reflection','La foto muestra un reflejo.',['reflejos']],
 ['plano','m','floor plan; map','Necesito un plano del piso.',['planos']],
 ['acreditación','f','ID badge; credential','Mi acreditación aparece en la foto.',['acreditaciones']],
 ['vestíbulo','m','hall; lobby','Nos vemos en el vestíbulo.',['vestíbulos']],
 ['tarta','f','cake','Traigo una tarta para compartir.',['tartas']],
 ['trozo','m','piece','¿Quieres un trozo de tarta?',['trozos']],
 ['vela','f','candle','Luis trae una vela para la tarta.',['velas']],
 ['ocasión','f','occasion','No hace falta una ocasión especial.',['ocasiones']],
 ['postre','m','dessert','El postre estaba incluido.',['postres']],
 ['escaparate','m','shop window','Hay zapatos en el escaparate.',['escaparates']],
 ['cerámica','f','ceramics; ceramic material','El perro es de cerámica.',[]],
 ['atribución','f','attribution: identifying whose claim something is','La atribución de esa frase a Marta no era correcta.',['atribuciones']]
];
function apply(data){for(const [lemma,gender,meaning,example,aliases]of rows){const id='lex-word-'+lemma;let e=data.entries.find(e=>e.id===id);if(!e){e={id,kind:'word',lemma,pos:'noun',meaning,senses:[],examples:[],notes:[],sources:['original-story-v1.5'],aliases:[lemma]};data.entries.push(e);}if(e.pos==='noun'){e.gender=gender;const note=(gender==='f'?'Feminine':'Masculine')+' noun.';if(!e.notes.includes(note))e.notes.push(note);}if(!e.examples.includes(example)&&e.examples.length<3)e.examples.push(example);for(const alias of aliases)if(!e.aliases.includes(alias))e.aliases.push(alias);if(lemma==='planta'&&!e.senses.some(s=>s.meaning==='floor; storey'))e.senses.push({meaning:'floor; storey',example:'Vivo en la segunda planta.',stage:'A1.2',source:'original-story-v1.5'});if(lemma==='vela'&&!e.senses.some(s=>s.meaning==='sail'))e.senses.push({meaning:'sail',example:'La vela del barco es blanca.',stage:'A2.1',source:'original-story-v1.5'});}return data;}
root.StoryVocabulary={rows,apply};if(typeof module!=='undefined')module.exports=root.StoryVocabulary;
})(typeof window==='undefined'?globalThis:window);
