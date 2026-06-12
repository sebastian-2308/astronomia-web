const DATA = {
  planetas: [
    { name:'Mercurio', color:'#b08d6e', diam:4879, mass:0.055, gravity:3.7, day:58.6, year:88, moons:0, temp:'-180 a 430', dist:57.9, icon:'☿', desc:'El más pequeño y cercano al Sol. Un día dura 59 días terrestres.' },
    { name:'Venus', color:'#e6b800', diam:12104, mass:0.815, gravity:8.87, day:243, year:225, moons:0, temp:462, dist:108.2, icon:'♀', desc:'El más caliente (462°C). Gira al revés, al amanecer sale por el oeste.' },
    { name:'Tierra', color:'#4cafaa', diam:12756, mass:1, gravity:9.81, day:1, year:365, moons:1, temp:15, dist:149.6, icon:'🌍', desc:'Nuestro hogar. El único planeta con vida conocido. 71% agua.' },
    { name:'Marte', color:'#c4554c', diam:6792, mass:0.107, gravity:3.72, day:1.03, year:687, moons:2, temp:'-87 a -5', dist:227.9, icon:'♂', desc:'El planeta rojo. Tiene el Monte Olimpo, el volcán más grande del sistema solar.' },
    { name:'Júpiter', color:'#c0a080', diam:142984, mass:317.8, gravity:24.79, day:0.41, year:4333, moons:95, temp:-110, dist:778.5, icon:'♃', desc:'El planeta más grande. La Gran Mancha Roja es una tormenta mayor que la Tierra.' },
    { name:'Saturno', color:'#e8cfb0', diam:120536, mass:95.2, gravity:10.44, day:0.45, year:10759, moons:146, temp:-140, dist:1432, icon:'♄', desc:'Famoso por sus espectaculares anillos de hielo y roca. Flotaría en el agua.' },
    { name:'Urano', color:'#6fd4d4', diam:51118, mass:14.5, gravity:8.69, day:0.72, year:30687, moons:27, temp:-195, dist:2867, icon:'⛢', desc:'Gigante de hielo que rota de lado (98° inclinación). Huele a huevos podridos.' },
    { name:'Neptuno', color:'#4169e1', diam:49528, mass:17.1, gravity:11.15, day:0.67, year:60190, moons:16, temp:-200, dist:4515, icon:'♆', desc:'El más ventoso (2,100 km/h). Fue el primer planeta descubierto con matemáticas.' }
  ],

  galeria: [
    { nombre: 'Sol', desc: 'Estrella tipo G, centro de nuestro sistema.', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg' },
    { nombre: 'Mercurio', desc: 'El planeta más cercano al Sol.', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg' },
    { nombre: 'Venus', desc: 'Similar en tamaño a la Tierra.', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg' },
    { nombre: 'Tierra', desc: 'Nuestro hogar, el único planeta con vida.', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Earth_Eastern_Hemisphere.jpg' },
    { nombre: 'Marte', desc: 'El "planeta rojo", con el volcán más grande.', img: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg' },
    { nombre: 'Júpiter', desc: 'El gigante gaseoso con la Gran Mancha Roja.', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg' },
    { nombre: 'Saturno', desc: 'Famoso por sus impresionantes anillos.', img: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg' },
    { nombre: 'Urano', desc: 'Gigante de hielo que rota de lado.', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg' },
    { nombre: 'Neptuno', desc: 'El planeta más ventoso.', img: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg' },
    { nombre: 'Luna', desc: 'Nuestro satélite natural.', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg' },
    { nombre: 'Plutón', desc: 'Planeta enano del cinturón de Kuiper, 5 lunas.', img: 'https://images-assets.nasa.gov/image/PIA19952/PIA19952~orig.jpg' },
    { nombre: 'Ceres', desc: 'Planeta enano en el cinturón de asteroides.', img: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29.jpg' },
    { nombre: 'Cometa Halley', desc: 'El cometa más famoso, visible cada 76 años.', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Lspn_comet_halley.jpg/1280px-Lspn_comet_halley.jpg' },
    { nombre: 'Nebulosa de Orión', desc: 'Vivero estelar a 1,344 años luz.', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/960px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg' },
    { nombre: 'Galaxia Andrómeda', desc: 'Nuestra galaxia vecina, a 2.5 millones de años luz.', img: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg' },
    { nombre: 'Agujero Negro M87', desc: 'Primer agujero negro fotografiado (2019).', img: 'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2025/webb-STScI-01JKREFYNJE7MT5SG2H0FBYG75-2K.png?w=1920&h=1080&fit=clip&crop=faces%2Cfocalpoint' },
    { nombre: 'Galaxia Remolino', desc: 'Galaxia espiral clásica a 23 millones de años luz.', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Messier51.jpg/1280px-Messier51.jpg' }
  ],

  facts: [
    "El Sol contiene el 99.86% de toda la masa del sistema solar.",
    "Un día en Venus dura más que un año en Venus (243 días vs 225 días).",
    "La Luna se aleja de la Tierra unos 3.8 cm cada año.",
    "Júpiter tiene 95 lunas conocidas. ¡Es como un mini sistema solar!",
    "Una cucharadita de una estrella de neutrones pesaría 10 millones de toneladas.",
    "La Vía Láctea y Andrómeda colisionarán en unos 4.5 mil millones de años.",
    "El Monte Olimpo en Marte es 2.5 veces más alto que el Everest.",
    "Los anillos de Saturno están hechos de hielo y roca, algunos del tamaño de una casa.",
    "Hay más estrellas en el universo que granos de arena en todas las playas de la Tierra.",
    "La luz del Sol tarda 8 minutos y 20 segundos en llegar a la Tierra.",
    "El agujero negro más cercano está a solo 1,600 años luz de distancia.",
    "Los astronautas crecen hasta 5 cm en el espacio por la falta de gravedad.",
    "Un año luz son aproximadamente 9.46 billones de kilómetros.",
    "La temperatura en la superficie de Venus es de 462°C, suficiente para derretir plomo.",
    "Neptuno tiene los vientos más rápidos del sistema solar, hasta 2,100 km/h.",
    "Plutón tiene 5 lunas: Caronte, Estigia, Nix, Cerbero e Hidra.",
    "El telescopio espacial Hubble orbita la Tierra a 547 km de altura.",
    "Las huellas en la Luna durarán millones de años porque no hay erosión.",
    "Urano rota de lado, con una inclinación de 98°.",
    "El cometa Halley fue observado por primera vez en 240 a.C. por astrónomos chinos."
  ],

  efemerides: [
    "🌠 4 de octubre de 1957: Lanzamiento del Sputnik 1, primer satélite artificial.",
    "🔭 Johannes Kepler (1571-1630): Formuló las tres leyes del movimiento planetario.",
    "🌕 20 de julio de 1969: Neil Armstrong y Buzz Aldrin caminan sobre la Luna.",
    "⭐ Galileo Galilei (1564-1642): Mejoró el telescopio y descubrió las lunas de Júpiter.",
    "🚀 12 de abril de 1961: Yuri Gagarin se convierte en el primer ser humano en el espacio.",
    "🪐 William Herschel (1738-1822): Descubrió Urano y la radiación infrarroja.",
    "☄️ 30 de junio de 1908: Evento de Tunguska, explosión de un meteorito en Siberia.",
    "👩‍🚀 Valentina Tereshkova: Primera mujer en el espacio (16 de junio de 1963).",
    "🌌 Edwin Hubble (1889-1953): Demostró la expansión del universo.",
    "🛰️ 24 de diciembre de 1968: La misión Apolo 8 orbita la Luna por primera vez."
  ],

  spaceHistory: [
    [1,1,"1959: La sonda Luna 1 se convierte en la primera nave en escapar de la gravedad terrestre."],
    [3,1,"2019: La sonda Chang'e 4 aterriza en la cara oculta de la Luna, primera vez en la historia."],
    [4,1,"2004: El rover Spirit (MER-A) aterriza en Marte."],
    [14,1,"2005: La sonda Huygens aterriza en Titán, la luna más grande de Saturno."],
    [17,1,"1969: La Unión Soviética realiza la primera transferencia exitosa entre naves espaciales tripuladas."],
    [25,1,"2004: El rover Opportunity (MER-B) aterriza en Marte."],
    [28,1,"1986: El transbordador espacial Challenger se desintegra poco después del lanzamiento."],
    [1,2,"2003: El transbordador Columbia se desintegra al reingresar a la atmósfera terrestre."],
    [6,2,"1974: La sonda Mariner 10 despega hacia Mercurio."],
    [7,2,"1984: El astronauta Bruce McCandless realiza la primera caminata espacial sin ataduras."],
    [12,2,"1961: La sonda Venera 1 es lanzada hacia Venus."],
    [18,2,"1930: Clyde Tombaugh descubre Plutón."],
    [20,2,"1962: John Glenn se convierte en el primer estadounidense en orbitar la Tierra."],
    [23,2,"1987: Se observa la supernova SN 1987A, la más cercana en siglos."],
    [27,2,"2023: El telescopio James Webb descubre seis galaxias masivas del universo temprano."],
    [1,3,"1966: La sonda Venera 3 se convierte en la primera nave en impactar Venus."],
    [5,3,"1979: La sonda Voyager 1 descubre volcanes activos en Ío, luna de Júpiter."],
    [9,3,"2006: La sonda Cassini descubre géiseres de agua en Encélado, luna de Saturno."],
    [10,3,"1977: Se descubren los anillos de Urano."],
    [13,3,"1781: William Herschel descubre Urano."],
    [18,3,"1965: Alexei Leonov realiza la primera caminata espacial de la historia."],
    [24,3,"1993: Se descubre el cometa Shoemaker-Levy 9, que impactaría Júpiter."],
    [1,4,"1960: Se lanza el primer satélite meteorológico, TIROS-1."],
    [9,4,"1968: La misión Apolo 6 prueba el cohete Saturno V."],
    [11,4,"1970: La misión Apolo 13 sufre una explosión a bordo."],
    [12,4,"1961: Yuri Gagarin se convierte en el primer humano en el espacio."],
    [13,4,"2029: El asteroide Apofis pasará a solo 31,000 km de la Tierra."],
    [17,4,"2013: Se descubre que la galaxia M60-UCD1 tiene un agujero negro masivo."],
    [19,4,"1971: Se lanza la primera estación espacial, Salyut 1."],
    [24,4,"1990: Lanzamiento del Telescopio Espacial Hubble."],
    [25,4,"2003: El Telescopio Espacial Spitzer es lanzado."],
    [28,4,"2001: Dennis Tito se convierte en el primer turista espacial."],
    [5,5,"1961: Alan Shepard se convierte en el primer estadounidense en el espacio."],
    [14,5,"1973: Lanzamiento de la estación espacial Skylab."],
    [22,5,"2012: SpaceX lanza la primera nave comercial a la Estación Espacial Internacional."],
    [25,5,"1961: El presidente Kennedy anuncia el objetivo de llevar un humano a la Luna."],
    [30,5,"2020: SpaceX lanza la primera misión tripulada comercial (Demo-2)."],
    [2,6,"1966: La sonda Surveyor 1 aterriza suavemente en la Luna."],
    [3,6,"1965: Ed White realiza la primera caminata espacial estadounidense."],
    [5,6,"2024: La nave Starliner de Boeing realiza su primer vuelo tripulado."],
    [16,6,"1963: Valentina Tereshkova se convierte en la primera mujer en el espacio."],
    [25,6,"1997: La nave Progress colisiona con la estación Mir."],
    [29,6,"1995: El transbordador Atlantis se acopla a la estación Mir."],
    [30,6,"1908: Evento de Tunguska, enorme explosión de un meteorito en Siberia."],
    [4,7,"1997: La sonda Pathfinder aterriza en Marte con el rover Sojourner."],
    [8,7,"2011: Lanzamiento del último transbordador espacial (Atlantis, STS-135)."],
    [14,7,"1965: La sonda Mariner 4 envía las primeras fotos de Marte."],
    [14,7,"2015: La sonda New Horizons sobrevuela Plutón por primera vez."],
    [16,7,"1969: Lanzamiento del Apolo 11 hacia la Luna."],
    [20,7,"1969: Neil Armstrong y Buzz Aldrin caminan sobre la Luna."],
    [20,7,"1976: La sonda Viking 1 aterriza en Marte."],
    [23,7,"1999: Lanzamiento del Observatorio de Rayos X Chandra."],
    [29,7,"1958: Se crea la NASA (National Aeronautics and Space Administration)."],
    [5,8,"2011: La sonda Juno despega hacia Júpiter."],
    [6,8,"2012: El rover Curiosity aterriza en Marte."],
    [12,8,"1960: Lanzamiento del Echo 1, primer satélite de comunicaciones."],
    [20,8,"1975: Lanzamiento de la sonda Viking 1 hacia Marte."],
    [20,8,"1977: Lanzamiento de la sonda Voyager 2."],
    [25,8,"2003: Lanzamiento del Telescopio Espacial Spitzer."],
    [5,9,"1977: Lanzamiento de la sonda Voyager 1."],
    [21,9,"2003: La sonda Galileo se desintegra en la atmósfera de Júpiter."],
    [27,9,"2007: Lanzamiento de la sonda Dawn hacia el cinturón de asteroides."],
    [4,10,"1957: Lanzamiento del Sputnik 1, primer satélite artificial."],
    [10,10,"1967: Entra en vigor el Tratado del Espacio Exterior."],
    [15,10,"1997: Lanzamiento de la sonda Cassini hacia Saturno."],
    [24,10,"1946: La sonda V-2 toma la primera foto de la Tierra desde el espacio."],
    [1,11,"1962: Lanzamiento de la sonda Mars 1 soviética."],
    [3,11,"1957: La perra Laika se convierte en el primer animal en órbita."],
    [13,11,"1971: La sonda Mariner 9 llega a Marte, primer orbitador."],
    [16,11,"1974: El mensaje de Arecibo es enviado al espacio."],
    [26,11,"2011: El rover Curiosity despega hacia Marte."],
    [28,11,"1964: Lanzamiento de la sonda Mariner 4 hacia Marte."],
    [2,12,"1993: La misión STS-61 repara el Hubble por primera vez."],
    [7,12,"1995: La sonda Galileo llega a Júpiter."],
    [11,12,"1972: El Apolo 17 aterriza en la Luna, última misión tripulada lunar."],
    [15,12,"1970: La sonda Venera 7 aterriza en Venus, primera nave en otro planeta."],
    [21,12,"1968: La misión Apolo 8 orbita la Luna por primera vez."],
    [24,12,"1968: Los astronautas del Apolo 8 leen el Génesis desde la órbita lunar."],
    [25,12,"2021: Lanzamiento del Telescopio Espacial James Webb."]
  ],

  randomSpaceObjects: [
    { name: "Nebulosa Cabeza de Caballo", type: "Nebulosa oscura", dist: "1,500 años luz", fact: "Es una de las nebulosas más fotografiadas del cielo. Se encuentra en la constelación de Orión." },
    { name: "Galaxia del Sombrero (M104)", type: "Galaxia espiral", dist: "28 millones de años luz", fact: "Tiene un núcleo brillante y un prominente disco de polvo que le da su forma de sombrero." },
    { name: "Púlsar del Cangrejo", type: "Estrella de neutrones", dist: "6,500 años luz", fact: "Gira 30 veces por segundo. Es el remanente de la supernova SN 1054 observada por astrónomos chinos." },
    { name: "Gran Mancha Roja", type: "Tormenta anticiclónica", dist: "En Júpiter", fact: "Es una tormenta más grande que la Tierra que ha durado cientos de años." },
    { name: "Encelado", type: "Luna helada", dist: "1,400 millones km", fact: "Tiene géiseres de agua que brotan del polo sur, lo que sugiere un océano subterráneo." },
    { name: "Betelgeuse", type: "Supergigante roja", dist: "640 años luz", fact: "Si estuviera en el centro del sistema solar, su superficie llegaría más allá de Júpiter." },
    { name: "TRAPPIST-1e", type: "Exoplaneta", dist: "40 años luz", fact: "Podría tener agua líquida en su superficie. Es uno de los 7 planetas del sistema TRAPPIST-1." },
    { name: "Gran Atractor", type: "Anomalía gravitacional", dist: "250 millones de años luz", fact: "Está atrayendo a la Vía Láctea y a cientos de miles de galaxias hacia él." },
    { name: "Nube de Oort", type: "Nube de cometas", dist: "1 año luz del Sol", fact: "Es una esfera de billones de cometas que rodea el sistema solar. Nunca ha sido observada directamente." },
    { name: "Campo Ultra Profundo del Hubble", type: "Imagen astronómica", dist: "Hace 13 mil millones de años", fact: "Muestra 10,000 galaxias en una región del cielo del tamaño de un grano de arena." },
    { name: "Titán", type: "Luna", dist: "1,400 millones km", fact: "Es la única luna con atmósfera densa y lagos líquidos de metano en su superficie." },
    { name: "Europa", type: "Luna helada", dist: "778 millones km", fact: "Bajo su corteza de hielo hay un océano global de agua líquida con más agua que la Tierra." },
    { name: "Nebulosa del Águila (M16)", type: "Vivero estelar", dist: "7,000 años luz", fact: "Contiene los famosos 'Pilares de la Creación', donde nacen nuevas estrellas." },
    { name: "Próxima Centauri b", type: "Exoplaneta", dist: "4.2 años luz", fact: "Es el exoplaneta más cercano a la Tierra. Orbita en la zona habitable de Próxima Centauri." },
    { name: "Cuásar TON 618", type: "Cuásar", dist: "10,400 millones de años luz", fact: "Contiene el agujero negro más masivo conocido: 66,000 millones de masas solares." },
    { name: "Ceres", type: "Planeta enano", dist: "414 millones km", fact: "Es el objeto más grande del cinturón de asteroides. Tiene criovolcanes que expulsan agua helada." },
    { name: "M87*", type: "Agujero negro supermasivo", dist: "55 millones de años luz", fact: "Fue el primer agujero negro fotografiado en 2019 por el Event Horizon Telescope." }
  ],

  eventos2026: [
    { fecha: '3-4 enero', evento: '🌠 Lluvia de estrellas Cuadrántidas (máximo)', detalle: 'Hasta 100 meteoros/hora.' },
    { fecha: '14 marzo', evento: '🌑 Eclipse total de Luna', detalle: 'Visible en América del Norte y del Sur.' },
    { fecha: '29 marzo', evento: '🌞 Eclipse parcial de Sol', detalle: 'Visible en Europa, norte de África y Asia.' },
    { fecha: '21-22 abril', evento: '🌠 Lluvia de estrellas Líridas', detalle: 'Hasta 18 meteoros/hora.' },
    { fecha: '5 mayo', evento: '🌠 Lluvia de estrellas Eta-Acuáridas', detalle: 'Hasta 50 meteoros/hora.' },
    { fecha: '31 mayo', evento: '🪐 Júpiter en oposición', detalle: 'Mejor momento para observar Júpiter.' },
    { fecha: '21 junio', evento: '☀️ Solsticio de verano (hemisferio norte)', detalle: 'Día más largo del año.' },
    { fecha: '28 julio', evento: '🌠 Lluvia de estrellas Delta-Acuáridas', detalle: 'Hasta 25 meteoros/hora.' },
    { fecha: '12 agosto', evento: '🌠 Lluvia de estrellas Perseidas', detalle: 'Hasta 100 meteoros/hora ¡la más popular!' },
    { fecha: '7 septiembre', evento: '🪐 Saturno en oposición', detalle: 'Mejor momento para observar Saturno y sus anillos.' },
    { fecha: '22 septiembre', evento: '🍂 Equinoccio de otoño', detalle: 'Día y noche igual duración.' },
    { fecha: '8 octubre', evento: '🌠 Lluvia de estrellas Dracónidas', detalle: 'Hasta 20 meteoros/hora.' },
    { fecha: '21-22 octubre', evento: '🌠 Lluvia de estrellas Oriónidas', detalle: 'Hasta 20 meteoros/hora.' },
    { fecha: '17 noviembre', evento: '🌠 Lluvia de estrellas Leónidas', detalle: 'Hasta 15 meteoros/hora.' },
    { fecha: '13-14 diciembre', evento: '🌠 Lluvia de estrellas Gemínidas', detalle: 'Hasta 120 meteoros/hora ¡la más intensa!' },
    { fecha: '21 diciembre', evento: '☀️ Solsticio de invierno', detalle: 'Noche más larga del año.' }
  ],

  misiones: [
    { icon: '🛰️', name: 'Artemis II', year: '2026', desc: 'Primera misión tripulada alrededor de la Luna desde Apolo 17.' },
    { icon: '🪐', name: 'Europa Clipper', year: '2030', desc: 'Misión de la NASA para estudiar la luna Europa de Júpiter.' },
    { icon: '🔭', name: 'Telescopio Nancy Grace Roman', year: '2027', desc: 'Estudiará energía oscura y exoplanetas.' },
    { icon: '☀️', name: 'Parker Solar Probe', year: 'En curso', desc: 'La nave más rápida de la historia, estudiando el Sol.' },
    { icon: '🌑', name: "Chang'e 7", year: '2026', desc: 'Misión china al polo sur lunar con rover y dron.' },
    { icon: '🛸', name: 'Mars Sample Return', year: '~2033', desc: 'Traer muestras de Marte a la Tierra por primera vez.' }
  ],

  constelaciones: {
    "Orión": {
      stars: [
        { x: 300, y: 30, label: "Betelgeuse" }, { x: 460, y: 40, label: "Bellatrix" },
        { x: 350, y: 130, label: "" }, { x: 380, y: 140, label: "" },
        { x: 330, y: 200, label: "" }, { x: 370, y: 210, label: "" },
        { x: 340, y: 280, label: "" }, { x: 370, y: 270, label: "" },
        { x: 310, y: 340, label: "Saiph" }, { x: 400, y: 330, label: "Rigel" },
        { x: 100, y: 100, label: "Sirio" }, { x: 530, y: 50, label: "Aldebarán" }
      ],
      lines: [[0,2],[1,3],[2,3],[2,4],[3,5],[4,6],[5,7],[6,8],[7,9],[4,5],[6,7]],
      info: "Orión es la constelación más reconocible del cielo. Contiene las estrellas Betelgeuse (roja) y Rigel (azul). Visible en invierno desde Venezuela."
    },
    "Osa Mayor": {
      stars: [
        { x: 200, y: 350, label: "Dubhe" }, { x: 280, y: 310, label: "Merak" },
        { x: 350, y: 280, label: "Phecda" }, { x: 420, y: 250, label: "Megrez" },
        { x: 490, y: 200, label: "Alioth" }, { x: 540, y: 160, label: "Mizar" },
        { x: 580, y: 110, label: "Alkaid" }
      ],
      lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],
      info: "La Osa Mayor es boreal visible todo el año. Sus 7 estrellas forman el famoso 'Cucharón'."
    },
    "Casiopea": {
      stars: [
        { x: 200, y: 80, label: "Caph" }, { x: 290, y: 160, label: "Schedar" },
        { x: 370, y: 200, label: "γ Cas" }, { x: 450, y: 170, label: "Ruchbah" },
        { x: 530, y: 100, label: "Segin" }
      ],
      lines: [[0,1],[1,2],[2,3],[3,4]],
      info: "Casiopea tiene forma de 'W'. Representa a la reina Casiopea de la mitología griega."
    },
    "Cruz del Sur": {
      stars: [
        { x: 300, y: 50, label: "Acrux" }, { x: 280, y: 150, label: "Becrux" },
        { x: 260, y: 230, label: "" }, { x: 380, y: 140, label: "Gacrux" },
        { x: 430, y: 60, label: "δ Cru" }, { x: 310, y: 370, label: "" }
      ],
      lines: [[0,1],[1,2],[3,4],[5,1]],
      info: "La Cruz del Sur es la más famosa del hemisferio sur. Aparece en banderas de Australia, Nueva Zelanda y Brasil."
    },
    "Escorpión": {
      stars: [
        { x: 500, y: 30, label: "δ Sco" }, { x: 460, y: 80, label: "π Sco" },
        { x: 430, y: 130, label: "Antares" }, { x: 370, y: 180, label: "σ Sco" },
        { x: 310, y: 210, label: "τ Sco" }, { x: 240, y: 240, label: "Shaula" },
        { x: 180, y: 290, label: "Lesath" }
      ],
      lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],
      info: "Escorpión representa al escorpión que mató a Orión. Antares es una supergigante roja 700 veces más grande que el Sol."
    }
  },

  cursosVirtuales: [
    {
      id: 'astronomia-dp',
      titulo: 'ASTRONOMÍA-DP',
      siglas: 'DP',
      desc: 'Curso introductorio de astronomía con el objetivo de divulgar y fomentar el interés en ella. Incluye telescopios e instrumentos de medición, medidas de posicionamiento terrestre y celeste, constelaciones, La Tierra y La Luna, el Sistema Solar, el Sol y las estrellas, nebulosas y galaxias, teorías del origen del Universo y leyes de Kepler.',
      img: 'https://campusvirtual.fundacite-caracas.com/pluginfile.php/463/course/overviewfiles/telescope-870x563.jpg',
      color: '#2563eb',
      profesor: 'Diego Peña (DIEGO PEÑA)',
      genially: 'https://view.genially.com/67c6e0b2b7a1a8c8e4f6d3a2',
      foros: {
        anuncios: { titulo: '📢 Cartelera de Anuncios', desc: 'Novedades, avisos importantes y cronogramas del curso.', posts: [] },
        soporte: { titulo: '💬 Foro de Apoyo', desc: 'Comunidad para dudas sobre el contenido, soporte técnico y discusión entre compañeros.', posts: [] }
      },
      modulos: [
        {
          titulo: 'Telescopios e Instrumentos de Medición',
          lecciones: [
            { titulo: '¿Refractor, Reflector o Catadióptrico? Guía definitiva para elegir tu telescopio.', video: 'https://www.youtube.com/embed/1RUm8zvpoBs', texto: 'Los telescopios son herramientas fundamentales para captar la radiación electromagnética de objetos lejanos. Se dividen en tres grandes familias según su diseño óptico: los refractores (usan lentes), los reflectores (usan espejos) y los catadióptricos (sistemas híbridos que combinan lentes y espejos). La elección del tipo adecuado depende de tu objetivo: los refractores ofrecen imágenes nítidas ideales para la Luna y planetas, mientras que los reflectores tienen mayor apertura, lo que los hace superiores para observar nebulosas y galaxias.' },
            { titulo: 'Anatomía de un Telescopio: Entendiendo cada pieza para observar mejor.', video: 'https://www.youtube.com/embed/m0LEhfJuqrU', texto: 'Un telescopio no es una sola pieza, sino un sistema integrado por varios componentes clave: el objetivo (espejo o lente principal que capta la luz), el ocular (que amplía la imagen captada), el buscador (un pequeño visor auxiliar para localizar objetos), la montura (que permite el movimiento) y el trípode (el soporte estable). Además, la montura es crucial para el seguimiento: las altacimutales permiten movimiento vertical y horizontal, mientras que las ecuatoriales se alinean con el eje terrestre para compensar la rotación del planeta y seguir las estrellas con precisión.' },
            { titulo: 'Más allá de los ojos: Instrumentos para medir el universo.', video: 'https://www.youtube.com/embed/bpmW7GfnJXQ', texto: 'La astronomía moderna requiere herramientas que van mucho más allá de los telescopios ópticos convencionales. Entre los instrumentos más potentes encontramos: los radiotelescopios para captar ondas de radio, los espectrógrafos para descomponer la luz y conocer la química de las estrellas, los fotómetros para medir con precisión el brillo, las CCDs (cámaras de alta sensibilidad) y los coronógrafos, diseñados específicamente para bloquear la luz estelar y poder observar objetos tenues que orbitan muy cerca de las estrellas.' }
          ]
        },
        {
          titulo: 'Medidas de Posicionamiento',
          lecciones: [
            { titulo: 'Coordenadas Terrestres', video: 'https://www.youtube.com/embed/soQ5MN0nuMg', texto: 'Para ubicarnos en la Tierra usamos latitud (distancia angular al ecuador) y longitud (distancia angular al meridiano de Greenwich). La latitud es fundamental en astronomía: desde el ecuador se ven ambas esferas celestes, desde los polos solo una. El observador en Caracas (10.5°N) tiene una perspectiva privilegiada del cielo.' },
            { titulo: 'Coordenadas Celestes', video: 'https://www.youtube.com/embed/5Wz0Cokuqxs', texto: 'Para ubicar estrellas usamos: ascensión recta (equivalente a longitud terrestre, medida en horas, minutos y segundos) y declinación (equivalente a latitud). También existe el sistema horizontal con azimut y altura. El movimiento aparente de las estrellas se debe a la rotación terrestre: 15° por hora hacia el oeste.' },
            { titulo: 'Movimiento Aparente del Cielo', video: 'https://www.youtube.com/embed/E4ExGMTDu-Q', texto: 'La esfera celeste parece girar de este a oeste debido a la rotación terrestre. Las estrellas circumpolares nunca se ocultan cerca de los polos. El Sol sigue la eclíptica, inclinada 23.5° respecto al ecuador celeste, causando las estaciones. La precesión de los equinoccios cambia lentamente la orientación del eje terrestre cada 26,000 años.' }
          ]
        },
        {
          titulo: 'Constelaciones',
          lecciones: [
            { titulo: 'Historia y Origen de las Constelaciones', video: 'https://www.youtube.com/embed/w2b9JShncUM', texto: 'Las constelaciones son agrupaciones aparentes de estrellas que forman figuras imaginarias. Fueron nombradas por civilizaciones antiguas: griegos, romanos, babilonios y árabes. La Unión Astronómica Internacional reconoce oficialmente 88 constelaciones que cubren toda la esfera celeste. Cada una tiene límites precisos.' },
            { titulo: 'Constelaciones del Hemisferio Norte', video: 'https://www.youtube.com/embed/lCN6YaEtUIw', texto: 'Las más conocidas son: Osa Mayor (con el Carro, apunta a la Estrella Polar), Osa Menor (contiene la Estrella Polar), Casiopea (forma de W), Orión (visible en invierno, con Betelgeuse y Rigel), Leo, Virgo y Escorpión. La Estrella Polar marca el norte y parece fija en el cielo.' },
            { titulo: 'Constelaciones del Hemisferio Sur', video: 'https://www.youtube.com/embed/0uhWm6lNJcY', texto: 'Desde Venezuela también vemos constelaciones australes como: Cruz del Sur (la más famosa, aparece en banderas de Australia y Brasil), Centauro (con Alfa Centauri, la estrella más cercana), Carina (con Canopus, la segunda más brillante) y Escorpión (visible en las noches de invierno).' }
          ]
        },
        {
          titulo: 'La Tierra y la Luna',
          lecciones: [
            { titulo: 'La Tierra: Nuestro Planeta', video: 'https://www.youtube.com/embed/soQ5MN0nuMg', texto: 'La Tierra es el tercer planeta del Sistema Solar, con un diámetro de 12,756 km. Tiene una atmósfera rica en nitrógeno y oxígeno que protege la vida. Su campo magnético nos protege del viento solar. El 71% de su superficie está cubierta por agua. Es el único planeta conocido con vida. Su rotación dura 24 horas y su traslación 365.25 días.' },
            { titulo: 'La Luna: Nuestro Satélite Natural', video: 'https://www.youtube.com/embed/xd1a0BHZ2uo', texto: 'La Luna tiene un diámetro de 3,474 km y está a 384,400 km de distancia. Su superficie tiene mares (planicies de lava solidificada), cráteres de impacto y montañas. No tiene atmósfera ni agua líquida. La cara oculta de la Luna fue fotografiada por primera vez en 1959 por la sonda soviética Luna 3.' },
            { titulo: 'Fases Lunares y Eclipses', video: 'https://www.youtube.com/embed/MjJxaCBjUQ4', texto: 'Las fases lunares son: Luna Nueva, Cuarto Creciente, Luna Llena y Cuarto Menguante. El ciclo completo dura 29.5 días. Los eclipses lunares ocurren cuando la Tierra se interpone entre el Sol y la Luna. Los eclipses solares ocurren cuando la Luna se interpone entre el Sol y la Tierra. En 2026 hay un eclipse total de Luna (14 marzo).' }
          ]
        },
        {
          titulo: 'El Sistema Solar',
          lecciones: [
            { titulo: 'Estructura del Sistema Solar', video: 'https://www.youtube.com/embed/vQIsQK4m7Qk', texto: 'El Sistema Solar está formado por el Sol y todos los cuerpos que orbitan a su alrededor: 8 planetas, 5 planetas enanos, cientos de lunas, millones de asteroides y billones de cometas. Se divide en sistema solar interior (planetas rocosos) y exterior (gigantes gaseosos). El límite gravitacional del Sol alcanza la Nube de Oort, a 1 año luz.' },
            { titulo: 'Planetas Interiores', video: 'https://www.youtube.com/embed/fln82xudLMc', texto: 'Mercurio (diámetro 4,879 km, sin atmósfera, temperaturas de -180°C a 430°C), Venus (12,104 km, atmósfera de CO2, 462°C, gira al revés), Tierra (12,756 km, 71% agua, única con vida), Marte (6,792 km, atmósfera delgada, tiene el Monte Olimpo y Valles Marineris). Entre Marte y Júpiter está el cinturón de asteroides.' },
            { titulo: 'Planetas Exteriores', video: 'https://www.youtube.com/embed/EpyZ61nEc0U', texto: 'Júpiter (142,984 km, el más grande, Gran Mancha Roja, 95 lunas), Saturno (120,536 km, famoso por anillos de hielo, 146 lunas), Urano (51,118 km, rota de lado, 27 lunas), Neptuno (49,528 km, vientos de 2,100 km/h, 16 lunas). Plutón fue reclasificado como planeta enano en 2006.' }
          ]
        },
        {
          titulo: 'El Sol, las Estrellas y su Clasificación',
          lecciones: [
            { titulo: 'El Sol: Nuestra Estrella', video: 'https://www.youtube.com/embed/dwsS8TNorhQ', texto: 'El Sol es una estrella de tipo espectral G2V, de color amarillo-blanca. Contiene el 99.86% de toda la masa del sistema solar. Su núcleo alcanza 15 millones de grados Celsius, donde ocurre la fusión nuclear de hidrógeno en helio. Su energía tarda 8 minutos en llegar a la Tierra. Tiene un diámetro de 1,391,000 km.' },
            { titulo: 'Clasificación Espectral Estelar', video: 'https://www.youtube.com/embed/WaqDk9dVE0k', texto: 'Las estrellas se clasifican por tipo espectral: O (azules, muy calientes >30,000K), B (azul-blancas), A (blancas), F (amarillo-blancas), G (amarillas como el Sol, 5,500K), K (naranjas) y M (rojas, más frías <3,500K). La regla mnemotécnica es: "Oh, Be A Fine Girl/Guy, Kiss Me". También se clasifican por luminosidad (I a V).' },
            { titulo: 'Ciclo de Vida Estelar', video: 'https://www.youtube.com/embed/MLOY8_X2CA0', texto: 'Las estrellas nacen en nebulosas. Su evolución depende de la masa inicial: estrellas como el Sol se convierten en gigantes rojas y terminan como enanas blancas. Estrellas masivas (>8 masas solares) explotan como supernovas, dejando estrellas de neutrones o agujeros negros. Las estrellas más masivas pueden formar agujeros negros.' }
          ]
        },
        {
          titulo: 'Nebulosas y Galaxias',
          lecciones: [
            { titulo: 'Nebulosas: Viveros Estelares', video: 'https://www.youtube.com/embed/8oyPWLVv3_4', texto: 'Las nebulosas son nubes de gas y polvo interestelar. Pueden ser: de emisión (brillan por radiación ultravioleta de estrellas cercanas, como la Nebulosa de Orión), de reflexión (reflejan luz estelar, azuladas), oscuras (bloquean la luz, como la Cabeza de Caballo) y planetarias (restos de estrellas como el Sol).' },
            { titulo: 'Tipos de Galaxias', video: 'https://www.youtube.com/embed/T3byaTdsSsA', texto: 'Las galaxias se clasifican en: espirales (como la Vía Láctea, con brazos curvos), elípticas (como M87, sin estructura definida), espirales barradas (como la Vía Láctea, con una barra central) e irregulares (como las Nubes de Magallanes). La Vía Láctea tiene entre 100 y 400 mil millones de estrellas.' },
            { titulo: 'La Vía Láctea y Andrómeda', video: 'https://www.youtube.com/embed/K_HnxVU_bVQ', texto: 'La Vía Láctea es una galaxia espiral barrada con un diámetro de 100,000 años luz. Nuestro Sistema Solar orbita su centro a 250 km/s, completando una vuelta cada 230 millones de años. Andrómeda (M31), nuestra galaxia vecina, está a 2.5 millones de años luz. Colisionará con la Vía Láctea en unos 4.5 mil millones de años.' }
          ]
        },
        {
          titulo: 'Teorías del Origen del Universo',
          lecciones: [
            { titulo: 'El Big Bang', video: 'https://www.youtube.com/embed/oBJqaHOmElI', texto: 'La teoría del Big Bang propone que el universo comenzó hace 13,800 millones de años a partir de un estado infinitamente denso y caliente. Georges Lemaître propuso la idea en 1927. Edwin Hubble confirmó la expansión en 1929. La radiación de fondo de microondas (CMB), descubierta en 1965, es la prueba más sólida de esta teoría.' },
            { titulo: 'Evolución del Universo Temprano', video: 'https://www.youtube.com/embed/nxm123zAEZM', texto: 'En los primeros 3 minutos se formaron protones y neutrones. A los 380,000 años, el universo se enfrió lo suficiente para formar átomos neutros (recombinación), liberando la radiación CMB. Luego vinieron las "edades oscuras" hasta que las primeras estrellas y galaxias se formaron unos 400 millones de años después del Big Bang.' },
            { titulo: 'El Futuro del Universo', video: 'https://www.youtube.com/embed/L2WuVIkUdQs', texto: 'Hay tres escenarios posibles: Big Crunch (el universo deja de expandirse y colapsa), Big Freeze (expansión eterna, todo se enfría) y Big Rip (expansión acelerada desgarra todo). Las observaciones actuales favorecen el Big Freeze, con la energía oscura acelerando la expansión.' }
          ]
        },
        {
          titulo: 'Introducción a la Astrofísica: Leyes de Kepler',
          lecciones: [
            { titulo: 'Primera Ley de Kepler', video: 'https://www.youtube.com/embed/uDG0sibnPQo', texto: 'La primera ley de Kepler (1609) establece que los planetas orbitan al Sol en órbitas elípticas, con el Sol en uno de los focos. Una elipse tiene dos focos; el Sol ocupa uno. La excentricidad mide qué tan alargada es la órbita: la Tierra tiene excentricidad 0.017 (casi circular), mientras que Mercurio tiene 0.205 (más elíptica).' },
            { titulo: 'Segunda Ley de Kepler', video: 'https://www.youtube.com/embed/Gi2H7IiI4p4', texto: 'La segunda ley (Ley de las Áreas) dice que el radio vector que une un planeta con el Sol barre áreas iguales en tiempos iguales. Esto significa que los planetas se mueven más rápido cuando están cerca del Sol (perihelio) y más lento cuando están lejos (afelio). La Tierra está en perihelio en enero (147 millones km) y afelio en julio (152 millones km).' },
            { titulo: 'Tercera Ley de Kepler', video: 'https://www.youtube.com/embed/UfQ7y7hVcAI', texto: 'La tercera ley relaciona el periodo orbital (T) con la distancia media al Sol (a): T² = a³ (cuando T está en años terrestres y a en UA). Por ejemplo, Marte está a 1.52 UA, entonces T² = 1.52³, T = 1.88 años (687 días). Esta ley permitió calcular distancias en el Sistema Solar por primera vez.' },
            { titulo: 'Aplicaciones de las Leyes de Kepler', video: 'https://www.youtube.com/embed/3ZBAZu8NKfI', texto: 'Las leyes de Kepler son fundamentales para: calcular órbitas de satélites artificiales, determinar masas de estrellas binarias, descubrir exoplanetas (método de velocidad radial), planificar misiones espaciales y entender la dinámica del Sistema Solar. Newton demostró que estas leyes derivan de la ley de gravitación universal.' }
          ]
        }
      ]
    },
    {
      id: 'astronomia-db',
      titulo: 'ASTRONOMÍA-DB',
      siglas: 'DB',
      desc: 'Exploración detallada de objetos de cielo profundo: estrellas binarias, cúmulos estelares, nebulosas, galaxias y técnicas avanzadas de observación astronómica.',
      img: 'https://campusvirtual.fundacite-caracas.com/pluginfile.php/438/course/overviewfiles/001-1.jpg',
      color: '#8b5cf6',
      profesor: 'Diego Blanco (DIEGO SAMUEL BLANCO ESPAÑA)',
      genially: 'https://view.genially.com/67c6e0b2b7a1a8c8e4f6d3a3',
      foros: {
        anuncios: { titulo: '📢 Cartelera de Anuncios', desc: 'Novedades, avisos importantes y cronogramas del curso.', posts: [] },
        soporte: { titulo: '💬 Foro de Apoyo', desc: 'Comunidad para dudas sobre el contenido, soporte técnico y discusión entre compañeros.', posts: [] }
      },
      modulos: [
        {
          titulo: 'Estrellas Binarias y Múltiples',
          lecciones: [
            { titulo: 'Sistemas Estelares Múltiples', video: 'https://www.youtube.com/embed/3ZBAZu8NKfI', texto: 'Más del 50% de las estrellas forman parte de sistemas múltiples. Las binarias pueden ser: visuales (separadas visiblemente), espectroscópicas (detectadas por desplazamiento Doppler), eclipsantes (una pasa frente a la otra) y astrométricas (detectadas por el bamboleo de la estrella principal). Sirio, la estrella más brillante del cielo, es un sistema binario.' },
            { titulo: 'Medición de Masas Estelares', video: 'https://www.youtube.com/embed/Gi2H7IiI4p4', texto: 'Las estrellas binarias son fundamentales para medir masas estelares. Aplicando la tercera ley de Kepler, podemos calcular la masa total del sistema a partir del período orbital y la separación. Conocemos las masas de las estrellas principalmente gracias al estudio de sistemas binarios. Esta es la única forma directa de medir masas estelares.' },
            { titulo: 'Binarias Eclipsantes y su Importancia', video: 'https://www.youtube.com/embed/UfQ7y7hVcAI', texto: 'Las binarias eclipsantes como Algol (la "Estrella Demonio" en Perseo) permiten medir radios estelares y temperaturas. La curva de luz muestra dos caídas de brillo cuando una estrella eclipsa a la otra. El estudio de estas sistemas ha sido crucial para entender la evolución estelar y calibrar modelos astrofísicos.' }
          ]
        },
        {
          titulo: 'Cúmulos Estelares',
          lecciones: [
            { titulo: 'Cúmulos Abiertos', video: 'https://www.youtube.com/embed/T3byaTdsSsA', texto: 'Los cúmulos abiertos son grupos de estrellas jóvenes (generalmente <1,000 millones de años) nacidas de la misma nube molecular. Contienen desde decenas hasta miles de estrellas. Ejemplos famosos: las Pléyades (M45, a 444 años luz) y los Cuellos (Hyades, a 153 años luz). Son ideales para estudiar evolución estelar.' },
            { titulo: 'Cúmulos Globulares', video: 'https://www.youtube.com/embed/K_HnxVU_bVQ', texto: 'Los cúmulos globulares son grupos esféricos de estrellas viejas (10-13 mil millones de años) que orbitan las galaxias. Contienen cientos de miles de estrellas en un diámetro de 100-200 años luz. Omega Centauri (NGC 5139) es el más brillante del cielo, visible a simple vista. La Vía Láctea tiene unos 150 cúmulos globulares.' },
            { titulo: 'Diagrama HR y Evolución Estelar', video: 'https://www.youtube.com/embed/MLOY8_X2CA0', texto: 'El diagrama Hertzsprung-Russell (HR) grafica temperatura vs. luminosidad estelar. Los cúmulos son laboratorios ideales para estudiar evolución estelar porque todas sus estrellas tienen la misma edad y composición inicial. Al observar un cúmulo podemos determinar su edad por el "punto de giro" de la secuencia principal.' }
          ]
        },
        {
          titulo: 'Fotometría y Técnicas de Observación',
          lecciones: [
            { titulo: 'Fotometría Astronómica', video: 'https://www.youtube.com/embed/dbaLwHf4H40', texto: 'La fotometría mide el brillo de los objetos celestes. El sistema UBV (Johnson) usa filtros ultravioleta, azul y visual. La magnitud aparente (m) mide el brillo visto desde la Tierra; la magnitud absoluta (M) es el brillo a 10 pársecs. La diferencia de 5 magnitudes equivale a un factor de 100 en brillo.' },
            { titulo: 'Espectroscopía Estelar', video: 'https://www.youtube.com/embed/WaqDk9dVE0k', texto: 'La espectroscopía descompone la luz estelar en sus longitudes de onda, revelando: composición química (líneas de absorción de hidrógeno, helio, calcio, etc.), temperatura, velocidad radial (efecto Doppler), campo magnético (efecto Zeeman) y rotación estelar. Cada elemento químico tiene un patrón único de líneas espectrales.' },
            { titulo: 'Técnicas de Astrofotografía', video: 'https://www.youtube.com/embed/9QsGDJCd4MU', texto: 'La astrofotografía moderna usa: CCDs (sensores de alta sensibilidad), apilado de múltiples exposiciones para reducir ruido, guiado autónomo (seguimiento preciso de estrellas), filtros de banda estrecha (H-alfa, OIII, SII) y procesamiento digital. El Telescopio Espacial Hubble utiliza una cámara CCD de 16 megapíxeles.' }
          ]
        }
      ]
    }
  ]
};
