var fs = require('fs');
var _ = require('underscore');
var xml2js = require('xml2js');
var parseXML = xml2js.parseString;
var mappings = require('./mapping.js');

var SRC_DIR = './xml/';
var OUT_DIR = './xml-ru-src/'
var RU_DIR = './xml-ru/';


function parseFile(id, done) {
  var XML = '';
  console.log(id);

  // Load source file:
  fs.readFile(SRC_DIR+id+'.xml', 'utf8', function(err, data) {
    if (err) throw err;
    XML = data;

    // Load Russian file:
    fs.readFile(RU_DIR+id+'.xml', 'utf8', function(err, data) {
      if (err) throw err;
      parseXML(data, onParse);
    });
  });

  // Parse Russian into source:
  function onParse(err, data) {
    if (err) throw err;
    data = data.localize;
    var errors = {};
    var complete = {};

    // Match noun strings:
    _.each(data.n[0], function(noun, key) {
      noun = noun[0];
      if (!complete[noun.en]) {
        if (XML.indexOf('<en><![CDATA['+noun.en+']]></en>') > -1) {
          //XML = XML.replace(new RegExp('(<en><!\\[CDATA\\['+noun.en+'[^~]+?)( +)(<de>.+?<\\/de>)', 'g'), '$1$2$3\n$2<ru><![CDATA['+noun.ru+']]></ru>');
          complete[noun.en] = true;
        } else {
          errors['NOUN '+ noun.en] = true;
        }
      }
    });

    // Match dialog lines:
    _.each(data.d[0], function(dia, key) {
      dia = dia[0];
      var sound = dia.$.sound.split('.')[0];
      XML = XML.replace(new RegExp('(swf:'+sound+'[^~]+?)( +)(<de>.+?<\\/de>)'), '$1$2$3\n$2<ru><![CDATA['+dia.ru+']]></ru>');
    });

    // Back-fill all tree topic subjects with first line of Russian dialog.
    XML = XML.replace(/(<topic[^~]+?)( +)(<de>.*?<\/de>)([^~]+?)(<ru>.*?<\/ru>)/g, '$1$2$3\n$2$5$4$5');

    // Print out any matching errors:
    if (_.size(errors)) console.log(errors);

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
    parseFile(id, function() {
      parseNext(files, index+1, done);
    });
  } else {
    done();
  }
}


// Parse all files in the final list
parseNext(['antique'], 0, function() {

});