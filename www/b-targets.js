(function(root){
'use strict';
// Original curated paradigms; source is the first useful authored course model.
// Compound forms retain their participle. No impersonal or construction-only tables.
const rows=[
 ['ser','conditional','regular-conditional','B1.2',5,'b12u5l2',['sería','serías','sería','seríamos','seríais','serían'],'Keep ser and add conditional endings; sería is shared by yo and él/ella/usted.'],
 ['hacer','conditional','irregular-conditional','B1.2',5,'b12u5story0',['haría','harías','haría','haríamos','haríais','harían'],'Use har- plus conditional endings for an imagined action.'],
 ['preparar','pluperfect','compound','B2.2',1,'b22u1l0',['había preparado','habías preparado','había preparado','habíamos preparado','habíais preparado','habían preparado'],'Use imperfect haber plus preparado for preparation completed before a later past event.'],
 ['ir','future','regular-future','B1.1',2,'b11u2l0',['iré','irás','irá','iremos','iréis','irán'],'Ir keeps the infinitive ir- and takes é, ás, á, emos, éis, án.'],
 ['tener','future','irregular-future','B1.1',2,'b11u2l1',['tendré','tendrás','tendrá','tendremos','tendréis','tendrán'],'The future stem is tendr-, not tener-. Add é, ás, á, emos, éis, án.'],
 ['hacer','future','irregular-future','B1.1',2,'b11u2l2',['haré','harás','hará','haremos','haréis','harán'],'Hacer uses the future stem har-.'],
 ['poder','future','irregular-future','B1.1',2,'b11u2l2',['podré','podrás','podrá','podremos','podréis','podrán'],'Poder uses the future stem podr-.'],
 ['pedir','future','regular-future','B1.1',7,'b11u7l2',['pediré','pedirás','pedirá','pediremos','pediréis','pedirán'],'Keep the infinitive pedir and add é, ás, á, emos, éis, án.'],
 ['deber','conditional','regular-conditional','B1.1',3,'b11u3l0',['debería','deberías','debería','deberíamos','deberíais','deberían'],'Keep deber and add ía, ías, ía, íamos, íais, ían. Deberías gives advice rather than describing an obligation as a fact.'],
 ['poder','conditional','irregular-conditional','B1.1',3,'b11u3l1',['podría','podrías','podría','podríamos','podríais','podrían'],'Use podr- plus ía, ías, ía, íamos, íais, ían. Conditional can make an option or request less direct.'],
 ['pedir','conditional','regular-conditional','B1.1',3,'b11u3l1',['pediría','pedirías','pediría','pediríamos','pediríais','pedirían'],'Keep pedir and add conditional endings. Yo que tú, pediría presents advice as an imagined action.'],
 ['ir','conditional','regular-conditional','B1.2',5,'b12u5l0',['iría','irías','iría','iríamos','iríais','irían'],'Keep ir and add conditional endings; iría is shared by yo and él/ella/usted.'],
 ['tener','conditional','irregular-conditional','B1.2',5,'b12u5l2',['tendría','tendrías','tendría','tendríamos','tendríais','tendrían'],'Tener uses tendr- plus conditional endings: tendría que cambiar de trabajo.'],
 ['venir','present-subjunctive','irregular-subjunctive','B1.2',6,'b12u6l0',['venga','vengas','venga','vengamos','vengáis','vengan'],'Venir uses veng- in the present subjunctive. A wish concerning another subject can introduce this form: quiero que vengas.'],
 ['tener','present-subjunctive','irregular-subjunctive','B1.2',6,'b12u6l1',['tenga','tengas','tenga','tengamos','tengáis','tengan'],'Tener uses teng- in present subjunctive. Es importante que tengamos tiempo evaluates a desired situation, rather than asserting it.'],
 ['estar','present-subjunctive','irregular-subjunctive','B1.2',6,'b12u6l1',['esté','estés','esté','estemos','estéis','estén'],'Remember the accents: esté, estés, estén; estemos has none. Meaning and the preceding expression determine mood.'],
 ['ser','present-subjunctive','irregular-subjunctive','B2.1',2,'b21u2l2',['sea','seas','sea','seamos','seáis','sean'],'Ser has the irregular subjunctive stem se-. Es posible que sea describes a possibility without asserting it.'],
 ['poder','present-subjunctive','stem-changing-subjunctive','B2.1',2,'b21u2l0',['pueda','puedas','pueda','podamos','podáis','puedan'],'Poder changes o to ue in stressed forms; podamos and podáis retain o.'],
 ['empezar','pluperfect','compound','B2.1',0,'b21u0l0',['había empezado','habías empezado','había empezado','habíamos empezado','habíais empezado','habían empezado'],'Use imperfect haber plus empezado for an action already completed before another past point. Yo and third-person singular share había.'],
 ['confirmar','imperfect-subjunctive','regular-subjunctive-ar','B2.1',4,'b21u4l0',['confirmara','confirmaras','confirmara','confirmáramos','confirmarais','confirmaran'],'This -ra set appears in a polite request with agradecería que. Form it from confirmaron without -ron, then add ra, ras, ra, ramos, rais, ran; nosotros needs an accent. The -se set is also valid.'],
 ['tener','imperfect-subjunctive','irregular-subjunctive','B2.1',6,'b21u6l0',['tuviera','tuvieras','tuviera','tuviéramos','tuvierais','tuvieran'],'Use tuvie- plus ra endings in this imagined condition: si tuviera tiempo, iría. Do not put conditional tendría after si in this pattern.'],
 ['poder','imperfect-subjunctive','irregular-subjunctive','B2.1',6,'b21u6l2',['pudiera','pudieras','pudiera','pudiéramos','pudierais','pudieran'],'Use pudie- plus ra endings. Pudiera describes an imagined condition, not a confirmed past possibility.'],
 ['pedir','conditional-perfect','compound','B2.2',1,'b22u1l1',['habría pedido','habrías pedido','habría pedido','habríamos pedido','habríais pedido','habrían pedido'],'Use conditional haber plus pedido for an imagined alternative before now: habría pedido ayuda antes. It does not assert that the request happened.'],
 ['mantener','present-subjunctive','irregular-subjunctive','B2.2',3,'b22u3l0',['mantenga','mantengas','mantenga','mantengamos','mantengáis','mantengan'],'Mantener uses manteng- in subjunctive. A condition such as siempre que mantengamos requires the mood here.'],
 ['cambiar','present-perfect-subjunctive','compound','B2.2',6,'b22u6l1',['haya cambiado','hayas cambiado','haya cambiado','hayamos cambiado','hayáis cambiado','hayan cambiado'],'Use present subjunctive haber plus unchanged cambiado after a trigger such as es posible que. The change may be completed, but is not asserted as certain.'],
 ['comprobar','pluperfect-subjunctive','compound','B2.2',6,'b22u6l0',['hubiera comprobado','hubieras comprobado','hubiera comprobado','hubiéramos comprobado','hubierais comprobado','hubieran comprobado'],'Use hubiera etc. plus comprobado for the imagined past condition. The -se forms hubiera/hubiese etc. are alternatives; the consequence can use habríamos evitado.'],
 ['evitar','conditional-perfect','compound','B2.2',6,'b22u6l0',['habría evitado','habrías evitado','habría evitado','habríamos evitado','habríais evitado','habrían evitado'],'Use conditional haber plus evitado for an imagined past consequence: si hubiéramos comprobado…, habríamos evitado….']
];
root.BTargets=rows;if(typeof module!=='undefined')module.exports=rows;
})(typeof window==='undefined'?globalThis:window);
