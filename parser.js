var fs = require('fs');
var _ = require('underscore');
var xml2js = require('xml2js');
var parseXML = xml2js.parseString;
var mappings = require('./mapping.js');

var UNIQUE_DIALOG = 0;
var DEFINED_DIALOG = 0;
var EMPTY_DIALOG = 0;
var DUPLICATE_DIALOG = 0;
var ACTORS = {};
var ACTORS_BY_FILE = {};

var TEMPLATE = '';
var SRC_DIR = './xml/';
var OUT_DIR = '../xml/';
var SCREENPLAY_DIR = '../screenplay/';

var counts = {};
var dups = {};
var docs = {};
var omits = mappings.omitIndices;
var caches = mappings.caches;
var actors = mappings.actors;
var sceneIds = mappings.sceneIds;
var scenes = mappings.scenes;
var owners = mappings.owners;

// Map omissions into hash tables:
omits = _.each(omits, function(indices, key) {
  omits[key] = _.object(indices, indices);
});

function turnView(a, b) {
  var rads = Math.atan2(b.y-a.y, b.x-a.x);
  var deg = rads * 180 / Math.PI;
  deg = (deg < 0) ? 360 + deg : deg;

  // offset degrees to align the zero-mark with the vertical axis.
  deg -= (180 + 45 + 23);
  
  // adjust degrees to fall within range of a circle.
  if (deg < 0) {
    deg += 360;
  } else if (deg > 360) {
    deg -= 360;
  }
  var turn = Math.ceil((deg / 360) * 8);
  return isNaN(turn) ? 5 : turn;
}

function renderDoc(id, content, cast) {
  cast = _.reduce(_.keys(cast), function(memo, value) {
    return memo + ['<option value="', value, '">', value, '</option>'].join('');
  }, '');

  var doc = TEMPLATE.replace('{{ id }}', id);
  doc = doc.replace('{{ cast }}', cast);
  doc = doc.replace('{{ content }}', content);
  fs.writeFile(SCREENPLAY_DIR+id+'.html', doc);
}

function renderDialog(subtitle, actor, sound, duplicate) {
  DEFINED_DIALOG++;
  
  if (duplicate) {
    DUPLICATE_DIALOG++;
    
  } else if (subtitle) {
    if (!ACTORS.hasOwnProperty(actor)) ACTORS[actor] = 0;
    ACTORS[actor]++;
    UNIQUE_DIALOG++;
    
    subtitle = subtitle.replace(/’/g, "'");
    subtitle = subtitle.replace(/&#8222;|&#8220;|“|”/g, '"');
    var del1 = duplicate ? '<del>' : '';
    var del2 = duplicate ? '</del>' : '';
    return ['<div class="dialog ', actor, '"><tt>', sound.split(':').pop(), '</tt><p>', del1, '<b>', actor, ':</b> ', subtitle, del2, '</p></div>'].join('');
  
  } else {
    EMPTY_DIALOG++;
  }
  return '';
}

function renderSound(xml, oldPath, newPath) {
  if (!oldPath) throw 'undefined sound reference';
  return xml.replace('sound="'+oldPath+'"', 'sound="'+newPath+'"');
}

function parseRoom(id, done) {
  var XML = '';
  fs.readFile(SRC_DIR+id+'.xml', 'utf8', onRead);
  
  function getActor(puppetId) {
    if (puppetId === '_avatar') puppetId = scenes[id];
    var actor = actors[puppetId] ? actors[puppetId] : puppetId;
    return actor;
  }
  
  function onRead(err, data) {
    if (err) throw err;
    XML = data;
    XML = XML.replace(/&#8222;/g, "“");
    XML = XML.replace(/&#8220;/g, "”");
    console.log(id);
    parseXML(data, onParse);
  }
  
  function onParse(err, data) {
    if (err) throw err;
    var scene = sceneIds[id] || id;
    var cache = caches[scene] || {};
    var roomActors = {};
    var roomHTML = '';
    if (!counts[scene]) counts[scene] = 0;
    if (!dups[scene]) dups[scene] = 0;
    
    // Get the next valid dialog index to use within the scene:
    function nextIndex() {
      var index = counts[scene];
      if (omits[scene]) {
        while( omits[scene].hasOwnProperty(String(index)) ) index++;
      }
      counts[scene] = index + 1;
      return index;
    }

    // Parse in voice library reference:
    XML = XML.replace(/voiceLibs=".*?"/g, 'voiceLibs="lib/'+scene+'_voice.swf"');
    
    // LAYERS:
    _.each(data.room.layers[0].layer, function(layer) {
      var layerHTML = '';
      var layerActors = {};
      
      _.each(layer.states[0].state, function(state) {
        var stateHTML = '';
        var stateActors = {};
        var actions = (state.actions[0] && state.actions[0].action) || [];
        var items = (state.items[0] && state.items[0].action) || [];

        // Set turn-to value:
        var params = state.param[0];
        if (params) {
          var loc = {x: parseInt(state.$.x), y: parseInt(state.$.y)};
          var map = {x: params.$.mapX, y: params.$.mapY};
          var turn = turnView(map, loc);
          XML = XML.replace(new RegExp('(<layer id="'+layer.$.id+'".+?<state id="'+state.$.id+'".+?<param.+?)turnTo="."'), '$1');
          XML = XML.replace(new RegExp('(<layer id="'+layer.$.id+'".+?<state id="'+state.$.id+'".+?<param )'), '$1turnTo="'+turn+'" ');
        }
        
        _.each(actions.concat(items), function(action) {
          var actionHTML = '';
          var actionActors = {};

          _.each(action.dialog[0].dia, function(dialog) {
            var actor = getActor(dialog.$.puppet);
            
            roomActors[actor] = layerActors[actor] = stateActors[actor] = actionActors[actor] = true;
            if (!cache[actor]) cache[actor] = {};
            
            var subtitle = dialog['en'][0];
            var soundPath = cache[actor][subtitle];
            var duplicate = !!soundPath;
            
            if (!soundPath) {
              soundPath = cache[actor][subtitle] = ['lib/', scene, '_voice.swf:', scene, '_', ('0000' + nextIndex()).substr(-3)].join('');
            } else {
              dups[scene]++;
            }
            
            actionHTML += renderDialog(subtitle, actor, soundPath, duplicate);
            XML = renderSound(XML, dialog.$.sound, soundPath);
          });
          
          if (actionHTML)
            stateHTML += ['<div class="action ', _.keys(actionActors).join(' '), '"><h3>', action.title[0].en, ' ', state.title[0].en, ' (', state.$.id, ')</h3>', actionHTML, '</div>'].join('');
        });
        
        if (stateHTML)
          layerHTML += stateHTML;
          //layerHTML += ['<div class="state ', _.keys(stateActors).join(' '), '">', stateHTML, '</div>'].join('');
      });
      
      if (layerHTML)
        roomHTML += ['<div class="set ', _.keys(layerActors).join(' '), '"><h2>', layer.$.id, '</h2>', layerHTML, '</div>'].join('');
    });
    
    // TREES:
    _.each(data.room.trees[0].tree, function(tree) {
      var treeHTML = '';
      var treeActors = {};
      
      _.each(tree.tier, function(tier) {
        _.each(tier.topic, function(topic) {
          var topicHTML = '';
          var topicActors = {};
          
          _.each(topic.dialog[0].dia, function(dialog) {
            var actor = getActor(dialog.$.puppet);
            
            roomActors[actor] = treeActors[actor] = topicActors[actor] = true;
            if (!cache[actor]) cache[actor] = {};
            
            var subtitle = dialog['en'][0];
            var soundPath = cache[actor][subtitle];
            var duplicate = !!soundPath;

            if (!soundPath) {
              soundPath = cache[actor][subtitle] = ['lib/', scene, '_voice.swf:', scene, '_', ('0000' + nextIndex()).substr(-3)].join('');
            } else {
              dups[scene]++;
            }
            
            topicHTML += renderDialog(subtitle, actor, cache[actor][subtitle], duplicate);
            XML = renderSound(XML, dialog.$.sound, soundPath);
          });
          
          if (topicHTML)
            treeHTML += ['<div class="action ', _.keys(topicActors).join(' '), '"><h3>topic: ', topic.$.id, '</h3>', topicHTML, '</div>'].join('');
        });
      });
      
      if (treeHTML)
        roomHTML += ['<div class="set ', _.keys(treeActors).join(' '), '"><h2>Dialog Tree: ', tree.$.id, '</h2>', treeHTML, '</div>'].join('');
    });
    
    roomHTML = ['<div class="room ', id, '"><h1>', id, '</h1><div class="splash"><img src="assets/', id, '.jpg" alt="', id, '"></div>', roomHTML, '</div>'].join('');
    renderDoc(id, roomHTML, roomActors);
    ACTORS_BY_FILE[id] = roomActors;

    fs.writeFile(OUT_DIR+id+'.xml', XML, onWriteXML);
  }
  
  function onWriteXML(err) {
    if (err) throw err;
    done();
  }
}


function parseGlobal(id, done) {
  var XML = '';
  
  fs.readFile(SRC_DIR+'global.xml', 'utf8', function(err, data) {
    if (err) throw err;
    XML = data;
    parseXML(data, onParse);
  });
  
  function onParse(err, data) {
    if (err) throw err;
    var globalActors = {};
    var cache = {};
    var count = 0;
    var dup = 0;
    var globalHTML = '<h1>global</h1><div class="splash"><img src="assets/global.jpg" alt="global"></div>';
    
    // Parse in voice library reference:
    XML = XML.replace(/voiceLibs=".*?"/g, 'voiceLibs="lib/global_voice.swf"');
    
    // RESPONSES:
    _.each(data.global.responses[0].response, function(response) {
      var responseHTML = '';
      var actor = response.$.id;
      
      if (!cache[actor]) cache[actor] = {};
      globalActors[actor] = true;
      
      _.each(response.action, function(action) {
        var actionHTML = '';
        
        _.each(action.dialog[0].dia, function(dialog) {
          var subtitle = dialog.en[0];
          var soundPath = cache[actor][subtitle];
          var duplicate = !!soundPath;
          
          if (!soundPath) {
            soundPath = cache[actor][subtitle] = ['lib/global_voice.swf:global_', ('0000' + count++).substr(-3)].join('');
          } else {
          	dup++;
          }
          
          actionHTML += renderDialog(subtitle, actor, cache[actor][subtitle], duplicate);
          XML = renderSound(XML, dialog.$.sound, soundPath);
        });
        
        if (actionHTML) 
          responseHTML += ['<div class="action ', actor, '"><h3>', action.title[0].en, '</h3>', actionHTML, '</div>'].join('');
      });
      
      if (responseHTML)
        globalHTML += ['<div class="set ', actor, '"><h2>Default Responses: ', actor, '</h2>', responseHTML, '</div>'].join('');
    });
    
    
    // ITEMS:
    _.each(data.global.items[0].item, function(item) {
      var itemHTML = '';
      var actor = owners[item.$.id] || '???';
      
      if (!cache[actor]) cache[actor] = {};
      globalActors[actor] = true;
       
      _.each(item.action, function(action) {
        var actionHTML = '';
        
        _.each(action.dialog[0].dia, function(dialog) {
          var subtitle = dialog.en[0];
          var soundPath = cache[actor][subtitle];
          var duplicate = !!soundPath;
          
          if (!soundPath) {
            soundPath = cache[actor][subtitle] = ['lib/global_voice.swf:global_', ('0000' + count++).substr(-3)].join(''); 
          } else {
          	dup++;
          }
          
          actionHTML += renderDialog(subtitle, actor, soundPath, duplicate);
          XML = renderSound(XML, dialog.$.sound, soundPath);
        });
        
        if (actionHTML) 
          itemHTML += ['<div class="action ', actor, '"><h3>', action.title[0].en, '</h3>', actionHTML, '</div>'].join('');
      });
      
      if (itemHTML)
        globalHTML += ['<div class="set ', actor, '"><h2>Item: ', item.title[0].en, ' (', item.$.id, ')</h2>', itemHTML, '</div>'].join('');
    });
    
    // COMBOS:
    _.each(data.global.combos[0].combo, function(combo) {
      var comboHTML = '';
      var actor = owners[combo.$.primary];
      
      if (!actor) actor = owners[combo.$.pool.split(',')[0]];
      if (!cache[actor]) cache[actor] = {};
      globalActors[actor] = true;
      
      _.each(combo.action[0].dialog[0].dia, function(dialog) {
        var subtitle = dialog.en[0];
        var soundPath = cache[actor][subtitle];
        var duplicate = !!soundPath;
        
        if (!soundPath) {
          soundPath = cache[actor][subtitle] = ['lib/global_voice.swf:global_', ('0000' + count++).substr(-3)].join('');
        } else {
          dup++;
        }
        
        comboHTML += renderDialog(subtitle, actor, soundPath, duplicate);
        XML = renderSound(XML, dialog.$.sound, soundPath);
      });
      
      if (comboHTML)
        globalHTML += ['<div class="action ', actor, '"><h2>Combo: ', combo.$.primary, ' / ', combo.$.pool, '</h2>', comboHTML, '</div>'].join('');
    });

    dups[id] = dup;
    counts[id] = count;
    ACTORS_BY_FILE[id] = globalActors;
    globalHTML = ['<div class="room ', _.keys(globalActors).join(' '), '">', globalHTML, '</div>'].join('');
    
    renderDoc(id, globalHTML, globalActors);
    fs.writeFile(OUT_DIR+id+'.xml', XML, onWriteXML);
  }

  function onWriteXML(err) {
    if (err) throw err;
    done();
  }
}


function parseNext(files, index, done) {
  if (index < files.length) {
    var id = files[index];
    var parser = (id === 'global') ? parseGlobal : parseRoom;
    parser(id, function() {
      parseNext(files, index+1, done);
    });
  } else {
    done();
  }
}


// Load static data as base CSV, then run parser app:
fs.readFile('./template.html', 'utf8', function(err, data) {
  if (err) throw err;
  TEMPLATE = data;
  
  // Create canonical list of files
  var files = _.keys(scenes).concat(['global']);
  var all = true;
  
  // Defer to any valid process arguments
  if (process.argv.length > 2) {
    files = _.intersection(files, process.argv.slice(2));
    all = false;
  }

  // Use file bundles for aggregate rooms:
  if (files.length === 1 && mappings.bundles[files[0]]) {
    files = mappings.bundles[files[0]];
  }

  // Parse all files in the final list
  parseNext(files, 0, function() {
    console.log('Defined dialog:', DEFINED_DIALOG);
    console.log('Empty dialog:', EMPTY_DIALOG);
    console.log('Duplicate dialog:', DUPLICATE_DIALOG);
    console.log('Total unique dialog:', UNIQUE_DIALOG);
    //console.log('Total actor dialog:', ACTORS);
    //console.log('Total scene dialog:', counts);
    //console.log('Total duplicate dialog:', dups);

    /*
    var actors = _.pairs(ACTORS).sort(function(a, b) {
      return b[1] - a[1];
    });

    console.log(actors.join('\n'));
    */
    
    if (all) {
      var content = '<ul>' + _.reduce(files, function(memo, id) {
        return memo + ['<li class="dialog ', _.keys(ACTORS_BY_FILE[id]).join(' '), '"><a href="', id, '.html">', id, '</a></li>'].join('');
      }, '') + '</ul>';

      renderDoc('index', content, ACTORS);
    }
  });
});