var fs = require('fs');
var _ = require('underscore');
var xml2js = require('xml2js');
var parseXML = xml2js.parseString;
var mappings = require('./mapping.js');

var RU_DIR = './xml-ru/';
var RU_ENABLED = false;

function RussianParser(id) {
  this.id = id;
  this.nouns = {};
  this.actions = {};
  this.dialog = {};
  this.errors = {};
  this.cache = {};
  this.diaCache = {};
  this.enabled = RU_ENABLED;
}

RussianParser.prototype = {
  load: function(callback) {
    if (!this.enabled) return callback();

    var self = this;

    // Load Russian file:
    fs.readFile(RU_DIR+this.id+'.xml', 'utf8', function(err, data) {
      if (err) throw err;
      parseXML(data, onParse);
    });

    function onParse(err, data) {
      if (err) throw err;
      data = data.localize;

      // Register all nouns:
      _.each(data.n[0], function(noun) {
        self.nouns[noun[0].en] = noun[0].ru;
      });

      // Register all verb action titles:
      _.each(data.v[0], function(verb) {
        self.actions[verb[0].en] = verb[0].ru;
      });

      // Register all context action titles:
      _.each(data.c[0], function(context) {
        self.actions[context[0].en] = context[0].ru;
      });

      // Register all dialog:
      _.each(data.d[0], function(dia) {
        self.dialog[dia[0].$.sound.split('.')[0]] = dia[0].ru;
      });

      callback();
    }
  },

  map: function(en, ru) {
    if (!this.cache[en]) this.cache[en] = ru;
    else if (this.cache[en] !== ru) this.errors['MAPPING: '+en] = 1;
    return this.cache[en];
  },

  parseNoun: function(layerId, stateId, title, XML) {
    if (this.enabled) {
      if (this.nouns[title]) {
        XML = XML.replace(new RegExp('(<layer id="'+layerId+'".+?<state id="'+stateId+'".+?<en><!\\[CDATA\\['+title+'\\]\\].+?<\\/de>)'), '$1<ru><![CDATA['+this.map(title, this.nouns[title])+']]></ru>');
      } else {
        this.errors['NOUN: '+title] = 1;
      }
    }
    return XML;
  },

  parseAction: function(layerId, stateId, title, XML) {
    if (this.enabled) {
      if (this.actions[title]) {
        XML = XML.replace(new RegExp('(<layer id="'+layerId+'".+?<state id="'+stateId+'".+?<en><!\\[CDATA\\['+title+'\\]\\].+?<\\/de>)(?!<ru)'), '$1<ru><![CDATA['+this.map(title, this.actions[title])+']]></ru>');
      } else {
        this.errors['ACTION: '+title] = 1;
      }
    }
    return XML;
  },

  renderDialog: function(XML, soundRef, soundId) {
    soundRef = soundRef.split(':').pop();
    if (this.enabled) {
      if (!this.dialog[soundRef]) {
        // NO Russian dialog: report error.
        this.errors['DIALOG: '+soundRef] = 1;
      } else if (!this.diaCache[soundId]) {
        // Otherwise, store reported dialog to this sound ID for future use:
        this.diaCache[soundId] = this.dialog[soundRef];
      }
      // Add in Russian dialog for this sound reference:
      XML = XML.replace(new RegExp('(swf:'+soundRef+'.+?<\\/de>)'), '$1<ru><![CDATA['+this.diaCache[soundId]+']]></ru>');
    }
    return XML;
  },

  parseTreeTopics: function(XML) {
    if (this.enabled) {
      // Back-fill all tree topic subjects with first line of Russian dialog.
      XML = XML.replace(/(<topic.+?<\/de>)(.+?)(<ru>.*?<\/ru>)/g, '$1$3$2$3');
    }
    return XML;
  },

  report: function() {
    if (this.enabled && _.size(this.errors)) {
      console.log(this.errors);
    }
  }
};

module.exports = RussianParser;