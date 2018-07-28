const Roxp = require('../../roxp.min.js');

describe("Roxp quantifiers", function () {

  it("contains RegExp /x{5,5}/", function () {
    expect(
      Roxp('x', { times: 5 }).regExp
    ).toEqual( new RegExp('x{5,5}', 'g') );
  });

  it("contains RegExp /x{1,2}/", function () {
    expect(
      Roxp('x', { inRange: [1,2] }).regExp
    ).toEqual( new RegExp('x{1,2}', 'g') );
  });

  it("contains RegExp /x?/", function () {
    expect(
      Roxp('x', { onceOrNever: true }).regExp
    ).toEqual( new RegExp('x?', 'g') );
  });

  it("contains RegExp /x+/", function () {
    expect(
      Roxp('x', { onceOrMore: true }).regExp
    ).toEqual( new RegExp('x+', 'g') );
  });

  it("contains RegExp /x*/", function () {
    expect(
      Roxp('x', { zeroOrMore: true}).regExp
    ).toEqual( new RegExp('x*', 'g') );
  });

  it("contains RegExp /x+?/", function () {
    expect(
      Roxp('x', { onceOrMore: true, lazy: true }).regExp
    ).toEqual( new RegExp('x+?', 'g') );
  });

  it("contains RegExp /x*?/", function () {
    expect(
      Roxp('x', { zeroOrMore: true, lazy: true }).regExp
    ).toEqual( new RegExp('x*?', 'g') );
  });

  it("contains RegExp /x{,8}/", function () {
    expect(
      Roxp('x', { '<': 9 }).regExp
    ).toEqual( new RegExp('x{,8}', 'g') );
  });

  it("contains RegExp /x{,5}/", function () {
    expect(
      Roxp('x', { '<=': 5 }).regExp
    ).toEqual( new RegExp('x{,5}', 'g') );
  });

  it("contains RegExp /x{8,}/", function () {
    expect(
      Roxp('x', { '>': 7 }).regExp
    ).toEqual( new RegExp('x{8,}', 'g') );
  });

  it("contains RegExp /x{5,}/", function () {
    expect(
      Roxp('x', { '>=': 5 }).regExp
    ).toEqual( new RegExp('x{5,}', 'g') );
  });

  it("contains RegExp /x{5,5}/", function () {
    expect(
      Roxp('x', { '=': 5 }).regExp
    ).toEqual( new RegExp('x{5,5}', 'g') );
  });

  it("contains RegExp /x{1,9}/", function () {
    expect(
      Roxp('x', { '>': 0, '<': 10 }).regExp
    ).toEqual( new RegExp('x{1,9}', 'g') );
  });

  it("contains RegExp /[1-9]{2,2}/", function () {
    expect(
      Roxp(['1-9'], { times: 2 }).regExp
    ).toEqual( new RegExp('[1-9]{2,2}', 'g') );
  });

  it('contains RegExp /x+?/', function () {
    expect(
      Roxp('x', { onceOrMore: true, lazy: true }).regExp
    ).toEqual( new RegExp('x+?', 'g') )
  });

  it('contains RegExp /x+?/', function () {
    expect(
      Roxp('x', { zeroOrMore: true, lazy: true }).regExp
    ).toEqual( new RegExp('x*?', 'g') )
  });

});
