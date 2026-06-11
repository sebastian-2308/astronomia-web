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
    { nombre: 'Ceres', desc: 'Planeta enano en el cinturón de asteroides.', img: 'https://images-assets.nasa.gov/image/PIA19620/PIA19620~orig.jpg' },
    { nombre: 'Cometa Halley', desc: 'El cometa más famoso, visible cada 76 años.', img: 'https://images-assets.nasa.gov/image/PIA02143/PIA02143~orig.jpg' },
    { nombre: 'Nebulosa de Orión', desc: 'Vivero estelar a 1,344 años luz.', img: 'https://images-assets.nasa.gov/image/PIA17004/PIA17004~orig.jpg' },
    { nombre: 'Galaxia Andrómeda', desc: 'Nuestra galaxia vecina, a 2.5 millones de años luz.', img: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg' },
    { nombre: 'Agujero Negro M87', desc: 'Primer agujero negro fotografiado (2019).', img: 'https://images-assets.nasa.gov/image/PIA23151/PIA23151~orig.jpg' },
    { nombre: 'Galaxia Remolino', desc: 'Galaxia espiral clásica a 23 millones de años luz.', img: 'https://images-assets.nasa.gov/image/PIA04585/PIA04585~orig.jpg' }
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
      titulo: 'Astronomía General',
      siglas: 'DP',
      desc: 'Descubriendo el Universo: desde los fundamentos de la observación astronómica hasta los misterios de la cosmología moderna.',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Hubble_ultra_deep_field_high_rez_edit1.jpg/800px-Hubble_ultra_deep_field_high_rez_edit1.jpg',
      color: '#2563eb',
      modulos: [
        {
          titulo: 'Introducción a la Astronomía',
          lecciones: [
            { titulo: '¿Qué es la Astronomía?', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'La astronomía es la ciencia que estudia los cuerpos celestes del universo: planetas, estrellas, galaxias y más. Es una de las ciencias más antiguas, con raíces en las civilizaciones babilónica, griega, china y maya. Hoy combina observación telescópica, física teórica y exploración espacial para comprender el cosmos.' },
            { titulo: 'Historia de la Astronomía', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Desde las primeras observaciones a simple vista hasta el telescopio espacial James Webb, la astronomía ha evolucionado enormemente. Copérnico, Galileo, Kepler y Newton sentaron las bases. En el siglo XX, Hubble descubrió la expansión del universo, y hoy exploramos exoplanetas y agujeros negros.' },
            { titulo: 'Instrumentos de Observación', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Los telescopios son la herramienta principal del astrónomo. Hay telescopios refractores (lentes), reflectores (espejos) y radiotelescopios. El Hubble orbita la Tierra desde 1990, y el James Webb, lanzado en 2021, observa el universo infrarrojo desde el punto L2.' }
          ]
        },
        {
          titulo: 'El Sistema Solar',
          lecciones: [
            { titulo: 'El Sol: Nuestra Estrella', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'El Sol contiene el 99.86% de toda la masa del sistema solar. Es una estrella de tipo G2V, de color amarillo-blanca. Su energía proviene de la fusión nuclear de hidrógeno en helio en su núcleo, donde la temperatura alcanza los 15 millones de grados Celsius.' },
            { titulo: 'Los Planetas Terrestres', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Mercurio, Venus, Tierra y Marte son los planetas rocosos. La Tierra es el único con vida conocida. Venus es el más caliente (462°C) por su efecto invernadero. Marte tiene el volcán más grande: el Monte Olimpo, 2.5 veces más alto que el Everest.' },
            { titulo: 'Los Gigantes Gaseosos', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Júpiter, Saturno, Urano y Neptuno son planetas gigantes. Júpiter es el más grande y tiene la Gran Mancha Roja, una tormenta mayor que la Tierra. Saturno es famoso por sus anillos. Urano rota de lado. Neptuno tiene vientos supersónicos de 2,100 km/h.' }
          ]
        },
        {
          titulo: 'Estrellas y Galaxias',
          lecciones: [
            { titulo: 'Nacimiento y Muerte de las Estrellas', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Las estrellas nacen en nebulosas, colapsando nubes de gas y polvo. Su vida depende de su masa: las pequeñas como el Sol viven ~10 mil millones de años; las masivas viven millones y mueren en supernovas, dejando estrellas de neutrones o agujeros negros.' },
            { titulo: 'Tipos de Galaxias', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Hay galaxias espirales (como la Vía Láctea), elípticas (como M87) e irregulares (como las Nubes de Magallanes). Nuestra galaxia tiene entre 100 y 400 mil millones de estrellas. La galaxia más cercana es Andrómeda, a 2.5 millones de años luz.' },
            { titulo: 'El Universo en Expansión', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Edwin Hubble descubrió en 1929 que el universo se expande: las galaxias se alejan unas de otras. Esto llevó a la teoría del Big Bang. Hoy sabemos que la expansión se acelera por la energía oscura, que constituye el 68% del universo.' }
          ]
        },
        {
          titulo: 'Cosmología Moderna',
          lecciones: [
            { titulo: 'Big Bang y Origen del Universo', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'El Big Bang ocurrió hace 13,800 millones de años. El universo comenzó como un punto infinitamente denso y caliente, y desde entonces se expande y enfría. La radiación de fondo de microondas (CMB) es el eco de ese evento inicial.' },
            { titulo: 'Materia Oscura y Energía Oscura', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'La materia oscura constituye el 27% del universo. No emite luz pero su presencia se detecta por efectos gravitacionales. La energía oscura (68%) causa la expansión acelerada. Juntas forman el 95% del cosmos, pero aún son un misterio.' },
            { titulo: 'Exoplanetas y Vida Extraterrestre', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Se han descubierto más de 5,000 exoplanetas. El método de tránsito (Kepler) y velocidad radial son los más usados. La zona habitable es donde podría existir agua líquida. Próxima Centauri b y TRAPPIST-1e son candidatos prometedores.' }
          ]
        }
      ]
    },
    {
      id: 'sistema-solar-db',
      titulo: 'Sistema Solar',
      siglas: 'DB',
      desc: 'Exploración detallada de los cuerpos celestes que componen nuestro sistema solar: planetas, lunas, asteroides, cometas y más.',
      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Planets2013.svg/800px-Planets2013.svg.png',
      color: '#8b5cf6',
      modulos: [
        {
          titulo: 'El Sol y su Influencia',
          lecciones: [
            { titulo: 'Estructura del Sol', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'El Sol tiene capas internas (núcleo, zona radiativa, zona convectiva) y atmosféricas (fotosfera, cromosfera, corona). Las manchas solares son regiones más frías en la fotosfera. Las erupciones solares y eyecciones de masa coronal afectan el clima espacial.' },
            { titulo: 'Viento Solar y Magnetósferas', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'El viento solar es un flujo de partículas cargadas que viaja a 400-800 km/s. Protege a los planetas del viento solar mediante sus campos magnéticos. La Tierra tiene una magnetósfera que nos protege y genera auroras boreales.' },
            { titulo: 'Eclipses y Fenómenos Solares', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Los eclipses solares ocurren cuando la Luna se interpone entre el Sol y la Tierra. Los eclipses lunares ocurren cuando la Tierra se interpone. En 2026 hay un eclipse total de Luna (14 marzo) y uno parcial de Sol (29 marzo).' }
          ]
        },
        {
          titulo: 'Planetas y sus Lunas',
          lecciones: [
            { titulo: 'Mercurio y Venus', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Mercurio es el planeta más pequeño (4,879 km) y más cercano al Sol. Su día dura 59 días terrestres. Venus es similar en tamaño a la Tierra pero tiene atmósfera de CO2, presión 90 veces mayor y temperatura de 462°C. Gira al revés (retrógrado).' },
            { titulo: 'Tierra y Marte', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'La Tierra es el único planeta con agua líquida y vida. Marte tiene el Monte Olimpo (21.9 km) y Valles Marineris (4,000 km). Tiene dos lunas: Fobos y Deimos. El rover Perseverance busca signos de vida desde 2021.' },
            { titulo: 'Júpiter y Saturno', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Júpiter tiene 95 lunas, incluyendo Ío (volcanes), Europa (océano subterráneo), Ganímedes (mayor luna) y Calisto. Saturno tiene 146 lunas conocidas y anillos de hielo y roca. Titán tiene atmósfera densa y lagos de metano.' },
            { titulo: 'Urano y Neptuno', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Urano rota de lado (98° inclinación), con 27 lunas. Neptuno tiene vientos de 2,100 km/h y 16 lunas. Tritón, la luna más grande de Neptuno, orbita en dirección opuesta, sugiriendo que fue capturada del cinturón de Kuiper.' }
          ]
        },
        {
          titulo: 'Cuerpos Menores',
          lecciones: [
            { titulo: 'Cinturón de Asteroides', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Entre Marte y Júpiter hay millones de asteroides. Ceres es el más grande (940 km) y es un planeta enano. La NASA visitó Bennu con OSIRIS-REx y Japón visitó Ryugu con Hayabusa2, trayendo muestras a la Tierra.' },
            { titulo: 'Cometas y Meteoroides', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Los cometas son cuerpos de hielo y polvo del sistema solar exterior. El cometa Halley visita cada 76 años. Los meteoroides son fragmentos rocosos. Al entrar en la atmósfera terrestre, se vuelven meteoros (estrellas fugaces). Si llegan al suelo, son meteoritos.' },
            { titulo: 'El Cinturón de Kuiper y la Nube de Oort', video: 'https://www.youtube.com/embed/0r4F5LBfXxo', texto: 'Más allá de Neptuno está el cinturón de Kuiper, con Plutón, Haumea, Makemake y Eris como planetas enanos. La Nube de Oort, a 1 año luz del Sol, contiene billones de cometas. Es el límite gravitacional del sistema solar.' }
          ]
        }
      ]
    }
  ]
};
