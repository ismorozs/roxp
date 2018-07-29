const Roxp = require('../../roxp.js');

describe("Roxp methods", function () {

  it("has legit special characters object", function () {

    const $ = Roxp.specialCharacters();
    const roxp = Roxp(
      $.letter,
      $.notWordBoundary,
      $.digit,
      $.wordBoundary,
      $.space,
      $.notLetter,
      $.notDigit,
      $.notSpace,
      $['$'],
      $['^'],
      $['|'],
      $['?'],
      $['*'],
      $['+'],
      $['('],
      $[')'],
      $['{'],
      $['}'],
      $['['],
      $[']'],
      $['\\'],
      $['.'],
      $.dot
    );

    const testString = 'a1 !ax$^|?*+(){}[]\\..'

    expect(
      roxp.test(testString)
    ).toBe(true);

  });

});
