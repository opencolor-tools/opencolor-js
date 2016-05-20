'use strict'

import tinycolor from 'tinycolor2'
import ParserError from './parser_error'

export default class ColorValue {
  constructor (name, value, identifiedValue = null) {
    this.name = name
    this.value = value
    this.identifiedValue = identifiedValue
    this.parent = null
    this.type = 'ColorValue'
  }
  hexcolor (withAlpha = false) {
    if (this.isHexExpressable()) {
      if (withAlpha) {
        return this.identifiedValue.toString('hex8').toUpperCase()
      }
      return this.identifiedValue.toString('hex6').toUpperCase()
    }
    return null
  }
  isHexExpressable () {
    return (this.identifiedValue != null)
  }
  clone () {
    return new ColorValue(this.name, this.value, this.identifiedValue)
  }

  static fromColorValue (value, line = null) {
    var parsed = tinycolor(value)
    if (parsed.isValid()) {
      return new ColorValue(parsed.getFormat(), value, parsed)
    }
    var space = value.match(/^(\w+)\((.*)\)$/)
    if (space) {
      return new ColorValue(space[1], space[0], null)
    }
    throw (new ParserError('Illegal Color Value: ' + value, {line: line}))
  }
}
