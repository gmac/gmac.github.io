var $cast = $('#cast').change(updateView);
var $rooms = $('.room');
var $sets = $('.set');
var $actions = $('.action');
var $lines = $('.dialog');

function updateView() {
  var cast = $cast.val();
  var $body = $('body').hide();
  $rooms.hide();
  $sets.hide();
  
  if (cast) {
    $lines.removeClass('active').filter('.'+cast).addClass('active');
    $actions.hide().filter('.'+ cast).show().closest('.set').show().closest('.room').show();
  } else {
    $lines.removeClass('active');
    $actions.show();
    $sets.show();
    $rooms.show();
  }
  
  $('#queue-title').text(cast);
  location.hash = '/'+[cast].join('/');
  localStorage.setItem('stitch-cast', cast);
  $body.show();
}

// Set initial hash selection...
//var params = location.hash.match(/^#\/(.*?)\/*$/);
var selection = localStorage.getItem('stitch-cast');
if (selection && $cast.find('option[value="'+selection+'"]').length) {
  $cast.val(selection);
  updateView();
}