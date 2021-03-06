// Utils
import { isDate } from '../utils/validate/date';
import { getScrollTop } from '../utils/dom/scroll';
import { t, bem, getNextDay, compareDay, compareMonth, createComponent, calcDateNum, ROW_HEIGHT } from './utils'; // Components

import Popup from '../popup';
import Button from '../button';
import Toast from '../toast';
import Month from './components/Month';
import Header from './components/Header';
export default createComponent({
  props: {
    title: String,
    color: String,
    value: Boolean,
    formatter: Function,
    confirmText: String,
    rangePrompt: String,
    defaultDate: [Date, Array],
    getContainer: [String, Function],
    confirmDisabledText: String,
    type: {
      type: String,
      default: 'single'
    },
    minDate: {
      type: Date,
      validator: isDate,
      default: function _default() {
        return new Date();
      }
    },
    maxDate: {
      type: Date,
      validator: isDate,
      default: function _default() {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
      }
    },
    position: {
      type: String,
      default: 'bottom'
    },
    rowHeight: {
      type: Number,
      default: ROW_HEIGHT
    },
    round: {
      type: Boolean,
      default: true
    },
    poppable: {
      type: Boolean,
      default: true
    },
    showMark: {
      type: Boolean,
      default: true
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    maxRange: {
      type: Number,
      default: null
    }
  },
  data: function data() {
    return {
      monthTitle: '',
      currentDate: this.getInitialDate()
    };
  },
  computed: {
    range: function range() {
      return this.type === 'range';
    },
    months: function months() {
      var months = [];
      var cursor = new Date(this.minDate);
      cursor.setDate(1);

      do {
        months.push(new Date(cursor));
        cursor.setMonth(cursor.getMonth() + 1);
      } while (compareMonth(cursor, this.maxDate) !== 1);

      return months;
    },
    buttonDisabled: function buttonDisabled() {
      if (this.range) {
        return !this.currentDate[0] || !this.currentDate[1];
      }

      return !this.currentDate;
    }
  },
  watch: {
    type: 'reset',
    value: function value(val) {
      if (val) {
        this.initRect();
        this.scrollIntoView();
      }
    },
    defaultDate: function defaultDate(val) {
      this.currentDate = val;
    }
  },
  mounted: function mounted() {
    if (this.value || !this.poppable) {
      this.initRect();
    }
  },
  methods: {
    // @exposed-api
    reset: function reset() {
      this.currentDate = this.getInitialDate();
    },
    initRect: function initRect() {
      var _this = this;

      this.$nextTick(function () {
        _this.bodyHeight = _this.$refs.body.getBoundingClientRect().height;

        _this.onScroll();
      });
    },
    // scroll to current month
    scrollIntoView: function scrollIntoView() {
      var _this2 = this;

      this.$nextTick(function () {
        var currentDate = _this2.currentDate;
        var targetDate = _this2.range ? currentDate[0] : currentDate;
        /* istanbul ignore if */

        if (!targetDate) {
          return;
        }

        _this2.months.some(function (month, index) {
          if (compareMonth(month, targetDate) === 0) {
            _this2.$refs.months[index].scrollIntoView();

            return true;
          }

          return false;
        });
      });
    },
    getInitialDate: function getInitialDate() {
      var type = this.type,
          defaultDate = this.defaultDate,
          minDate = this.minDate;

      if (type === 'range') {
        var _ref = defaultDate || [],
            startDay = _ref[0],
            endDay = _ref[1];

        return [startDay || minDate, endDay || getNextDay(minDate)];
      }

      return defaultDate || minDate;
    },
    // calculate the position of the elements
    // and find the elements that needs to be rendered
    onScroll: function onScroll() {
      var _this$$refs = this.$refs,
          body = _this$$refs.body,
          months = _this$$refs.months;
      var top = getScrollTop(body);
      var bottom = top + this.bodyHeight;
      var heights = months.map(function (item) {
        return item.height;
      });
      var heightSum = heights.reduce(function (a, b) {
        return a + b;
      }, 0); // iOS scroll bounce may exceed the range

      /* istanbul ignore next */

      if (top < 0 || bottom > heightSum && top > 0) {
        return;
      }

      var height = 0;
      var firstMonth;

      for (var i = 0; i < months.length; i++) {
        var visible = height <= bottom && height + heights[i] >= top;

        if (visible && !firstMonth) {
          firstMonth = months[i];
        }

        months[i].visible = visible;
        height += heights[i];
      }
      /* istanbul ignore else */


      if (firstMonth) {
        this.monthTitle = firstMonth.title;
      }
    },
    onClickDay: function onClickDay(item) {
      var date = item.date;

      if (this.range) {
        var _this$currentDate = this.currentDate,
            startDay = _this$currentDate[0],
            endDay = _this$currentDate[1];

        if (startDay && !endDay) {
          var compareToStart = compareDay(date, startDay);

          if (compareToStart === 1) {
            this.select([startDay, date], true);
          } else if (compareToStart === -1) {
            this.select([date, null]);
          }
        } else {
          this.select([date, null]);
        }
      } else {
        this.select(date, true);
      }
    },
    togglePopup: function togglePopup(val) {
      this.$emit('input', val);
    },
    select: function select(date, complete) {
      this.currentDate = date;
      this.$emit('select', this.currentDate);

      if (complete && this.range) {
        var valid = this.checkRange();

        if (!valid) {
          return;
        }
      }

      if (complete && !this.showConfirm) {
        this.onConfirm();
      }
    },
    checkRange: function checkRange() {
      var maxRange = this.maxRange,
          currentDate = this.currentDate,
          rangePrompt = this.rangePrompt;

      if (maxRange && calcDateNum(currentDate) > maxRange) {
        Toast(rangePrompt || t('rangePrompt', maxRange));
        return false;
      }

      return true;
    },
    onConfirm: function onConfirm() {
      if (this.checkRange()) {
        this.$emit('confirm', this.currentDate);
      }
    },
    genMonth: function genMonth(date, index) {
      var h = this.$createElement;
      return h(Month, {
        "ref": "months",
        "refInFor": true,
        "attrs": {
          "date": date,
          "type": this.type,
          "color": this.color,
          "minDate": this.minDate,
          "maxDate": this.maxDate,
          "showMark": this.showMark,
          "formatter": this.formatter,
          "rowHeight": this.rowHeight,
          "showTitle": index !== 0,
          "currentDate": this.currentDate
        },
        "on": {
          "click": this.onClickDay
        }
      });
    },
    genFooterContent: function genFooterContent() {
      var h = this.$createElement;
      var slot = this.slots('footer');

      if (slot) {
        return slot;
      }

      if (this.showConfirm) {
        var text = this.buttonDisabled ? this.confirmDisabledText : this.confirmText;
        return h(Button, {
          "attrs": {
            "round": true,
            "block": true,
            "type": "danger",
            "color": this.color,
            "disabled": this.buttonDisabled
          },
          "class": bem('confirm'),
          "on": {
            "click": this.onConfirm
          }
        }, [text || t('confirm')]);
      }
    },
    genFooter: function genFooter() {
      var h = this.$createElement;
      return h("div", {
        "class": bem('footer', {
          'safe-area-inset-bottom': this.safeAreaInsetBottom
        })
      }, [this.genFooterContent()]);
    },
    genCalendar: function genCalendar() {
      var _this3 = this;

      var h = this.$createElement;
      return h("div", {
        "class": bem()
      }, [h(Header, {
        "attrs": {
          "title": this.title,
          "monthTitle": this.monthTitle
        },
        "scopedSlots": {
          title: function title() {
            return _this3.slots('title');
          }
        }
      }), h("div", {
        "ref": "body",
        "class": bem('body'),
        "on": {
          "scroll": this.onScroll
        }
      }, [this.months.map(this.genMonth)]), this.genFooter()]);
    }
  },
  render: function render() {
    var h = arguments[0];

    if (this.poppable) {
      var _attrs;

      return h(Popup, {
        "attrs": (_attrs = {
          "round": true,
          "closeable": true,
          "value": this.value
        }, _attrs["round"] = this.round, _attrs["position"] = this.position, _attrs["getContainer"] = this.getContainer, _attrs["closeOnClickOverlay"] = this.closeOnClickOverlay, _attrs),
        "class": bem('popup'),
        "on": {
          "input": this.togglePopup
        }
      }, [this.genCalendar()]);
    }

    return this.genCalendar();
  }
});