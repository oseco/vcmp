"use strict";

exports.__esModule = true;
exports.default = void 0;

var _utils = require("../../utils");

var _utils2 = require("../utils");

var _utils3 = require("../../datetime-picker/utils");

var _createNamespace = (0, _utils.createNamespace)('calendar-month'),
    createComponent = _createNamespace[0];

var _default = createComponent({
  props: {
    date: Date,
    type: String,
    color: String,
    minDate: Date,
    maxDate: Date,
    showMark: Boolean,
    showTitle: Boolean,
    rowHeight: Number,
    formatter: Function,
    currentDate: [Date, Array]
  },
  data: function data() {
    return {
      visible: false
    };
  },
  computed: {
    title: function title() {
      return (0, _utils2.formatMonthTitle)(this.date);
    },
    offset: function offset() {
      return this.date.getDay();
    },
    totalDay: function totalDay() {
      return (0, _utils3.getMonthEndDay)(this.date.getFullYear(), this.date.getMonth() + 1);
    },
    monthStyle: function monthStyle() {
      if (!this.visible) {
        var padding = Math.ceil((this.totalDay + this.offset) / 7) * this.rowHeight;
        return {
          paddingBottom: padding + "px"
        };
      }
    },
    days: function days() {
      var days = [];
      var year = this.date.getFullYear();
      var month = this.date.getMonth();

      for (var day = 1; day <= this.totalDay; day++) {
        var date = new Date(year, month, day);
        var type = this.getDayType(date);
        var config = {
          date: date,
          type: type,
          text: day,
          bottomInfo: this.getBottomInfo(type)
        };

        if (this.formatter) {
          config = this.formatter(config);
        }

        days.push(config);
      }

      return days;
    }
  },
  mounted: function mounted() {
    this.height = this.$el.getBoundingClientRect().height;
  },
  methods: {
    scrollIntoView: function scrollIntoView() {
      this.$refs.days.scrollIntoView();
    },
    getDayType: function getDayType(day) {
      var type = this.type,
          minDate = this.minDate,
          maxDate = this.maxDate,
          currentDate = this.currentDate;

      if ((0, _utils2.compareDay)(day, minDate) < 0 || (0, _utils2.compareDay)(day, maxDate) > 0) {
        return 'disabled';
      }

      if (type === 'single') {
        return (0, _utils2.compareDay)(day, currentDate) === 0 ? 'selected' : '';
      }
      /* istanbul ignore else */


      if (type === 'range') {
        var _this$currentDate = this.currentDate,
            startDay = _this$currentDate[0],
            endDay = _this$currentDate[1];

        if (!startDay) {
          return;
        }

        var compareToStart = (0, _utils2.compareDay)(day, startDay);

        if (compareToStart === 0) {
          return 'start';
        }

        if (!endDay) {
          return;
        }

        var compareToEnd = (0, _utils2.compareDay)(day, endDay);

        if (compareToEnd === 0) {
          return 'end';
        }

        if (compareToStart > 0 && compareToEnd < 0) {
          return 'middle';
        }
      }
    },
    getBottomInfo: function getBottomInfo(type) {
      if (type === 'start') {
        return (0, _utils2.t)('start');
      }

      if (type === 'end') {
        return (0, _utils2.t)('end');
      }
    },
    getDayStyle: function getDayStyle(type, index) {
      var style = {};

      if (index === 0) {
        style.marginLeft = 100 * this.offset / 7 + "%";
      }

      if (this.rowHeight !== _utils2.ROW_HEIGHT) {
        style.height = this.rowHeight + "px";
      }

      if (this.color) {
        if (type === 'start' || type === 'end') {
          style.background = this.color;
        } else if (type === 'middle') {
          style.color = this.color;
        }
      }

      return style;
    },
    genTitle: function genTitle() {
      var h = this.$createElement;

      if (this.showTitle) {
        return h("div", {
          "class": (0, _utils2.bem)('month-title')
        }, [this.title]);
      }
    },
    genMark: function genMark() {
      var h = this.$createElement;

      if (this.showMark) {
        return h("div", {
          "class": (0, _utils2.bem)('month-mark')
        }, [this.date.getMonth() + 1]);
      }
    },
    genDays: function genDays() {
      var h = this.$createElement;

      if (this.visible) {
        return h("div", {
          "ref": "days",
          "class": (0, _utils2.bem)('days')
        }, [this.genMark(), this.days.map(this.genDay)]);
      }

      return h("div", {
        "ref": "days"
      });
    },
    genDay: function genDay(item, index) {
      var _this = this;

      var h = this.$createElement;
      var type = item.type,
          topInfo = item.topInfo,
          bottomInfo = item.bottomInfo;
      var style = this.getDayStyle(type, index);

      var onClick = function onClick() {
        if (type !== 'disabled') {
          _this.$emit('click', item);
        }
      };

      var TopInfo = topInfo && h("div", {
        "class": (0, _utils2.bem)('top-info')
      }, [topInfo]);
      var BottomInfo = bottomInfo && h("div", {
        "class": (0, _utils2.bem)('bottom-info')
      }, [bottomInfo]);

      if (type === 'selected') {
        return h("div", {
          "style": style,
          "class": (0, _utils2.bem)('day'),
          "on": {
            "click": onClick
          }
        }, [h("div", {
          "class": (0, _utils2.bem)('selected-day'),
          "style": {
            background: this.color
          }
        }, [TopInfo, item.text, BottomInfo])]);
      }

      return h("div", {
        "style": style,
        "class": [(0, _utils2.bem)('day', [type]), item.className],
        "on": {
          "click": onClick
        }
      }, [TopInfo, item.text, BottomInfo]);
    }
  },
  render: function render() {
    var h = arguments[0];
    return h("div", {
      "class": (0, _utils2.bem)('month'),
      "style": this.monthStyle
    }, [this.genTitle(), this.genDays()]);
  }
});

exports.default = _default;