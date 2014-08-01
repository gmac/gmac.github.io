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
  $body.show();
}

var params = location.hash.match(/^#\/(.*?)\/*$/);
if (params) {
  $cast.val(params[1]);
  updateView();
}