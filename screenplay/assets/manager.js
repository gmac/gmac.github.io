// Recording model:
var Recording = Backbone.Model.extend({
  defaults: {
    'actor': '',
    'cast_id': '',
    'completed': 0,
    'total': 0
  },

  setCompleted: function(count) {
    count = parseInt(count, 10);
    count = isNaN(count) ? 0 : count;
    count = Math.max(0, Math.min(count, this.get('total')));
    this.save({completed: count});
    return count;
  }
});

// Recordings collection:
var Recordings = Backbone.Collection.extend({
  url: '/recordings',
  comparator: 'cast_id',
  model: Recording,
  
  //localStorage: new Backbone.LocalStorage('stitch'),

  setComparator: function(field) {
    var compare;

    if (field === 'total' || field === 'completed') {
      compare = function(a, b) { return b.get(field) - a.get(field); };
    } else {
      compare = function(a, b) {
        if (!a.get(field) && b.get(field)) {
          return 1;
        } else if (a.get(field) && !b.get(field)) {
          return -1;
        }
        return a.get(field).localeCompare(b.get(field));
      };
    }

    this.comparator = compare;
    this.sort();
  },

  updateRecord: function(data) {
    var model = this.findWhere({cast_id: data.cast_id});
    if (model.get('total') !== data.count) {
      model.save({total: data.count});
    }
  }
});

// Recordings view:
var RecordingsView = Backbone.View.extend({
  el: '#actors',
  template: _.template($('#actor-tmpl').html()),

  initialize: function() {
    this.listenTo(this.collection, 'reset sort', this.render);
    this.listenTo(this.collection, 'change:completed', this.tally);
    this.render();
  },

  render: function() {
    var list = this.collection.reduce(function(memo, model, index) {
      var data = model.toJSON();
      data.index = index + 1;
      return memo += this.template(data);
    }, '', this);

    this.$('tbody').html(list);
    this.tally();
  },

  tally: function() {
    var total = 0;
    var completed = 0;

    this.collection.each(function(model) {
      total += model.get('total');
      completed += model.get('completed');
    }, this);

    this.$('#grand-total').html(total.toLocaleString());
    this.$('#completed-total').html(completed.toLocaleString());
    this.$('#completed-percent').html(Math.round(completed / total * 100) + '%');
  },

  events: {
    'change input.completed': 'onCompleted',
    'change input.actor': 'onActor',
    'click [data-sort]': 'onSort'
  },

  onCompleted: function(evt) {
    var $field = this.$(evt.target);
    var castId = $field.closest('tr').data('id');
    var model = this.collection.findWhere({cast_id: castId});
    $field.val(model.setCompleted($field.val()));
  },

  onActor: function(evt) {
    var $field = this.$(evt.target);
    var castId = $field.closest('tr').data('id');
    var model = this.collection.findWhere({cast_id: castId});
    model.save({actor: $field.val()});
  },

  onSort: function(evt) {
    var field = this.$(evt.target).data('sort');
    this.collection.setComparator(field);
  }
});

var recordings = new Recordings();

if (location.href.indexOf('localhost') < 0) {
  recordings.localStorage = new Backbone.LocalStorage('stitch');
  recordings.url = '';
}

recordings.fetch({reset: true}).then(function() {
  _.each(cast_data, function(data) {
    recordings.updateRecord(data);
  });

  var recordingsView = new RecordingsView({collection: recordings});
});