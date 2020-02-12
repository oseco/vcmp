import _extends from "@babel/runtime/helpers/esm/extends";
// Utils
import { createNamespace } from '../utils';
import { preventDefault } from '../utils/dom/event';
import { deepClone } from '../utils/deep-clone';
import { BORDER_TOP_BOTTOM, BORDER_UNSET_TOP_BOTTOM } from '../utils/constant';
import { pickerProps } from './shared'; // Components

import Loading from '../loading';
import PickerColumn from './PickerColumn';

var _createNamespace = createNamespace('picker'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1],
    t = _createNamespace[2];

export default createComponent({
  props: _extends({}, pickerProps, {
    defaultIndex: {
      type: Number,
      default: 0
    },
    columns: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    toolbarPosition: {
      type: String,
      default: 'top'
    },
    valueKey: {
      type: String,
      default: 'text'
    }
  }),
  data: function data() {
    return {
      children: []
    };
  },
  computed: {
    simple: function simple() {
      return this.columns.length && !this.columns[0].values;
    }
  },
  watch: {
    columns: 'setColumns'
  },
  methods: {
    setColumns: function setColumns() {
      var _this = this;

      var columns = this.simple ? [{
        values: this.columns
      }] : this.columns;
      columns.forEach(function (column, index) {
        _this.setColumnValues(index, deepClone(column.values));
      });
    },
    emit: function emit(event) {
      if (this.simple) {
        this.$emit(event, this.getColumnValue(0), this.getColumnIndex(0));
      } else {
        this.$emit(event, this.getValues(), this.getIndexes());
      }
    },
    onChange: function onChange(columnIndex) {
      if (this.simple) {
        this.$emit('change', this, this.getColumnValue(0), this.getColumnIndex(0));
      } else {
        this.$emit('change', this, this.getValues(), columnIndex);
      }
    },
    // get column instance by index
    getColumn: function getColumn(index) {
      return this.children[index];
    },
    // @exposed-api
    // get column value by index
    getColumnValue: function getColumnValue(index) {
      var column = this.getColumn(index);
      return column && column.getValue();
    },
    // @exposed-api
    // set column value by index
    setColumnValue: function setColumnValue(index, value) {
      var column = this.getColumn(index);
      column && column.setValue(value);
    },
    // @exposed-api
    // get column option index by column index
    getColumnIndex: function getColumnIndex(columnIndex) {
      return (this.getColumn(columnIndex) || {}).currentIndex;
    },
    // @exposed-api
    // set column option index by column index
    setColumnIndex: function setColumnIndex(columnIndex, optionIndex) {
      var column = this.getColumn(columnIndex);
      column && column.setIndex(optionIndex);
    },
    // @exposed-api
    // get options of column by index
    getColumnValues: function getColumnValues(index) {
      return (this.children[index] || {}).options;
    },
    // @exposed-api
    // set options of column by index
    setColumnValues: function setColumnValues(index, options) {
      var column = this.children[index];

      if (column && JSON.stringify(column.options) !== JSON.stringify(options)) {
        column.options = options;
        column.setIndex(0);
      }
    },
    // @exposed-api
    // get values of all columns
    getValues: function getValues() {
      return this.children.map(function (child) {
        return child.getValue();
      });
    },
    // @exposed-api
    // set values of all columns
    setValues: function setValues(values) {
      var _this2 = this;

      values.forEach(function (value, index) {
        _this2.setColumnValue(index, value);
      });
    },
    // @exposed-api
    // get indexes of all columns
    getIndexes: function getIndexes() {
      return this.children.map(function (child) {
        return child.currentIndex;
      });
    },
    // @exposed-api
    // set indexes of all columns
    setIndexes: function setIndexes(indexes) {
      var _this3 = this;

      indexes.forEach(function (optionIndex, columnIndex) {
        _this3.setColumnIndex(columnIndex, optionIndex);
      });
    },
    // @exposed-api
    confirm: function confirm() {
      this.children.forEach(function (child) {
        return child.stopMomentum();
      });
      this.emit('confirm');
    },
    cancel: function cancel() {
      this.emit('cancel');
    },
    genTitle: function genTitle() {
      var h = this.$createElement;
      var titleSlot = this.slots('title');

      if (titleSlot) {
        return titleSlot;
      }

      if (this.title) {
        return h("div", {
          "class": ['van-ellipsis', bem('title')]
        }, [this.title]);
      }
    },
    genToolbar: function genToolbar() {
      var h = this.$createElement;

      if (this.showToolbar) {
        return h("div", {
          "class": [BORDER_TOP_BOTTOM, bem('toolbar')]
        }, [this.slots() || [h("button", {
          "attrs": {
            "type": "button"
          },
          "class": bem('cancel'),
          "on": {
            "click": this.cancel
          }
        }, [this.cancelButtonText || t('cancel')]), this.genTitle(), h("button", {
          "attrs": {
            "type": "button"
          },
          "class": bem('confirm'),
          "on": {
            "click": this.confirm
          }
        }, [this.confirmButtonText || t('confirm')])]]);
      }
    },
    genColumns: function genColumns() {
      var _this4 = this;

      var h = this.$createElement;
      var columns = this.simple ? [this.columns] : this.columns;
      return columns.map(function (item, index) {
        return h(PickerColumn, {
          "attrs": {
            "valueKey": _this4.valueKey,
            "allowHtml": _this4.allowHtml,
            "className": item.className,
            "itemHeight": _this4.itemHeight,
            "defaultIndex": item.defaultIndex || _this4.defaultIndex,
            "swipeDuration": _this4.swipeDuration,
            "visibleItemCount": _this4.visibleItemCount,
            "initialOptions": _this4.simple ? item : item.values
          },
          "on": {
            "change": function change() {
              _this4.onChange(index);
            }
          }
        });
      });
    }
  },
  render: function render(h) {
    var itemHeight = this.itemHeight;
    var wrapHeight = itemHeight * this.visibleItemCount;
    var frameStyle = {
      height: itemHeight + "px"
    };
    var columnsStyle = {
      height: wrapHeight + "px"
    };
    var maskStyle = {
      backgroundSize: "100% " + (wrapHeight - itemHeight) / 2 + "px"
    };
    return h("div", {
      "class": bem()
    }, [this.toolbarPosition === 'top' ? this.genToolbar() : h(), this.loading ? h(Loading, {
      "class": bem('loading')
    }) : h(), this.slots('columns-top'), h("div", {
      "class": bem('columns'),
      "style": columnsStyle,
      "on": {
        "touchmove": preventDefault
      }
    }, [this.genColumns(), h("div", {
      "class": bem('mask'),
      "style": maskStyle
    }), h("div", {
      "class": [BORDER_UNSET_TOP_BOTTOM, bem('frame')],
      "style": frameStyle
    })]), this.slots('columns-bottom'), this.toolbarPosition === 'bottom' ? this.genToolbar() : h()]);
  }
});