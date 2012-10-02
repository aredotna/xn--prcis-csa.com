(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"collections/blocks": function(exports, require, module) {
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

      Blocks.prototype.comparator = function(model) {
        return model.get('position');
      };

      Blocks.prototype.next = function(model) {
        return this.at((this.indexOf(model) + 1) % _.size(this.models));
      };

      Blocks.prototype.prev = function(model) {
        var index;
        index = this.indexOf(model) - 1;
        return this.at(index > -1 ? index : _.size(this.models) - 1);
      };

      return Blocks;

    })(Backbone.Collection);

  }).call(this);
  
}});

window.require.define({"helpers": function(exports, require, module) {
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

      BrunchApplication.prototype.loading = function() {
        return {
          start: function() {
            return $('body').html('').removeClass('error').addClass('loading');
          },
          stop: function() {
            return $('body').removeClass('error').removeClass('loading');
          },
          error: function() {
            return $('body').removeClass('loading').addClass('error');
          }
        };
      };

      return BrunchApplication;

    })();

  }).call(this);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  (function() {
    var BrunchApplication, MainRouter, Shortcuts,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    BrunchApplication = require('helpers').BrunchApplication;

    MainRouter = require('routers/main_router').MainRouter;

    Shortcuts = require('views/shortcuts').Shortcuts;

    exports.Application = (function(_super) {

      __extends(Application, _super);

      function Application() {
        Application.__super__.constructor.apply(this, arguments);
      }

      Application.prototype.initialize = function() {
        this.loading().start();
        this.router = new MainRouter;
        return this.shortcuts = new Shortcuts;
      };

      return Application;

    })(BrunchApplication);

    window.app = new exports.Application;

  }).call(this);
  
}});

window.require.define({"models/block": function(exports, require, module) {
  (function() {
    var __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.Block = (function(_super) {

      __extends(Block, _super);

      function Block() {
        Block.__super__.constructor.apply(this, arguments);
      }

      Block.prototype.initialize = function() {
        return this.checkIfMissingImage();
      };

      Block.prototype.checkIfMissingImage = function() {
        var missing;
        missing = '/assets/interface/missing.png';
        if (this.get('image_thumb') === missing) {
          return this.set('image_thumb', null);
        }
      };

      Block.prototype.next = function() {
        return this.collection.next(this);
      };

      Block.prototype.prev = function() {
        return this.collection.prev(this);
      };

      return Block;

    })(Backbone.Model);

  }).call(this);
  
}});

window.require.define({"models/channel": function(exports, require, module) {
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
        return "http://api.are.na/v2/channels/" + (this.get('slug'));
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
            error: function() {
              return app.loading().error();
            }
          });
        }
      };

      Channel.prototype.setupBlocks = function() {
        return this.blocks = new Blocks(this.get('contents'));
      };

      return Channel;

    })(Backbone.Model);

  }).call(this);
  
}});

window.require.define({"routers/main_router": function(exports, require, module) {
  (function() {
    var BlockView, Channel, CollectionView, IndexView, SingleView,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    IndexView = require('views/index_view').IndexView;

    BlockView = require('views/block_view').BlockView;

    SingleView = require('views/single_view').SingleView;

    CollectionView = require('views/collection_view').CollectionView;

    Channel = require('models/channel').Channel;

    exports.MainRouter = (function(_super) {

      __extends(MainRouter, _super);

      function MainRouter() {
        MainRouter.__super__.constructor.apply(this, arguments);
      }

      MainRouter.prototype.routes = {
        '': 'index',
        '/:slug': 'collection',
        '/:slug/overview': 'overview',
        '/:slug/show::id': 'single'
      };

      MainRouter.prototype.initialize = function() {
        return this.channel = new Channel();
      };

      MainRouter.prototype.index = function() {
        this.indexView = new IndexView();
        $('body').html(this.indexView.render().el);
        return app.loading().stop();
      };

      MainRouter.prototype.collection = function(slug) {
        var _this = this;
        return $.when(this.channel.maybeLoad(slug)).then(function() {
          return _this.navigate("//" + slug + "/show:" + (_this.channel.blocks.at(0).id), {
            trigger: true
          });
        });
      };

      MainRouter.prototype.overview = function(slug) {
        var _this = this;
        return $.when(this.channel.maybeLoad(slug)).then(function() {
          app.currentChannel = _this.channel;
          app.currentCollection = _this.channel.blocks;
          _this.collectionView = new CollectionView({
            model: _this.channel,
            collection: _this.channel.blocks,
            mode: 'grid'
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
  
}});

window.require.define({"views/block_view": function(exports, require, module) {
  (function() {
    var __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.BlockView = (function(_super) {

      __extends(BlockView, _super);

      function BlockView() {
        BlockView.__super__.constructor.apply(this, arguments);
      }

      BlockView.prototype.className = 'block';

      BlockView.prototype.initialize = function() {
        return this.template = require("./templates/single/" + this.options.mode);
      };

      BlockView.prototype.render = function() {
        this.$el.html(this.template({
          mode: this.options.mode,
          channel: this.options.channel.toJSON(),
          block: this.model.toJSON()
        }));
        return this;
      };

      return BlockView;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/collection_view": function(exports, require, module) {
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
          mode: this.options.mode,
          model: block,
          collection: this.model.blocks,
          channel: this.model
        });
        return this.$('#blocks').append(view.render().el);
      };

      CollectionView.prototype.render = function() {
        this.$el.html(this.template({
          channel: this.model.toJSON(),
          blocks: this.collection.toJSON()
        }));
        this.addAll();
        return this;
      };

      return CollectionView;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/index_view": function(exports, require, module) {
  (function() {
    var template,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('./templates/index');

    exports.IndexView = (function(_super) {

      __extends(IndexView, _super);

      function IndexView() {
        IndexView.__super__.constructor.apply(this, arguments);
      }

      IndexView.prototype.id = 'index';

      IndexView.prototype.className = 'home';

      IndexView.prototype.events = {
        'submit #channel': 'go'
      };

      IndexView.prototype.initialize = function() {
        return document.title = 'Précis';
      };

      IndexView.prototype.to_slug = function(str) {
        var from, i, to, _ref;
        str = str.replace(/^\s+|\s+$/g, "").toLowerCase();
        from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        to = "aaaaeeeeiiiioooouuuunc------";
        for (i = i, _ref = from.length; i <= _ref ? i <= _ref : i >= _ref; i <= _ref ? i++ : i--) {
          str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
        }
        str = str.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
        return str;
      };

      IndexView.prototype.go = function(e) {
        var slug;
        e.preventDefault();
        slug = this.$('#channel_slug').val();
        return app.router.navigate("//" + (this.to_slug(slug)) + "/overview", {
          trigger: true
        });
      };

      IndexView.prototype.render = function() {
        this.$el.html(template);
        return this;
      };

      return IndexView;

    })(Backbone.View);

  }).call(this);
  
}});

window.require.define({"views/shortcuts": function(exports, require, module) {
  (function() {
    var __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.Shortcuts = (function(_super) {

      __extends(Shortcuts, _super);

      function Shortcuts() {
        Shortcuts.__super__.constructor.apply(this, arguments);
      }

      Shortcuts.prototype.shortcuts = {
        'left': 'prev',
        'right': 'next',
        'up': 'up'
      };

      Shortcuts.prototype.next = function() {
        var _next;
        _next = app.currentCollection.next(app.currentBlock);
        return window.location.hash = "#/" + (app.currentChannel.get('slug')) + "/show:" + _next.id;
      };

      Shortcuts.prototype.prev = function() {
        var _prev;
        _prev = app.currentCollection.prev(app.currentBlock);
        return window.location.hash = "#/" + (app.currentChannel.get('slug')) + "/show:" + _prev.id;
      };

      Shortcuts.prototype.up = function() {
        return window.location.hash = "#/" + (app.currentChannel.get('slug')) + "/overview";
      };

      return Shortcuts;

    })(Backbone.Shortcuts);

  }).call(this);
  
}});

window.require.define({"views/single_view": function(exports, require, module) {
  (function() {
    var BlockView, template,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    template = require('./templates/single/list');

    BlockView = require('views/block_view').BlockView;

    exports.SingleView = (function(_super) {

      __extends(SingleView, _super);

      function SingleView() {
        SingleView.__super__.constructor.apply(this, arguments);
      }

      SingleView.prototype.id = 'single';

      SingleView.prototype.className = 'block';

      SingleView.prototype.initialize = function() {
        this.channel = this.options.channel;
        app.currentChannel = this.channel;
        app.currentBlock = this.model;
        app.currentCollection = this.collection;
        return document.title = this.model.get('title') ? "" + (this.channel.get('title')) + ": " + (this.model.get('title')) : this.channel.get('title');
      };

      SingleView.prototype.render = function(id) {
        var _this = this;
        this.$el.html(template({
          channel: this.channel.toJSON(),
          block: this.model.toJSON(),
          blocks: this.collection.toJSON(),
          next: this.collection.next(this.model),
          prev: this.collection.prev(this.model)
        }));
        this.$el.waitForImages(function() {
          _this.$('.slide').removeClass('loading');
          return _this.$('.slide').addClass('done');
        });
        return this;
      };

      return SingleView;

    })(BlockView);

  }).call(this);
  
}});

window.require.define({"views/templates/collection/grid": function(exports, require, module) {
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
      
        __out.push('<div class="area">\n  <header class="information">\n    <section class="title">\n      <a class=\'btn\' href="/#/');
      
        __out.push(__sanitize(this.channel.slug));
      
        __out.push('">');
      
        __out.push(__sanitize(this.channel.title));
      
        __out.push('</a>\n    </section>\n  </header>\n</div>\n\n<div id="blocks" class="grid"></div>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/templates/collection/list": function(exports, require, module) {
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
      
        __out.push('<h1>');
      
        __out.push(__sanitize(this.channel.title));
      
        __out.push('</h1>\n\n<div id="blocks" class="list"></div>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/templates/collection/slideshow": function(exports, require, module) {
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
      
        __out.push('<h1>');
      
        __out.push(__sanitize(this.channel.title));
      
        __out.push('</h1>\n\n<div id="blocks" class="slideshow"></div>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/templates/index": function(exports, require, module) {
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
      
        __out.push('<div class="slide">\n  <div class="wrap">\n    <form id="channel" class="middle">\n      <span id="url_base">http://are.na/</span>\n      <input id="channel_slug" tabindex="0" type="text" placeholder="channel-title" />\n    </form>\n  </div>\n</div>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/templates/single/grid": function(exports, require, module) {
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
      
        if (this.block.base_class === 'Block') {
          __out.push('\n  ');
          if (this.block.image) {
            __out.push('\n    <a href="/#/');
            __out.push(__sanitize(this.channel.slug));
            __out.push('/show:');
            __out.push(__sanitize(this.block.id));
            __out.push('">\n      <!-- <span class="thumb" style="background-image:url(');
            __out.push(__sanitize(this.block.image.thumb.url));
            __out.push(')"></span> -->\n      <img src="');
            __out.push(__sanitize(this.block.image.thumb.url));
            __out.push('" alt="');
            __out.push(__sanitize(this.block.id));
            __out.push('" />\n    </a>\n  ');
          } else if (this.block.title) {
            __out.push('\n    <a href="/#/');
            __out.push(__sanitize(this.channel.slug));
            __out.push('/show:');
            __out.push(__sanitize(this.block.id));
            __out.push('" class="text">\n      ');
            __out.push(__sanitize(_.str.prune(this.block.title, 20)));
            __out.push('\n    </a>\n  ');
          } else {
            __out.push('\n    <a href="/#/');
            __out.push(__sanitize(this.channel.slug));
            __out.push('/show:');
            __out.push(__sanitize(this.block.id));
            __out.push('" class="text">\n      Untitled\n    </a>\n  ');
          }
          __out.push('\n');
        }
      
        __out.push('\n\n');
      
        if (this.block["class"] === 'Channel' && this.block.published) {
          __out.push('\n  <a href="/#/');
          __out.push(__sanitize(this.block.slug));
          __out.push('/overview" class="channel">\n    ');
          __out.push(__sanitize(_.str.prune(this.block.title, 20)));
          __out.push('\n  </a>\n');
        }
      
        __out.push('\n\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/templates/single/list": function(exports, require, module) {
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
      
        __out.push('<section class="area">\n  ');
      
        if (this.prev || this.next) {
          __out.push('\n    <nav class=\'pagination\'>\n      ');
          if (this.prev) {
            __out.push('\n        <a class=\'prev btn\' href="/#/');
            __out.push(__sanitize(this.channel.slug));
            __out.push('/show:');
            __out.push(__sanitize(this.prev.id));
            __out.push('">Previous</a>\n      ');
          }
          __out.push('\n\n      <a class=\'btn\' href="/#/');
          __out.push(__sanitize(this.channel.slug));
          __out.push('/overview">Up</a>\n\n      ');
          if (this.next) {
            __out.push('\n        <a class=\'next btn\' href="/#/');
            __out.push(__sanitize(this.channel.slug));
            __out.push('/show:');
            __out.push(__sanitize(this.next.id));
            __out.push('">Next</a>\n      ');
          }
          __out.push('\n    </nav>\n  ');
        }
      
        __out.push('\n\n  <header class="information">\n    <section class="title">\n      ');
      
        if (this.block.title) {
          __out.push('\n        <a class=\'btn\' href="/#/');
          __out.push(__sanitize(this.channel.slug));
          __out.push('/show:');
          __out.push(__sanitize(this.block.id));
          __out.push('">');
          __out.push(__sanitize(_.str.prune(this.block.title, 50)));
          __out.push('</a>\n      ');
        } else {
          __out.push('\n        <a class=\'btn\' href="/#/');
          __out.push(__sanitize(this.channel.slug));
          __out.push('/show:');
          __out.push(__sanitize(this.block.id));
          __out.push('">¶</a>\n      ');
        }
      
        __out.push('\n    </section>\n\n    ');
      
        if (this.block.description || this.block.source_url) {
          __out.push('\n      <section class="metadata">\n        ');
          if (this.block.description) {
            __out.push('\n          <div class="description">\n            ');
            __out.push(this.block.description_html);
            __out.push('\n          </div>\n        ');
          }
          __out.push('\n\n        ');
          if (this.block.source_url) {
            __out.push('\n          <div class="source-url">\n            <strong>Source:</strong>\n            <a href="');
            __out.push(this.block.source_url);
            __out.push('" target="_blank">\n              ');
            __out.push(_.str.prune(this.block.source_url, 50));
            __out.push('\n            </a>\n          </div>\n        ');
          }
          __out.push('\n      </section>\n    ');
        }
      
        __out.push('\n  </header>\n</section>\n\n<div id="block_');
      
        __out.push(__sanitize(this.block.id));
      
        __out.push('" class="full ');
      
        __out.push(__sanitize(this.block["class"].toLowerCase()));
      
        __out.push('" data-type="');
      
        __out.push(__sanitize(this.block["class"]));
      
        __out.push('">\n  ');
      
        if (this.block["class"] === 'Media') {
          __out.push('\n    <div class="embed occupy">\n      ');
          __out.push(this.block.embed_html);
          __out.push('\n    </div>\n\n  ');
        } else if (this.block["class"] === 'Link') {
          __out.push('\n    <div class="link occupy">\n      <iframe src="');
          __out.push(__sanitize(this.block.source_url));
          __out.push('" width="100%" height="100%" />\n    </div>\n\n  ');
        } else if (this.block["class"] === 'Image') {
          __out.push('\n    <div class="image loading slide">\n      <div class="wrap">\n        <a href="');
          __out.push(__sanitize(this.block.image.original.url));
          __out.push('" class="middle" target="_blank">\n          <img src="');
          __out.push(__sanitize(this.block.image.display.url));
          __out.push('" alt="');
          __out.push(__sanitize(this.block.title));
          __out.push('" />\n        </a>\n      </div>\n    </div>\n\n  ');
        } else if (this.block["class"] === 'Text') {
          __out.push('\n    <div class="text slide">\n      <div class="wrap">\n        <div class="middle">\n          <div class="content">');
          __out.push(this.block.content_html);
          __out.push('</div>\n        </div>\n      </div>\n    </div>\n  ');
        }
      
        __out.push('\n</div>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

