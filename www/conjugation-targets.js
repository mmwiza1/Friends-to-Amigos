(function(root){
'use strict';
// Curated original paradigms, linked to the first useful course model/pattern.
// Gustar/hay deliberately remain contextual practice, not misleading six-person tables.
const persons=['yo','tu','third','nosotros','vosotros','plural'];
const labels=['yo','tú','él / ella / usted','nosotros/as','vosotros/as','ellos / ellas / ustedes'];
const rows=[
 ['llamarse','present','reflexive-ar','A1.1',0,'u0l1',['me llamo','te llamas','se llama','nos llamamos','os llamáis','se llaman']],
 ['hablar','present','regular-ar','A1.1',1,'u1l2',['hablo','hablas','habla','hablamos','habláis','hablan']],
 ['vivir','present','regular-ir','A1.1',1,'u1l0',['vivo','vives','vive','vivimos','vivís','viven']],
 ['ser','present','irregular','A1.1',1,'u1l0',['soy','eres','es','somos','sois','son'],'Ser gives identity/origin. Its present forms must be learnt as a set.'],
 ['tener','present','stem-e-ie','A1.1',1,'u1l1',['tengo','tienes','tiene','tenemos','tenéis','tienen'],'Yo is irregular: tengo. E becomes ie except in nosotros/as and vosotros/as.'],
 ['querer','present','stem-e-ie','A1.1',2,'u2l0',['quiero','quieres','quiere','queremos','queréis','quieren'],'E becomes ie except in nosotros/as and vosotros/as.'],
 ['estar','present','irregular','A1.1',5,'u5l2',['estoy','estás','está','estamos','estáis','están'],'Estar gives a location/state. Remember estoy and the written accents.'],
 ['ir','present','irregular','A1.1',6,'u6l2',['voy','vas','va','vamos','vais','van'],'These present forms express going; ir a + infinitive also expresses a plan.'],
 ['desayunar','present','regular-ar','A1.1',7,'u7l1',['desayuno','desayunas','desayuna','desayunamos','desayunáis','desayunan']],
 ['trabajar','present','regular-ar','A1.1',7,'u7l1',['trabajo','trabajas','trabaja','trabajamos','trabajáis','trabajan']],
 ['preferir','present','stem-e-ie','A1.2',0,'a12u0l2',['prefiero','prefieres','prefiere','preferimos','preferís','prefieren'],'E becomes ie in the stressed forms; preferimos and preferís keep e.'],
 ['poder','present','stem-o-ue','A1.2',1,'a12u1l2',['puedo','puedes','puede','podemos','podéis','pueden'],'O becomes ue except in nosotros/as and vosotros/as. Follow poder with an infinitive.'],
 ['quedar','present','regular-ar','A1.2',2,'a12u2l1',['quedo','quedas','queda','quedamos','quedáis','quedan']],
 ['necesitar','present','regular-ar','A1.2',3,'a12u3l1',['necesito','necesitas','necesita','necesitamos','necesitáis','necesitan']],
 ['llevar','present','regular-ar','A1.2',4,'a12u4l2',['llevo','llevas','lleva','llevamos','lleváis','llevan']],
 ['pagar','present','regular-ar','A1.2',4,'a12u4l2',['pago','pagas','paga','pagamos','pagáis','pagan']],
 ['levantarse','present','reflexive-ar','A1.2',6,'a12u6l0',['me levanto','te levantas','se levanta','nos levantamos','os levantáis','se levantan']],
 ['ducharse','present','reflexive-ar','A1.2',6,'a12u6l1',['me ducho','te duchas','se ducha','nos duchamos','os ducháis','se duchan']],
 ['vestirse','present','reflexive-e-i','A1.2',6,'a12u6l1',['me visto','te vistes','se viste','nos vestimos','os vestís','se visten'],'E becomes i in stressed forms; vestimos and vestís keep e. Match me/te/se/nos/os/se to the person.'],
 ['acostarse','present','reflexive-o-ue','A1.2',6,'a12u6l2',['me acuesto','te acuestas','se acuesta','nos acostamos','os acostáis','se acuestan'],'O becomes ue in stressed forms. Match me/te/se/nos/os/se to the person.'],
 ['comer','present','regular-er','A1.2',7,'a12u7l2',['como','comes','come','comemos','coméis','comen']],
 ['tomar','present','regular-ar','A1.2',7,'a12u7l0',['tomo','tomas','toma','tomamos','tomáis','toman']],
 ['escuchar','present','regular-ar','A1.2',7,'a12u7l0',['escucho','escuchas','escucha','escuchamos','escucháis','escuchan']],
 ['salir','present','irregular-yo','A1.2',7,'a12u7l0',['salgo','sales','sale','salimos','salís','salen'],'Yo is irregular: salgo. Other forms use regular -IR present endings.'],
 ['visitar','present-perfect','compound','A2.1',0,'a21u0l0',['he visitado','has visitado','ha visitado','hemos visitado','habéis visitado','han visitado']],
 ['comer','present-perfect','compound','A2.1',0,'a21u0l1',['he comido','has comido','ha comido','hemos comido','habéis comido','han comido']],
 ['hacer','present-perfect','compound-irregular','A2.1',0,'a21u0l2',['he hecho','has hecho','ha hecho','hemos hecho','habéis hecho','han hecho'],'Hacer has the irregular participle hecho. Change haber, not hecho, for each person.'],
 ['visitar','preterite','regular-ar','A2.1',1,'a21u1l0',['visité','visitaste','visitó','visitamos','visitasteis','visitaron']],
 ['ir','preterite','irregular','A2.1',1,'a21u1l1',['fui','fuiste','fue','fuimos','fuisteis','fueron'],'Ir and ser share these preterite forms. Context tells you which meaning is intended.'],
 ['hacer','preterite','irregular','A2.1',1,'a21u1l2',['hice','hiciste','hizo','hicimos','hicisteis','hicieron'],'The stem is hic-, but the third-person singular is hizo; these forms have no written accent.'],
 ['reservar','present','regular-ar','A2.1',3,'a21u3l0',['reservo','reservas','reserva','reservamos','reserváis','reservan']],
 ['llegar','preterite','spelling-g-gu','A2.1',4,'a21u4l0',['llegué','llegaste','llegó','llegamos','llegasteis','llegaron'],'Yo uses llegué: gu preserves the hard g sound before é. Other forms keep g.'],
 ['doler','present','stem-o-ue','A2.1',5,'a21u5l0',['duelo','dueles','duele','dolemos','doléis','duelen'],'NOT_TABLE'],
 ['necesitar','present-perfect','compound','A2.1',6,'a21u6l0',['he necesitado','has necesitado','ha necesitado','hemos necesitado','habéis necesitado','han necesitado']],
 ['volver','present-perfect','compound-irregular','A2.1',7,'a21u7l0',['he vuelto','has vuelto','ha vuelto','hemos vuelto','habéis vuelto','han vuelto'],'Volver has the irregular participle vuelto. Change haber for the person.'],
 ['tomar','preterite','regular-ar','A2.1',7,'a21u7l1',['tomé','tomaste','tomó','tomamos','tomasteis','tomaron']]
].filter(r=>r[7]!=='NOT_TABLE');
const targets=rows.map(([verb,tense,pattern,stage,unit,source,forms,note])=>({id:'table-'+stage.replace('.','').toLowerCase()+'-'+verb+'-'+tense,verb,tense,pattern,stage,unit,source,forms,accepted:forms.map(x=>[x]),note:note||'',requiredActivities:[...new Set([source,...(stage==='A1.1'?['u1l2']:tense==='present-perfect'?['a21u0l2']:[])])],authorship:'original Friends to Amigos'}));
// Related earlier targets are part of a unit's retrieval, never unlocked by this list.
const unitVerbs={
 'A1.1':[['llamarse'],['llamarse','ser','tener','hablar','vivir'],['querer','tener','ser'],['querer','tener','ser'],['ser','tener'],['estar','ser','tener'],['ir','estar'],['desayunar','trabajar','ir']],
 'A1.2':[['preferir','querer'],['poder','querer','ir'],['quedar','ir','poder'],['necesitar','llevar','querer'],['pagar','llevar','necesitar'],['estar','ser','tener'],['levantarse','ducharse','vestirse','acostarse','desayunar'],['tomar','comer','escuchar','salir','ir']],
 'A2.1':[['visitar','comer','hacer'],['visitar','ir','hacer'],['ser','ir','querer'],['reservar','necesitar','querer'],['llegar','tener','estar'],['tener','estar','necesitar'],['necesitar','poder','tener'],['volver','tomar','ir','llegar','estar']]
};
const endings={'regular-ar':{present:['o','as','a','amos','áis','an'],preterite:['é','aste','ó','amos','asteis','aron']},'regular-ir':{present:['o','es','e','imos','ís','en']},'regular-er':{present:['o','es','e','emos','éis','en']}};
function pattern(t){if(t.tense==='present-perfect')return 'he · has · ha · hemos · habéis · han + participle. The participle stays unchanged. '+t.note;const e=endings[t.pattern]?.[t.tense];if(e)return e.map(x=>'-'+x).join(' · ');if(t.pattern==='reflexive-ar')return 'me · te · se · nos · os · se + -o · -as · -a · -amos · -áis · -an';return t.note;}
function explain(t,row,value){const expected=t.forms[row],other=t.forms.flatMap((f,i)=>f===value?[labels[i]]:[]);let message=value===expected?'Correct. ':other.length?'“'+value+'” belongs to '+other.join(' / ')+', not '+labels[row]+'. ':'For '+labels[row]+', use “'+expected+'”. ';
 const e=endings[t.pattern]?.[t.tense];if(e)message+=t.verb.slice(0,-2)+' + '+e[row]+' → '+expected+'. '+labels[row]+' takes -'+e[row]+' with regular -'+t.verb.slice(-2).toUpperCase()+' verbs in '+(t.tense==='present'?'the present':'the completed-event past')+'.';else message+=pattern(t);return message;
}
root.ConjugationTargets={targets,persons,labels,unitVerbs,pattern,explain};if(typeof module!=='undefined')module.exports=root.ConjugationTargets;
})(typeof window==='undefined'?globalThis:window);
