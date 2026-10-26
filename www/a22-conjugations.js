(function(root){
'use strict';
const T=typeof module!=='undefined'?require('./conjugation-targets.js'):root.ConjugationTargets;
// Each numbered context is original and permanent; paradigms have one curated source.
const rows=[
 [
  1,
  0,
  "Antes yo ___ en Madrid, pero ahora vivo en Toledo.",
  "vivir:imperfect:0"
 ],
 [
  2,
  0,
  "Cuando eras pequeño, ¿tú ___ al parque cada domingo?",
  "ir:imperfect:1"
 ],
 [
  3,
  0,
  "Ana ___ en el café todas las mañanas antes de cambiar de trabajo.",
  "trabajar:imperfect:2"
 ],
 [
  4,
  0,
  "De pequeños, nosotros ___ un perro y dos gatos.",
  "tener:imperfect:3"
 ],
 [
  5,
  0,
  "¿Vosotros ___ inglés por las tardes cuando vivíais en Madrid?",
  "estudiar:imperfect:4"
 ],
 [
  6,
  0,
  "Luis y Marta ___ vecinos antes de mudarse.",
  "ser:imperfect:5"
 ],
 [
  7,
  0,
  "Antes nosotros ___ al trabajo andando y Ana ___ el desayuno en casa.",
  "ir:imperfect:3 hacer:imperfect:2"
 ],
 [
  8,
  0,
  "Mi casa ___ pequeña; vosotros ___ cerca y nosotros ___ juntos.",
  "ser:imperfect:2 vivir:imperfect:4 estudiar:imperfect:3"
 ],
 [
  9,
  1,
  "Ayer yo ___ en el café y después salí.",
  "comer:preterite:0"
 ],
 [
  10,
  1,
  "¿Tú ___ de casa a las ocho ayer?",
  "salir:preterite:1"
 ],
 [
  11,
  1,
  "Marta ___ en Toledo durante dos años; después volvió a Madrid.",
  "vivir:preterite:2"
 ],
 [
  12,
  1,
  "Nosotros ___ pan antes del viaje del sábado pasado.",
  "comer:preterite:3"
 ],
 [
  13,
  1,
  "¿Vosotras ___ del café antes de la lluvia ayer?",
  "salir:preterite:4"
 ],
 [
  14,
  1,
  "Ana y Luis ___ en ese piso desde 2018 hasta 2020.",
  "vivir:preterite:5"
 ],
 [
  15,
  1,
  "Yo ___ en el café normalmente, pero ayer ___ en casa.",
  "comer:present:0 comer:preterite:0"
 ],
 [
  16,
  1,
  "Antes yo ___ en Madrid; tú ___ en Toledo un año y después ___ a Madrid.",
  "vivir:imperfect:0 vivir:preterite:1 ir:preterite:1"
 ],
 [
  17,
  2,
  "Yo ___ el tren ayer porque llegué tarde.",
  "perder:preterite:0"
 ],
 [
  18,
  2,
  "¿Tú ___ llegar antes de las nueve ayer?",
  "poder:preterite:1"
 ],
 [
  19,
  2,
  "Ana ___ que cambiar de autobús en Madrid ayer.",
  "tener:preterite:2"
 ],
 [
  20,
  2,
  "Nosotros ___ el autobús de las seis, así que tomamos el de las siete.",
  "perder:preterite:3"
 ],
 [
  21,
  2,
  "¿Vosotros ___ salir cuando anunciaron el retraso ayer?",
  "poder:preterite:4"
 ],
 [
  22,
  2,
  "Luis y Marta ___ que comprar otro billete ayer.",
  "tener:preterite:5"
 ],
 [
  23,
  2,
  "Yo ___ una cita cuando ___ el tren ayer.",
  "tener:imperfect:0 perder:preterite:0"
 ],
 [
  24,
  2,
  "Nosotros ___ llegar a tiempo, pero Ana ___ el tren y ___ que avisar.",
  "poder:preterite:3 perder:preterite:2 tener:preterite:2"
 ],
 [
  25,
  3,
  "Ayer yo ___ al camarero que faltaba un café.",
  "decir:preterite:0"
 ],
 [
  26,
  3,
  "¿Tú ___ que no querías carne cuando pediste ayer?",
  "decir:preterite:1"
 ],
 [
  27,
  3,
  "El camarero ___ que la sopa llevaba pollo.",
  "decir:preterite:2"
 ],
 [
  28,
  3,
  "Nosotros ___ que la cuenta no estaba bien.",
  "decir:preterite:3"
 ],
 [
  29,
  3,
  "¿Vosotras ___ que queríais dos botellas de agua?",
  "decir:preterite:4"
 ],
 [
  30,
  3,
  "Ana y Marta ___ que faltaba una ensalada.",
  "decir:preterite:5"
 ],
 [
  31,
  3,
  "Yo ___ dos cafés hoy; ayer nosotros ___ té.",
  "querer:present:0 tomar:preterite:3"
 ],
 [
  32,
  3,
  "Nosotros ___ en el restaurante ayer; Ana ___ que la sopa ___ fría.",
  "comer:preterite:3 decir:preterite:2 estar:imperfect:2"
 ],
 [
  33,
  4,
  "Ayer yo ___ a cambiar esta camiseta.",
  "venir:preterite:0"
 ],
 [
  34,
  4,
  "¿Tú ___ comprar la bolsa rota ayer?",
  "querer:preterite:1"
 ],
 [
  35,
  4,
  "Ana ___ con el recibo esta mañana.",
  "venir:preterite:2"
 ],
 [
  36,
  4,
  "Nosotros no ___ comprar la chaqueta porque era demasiado pequeña.",
  "querer:preterite:3"
 ],
 [
  37,
  4,
  "¿Vosotras ___ a la tienda ayer con Marta?",
  "venir:preterite:4"
 ],
 [
  38,
  4,
  "Luis y Diego no ___ comprar sin probar la talla.",
  "querer:preterite:5"
 ],
 [
  39,
  4,
  "Yo ___ a la tienda ayer y ___ cambiar la camiseta.",
  "venir:preterite:0 querer:preterite:0"
 ],
 [
  40,
  4,
  "Ana ___ a cambiar su chaqueta; nosotros no ___ comprar y vosotros ___ allí.",
  "venir:preterite:2 querer:preterite:3 estar:present:4"
 ],
 [
  41,
  5,
  "Ayer yo ___ en la estación hasta las ocho; luego me fui.",
  "estar:preterite:0"
 ],
 [
  42,
  5,
  "¿Tú ___ en el café hasta las seis ayer?",
  "estar:preterite:1"
 ],
 [
  43,
  5,
  "Marta ___ en casa toda la tarde ayer, pero hoy sale.",
  "estar:preterite:2"
 ],
 [
  44,
  5,
  "Nosotros ___ en el parque una hora y después volvimos al café.",
  "estar:preterite:3"
 ],
 [
  45,
  5,
  "¿Vosotras ___ en Toledo todo el sábado?",
  "estar:preterite:4"
 ],
 [
  46,
  5,
  "Ana y Luis ___ en la estación desde las cinco hasta las siete.",
  "estar:preterite:5"
 ],
 [
  47,
  5,
  "Yo ___ el tren, así que nosotros ___ a quedar más tarde.",
  "perder:preterite:0 ir:present:3"
 ],
 [
  48,
  5,
  "Tú ___ en el café hasta las nueve; nosotros no ___ llegar y ahora ___ ir mañana.",
  "estar:preterite:1 poder:preterite:3 querer:present:3"
 ],
 [
  49,
  6,
  "Ayer yo ___ una película; creo que era muy buena.",
  "ver:preterite:0"
 ],
 [
  50,
  6,
  "¿Tú ___ la misma película que Ana ayer?",
  "ver:preterite:1"
 ],
 [
  51,
  6,
  "Marta ___ la película y después dio su opinión.",
  "ver:preterite:2"
 ],
 [
  52,
  6,
  "Nosotros ___ dos películas el sábado pasado, no hoy.",
  "ver:preterite:3"
 ],
 [
  53,
  6,
  "¿Vosotras ___ el final antes de salir del cine?",
  "ver:preterite:4"
 ],
 [
  54,
  6,
  "Luis y Diego ___ la película ayer y hablaron de la música.",
  "ver:preterite:5"
 ],
 [
  55,
  6,
  "Yo ___ la película ayer, pero hoy ___ ir al parque.",
  "ver:preterite:0 preferir:present:0"
 ],
 [
  56,
  6,
  "Nosotros ___ la película ayer; Marta ___ que era larga y vosotros ___ el café hoy.",
  "ver:preterite:3 decir:preterite:2 preferir:present:4"
 ],
 [
  57,
  7,
  "Esta semana yo ___ a Toledo, pero ayer fui a Madrid.",
  "ir:perfect:0"
 ],
 [
  58,
  7,
  "¿Tú ___ al museo esta semana o vas mañana?",
  "ir:perfect:1"
 ],
 [
  59,
  7,
  "Ana ___ al parque hoy y ahora está en casa.",
  "ir:perfect:2"
 ],
 [
  60,
  7,
  "Nosotros ___ al café dos veces esta semana.",
  "ir:perfect:3"
 ],
 [
  61,
  7,
  "¿Vosotros ___ ya a la estación hoy?",
  "ir:perfect:4"
 ],
 [
  62,
  7,
  "Luis y Marta ___ a Toledo esta semana, pero ahora están en Madrid.",
  "ir:perfect:5"
 ],
 [
  63,
  7,
  "Yo ___ el tren ayer, pero nosotros ___ llegar juntos al museo.",
  "perder:preterite:0 poder:preterite:3"
 ],
 [
  64,
  7,
  "Antes nosotros ___ cerca; esta semana ___ a Toledo y ayer ___ en el museo.",
  "vivir:imperfect:3 ir:perfect:3 estar:preterite:3"
 ]
];
function create(){return rows.map(([number,unit,sentence,codes])=>{const blanks=codes.split(' ').map(code=>{let [verb,tense,index]=code.split(':');tense=tense==='perfect'?'present-perfect':tense;index=Number(index);const t=T.targets.find(t=>t.verb===verb&&t.tense===tense);if(!t)throw Error('Missing curated target '+code);const answer=t.forms[index],options=[answer,...[...new Set(t.forms)].filter(x=>x!==answer).slice(0,3)];return {verb,tense,person:T.persons[index],answer,infinitive:number%4===0?null:verb,source:t.consolidationSource||t.source,concept:tense==='present'?t.pattern:tense,options,explanation:T.explain(t,index,answer),mistakes:Object.fromEntries(options.filter(x=>x!==answer).map(x=>[x,T.explain(t,index,x)]))};});return {id:'conj-a22-'+String(number).padStart(3,'0'),stage:'A2.2',unit,difficulty:Math.min(4,blanks.length+2),sentence,blanks,concepts:[...new Set(blanks.flatMap(b=>[b.concept,'person-'+b.person]))],explanation:'Match each verb to its subject and the time in the sentence.',requiredActivities:[...new Set([0,1,2].map(n=>'a22u'+unit+'l'+n).concat(blanks.map(b=>b.source)))],authorship:'original Friends to Amigos'};});}
root.A22Conjugations={create};if(typeof module!=='undefined')module.exports=root.A22Conjugations;
})(typeof window==='undefined'?globalThis:window);
