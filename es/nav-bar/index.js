import _mergeJSXProps from "@vue/babel-helper-vue-jsx-merge-props";
// Utils
import { createNamespace, noop } from '../utils';
import { inherit } from '../utils/functional';
import { BORDER_BOTTOM } from '../utils/constant'; // Components

import Icon from '../icon'; // Types

var _createNamespace = createNamespace('nav-bar'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

function NavBar(h, props, slots, ctx) {
  var _ref;

  function LeftPart() {
    if (slots.left) {
      return slots.left();
    }

    return [props.leftArrow && h(Icon, {
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

  return h("div", _mergeJSXProps([{
    "style": {
      zIndex: props.zIndex
    },
    "class": [bem({
      fixed: props.fixed
    }), (_ref = {}, _ref[BORDER_BOTTOM] = props.border, _ref)]
  }, inherit(ctx)]), [h("div", {
    "class": bem('left'),
    "on": {
      "click": ctx.listeners['click-left'] || noop
    }
  }, [LeftPart()]), h("div", {
    "class": [bem('title'), 'van-ellipsis']
  }, [slots.title ? slots.title() : props.title]), h("div", {
    "class": bem('right'),
    "on": {
      "click": ctx.listeners['click-right'] || noop
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
export default createComponent(NavBar);