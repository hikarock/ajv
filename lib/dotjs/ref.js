'use strict';
module.exports = function anonymous(it) {
  var out = ' ';
  var $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema['$ref'],
    $schemaPath = it.schemaPath + '.' + '$ref',
    $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || ''),
    $valid = 'valid' + $lvl,
    $errs = 'errs' + $lvl;
  if ($schema == '#' || $schema == '#/') {
    if (it.isRoot) {
      if ($breakOnError && it.wasTop) {
        out += ' if (! ' + ('validate') + '(' + ($data) + ', (dataPath || \'\') + ' + (it.errorPath) + ') ) return false; else { ';
      } else {
        out += ' var errors' + ($lvl) + ' = validate.errors; if (! ' + ('validate') + '(' + ($data) + ', (dataPath || \'\') + ' + (it.errorPath) + ') ) { if (errors' + ($lvl) + ' !== null) validate.errors = errors' + ($lvl) + '.concat(validate.errors); errors = validate.errors.length; } ';
        if ($breakOnError) {
          out += ' else { ';
        }
      }
    } else {
      out += '  if (! ' + ('root.refVal[0]') + '(' + ($data) + ', (dataPath || \'\') + ' + (it.errorPath) + ') ) { if (validate.errors === null) validate.errors = ' + ('root.refVal[0]') + '.errors; else validate.errors = validate.errors.concat(' + ('root.refVal[0]') + '.errors); errors = validate.errors.length; } ';
      if ($breakOnError) {
        out += ' else { ';
      }
    }
  } else {
    var $refVal = it.resolveRef(it.baseId, $schema, it.isRoot);
    if ($refVal === undefined) {
      var $message = 'can\'t resolve reference ' + $schema + ' from id ' + it.baseId;
      if (it.opts.missingRefs == 'fail') {
        console.log($message);
        if (it.wasTop && $breakOnError) {
          out += ' validate.errors = [ { keyword: \'' + ('$ref') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'can\\\'t resolve reference ' + (it.util.escapeQuotes($schema)) + '\' ';
          if (it.opts.verbose) {
            out += ', schema: \'' + (it.util.escapeQuotes($schema)) + '\', data: ' + ($data);
          }
          out += ' }]; return false; ';
        } else {
          out += '  var err =   { keyword: \'' + ('$ref') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'can\\\'t resolve reference ' + (it.util.escapeQuotes($schema)) + '\' ';
          if (it.opts.verbose) {
            out += ', schema: \'' + (it.util.escapeQuotes($schema)) + '\', data: ' + ($data);
          }
          out += ' }; if (validate.errors === null) validate.errors = [err]; else validate.errors.push(err); errors++; ';
        }
        if ($breakOnError) {
          out += ' if (false) { ';
        }
      } else if (it.opts.missingRefs == 'ignore') {
        console.log($message);
        if ($breakOnError) {
          out += ' if (true) { ';
        }
      } else {
        throw new Error($message);
      }
    } else {
      out += '  if (! ' + ($refVal) + '(' + ($data) + ', (dataPath || \'\') + ' + (it.errorPath) + ') ) { if (validate.errors === null) validate.errors = ' + ($refVal) + '.errors; else validate.errors = validate.errors.concat(' + ($refVal) + '.errors); errors = validate.errors.length; } ';
      if ($breakOnError) {
        out += ' else { ';
      }
    }
  }
  return out;
}