(function(/*! Brunch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var module = cache[name], path = expand(root, name), fn;
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: name, exports: {}};
        try {
          cache[name] = module.exports;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return cache[name] = module.exports;
        } catch (err) {
          delete cache[name];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    };
    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
}).call(this);(this.require.define({
  "helpers": function(exports, require, module) {
    (function() {

  exports.BrunchApplication = (function() {

    function BrunchApplication() {
      var _this = this;
      $(function() {
        _this.initialize(_this);
        return Backbone.history.start();
      });
    }

    BrunchApplication.prototype.initialize = function() {
      return null;
    };

    return BrunchApplication;

  })();

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var Blocks, BrunchApplication, Channel, CollectionView, MainRouter,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BrunchApplication = require('helpers').BrunchApplication;

  MainRouter = require('routers/main_router').MainRouter;

  CollectionView = require('views/collection_view').CollectionView;

  Channel = require('models/channel').Channel;

  Blocks = require('collections/blocks').Blocks;

  exports.Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.initialize = function() {
      var source,
        _this = this;
      source = $.getParam('source');
      if (source == null) source = 'frequently-asked-questions-faqs';
      this.loading().start();
      return $.getJSON("http://are.na/api/v1/channels/" + source + ".json?callback=?", function(data) {
        _this.channel = new Channel(data);
        _this.blocks = new Blocks(_this.channel.get('blocks'));
        _this.collectionView = new CollectionView({
          model: _this.channel,
          collection: _this.blocks
        });
        _this.router = new MainRouter;
        Backbone.history.start();
        return _this.loading().stop();
      });
    };

    Application.prototype.loading = function() {
      return {
        start: function() {
          return $('body').addClass('loading');
        },
        stop: function() {
          return $('body').removeClass('loading');
        }
      };
    };

    return Application;

  })(BrunchApplication);

  window.app = new exports.Application;

}).call(this);

  }
}));
(this.require.define({
  "collections/blocks": function(exports, require, module) {
    (function() {
  var Block,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Block = require("models/block").Block;

  exports.Blocks = (function(_super) {

    __extends(Blocks, _super);

    function Blocks() {
      Blocks.__super__.constructor.apply(this, arguments);
    }

    Blocks.prototype.model = Block;

    return Blocks;

  })(Backbone.Collection);

}).call(this);

  }
}));
(this.require.define({
  "models/block": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.Block = (function(_super) {

    __extends(Block, _super);

    function Block() {
      Block.__super__.constructor.apply(this, arguments);
    }

    return Block;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "models/channel": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.Channel = (function(_super) {

    __extends(Channel, _super);

    function Channel() {
      Channel.__super__.constructor.apply(this, arguments);
    }

    return Channel;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "routers/main_router": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.MainRouter = (function(_super) {

    __extends(MainRouter, _super);

    function MainRouter() {
      MainRouter.__super__.constructor.apply(this, arguments);
    }

    MainRouter.prototype.routes = {
      '': 'collection',
      'view/:id': 'single'
    };

    MainRouter.prototype.collection = function() {
      return $('body').html(app.collectionView.render().el);
    };

    MainRouter.prototype.single = function() {
      return $('body').html(app.singleView.render().el);
    };

    return MainRouter;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "views/collection_view": function(exports, require, module) {
    (function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  exports.CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.id = 'collection';

    CollectionView.prototype.initialize = function() {
      var format;
      document.title = this.model.get('title');
      format = $.getParam('format');
      if (format == null) format = 'list';
      return this.template = require("./templates/" + format);
    };

    CollectionView.prototype.render = function() {
      $(this.el).html(this.template({
        channel: this.model.toJSON(),
        blocks: this.collection.toJSON()
      }));
      return this;
    };

    return CollectionView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/templates/grid": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var block, _i, _len, _ref;
    
      __out.push('<div id="content">\n  <h1>');
    
      __out.push(__sanitize(this.channel.title));
    
      __out.push('</h1>\n  ');
    
      _ref = this.blocks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        block = _ref[_i];
        __out.push('\n    ');
        if (block.image_thumb) {
          __out.push('\n      <div class="thumb">\n        <div class="image">\n          <img src="');
          __out.push(__sanitize(block.image_thumb));
          __out.push('" alt="');
          __out.push(__sanitize(block.title));
          __out.push('" />\n        </div>\n      </div>\n    ');
        }
        __out.push('\n  ');
      }
    
      __out.push('\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/list": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var block, _i, _len, _ref;
    
      __out.push('<div id="content">\n  <h1>');
    
      __out.push(__sanitize(this.channel.title));
    
      __out.push('</h1>\n\n  ');
    
      _ref = this.blocks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        block = _ref[_i];
        __out.push('\n    <hr />\n\n    ');
        if (block.block_type === 'Image') {
          __out.push('\n      <h3>');
          __out.push(__sanitize(block.title));
          __out.push('</h3>\n      <img src="');
          __out.push(__sanitize(block.image_display));
          __out.push('" alt="');
          __out.push(__sanitize(block.title));
          __out.push('" />\n      <div class="content">\n        ');
          __out.push(block.content);
          __out.push('\n      </div>\n    ');
        }
        __out.push('\n    \n    ');
        if (block.block_type === 'Text') {
          __out.push('\n      <h3>');
          __out.push(__sanitize(block.title));
          __out.push('</h3>\n      <div class="content">\n        ');
          __out.push(block.content);
          __out.push('\n      </div>\n    ');
        }
        __out.push('\n\n    ');
        if (block.block_type === 'Media') {
          __out.push('\n      <h3>');
          __out.push(__sanitize(block.title));
          __out.push('</h3>\n      <div class="embed">\n        ');
          __out.push(block.embed_html);
          __out.push('\n      </div>\n      <div class="content">\n        ');
          __out.push(block.content);
          __out.push('\n      </div>\n    ');
        }
        __out.push('\n\n    ');
        if (block.block_type === 'Link') {
          __out.push('\n      <h3>');
          __out.push(__sanitize(block.title));
          __out.push('</h3>\n      <img src="');
          __out.push(__sanitize(block.image_display));
          __out.push('" alt="');
          __out.push(__sanitize(block.title));
          __out.push('" />\n      <div class="content">\n        ');
          __out.push(block.content);
          __out.push('\n      </div>\n    ');
        }
        __out.push('\n\n  ');
      }
    
      __out.push('\n\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/loading": function(exports, require, module) {
    module.exports = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
    
      __out.push('<div id="spinContainer"></div>\nLoading');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
