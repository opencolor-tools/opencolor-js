/* eslint-env mocha */
'use strict'

import {expect} from 'chai'
import * as oco from '../src/index'

/** @test {parse} */
describe('Parsing Metadata', () => {
  it('should parse metadata', () => {
    var test = '/author: Erykah Badu'
    var tree = oco.parse(test)
    expect(tree.getMetadata('/author')).to.equal('Erykah Badu')
    test = 'meta/author: Erykah Badu\n'
    tree = oco.parse(test)
    expect(tree.getMetadata('meta/author')).to.equal('Erykah Badu')
  })

  it('should parse metadata Block', () => {
    var test = `
metadata/
  author: Erykah Badu`
    var tree = oco.parse(test)
    expect(tree.getMetadata('metadata/author')).to.equal('Erykah Badu')
  })

  it('should parse metadata Block with a slash at the end of the name', () => {
    var test = `
hello/metadata/
  author: Erykah Badu`
    var tree = oco.parse(test)
    expect(tree.getMetadata('hello/metadata/author')).to.equal('Erykah Badu')
  })

  it('should parse metadata with more than one slash', () => {
    var test = 'foo/bar/author: Erykah Badu\n'
    var tree = oco.parse(test)
    expect(tree.getMetadata('foo/bar/author')).to.equal('Erykah Badu')
    test = '/foo/bar/author: Erykah Badu\n'
    tree = oco.parse(test)
    expect(tree.getMetadata('/foo/bar/author')).to.equal('Erykah Badu')
  })

  it('should parse metadata in a color block', () => {
    var test = `
color:
  #123
  author/name: Erykah Badu`
    var tree = oco.parse(test)
    expect(tree.get('color').hexcolor()).to.equal('#112233')
    expect(tree.get('color').getMetadata('author/name')).to.equal('Erykah Badu')
  })

  it('should parse metadata in a color block when metadata comes first', () => {
    var test = `
color:
  author/name: Erykah Badu
  #123
`
    var tree = oco.parse(test)
    expect(tree.get('color').hexcolor()).to.equal('#112233')
    expect(tree.get('color').getMetadata('author/name')).to.equal('Erykah Badu')
  })

  it('should parse metadata in a color block when metadata comes first (twice)', () => {
    var test = `
color:
  author/name: Erykah Badu
  author/email: Erykah Badu
  #123
`
    var tree = oco.parse(test)
    expect(tree.get('color').hexcolor()).to.equal('#112233')
    expect(tree.get('color').getMetadata('author/name')).to.equal('Erykah Badu')
  })

  it('should parse boolean metadata', () => {
    var test = 'meta/data: true\n'
    var tree = oco.parse(test)
    expect(tree.getMetadata('meta/data')).to.equal(true)
  })

  it('should parse number metadata', () => {
    var test = 'meta/data: 1.2\n'
    var tree = oco.parse(test)
    expect(tree.getMetadata('meta/data')).to.equal(1.2)
  })

  it('should parse color metadata', () => {
    var test = 'meta/data: #ff0022\n'
    var tree = oco.parse(test)
    expect(tree.getMetadata('meta/data').hexcolor()).to.equal('#FF0022')
  })
  it('should parse reference metadata', () => {
    var test = `
color: #ff0022
meta/data: =color
`
    var tree = oco.parse(test)
    expect(tree.getMetadata('meta/data').resolved().hexcolor()).to.equal('#FF0022')
  })
  it('should parse reference metadata in block', () => {
    var test = `
color: #ff0022
meta/:
  data: =color
`
    var tree = oco.parse(test)
    expect(tree.getMetadata('meta/data').resolved().hexcolor()).to.equal('#FF0022')
  })
})
