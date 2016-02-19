/* globals Pikaday */

import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  tagName: 'input',
  attributeBindings: ['readonly', 'disabled', 'placeholder', 'type', 'name', 'size', 'required'],
  type: 'text',

  didInsertElement() {
    const firstDay = this.get('firstDay');

    const options = {
      field: this.$()[0],
      onSelect: Ember.run.bind(this, this.userSelectedDate),
      firstDay: (typeof firstDay !== 'undefined') ? parseInt(firstDay, 10) : 1,
      yearRange: this.determineYearRange(),
      format: this.get('minDate') || 'DD.MM.YYYY',
      minDate: this.get('minDate') || null,
      maxDate: this.get('maxDate') || null,
      theme: this.get('theme') || null
    };

    if (this.get('i18n')) {
      options.i18n = this.get('i18n');
    }

    this.set('pikaday', new Pikaday(options));
    this.setPikadayDate();
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.setPikadayDate();
    this.setMinDate();
    this.setMaxDate();
    this.checkAutoHide();
  },

  willDestroy() {
    this.get('pikaday').destroy();
  },

  setPikadayDate() {
    if(this.get('value') && this.get('pikaday')){
      this.get('pikaday').setMoment(moment(this.get('value')));
    }
  },

  setMinDate() {
    if(this.get('value') && this.get('minDate')){
      this.get('pikaday').setMinDate(this.get('minDate'));
    }
  },

  setMaxDate() {
    if(this.get('value') && this.get('maxDate')){
      this.get('pikaday').setMaxDate(this.get('maxDate'));
    }
  },

  userSelectedDate() {
    const date = this.get('useUTC') ? this.toUTC(this.get('pikaday').getDate()) : this.get('pikaday').getDate();

    if(this.attrs.onSelected) {
      this.attrs.onSelected(date);
    }
  },

  toUTC(date) {
    return moment.utc([date.getFullYear(), date.getMonth(), date.getDate()]).toDate();
  },

  determineYearRange() {
    const yearRange = this.get('yearRange');

    if (yearRange) {
      if (yearRange.indexOf(',') > -1) {
        const yearArray = yearRange.split(',');

        if (yearArray[1] === 'currentYear') {
          yearArray[1] = new Date().getFullYear();
        }

        return yearArray;
      } else {
        return yearRange;
      }
    } else {
      return 10;
    }
  },

  checkAutoHide() {
    if (this.get('disabled') && this.get('pikaday')) {
      this.get('pikaday').hide();
    }
  }
});
