const Roxp = require('../../roxp.min.js');

describe("Roxp", function () {

  let strRoxp;
  let setRoxp;
  let negativeSetRoxp;
  let negativeGroupingRoxp;
  let nonCapturingRoxp;
  let multiRoxp

  it("contains RegExp /asdf/", function () {

    strRoxp = Roxp('asdf');

    expect(
      strRoxp.regExp
    ).toEqual( new RegExp('asdf', 'g') );

  });

  it("contains RegExp /[xyz]/", function () {

    setRoxp = Roxp(['xyz']);

    expect(
      setRoxp.regExp
    ).toEqual( new RegExp('[xyz]', 'g') );

  });

  it("negates set", function () {

    negativeSetRoxp = Roxp(
      ['xyz'], { mustNotMatch: true }
    );

    expect(
      negativeSetRoxp.regExp
    ).toEqual( new RegExp('[^xyz]', 'g') );

  });

  it("negates grouping", function () {

    negativeGroupingRoxp = Roxp(
      'asdf', { mustNotMatch: true }
    );

    expect(
      negativeGroupingRoxp.regExp
    ).toEqual( new RegExp('(?!asdf)', 'g') );

  });

  it("creates non-capturing group for strings with quantifier option", function () {

    nonCapturingRoxp = Roxp(
      'asdf', { onceOrNever: true }
    );

    expect(
      nonCapturingRoxp.regExp
    ).toEqual( new RegExp('(?:asdf)?', 'g') );

  });

  it("combines multiple Roxp instances into one", function () {

    multiRoxp = Roxp(strRoxp, setRoxp);

    expect(
      multiRoxp.regExp
    ).toEqual( new RegExp('asdf[xyz]', 'g') );

  });

});
