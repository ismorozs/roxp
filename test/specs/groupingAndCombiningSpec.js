const Roxp = require('../../roxp.js');

describe("Roxp grouping", function () {

  let roxp1;
  let roxp2;
  let roxp3;
  let roxp4;
  let roxp5;
  let roxp7;
  let roxp8;
  let roxp9;

  it("groups through eitherOne", function () {

    roxp1 = Roxp(
      [[ 'a', 'b', 'c' ]], { eitherOne: true }
    );

    expect(
      roxp1.regExp
    ).toEqual( new RegExp('a|b|c') );

  });

  it("groups through brackets", function () {

    roxp2 = Roxp(
      [[ 'zzz', [1,2,3,4] ]], { group: true }
    );

    expect(
      roxp2.regExp
    ).toEqual( new RegExp('(zzz[1234])') );

    expect(
      roxp2.groups
    ).toEqual([true]);

  });

  it("groups through brackets and adds the group a name", function () {

    roxp3 = Roxp(
      [[ 'string' ]], { group: 'string' }
    );

    expect(
      roxp3.regExp
    ).toEqual( new RegExp('(string)') );

    expect(
      roxp3.groups
    ).toEqual(['string']);

  });

  it("adds quantifier to a whole group", function () {

    roxp4 = Roxp(
      [[ 'asdf', 'zxcv' ]], { times: 2 },
    );

    expect(
      roxp4.regExp
    ).toEqual( new RegExp('(?:asdfzxcv){2,2}') );

  });

  it("groups through brackets and adds quantifier, but creates non-capturing group", function () {

    roxp9 = Roxp(
      [[ 'asdf', 'zxcv' ]], { times: 2 },
    );

    expect(
      roxp9.regExp
    ).toEqual( new RegExp('(?:asdfzxcv){2,2}') );

  });

  it("contains grouping from passed Roxp instances", function () {

    roxp5 = Roxp(roxp1, roxp3);

    expect(
      roxp5.regExp
    ).toEqual( new RegExp('a|b|c(string)') );

    expect(
      roxp5.groups
    ).toEqual(['string']);

  });

  it("prefixes groupings of passed Roxp instances to avoid name conflicts", function () {

    roxp7 = Roxp(
      roxp3, { prefixGroups: 'first' },
      roxp3, { prefixGroups: 'second' }
    );

    expect(
      roxp7.regExp
    ).toEqual( new RegExp('(string)(string)') );

    expect(
      roxp7.groups
    ).toEqual(['firstString', 'secondString']);

  });

  it("contains groups including nested and undefined in the right order", function () {

    roxp8 = Roxp(
      roxp7, { group: 'outerFirst', prefixGroups: 'outerFirst' },
      roxp1,
      roxp2,
      roxp7, { group: 'outerSecond', prefixGroups: 'outerSecond' },
    );

    expect(
      roxp8.regExp
    ).toEqual( new RegExp('((string)(string))a|b|c(zzz[1234])((string)(string))') );

    expect(
      roxp8.groups
    ).toEqual(
      ['outerFirst', 'outerFirstFirstString', 'outerFirstSecondString', true, 'outerSecond', 'outerSecondFirstString', 'outerSecondSecondString']
    );

  });

});
