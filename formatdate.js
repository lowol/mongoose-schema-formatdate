var mongoose = require('mongoose'),
    SchemaTypes = mongoose.SchemaTypes,
    CastError = mongoose.SchemaType.CastError;

var moment = require('moment');

/**
 * FormatDate
 */
function FormatDate(path, options) {
  SchemaTypes.Date.call(this, path, options);
}
FormatDate.prototype = Object.create(SchemaTypes.Date.prototype);
FormatDate.prototype.cast = function(value) {
  if (value instanceof Date) {
    return value;
  } else if (value instanceof Number || 
      'number' == typeof value || 
      String(value) == Number(value)) {
    // support for timestamps
    return new Date(Number(value));
  }

  // format date string
  var format = this.options.format || 'YYYY-MM-DD hh:mm:ss';
  var mdate = moment(value.toString() || '', format);
  if (mdate.format(format) != value) {
    throw new CastError('date', value);
  }

  return mdate.toDate();
};

mongoose.Schema.Types.FormatDate = FormatDate;
