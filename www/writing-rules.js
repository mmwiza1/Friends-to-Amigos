(function(root){
'use strict';
const stages=['A1.1','A1.2','A2.1','A2.2','B1.1','B1.2','B2.1','B2.2'];
// Each trigger is local, bounded and deliberately narrow. Authored accepted variants win.
const rows=[
 ['AGE_USES_TENER',0,/\b(?:yo )?(?:soy|estoy) (?:[0-9]+|veinte|veintiun|diecinueve|treinta) años\b/,'tener-age','For age, use tener: tengo … años. Spanish says “I have … years”, not “I am … years”.','Tengo veinte años.'],
 ['HUNGER_THIRST_TENER',0,/\b(?:soy|estoy) (?:hambre|sed)\b/,'tener-expressions','Use tengo hambre / tengo sed. Hambre and sed are nouns; these expressions use tener.','Tengo hambre.'],
 ['NAME_ME_NOT_MI',0,/\bmi llamo\b/,'reflexive-pronoun','Me refers to yourself in me llamo. Mi means “my” and cannot replace me here.','Me llamo Ana.'],
 ['NAME_NOT_SOY_LLAMO',0,/\bsoy llamo\b/,'reflexive-pronoun','Llamarse already changes for the speaker: me llamo. Do not put soy before llamo.','Me llamo Ana.'],
 ['GUSTAR_NOT_YO_GUSTO',0,/\byo gusto (?:el|la|los|las|leer|comer)\b/,'gustar-structure','Use me gusta / me gustan for “I like”. The thing liked controls gusta or gustan.','Me gusta leer.'],
 ['GUSTAR_PLURAL',1,/\bme gusta (?:los libros|las peliculas|los zapatos|las camisas)\b/,'gustar-number','Plural things take gustan: me gustan los libros. Me tells us who likes them.','Me gustan los libros.'],
 ['GUSTAR_INFINITIVE',0,/\bme gustan (?:leer|comer|viajar|estudiar)\b/,'gustar-number','An activity expressed by an infinitive takes singular gusta.','Me gusta leer.'],
 ['A_EL_CONTRACTION',0,/\b(?:voy|vas|vamos|va|vais|van|fui|fue) a el (?:parque|cine|cafe|trabajo)\b/,'a-el-al','A + el contracts to al before this common noun. Proper names/titles such as El País are different.','Voy al parque.'],
 ['DE_EL_CONTRACTION',0,/\b(?:cerca|lejos|delante|detras) de el (?:parque|cine|cafe|hotel)\b/,'de-el-del','De + el contracts to del before this common noun.','Está cerca del hotel.'],
 ['PLAN_NEEDS_A',1,/\b(?:voy|vas|va|vamos|vais|van) (?:comprar|comer|salir|estudiar|descansar)\b/,'ir-a-infinitive','Put a between ir and the infinitive when expressing a plan.','Voy a estudiar.'],
 ['REFLEXIVE_MI_ROUTINE',1,/\bmi (?:levanto|ducho|visto|acuesto)\b/,'reflexive-pronoun','Use me for your own routine; mi means “my”.','Me levanto a las ocho.'],
 ['ARTICLE_GENDER_KNOWN',0,/\b(?:el camiseta (?:es|esta|roja)|la libro (?:es|esta|rojo)|un mesa (?:grande|pequena)|una ordenador (?:nuevo|viejo)|(?:tengo|quiero|necesito) una ordenador)\b/,'article-gender','Match the article to the noun: la camiseta, el libro, una mesa, un ordenador.','La camiseta es roja.'],
 ['ADJECTIVE_GENDER_KNOWN',0,/\b(?:camiseta rojo|libro roja|hermana alto|hermano alta)\b/,'adjective-gender','The describing word agrees with the noun: camiseta roja / libro rojo; hermana alta / hermano alto.','La camiseta es roja.'],
 ['ADJECTIVE_NUMBER_KNOWN',0,/\b(?:libros rojo|camisetas roja|zapatos negro)\b/,'adjective-number','Plural nouns need plural describing words: libros rojos, camisetas rojas, zapatos negros.','Los libros son rojos.'],
 ['LOCATION_ESTAR',0,/\b(?:el movil|las llaves) (?:es|son) (?:en|encima de|debajo de)\b/,'ser-estar','Use estar for the location of an object: está / están. This rule concerns location, not identity.','El móvil está en la mesa.'],
 ['STATE_ESTAR',0,/\b(?:soy cansado|soy cansada)\b/,'ser-estar','Use estar for feeling tired now: estoy cansado/a.','Estoy cansada.'],
 ['ORIGIN_SER',0,/\bestoy de (?:espana|inglaterra|madrid|toledo)\b/,'ser-estar','Origin uses ser: soy de. Estoy en describes where you are now.','Soy de España.'],
 ['REGULAR_PAST_IRREGULAR',2,/\b(?:he hacido|he volvido|he escribido)\b/,'irregular-participle','These participles are irregular: hecho, vuelto and escrito. Keep haber and change the participle.','He hecho la reserva.'],
 ['POR_PARA_PURPOSE',4,/\bestudio español por poder hablar con mis vecinos\b/,'por-para','Here the second action is your purpose: para poder hablar. Por introduces reasons or other relationships.','Estudio español para poder hablar con mis vecinos.'],
 ['WISH_DISTINCT_SUBJECT',5,/\bquiero que tu (?:vienes|viene)\b/,'subjunctive-trigger','With quiero que and another person doing the action, use present subjunctive: vengas.','Quiero que tú vengas.'],
 ['NECESSITY_SUBJUNCTIVE',5,/\bes importante que nosotros tenemos\b/,'subjunctive-trigger','Es importante que introduces an action being evaluated, so use tengamos here.','Es importante que nosotros tengamos tiempo.'],
 ['DOUBT_SUBJUNCTIVE',6,/\bno creo que (?:el|ella|usted) tiene\b/,'subjunctive-trigger','No creo que expresses doubt here and takes tenga, not tiene. Positive creo que normally takes indicative.','No creo que ella tenga tiempo.'],
 ['HYPOTHETICAL_SI',6,/\bsi tendria (?:tiempo|dinero)\b/,'hypothetical-condition','For this imagined present condition, use si tuviera …, followed by a conditional result.','Si tuviera tiempo, iría.']
];
const rules=rows.map(([id,index,pattern,category,explanation,model])=>({id,stages:stages.slice(index),pattern,category,explanation,model,confidence:'high',provenance:'first-party-authored'}));
const firstUnits={POR_PARA_PURPOSE:5,WISH_DISTINCT_SUBJECT:6,NECESSITY_SUBJUNCTIVE:6,DOUBT_SUBJUNCTIVE:2,HYPOTHETICAL_SI:6};
function diagnose(value,stage,normalize,unit=7){const clean=normalize(value);return rules.filter(r=>r.stages.includes(stage)&&(stage!==r.stages[0]||unit>=(firstUnits[r.id]||0))&&r.pattern.test(clean)).map(({id,category,explanation,model,confidence,provenance})=>({id,category,explanation,model,confidence,provenance}));}
root.WritingRules={rules,diagnose};if(typeof module!=='undefined')module.exports=root.WritingRules;
})(typeof window==='undefined'?globalThis:window);
