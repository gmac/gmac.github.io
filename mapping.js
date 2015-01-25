module.exports = {};

module.exports.actors = {
  'fishcrate': 'nathan',
  'shroom_window': 'shroom',
  'echo': 'voicefx',
  'chasm': 'voicefx',
  'amayi2': 'amayi',
  'castle_faker': 'faker',
  'fisherman1': 'ed',
  'fisherman2': 'bill',
  'stephan': 'caro',
  'vincent2': 'vincent',
  'slappyanthony': 'slappy',
  'exit_mill': 'slappy',
  'henry': 'slappy',
  'radio': 'slappy',
  'guard': 'holdup',
  'juggler': 'greg',
  'nora2': 'nora',
  'MB_Caro': 'mrs_caro',
  'mbcaro': 'mrs_caro',
  'pavoice': 'rat',
  'mtstation': 'coppelius',
  'exit_mtstation': 'coppelius',
  'narrative': 'nathan'
};

module.exports.subtitles = {
  'amayi': '0xCCCCCC',
  'bill': '0x99CCCC',
  'cain': '0xFFCC33',
  'caro': '0xFFDD99',
  'cecily': '0xCCFFCC',
  'coppelius': '0xCCCCCC',
  'ed': '0x99CCCC',
  'eve': '0xFFA3A3',
  'faker': '0xFFFF99',
  'forkbeard': '0x99CCFF',
  'greg': '0x99CCFF',
  'holdup': '0xFFCC33',
  'juego': '0xFFCC66',
  'kid1': '0xCCFFCC',
  'kid2': '0x99CCFF',
  'kid3': '0xFFA3A3',
  'lars': '0x99CCCC',
  'lionstone': '0xFFCC66',
  'manbreaker': '0xFFFF99',
  'mandelbaum': '0xCCCCFF',
  'matt': '0xFFA3A3',
  'mcmanus': '0x99CCCC',
  'mrs_caro': '0xFFCC33',
  'narrator': '0xFFFFFF',
  'nathan': '0xFFDD99',
  'nigel': '0xE0E0FF',
  'nora': '0xFFFF99',
  'rat': '0xFFFF99',
  'shroom': '0xFFCC66',
  'slappy': '0xFFCC66',
  'smith': '0xCCCCCC',
  'stig': '0xFFDD99',
  'trelawney': '0x99CCFF',
  'vincent': '0xCCFF99',
  'wavetamer': '0x99CCCC',
  'webb': '0x99CCFF'
};

module.exports.sceneIds = {
  'docks_intro': 'docks',
  'harbor_intro': 'harbor',
  'boathouse_window': 'boathouse',
  'boathouse3_rift': 'boathouse',
  'boathouse3_riftwindow': 'boathouse',
  'mtcatwalks': 'mtsummit'
};

module.exports.bundles = {
  'boathouse': ['boathouse_window', 'boathouse', 'boathouse3_rift', 'boathouse3_riftwindow'],
  'docks': ['docks_intro', 'docks'],
  'harbor': ['harbor_intro', 'harbor'],
  'mtsummit': ['mtcatwalks', 'mtsummit']
};

module.exports.caches = {
  'docks': {},
  'harbor': {},
  'boathouse': {},
  'mtsummit': {}
};

module.exports.omitIndices = {
  'antique': [302, 328, 333, 334, 335, 344, 374, 390, 392],
  'boathouse': [0, 1, 2, 3, 4, 53, 54, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211],
  'campfire': [38, 39],
  'castle': [151],
  'cliff': [47],
  'docks': [59, 60],
  'global': [120, 194, 196, 197, 200, 272, 273, 274, 322, 323, 324, 325, 331, 356, 359, 366, 514, 541, 555, 561, 607, 608, 609, 633],
  'harbor': [184, 284, 285, 308, 366, 367, 400, 401, 413, 487, 517, 529, 556],
  'inn': [23, 187, 356, 406],
  'mask': [166, 167],
  'mill': [79, 80, 81],
  'square': [119, 120, 122],
  'square3': [74],
  'treehouse': [162],
  'trelawney': [20]
};

module.exports.scenes = {
  'antique': 'nigel',
  'baron': 'nigel',
  'boathouse_window': 'nigel',
  'boathouse': 'nigel',
  'boathouse3': 'nathan',
  'boathouse3_rift': 'nora',
  'boathouse3_riftwindow': 'nora',
  'campfire': 'nigel',
  'campfire3': 'nathan',
  'castle': 'nigel',
  'castle3': 'nathan',
  'catwalk': 'nigel',
  'catwalk3': 'nathan',
  'cellar': 'nigel',
  'cellar3': 'nathan',
  'cliff': 'nigel',
  'cliff3': 'nathan',
  'cutscene_endact1': 'nigel',
  'cutscene_intro': 'nigel',
  'docks_intro': 'nigel',
  'docks': 'nigel',
  'docks3': 'nathan',
  'fishing': 'nigel',
  'harbor_intro': 'nigel',
  'harbor': 'nigel',
  'harbor3': 'nathan',
  'inn': 'nigel',
  'inn3': 'nathan',
  'mask': 'nigel',
  'mask3': 'nathan',
  'mill': 'nigel',
  'mtcatwalks': 'nathan',
  'mtlab': 'nathan',
  'mtplateau': 'nathan',
  'mtpower': 'nathan',
  'mtstation': 'nathan',
  'mtsummit': 'nathan',
  'portauthority': 'nigel',
  'river': 'nigel',
  'river3': 'nathan',
  'smith': 'nigel',
  'smith3': 'nathan',
  'square': 'nigel',
  'square3': 'nathan',
  'swamp3': 'nathan',
  'tower': 'nigel',
  'tower3': 'nathan',
  'treehouse': 'nigel',
  'treehouse3': 'nathan',
  'trelawney': 'nigel',
  'trelawney3': 'nathan',
  'woods': 'nigel',
  'woods3': 'nathan',
  'world': 'nigel',
  //'world3': 'nathan',
  'yard': 'nigel',
  'yard3': 'nathan'
};

module.exports.owners = {
  PA_key: 'nigel',
  apparatuslist: 'nathan',
  apple: 'nigel',
  apple2: 'nigel',
  ball: 'nigel',
  batteries: 'nigel',
  boat_patch: 'nigel',
  boat_patch_tar: 'nigel',
  boathouse_fish: 'nigel',
  boathouse_fish2: 'nora',
  bomb_cherry: 'nigel',
  bomb_sticky: 'nigel',
  boot_laced: 'nigel',
  boot_tar: 'nigel',
  boot_unlaced: 'nigel',
  boots: 'nathan',
  bottle_empty: 'nathan',
  bottle_milk: 'nathan',
  bottle_milk_open: 'nathan',
  bottle_snow: 'nathan',
  bottle_water: 'nathan',
  bowl: 'nathan',
  bowl_milk: 'nathan',
  box: 'nathan',
  chest_decoy: 'nathan',
  chest_key: 'nigel',
  chest_loot: 'nathan',
  chisel: 'nigel',
  cloak: 'nigel',
  cloakFeathers: 'nigel',
  cloakTar: 'nigel',
  clockhands: 'nigel',
  coin_bag: 'nigel',
  coins: 'nigel',
  costume: 'nigel',
  crayon: 'nigel',
  crayonPaper: 'nigel',
  crowbar: 'nigel',
  diagram: 'nigel',
  diamondRing: 'nigel',
  dice: 'nathan',
  dogtag: 'nigel',
  ember: 'nigel',
  envelope: 'nigel',
  envelope2: 'nigel',
  feathers: 'nigel',
  firefly_jar1: 'nigel',
  firefly_jar2: 'nigel',
  fish2: 'nigel',
  fish_bucket: 'nigel',
  fish_nathan: 'nathan',
  fishing_hook: 'nigel',
  fishing_leader: 'nigel',
  fishing_leader2: 'nigel',
  flash_bad: 'nathan',
  flash_good: 'nathan',
  flyer: 'nigel',
  gaff: 'nathan',
  handlebar: 'nathan',
  jar1: 'nigel',
  jar1b: 'nigel',
  jar2: 'nigel',
  jar2b: 'nigel',
  jar3: 'nigel',
  jar3b: 'nigel',
  kettle: 'nigel',
  kettle2: 'nigel',
  kettle3: 'nigel',
  key_station: 'nathan',
  knives: 'nathan',
  lense: 'nigel',
  letter1: 'nigel',
  letter2: 'nigel',
  letter_opener: 'nigel',
  lighter_nathan: 'nathan',
  lighthouse_key: 'nathan',
  locket1: 'nigel',
  locket2: 'nigel',
  locket3: 'nigel',
  lovenote: 'nigel',
  magicwand: 'matt',
  magnet: 'nigel',
  mallet: 'nigel',
  malletchisel: 'nigel',
  map: 'nigel',
  mask: 'nigel',
  metal_handle: 'nathan',
  metal_hook: 'nigel',
  metallic_plates: 'nathan',
  module: 'nathan',
  mtstation_key: 'nathan',
  net: 'nigel',
  newspaper: 'nathan',
  noodles1: 'nathan',
  noodles2: 'nathan',
  note: 'nigel',
  notebook: 'nigel',
  painting1: 'nathan',
  painting1_foil: 'nathan',
  painting2: 'nathan',
  painting2_foil: 'nathan',
  pass: 'nigel',
  photo_nine: 'nigel',
  poem: 'nigel',
  power_connector1: 'nathan',
  power_connector2: 'nathan',
  power_connector3: 'nathan',
  pretzeljax: 'nigel',
  pretzeljax_open: 'nigel',
  propeller: 'nathan',
  remote: 'nigel',
  remote2: 'nigel',
  remote3: 'nigel',
  remote4: 'nigel',
  ring_coppelius: 'nigel',
  ring_goodchild: 'nigel',
  ring_henry: 'nigel',
  ring_sigmundson: 'nigel',
  ring_smith: 'nigel',
  ring_steven: 'nigel',
  ring_trelawney: 'nigel',
  ring_vonsternberg: 'nigel',
  ring_zygmunt: 'nigel',
  rocks: 'nigel',
  rod: 'nigel',
  rubberband: 'nora',
  rubberband2: 'nora',
  sharp_metal: 'nora',
  sharp_metal2: 'nora',
  shells: 'nora',
  shiplog: 'nigel',
  shirt: 'nathan',
  shirt2: 'nathan',
  shoelace: 'nigel',
  sketch: 'nigel',
  slides: 'nigel',
  slingshot: 'nigel',
  slingshot_cherry: 'nigel',
  slingshot_fish: 'nigel',
  slingshot_nora: 'nora',
  slingshot_pre1: 'nora',
  slingshot_pre2: 'nora',
  slingshot_rock: 'nigel',
  slingshot_shells: 'nora',
  slingshot_sticky: 'nigel',
  ss9a: 'nigel',
  ss9c: 'nigel',
  statue: 'nigel',
  statueMagnet: 'nigel',
  statue_key: 'nigel',
  sticker: 'nathan',
  string: 'nora',
  tar_bucket: 'nigel',
  teacup: 'nigel',
  teacupFull: 'nigel',
  telescope: 'nigel',
  telescope2: 'nigel',
  telescope3: 'nigel',
  tikis: 'nathan',
  tile_ice: 'nathan',
  tile_metal: 'nathan',
  torches: 'nathan',
  torches_fire: 'nathan',
  torches_oil: 'nathan',
  treasure1: 'nathan',
  treasure2: 'nathan',
  treasure3: 'nathan',
  trophy_kids: 'nigel',
  tube: 'nigel',
  tweezers: 'nigel',
  whiskey: 'nigel',
  will: 'nigel',
  will_signed: 'nigel',
  will_stamped: 'nigel',
  winch_handle: 'nigel',
  windsock: 'nigel',
  wrench: 'nigel'
};