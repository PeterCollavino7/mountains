// Add, remove, or edit locations here — the map picks up changes automatically.
// type: "peak" | "lake" | "rifugio"
const locations = [
  // --- Peaks ---
  {
    name: "Monte Peralba",
    lat: 46.630000,
    lng: 12.720000,
    elevation: 2694,
    range: "Carnic Alps",
    type: "peak",
    date: "2022-08-21",
    note: ""
  },
  {
    name: "Monte Amariana",
    lat: 46.401939,
    lng: 13.081389,
    elevation: 1906,
    range: "Carnic Alps",
    type: "peak",
    date: "2022-09-22",
    dates: ["2022-09-22", "2024-05-11", "2025-04-29"],
    note: ""
  },
  {
    name: "Monte Verzegnis",
    lat: 46.362222,
    lng: 12.907778,
    elevation: 1914,
    range: "Carnic Prealps",
    type: "peak",
    date: "2022-10-16",
    dates: ["2022-10-16", "2023-09-08"],
    note: ""
  },
  {
    name: "Monte Lovinzola",
    lat: 46.372903,
    lng: 12.921677,
    elevation: 1868,
    range: "Carnic Prealps",
    type: "peak",
    date: "2022-06-11",
    dates: ["2022-06-11", "2023-09-08", "2024-07-08", "2024-09-10"],
    note: ""
  },
  {
    name: "Monte Festa",
    lat: 46.3223,
    lng: 13.0912,
    elevation: 1065,
    range: "Carnic Prealps",
    type: "peak",
    date: "2022-03-06",
    dates: ["2022-03-06", "2024-09-24"],
    note: ""
  },
  {
    name: "Monte Gjaideit",
    lat: 46.4310,
    lng: 13.0581,
    elevation: 1082,
    range: "Carnic Alps",
    type: "peak",
    date: "2022-03-13",
    dates: ["2022-03-13", "2023-01-06", "2024-12-26", "2025-04-06"],
    note: "Position approximate (nearest verified point is the Illegio trailhead)."
  },
  {
    name: "Monte Brancot",
    lat: 46.2964,
    lng: 13.0826,
    elevation: 1018,
    range: "Carnic Prealps",
    type: "peak",
    date: "2022-04-15",
    note: ""
  },
  {
    name: "Monte Amarianute",
    lat: 46.3982,
    lng: 13.0605,
    elevation: 1084,
    range: "Carnic Alps",
    type: "peak",
    date: "2022-05-01",
    dates: ["2022-05-01", "2023-02-05"],
    note: "A distinct peak from Monte Amariana."
  },
  {
    name: "Monte Tersadia",
    lat: 46.5081,
    lng: 13.0819,
    elevation: 1960,
    range: "Carnic Alps",
    type: "peak",
    date: "2022-06-02",
    dates: ["2022-06-02", "2023-09-24", "2025-04-26"],
    note: ""
  },
  {
    name: "Findenigkofel",
    lat: 46.5959,
    lng: 13.1011,
    elevation: 2016,
    range: "Carnic Alps",
    type: "peak",
    date: "2022-07-10",
    note: "Also known as Monte Lodin"
  },
  {
    name: "Monte Rauchkofel",
    lat: 46.6196,
    lng: 12.8835,
    elevation: 2460,
    range: "Carnic Alps",
    type: "peak",
    date: "2022-07-22",
    dates: ["2022-07-22", "2026-08-13"],
    note: "Summit lies just across the Austrian border, reached from Rifugio Tolazzi."
  },
  {
    name: "Monte Chiadin",
    lat: 46.5972,
    lng: 12.7385,
    elevation: 2287,
    range: "Carnic Alps",
    type: "peak",
    date: "2022-07-31",
    note: "Cima Ovest"
  },
  {
    name: "Cima del Lago",
    lat: 46.3983,
    lng: 13.5650,
    elevation: 2126,
    range: "Julian Alps",
    type: "peak",
    date: "2022-08-04",
    note: "Also known as Jerebica, near Cave del Predil"
  },
  {
    name: "Monte Crostis",
    lat: 46.5718,
    lng: 12.8914,
    elevation: 2251,
    range: "Carnic Alps",
    type: "peak",
    date: "2022-08-11",
    note: ""
  },
  {
    name: "Monte Strabut",
    lat: 46.4119,
    lng: 13.0317,
    elevation: 1104,
    range: "Carnic Alps",
    type: "peak",
    date: "2022-08-15",
    note: ""
  },
  {
    name: "Monte Dobis",
    lat: 46.4182,
    lng: 12.9831,
    elevation: 1042,
    range: "Carnic Alps",
    type: "peak",
    date: "2022-09-11",
    dates: ["2022-09-11", "2023-12-26"],
    note: ""
  },
  {
    name: "Monte Dauda",
    lat: 46.4777,
    lng: 12.9705,
    elevation: 1765,
    range: "Carnic Alps",
    type: "peak",
    date: "2022-10-10",
    dates: ["2022-10-10", "2024-05-01"],
    note: ""
  },
  {
    name: "Monte Terzo",
    lat: 46.5735,
    lng: 12.9544,
    elevation: 2034,
    range: "Carnic Alps",
    type: "peak",
    date: "2022-10-30",
    dates: ["2022-10-30", "2024-05-26"],
    note: ""
  },
  {
    name: "Monte Cuarnan",
    lat: 46.2787,
    lng: 13.1867,
    elevation: 1372,
    range: "Julian Prealps",
    type: "peak",
    date: "2022-11-06",
    dates: ["2022-11-06", "2025-12-26"],
    note: ""
  },
  {
    name: "Monte Sorantri",
    lat: 46.4411,
    lng: 12.8631,
    elevation: 896,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-05-01",
    note: ""
  },
  {
    name: "Campanili dei Lander",
    lat: 46.4869,
    lng: 13.0075,
    elevation: 1240,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-05-28",
    note: "Approximate location (trailhead near Piano d'Arta) — about 600m of elevation gain"
  },
  {
    name: "Creta di Timau",
    lat: 46.5967,
    lng: 13.0107,
    elevation: 2217,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-06-02",
    dates: ["2023-06-02", "2024-07-18"],
    note: ""
  },
  {
    name: "Pani",
    lat: 46.417672,
    lng: 12.861928,
    elevation: 900,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-03-05",
    note: "Conca di Pani, ai piedi del Col Gentile — posizione approssimativa (punto di accesso da Fresis, tra Ampezzo, Socchieve e Raveo)"
  },

  // --- Lakes ---
  {
    name: "Lago di Bordaglia",
    lat: 46.6233,
    lng: 12.8144,
    elevation: 1750,
    range: "Carnic Alps",
    type: "lake",
    date: "2021-10-31",
    dates: ["2021-10-31", "2026-08-23"],
    note: ""
  },
  {
    name: "Laghi d'Olbe",
    lat: 46.5671,
    lng: 12.6900,
    elevation: 2156,
    range: "Carnic Alps",
    type: "lake",
    date: "2021-11-20",
    dates: ["2021-11-20", "2024-08-24"],
    note: "Near Sappada."
  },

  // --- Rifugi ---
  {
    name: "Rifugio De Gasperi",
    lat: 46.5201,
    lng: 12.6760,
    elevation: 1767,
    range: "Carnic Alps",
    type: "rifugio",
    date: "2021-10-10",
    dates: ["2021-10-10", "2026-08-11"],
    note: "Rifugio Fratelli De Gasperi, Val Pesarina."
  },

  // --- Added in bulk update, 2023-07 to 2026-08 (chronological) ---
  {
    name: "Picco di Mezzodì",
    lat: 46.5010,
    lng: 13.6810,
    elevation: 2063,
    range: "Julian Alps",
    type: "peak",
    date: "2023-08-01",
    note: "Above the Laghi di Fusine, in the Monte Mangart amphitheater; coordinates approximate."
  },
  {
    name: "Laghi di Fusine",
    lat: 46.5088,
    lng: 13.6725,
    elevation: 929,
    range: "Julian Alps",
    type: "lake",
    date: "2023-08-01",
    note: "Climbed Picco di Mezzodì the same day."
  },
  {
    name: "Monte Corona",
    lat: 46.3800,
    lng: 12.8700,
    elevation: 742,
    range: "Carnic Prealps",
    type: "peak",
    date: "2023-07-11",
    note: "Near Socchieve, via Priuso/Feltrone (CAI 239); coordinates approximate."
  },
  {
    name: "Monte Zermula",
    lat: 46.561468,
    lng: 13.151663,
    elevation: 2143,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-07-23",
    note: "Reached from Passo Cason di Lanza (CAI 442a); WWI trench site."
  },
  {
    name: "Monte Malvuerich Alto",
    lat: 46.560,
    lng: 13.290,
    elevation: 1899,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-08-12",
    note: "Eastern Carnic Alps, reached from the Passo Pramollo road near Pontebba (Alta Via CAI Pontebba); coordinates approximate."
  },
  {
    name: "Monte Navagiust",
    lat: 46.615,
    lng: 12.815,
    elevation: 2129,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-08-15",
    note: "Reached from Pierabech (Forni Avoltri) via the Anello di Bordaglia, near Lago di Bordaglia; coordinates approximate."
  },
  {
    name: "Monte Pal Piccolo",
    lat: 46.605,
    lng: 12.955,
    elevation: 1866,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-08-17",
    note: "WWI front-line site immediately east of Passo di Monte Croce Carnico (Plöckenpass); coordinates approximate."
  },
  {
    name: "Monte Bivera",
    lat: 46.4333,
    lng: 12.7167,
    elevation: 2474,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-08-19",
    note: "Between the Sauris basin and Forni di Sopra, via Forcella Bivera (2329 m); climbed together with Monte Clapsavon. Coordinates approximate."
  },
  {
    name: "Monte Clapsavon",
    lat: 46.4400,
    lng: 12.7000,
    elevation: 2462,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-08-19",
    note: "Between the Sauris basin and Forni di Sopra, near Forcella Bivera; climbed together with Monte Bivera. Coordinates approximate."
  },
  {
    name: "Monte Coglians",
    lat: 46.60694,
    lng: 12.88806,
    elevation: 2780,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-08-22",
    dates: ["2023-08-22", "2025-09-06"],
    note: "Highest peak of the Carnic Alps, on the Italy-Austria border."
  },
  {
    name: "Rifugio Gilberti",
    lat: 46.3876,
    lng: 13.4738,
    elevation: 1850,
    range: "Julian Alps",
    type: "rifugio",
    date: "2023-08-26",
    note: "Rifugio Celso Gilberti, Vallon Prevala near Sella Nevea, opposite the Bila Peč wall."
  },
  {
    name: "Monte Bila Peč",
    lat: 46.392,
    lng: 13.470,
    elevation: 2146,
    range: "Julian Alps",
    type: "peak",
    date: "2023-08-26",
    note: "Canin group, above Sella Nevea; climbed together with the visit to Rifugio Gilberti. Coordinates approximate."
  },
  {
    name: "Creta di Collinetta",
    lat: 46.610,
    lng: 12.960,
    elevation: 2238,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-09-03",
    dates: ["2023-09-03", "2025-09-15"],
    note: "Easternmost peak of the Coglians-Chianevate group, overlooking Passo di Monte Croce Carnico; also known as Cellonkofel. Coordinates approximate."
  },
  {
    name: "Creta di Collina",
    lat: 46.615,
    lng: 12.945,
    elevation: 2669,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-09-20",
    dates: ["2023-09-20", "2026-09-04"],
    note: "Reached from Passo di Monte Croce Carnico via Rifugio Marinelli (CAI 146/171); distinct peak from Creta di Collinetta. Coordinates approximate."
  },
  {
    name: "Costa Baton",
    lat: 46.400,
    lng: 12.685,
    elevation: 1730,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-10-28",
    note: "Loop from Forni di Sotto past the Cjampanì rock towers, on the south slope of Monte Zauf; Casera Costa Baton (1730 m). Coordinates approximate."
  },
  {
    name: "Monte Vas",
    lat: 46.380,
    lng: 12.965,
    elevation: 1367,
    range: "Carnic Prealps",
    type: "peak",
    date: "2023-12-10",
    note: "Ridge above Curiedi di Fusea (Tolmezzo), on the same traverse as Monte Duron, Navantes, and Rifugio Fornas; coordinates approximate, exact elevation unconfirmed. Note: there is also a \"Piani di Vas\" near Rigolato/Malga Tuglia — if this is that area instead, it should move ~20 km east."
  },
  {
    name: "Giro delle Malghe di Brazzà",
    lat: 46.41442,
    lng: 13.4466,
    elevation: 1660,
    range: "Julian Alps",
    type: "passo",
    date: "2023-12-17",
    note: "Loop on the Piani del Montasio, Chiusaforte, past Rifugio/Casera di Brazzà."
  },
  {
    name: "Monte Talm",
    lat: 46.510,
    lng: 12.760,
    elevation: 1728,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-12-24",
    note: "Val Pesarina (Prato Carnico), near Monte Pleros, past Rifugio Monte Talm (1093 m); coordinates approximate."
  },
  {
    name: "Monte Cucco",
    lat: 46.450,
    lng: 12.980,
    elevation: 1804,
    range: "Carnic Alps",
    type: "peak",
    date: "2023-12-27",
    note: "Central Carnic Alps, reached from Rivalpo or Piano d'Arta (CAI 409); distinct from the Umbrian Monte Cucco. Coordinates approximate."
  },
  {
    name: "Monte San Simeone",
    lat: 46.3437,
    lng: 13.1066,
    elevation: 1204,
    range: "Julian Prealps",
    type: "peak",
    date: "2024-01-04",
    note: "Near Cividale del Friuli. Sources vary on elevation (1204-1505 m); using the commonly cited figure."
  },
  {
    name: "Monte Falchia",
    lat: 46.1500,
    lng: 13.3500,
    elevation: 700,
    range: "Julian Prealps",
    type: "peak",
    date: "2024-02-14",
    note: "Wooded high point on the Sentiero dei Castelli loop between Attimis and Faedis; exact elevation unconfirmed, coordinates approximate."
  },
  {
    name: "Monte Bernadia",
    lat: 46.1700,
    lng: 13.3400,
    elevation: 1045,
    range: "Julian Prealps",
    type: "peak",
    date: "2024-03-17",
    note: "Near Attimis/Nimis."
  },
  {
    name: "Monte Spin",
    lat: 46.415,
    lng: 13.005,
    elevation: 1000,
    range: "Carnic Prealps",
    type: "peak",
    date: "2024-04-07",
    note: "Reached from Terzo/Lorenzaso (Tolmezzo) via Sella Marcelie; coordinates approximate."
  },
  {
    name: "Monte Joanaz",
    lat: 46.1600,
    lng: 13.3600,
    elevation: 907,
    range: "Julian Prealps",
    type: "peak",
    date: "2024-04-28",
    note: "Near Faedis/Nimis."
  },
  {
    name: "Monte Tribil",
    lat: 46.150,
    lng: 13.545,
    elevation: 917,
    range: "Julian Prealps",
    type: "peak",
    date: "2024-05-05",
    note: "Likely Monte Cum, the high point above Tribil Superiore (Stregna) in the Natisone Valleys, a WWI front-line summit; coordinates approximate, name/identity not fully confirmed."
  },
  {
    name: "Monte Bottai",
    lat: 46.3700,
    lng: 12.9100,
    elevation: 1400,
    range: "Carnic Prealps",
    type: "peak",
    date: "2024-05-19",
    dates: ["2024-05-19", "2025-03-02"],
    note: "Coordinates approximate."
  },
  {
    name: "Monte Cimone di Crasulina",
    lat: 46.5700,
    lng: 12.9600,
    elevation: 2104,
    range: "Carnic Alps",
    type: "peak",
    date: "2024-05-26",
    note: "Faces Monte Terzo across the Tierz pass, near Passo di Monte Croce Carnico; climbed the same day as a return visit to Monte Terzo. Coordinates approximate."
  },
  {
    name: "Monte Dimon",
    lat: 46.5300,
    lng: 13.0500,
    elevation: 1717,
    range: "Carnic Alps",
    type: "peak",
    date: "2024-06-09",
    dates: ["2024-06-09", "2025-01-05"],
    note: "Near Paularo, Val d'Incarojo; coordinates approximate."
  },
  {
    name: "Monte Valsecca",
    lat: 46.548,
    lng: 12.930,
    elevation: 1871,
    range: "Carnic Alps",
    type: "peak",
    date: "2024-07-14",
    note: "Near Ravascletto/Zoncolan (CAI 152), by Casera Valsecca, grouped with Monte Cuar dal Bec and Piz di Mede; coordinates approximate."
  },
  {
    name: "Passo Giau",
    lat: 46.4805,
    lng: 12.0448,
    elevation: 2236,
    range: "Dolomites",
    type: "passo",
    date: "2024-07-28",
    note: "Loop hike (anello) around the pass."
  },
  {
    name: "Monte Mulaz",
    lat: 46.31564,
    lng: 11.832864,
    elevation: 2906,
    range: "Dolomites",
    type: "peak",
    date: "2024-07-29",
    note: "Pala group."
  },
  {
    name: "Pale di San Martino (Cima della Rosetta)",
    lat: 46.2628,
    lng: 11.8313,
    elevation: 2743,
    range: "Dolomites",
    type: "peak",
    date: "2024-07-30",
    note: "Reached from San Martino di Castrozza via the Rosetta cable car."
  },
  {
    name: "Rifugio Rosetta - Giovanni Pedrotti",
    lat: 46.2635,
    lng: 11.8280,
    elevation: 2581,
    range: "Dolomites",
    type: "rifugio",
    date: "2024-07-30",
    note: "On the Rosetta plateau, just below Cima della Rosetta."
  },
  {
    name: "Rifugio Velo della Madonna",
    lat: 46.2767,
    lng: 11.8300,
    elevation: 2358,
    range: "Dolomites",
    type: "rifugio",
    date: "2024-07-31",
    note: "Pale di San Martino, near Cima di Ball; coordinates approximate."
  },
  {
    name: "Mala Ponca",
    lat: 46.3800,
    lng: 13.4800,
    elevation: 2270,
    range: "Julian Alps",
    type: "peak",
    date: "2024-08-04",
    note: "Sella Nevea / Val Raccolana area (Canin-Montasio group); could not independently confirm this exact summit name, coordinates approximate."
  },
  {
    name: "Monte Volaia",
    lat: 46.6000,
    lng: 12.8000,
    elevation: 2470,
    range: "Carnic Alps",
    type: "peak",
    date: "2024-08-11",
    note: "Above Passo Volaia (Italy-Austria border) and Lago di Volaia, reached from Rifugio Tolazzi (Forni Avoltri); coordinates approximate."
  },
  {
    name: "Monte Osternig",
    lat: 46.5659,
    lng: 13.4996,
    elevation: 2052,
    range: "Carnic Alps",
    type: "peak",
    date: "2024-08-13",
    note: "Also known as Oisternig, on the Austria border at Nassfeld."
  },
  {
    name: "Monte Hochwipfel",
    lat: 46.6000,
    lng: 13.2500,
    elevation: 2195,
    range: "Carnic Alps",
    type: "peak",
    date: "2024-08-15",
    note: "On the border ridge between Monte Cavallo di Pontebba and Creta di Timau (a distinct peak from Monte Cavallo, not an alternate name for it); coordinates approximate."
  },
  {
    name: "Monte Tiarfin",
    lat: 46.470,
    lng: 12.605,
    elevation: 2417,
    range: "Carnic Alps",
    type: "peak",
    date: "2024-08-17",
    note: "Western Carnic Alps between Forni di Sopra and Sella di Ciampigotto, reached from Casera Razzo; coordinates approximate."
  },
  {
    name: "Monte Lastroni",
    lat: 46.5750,
    lng: 12.6850,
    elevation: 2449,
    range: "Carnic Alps",
    type: "peak",
    date: "2024-08-24",
    note: "Between the Sappada valley and Val Sesis, via CAI 138 from Laghi d'Olbe (visited again the same day); coordinates approximate."
  },
  {
    name: "Unknown peak",
    lat: 46.40,
    lng: 13.00,
    elevation: null,
    range: "Carnic Prealps",
    type: "peak",
    date: "2024-08-29",
    dates: ["2024-08-29", "2024-12-27", "2025-01-12", "2025-07-27", "2025-07-30", "2025-09-07", "2025-12-21"],
    note: "Exact peak forgotten when logging each of these trips — grouped here as one placeholder marker."
  },
  {
    name: "Malga Geu",
    lat: 46.590,
    lng: 12.745,
    elevation: 1785,
    range: "Carnic Alps",
    type: "rifugio",
    date: "2024-09-03",
    note: "Casera Geu Alta, near Forni Avoltri, reached from Malga Tuglia; coordinates approximate. Originally logged as \"passo geu\"."
  },
  {
    name: "Malga Tuglia",
    lat: 46.585,
    lng: 12.735,
    elevation: 1597,
    range: "Carnic Alps",
    type: "rifugio",
    date: "2024-09-03",
    note: "On the saddle between Monte Tuglia and Monte Cimon, above Forni Avoltri's biathlon center; coordinates approximate."
  },
  {
    name: "Babà Grande (uncertain)",
    lat: 46.18,
    lng: 13.38,
    elevation: null,
    range: "Julian Prealps",
    type: "peak",
    date: "2024-09-10",
    note: "Location and identity uncertain — name recalled only as \"Babà Grande\", likely near Tarcento/Faedis/Nimis."
  },
  {
    name: "Unknown peak near Pontebba",
    lat: 46.4989,
    lng: 13.3011,
    elevation: null,
    range: "Carnic Alps",
    type: "peak",
    date: "2024-09-20",
    note: "Exact peak forgotten; general area near Pontebba."
  },
  {
    name: "Monte Dogna",
    lat: 46.450,
    lng: 13.350,
    elevation: 1961,
    range: "Julian Alps",
    type: "peak",
    date: "2024-09-02",
    note: "Likely Jôf di Dogna, reached via Forcella Mincigos (CAI 602) in Val Dogna; coordinates approximate."
  },
  {
    name: "Monte Vualt",
    lat: 46.460,
    lng: 13.220,
    elevation: 1725,
    range: "Carnic Alps",
    type: "peak",
    date: "2024-09-22",
    note: "Between Val Alba and Val Aupa (Moggio Udinese), via the \"Palis d'Arint\" ridge trail; coordinates approximate."
  },
  {
    name: "Monte Morgenleit",
    lat: 46.5500,
    lng: 13.2800,
    elevation: 2010,
    range: "Carnic Alps",
    type: "peak",
    date: "2024-09-29",
    note: "Border ridge near Passo Pramollo/Nassfeld, among Gartnerkofel (2195 m), Rosskofel (2239 m), and Trogkofel (2280 m); exact peak name not independently confirmed, coordinates approximate."
  },
  {
    name: "Monte Cuar",
    lat: 46.265,
    lng: 13.020,
    elevation: 1478,
    range: "Carnic Prealps",
    type: "peak",
    date: "2024-12-21",
    note: "Val d'Arzino massif near Vito d'Asio/Forgaria, reached from Cuel di Forchia; often paired with Monte Flagjel. Coordinates approximate."
  },
  {
    name: "Lago Dimon",
    lat: 46.5320,
    lng: 13.0450,
    elevation: 1600,
    range: "Carnic Alps",
    type: "lake",
    date: "2025-01-05",
    note: "Near Monte Dimon, Paularo area; coordinates approximate."
  },
  {
    name: "Monte Paularo",
    lat: 46.535,
    lng: 13.095,
    elevation: 2043,
    range: "Carnic Alps",
    type: "peak",
    date: "2025-01-05",
    note: "Part of the Neddis-Dimon-Paularo ring from Castel Valdajer (Ligosullo), overlooking Paularo; coordinates approximate."
  },
  {
    name: "Monte Neddis",
    lat: 46.540,
    lng: 13.085,
    elevation: 1990,
    range: "Carnic Alps",
    type: "peak",
    date: "2025-01-05",
    note: "Part of the Neddis-Dimon-Paularo ring from Castel Valdajer (Ligosullo); coordinates approximate."
  },
  {
    name: "Monte Acomizza",
    lat: 46.550,
    lng: 13.550,
    elevation: 1813,
    range: "Julian Alps",
    type: "peak",
    date: "2025-05-01",
    note: "North of Camporosso (Tarvisio), on the Italy-Austria border; coordinates approximate."
  },
  {
    name: "Karlsbader Hütte",
    lat: 46.7631,
    lng: 12.8011,
    elevation: 2260,
    range: "Austrian Alps",
    type: "rifugio",
    date: "2025-07-31",
    note: "Lienz Dolomites (East Tyrol), directly on the Laserzsee."
  },
  {
    name: "Seebachsee",
    lat: 47.018,
    lng: 13.194,
    elevation: 1273,
    range: "Austrian Alps",
    type: "lake",
    date: "2025-08-01",
    note: "Likely the Stappitzer See in the Seebachtal near Mallnitz — no lake named exactly \"Seebachsee\" was found, this is the well-known lake on that trail. Coordinates approximate."
  },
  {
    name: "Berndalm",
    lat: 47.00,
    lng: 13.20,
    elevation: 1335,
    range: "Austrian Alps",
    type: "rifugio",
    date: "2025-08-01",
    note: "Likely the Schwussnerhütte at the end of the Seebachtal near Mallnitz — the real \"Berndlalm\" is a same-named hut in a different valley (Obersulzbachtal, Salzburg), so this is probably a mix-up. Coordinates approximate."
  },
  {
    name: "Hochgrabe",
    lat: 46.947,
    lng: 13.360,
    elevation: 2965,
    range: "Austrian Alps",
    type: "peak",
    date: "2025-08-03",
    note: "No peak named exactly \"Hochgrabe\" was found; likely the Reißeck (2965 m), the highest point of the Reißeck/Ankogel group in Carinthia's Mölltal. Coordinates approximate, please double check."
  },
  {
    name: "Monte Sart",
    lat: 46.40,
    lng: 13.47,
    elevation: 2324,
    range: "Julian Alps",
    type: "peak",
    date: "2025-08-05",
    note: "Canin group, reached from Rifugio Gilberti via Sella Bila Peč and Sella Grubia; coordinates approximate."
  },
  {
    name: "Giro delle Malghe di Sauris",
    lat: 46.47,
    lng: 12.72,
    elevation: 1400,
    range: "Carnic Alps",
    type: "passo",
    date: "2025-08-10",
    note: "Loop route through the alpine huts above Sauris; representative point, coordinates approximate."
  },
  {
    name: "Bivacco Lomasti",
    lat: 46.5585,
    lng: 13.2300,
    elevation: 1920,
    range: "Carnic Alps",
    type: "rifugio",
    date: "2025-08-12",
    note: "Bivacco Ernesto Lomasti, on Sella d'Aip near the Austrian border (Moggio Udinese), between Creta di Aip and Creta di Pricotic, reached from Passo Cason di Lanza."
  },
  {
    name: "Monte Tinisa",
    lat: 46.46,
    lng: 12.70,
    elevation: 2120,
    range: "Carnic Alps",
    type: "peak",
    date: "2025-08-16",
    note: "Between Ampezzo and Sauris, south of Lago di Sauris, via the \"Cresta nel Cielo\" via ferrata (west summit); coordinates approximate."
  },
  {
    name: "Monte Avanza",
    lat: 46.640,
    lng: 12.760,
    elevation: 2489,
    range: "Carnic Alps",
    type: "peak",
    date: "2025-08-24",
    note: "Also known as Montagna Bianca; eastern end of the Peralba-Avanza massif, northwest of Forni Avoltri, a WWI battle site. Coordinates approximate."
  },
  {
    name: "Forcella Scodovacca",
    lat: 46.435,
    lng: 12.505,
    elevation: 2042,
    range: "Carnic Alps",
    type: "passo",
    date: "2025-08-31",
    note: "Above Rifugio Giaf near Forni di Sopra, on the border with the Dolomites (Torre Berti, Torre Spinotti, Tacca del Cridola); coordinates approximate."
  },
  {
    name: "Rifugio Colo",
    lat: 46.390,
    lng: 13.085,
    elevation: 615,
    range: "Carnic Alps",
    type: "rifugio",
    date: "2025-09-08",
    note: "Rifugio Colò, Stavoli Mariane di Sot, on the eastern slope of Monte Amariana above Amaro; coordinates approximate."
  },
  {
    name: "Rifugio Passo Principe",
    lat: 46.4741,
    lng: 11.6389,
    elevation: 2601,
    range: "Dolomites",
    type: "rifugio",
    date: "2025-09-20",
    note: "Catinaccio (Rosengarten) group, near San Giovanni di Fassa — not the Pale di San Martino group."
  },
  {
    name: "Piz Boè",
    lat: 46.4886,
    lng: 11.8397,
    elevation: 3152,
    range: "Dolomites",
    type: "peak",
    date: "2025-09-21",
    note: "Sella group."
  },
  {
    name: "Passo Pura",
    lat: 46.422987,
    lng: 12.743598,
    elevation: 1425,
    range: "Carnic Prealps",
    type: "passo",
    date: "2025-09-23",
    note: "Connects Ampezzo with Sauris."
  },
  {
    name: "Creta di Mimoias",
    lat: 46.480,
    lng: 12.680,
    elevation: 2288,
    range: "Carnic Alps",
    type: "peak",
    date: "2025-09-29",
    note: "Cima Est, at the head of Val Pesarina on the border with Val Frison, via CAI 203; coordinates approximate."
  },
  {
    name: "Monte Ciucis",
    lat: 46.360,
    lng: 13.065,
    elevation: 1315,
    range: "Carnic Prealps",
    type: "peak",
    date: "2025-12-27",
    note: "Near Amaro, reached via Rifugio Elio Franz from Tugliezzo (Venzone); coordinates approximate."
  },
  {
    name: "Monte Cocco",
    lat: 46.535,
    lng: 13.445,
    elevation: 1941,
    range: "Julian Alps",
    type: "peak",
    date: "2026-01-04",
    note: "Valle di Ugovizza, near the Austrian border; climbed together with Monte Sagran and Cima Bella via the Rio Tamer valley. Coordinates approximate."
  },
  {
    name: "Monte Sagran",
    lat: 46.540,
    lng: 13.450,
    elevation: 1922,
    range: "Julian Alps",
    type: "peak",
    date: "2026-01-04",
    note: "Valle di Ugovizza, near the Austrian border; climbed together with Monte Cocco and Cima Bella. Coordinates approximate."
  },
  {
    name: "Cima Bella",
    lat: 46.538,
    lng: 13.448,
    elevation: 1911,
    range: "Julian Alps",
    type: "peak",
    date: "2026-01-04",
    note: "Valle di Ugovizza, near the Austrian border; climbed together with Monte Cocco and Monte Sagran. Coordinates approximate."
  },
  {
    name: "Malga Confin",
    lat: 46.340,
    lng: 13.185,
    elevation: 1330,
    range: "Julian Prealps",
    type: "rifugio",
    date: "2026-03-22",
    note: "Venzonassa valley (Venzone), below Monte Plauris; coordinates approximate."
  },
  {
    name: "Forcella Giais",
    lat: 46.140,
    lng: 12.545,
    elevation: 1400,
    range: "Carnic Prealps",
    type: "passo",
    date: "2026-04-04",
    note: "Dolomiti Friulane, near Piancavallo and Monte Ciastelat (1641 m); coordinates approximate."
  },
  {
    name: "Monte Flagjel",
    lat: 46.270,
    lng: 13.035,
    elevation: 1467,
    range: "Carnic Prealps",
    type: "peak",
    date: "2026-04-06",
    note: "Val d'Arzino massif near Vito d'Asio/Forgaria, next to Monte Cuar (1478 m); coordinates approximate."
  },
  {
    name: "Punta Lasciovizza",
    lat: 46.210,
    lng: 13.320,
    elevation: 1623,
    range: "Julian Prealps",
    type: "peak",
    date: "2026-04-11",
    note: "Along the Cresta del Gran Monte near Taipana, overlooking the Musi group and Alta Val Torre; coordinates approximate."
  },
  {
    name: "Monte Rovolon",
    lat: 45.35,
    lng: 11.70,
    elevation: 470,
    range: "Euganean Hills",
    type: "peak",
    date: "2026-05-19",
    note: "Colli Euganei, near Padova — not the Alps; likely Monte Grande, above the town of Rovolon. Coordinates approximate."
  },
  {
    name: "Creta di Mezzodì",
    lat: 46.490,
    lng: 13.130,
    elevation: 1806,
    range: "Carnic Alps",
    type: "peak",
    date: "2026-06-07",
    note: "Above Rifugio Monte Sernio (CAI 416); distinct from Picco di Mezzodì (Julian Alps). Coordinates approximate."
  },
  {
    name: "Monte Flop",
    lat: 46.4790,
    lng: 13.1760,
    elevation: 1792,
    range: "Carnic Alps",
    type: "peak",
    date: "2026-07-19",
    note: "Sernio-Grauzaria group, reached from Moggio Udinese via Val d'Aupa and Rifugio Grauzaria; has a west summit (1792 m, used here) and an east summit (1715 m). Coordinates approximate."
  },
  {
    name: "Monte Visevnik",
    lat: 46.339,
    lng: 13.951,
    elevation: 2050,
    range: "Balkans",
    type: "peak",
    date: "2026-07-22",
    note: "Julian Alps, Pokljuka, Slovenia."
  },
  {
    name: "Lago di Bled",
    lat: 46.3683,
    lng: 14.0942,
    elevation: 475,
    range: "Balkans",
    type: "lake",
    date: "2026-07-22",
    note: "Slovenia; visited the same day as Monte Visevnik."
  },
  {
    name: "Laghi di Plitvice",
    lat: 44.8654,
    lng: 15.6216,
    elevation: 500,
    range: "Balkans",
    type: "lake",
    date: "2026-07-23",
    note: "Croatia; coordinates approximate (park covers a large area)."
  },
  {
    name: "Unknown location",
    lat: 44.90,
    lng: 15.80,
    elevation: null,
    range: "Balkans",
    type: "peak",
    date: "2026-07-24",
    note: "Exact place forgotten during the Balkans trip."
  },
  {
    name: "Monte Perast",
    lat: 42.4875,
    lng: 18.7300,
    elevation: 700,
    range: "Balkans",
    type: "peak",
    date: "2026-07-25",
    note: "Hill above Perast, Bay of Kotor, Montenegro; coordinates approximate."
  },
  {
    name: "Black Lake",
    lat: 43.14333,
    lng: 19.08750,
    elevation: 1416,
    range: "Balkans",
    type: "lake",
    date: "2026-07-25",
    note: "Crno Jezero, Durmitor National Park, Montenegro — a long day combining this with Perast (Bay of Kotor), ~100 km apart, recorded together as logged."
  },
  {
    name: "Monte Budva",
    lat: 42.29,
    lng: 18.84,
    elevation: 400,
    range: "Balkans",
    type: "peak",
    date: "2026-07-26",
    note: "Hill above Budva, Montenegro; coordinates approximate."
  },
  {
    name: "Monte Cincar",
    lat: 43.90222,
    lng: 17.06278,
    elevation: 2006,
    range: "Balkans",
    type: "peak",
    date: "2026-07-28",
    note: "Highest peak of western Bosnia and Herzegovina, near Livno."
  },
  {
    name: "Passo dell'Arco",
    lat: 46.580,
    lng: 12.720,
    elevation: 1907,
    range: "Carnic Alps",
    type: "passo",
    date: "2026-08-02",
    note: "Above Sappada, named for a natural rock arch on the saddle, starting point for the Creton dell'Arco (2357 m) via ferrata. Coordinates approximate."
  },
  {
    name: "Bivacco Damiana Gobbo",
    lat: 46.585,
    lng: 12.715,
    elevation: 1985,
    range: "Carnic Alps",
    type: "rifugio",
    date: "2026-08-02",
    note: "Bivacco Damiana del Gobbo, in Cadin di Dentro near Sappada, below the Clap massif; reached via Passo dell'Arco, climbed together. Coordinates approximate."
  },
  {
    name: "Bivacco Bianchi",
    lat: 46.443,
    lng: 13.230,
    elevation: 1713,
    range: "Carnic Alps",
    type: "rifugio",
    date: "2026-08-05",
    note: "Bivacco Giuseppe Bianchi, Val Alba nature reserve (Moggio Udinese), below Monte Chiavals; coordinates approximate."
  },
  {
    name: "Monte Chiavals",
    lat: 46.435,
    lng: 13.235,
    elevation: 2098,
    range: "Carnic Alps",
    type: "peak",
    date: "2026-08-06",
    note: "Val Alba nature reserve (Moggio Udinese), reached via Bivacco Bianchi; coordinates approximate."
  },
  {
    name: "Creta Forata",
    lat: 46.533,
    lng: 12.733,
    elevation: 2462,
    range: "Carnic Alps",
    type: "peak",
    date: "2026-08-09",
    note: "Near Sappada, famous for its natural arch. Twin summit."
  },
  {
    name: "Lago di Volaia",
    lat: 46.598,
    lng: 12.798,
    elevation: 1953,
    range: "Carnic Alps",
    type: "lake",
    date: "2026-08-13",
    note: "Near Rifugio Tolazzi; visited the same day as a return climb of Monte Rauchkofel. Coordinates approximate."
  },
  {
    name: "Monte Ferrara",
    lat: 46.383,
    lng: 12.495,
    elevation: 2258,
    range: "Carnic Prealps",
    type: "peak",
    date: "2026-08-15",
    note: "Dolomiti Friulane (not the Trentino Pale di San Martino), above Rifugio Pordenone near Val Montanaia; coordinates approximate."
  },
  {
    name: "Rifugio Pordenone",
    lat: 46.3785,
    lng: 12.4902,
    elevation: 1249,
    range: "Carnic Prealps",
    type: "rifugio",
    date: "2026-08-15",
    note: "Dolomiti Friulane, at the confluence of Val Montanaia and Val Meluzzo, below Monte Ferrara; close to Forcella Montanaia."
  },
  {
    name: "Forcella Montanaia",
    lat: 46.4039,
    lng: 12.4861,
    elevation: 2334,
    range: "Carnic Prealps",
    type: "passo",
    date: "2026-08-16",
    note: "Dolomiti Friulane, Spalti di Toro group; famous natural arch nearby."
  },
  {
    name: "Monte Palombino",
    lat: 46.63,
    lng: 12.68,
    elevation: 2600,
    range: "Carnic Alps",
    type: "peak",
    date: "2026-08-27",
    note: "Cima Palombino, above Val Sesis (Sappada), on the Italy-Austria border; coordinates approximate."
  },
  {
    name: "Creta delle Chianevate",
    lat: 46.612,
    lng: 12.905,
    elevation: 2769,
    range: "Carnic Alps",
    type: "peak",
    date: "2026-09-04",
    note: "Kellerspitzen; second-highest peak of Friuli-Venezia Giulia after Coglians, just east of it on the Italy-Austria border; climbed together with a return visit to Creta di Collina. Coordinates approximate."
  },
  {
    name: "Casera Avrint",
    lat: 46.356915,
    lng: 12.971836,
    elevation: 1071,
    range: "Carnic Prealps",
    type: "rifugio",
    date: "2026-09-05",
    note: "On the north slope of Monte Bottai, reached from Sella Chianzutan; panoramic view over the Tolmezzo basin."
  },
  {
    name: "Rifugio Pietro Fabiani",
    lat: 46.593357,
    lng: 13.078369,
    elevation: 1539,
    range: "Carnic Alps",
    type: "rifugio",
    date: "2026-09-08",
    note: "On the Passo Cason di Lanza road above Paularo, below Monte Zermula; starting point for the crossing to the Zollnersee Hütte on the Austrian side."
  },
  {
    name: "Zollnersee Hütte",
    lat: 46.605455,
    lng: 13.070744,
    elevation: 1750,
    range: "Carnic Alps",
    type: "rifugio",
    date: "2026-09-08",
    note: "Am Zollner, Dellach (Kärnten, Austria), by the Zollnersee just over the border above Rifugio Pietro Fabiani; visited the same day."
  }
];
