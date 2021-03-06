"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _babelHelperVueJsxMergeProps = _interopRequireDefault(require("@vue/babel-helper-vue-jsx-merge-props"));

var _utils = require("../utils");

var _functional = require("../utils/functional");

var _constant = require("../utils/constant");

var _icon = _interopRequireDefault(require("../icon"));

// Utils
// Components
var _createNamespace = (0, _utils.createNamespace)('nav-bar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

function NavBar(h, props, slots, ctx) {
  var _ref;

  function LeftPart() {
    if (slots.left) {
      return slots.left();
    }

    return [props.leftArrow && h(_icon.default, {
      "class": bem('arrow'),
      "attrs": {
        "name": "arrow-left"
      }
    }), props.leftText && h("span", {
      "class": bem('text')
    }, [props.leftText])];
  }

  function RightPart() {
    if (slots.right) {
      return slots.right();
    }

    if (props.rightText) {
      return h("span", {
        "class": bem('text')
      }, [props.rightText]);
    }
  }

  return h("div", (0, _babelHelperVueJsxMergeProps.default)([{
    "style": {
      zIndex: props.zIndex
    },
    "class": [bem({
      fixed: props.fixed
    }), (_ref = {}, _ref[_constant.BORDER_BOTTOM] = props.border, _ref)]
  }, (0, _functional.inherit)(ctx)]), [h("div", {
    "class": bem('left'),
    "on": {
      "click": ctx.listeners['click-left'] || _utils.noop
    }
  }, [LeftPart()]), h("div", {
    "class": [bem('title'), 'van-ellipsis']
  }, [slots.title ? slots.title() : props.title]), h("div", {
    "class": bem('right'),
    "on": {
      "click": ctx.listeners['click-right'] || _utils.noop
    }
  }, [RightPart()])]);
}

NavBar.props = {
  title: String,
  fixed: Boolean,
  leftText: String,
  rightText: String,
  leftArrow: Boolean,
  border: {
    type: Boolean,
    default: true
  },
  zIndex: {
    type: Number,
    default: 1
  }
};

var _default = createComponent(NavBar);

exports.default = _default;