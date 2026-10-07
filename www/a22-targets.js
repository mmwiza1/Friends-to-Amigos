(function(root){
'use strict';
// Original curated A2.2 paradigms. References document teaching, not an extra syllabus.
const rows=[
 ['trabajar','imperfect','regular-ar','A2.2',0,'a22u0l1',['trabajaba','trabajabas','trabajaba','trabajábamos','trabajabais','trabajaban']],
 ['vivir','imperfect','regular-ir','A2.2',0,'a22u0l0',['vivía','vivías','vivía','vivíamos','vivíais','vivían']],
 ['tener','imperfect','regular-er','A2.2',0,'a22u0l2',['tenía','tenías','tenía','teníamos','teníais','tenían']],
 ['ser','imperfect','irregular','A2.2',0,'a22u0l2',['era','eras','era','éramos','erais','eran'],'Ser has irregular imperfect forms. Era describes a former identity or characteristic; it does not by itself report an event.'],
 ['ir','imperfect','irregular','A2.2',0,'a22u0l2',['iba','ibas','iba','íbamos','ibais','iban'],'Ir has the imperfect stem ib-. Iba can describe a former routine; ir a + infinitive in the imperfect can describe a past intention.'],
 ['hacer','imperfect','regular-er','A2.2',0,'a22u0l2',['hacía','hacías','hacía','hacíamos','hacíais','hacían']],
 ['estar','imperfect','regular-ar','A2.2',1,'a22u1l2',['estaba','estabas','estaba','estábamos','estabais','estaban']],
 ['estudiar','imperfect','regular-ar','A2.2',0,'a22u0l1',['estudiaba','estudiabas','estudiaba','estudiábamos','estudiabais','estudiaban']],
 ['comer','preterite','regular-er','A2.2',1,'a22u1l0',['comí','comiste','comió','comimos','comisteis','comieron']],
 ['vivir','preterite','regular-ir','A2.2',1,'a22u1l1',['viví','viviste','vivió','vivimos','vivisteis','vivieron']],
 ['salir','preterite','regular-ir','A2.2',1,'a22u1l2',['salí','saliste','salió','salimos','salisteis','salieron']],
 ['perder','preterite','regular-er','A2.2',2,'a22u2l0',['perdí','perdiste','perdió','perdimos','perdisteis','perdieron']],
 ['tener','preterite','irregular','A2.2',2,'a22u2l1',['tuve','tuviste','tuvo','tuvimos','tuvisteis','tuvieron'],'Use the irregular stem tuv- with e, iste, o, imos, isteis, ieron. Tuve que reports a particular obligation; tenía que frames an ongoing/background obligation.'],
 ['poder','preterite','irregular','A2.2',2,'a22u2l2',['pude','pudiste','pudo','pudimos','pudisteis','pudieron'],'Use the irregular stem pud-. Pude reports success/possibility on a particular occasion; no pude reports that an action was not possible on that occasion.'],
 ['decir','preterite','irregular','A2.2',3,'a22u3l2',['dije','dijiste','dijo','dijimos','dijisteis','dijeron'],'Decir uses dij-. The plural is dijeron, not dijieron. These irregular forms have no written accent.'],
 ['venir','preterite','irregular','A2.2',4,'a22u4l1',['vine','viniste','vino','vinimos','vinisteis','vinieron'],'Venir uses the irregular stem vin-. Vine reports a particular completed arrival, not a regular -IR form.'],
 ['querer','preterite','irregular','A2.2',4,'a22u4l2',['quise','quisiste','quiso','quisimos','quisisteis','quisieron'],'Querer uses quis-. In no quise comprar, the speaker declined a particular purchase. Do not treat every imperfect wanted as interchangeable with quise.'],
 ['estar','preterite','irregular','A2.2',5,'a22u5l0',['estuve','estuviste','estuvo','estuvimos','estuvisteis','estuvieron'],'Estar uses estuv-. Estuve presents a stay/state as a completed whole; estaba describes the background or an ongoing state.'],
 ['ver','preterite','irregular','A2.2',6,'a22u6l2',['vi','viste','vio','vimos','visteis','vieron'],'Ver has short preterite forms: vi and vio have no written accent. These report a completed viewing.'],
 ['ir','present-perfect','compound-irregular','A2.2',7,'a22u7l1',['he ido','has ido','ha ido','hemos ido','habéis ido','han ido'],'Ir uses the participle ido. Change haber for the person; keep ido unchanged.']
];
root.A22Targets=rows;if(typeof module!=='undefined')module.exports=rows;
})(typeof window==='undefined'?globalThis:window);
