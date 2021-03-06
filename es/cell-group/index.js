import _mergeJSXProps from "@vue/babel-helper-vue-jsx-merge-props";
// Utils
import { createNamespace } from '../utils';
import { inherit } from '../utils/functional';
import { BORDER_TOP_BOTTOM } from '../utils/constant'; // Types

var _createNamespace = createNamespace('cell-group'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

function CellGroup(h, props, slots, ctx) {
  var _ref, _slots$default;

  var Group = h("div", _mergeJSXProps([{
    "class": [bem(), (_ref = {}, _ref[BORDER_TOP_BOTTOM] = props.border, _ref)]
  }, inherit(ctx, true)]), [(_slots$default = slots.default) === null || _slots$default === void 0 ? void 0 : _slots$default.call(slots)]);

  if (props.title || slots.title) {
    return h("div", [h("div", {
      "class": bem('title')
    }, [slots.title ? slots.title() : props.title]), Group]);
  }

  return Group;
}

CellGroup.props = {
  title: String,
  border: {
    type: Boolean,
    default: true
  }
};
export default createComponent(CellGroup);