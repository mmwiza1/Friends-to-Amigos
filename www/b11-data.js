(function(root){
'use strict';
const data={
 "stage": "B1.1",
 "code": "b11",
 "units": [
  {
   "title": "Telling the story",
   "goal": "Narrate an unexpected event with background, sequence and outcome",
   "grammar": "Past integration; primero, mientras, de repente, al final",
   "core": [
    {
     "model": "Estaba esperando el autobús cuando empezó a llover.",
     "translation": "I was waiting for the bus when it started to rain.",
     "gap": "Estaba",
     "gapWrong": [
      "Estuve",
      "Estoy"
     ],
     "wrong": [
      "Estuve esperando el autobús cuando empezó a llover.",
      "Estoy esperando el autobús cuando empezó a llover."
     ],
     "why": "Estaba frames the ongoing scene; empezó introduces a new event.",
     "ask": "Elige la frase que comunica: «I was waiting for the bus when it started to rain.».",
     "help": "Choose the response meaning: I was waiting for the bus when it started to rain.",
     "dialogue": [
      "Luis: «¿Qué hacías cuando empezó la lluvia?»",
      "Choose the appropriate response to this exchange.",
      "Estaba esperando el autobús.",
      [
       "Esperaré ayer.",
       "He esperado mañana."
      ],
      "Estaba frames the ongoing scene; empezó introduces a new event."
     ],
     "transfer": [
      "Esperabas el tren. De repente llegó Marta. Cuenta el encuentro.",
      "Respond to the Spanish situation using the taught language.",
      "Estaba esperando el tren cuando llegó Marta.",
      [],
      "Estaba frames the ongoing scene; empezó introduces a new event."
     ]
    },
    {
     "model": "Primero llamé a Luis y después buscamos un taxi.",
     "translation": "First I called Luis and then we looked for a taxi.",
     "gap": "llamé",
     "gapWrong": [
      "llamaba",
      "llamaré"
     ],
     "wrong": [
      "Primero llamaba a Luis y después buscamos un taxi.",
      "Primero llamaré a Luis y después buscamos un taxi."
     ],
     "why": "These completed actions follow a clear order.",
     "ask": "Elige la frase que comunica: «First I called Luis and then we looked for a taxi.».",
     "help": "Choose the response meaning: First I called Luis and then we looked for a taxi.",
     "dialogue": [
      "Marta: «¿Qué hicisteis después de la llamada?»",
      "Choose the appropriate response to this exchange.",
      "Buscamos un taxi.",
      [
       "Buscaremos ayer.",
       "Llamaremos mañana."
      ],
      "These completed actions follow a clear order."
     ],
     "transfer": [
      "Primero compraste el billete; después subiste al tren.",
      "Respond to the Spanish situation using the taught language.",
      "Primero compré el billete y después subí al tren.",
      [],
      "These completed actions follow a clear order."
     ]
    },
    {
     "model": "Al final llegamos a tiempo, aunque estábamos cansados.",
     "translation": "In the end we arrived on time, although we were tired.",
     "gap": "llegamos",
     "gapWrong": [
      "llegar",
      "llegaremos"
     ],
     "wrong": [
      "Al final llegar a tiempo, aunque estábamos cansados.",
      "Al final llegaremos a tiempo, aunque estábamos cansados."
     ],
     "why": "The past context makes llegamos a completed arrival; aunque adds a contrast.",
     "ask": "Elige la frase que comunica: «In the end we arrived on time, although we were tired.».",
     "help": "Choose the response meaning: In the end we arrived on time, although we were tired.",
     "dialogue": [
      "Ana: «¿Cómo terminó el viaje?»",
      "Choose the appropriate response to this exchange.",
      "Llegamos a tiempo, aunque estábamos cansados.",
      [
       "Nunca salimos.",
       "Estamos en casa mañana."
      ],
      "The past context makes llegamos a completed arrival; aunque adds a contrast."
     ],
     "transfer": [
      "Llegaste tarde, pero encontraste a tus amigos. Cuenta el resultado.",
      "Respond to the Spanish situation using the taught language.",
      "Al final llegué tarde, pero encontré a mis amigos.",
      [],
      "The past context makes llegamos a completed arrival; aunque adds a contrast."
     ]
    }
   ],
   "stories": [
    {
     "title": "Un paraguas compartido",
     "text": "Ana esperaba el autobús delante del mercado. Salió sin paraguas porque el cielo estaba claro. Mientras consultaba el horario, empezó a llover. Primero se puso junto a una tienda y después llamó a Luis. Él estaba cerca y llevaba un paraguas grande. De repente llegó el autobús, pero no paró en aquella esquina: las obras cambiaron la parada. Un empleado les señaló la siguiente calle. Caminaron juntos hasta allí. Al final subieron al autobús y llegaron al cine antes de empezar la película. Ana se rio de su plan: organizó las entradas, pero no miró el tiempo. Luis dijo que compartir el paraguas fue la parte más divertida.",
     "glossary": [
      [
       "las obras",
       "roadworks"
      ],
      [
       "la esquina",
       "corner"
      ]
     ],
     "questions": [
      [
       "¿Qué cambió el recorrido?",
       "Read the situation and choose the supported interpretation.",
       "La parada estaba en otra calle.",
       [
        "No tenían entradas.",
        "Luis perdió el paraguas."
       ],
       "The ending distinguishes an unexpected problem from a successful result."
      ],
      [
       "¿Por qué Ana salió sin paraguas?",
       "Explain the reason using a short English or Spanish response.",
       "El cielo estaba claro.",
       [
        "The sky was clear."
       ],
       "The ending distinguishes an unexpected problem from a successful result."
      ],
      [
       "¿Para qué sirvió la ayuda del empleado?",
       "Choose the implication supported by the passage.",
       "Encontraron la nueva parada.",
       [
        "Terminó la lluvia.",
        "Cambió la película."
       ],
       "The ending distinguishes an unexpected problem from a successful result."
      ],
      [
       "¿Qué valoró Luis?",
       "Give a short response about the speaker’s viewpoint.",
       "Compartir el paraguas.",
       [
        "Sharing the umbrella."
       ],
       "The ending distinguishes an unexpected problem from a successful result."
      ],
      [
       "¿Qué resumen encaja?",
       "Choose the response appropriate to the passage.",
       "Hubo un imprevisto, pero llegaron a tiempo.",
       [
        "Todo salió exactamente como estaba previsto.",
        "No llegaron al cine."
       ],
       "The ending distinguishes an unexpected problem from a successful result."
      ]
     ]
    },
    {
     "title": "La llamada del museo",
     "text": "Luis enseñaba el museo a su prima Elena cuando recibió una llamada de Ana. Al principio no la oyó bien porque había mucha gente en la sala. Salieron al patio y Ana repitió su propuesta: tenía una entrada extra para un concierto. Elena quería conocer música de la ciudad y aceptó. Primero terminaron la visita; después comieron cerca del museo. Mientras esperaban la comida, miraron cómo llegar al concierto en autobús. Al final encontraron a Ana junto a la entrada. Elena pensaba volver pronto a casa. El cambio de plan le dio una tarde diferente y una nueva amiga. Luis contó después que no organizó aquella tarde tan bien: simplemente aprovechó una invitación inesperada.",
     "glossary": [
      [
       "el patio",
       "courtyard"
      ],
      [
       "aprovechó",
       "made the most of"
      ]
     ],
     "questions": [
      [
       "¿Qué añadió la llamada al día?",
       "Read the situation and choose the supported interpretation.",
       "Un concierto después del museo.",
       [
        "Una visita cancelada.",
        "Una noche de trabajo."
       ],
       "The invitation changes the later plan, not the visit already under way."
      ],
      [
       "¿Por qué salieron al patio?",
       "Explain the reason using a short English or Spanish response.",
       "Había ruido dentro.",
       [
        "It was noisy inside."
       ],
       "The invitation changes the later plan, not the visit already under way."
      ],
      [
       "¿Qué indica que no salieron inmediatamente?",
       "Choose the implication supported by the passage.",
       "Terminaron la visita antes.",
       [
        "Ana estaba en el autobús.",
        "El museo estaba cerrado."
       ],
       "The invitation changes the later plan, not the visit already under way."
      ],
      [
       "¿Qué ganó Elena?",
       "Give a short response about the speaker’s viewpoint.",
       "Una nueva amiga.",
       [
        "A new friend."
       ],
       "The invitation changes the later plan, not the visit already under way."
      ],
      [
       "¿Cómo puede contar la secuencia?",
       "Choose the response appropriate to the passage.",
       "Visitamos el museo y después fuimos al concierto.",
       [
        "No salimos de casa.",
        "Mañana vimos el concierto."
       ],
       "The invitation changes the later plan, not the visit already under way."
      ]
     ]
    },
    {
     "title": "Las llaves del local",
     "text": "Marta iba a abrir el local de la asociación a las seis. Un grupo de vecinos esperaba fuera para preparar una cena. Cuando buscó las llaves, vio que llevaba las de su casa. Primero llamó a Diego, que guardaba una copia, pero él estaba trabajando. Mientras los vecinos organizaban las mesas en el patio, Marta fue al café a recoger las llaves. Volvió en diez minutos y todos entraron. Nadie tuvo que cancelar la cena. Marta pidió disculpas. Una vecina le dijo que la espera no fue tiempo perdido: prepararon el patio y conocieron a dos personas nuevas. El pequeño retraso cambió el principio del encuentro, pero no arruinó la cena.",
     "glossary": [
      [
       "una copia",
       "a spare copy"
      ],
      [
       "arruinó",
       "ruined"
      ]
     ],
     "questions": [
      [
       "¿Qué causó el retraso?",
       "Read the situation and choose the supported interpretation.",
       "Marta llevaba otras llaves.",
       [
        "El local estaba lleno.",
        "La cena terminó."
       ],
       "The initial mistake, solution and reaction are separate parts of the story."
      ],
      [
       "¿Por qué llamó a Diego?",
       "Explain the reason using a short English or Spanish response.",
       "Tenía una copia.",
       [
        "He had a spare key."
       ],
       "The initial mistake, solution and reaction are separate parts of the story."
      ],
      [
       "¿Qué hicieron los vecinos mientras esperaban?",
       "Choose the implication supported by the passage.",
       "Prepararon el patio.",
       [
        "Se fueron todos.",
        "Compraron llaves."
       ],
       "The initial mistake, solution and reaction are separate parts of the story."
      ],
      [
       "¿Cómo valoró la espera una vecina?",
       "Give a short response about the speaker’s viewpoint.",
       "No fue tiempo perdido.",
       [
        "It was not wasted time."
       ],
       "The initial mistake, solution and reaction are separate parts of the story."
      ],
      [
       "¿Qué disculpa encaja?",
       "Choose the response appropriate to the passage.",
       "Perdonad el retraso; llevé las llaves equivocadas.",
       [
        "No hay ninguna puerta.",
        "Llegasteis mañana."
       ],
       "The initial mistake, solution and reaction are separate parts of the story."
      ]
     ]
    },
    {
     "title": "Dos versiones",
     "text": "Ana y Diego contaron la misma excursión de formas distintas. Ana empezó por la lluvia: caminaban junto al río cuando llegó una tormenta. Diego empezó por la solución: encontraron una cafetería abierta. Primero pidieron bebidas calientes; después preguntaron por el próximo autobús. Mientras esperaban, una señora explicó un camino más corto hasta la estación. Al final volvieron sin problemas. Ana decía que el día fue un desastre porque no vieron el paisaje. Diego no estaba de acuerdo: conversaron con gente nueva y descubrieron un café agradable. Ninguno inventaba los hechos. Elegían detalles distintos para explicar cómo vivieron la tarde. Luis escuchó las dos versiones y entendió mejor lo ocurrido.",
     "glossary": [
      [
       "el paisaje",
       "landscape"
      ],
      [
       "los hechos",
       "facts"
      ]
     ],
     "questions": [
      [
       "¿Por qué difieren las versiones?",
       "Read the situation and choose the supported interpretation.",
       "Destacan aspectos diferentes.",
       [
        "No fueron juntos.",
        "Ocurrieron en distintas ciudades."
       ],
       "Viewpoint changes which details matter, not the shared facts."
      ],
      [
       "¿Por qué entraron en el café?",
       "Explain the reason using a short English or Spanish response.",
       "Por la tormenta.",
       [
        "Because of the storm."
       ],
       "Viewpoint changes which details matter, not the shared facts."
      ],
      [
       "¿Qué puede concluir Luis?",
       "Choose the implication supported by the passage.",
       "Una experiencia admite distintas valoraciones.",
       [
        "Uno necesariamente miente.",
        "Nadie volvió."
       ],
       "Viewpoint changes which details matter, not the shared facts."
      ],
      [
       "¿Qué valoró Diego?",
       "Give a short response about the speaker’s viewpoint.",
       "La conversación y el café.",
       [
        "The conversation and the café."
       ],
       "Viewpoint changes which details matter, not the shared facts."
      ],
      [
       "¿Qué resumen respeta ambas versiones?",
       "Choose the response appropriate to the passage.",
       "La lluvia cambió el plan; encontraron una alternativa.",
       [
        "No llovió.",
        "Nunca encontraron refugio."
       ],
       "Viewpoint changes which details matter, not the shared facts."
      ]
     ]
    }
   ],
   "audio": [
    [
     "Esperábamos delante del cine. De repente llegó Luis con las entradas. Primero entramos y después buscamos los asientos.",
     "¿Qué pasó antes de entrar?",
     "Listen and choose the supported meaning.",
     "Luis llegó con las entradas.",
     [
      "Buscaron los asientos.",
      "Terminó la película."
     ],
     "The arrival precedes entry."
    ],
    [
     "Ana preparaba la cena cuando llamaron a la puerta. Era Marta. Primero hablaron en la cocina y después cenaron juntas.",
     "¿Qué hacía Ana al principio?",
     "Listen and give a short answer in English or Spanish.",
     "Preparaba la cena.",
     [
      "She was preparing dinner.",
      "Estaba preparando la cena."
     ],
     "The ongoing background is preparing dinner."
    ]
   ],
   "writing": [
    {
     "es": "Escribe «I was reading when Luis called».",
     "en": "Translate the given sentence.",
     "model": "Estaba leyendo cuando Luis llamó.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Cuenta un retraso: dónde estabas, qué pasó y cómo terminó.",
     "en": "Describe a delay and outcome.",
     "model": "Estaba en la estación cuando anunciaron un retraso. Llamé a Marta y al final llegamos juntos.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Da un contexto",
       "any": [
        "estaba",
        "cuando"
       ]
      },
      {
       "label": "Ordena hechos",
       "any": [
        "primero",
        "después"
       ]
      },
      {
       "label": "Cuenta el resultado",
       "any": [
        "al final"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Une en orden: compré entradas; esperé a Ana.",
     "en": "Link buying tickets and then waiting.",
     "model": "Primero compré las entradas y después esperé a Ana.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Cuenta una tarde inesperada en cuatro frases.",
     "en": "Narrate an unexpected afternoon.",
     "model": "Esperaba el autobús cuando empezó a llover. Llamé a Luis. Encontramos un café. Al final pasamos una tarde agradable.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Da un contexto",
       "any": [
        "estaba",
        "cuando"
       ]
      },
      {
       "label": "Ordena hechos",
       "any": [
        "primero",
        "después"
       ]
      },
      {
       "label": "Cuenta el resultado",
       "any": [
        "al final"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Escribe un mensaje sobre un imprevisto y su solución.",
     "en": "Explain an unexpected problem and solution.",
     "model": "Estaba esperando el tren cuando anunciaron un retraso. Primero llamé a Ana y después tomé el autobús. Al final llegué a tiempo.",
     "mode": "free",
     "requirements": [
      {
       "label": "Da un contexto",
       "any": [
        "estaba",
        "cuando"
       ]
      },
      {
       "label": "Ordena hechos",
       "any": [
        "primero",
        "después"
       ]
      },
      {
       "label": "Cuenta el resultado",
       "any": [
        "al final"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    }
   ]
  },
  {
   "title": "Things that have changed",
   "goal": "Compare past and present habits and explain how long a change has lasted",
   "grammar": "Antes/ahora, ya no, todavía, desde, desde hace, hace… que",
   "core": [
    {
     "model": "Antes trabajaba en el café, pero ahora trabajo en casa.",
     "translation": "I used to work in the café, but now I work at home.",
     "gap": "trabajaba",
     "gapWrong": [
      "trabajo",
      "trabajaré"
     ],
     "wrong": [
      "Antes trabajo en el café, pero ahora trabajo en casa.",
      "Antes trabajaré en el café, pero ahora trabajo en casa."
     ],
     "why": "Imperfect describes the old routine; present describes now.",
     "ask": "Elige la frase que comunica: «I used to work in the café, but now I work at home.».",
     "help": "Choose the response meaning: I used to work in the café, but now I work at home.",
     "dialogue": [
      "Luis: «¿Sigues trabajando en el café?»",
      "Choose the appropriate response to this exchange.",
      "No, ya no trabajo allí.",
      [
       "Sí, nunca trabajé mañana.",
       "Todavía no ayer."
      ],
      "Imperfect describes the old routine; present describes now."
     ],
     "transfer": [
      "Antes estudiabas por la noche. Ahora estudias por la mañana.",
      "Respond to the Spanish situation using the taught language.",
      "Antes estudiaba por la noche, pero ahora estudio por la mañana.",
      [],
      "Imperfect describes the old routine; present describes now."
     ]
    },
    {
     "model": "Vivo aquí desde hace dos años.",
     "translation": "I have lived here for two years.",
     "gap": "desde hace",
     "gapWrong": [
      "desde",
      "durante ayer"
     ],
     "wrong": [
      "Vivo aquí desde dos años.",
      "Vivo aquí durante ayer dos años."
     ],
     "why": "Desde hace introduces an elapsed duration extending to now; desde introduces a starting point.",
     "ask": "Elige la frase que comunica: «I have lived here for two years.».",
     "help": "Choose the response meaning: I have lived here for two years.",
     "dialogue": [
      "Marta: «¿Desde cuándo vives aquí?»",
      "Choose the appropriate response to this exchange.",
      "Vivo aquí desde 2024.",
      [
       "Desde hace 2024.",
       "Hasta ayer mañana."
      ],
      "Desde hace introduces an elapsed duration extending to now; desde introduces a starting point."
     ],
     "transfer": [
      "Llevas tres meses estudiando español. Usa desde hace.",
      "Respond to the Spanish situation using the taught language.",
      "Estudio español desde hace tres meses.",
      [],
      "Desde hace introduces an elapsed duration extending to now; desde introduces a starting point."
     ]
    },
    {
     "model": "Ya no voy en coche, pero todavía tengo el mismo trabajo.",
     "translation": "I no longer go by car, but I still have the same job.",
     "gap": "Ya no",
     "gapWrong": [
      "Todavía",
      "Ya"
     ],
     "wrong": [
      "Todavía voy en coche, pero todavía tengo el mismo trabajo.",
      "Ya voy en coche, pero todavía tengo el mismo trabajo."
     ],
     "why": "Ya no marks a stopped habit; todavía marks what continues.",
     "ask": "Elige la frase que comunica: «I no longer go by car, but I still have the same job.».",
     "help": "Choose the response meaning: I no longer go by car, but I still have the same job.",
     "dialogue": [
      "Ana: «¿Has cambiado de trabajo?»",
      "Choose the appropriate response to this exchange.",
      "No, todavía tengo el mismo trabajo.",
      [
       "Sí, todavía nunca.",
       "No trabajo todavía ayer."
      ],
      "Ya no marks a stopped habit; todavía marks what continues."
     ],
     "transfer": [
      "Ya no vives en Madrid; aún tienes amigos allí.",
      "Respond to the Spanish situation using the taught language.",
      "Ya no vivo en Madrid, pero todavía tengo amigos allí.",
      [],
      "Ya no marks a stopped habit; todavía marks what continues."
     ]
    }
   ],
   "stories": [
    {
     "title": "La bicicleta de Clara",
     "text": "Clara trabaja en la biblioteca desde hace tres años. Antes iba en coche porque vivía lejos. Ahora vive cerca y va en bicicleta casi todos los días. Ya no necesita buscar aparcamiento, pero todavía sale pronto: le gusta desayunar con sus compañeros antes de abrir. Luis pensaba que Clara cambió de empleo al mudarse. Ella explicó que el trabajo es el mismo; solo cambió el trayecto. Los días de lluvia toma el autobús. No quiere vender el coche todavía porque visita a sus padres en un pueblo sin buena conexión. Dice que usar menos el coche no significa dejar de usarlo por completo. El cambio facilita su rutina sin resolver todos los viajes.",
     "glossary": [
      [
       "el trayecto",
       "journey"
      ],
      [
       "aparcamiento",
       "parking"
      ]
     ],
     "questions": [
      [
       "¿Qué cambió Clara?",
       "Read the situation and choose the supported interpretation.",
       "Su forma de llegar al trabajo.",
       [
        "Su profesión.",
        "El horario de la biblioteca."
       ],
       "Distinguish the changed journey from the continuing job and occasional car use."
      ],
      [
       "¿Por qué usa ahora la bicicleta?",
       "Explain the reason using a short English or Spanish response.",
       "Vive cerca.",
       [
        "She lives nearby."
       ],
       "Distinguish the changed journey from the continuing job and occasional car use."
      ],
      [
       "¿Por qué conserva el coche?",
       "Choose the implication supported by the passage.",
       "Algunos viajes todavía lo necesitan.",
       [
        "No sabe ir en bicicleta.",
        "La biblioteca está lejos."
       ],
       "Distinguish the changed journey from the continuing job and occasional car use."
      ],
      [
       "¿Cómo entiende el cambio?",
       "Give a short response about the speaker’s viewpoint.",
       "No tiene que ser absoluto.",
       [
        "It need not be an absolute change."
       ],
       "Distinguish the changed journey from the continuing job and occasional car use."
      ],
      [
       "Luis pregunta por su empleo. ¿Qué responde?",
       "Choose the response appropriate to the passage.",
       "Todavía trabajo en la misma biblioteca.",
       [
        "Ya no vivo cerca.",
        "Nunca trabajé allí."
       ],
       "Distinguish the changed journey from the continuing job and occasional car use."
      ]
     ]
    },
    {
     "title": "Un barrio distinto",
     "text": "Ana volvió a la calle donde vivía antes. Recordaba una tienda pequeña y una plaza casi vacía. Ahora hay una librería con mesas fuera y muchas familias pasan allí la tarde. Diego vive en el barrio desde 2020 y explicó que la plaza cambió poco a poco. Ya no entran coches durante el fin de semana. Sin embargo, algunos vecinos todavía echan de menos la antigua tienda porque vendía productos baratos. Ana compró un libro, pero no dijo que todo era mejor. Le gustó tener un lugar para sentarse y hablar; también entendió la preocupación por los precios. Comparar el barrio le ayudó a recordar que un cambio puede traer ventajas y dificultades a la vez.",
     "glossary": [
      [
       "echan de menos",
       "miss"
      ],
      [
       "poco a poco",
       "gradually"
      ]
     ],
     "questions": [
      [
       "¿Qué cambio aparece?",
       "Read the situation and choose the supported interpretation.",
       "La plaza tiene más vida sin coches los fines de semana.",
       [
        "No queda ninguna tienda.",
        "Nadie vive allí."
       ],
       "The passage gives two viewpoints; a balanced comparison respects both."
      ],
      [
       "¿Por qué algunos extrañan la tienda?",
       "Explain the reason using a short English or Spanish response.",
       "Vendía productos baratos.",
       [
        "It sold affordable products."
       ],
       "The passage gives two viewpoints; a balanced comparison respects both."
      ],
      [
       "¿Qué conclusión apoya el texto?",
       "Choose the implication supported by the passage.",
       "El cambio tiene ventajas y dificultades.",
       [
        "Todo es peor.",
        "Ana rechaza la librería."
       ],
       "The passage gives two viewpoints; a balanced comparison respects both."
      ],
      [
       "¿Cómo valora Ana el barrio?",
       "Give a short response about the speaker’s viewpoint.",
       "Ve aspectos positivos y preocupaciones.",
       [
        "She sees benefits and concerns."
       ],
       "The passage gives two viewpoints; a balanced comparison respects both."
      ],
      [
       "¿Qué frase compara antes y ahora?",
       "Choose the response appropriate to the passage.",
       "Antes había una tienda; ahora hay una librería.",
       [
        "Ahora nunca hay libros.",
        "Desde hace 2020 vivía mañana."
       ],
       "The passage gives two viewpoints; a balanced comparison respects both."
      ]
     ]
    },
    {
     "title": "Una amistad que continúa",
     "text": "Elena y Marta se conocieron en un curso de cocina. Hace cuatro años que son amigas. Antes se veían todas las semanas porque estudiaban en el mismo centro. Ahora Elena trabaja por las tardes y Marta tiene otro horario. Ya no pueden cocinar juntas cada viernes, pero todavía hablan por teléfono. Este mes han preparado una cena en casa de Elena. Marta llevó la receta que usaban en clase y Elena cambió algunos ingredientes. Mientras cocinaban, hablaron de sus nuevas rutinas. No querían recuperar exactamente el pasado: buscaban una forma de seguir viéndose. Al final decidieron quedar una vez al mes. La frecuencia cambió, pero las dos seguían interesadas en cuidar la amistad.",
     "glossary": [
      [
       "la frecuencia",
       "frequency"
      ],
      [
       "cuidar la amistad",
       "maintain the friendship"
      ]
     ],
     "questions": [
      [
       "¿Qué cambió en la amistad?",
       "Read the situation and choose the supported interpretation.",
       "Se ven con menos frecuencia.",
       [
        "Ya no hablan.",
        "Nunca cocinaron juntas."
       ],
       "Continuity concerns the relationship; frequency is the part that changes."
      ],
      [
       "¿Por qué no quedan cada viernes?",
       "Explain the reason using a short English or Spanish response.",
       "Sus horarios cambiaron.",
       [
        "Their schedules changed."
       ],
       "Continuity concerns the relationship; frequency is the part that changes."
      ],
      [
       "¿Qué indica el nuevo acuerdo?",
       "Choose the implication supported by the passage.",
       "Quieren mantener el contacto.",
       [
        "Quieren terminar la amistad.",
        "Tienen el mismo horario."
       ],
       "Continuity concerns the relationship; frequency is the part that changes."
      ],
      [
       "¿Qué quieren conservar?",
       "Give a short response about the speaker’s viewpoint.",
       "La amistad, no la rutina exacta.",
       [
        "The friendship, not the exact old routine."
       ],
       "Continuity concerns the relationship; frequency is the part that changes."
      ],
      [
       "¿Qué propuesta encaja?",
       "Choose the response appropriate to the passage.",
       "Podemos quedar una vez al mes.",
       [
        "No quiero hablar contigo nunca.",
        "Solo nos veremos ayer."
       ],
       "Continuity concerns the relationship; frequency is the part that changes."
      ]
     ]
    },
    {
     "title": "El nuevo horario de Diego",
     "text": "Diego estudia por las mañanas desde hace seis meses. Antes abría el café temprano y terminaba por la tarde. Ahora una compañera abre y él llega después de clase. Al principio se sentía cansado porque intentaba estudiar por la noche también. Ya no lo hace: prepara las tareas antes de cenar y descansa después. Todavía trabaja los sábados, así que no tiene todos los fines de semana libres. Luis le preguntó si estudiar era demasiado difícil. Diego contestó que organizar el tiempo era la parte complicada. Esta semana ha entregado su primer proyecto. Está contento, pero no presenta su nueva rutina como una solución perfecta. Sigue ajustándola cuando cambian los turnos del café.",
     "glossary": [
      [
       "los turnos",
       "work shifts"
      ],
      [
       "ajustándola",
       "adjusting it"
      ]
     ],
     "questions": [
      [
       "¿Qué mantiene Diego?",
       "Read the situation and choose the supported interpretation.",
       "El trabajo de los sábados.",
       [
        "El estudio nocturno diario.",
        "La apertura temprana."
       ],
       "Duration extending to now differs from a completed period."
      ],
      [
       "¿Por qué dejó de estudiar de noche?",
       "Explain the reason using a short English or Spanish response.",
       "Estaba cansado.",
       [
        "He was tired."
       ],
       "Duration extending to now differs from a completed period."
      ],
      [
       "¿Qué significa desde hace seis meses?",
       "Choose the implication supported by the passage.",
       "Empezó hace seis meses y continúa.",
       [
        "Terminó hace seis meses.",
        "Empezará en seis meses."
       ],
       "Duration extending to now differs from a completed period."
      ],
      [
       "¿Qué le resulta complicado?",
       "Give a short response about the speaker’s viewpoint.",
       "Organizar el tiempo.",
       [
        "Organising his time."
       ],
       "Duration extending to now differs from a completed period."
      ],
      [
       "¿Qué frase resume el proceso?",
       "Choose the response appropriate to the passage.",
       "He cambiado la rutina y todavía la estoy ajustando.",
       [
        "Todo está resuelto para siempre.",
        "Ya no estudio nunca."
       ],
       "Duration extending to now differs from a completed period."
      ]
     ]
    }
   ],
   "audio": [
    [
     "Antes Marta estudiaba por la tarde. Ahora trabaja en ese horario. Ya no va al curso del viernes, pero todavía practica en casa.",
     "¿Qué sigue haciendo?",
     "Listen and choose the supported meaning.",
     "Practica en casa.",
     [
      "Va al curso del viernes.",
      "Estudia por la tarde."
     ],
     "Todavía marks the continuing activity."
    ],
    [
     "Vivo en Toledo desde hace tres años. Antes vivía en Madrid. Todavía trabajo allí dos días por semana.",
     "¿Cuánto tiempo lleva viviendo en Toledo?",
     "Listen and give a short answer in English or Spanish.",
     "Tres años.",
     [
      "Three years.",
      "3 años"
     ],
     "Desde hace + duration extends to the present."
    ]
   ],
   "writing": [
    {
     "es": "Escribe «I no longer work there».",
     "en": "Translate the given meaning.",
     "model": "Ya no trabajo allí.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Compara dos rutinas de antes y ahora. Incluye algo que continúa.",
     "en": "Compare routines and one continuing habit.",
     "model": "Antes iba en coche, pero ahora voy en bicicleta. Todavía trabajo en el mismo lugar.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Compara antes y ahora",
       "any": [
        "antes",
        "ahora"
       ]
      },
      {
       "label": "Marca continuidad o cambio",
       "any": [
        "todavía",
        "ya no"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Usa desde hace: estudio español; dos años.",
     "en": "State an ongoing two-year duration.",
     "model": "Estudio español desde hace dos años.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Describe un cambio de tu barrio y dos opiniones sobre él.",
     "en": "Describe a neighbourhood change and two views.",
     "model": "Antes había una tienda pequeña. Ahora hay una librería. Me gusta, pero algunos vecinos echan de menos los precios de antes.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Compara antes y ahora",
       "any": [
        "antes",
        "ahora"
       ]
      },
      {
       "label": "Marca continuidad o cambio",
       "any": [
        "todavía",
        "ya no"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Escribe a una amiga explicando un cambio de horario y cómo mantener el contacto.",
     "en": "Explain a schedule change and suggest staying in touch.",
     "model": "Ahora trabajo por las tardes y ya no puedo quedar los viernes. Todavía quiero verte. ¿Podemos quedar un sábado al mes?",
     "mode": "free",
     "requirements": [
      {
       "label": "Compara antes y ahora",
       "any": [
        "antes",
        "ahora"
       ]
      },
      {
       "label": "Marca continuidad o cambio",
       "any": [
        "todavía",
        "ya no"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    }
   ]
  },
  {
   "title": "Plans and intentions",
   "goal": "Explain plans, arrangements and future commitments",
   "grammar": "Simple future iré, tendré, haré, podré; ir a; present arrangements",
   "core": [
    {
     "model": "Mañana iré a la oficina y hablaré con Elena.",
     "translation": "Tomorrow I will go to the office and speak with Elena.",
     "gap": "iré",
     "gapWrong": [
      "iba",
      "fui"
     ],
     "wrong": [
      "Mañana iba a la oficina y hablaré con Elena.",
      "Mañana fui a la oficina y hablaré con Elena."
     ],
     "why": "Ir uses the future stem ir- plus é. A future commitment differs from a past event.",
     "ask": "Elige la frase que comunica: «Tomorrow I will go to the office and speak with Elena.».",
     "help": "Choose the response meaning: Tomorrow I will go to the office and speak with Elena.",
     "dialogue": [
      "Elena: «¿Vendrás a la reunión?»",
      "Choose the appropriate response to this exchange.",
      "Sí, iré mañana.",
      [
       "Sí, fui mañana.",
       "Estoy ayer allí."
      ],
      "Ir uses the future stem ir- plus é. A future commitment differs from a past event."
     ],
     "transfer": [
      "Mañana trabajarás en casa y llamarás a Luis. Confirma el compromiso.",
      "Respond to the Spanish situation using the taught language.",
      "Mañana trabajaré en casa y llamaré a Luis.",
      [],
      "Ir uses the future stem ir- plus é. A future commitment differs from a past event."
     ]
    },
    {
     "model": "Voy a preparar la cena; quedamos a las ocho.",
     "translation": "I am going to prepare dinner; we are meeting at eight.",
     "gap": "Voy a",
     "gapWrong": [
      "Fui a",
      "Iba a"
     ],
     "wrong": [
      "Fui a preparar la cena; quedamos a las ocho.",
      "Iba a preparar la cena; quedamos a las ocho."
     ],
     "why": "Voy a + infinitive presents an intention; quedamos can express an agreed arrangement.",
     "ask": "Elige la frase que comunica: «I am going to prepare dinner; we are meeting at eight.».",
     "help": "Choose the response meaning: I am going to prepare dinner; we are meeting at eight.",
     "dialogue": [
      "Ana: «¿Ya tenemos hora para cenar?»",
      "Choose the appropriate response to this exchange.",
      "Sí, quedamos a las ocho.",
      [
       "Nunca hay una hora.",
       "Ayer quedaremos."
      ],
      "Voy a + infinitive presents an intention; quedamos can express an agreed arrangement."
     ],
     "transfer": [
      "Vas a comprar las entradas. La reunión acordada es a las seis.",
      "Respond to the Spanish situation using the taught language.",
      "Voy a comprar las entradas; quedamos a las seis.",
      [],
      "Voy a + infinitive presents an intention; quedamos can express an agreed arrangement."
     ]
    },
    {
     "model": "Tendré tiempo el sábado, pero no podré ir el viernes.",
     "translation": "I will have time on Saturday, but I will not be able to go on Friday.",
     "gap": "Tendré",
     "gapWrong": [
      "Tenía",
      "Tuve"
     ],
     "wrong": [
      "Tenía tiempo el sábado, pero no podré ir el viernes.",
      "Tuve tiempo el sábado, pero no podré ir el viernes."
     ],
     "why": "Tener uses tendr-; poder uses podr-. The contrast makes availability precise.",
     "ask": "Elige la frase que comunica: «I will have time on Saturday, but I will not be able to go on Friday.».",
     "help": "Choose the response meaning: I will have time on Saturday, but I will not be able to go on Friday.",
     "dialogue": [
      "Marta: «¿Puedes ayudarme el sábado?»",
      "Choose the appropriate response to this exchange.",
      "Sí, tendré tiempo.",
      [
       "No pude mañana.",
       "Siempre tuvimos mañana."
      ],
      "Tener uses tendr-; poder uses podr-. The contrast makes availability precise."
     ],
     "transfer": [
      "Harás la reserva el lunes, pero no podrás llamar hoy.",
      "Respond to the Spanish situation using the taught language.",
      "Haré la reserva el lunes, pero no podré llamar hoy.",
      [],
      "Tener uses tendr-; poder uses podr-. The contrast makes availability precise."
     ]
    }
   ],
   "stories": [
    {
     "title": "Una fecha confirmada",
     "text": "Elena organiza una reunión para preparar una exposición. En el grupo alguien escribió que sería el viernes, pero todavía no era una fecha confirmada. Luis pensó que podía comprar los billetes del tren. Elena le llamó antes de la compra: «No los compres aún; mañana hablaré con el museo». Después envió un mensaje más claro. Van a reunirse el sábado a las diez, y la sala ya está reservada. Luis respondió que llegará a las nueve y media. Ana va a preparar una lista de preguntas. No necesitan terminar todo ese día; quieren repartir las tareas. La nueva comunicación distingue una idea inicial, una decisión pendiente y un horario que todos han aceptado.",
     "glossary": [
      [
       "confirmada",
       "confirmed"
      ],
      [
       "repartir",
       "share out"
      ]
     ],
     "questions": [
      [
       "¿Qué está confirmado al final?",
       "Read the situation and choose the supported interpretation.",
       "La reunión del sábado a las diez.",
       [
        "La fecha inicial del viernes.",
        "La exposición completa."
       ],
       "The story contrasts tentative intentions with agreed arrangements."
      ],
      [
       "¿Por qué Elena llama a Luis?",
       "Explain the reason using a short English or Spanish response.",
       "Para evitar una compra demasiado pronto.",
       [
        "To prevent buying tickets too early."
       ],
       "The story contrasts tentative intentions with agreed arrangements."
      ],
      [
       "¿Qué muestra la reserva de la sala?",
       "Choose the implication supported by the passage.",
       "El plan dejó de ser solo una propuesta.",
       [
        "La exposición terminó.",
        "Luis no puede viajar."
       ],
       "The story contrasts tentative intentions with agreed arrangements."
      ],
      [
       "¿Qué espera Ana preparar?",
       "Give a short response about the speaker’s viewpoint.",
       "Una lista de preguntas.",
       [
        "A list of questions."
       ],
       "The story contrasts tentative intentions with agreed arrangements."
      ],
      [
       "¿Qué respuesta confirma un compromiso?",
       "Choose the response appropriate to the passage.",
       "Llegaré a las nueve y media.",
       [
        "Quizá fue ayer mañana.",
        "No hay ninguna reunión."
       ],
       "The story contrasts tentative intentions with agreed arrangements."
      ]
     ]
    },
    {
     "title": "El sábado de Marta",
     "text": "Marta tiene tres invitaciones para el sábado y no quiere aceptar todas. Por la mañana ayudará a su padre con una compra. Después va a comer con Ana, como acordaron la semana pasada. Diego propone una excursión que ocupa todo el día. Marta le dice que no podrá ir, aunque le apetece. No inventa una excusa: explica los compromisos que ya tiene. Diego propone otra salida el domingo, pero Marta no confirma inmediatamente. Tendrá que mirar el horario del autobús primero. Ana agradece que Marta mantenga la comida. Las dos saben que cambiar un plan puede ser necesario, pero avisar con tiempo evita que otra persona espere sin saber qué pasa.",
     "glossary": [
      [
       "le apetece",
       "she feels like it"
      ],
      [
       "una excusa",
       "an excuse"
      ]
     ],
     "questions": [
      [
       "¿Qué invitación rechaza Marta?",
       "Read the situation and choose the supported interpretation.",
       "La excursión del sábado.",
       [
        "La comida con Ana.",
        "La ayuda a su padre."
       ],
       "Availability, preference and confirmation are not the same thing."
      ],
      [
       "¿Por qué no puede ir?",
       "Explain the reason using a short English or Spanish response.",
       "Tiene compromisos previos.",
       [
        "She has prior commitments."
       ],
       "Availability, preference and confirmation are not the same thing."
      ],
      [
       "¿Está confirmada la salida del domingo?",
       "Choose the implication supported by the passage.",
       "No; debe mirar el horario.",
       [
        "Sí; todo está comprado.",
        "No; Diego nunca la propone."
       ],
       "Availability, preference and confirmation are not the same thing."
      ],
      [
       "¿Qué valora Ana?",
       "Give a short response about the speaker’s viewpoint.",
       "Que Marta mantenga el acuerdo.",
       [
        "That Marta keeps their arrangement."
       ],
       "Availability, preference and confirmation are not the same thing."
      ],
      [
       "¿Qué respuesta explica un límite?",
       "Choose the response appropriate to the passage.",
       "No podré ir el sábado; ya tengo otros planes.",
       [
        "Sí a todo, aunque no iré.",
        "Fui el próximo sábado."
       ],
       "Availability, preference and confirmation are not the same thing."
      ]
     ]
    },
    {
     "title": "Una promesa pequeña",
     "text": "Diego prometió enviar a Luis una receta, pero olvidó hacerlo. Cuando Luis preguntó de nuevo, Diego no respondió con una promesa enorme. Dijo: «La buscaré esta tarde y te la enviaré antes de las seis». Tenía el cuaderno en casa y sabía que podría consultarlo después del trabajo. Luis iba a cocinar al día siguiente, así que ese plazo era suficiente. Ana sugirió hacer una foto para no copiar toda la receta. Diego lo hizo y añadió una nota sobre una cantidad que podía confundir. Al final Luis recibió la información a tiempo. La promesa fue útil porque incluía una acción concreta y un límite realista, no solo una buena intención.",
     "glossary": [
      [
       "el plazo",
       "deadline"
      ],
      [
       "el cuaderno",
       "notebook"
      ]
     ],
     "questions": [
      [
       "¿Qué hace precisa la promesa?",
       "Read the situation and choose the supported interpretation.",
       "Una acción y una hora límite.",
       [
        "Una receta sin cantidades.",
        "Una intención sin fecha."
       ],
       "A future commitment is credible when its action and timing are clear."
      ],
      [
       "¿Por qué podía cumplirla?",
       "Explain the reason using a short English or Spanish response.",
       "Tenía tiempo después del trabajo.",
       [
        "He had time after work."
       ],
       "A future commitment is credible when its action and timing are clear."
      ],
      [
       "¿Por qué la foto ayudó?",
       "Choose the implication supported by the passage.",
       "Evitó copiar toda la receta.",
       [
        "Cambió el día de la comida.",
        "Eliminó los ingredientes."
       ],
       "A future commitment is credible when its action and timing are clear."
      ],
      [
       "¿Qué necesitaba Luis?",
       "Give a short response about the speaker’s viewpoint.",
       "La receta antes de cocinar.",
       [
        "The recipe before cooking."
       ],
       "A future commitment is credible when its action and timing are clear."
      ],
      [
       "¿Qué compromiso encaja?",
       "Choose the response appropriate to the passage.",
       "Te la enviaré antes de las seis.",
       [
        "Quizá nunca la busqué mañana.",
        "No importa cuándo cocines."
       ],
       "A future commitment is credible when its action and timing are clear."
      ]
     ]
    },
    {
     "title": "Un viaje sin demasiados planes",
     "text": "Ana quiere pasar el domingo en Toledo con Clara. Va a comprar el billete de ida, pero prefiere decidir la vuelta más tarde. Clara teme perder el último tren. Las dos miran los horarios y acuerdan un límite: volverán antes de las ocho. Todavía no han elegido restaurante. Clara hará una lista corta de lugares y Ana buscará una exposición. No van a llenar cada minuto. Luis pregunta dónde estarán a las tres y Ana reconoce que aún no lo sabe. En lugar de presentar una idea como una reserva, explica qué está decidido y qué sigue abierto. Así pueden organizar lo necesario sin convertir una salida tranquila en un horario imposible.",
     "glossary": [
      [
       "sigue abierto",
       "remains undecided"
      ],
      [
       "un límite",
       "a limit"
      ]
     ],
     "questions": [
      [
       "¿Qué está decidido?",
       "Read the situation and choose the supported interpretation.",
       "Volver antes de las ocho.",
       [
        "El restaurante.",
        "El lugar exacto a las tres."
       ],
       "Future plans can include firm limits and flexible choices."
      ],
      [
       "¿Por qué miran los horarios?",
       "Explain the reason using a short English or Spanish response.",
       "Para no perder el último tren.",
       [
        "To avoid missing the last train."
       ],
       "Future plans can include firm limits and flexible choices."
      ],
      [
       "¿Qué actitud muestra Ana?",
       "Choose the implication supported by the passage.",
       "Distingue decisiones de opciones abiertas.",
       [
        "Finge que todo está reservado.",
        "No quiere viajar."
       ],
       "Future plans can include firm limits and flexible choices."
      ],
      [
       "¿Qué quieren evitar?",
       "Give a short response about the speaker’s viewpoint.",
       "Un horario demasiado lleno.",
       [
        "An overloaded schedule."
       ],
       "Future plans can include firm limits and flexible choices."
      ],
      [
       "¿Cómo explicar la vuelta?",
       "Choose the response appropriate to the passage.",
       "Volveremos antes de las ocho; el resto sigue abierto.",
       [
        "Ya comimos mañana a las tres.",
        "No existe un último tren."
       ],
       "Future plans can include firm limits and flexible choices."
      ]
     ]
    }
   ],
   "audio": [
    [
     "Voy a comprar las entradas esta tarde. El concierto es el sábado; quedamos a las siete delante del teatro. Si hay algún cambio, os llamaré.",
     "¿Qué es un acuerdo concreto?",
     "Listen and choose the supported meaning.",
     "Quedar el sábado a las siete.",
     [
      "Comprar ayer.",
      "Llamar siempre a las siete."
     ],
     "Present quedamos communicates the arrangement."
    ],
    [
     "No podré ir el viernes porque trabajo. Tendré tiempo el sábado y haré la reserva por la mañana.",
     "¿Cuándo hará la reserva?",
     "Listen and give a short answer in English or Spanish.",
     "El sábado por la mañana.",
     [
      "On Saturday morning.",
      "Sábado por la mañana"
     ],
     "The planned action is tied to Saturday morning."
    ]
   ],
   "writing": [
    {
     "es": "Escribe «Tomorrow I will make the reservation».",
     "en": "Translate the commitment.",
     "model": "Mañana haré la reserva.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Confirma una reunión y explica qué vas a preparar.",
     "en": "Confirm an arrangement and preparation.",
     "model": "Quedamos a las seis. Voy a preparar una lista y la enviaré esta tarde.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Expresa un plan",
       "any": [
        "voy a",
        "iremos",
        "haré"
       ]
      },
      {
       "label": "Da un horario o motivo",
       "any": [
        "sábado",
        "porque",
        "seis"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Cambia al futuro: tengo tiempo el sábado.",
     "en": "Use simple future for Saturday availability.",
     "model": "Tendré tiempo el sábado.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Organiza una salida con decisiones firmes y opciones abiertas.",
     "en": "Plan an outing without pretending every detail is decided.",
     "model": "Iremos a Toledo el domingo y volveremos antes de las ocho. Todavía no hemos elegido restaurante. Voy a mirar dos opciones.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Expresa un plan",
       "any": [
        "voy a",
        "iremos",
        "haré"
       ]
      },
      {
       "label": "Da un horario o motivo",
       "any": [
        "sábado",
        "porque",
        "seis"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Explica a Luis por qué no puedes ir el viernes y propón una alternativa.",
     "en": "Decline Friday and propose an alternative.",
     "model": "No podré ir el viernes porque trabajo. Tendré tiempo el sábado. ¿Quedamos por la mañana?",
     "mode": "free",
     "requirements": [
      {
       "label": "Expresa un plan",
       "any": [
        "voy a",
        "iremos",
        "haré"
       ]
      },
      {
       "label": "Da un horario o motivo",
       "any": [
        "sábado",
        "porque",
        "seis"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    }
   ]
  },
  {
   "title": "Advice and solutions",
   "goal": "Offer practical advice while respecting the other person’s choice",
   "grammar": "Conditional advice deberías/podrías; yo que tú; no hace falta; obligation",
   "core": [
    {
     "model": "Deberías llamar antes de salir.",
     "translation": "You should call before leaving.",
     "gap": "Deberías",
     "gapWrong": [
      "Debiste",
      "Deberás"
     ],
     "wrong": [
      "Debiste llamar antes de salir.",
      "Deberás llamar antes de salir."
     ],
     "why": "Deberías softens advice; it is not a command or a completed action.",
     "ask": "Elige la frase que comunica: «You should call before leaving.».",
     "help": "Choose the response meaning: You should call before leaving.",
     "dialogue": [
      "Ana: «No sé si la tienda está abierta».",
      "Choose the appropriate response to this exchange.",
      "Podrías llamar primero.",
      [
       "Ya llamaste mañana.",
       "Nunca preguntes nada."
      ],
      "Deberías softens advice; it is not a command or a completed action."
     ],
     "transfer": [
      "Luis no sabe el horario. Recomienda mirarlo antes de viajar.",
      "Respond to the Spanish situation using the taught language.",
      "Deberías mirar el horario antes de viajar.",
      [],
      "Deberías softens advice; it is not a command or a completed action."
     ]
    },
    {
     "model": "Yo que tú, pediría una copia del recibo.",
     "translation": "If I were you, I would ask for a copy of the receipt.",
     "gap": "pediría",
     "gapWrong": [
      "pedí",
      "pediré"
     ],
     "wrong": [
      "Yo que tú, pedí una copia del recibo.",
      "Yo que tú, pediré una copia del recibo."
     ],
     "why": "Yo que tú frames a suggestion from your perspective; conditional keeps it hypothetical.",
     "ask": "Elige la frase que comunica: «If I were you, I would ask for a copy of the receipt.».",
     "help": "Choose the response meaning: If I were you, I would ask for a copy of the receipt.",
     "dialogue": [
      "Marta: «He perdido el recibo».",
      "Choose the appropriate response to this exchange.",
      "Yo que tú, pediría una copia.",
      [
       "No tienes ninguna opción nunca.",
       "Lo compraste mañana."
      ],
      "Yo que tú frames a suggestion from your perspective; conditional keeps it hypothetical."
     ],
     "transfer": [
      "Ana no entiende un mensaje. Sugiere pedir una aclaración.",
      "Respond to the Spanish situation using the taught language.",
      "Yo que tú, pediría una aclaración.",
      [],
      "Yo que tú frames a suggestion from your perspective; conditional keeps it hypothetical."
     ]
    },
    {
     "model": "No hace falta comprar otro billete; puedes cambiar este.",
     "translation": "You do not need to buy another ticket; you can change this one.",
     "gap": "No hace falta",
     "gapWrong": [
      "No hice falta",
      "Hace no falta"
     ],
     "wrong": [
      "No hice falta comprar otro billete; puedes cambiar este.",
      "Hace no falta comprar otro billete; puedes cambiar este."
     ],
     "why": "No hace falta + infinitive removes an obligation and offers a practical alternative.",
     "ask": "Elige la frase que comunica: «You do not need to buy another ticket; you can change this one.».",
     "help": "Choose the response meaning: You do not need to buy another ticket; you can change this one.",
     "dialogue": [
      "Luis: «¿Tengo que comprar otro?»",
      "Choose the appropriate response to this exchange.",
      "No hace falta; puedes cambiarlo.",
      [
       "Debes comprar todos.",
       "Nunca hay cambios."
      ],
      "No hace falta + infinitive removes an obligation and offers a practical alternative."
     ],
     "transfer": [
      "No es necesario imprimir la reserva; se puede mostrar en el móvil.",
      "Respond to the Spanish situation using the taught language.",
      "No hace falta imprimir la reserva; puedes mostrarla en el móvil.",
      [],
      "No hace falta + infinitive removes an obligation and offers a practical alternative."
     ]
    }
   ],
   "stories": [
    {
     "title": "El ordenador lento",
     "text": "Luis se queja de que su ordenador funciona despacio. Quiere comprar uno nuevo esa misma tarde porque tiene una entrega al día siguiente. Clara le pregunta primero qué ocurre. El problema empezó después de instalar un programa y no afecta a todos los documentos. Clara no promete arreglarlo. Sugiere guardar una copia del trabajo y consultar al servicio técnico antes de gastar dinero. «Podrías usar el ordenador de la biblioteca para terminar», añade. Luis acepta esa solución temporal. Después descubre que una actualización resuelve el problema. Agradece que Clara no le dijera simplemente qué debía comprar. El consejo le dio opciones y protegió su trabajo sin presentar una opinión como un diagnóstico seguro.",
     "glossary": [
      [
       "la entrega",
       "submission deadline"
      ],
      [
       "una actualización",
       "an update"
      ]
     ],
     "questions": [
      [
       "¿Qué propone Clara primero?",
       "Read the situation and choose the supported interpretation.",
       "Proteger el trabajo y pedir ayuda técnica.",
       [
        "Comprar inmediatamente.",
        "Borrar todos los documentos."
       ],
       "Useful advice separates a temporary solution from certainty about the cause."
      ],
      [
       "¿Por qué Luis tiene prisa?",
       "Explain the reason using a short English or Spanish response.",
       "Debe entregar un trabajo mañana.",
       [
        "He has a deadline tomorrow."
       ],
       "Useful advice separates a temporary solution from certainty about the cause."
      ],
      [
       "¿Qué función tiene la biblioteca?",
       "Choose the implication supported by the passage.",
       "Una solución temporal.",
       [
        "Un diagnóstico técnico.",
        "Una tienda de ordenadores."
       ],
       "Useful advice separates a temporary solution from certainty about the cause."
      ],
      [
       "¿Qué valora Luis del consejo?",
       "Give a short response about the speaker’s viewpoint.",
       "Le dio opciones sin prometer un diagnóstico.",
       [
        "It offered options without claiming a diagnosis."
       ],
       "Useful advice separates a temporary solution from certainty about the cause."
      ],
      [
       "¿Qué consejo encaja?",
       "Choose the response appropriate to the passage.",
       "Podrías guardar una copia antes de cambiar nada.",
       [
        "Debes borrar todo sin mirar.",
        "No necesitas entregar el trabajo."
       ],
       "Useful advice separates a temporary solution from certainty about the cause."
      ]
     ]
    },
    {
     "title": "La reserva equivocada",
     "text": "Ana reservó una habitación para dos noches, pero la confirmación muestra una sola. Está nerviosa y quiere cancelar sin llamar. Marta le dice que debería hablar primero con el hotel y tener a mano el correo. No hace falta empezar con una acusación: puede explicar la diferencia y preguntar por las opciones. Ana llama y la recepcionista revisa la reserva. Hay sitio para la segunda noche, aunque el precio es algo mayor. Ana pide la nueva confirmación por escrito antes de aceptar. Marta no decide por ella. Le ayuda a comparar el coste con cambiar de hotel. Al final Ana mantiene la reserva porque la ubicación le conviene y conoce el precio total.",
     "glossary": [
      [
       "tener a mano",
       "have ready"
      ],
      [
       "por escrito",
       "in writing"
      ]
     ],
     "questions": [
      [
       "¿Qué recomienda Marta antes de cancelar?",
       "Read the situation and choose the supported interpretation.",
       "Hablar con el hotel.",
       [
        "Reservar tres hoteles.",
        "Acusar sin comprobar."
       ],
       "Advice prepares a calm exchange and leaves the choice with the learner."
      ],
      [
       "¿Por qué pide confirmación escrita?",
       "Explain the reason using a short English or Spanish response.",
       "Para tener claros los detalles.",
       [
        "To have clear details."
       ],
       "Advice prepares a calm exchange and leaves the choice with the learner."
      ],
      [
       "¿Qué hace Marta con la decisión?",
       "Choose the implication supported by the passage.",
       "Ayuda a comparar, pero no decide por Ana.",
       [
        "Elige sin preguntar.",
        "Se niega a escuchar."
       ],
       "Advice prepares a calm exchange and leaves the choice with the learner."
      ],
      [
       "¿Por qué Ana mantiene la reserva?",
       "Give a short response about the speaker’s viewpoint.",
       "Le convienen ubicación y coste conocido.",
       [
        "The location suits her and the total cost is clear."
       ],
       "Advice prepares a calm exchange and leaves the choice with the learner."
      ],
      [
       "¿Qué petición encaja?",
       "Choose the response appropriate to the passage.",
       "¿Podría enviarme la confirmación por escrito?",
       [
        "No quiero conocer el precio.",
        "La reserva es ayer mañana."
       ],
       "Advice prepares a calm exchange and leaves the choice with the learner."
      ]
     ]
    },
    {
     "title": "Una tarea demasiado grande",
     "text": "Diego tiene que preparar una presentación y no sabe por dónde empezar. Ha escrito muchas notas, pero no ha elegido las ideas principales. Elena le sugiere dividir el trabajo en tres partes. Primero podría explicar el problema; después mostrar un ejemplo; al final proponer una solución. No hace falta contar todos los detalles que conoce. Diego teme olvidar algo importante. Elena le recomienda ensayar con un compañero y pedir preguntas al final. Él prepara una versión más corta y descubre que puede explicarla sin leer cada palabra. No ha aprendido menos: ha organizado mejor lo que sabe. El consejo trata de claridad, no de hablar más rápido para incluirlo todo.",
     "glossary": [
      [
       "ensayar",
       "rehearse"
      ],
      [
       "las ideas principales",
       "main ideas"
      ]
     ],
     "questions": [
      [
       "¿Cuál es el problema de Diego?",
       "Read the situation and choose the supported interpretation.",
       "Tiene notas sin una estructura clara.",
       [
        "No sabe ningún detalle.",
        "No tiene presentación."
       ],
       "Removing less relevant detail can improve communication, not reduce understanding."
      ],
      [
       "¿Por qué conviene una versión más corta?",
       "Explain the reason using a short English or Spanish response.",
       "Ayuda a explicar las ideas principales.",
       [
        "It helps explain the main ideas."
       ],
       "Removing less relevant detail can improve communication, not reduce understanding."
      ],
      [
       "¿Qué cambia al organizar el trabajo?",
       "Choose the implication supported by the passage.",
       "Puede explicarlo sin leer todo.",
       [
        "Tiene que hablar más rápido.",
        "Olvida el tema completo."
       ],
       "Removing less relevant detail can improve communication, not reduce understanding."
      ],
      [
       "¿Qué aconseja Elena?",
       "Give a short response about the speaker’s viewpoint.",
       "Claridad antes que cantidad.",
       [
        "Clarity rather than quantity."
       ],
       "Removing less relevant detail can improve communication, not reduce understanding."
      ],
      [
       "¿Qué consejo encaja?",
       "Choose the response appropriate to the passage.",
       "Podrías elegir tres ideas y ensayar.",
       [
        "Incluye todo y habla sin parar.",
        "No hace falta entender el problema."
       ],
       "Removing less relevant detail can improve communication, not reduce understanding."
      ]
     ]
    },
    {
     "title": "Consejos que no son órdenes",
     "text": "Marta escucha a dos amigos hablar de un viaje. Uno dice que todos deberían visitar cinco ciudades en una semana. El otro prefiere conocer una sola con calma. Marta no quiere elegir por ellos. Pregunta cuánto tiempo tienen y qué les interesa. Sugiere comparar los trayectos antes de reservar. También recuerda que no hace falta seguir su propio itinerario: a ella le gusta caminar, pero su amiga necesita descansar más. Los amigos deciden pasar tres días en una ciudad y dejar libre el último día. Agradecen una propuesta que tiene en cuenta sus preferencias. Marta entiende que un consejo puede ser razonable para una persona y poco útil para otra.",
     "glossary": [
      [
       "el itinerario",
       "itinerary"
      ],
      [
       "tiene en cuenta",
       "takes into account"
      ]
     ],
     "questions": [
      [
       "¿Qué pregunta Marta antes de aconsejar?",
       "Read the situation and choose the supported interpretation.",
       "Por el tiempo y los intereses.",
       [
        "Por todos los hoteles del país.",
        "Por una decisión ya impuesta."
       ],
       "Conditional advice can guide a decision without turning preference into obligation."
      ],
      [
       "¿Por qué no propone copiar su ruta?",
       "Explain the reason using a short English or Spanish response.",
       "Sus preferencias son diferentes.",
       [
        "Their preferences differ."
       ],
       "Conditional advice can guide a decision without turning preference into obligation."
      ],
      [
       "¿Qué muestra el plan final?",
       "Choose the implication supported by the passage.",
       "Adapta el consejo a las personas.",
       [
        "Obedece una orden única.",
        "Incluye cinco ciudades."
       ],
       "Conditional advice can guide a decision without turning preference into obligation."
      ],
      [
       "¿Cómo entiende Marta un buen consejo?",
       "Give a short response about the speaker’s viewpoint.",
       "Depende de la situación de cada persona.",
       [
        "It depends on each person’s situation."
       ],
       "Conditional advice can guide a decision without turning preference into obligation."
      ],
      [
       "¿Qué formulación deja elección?",
       "Choose the response appropriate to the passage.",
       "Podríais comparar los trayectos antes de decidir.",
       [
        "Tenéis que hacer exactamente mi viaje.",
        "No hay ninguna alternativa."
       ],
       "Conditional advice can guide a decision without turning preference into obligation."
      ]
     ]
    }
   ],
   "audio": [
    [
     "Yo que tú, llamaría al hotel antes de cancelar. No hace falta comprar otra reserva todavía. Primero pide que comprueben las fechas.",
     "¿Cuál es el consejo principal?",
     "Listen and choose the supported meaning.",
     "Comprobar la reserva antes de cancelarla.",
     [
      "Cancelar sin hablar.",
      "Comprar dos habitaciones."
     ],
     "The suggested order is check, then decide."
    ],
    [
     "Podrías dividir la presentación en tres partes. No hace falta leer todas las notas; deberías elegir las ideas principales.",
     "¿Qué debería elegir?",
     "Listen and give a short answer in English or Spanish.",
     "Las ideas principales.",
     [
      "The main ideas."
     ],
     "The advice prioritises selection and structure."
    ]
   ],
   "writing": [
    {
     "es": "Escribe «You should call first».",
     "en": "Translate softened advice.",
     "model": "Deberías llamar primero.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Ofrece dos opciones a alguien que ha perdido una reserva.",
     "en": "Offer two practical options.",
     "model": "Podrías llamar al hotel o buscar el correo. Yo que tú, comprobaría las fechas antes de reservar otra vez.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Ofrece una opción",
       "any": [
        "podrías",
        "deberías",
        "yo que tú"
       ]
      },
      {
       "label": "Explica una razón",
       "any": [
        "porque",
        "antes de"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Expresa que no es necesario imprimir el billete.",
     "en": "Say printing is unnecessary.",
     "model": "No hace falta imprimir el billete.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Escribe consejos para organizar una tarea. Explica por qué ayudan.",
     "en": "Advise on organising a task and explain why.",
     "model": "Deberías elegir las ideas principales porque tienes poco tiempo. Podrías ensayar con una amiga. No hace falta leer todas las notas.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Ofrece una opción",
       "any": [
        "podrías",
        "deberías",
        "yo que tú"
       ]
      },
      {
       "label": "Explica una razón",
       "any": [
        "porque",
        "antes de"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Una amiga quiere cancelar un viaje por un cambio de horario. Aconséjala sin decidir por ella.",
     "en": "Give advice without deciding for your friend.",
     "model": "Yo que tú, miraría si puedes cambiar el billete. Podrías llamar a la empresa. No hace falta cancelar antes de conocer las opciones.",
     "mode": "free",
     "requirements": [
      {
       "label": "Ofrece una opción",
       "any": [
        "podrías",
        "deberías",
        "yo que tú"
       ]
      },
      {
       "label": "Explica una razón",
       "any": [
        "porque",
        "antes de"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    }
   ]
  },
  {
   "title": "Experiences and reactions",
   "goal": "Describe an experience and explain a personal reaction",
   "grammar": "Me sorprendió/preocupó/encantó; me pareció; lo pasé; tenía ganas de",
   "core": [
    {
     "model": "Me sorprendió la tranquilidad del barrio.",
     "translation": "The quietness of the neighbourhood surprised me.",
     "gap": "sorprendió",
     "gapWrong": [
      "sorprendí",
      "sorprendieron"
     ],
     "wrong": [
      "Me sorprendí la tranquilidad del barrio.",
      "Me sorprendieron la tranquilidad del barrio."
     ],
     "why": "The thing causing the reaction controls the verb: la tranquilidad is singular.",
     "ask": "Elige la frase que comunica: «The quietness of the neighbourhood surprised me.».",
     "help": "Choose the response meaning: The quietness of the neighbourhood surprised me.",
     "dialogue": [
      "Ana: «¿Qué te llamó la atención?»",
      "Choose the appropriate response to this exchange.",
      "Me sorprendió la tranquilidad.",
      [
       "Yo sorprendió el barrio.",
       "Me sorprendieron la tranquilidad."
      ],
      "The thing causing the reaction controls the verb: la tranquilidad is singular."
     ],
     "transfer": [
      "Dos detalles te sorprendieron: el precio y la atención.",
      "Respond to the Spanish situation using the taught language.",
      "Me sorprendieron el precio y la atención.",
      [],
      "The thing causing the reaction controls the verb: la tranquilidad is singular."
     ]
    },
    {
     "model": "Tenía ganas de conocer el museo y lo pasé muy bien.",
     "translation": "I wanted to visit the museum and had a very good time.",
     "gap": "Tenía",
     "gapWrong": [
      "Tuve mañana",
      "Tengo ayer"
     ],
     "wrong": [
      "Tuve mañana ganas de conocer el museo y lo pasé muy bien.",
      "Tengo ayer ganas de conocer el museo y lo pasé muy bien."
     ],
     "why": "Tenía ganas de gives the prior wish; lo pasé bien describes the completed experience.",
     "ask": "Elige la frase que comunica: «I wanted to visit the museum and had a very good time.».",
     "help": "Choose the response meaning: I wanted to visit the museum and had a very good time.",
     "dialogue": [
      "Luis: «¿Disfrutaste de la visita?»",
      "Choose the appropriate response to this exchange.",
      "Sí, lo pasé muy bien.",
      [
       "Sí, lo fui muy bien.",
       "No tengo mañana ayer."
      ],
      "Tenía ganas de gives the prior wish; lo pasé bien describes the completed experience."
     ],
     "transfer": [
      "Querías ver la exposición. Cuenta que disfrutaste de la visita.",
      "Respond to the Spanish situation using the taught language.",
      "Tenía ganas de ver la exposición y lo pasé muy bien.",
      [],
      "Tenía ganas de gives the prior wish; lo pasé bien describes the completed experience."
     ]
    },
    {
     "model": "Me pareció interesante, aunque algunas partes fueron difíciles.",
     "translation": "I found it interesting, although some parts were difficult.",
     "gap": "pareció",
     "gapWrong": [
      "parecí",
      "parecieron"
     ],
     "wrong": [
      "Me parecí interesante, aunque algunas partes fueron difíciles.",
      "Me parecieron interesante, aunque algunas partes fueron difíciles."
     ],
     "why": "Me pareció introduces your evaluation, not an objective fact everyone must share.",
     "ask": "Elige la frase que comunica: «I found it interesting, although some parts were difficult.».",
     "help": "Choose the response meaning: I found it interesting, although some parts were difficult.",
     "dialogue": [
      "Marta: «¿Te gustó la charla?»",
      "Choose the appropriate response to this exchange.",
      "Me pareció interesante, aunque fue larga.",
      [
       "Fue interesante para todo el mundo sin excepción.",
       "Yo pareció interesante."
      ],
      "Me pareció introduces your evaluation, not an objective fact everyone must share."
     ],
     "transfer": [
      "La película te gustó, pero el final fue confuso. Expresa tu valoración.",
      "Respond to the Spanish situation using the taught language.",
      "Me gustó la película, pero el final me pareció confuso.",
      [],
      "Me pareció introduces your evaluation, not an objective fact everyone must share."
     ]
    }
   ],
   "stories": [
    {
     "title": "Una exposición inesperada",
     "text": "Ana tenía ganas de visitar una exposición de fotografías. Esperaba ver edificios conocidos, pero encontró retratos de personas del barrio. Cada fotografía incluía una frase sobre su vida. Le sorprendió reconocer a la señora que veía siempre en la parada del autobús. Nunca habló con ella y ahora sabía que trabajó muchos años en un teatro. Luis prefirió las imágenes de calles antiguas. No discutieron sobre cuál era la mejor parte; compartieron lo que les llamó la atención. Al salir, Ana dijo que lo pasó muy bien porque la visita cambió su manera de mirar un lugar familiar. No necesitó viajar lejos para descubrir una historia nueva.",
     "glossary": [
      [
       "retratos",
       "portraits"
      ],
      [
       "llamó la atención",
       "caught the attention"
      ]
     ],
     "questions": [
      [
       "¿Qué esperaba Ana?",
       "Read the situation and choose the supported interpretation.",
       "Fotografías de edificios conocidos.",
       [
        "Un concierto.",
        "Una película."
       ],
       "Different personal reactions can coexist without a single correct preference."
      ],
      [
       "¿Por qué disfrutó especialmente?",
       "Explain the reason using a short English or Spanish response.",
       "Descubrió historias de gente del barrio.",
       [
        "She discovered neighbours’ stories."
       ],
       "Different personal reactions can coexist without a single correct preference."
      ],
      [
       "¿Qué cambió la visita?",
       "Choose the implication supported by the passage.",
       "Su mirada sobre un lugar familiar.",
       [
        "Su dirección de casa.",
        "El trabajo de Luis."
       ],
       "Different personal reactions can coexist without a single correct preference."
      ],
      [
       "¿Qué prefirió Luis?",
       "Give a short response about the speaker’s viewpoint.",
       "Las calles antiguas.",
       [
        "Old street scenes."
       ],
       "Different personal reactions can coexist without a single correct preference."
      ],
      [
       "¿Cómo expresar la reacción de Ana?",
       "Choose the response appropriate to the passage.",
       "Me sorprendió reconocer a una vecina.",
       [
        "Yo sorprendió una vecina.",
        "No había fotografías."
       ],
       "Different personal reactions can coexist without a single correct preference."
      ]
     ]
    },
    {
     "title": "La primera presentación",
     "text": "Diego dio su primera presentación delante de compañeros de clase. Antes de empezar estaba preocupado porque pensaba olvidar las palabras. Elena le ayudó a ensayar, pero no escribió el texto por él. Al principio Diego habló muy deprisa. Después hizo una pausa y miró sus tres ideas principales. Un compañero preguntó por un ejemplo y Diego pudo explicarlo sin leer. Lo que más le sorprendió fue que las preguntas le ayudaron en lugar de interrumpirlo. Al final recibió comentarios sobre la claridad y sobre una parte demasiado larga. Lo pasó mejor de lo esperado. No presentó la actividad como perfecta: entendió qué funcionó y qué puede mejorar para la próxima vez.",
     "glossary": [
      [
       "ensayar",
       "rehearse"
      ],
      [
       "interrumpirlo",
       "interrupt him"
      ]
     ],
     "questions": [
      [
       "¿Qué le preocupaba antes?",
       "Read the situation and choose the supported interpretation.",
       "Olvidar las palabras.",
       [
        "No tener compañeros.",
        "Llegar al teatro."
       ],
       "An encouraging result need not erase useful critical feedback."
      ],
      [
       "¿Por qué fueron útiles las preguntas?",
       "Explain the reason using a short English or Spanish response.",
       "Le ayudaron a explicar un ejemplo.",
       [
        "They helped him explain an example."
       ],
       "An encouraging result need not erase useful critical feedback."
      ],
      [
       "¿Qué valoración es equilibrada?",
       "Choose the implication supported by the passage.",
       "Hubo aciertos y algo que mejorar.",
       [
        "Todo fue perfecto.",
        "Nada funcionó."
       ],
       "An encouraging result need not erase useful critical feedback."
      ],
      [
       "¿Qué le sorprendió?",
       "Give a short response about the speaker’s viewpoint.",
       "Que las preguntas le ayudaran.",
       [
        "That the questions helped him."
       ],
       "An encouraging result need not erase useful critical feedback."
      ],
      [
       "¿Qué reflexión encaja?",
       "Choose the response appropriate to the passage.",
       "Me fue mejor de lo esperado; debo acortar una parte.",
       [
        "Nunca prepararé otra presentación.",
        "No recibí comentarios."
       ],
       "An encouraging result need not erase useful critical feedback."
      ]
     ]
    },
    {
     "title": "Una cena con opiniones distintas",
     "text": "Clara invitó a sus amigos a un restaurante nuevo. A Marta le encantó la sopa, pero a Luis le pareció demasiado salada. Ana valoró que el camarero explicara los ingredientes con paciencia. Diego estaba preocupado por el precio, aunque al final la cuenta fue menor de lo esperado. Al comentar la cena, separaron comida, atención y coste. Clara no se sintió atacada porque alguien no disfrutó de un plato. Explicó que quería conocer el lugar y no garantizar una experiencia perfecta. Todos lo pasaron bien conversando. Decidieron que podían repetir otra vez y elegir platos diferentes. La conversación mostró que una experiencia compartida puede producir reacciones distintas sin estropear la relación.",
     "glossary": [
      [
       "la atención",
       "service"
      ],
      [
       "estropear",
       "spoil"
      ]
     ],
     "questions": [
      [
       "¿Sobre qué no estuvieron todos de acuerdo?",
       "Read the situation and choose the supported interpretation.",
       "La sopa.",
       [
        "La existencia del restaurante.",
        "La fecha de la cena."
       ],
       "A reaction is personal; explain it without turning disagreement into conflict."
      ],
      [
       "¿Por qué Diego estaba preocupado?",
       "Explain the reason using a short English or Spanish response.",
       "Por el precio.",
       [
        "Because of the price."
       ],
       "A reaction is personal; explain it without turning disagreement into conflict."
      ],
      [
       "¿Qué separaron al valorar la cena?",
       "Choose the implication supported by the passage.",
       "Comida, atención y coste.",
       [
        "La cena y la conversación como una sola nota.",
        "Solo el nombre del local."
       ],
       "A reaction is personal; explain it without turning disagreement into conflict."
      ],
      [
       "¿Cómo recibió Clara la crítica?",
       "Give a short response about the speaker’s viewpoint.",
       "No la tomó como un ataque personal.",
       [
        "She did not take it personally."
       ],
       "A reaction is personal; explain it without turning disagreement into conflict."
      ],
      [
       "¿Qué comentario permite discrepar con respeto?",
       "Choose the response appropriate to the passage.",
       "Lo pasé bien, aunque la sopa me pareció salada.",
       [
        "Si no te gusta, eres mal amigo.",
        "Todos tienen que pensar igual."
       ],
       "A reaction is personal; explain it without turning disagreement into conflict."
      ]
     ]
    },
    {
     "title": "Volver al sendero",
     "text": "Luis volvió con su padre a un camino que recorrían cuando era pequeño. Tenía ganas de enseñárselo a Ana, pero estaba preocupado por una cuesta difícil. Su padre propuso una ruta más corta y varias paradas. Durante la caminata contaron recuerdos y compararon el paisaje de antes con el de ahora. A Ana le sorprendió ver cuánto conocía Luis cada curva. Luis descubrió que disfrutaba más caminando despacio que intentando terminar rápido. Al final lo pasaron bien, aunque no llegaron al punto más alto. Su padre dijo que el objetivo era compartir la mañana, no demostrar fuerza. Luis aceptó esa valoración y empezó a pensar en otra salida tranquila.",
     "glossary": [
      [
       "el camino",
       "path"
      ],
      [
       "la cuesta",
       "slope"
      ]
     ],
     "questions": [
      [
       "¿Qué cambió el padre?",
       "Read the situation and choose the supported interpretation.",
       "Propuso una ruta más corta.",
       [
        "Canceló la salida.",
        "Quitó todas las paradas."
       ],
       "The final interpretation changes the criterion for a successful experience."
      ],
      [
       "¿Por qué Luis estaba preocupado?",
       "Explain the reason using a short English or Spanish response.",
       "Por una cuesta difícil.",
       [
        "Because of a difficult slope."
       ],
       "The final interpretation changes the criterion for a successful experience."
      ],
      [
       "¿Qué demuestra el final?",
       "Choose the implication supported by the passage.",
       "Disfrutar no dependía de llegar arriba.",
       [
        "La salida fracasó por completo.",
        "Nadie compartió recuerdos."
       ],
       "The final interpretation changes the criterion for a successful experience."
      ],
      [
       "¿Qué valoró el padre?",
       "Give a short response about the speaker’s viewpoint.",
       "Compartir la mañana.",
       [
        "Spending the morning together."
       ],
       "The final interpretation changes the criterion for a successful experience."
      ],
      [
       "¿Qué valoración encaja?",
       "Choose the response appropriate to the passage.",
       "Lo pasamos bien, aunque no llegamos arriba.",
       [
        "No caminamos nada.",
        "Solo importa terminar primero."
       ],
       "The final interpretation changes the criterion for a successful experience."
      ]
     ]
    }
   ],
   "audio": [
    [
     "Tenía ganas de ver la exposición. Me sorprendieron las fotos del barrio y me encantó escuchar las historias. Algunas explicaciones fueron largas, pero lo pasé bien.",
     "¿Cuál es la valoración general?",
     "Listen and choose the supported meaning.",
     "Positiva, con una pequeña crítica.",
     [
      "Totalmente negativa.",
      "No llegó a verla."
     ],
     "Pero preserves a positive overall reaction despite a limitation."
    ],
    [
     "Me preocupó el precio al principio. Después vimos la cuenta y fue menos de lo esperado. Me pareció un lugar agradable.",
     "¿Qué le preocupó primero?",
     "Listen and give a short answer in English or Spanish.",
     "El precio.",
     [
      "The price."
     ],
     "The price is the initial concern."
    ]
   ],
   "writing": [
    {
     "es": "Escribe «I had a very good time».",
     "en": "Translate the reaction.",
     "model": "Lo pasé muy bien.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Valora una visita con una reacción positiva y una dificultad.",
     "en": "Evaluate a visit with a positive reaction and a difficulty.",
     "model": "Me encantó la exposición, aunque algunas explicaciones fueron largas. Lo pasé bien y aprendí algo nuevo.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Expresa una reacción",
       "any": [
        "me sorprendió",
        "me encantó",
        "me pareció"
       ]
      },
      {
       "label": "Añade una valoración con motivo",
       "any": [
        "porque",
        "aunque"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Dos detalles te sorprendieron. Completa: me ___ los precios y el horario.",
     "en": "Use plural agreement.",
     "model": "Me sorprendieron los precios y el horario.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Cuenta una experiencia que fue diferente de lo esperado.",
     "en": "Describe an experience that differed from expectations.",
     "model": "Tenía ganas de ver la obra, pero estaba preocupado por no entenderla. Me sorprendió la claridad de los actores. Al final lo pasé muy bien.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Expresa una reacción",
       "any": [
        "me sorprendió",
        "me encantó",
        "me pareció"
       ]
      },
      {
       "label": "Añade una valoración con motivo",
       "any": [
        "porque",
        "aunque"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Escribe a una amiga sobre una actividad. Explica qué te sorprendió y qué mejorarías.",
     "en": "Report an activity, surprise and possible improvement.",
     "model": "Lo pasé bien en la excursión. Me sorprendió el paisaje, aunque el camino fue largo. La próxima vez haría más paradas.",
     "mode": "free",
     "requirements": [
      {
       "label": "Expresa una reacción",
       "any": [
        "me sorprendió",
        "me encantó",
        "me pareció"
       ]
      },
      {
       "label": "Añade una valoración con motivo",
       "any": [
        "porque",
        "aunque"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    }
   ]
  },
  {
   "title": "Explaining your view",
   "goal": "Express a view, support it and acknowledge a different advantage",
   "grammar": "Creo/pienso/me parece que; por una parte; sin embargo; por eso; por/para",
   "core": [
    {
     "model": "Creo que el tren es mejor porque permite descansar.",
     "translation": "I think the train is better because it allows us to rest.",
     "gap": "Creo",
     "gapWrong": [
      "Creí ayer mañana",
      "Creer"
     ],
     "wrong": [
      "Creí ayer mañana que el tren es mejor porque permite descansar.",
      "Creer que el tren es mejor porque permite descansar."
     ],
     "why": "Positive creo que normally takes indicative; porque supplies support, not certainty for everyone.",
     "ask": "Elige la frase que comunica: «I think the train is better because it allows us to rest.».",
     "help": "Choose the response meaning: I think the train is better because it allows us to rest.",
     "dialogue": [
      "Luis: «¿Por qué prefieres el tren?»",
      "Choose the appropriate response to this exchange.",
      "Porque puedo descansar durante el viaje.",
      [
       "Porque sí, no hay ninguna razón.",
       "Para ayer llegamos."
      ],
      "Positive creo que normally takes indicative; porque supplies support, not certainty for everyone."
     ],
     "transfer": [
      "Prefieres caminar porque conoces mejor el barrio. Explica tu opinión.",
      "Respond to the Spanish situation using the taught language.",
      "Creo que caminar es mejor porque conozco mejor el barrio.",
      [],
      "Positive creo que normally takes indicative; porque supplies support, not certainty for everyone."
     ]
    },
    {
     "model": "Por una parte es barato; por otra parte tarda más.",
     "translation": "On one hand it is cheap; on the other hand it takes longer.",
     "gap": "Por una parte",
     "gapWrong": [
      "Después de parte",
      "Para una parte"
     ],
     "wrong": [
      "Después de parte es barato; por otra parte tarda más.",
      "Para una parte es barato; por otra parte tarda más."
     ],
     "why": "The paired phrases organise two relevant aspects of the same option.",
     "ask": "Elige la frase que comunica: «On one hand it is cheap; on the other hand it takes longer.».",
     "help": "Choose the response meaning: On one hand it is cheap; on the other hand it takes longer.",
     "dialogue": [
      "Ana: «¿El autobús tiene alguna desventaja?»",
      "Choose the appropriate response to this exchange.",
      "Sí, tarda más; sin embargo, cuesta menos.",
      [
       "No existe ninguna diferencia.",
       "Es ayer más mañana."
      ],
      "The paired phrases organise two relevant aspects of the same option."
     ],
     "transfer": [
      "Compara una casa pequeña y barata con una grande y cara.",
      "Respond to the Spanish situation using the taught language.",
      "Por una parte la casa pequeña es barata; por otra parte tiene menos espacio.",
      [],
      "The paired phrases organise two relevant aspects of the same option."
     ]
    },
    {
     "model": "Estudio español para hablar con mis vecinos.",
     "translation": "I study Spanish in order to speak with my neighbours.",
     "gap": "para",
     "gapWrong": [
      "por",
      "desde"
     ],
     "wrong": [
      "Estudio español por hablar con mis vecinos.",
      "Estudio español desde hablar con mis vecinos."
     ],
     "why": "Para + infinitive expresses a purpose; porque introduces a reason clause. Por has other reason/route meanings, not this purpose pattern.",
     "ask": "Elige la frase que comunica: «I study Spanish in order to speak with my neighbours.».",
     "help": "Choose the response meaning: I study Spanish in order to speak with my neighbours.",
     "dialogue": [
      "Marta: «¿Para qué estudias español?»",
      "Choose the appropriate response to this exchange.",
      "Para hablar con mis vecinos.",
      [
       "Por hablaré mañana.",
       "Desde hablar con vecinos."
      ],
      "Para + infinitive expresses a purpose; porque introduces a reason clause. Por has other reason/route meanings, not this purpose pattern."
     ],
     "transfer": [
      "Aprendes a cocinar para preparar cenas en casa. Explica el propósito.",
      "Respond to the Spanish situation using the taught language.",
      "Aprendo a cocinar para preparar cenas en casa.",
      [],
      "Para + infinitive expresses a purpose; porque introduces a reason clause. Por has other reason/route meanings, not this purpose pattern."
     ]
    }
   ],
   "stories": [
    {
     "title": "Una reunión en línea",
     "text": "Elena propone hacer una reunión en línea porque algunos compañeros viven lejos. Luis prefiere reunirse en persona: cree que así es más fácil conversar sin interrupciones. En lugar de repetir sus preferencias, comparan las necesidades del grupo. Dos personas no pueden viajar y otra tiene una conexión inestable. Por una parte, la reunión en línea evita trayectos; por otra parte, puede dificultar escuchar a todos. Ana propone una sesión corta en línea para repartir tareas y un encuentro presencial después. No resuelve cada problema, pero permite empezar. Elena acepta porque su objetivo es organizar el trabajo, no defender una herramienta por sí misma. Luis reconoce que su opción favorita no sirve igual para todos.",
     "glossary": [
      [
       "en línea",
       "online"
      ],
      [
       "inestable",
       "unstable"
      ]
     ],
     "questions": [
      [
       "¿Qué busca Elena principalmente?",
       "Read the situation and choose the supported interpretation.",
       "Organizar el trabajo del grupo.",
       [
        "Defender una herramienta a cualquier precio.",
        "Evitar todo contacto."
       ],
       "Compare reasons and needs rather than confuse a preference with a universal answer."
      ],
      [
       "¿Por qué propone reunirse en línea?",
       "Explain the reason using a short English or Spanish response.",
       "Algunos viven lejos.",
       [
        "Some live far away."
       ],
       "Compare reasons and needs rather than confuse a preference with a universal answer."
      ],
      [
       "¿Qué aporta la propuesta de Ana?",
       "Choose the implication supported by the passage.",
       "Combina ventajas de dos formatos.",
       [
        "Niega todas las dificultades.",
        "Obliga a viajar a todos."
       ],
       "Compare reasons and needs rather than confuse a preference with a universal answer."
      ],
      [
       "¿Qué reconoce Luis?",
       "Give a short response about the speaker’s viewpoint.",
       "Su preferencia no sirve igual para todos.",
       [
        "His preference does not suit everyone equally."
       ],
       "Compare reasons and needs rather than confuse a preference with a universal answer."
      ],
      [
       "¿Qué argumento es razonado?",
       "Choose the response appropriate to the passage.",
       "Podemos empezar en línea para incluir a quienes viven lejos.",
       [
        "Mi opción es la única posible porque me gusta.",
        "No hay problemas de conexión."
       ],
       "Compare reasons and needs rather than confuse a preference with a universal answer."
      ]
     ]
    },
    {
     "title": "El banco de la plaza",
     "text": "El ayuntamiento quiere quitar un banco para ampliar el paso de una plaza. Clara piensa que hace falta espacio para circular. Marta explica que muchas personas mayores descansan en ese banco cuando vuelven del mercado. Las dos escuchan experiencias concretas antes de opinar. Un vecino propone mover el banco unos metros en lugar de quitarlo. La propuesta mantiene un lugar para descansar y deja libre la zona más estrecha. Clara dice que le parece una solución mejor porque responde a dos necesidades. Marta no afirma que todos los bancos deban estar en el mismo lugar. Su argumento se apoya en el uso de este banco. El grupo prepara un mensaje breve con motivos claros para enviar la propuesta.",
     "glossary": [
      [
       "el ayuntamiento",
       "town council"
      ],
      [
       "estrecha",
       "narrow"
      ]
     ],
     "questions": [
      [
       "¿Qué propone el vecino?",
       "Read the situation and choose the supported interpretation.",
       "Mover el banco, no quitarlo.",
       [
        "Cerrar el mercado.",
        "Quitar todos los bancos."
       ],
       "A concrete example supports an argument without proving every wider claim."
      ],
      [
       "¿Por qué Marta quiere conservarlo?",
       "Explain the reason using a short English or Spanish response.",
       "Sirve para descansar.",
       [
        "People use it to rest."
       ],
       "A concrete example supports an argument without proving every wider claim."
      ],
      [
       "¿Por qué convence la alternativa?",
       "Choose the implication supported by the passage.",
       "Atiende dos necesidades.",
       [
        "No cambia nada.",
        "Ignora a las personas mayores."
       ],
       "A concrete example supports an argument without proving every wider claim."
      ],
      [
       "¿En qué apoya Marta su argumento?",
       "Give a short response about the speaker’s viewpoint.",
       "En el uso concreto del banco.",
       [
        "In how this bench is used."
       ],
       "A concrete example supports an argument without proving every wider claim."
      ],
      [
       "¿Qué mensaje encaja?",
       "Choose the response appropriate to the passage.",
       "Proponemos mover el banco para dejar paso y conservar un lugar de descanso.",
       [
        "Todo debe quedarse siempre igual.",
        "Nadie usa la plaza."
       ],
       "A concrete example supports an argument without proving every wider claim."
      ]
     ]
    },
    {
     "title": "Comprar menos, elegir mejor",
     "text": "Diego quiere cambiar todos los vasos del café porque algunos no son iguales. Ana le pregunta si están rotos o si solo cambió la moda. Los vasos todavía funcionan. Por una parte, un conjunto nuevo daría una imagen uniforme; por otra parte, costaría dinero y produciría residuos. Diego escucha a sus clientes y descubre que valoran más la limpieza que el diseño. Decide sustituir únicamente los vasos dañados. No presenta su decisión como una regla para todos los negocios. Explica que, en su café, tiene más sentido gastar en arreglar la puerta. Ana está de acuerdo porque la puerta causa un problema real cada mañana. La conversación transforma una impresión inicial en una decisión con prioridades.",
     "glossary": [
      [
       "residuos",
       "waste"
      ],
      [
       "dañados",
       "damaged"
      ]
     ],
     "questions": [
      [
       "¿Qué decide Diego?",
       "Read the situation and choose the supported interpretation.",
       "Cambiar solo los vasos dañados.",
       [
        "Cambiar todos por moda.",
        "No limpiar los vasos."
       ],
       "Good reasons identify priorities and avoid unsupported universal claims."
      ],
      [
       "¿Por qué prioriza la puerta?",
       "Explain the reason using a short English or Spanish response.",
       "Causa un problema real.",
       [
        "It causes a real problem."
       ],
       "Good reasons identify priorities and avoid unsupported universal claims."
      ],
      [
       "¿Qué cambia durante la conversación?",
       "Choose the implication supported by the passage.",
       "Evalúa necesidades en lugar de apariencia solamente.",
       [
        "Deja de escuchar a clientes.",
        "Afirma que todos los cafés son iguales."
       ],
       "Good reasons identify priorities and avoid unsupported universal claims."
      ],
      [
       "¿Qué valoran los clientes?",
       "Give a short response about the speaker’s viewpoint.",
       "La limpieza más que el diseño.",
       [
        "Cleanliness more than design."
       ],
       "Good reasons identify priorities and avoid unsupported universal claims."
      ],
      [
       "¿Qué explicación respeta el contexto?",
       "Choose the response appropriate to the passage.",
       "En nuestro café, arreglar la puerta es más urgente.",
       [
        "Ningún negocio debe comprar vasos nunca.",
        "La moda prueba que están rotos."
       ],
       "Good reasons identify priorities and avoid unsupported universal claims."
      ]
     ]
    },
    {
     "title": "Dos formas de aprender",
     "text": "Luis disfruta aprendiendo palabras con tarjetas. Elena prefiere leer historias y encontrar las palabras en contexto. Al principio cada uno recomienda su método como si fuera el único. Después comparan qué les cuesta. Luis recuerda formas cortas, pero a veces no sabe usarlas en una conversación. Elena entiende historias, aunque olvida algunas palabras al hablar. Deciden probar una combinación: elegirán frases de una historia para repasarlas después. Luis reconoce que una tarjeta puede tener contexto; Elena admite que el recuerdo activo también ayuda. No necesitan abandonar lo que les funciona. Buscan una solución para sus dificultades concretas. Al final describen su acuerdo con una razón: quieren recordar palabras para usarlas, no solo reconocerlas.",
     "glossary": [
      [
       "tarjetas",
       "flashcards"
      ],
      [
       "recuerdo activo",
       "active recall"
      ]
     ],
     "questions": [
      [
       "¿Qué acuerdo alcanzan?",
       "Read the situation and choose the supported interpretation.",
       "Combinar historias y repaso de frases.",
       [
        "Abandonar todo lo anterior.",
        "Usar un único método obligatorio."
       ],
       "A supported view can change when another perspective reveals a need."
      ],
      [
       "¿Para qué quieren recordar palabras?",
       "Explain the reason using a short English or Spanish response.",
       "Para usarlas.",
       [
        "To use them."
       ],
       "A supported view can change when another perspective reveals a need."
      ],
      [
       "¿Qué aporta escuchar al otro?",
       "Choose the implication supported by the passage.",
       "Identificar una dificultad propia.",
       [
        "Demostrar que nadie aprende.",
        "Evitar practicar."
       ],
       "A supported view can change when another perspective reveals a need."
      ],
      [
       "¿Qué admite Elena?",
       "Give a short response about the speaker’s viewpoint.",
       "Que recordar activamente ayuda.",
       [
        "That active recall helps."
       ],
       "A supported view can change when another perspective reveals a need."
      ],
      [
       "¿Qué opinión matizada encaja?",
       "Choose the response appropriate to the passage.",
       "Las historias ayudan, pero también necesito recuperar frases de memoria.",
       [
        "Solo existe un método válido.",
        "Reconocer siempre equivale a hablar."
       ],
       "A supported view can change when another perspective reveals a need."
      ]
     ]
    }
   ],
   "audio": [
    [
     "Por una parte, el piso es barato. Por otra parte, está lejos del trabajo. Prefiero pagar un poco más para ahorrar tiempo cada día.",
     "¿Qué prioridad explica la decisión?",
     "Listen and choose the supported meaning.",
     "Ahorrar tiempo diario.",
     [
      "Tener más habitaciones.",
      "Vivir más lejos."
     ],
     "Para gives the purpose behind accepting more cost."
    ],
    [
     "Creo que debemos mover el banco, no quitarlo. Así dejamos paso y conservamos un lugar para descansar.",
     "¿Qué quieren conservar?",
     "Listen and give a short answer in English or Spanish.",
     "Un lugar para descansar.",
     [
      "A place to rest.",
      "El banco"
     ],
     "The argument balances circulation and rest."
    ]
   ],
   "writing": [
    {
     "es": "Escribe «I study Spanish to speak with my neighbours».",
     "en": "Translate the purpose.",
     "model": "Estudio español para hablar con mis vecinos.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Elige entre tren y autobús y explica una ventaja de cada uno.",
     "en": "Choose transport while recognising both advantages.",
     "model": "Creo que el tren es mejor porque permite descansar. El autobús cuesta menos; sin embargo, tarda más.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Expresa tu opinión",
       "any": [
        "creo que",
        "me parece",
        "pienso que"
       ]
      },
      {
       "label": "Apoya o matiza",
       "any": [
        "porque",
        "sin embargo",
        "por otra parte"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Une: cuesta menos; tarda más. Usa por una parte / por otra parte.",
     "en": "Organise two aspects.",
     "model": "Por una parte cuesta menos; por otra parte tarda más.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Da tu opinión sobre una forma de aprender y considera otra.",
     "en": "Express a learning preference with another perspective.",
     "model": "Me parece útil leer historias porque las palabras tienen contexto. Sin embargo, también necesito practicar de memoria para hablar.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Expresa tu opinión",
       "any": [
        "creo que",
        "me parece",
        "pienso que"
       ]
      },
      {
       "label": "Apoya o matiza",
       "any": [
        "porque",
        "sin embargo",
        "por otra parte"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Propón una solución para una plaza con poco espacio y personas que necesitan sentarse.",
     "en": "Propose a reasoned solution balancing two needs.",
     "model": "Creo que podemos mover el banco para dejar más paso. Por otra parte, debemos conservar un lugar para descansar. Así atendemos dos necesidades.",
     "mode": "free",
     "requirements": [
      {
       "label": "Expresa tu opinión",
       "any": [
        "creo que",
        "me parece",
        "pienso que"
       ]
      },
      {
       "label": "Apoya o matiza",
       "any": [
        "porque",
        "sin embargo",
        "por otra parte"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    }
   ]
  },
  {
   "title": "When things go wrong",
   "goal": "Clarify a less predictable service problem and negotiate a practical solution",
   "grammar": "Communication repair; delivery/booking/lost-property problems; polite clarification",
   "core": [
    {
     "model": "Creo que ha habido un error con la reserva.",
     "translation": "I think there has been a mistake with the booking.",
     "gap": "ha habido",
     "gapWrong": [
      "han habido",
      "ha haber"
     ],
     "wrong": [
      "Creo que han habido un error con la reserva.",
      "Creo que ha haber un error con la reserva."
     ],
     "why": "Impersonal haber stays singular: ha habido un error / varios errores.",
     "ask": "Elige la frase que comunica: «I think there has been a mistake with the booking.».",
     "help": "Choose the response meaning: I think there has been a mistake with the booking.",
     "dialogue": [
      "Recepción: «Solo tenemos una noche». Tú reservaste dos.",
      "Choose the appropriate response to this exchange.",
      "Creo que ha habido un error; reservé dos noches.",
      [
       "Nunca hay una reserva posible.",
       "Sí, reservé mañana ayer."
      ],
      "Impersonal haber stays singular: ha habido un error / varios errores."
     ],
     "transfer": [
      "El pedido contiene otro producto. Explica el error con calma.",
      "Respond to the Spanish situation using the taught language.",
      "Creo que ha habido un error con el pedido.",
      [],
      "Impersonal haber stays singular: ha habido un error / varios errores."
     ]
    },
    {
     "model": "¿Podría explicarlo de otra manera?",
     "translation": "Could you explain it another way?",
     "gap": "Podría",
     "gapWrong": [
      "Pudo",
      "Puede ayer"
     ],
     "wrong": [
      "¿Pudo explicarlo de otra manera?",
      "¿Puede ayer explicarlo de otra manera?"
     ],
     "why": "Conditional podría softens a request; it does not imply an inability or fault.",
     "ask": "Elige la frase que comunica: «Could you explain it another way?».",
     "help": "Choose the response meaning: Could you explain it another way?",
     "dialogue": [
      "La explicación es demasiado rápida. ¿Qué pides?",
      "Choose the appropriate response to this exchange.",
      "¿Podría repetirlo más despacio?",
      [
       "No quiero escuchar nada.",
       "Ya repetí mañana."
      ],
      "Conditional podría softens a request; it does not imply an inability or fault."
     ],
     "transfer": [
      "No entiendes una instrucción. Pide otra explicación.",
      "Respond to the Spanish situation using the taught language.",
      "¿Podría explicarlo de otra manera?",
      [],
      "Conditional podría softens a request; it does not imply an inability or fault."
     ]
    },
    {
     "model": "Perdí la mochila mientras cambiaba de tren.",
     "translation": "I lost my backpack while changing trains.",
     "gap": "Perdí",
     "gapWrong": [
      "Perdía",
      "Perderé"
     ],
     "wrong": [
      "Perdía la mochila mientras cambiaba de tren.",
      "Perderé la mochila mientras cambiaba de tren."
     ],
     "why": "Perdí presents the loss; mientras cambiaba supplies the ongoing situation.",
     "ask": "Elige la frase que comunica: «I lost my backpack while changing trains.».",
     "help": "Choose the response meaning: I lost my backpack while changing trains.",
     "dialogue": [
      "Empleado: «¿Dónde vio la mochila por última vez?»",
      "Choose the appropriate response to this exchange.",
      "La vi en el tren antes de cambiar.",
      [
       "La veré ayer.",
       "No tengo ninguna información."
      ],
      "Perdí presents the loss; mientras cambiaba supplies the ongoing situation."
     ],
     "transfer": [
      "Perdiste las llaves mientras salías del café. Cuenta la situación.",
      "Respond to the Spanish situation using the taught language.",
      "Perdí las llaves mientras salía del café.",
      [],
      "Perdí presents the loss; mientras cambiaba supplies the ongoing situation."
     ]
    }
   ],
   "stories": [
    {
     "title": "Una entrega sin paquete",
     "text": "Marta recibió un aviso de entrega, pero no encontró ningún paquete en casa. Antes de escribir una queja, miró la dirección y preguntó a sus vecinos. Nadie lo tenía. Llamó a la empresa y explicó la diferencia entre el aviso y lo ocurrido. El empleado dijo que el paquete estaba en un punto de recogida. Marta no entendió el nombre de la calle y pidió que lo repitiera más despacio. Después preguntó hasta qué hora podía recogerlo y qué documento necesitaba. Anotó los datos y confirmó la dirección. El problema no desapareció con una disculpa, pero consiguió la información necesaria. Al final recogió el paquete sin comprar el producto otra vez.",
     "glossary": [
      [
       "punto de recogida",
       "collection point"
      ],
      [
       "el aviso",
       "notification"
      ]
     ],
     "questions": [
      [
       "¿Qué diferencia inicia el problema?",
       "Read the situation and choose the supported interpretation.",
       "El aviso dice entregado, pero no hay paquete en casa.",
       [
        "Marta no pidió nada.",
        "El paquete está abierto."
       ],
       "Clarifying location and requirements is more useful than accepting a vague apology."
      ],
      [
       "¿Por qué pide repetir la calle?",
       "Explain the reason using a short English or Spanish response.",
       "No entendió el nombre.",
       [
        "She did not understand the name."
       ],
       "Clarifying location and requirements is more useful than accepting a vague apology."
      ],
      [
       "¿Qué demuestra la confirmación final?",
       "Choose the implication supported by the passage.",
       "Comprueba que entendió la información.",
       [
        "Acepta sin escuchar.",
        "Compra otro producto."
       ],
       "Clarifying location and requirements is more useful than accepting a vague apology."
      ],
      [
       "¿Qué consiguió con la llamada?",
       "Give a short response about the speaker’s viewpoint.",
       "Datos para recoger el paquete.",
       [
        "Information to collect the parcel."
       ],
       "Clarifying location and requirements is more useful than accepting a vague apology."
      ],
      [
       "¿Qué pregunta ayuda a resolverlo?",
       "Choose the response appropriate to the passage.",
       "¿Qué documento necesito para recogerlo?",
       [
        "¿Por qué existen calles?",
        "No quiero saber dónde está."
       ],
       "Clarifying location and requirements is more useful than accepting a vague apology."
      ]
     ]
    },
    {
     "title": "Una mochila reconocible",
     "text": "Luis perdió una mochila durante un cambio de tren. En objetos perdidos le preguntaron por el color, el tamaño y algún detalle especial. Era azul, pero eso no bastaba: tenía una cinta amarilla en una cremallera y un libro con su nombre dentro. El empleado encontró una mochila parecida. Luis no dijo inmediatamente que era suya. Describió el contenido antes de abrirla y después comprobó el libro. La cinta no estaba en el lugar que recordaba, pero el nombre y los objetos coincidían. Firmó la recogida y agradeció la ayuda. El relato muestra que describir algo útil no consiste en añadir muchos adjetivos: conviene escoger detalles que distingan ese objeto de otros.",
     "glossary": [
      [
       "la cremallera",
       "zip"
      ],
      [
       "objetos perdidos",
       "lost property"
      ]
     ],
     "questions": [
      [
       "¿Qué detalle ayuda más a identificarla?",
       "Read the situation and choose the supported interpretation.",
       "El libro con su nombre.",
       [
        "Solo ser azul.",
        "Ser una mochila."
       ],
       "Useful identification relies on distinctive evidence, not only a common colour."
      ],
      [
       "¿Por qué no la reclama inmediatamente?",
       "Explain the reason using a short English or Spanish response.",
       "Quiere comprobar que es suya.",
       [
        "He wants to check ownership."
       ],
       "Useful identification relies on distinctive evidence, not only a common colour."
      ],
      [
       "¿Qué información es más útil?",
       "Choose the implication supported by the passage.",
       "Detalles que la distinguen.",
       [
        "Muchos adjetivos generales.",
        "Ningún contenido."
       ],
       "Useful identification relies on distinctive evidence, not only a common colour."
      ],
      [
       "¿Qué comprobó al final?",
       "Give a short response about the speaker’s viewpoint.",
       "El nombre y los objetos.",
       [
        "The name and contents."
       ],
       "Useful identification relies on distinctive evidence, not only a common colour."
      ],
      [
       "¿Qué descripción encaja?",
       "Choose the response appropriate to the passage.",
       "Es azul y tiene un libro con mi nombre dentro.",
       [
        "Es una cosa normal sin detalles.",
        "Será roja ayer."
       ],
       "Useful identification relies on distinctive evidence, not only a common colour."
      ]
     ]
    },
    {
     "title": "Dos personas con el mismo nombre",
     "text": "Ana llegó a un alojamiento donde había dos reservas a nombre de Ana. La recepcionista empezó a explicar que su habitación estaba cancelada. Ana mostró el número de confirmación y preguntó si hablaban de la misma reserva. Al comparar las fechas, vieron que la cancelación correspondía a otra persona. Ana no necesitó levantar la voz. Dio información concreta y pidió una comprobación. La recepcionista se disculpó y confirmó las dos noches. Antes de subir, Ana repitió el horario de salida para asegurarse de entenderlo. Luis, que esperaba fuera, pensó que la espera significaba un problema grave. Ana explicó que fue una confusión resuelta con datos, no una discusión.",
     "glossary": [
      [
       "a nombre de",
       "in the name of"
      ],
      [
       "una comprobación",
       "a check"
      ]
     ],
     "questions": [
      [
       "¿Qué causó la confusión?",
       "Read the situation and choose the supported interpretation.",
       "Dos reservas con el mismo nombre.",
       [
        "Dos hoteles cerrados.",
        "Un viaje cancelado por Ana."
       ],
       "A request to compare identifiers repairs a misunderstanding without blame."
      ],
      [
       "¿Qué permitió distinguir las reservas?",
       "Explain the reason using a short English or Spanish response.",
       "El número y las fechas.",
       [
        "The confirmation number and dates."
       ],
       "A request to compare identifiers repairs a misunderstanding without blame."
      ],
      [
       "¿Qué muestra su forma de responder?",
       "Choose the implication supported by the passage.",
       "Pide comprobar antes de discutir.",
       [
        "Acepta una cancelación incorrecta.",
        "Oculta la confirmación."
       ],
       "A request to compare identifiers repairs a misunderstanding without blame."
      ],
      [
       "¿Cómo describe Ana la espera?",
       "Give a short response about the speaker’s viewpoint.",
       "Una confusión resuelta con datos.",
       [
        "A confusion resolved using details."
       ],
       "A request to compare identifiers repairs a misunderstanding without blame."
      ],
      [
       "¿Qué pregunta encaja?",
       "Choose the response appropriate to the passage.",
       "¿Podemos comprobar el número de confirmación?",
       [
        "¿Por qué no conoce a todas las Anas?",
        "No tengo ninguna reserva nunca."
       ],
       "A request to compare identifiers repairs a misunderstanding without blame."
      ]
     ]
    },
    {
     "title": "Una instrucción incompleta",
     "text": "Diego debía enviar un documento para una actividad. El mensaje decía «antes del jueves», pero no explicaba si debía usar un formulario o el correo. Diego envió un correo el miércoles y después descubrió que no aparecía en la lista. En lugar de reenviarlo muchas veces, preguntó qué paso faltaba. Elena explicó que el formulario incluía una autorización necesaria. Diego pidió que indicaran ese requisito en el mensaje original. Completó el formulario y recibió confirmación. Elena aceptó que la instrucción podía ser más clara. Los dos distinguieron la intención de Diego de un procedimiento incompleto. Resolver el problema requirió explicar lo que ya hizo y preguntar qué debía hacer después.",
     "glossary": [
      [
       "el requisito",
       "requirement"
      ],
      [
       "el formulario",
       "form"
      ]
     ],
     "questions": [
      [
       "¿Qué faltaba en la primera instrucción?",
       "Read the situation and choose the supported interpretation.",
       "El modo de enviar y la autorización.",
       [
        "La existencia del jueves.",
        "El nombre de Diego."
       ],
       "Clarification identifies the missing procedure without denying the learner’s effort."
      ],
      [
       "¿Por qué no bastó el correo?",
       "Explain the reason using a short English or Spanish response.",
       "Faltaba una autorización del formulario.",
       [
        "The form included a necessary authorisation."
       ],
       "Clarification identifies the missing procedure without denying the learner’s effort."
      ],
      [
       "¿Qué mejora propone Diego?",
       "Choose the implication supported by the passage.",
       "Explicar el requisito desde el principio.",
       [
        "Eliminar todas las fechas.",
        "Reenviar cien veces."
       ],
       "Clarification identifies the missing procedure without denying the learner’s effort."
      ],
      [
       "¿Qué reconoce Elena?",
       "Give a short response about the speaker’s viewpoint.",
       "La instrucción podía ser más clara.",
       [
        "The instruction could be clearer."
       ],
       "Clarification identifies the missing procedure without denying the learner’s effort."
      ],
      [
       "¿Qué petición repara la comunicación?",
       "Choose the response appropriate to the passage.",
       "¿Puede indicar qué paso falta?",
       [
        "Ya lo hice todo, no quiero saber más.",
        "Nunca hay formularios."
       ],
       "Clarification identifies the missing procedure without denying the learner’s effort."
      ]
     ]
    }
   ],
   "audio": [
    [
     "En el mensaje pone que el pedido está entregado, pero no lo he recibido. He comprobado la dirección. ¿Puede decirme dónde está y cómo recogerlo?",
     "¿Qué necesita la persona?",
     "Listen and choose the supported meaning.",
     "Localización e instrucciones de recogida.",
     [
      "Otro pedido inmediato.",
      "Cancelar su dirección."
     ],
     "The request follows a concrete mismatch and asks for next steps."
    ],
    [
     "Perdí una mochila azul al cambiar de tren. Tiene una cinta amarilla y un libro con mi nombre. La vi por última vez en el primer tren.",
     "¿Dónde la vio por última vez?",
     "Listen and give a short answer in English or Spanish.",
     "En el primer tren.",
     [
      "On the first train."
     ],
     "The last known location is explicit."
    ]
   ],
   "writing": [
    {
     "es": "Escribe «Could you repeat it more slowly?».",
     "en": "Translate a polite clarification request.",
     "model": "¿Podría repetirlo más despacio?",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Explica una diferencia entre tu reserva y la confirmación. Pide comprobarla.",
     "en": "Explain a booking mismatch and request a check.",
     "model": "Reservé dos noches, pero la confirmación muestra una. Creo que ha habido un error. ¿Podemos comprobar las fechas?",
     "mode": "guided",
     "requirements": [
      {
       "label": "Explica un problema concreto",
       "any": [
        "pero",
        "error",
        "perdí"
       ]
      },
      {
       "label": "Pide aclaración o solución",
       "any": [
        "puede",
        "podría",
        "comprobar"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Explica: perdí las llaves; salía del café. Usa mientras.",
     "en": "Link a completed loss to an ongoing action.",
     "model": "Perdí las llaves mientras salía del café.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Describe un objeto perdido con detalles que lo distingan y explica dónde lo viste.",
     "en": "Describe a lost object and last known location.",
     "model": "Perdí una mochila azul con una cinta amarilla. Dentro hay un libro con mi nombre. La vi por última vez al cambiar de tren.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Explica un problema concreto",
       "any": [
        "pero",
        "error",
        "perdí"
       ]
      },
      {
       "label": "Pide aclaración o solución",
       "any": [
        "puede",
        "podría",
        "comprobar"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Escribe a una empresa: recibiste un aviso, no el paquete. Explica lo comprobado y pide el siguiente paso.",
     "en": "Explain a missing delivery and request actionable information.",
     "model": "He recibido un aviso de entrega, pero no tengo el paquete. He comprobado la dirección y preguntado a los vecinos. ¿Puede decirme dónde recogerlo y qué documento necesito?",
     "mode": "free",
     "requirements": [
      {
       "label": "Explica un problema concreto",
       "any": [
        "pero",
        "error",
        "perdí"
       ]
      },
      {
       "label": "Pide aclaración o solución",
       "any": [
        "puede",
        "podría",
        "comprobar"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    }
   ]
  },
  {
   "title": "A week to remember",
   "goal": "Sustain a short connected account integrating events, reactions, reasons and changed plans",
   "grammar": "B1.1 synthesis: tense meaning, future, conditional advice, viewpoint",
   "core": [
    {
     "model": "La semana empezó mal, pero al final encontramos una solución.",
     "translation": "The week started badly, but in the end we found a solution.",
     "gap": "encontramos",
     "gapWrong": [
      "encontrar",
      "encontraremos"
     ],
     "wrong": [
      "La semana empezó mal, pero al final encontrar una solución.",
      "La semana empezó mal, pero al final encontraremos una solución."
     ],
     "why": "The surrounding past account makes encontramos a completed outcome.",
     "ask": "Elige la frase que comunica: «The week started badly, but in the end we found a solution.».",
     "help": "Choose the response meaning: The week started badly, but in the end we found a solution.",
     "dialogue": [
      "Marta: «¿Todo salió mal?»",
      "Choose the appropriate response to this exchange.",
      "No; hubo problemas, pero encontramos una solución.",
      [
       "Sí, nunca ocurrió ningún problema.",
       "Mañana terminó ayer."
      ],
      "The surrounding past account makes encontramos a completed outcome."
     ],
     "transfer": [
      "El viaje empezó con un retraso, pero llegaste. Resume el resultado.",
      "Respond to the Spanish situation using the taught language.",
      "El viaje empezó con un retraso, pero al final llegué.",
      [],
      "The surrounding past account makes encontramos a completed outcome."
     ]
    },
    {
     "model": "Me preocupó el cambio; sin embargo, pudimos seguir adelante.",
     "translation": "The change worried me; however, we were able to continue.",
     "gap": "pudimos",
     "gapWrong": [
      "podíamos mañana",
      "podremos"
     ],
     "wrong": [
      "Me preocupó el cambio; sin embargo, podíamos mañana seguir adelante.",
      "Me preocupó el cambio; sin embargo, podremos seguir adelante."
     ],
     "why": "Pudimos reports a successful possibility on that occasion; sin embargo marks contrast.",
     "ask": "Elige la frase que comunica: «The change worried me; however, we were able to continue.».",
     "help": "Choose the response meaning: The change worried me; however, we were able to continue.",
     "dialogue": [
      "Ana: «¿Cómo os afectó el cambio?»",
      "Choose the appropriate response to this exchange.",
      "Nos preocupó, pero seguimos adelante.",
      [
       "No sabemos nada de esa semana.",
       "Mañana nos afectó ayer."
      ],
      "Pudimos reports a successful possibility on that occasion; sin embargo marks contrast."
     ],
     "transfer": [
      "Te sorprendió el retraso, pero encontraste otra opción.",
      "Respond to the Spanish situation using the taught language.",
      "Me sorprendió el retraso; sin embargo, encontré otra opción.",
      [],
      "Pudimos reports a successful possibility on that occasion; sin embargo marks contrast."
     ]
    },
    {
     "model": "La próxima vez comprobaré los horarios y pediré ayuda antes.",
     "translation": "Next time I will check the schedules and ask for help earlier.",
     "gap": "comprobaré",
     "gapWrong": [
      "comprobé",
      "comprobaba"
     ],
     "wrong": [
      "La próxima vez comprobé los horarios y pediré ayuda antes.",
      "La próxima vez comprobaba los horarios y pediré ayuda antes."
     ],
     "why": "Future commitment connects reflection to a concrete next action.",
     "ask": "Elige la frase que comunica: «Next time I will check the schedules and ask for help earlier.».",
     "help": "Choose the response meaning: Next time I will check the schedules and ask for help earlier.",
     "dialogue": [
      "Luis: «¿Qué harás de otra manera?»",
      "Choose the appropriate response to this exchange.",
      "Pediré ayuda antes.",
      [
       "Pedí mañana.",
       "No pasó nada nunca."
      ],
      "Future commitment connects reflection to a concrete next action."
     ],
     "transfer": [
      "La próxima vez harás una lista y reservarás antes.",
      "Respond to the Spanish situation using the taught language.",
      "La próxima vez haré una lista y reservaré antes.",
      [],
      "Future commitment connects reflection to a concrete next action."
     ]
    }
   ],
   "stories": [
    {
     "title": "La semana de la exposición",
     "text": "Elena preparó una pequeña exposición con sus compañeros. El lunes descubrieron que la sala no tenía suficientes mesas. Primero pidieron ayuda al centro y después llamaron a un café cercano. Diego pudo prestarles dos mesas. Mientras organizaban las fotografías, Ana encontró un error en una fecha. Lo corrigieron antes de imprimir el cartel. El jueves Elena estaba cansada y temía olvidar algo. Luis le sugirió repartir las últimas tareas. El sábado llegaron los visitantes y hicieron preguntas interesantes. Al final Elena lo pasó bien, aunque la semana fue difícil. Dijo que la próxima vez preparará una lista compartida desde el principio. Su relato no oculta los problemas; explica cómo respondieron a ellos.",
     "glossary": [
      [
       "prestarles",
       "lend them"
      ],
      [
       "el cartel",
       "poster"
      ]
     ],
     "questions": [
      [
       "¿Qué ayudó con las mesas?",
       "Read the situation and choose the supported interpretation.",
       "El café prestó dos.",
       [
        "Cancelaron la exposición.",
        "Llegaron menos visitantes."
       ],
       "A connected account links difficulties, responses and reflection."
      ],
      [
       "¿Por qué corrigieron la fecha antes de imprimir?",
       "Explain the reason using a short English or Spanish response.",
       "Para evitar un error en el cartel.",
       [
        "To avoid a poster error."
       ],
       "A connected account links difficulties, responses and reflection."
      ],
      [
       "¿Qué aprende Elena para la próxima vez?",
       "Choose the implication supported by the passage.",
       "Preparar una lista compartida antes.",
       [
        "Trabajar siempre sola.",
        "No aceptar preguntas."
       ],
       "A connected account links difficulties, responses and reflection."
      ],
      [
       "¿Cómo valora el resultado?",
       "Give a short response about the speaker’s viewpoint.",
       "Disfrutó, aunque fue una semana difícil.",
       [
        "She enjoyed it despite a difficult week."
       ],
       "A connected account links difficulties, responses and reflection."
      ],
      [
       "¿Qué resumen es equilibrado?",
       "Choose the response appropriate to the passage.",
       "Hubo dificultades y el grupo encontró soluciones.",
       [
        "Todo salió sin ningún cambio.",
        "Nunca abrieron la exposición."
       ],
       "A connected account links difficulties, responses and reflection."
      ]
     ]
    },
    {
     "title": "El viaje de Clara",
     "text": "Clara iba a visitar a su hermana durante el fin de semana. El tren del viernes se retrasó y perdió una conexión. Primero se preocupó porque su hermana esperaba en la estación. Después la llamó y buscó otra opción. Podía tomar un autobús, aunque llegaría más tarde. Su hermana propuso recogerla en otra parada. Clara aceptó y confirmó la nueva hora. El sábado caminaron y cocinaron juntas. El viaje no fue como pensaba, pero lo pasó muy bien. Al volver, explicó que la comunicación fue más importante que mantener el horario inicial. La próxima vez dejará más tiempo entre conexiones. No cree que eso elimine todos los problemas, pero sí puede reducir una dificultad previsible.",
     "glossary": [
      [
       "la conexión",
       "connection"
      ],
      [
       "previsible",
       "predictable"
      ]
     ],
     "questions": [
      [
       "¿Qué perdió Clara?",
       "Read the situation and choose the supported interpretation.",
       "Una conexión.",
       [
        "La dirección de su hermana.",
        "Todas sus pertenencias."
       ],
       "A changed itinerary need not mean a failed visit."
      ],
      [
       "¿Por qué llamó a su hermana?",
       "Explain the reason using a short English or Spanish response.",
       "Para explicar el retraso y cambiar la recogida.",
       [
        "To explain the delay and change the pickup."
       ],
       "A changed itinerary need not mean a failed visit."
      ],
      [
       "¿Qué puede mejorar sin garantizar todo?",
       "Choose the implication supported by the passage.",
       "Dejar más tiempo entre conexiones.",
       [
        "No viajar nunca.",
        "No comunicar cambios."
       ],
       "A changed itinerary need not mean a failed visit."
      ],
      [
       "¿Qué valoró al final?",
       "Give a short response about the speaker’s viewpoint.",
       "La comunicación y el tiempo juntas.",
       [
        "Communication and time together."
       ],
       "A changed itinerary need not mean a failed visit."
      ],
      [
       "¿Qué reflexión encaja?",
       "Choose the response appropriate to the passage.",
       "El plan cambió, pero encontramos otra opción.",
       [
        "Todo fue exactamente igual.",
        "No pude ver a mi hermana."
       ],
       "A changed itinerary need not mean a failed visit."
      ]
     ]
    },
    {
     "title": "Un proyecto compartido",
     "text": "Marta y Ana prepararon un taller para vecinos nuevos. Antes Marta hacía casi todo sola y terminaba agotada. Esta vez pidió ayuda desde el principio. Ana escribió el mensaje de invitación y Luis organizó el espacio. El día del taller hubo más gente de la prevista. Primero movieron algunas sillas y después dividieron el grupo en dos. A Marta le sorprendió que los participantes también ofrecieran soluciones. Al final varias personas propusieron otra sesión. Marta explicó que todavía hubo momentos de confusión, pero ya no sentía que todo dependía de ella. Quiere mantener esa forma de trabajar. La próxima semana hablará con el grupo para decidir un tema, en lugar de elegirlo sin escuchar.",
     "glossary": [
      [
       "agotada",
       "exhausted"
      ],
      [
       "de la prevista",
       "than expected"
      ]
     ],
     "questions": [
      [
       "¿Qué cambió respecto a antes?",
       "Read the situation and choose the supported interpretation.",
       "Marta repartió tareas desde el principio.",
       [
        "Trabajó totalmente sola.",
        "Canceló el taller."
       ],
       "The experience connects changed habits with shared responsibility."
      ],
      [
       "¿Por qué dividieron el grupo?",
       "Explain the reason using a short English or Spanish response.",
       "Había más gente de la prevista.",
       [
        "More people came than expected."
       ],
       "The experience connects changed habits with shared responsibility."
      ],
      [
       "¿Qué indica la propuesta de otra sesión?",
       "Choose the implication supported by the passage.",
       "El encuentro despertó interés.",
       [
        "Nadie disfrutó.",
        "Todos conocían ya el tema."
       ],
       "The experience connects changed habits with shared responsibility."
      ],
      [
       "¿Qué dejó de sentir Marta?",
       "Give a short response about the speaker’s viewpoint.",
       "Que todo dependía de ella.",
       [
        "That everything depended on her."
       ],
       "The experience connects changed habits with shared responsibility."
      ],
      [
       "¿Qué plan mantiene esa mejora?",
       "Choose the response appropriate to the passage.",
       "Hablaré con el grupo antes de elegir el tema.",
       [
        "Elegiré todo sin preguntar.",
        "Nunca pediré ayuda."
       ],
       "The experience connects changed habits with shared responsibility."
      ]
     ]
    },
    {
     "title": "La conversación del domingo",
     "text": "El domingo Ana, Luis y Diego hablaron de sus semanas. Ana contó una visita agradable; Luis explicó un retraso y Diego una presentación difícil. No compitieron por decidir quién tuvo la semana peor. Primero escucharon lo ocurrido y después preguntaron qué ayudó en cada caso. Ana disfrutó porque no llenó todo el día de planes. Luis llamó cuando cambió el horario. Diego pidió comentarios y acortó su presentación. Cada uno encontró una idea útil en la experiencia de otro. Al final acordaron una salida sencilla para la semana siguiente. Todavía no eligieron el lugar, pero fijaron una hora para hablar. El encuentro transformó tres relatos individuales en una conversación con preguntas, razones y propuestas.",
     "glossary": [
      [
       "acortó",
       "shortened"
      ],
      [
       "fijaron",
       "set"
      ]
     ],
     "questions": [
      [
       "¿Cómo organizaron la conversación?",
       "Read the situation and choose the supported interpretation.",
       "Escucharon y preguntaron antes de proponer.",
       [
        "Compitieron por la peor semana.",
        "Solo habló Ana."
       ],
       "Connected communication includes responding to other accounts, not only telling your own."
      ],
      [
       "¿Qué ayudó a Diego?",
       "Explain the reason using a short English or Spanish response.",
       "Los comentarios y una presentación más corta.",
       [
        "Feedback and a shorter presentation."
       ],
       "Connected communication includes responding to other accounts, not only telling your own."
      ],
      [
       "¿Qué salió de compartir experiencias?",
       "Choose the implication supported by the passage.",
       "Ideas útiles y una nueva propuesta.",
       [
        "Una clasificación de amigos.",
        "Una salida ya reservada."
       ],
       "Connected communication includes responding to other accounts, not only telling your own."
      ],
      [
       "¿Qué valoran del encuentro?",
       "Give a short response about the speaker’s viewpoint.",
       "Escucharse y aprender de distintas experiencias.",
       [
        "Listening and learning from different experiences."
       ],
       "Connected communication includes responding to other accounts, not only telling your own."
      ],
      [
       "¿Qué pregunta continúa el diálogo?",
       "Choose the response appropriate to the passage.",
       "¿Qué te ayudó a resolverlo?",
       [
        "¿Por qué tu semana no cuenta?",
        "¿Quién ganó la semana?"
       ],
       "Connected communication includes responding to other accounts, not only telling your own."
      ]
     ]
    }
   ],
   "audio": [
    [
     "La semana empezó con un problema de espacio. Pedimos mesas prestadas y repartimos las tareas. Me preocupó el tiempo, pero al final abrimos la exposición. La próxima vez haré una lista antes.",
     "¿Qué une el relato con el futuro?",
     "Listen and choose the supported meaning.",
     "Una mejora concreta para la próxima vez.",
     [
      "Una promesa de no tener problemas nunca.",
      "Una fecha sin relación."
     ],
     "Reflection produces an actionable next step."
    ],
    [
     "Antes preparaba todo sola. Esta vez Ana escribió la invitación y Luis organizó las sillas. Me sorprendió la ayuda del grupo.",
     "¿Qué cambio hizo esta vez?",
     "Listen and give a short answer in English or Spanish.",
     "Repartió las tareas.",
     [
      "She shared the tasks.",
      "Pidió ayuda"
     ],
     "The contrast concerns sharing responsibility."
    ]
   ],
   "writing": [
    {
     "es": "Escribe «Next time I will ask for help earlier».",
     "en": "Translate the future reflection.",
     "model": "La próxima vez pediré ayuda antes.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Cuenta tres momentos de una semana y cómo se relacionan.",
     "en": "Link three moments from a week.",
     "model": "El lunes hubo un retraso. Después cambiamos el plan y pedimos ayuda. Al final encontramos una solución que nos permitió continuar.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Ordena lo ocurrido",
       "any": [
        "primero",
        "después",
        "al final"
       ]
      },
      {
       "label": "Añade reacción o reflexión",
       "any": [
        "me preocupó",
        "me sorprendió",
        "la próxima vez"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Une: me preocupó el cambio; encontramos una solución. Usa sin embargo.",
     "en": "Link reaction and outcome.",
     "model": "Me preocupó el cambio; sin embargo, encontramos una solución.",
     "mode": "controlled",
     "requirements": [],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Cuenta una semana con un problema, una reacción y una reflexión.",
     "en": "Narrate a week with a problem, reaction and reflection.",
     "model": "Preparaba una presentación cuando cambió la fecha. Me preocupó tener menos tiempo. Una compañera me ayudó a organizarla. La próxima vez empezaré antes.",
     "mode": "guided",
     "requirements": [
      {
       "label": "Ordena lo ocurrido",
       "any": [
        "primero",
        "después",
        "al final"
       ]
      },
      {
       "label": "Añade reacción o reflexión",
       "any": [
        "me preocupó",
        "me sorprendió",
        "la próxima vez"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    },
    {
     "es": "Escribe a una amiga: explica un problema de la semana, cómo lo resolviste y qué harás después.",
     "en": "Write a connected message linking past problem, solution and next step.",
     "model": "Esta semana cambió el horario del viaje y me preocupó llegar tarde. Primero llamé a Luis y después buscamos otro tren. Al final llegamos juntos. La próxima vez comprobaré las conexiones antes de comprar.",
     "mode": "free",
     "requirements": [
      {
       "label": "Ordena lo ocurrido",
       "any": [
        "primero",
        "después",
        "al final"
       ]
      },
      {
       "label": "Añade reacción o reflexión",
       "any": [
        "me preocupó",
        "me sorprendió",
        "la próxima vez"
       ]
      }
     ],
     "why": "Compare meaning, organisation and the taught language. This is one possible response, not the only valid formulation.",
     "variants": []
    }
   ]
  }
 ]
};
root.B11Data=data;if(typeof module!=='undefined')module.exports=data;
})(typeof window==='undefined'?globalThis:window);
