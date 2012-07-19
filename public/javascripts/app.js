(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return hasOwnProperty.call(object, name);
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
      return require(absolute);
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
        return model.get('channel_connection').position;
      };

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
            return $('body').html('').addClass('loading');
          },
          stop: function() {
            return $('body').removeClass('loading');
          }
        };
      };

      return BrunchApplication;

    })();

  }).call(this);
  
}});

window.require.define({"initialize": function(exports, require, module) {
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

      return Application;

    })(BrunchApplication);

    window.app = new exports.Application;

  }).call(this);
  
}});

window.require.define({"models/block": function(exports, require, module) {
  (function() {
    var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    exports.Block = (function(_super) {

      __extends(Block, _super);

      function Block() {
        this.channelConnection = __bind(this.channelConnection, this);
        Block.__super__.constructor.apply(this, arguments);
      }

      Block.prototype.initialize = function() {
        this.checkIfMissingImage();
        return this.channelConnection();
      };

      Block.prototype.checkIfMissingImage = function() {
        var missing;
        missing = '/assets/interface/missing.png';
        if (this.get('image_thumb') === missing) {
          return this.set('image_thumb', null);
        }
      };

      Block.prototype.channelConnection = function() {
        var _this = this;
        return this.set('channel_connection', _.find(this.get('connections'), function(connection) {
          return connection.channel_id === app.router.channel.id;
        }));
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
              return console.log(error);
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
        '/:slug/show::id': 'single'
      };

      MainRouter.prototype.initialize = function() {
        this.indexView = new IndexView();
        return this.channel = new Channel();
      };

      MainRouter.prototype.index = function() {
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

      IndexView.prototype.go = function(e) {
        e.preventDefault();
        return app.router.navigate("//" + (this.$('#channel_slug').val()), {
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
        return document.title = this.model.get('title') ? "" + (this.options.channel.get('title')) + ": " + (this.model.get('title')) : this.options.channel.get('title');
      };

      SingleView.prototype.render = function(id) {
        this.$el.html(template({
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
      
        __out.push('<div id="modal" class="hide"></div>\n<div id="blocks" class="grid"></div>\n<h1>');
      
        __out.push(__sanitize(this.channel.title));
      
        __out.push('</h1>');
      
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
      
        __out.push('<form id="channel">\n  <input id="channel_slug" name="channel[slug]" placeholder="Channel?" tabindex="0" />\n</form>');
      
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
      
        __out.push('<div class="thumb">\n  ');
      
        if (this.block.image_thumb) {
          __out.push('\n    <div class="image">\n      <a href="/#/');
          __out.push(__sanitize(this.channel.slug));
          __out.push('/show:');
          __out.push(__sanitize(this.block.id));
          __out.push('">\n        <img src="');
          __out.push(__sanitize(this.block.image_thumb));
          __out.push('" alt="');
          __out.push(__sanitize(this.block.title));
          __out.push('" />\n      </a>\n    </div>\n  ');
        } else if (this.block.title) {
          __out.push('\n    <a href="/#/');
          __out.push(__sanitize(this.channel.slug));
          __out.push('/show:');
          __out.push(__sanitize(this.block.id));
          __out.push('">\n      ');
          __out.push(__sanitize(_.str.prune(this.block.title, 30)));
          __out.push('\n    </a>\n  ');
        } else {
          __out.push('\n    <a href="/#/');
          __out.push(__sanitize(this.channel.slug));
          __out.push('/show:');
          __out.push(__sanitize(this.block.id));
          __out.push('">\n      Untitled\n    </a>\n  ');
        }
      
        __out.push('\n</div>');
      
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
            __out.push('\n        <a class=\'prev\' href="/#/');
            __out.push(__sanitize(this.channel.slug));
            __out.push('/show:');
            __out.push(__sanitize(this.prev.id));
            __out.push('">Previous</a>\n      ');
          }
          __out.push('\n\n      ');
          if (this.channel.mode) {
            __out.push('\n        <!-- <span class="meta-sep">|</span>\n        <a href="/#/');
            __out.push(__sanitize(this.channel.slug));
            __out.push('/mode:');
            __out.push(__sanitize(this.channel.mode));
            __out.push('">Up</a>\n        <span class="meta-sep">|</span> -->\n      ');
          } else {
            __out.push('\n        <!-- <span class="meta-sep">|</span>\n        <a href="/#/');
            __out.push(__sanitize(this.channel.slug));
            __out.push('">Up</a>\n        <span class="meta-sep">|</span> -->\n      ');
          }
          __out.push('\n\n      ');
          if (this.next) {
            __out.push('\n        <a class=\'next\' href="/#/');
            __out.push(__sanitize(this.channel.slug));
            __out.push('/show:');
            __out.push(__sanitize(this.next.id));
            __out.push('">Next</a>\n      ');
          }
          __out.push('\n    </nav>\n  ');
        }
      
        __out.push('\n\n  <header class="title">\n    ');
      
        if (this.block.title) {
          __out.push('\n      <a href="/#/');
          __out.push(__sanitize(this.channel.slug));
          __out.push('/show:');
          __out.push(__sanitize(this.block.id));
          __out.push('">');
          __out.push(__sanitize(this.block.title));
          __out.push('</a>\n    ');
        } else {
          __out.push('\n      <a href="/#/');
          __out.push(__sanitize(this.channel.slug));
          __out.push('/show:');
          __out.push(__sanitize(this.block.id));
          __out.push('">¶</a>\n    ');
        }
      
        __out.push('\n  </header>\n</section>\n\n<div id="block_');
      
        __out.push(__sanitize(this.block.id));
      
        __out.push('" class="full ');
      
        __out.push(__sanitize(this.block.block_type.toLowerCase()));
      
        __out.push('" data-type="');
      
        __out.push(__sanitize(this.block.block_type));
      
        __out.push('">\n  \n  ');
      
        if (this.block.block_type === 'Media') {
          __out.push('\n    <div class="embed occupy">\n      ');
          __out.push(this.block.embed_html);
          __out.push('\n    </div>\n\n  ');
        } else if (this.block.block_type === 'Link') {
          __out.push('\n    <div class="link occupy">\n      <iframe src="');
          __out.push(__sanitize(this.block.source_url));
          __out.push('" width="100%" height="100%" />\n    </div>\n\n  ');
        } else if (this.block.block_type === 'Image') {
          __out.push('\n    <div class="slide">\n      <div class="wrap">\n        <a href="');
          __out.push(__sanitize(this.block.image_original));
          __out.push('" class="middle">\n          <img src="http://d2ss1gpcas6f9e.cloudfront.net/?resize=900x900%3E&src=');
          __out.push(__sanitize(this.block.image_original));
          __out.push('" alt="');
          __out.push(__sanitize(this.block.title));
          __out.push('" />\n        </a>\n      </div>\n    </div>\n\n  ');
        } else if (this.block.block_type === 'Text') {
          __out.push('\n    <div class="slide">\n      <div class="wrap">\n        <div class="middle">\n          <div class="content">');
          __out.push(this.block.content);
          __out.push('</div>\n        </div>\n      </div>\n    </div>\n  ');
        }
      
        __out.push('\n\n\n  <!-- <div class="metadata">\n    ');
      
        if (this.block.description) {
          __out.push('\n      <div class="description">\n        ');
          __out.push(this.block.description);
          __out.push('\n      </div>\n    ');
        }
      
        __out.push('\n  </div> -->\n  \n</div><!-- #block -->');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

