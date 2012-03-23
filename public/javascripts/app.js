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
  "views/collection_view": function(exports, require, module) {
    (function() {
  var BlockView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BlockView = require('views/block_view').BlockView;

  exports.CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      this.addOne = __bind(this.addOne, this);
      CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.id = 'collection';

    CollectionView.prototype.initialize = function() {
      document.title = this.model.get('title');
      return this.template = require("./templates/collection/" + this.options.mode);
    };

    CollectionView.prototype.addAll = function() {
      return this.collection.each(this.addOne);
    };

    CollectionView.prototype.addOne = function(block) {
      var view;
      view = new BlockView({
        model: block,
        collection: this.model.blocks,
        channel: this.model
      });
      return this.$('#blocks').append(view.render().el);
    };

    CollectionView.prototype.render = function() {
      $(this.el).html(this.template({
        channel: this.model.toJSON(),
        blocks: this.collection.toJSON()
      }));
      this.addAll();
      return this;
    };

    return CollectionView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
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

    Blocks.prototype.next = function(model) {
      var i;
      i = this.at(this.indexOf(model));
      if (undefined === i || i < 0) return false;
      return this.at(this.indexOf(model) + 1);
    };

    Blocks.prototype.prev = function(model) {
      var i;
      i = this.at(this.indexOf(model));
      if (undefined === i || i < 1) return false;
      return this.at(this.indexOf(model) - 1);
    };

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
  var Blocks,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Blocks = require('collections/blocks').Blocks;

  exports.Channel = (function(_super) {

    __extends(Channel, _super);

    function Channel() {
      Channel.__super__.constructor.apply(this, arguments);
    }

    Channel.prototype.url = function() {
      return "http://are.na/api/v1/channels/" + (this.get('slug')) + ".json?callback=?";
    };

    Channel.prototype.maybeLoad = function(slug) {
      var _this = this;
      if (slug === this.get('slug')) {
        return true;
      } else {
        this.clear();
        app.loading().start();
        this.set('slug', slug);
        this.set('fetching', true);
        return this.fetch({
          success: function() {
            _this.setupBlocks();
            _this.set('fetching', false);
            app.loading().stop();
            return true;
          },
          error: function(error) {
            return console.log("Error: " + error);
          }
        });
      }
    };

    Channel.prototype.setupBlocks = function() {
      return this.blocks = new Blocks(this.get('blocks'));
    };

    return Channel;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "routers/main_router": function(exports, require, module) {
    (function() {
  var BlockView, Channel, CollectionView, SingleView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Channel = require('models/channel').Channel;

  BlockView = require('views/block_view').BlockView;

  SingleView = require('views/single_view').SingleView;

  CollectionView = require('views/collection_view').CollectionView;

  exports.MainRouter = (function(_super) {

    __extends(MainRouter, _super);

    function MainRouter() {
      MainRouter.__super__.constructor.apply(this, arguments);
    }

    MainRouter.prototype.routes = {
      '': 'collection',
      '/:slug': 'collection',
      '/:slug/mode::mode': 'collection',
      '/:slug/view::id': 'single'
    };

    MainRouter.prototype.initialize = function() {
      return this.channel = new Channel();
    };

    MainRouter.prototype.collection = function(slug, mode) {
      var _this = this;
      if (mode == null) mode = 'grid';
      return $.when(this.channel.maybeLoad(slug)).then(function() {
        _this.collectionView = new CollectionView({
          model: _this.channel,
          collection: _this.channel.blocks,
          mode: mode
        });
        return $('body').attr('class', 'collection').html(_this.collectionView.render().el);
      });
    };

    MainRouter.prototype.single = function(slug, id) {
      var _this = this;
      return $.when(this.channel.maybeLoad(slug)).then(function() {
        _this.singleView = new SingleView({
          model: _this.channel.blocks.get(id),
          collection: _this.channel.blocks,
          channel: _this.channel
        });
        return $('body').attr('class', 'single').html(_this.singleView.render().el);
      });
    };

    return MainRouter;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    (function() {
  var BrunchApplication, MainRouter,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BrunchApplication = require('helpers').BrunchApplication;

  MainRouter = require('routers/main_router').MainRouter;

  exports.Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.initialize = function() {
      this.loading().start();
      return this.router = new MainRouter;
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
  "views/single_view": function(exports, require, module) {
    (function() {
  var BlockView, template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('./templates/single/single');

  BlockView = require('views/block_view').BlockView;

  exports.SingleView = (function(_super) {

    __extends(SingleView, _super);

    function SingleView() {
      SingleView.__super__.constructor.apply(this, arguments);
    }

    SingleView.prototype.id = 'single';

    SingleView.prototype.initialize = function() {
      return document.title = this.model.get('title') ? "" + (this.options.channel.get('title')) + ": " + (this.model.get('title')) : this.options.channel.get('title');
    };

    SingleView.prototype.render = function(id) {
      $(this.el).html(template({
        channel: this.options.channel.toJSON(),
        block: this.model.toJSON(),
        blocks: this.collection.toJSON(),
        next: this.collection.next(this.model),
        prev: this.collection.prev(this.model)
      }));
      return this;
    };

    return SingleView;

  })(BlockView);

}).call(this);

  }
}));
(this.require.define({
  "views/templates/collection/grid": function(exports, require, module) {
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
    
      __out.push('<h1>\n  ');
    
      __out.push(__sanitize(this.channel.title));
    
      __out.push('\n</h1>\n\n<div class="gallery">\n  ');
    
      _ref = this.blocks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        block = _ref[_i];
        __out.push('\n    ');
        if (block.image_thumb) {
          __out.push('\n      <div class="thumb">\n        <div class="image">\n          <a href="/#/');
          __out.push(__sanitize(this.channel.slug));
          __out.push('/view:');
          __out.push(__sanitize(block.id));
          __out.push('">\n            <img src="');
          __out.push(__sanitize(block.image_thumb));
          __out.push('" alt="');
          __out.push(__sanitize(block.title));
          __out.push('" />\n          </a>\n        </div>\n      </div>\n    ');
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
  "views/templates/collection/list": function(exports, require, module) {
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
    
      __out.push('<div id="content">\n  <h1>');
    
      __out.push(__sanitize(this.channel.title));
    
      __out.push('</h1>\n  <div id="blocks"></div>\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/single/single": function(exports, require, module) {
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
    
      if (this.prev || this.next) {
        __out.push('\n  <nav>\n    ');
        if (this.prev) {
          __out.push('\n      <a href="/#/');
          __out.push(__sanitize(this.channel.slug));
          __out.push('/view:');
          __out.push(__sanitize(this.prev.id));
          __out.push('">Previous</a>\n    ');
        }
        __out.push('\n    <a href="/#/');
        __out.push(__sanitize(this.channel.slug));
        __out.push('">Up</a>\n    ');
        if (this.next) {
          __out.push('\n      <a href="/#/');
          __out.push(__sanitize(this.channel.slug));
          __out.push('/view:');
          __out.push(__sanitize(this.next.id));
          __out.push('">Next</a>\n    ');
        }
        __out.push('\n  </nav>\n');
      }
    
      __out.push('\n\n<div id="block_');
    
      __out.push(__sanitize(this.block.id));
    
      __out.push('" class="block full ');
    
      __out.push(__sanitize(this.block.block_type.toLowerCase()));
    
      __out.push('" data-type="');
    
      __out.push(__sanitize(this.block.block_type));
    
      __out.push('">\n\n  <!-- TYPE-SPECIFIC OUTPUT: -->\n  ');
    
      if (this.block.block_type === 'Media') {
        __out.push('\n    <!-- MEDIA -->\n    <div class="embed">\n      ');
        if (this.block.embed_html) {
          __out.push('\n        ');
          __out.push(this.block.embed_html);
          __out.push('\n      ');
        } else {
          __out.push('\n        <a href="');
          __out.push(__sanitize(this.block.embed_source_url));
          __out.push('" class="url external">\n          ');
          __out.push(__sanitize(this.block.embed_source_url));
          __out.push('\n        </a>\n      ');
        }
        __out.push('\n    </div>\n  ');
      } else if (this.block.block_type === 'Image') {
        __out.push('\n    <!-- IMAGE -->\n    <a href="');
        __out.push(__sanitize(this.block.image_original));
        __out.push('">\n      <img src="');
        __out.push(__sanitize(this.block.image_display));
        __out.push('" alt="');
        __out.push(__sanitize(this.block.title));
        __out.push('" />\n    </a>\n  ');
      } else if (this.block.block_type === 'Link') {
        __out.push('\n    <!-- LINK -->\n    ');
        if (this.block.image_display) {
          __out.push('\n      <a href="');
          __out.push(__sanitize(this.block.link_url));
          __out.push('" class="external" target="_blank">\n        <img src="');
          __out.push(__sanitize(this.block.image_display));
          __out.push('" alt="');
          __out.push(__sanitize(this.block.title));
          __out.push('" />\n      </a>\n    ');
        } else {
          __out.push('\n      <p>\n        <a href="');
          __out.push(__sanitize(this.block.link_url));
          __out.push('" class="external url" target="_blank">');
          __out.push(__sanitize(this.block.link_url));
          __out.push('</a>\n      </p>\n    ');
        }
        __out.push('\n  ');
      } else if (this.block.block_type === 'Text') {
        __out.push('\n    <!-- TEXT -->\n    <div class="content">\n      ');
        __out.push(this.block.content);
        __out.push('\n    </div>\n  ');
      }
    
      __out.push('\n\n  <!-- UNIVERSAL OUTPUT: -->\n  <div class="metadata">\n    <h3 class="title">\n      <a href="/#/');
    
      __out.push(__sanitize(this.channel.slug));
    
      __out.push('/view:');
    
      __out.push(__sanitize(this.block.id));
    
      __out.push('">\n      ');
    
      if (this.block.title) {
        __out.push('\n        ');
        __out.push(__sanitize(this.block.title));
        __out.push('\n      ');
      } else {
        __out.push('\n        Untitled\n      ');
      }
    
      __out.push('\n      </a>\n    </h3>\n\n    ');
    
      if (!(this.block.block_type === 'Text' || !this.block.content)) {
        __out.push('\n      <div class="description">\n        <div class="content">\n          ');
        __out.push(this.block.content);
        __out.push('\n        </div>\n      </div>\n    ');
      }
    
      __out.push('\n  </div>\n  \n</div><!-- #block -->');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/block_view": function(exports, require, module) {
    (function() {
  var template,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  template = require('./templates/single/single');

  exports.BlockView = (function(_super) {

    __extends(BlockView, _super);

    function BlockView() {
      BlockView.__super__.constructor.apply(this, arguments);
    }

    BlockView.prototype.render = function(id) {
      $(this.el).html(template({
        channel: this.options.channel.toJSON(),
        block: this.model.toJSON()
      }));
      return this;
    };

    return BlockView;

  })(Backbone.View);

}).call(this);

  }
}));
