const Roxp = require('../../roxp.min.js');

describe("Roxp methods", function () {

  const $ = Roxp.specialCharacters();

  Roxp.setFlags({ g: false });

  const testString = '111-asdf-222';

  const digits = Roxp($.digit, { times: 3 });

  const letters = Roxp($.letter, { times: 4 });
  
  const roxp1 = Roxp(
    digits, { group: 'firstThreeDigits' },
    '-',
    letters, { group: 'letters' },
    '-',
    digits, { group: 'secondThreeDigits' }
  );

  Roxp.setFlags({ g: true });

  it("has working .test() and .check()", function () {

    expect(
      roxp1.test(testString)
    ).toBe(true);

  });

  it("has working .exec(), .find() and .search(), and returns named groups", function () {

    const searchResult = roxp1.search(testString);

    const expectedResultArray = [testString, '111', 'asdf', '222'];
    Object.assign(expectedResultArray, {
      index: 0,
      input: testString,
      firstThreeDigits: '111',
      letters: 'asdf',
      secondThreeDigits: '222'
    });

    expect(
      searchResult
    ).toEqual(expectedResultArray);

  });

  it("has working .replace()", function () {

    const changedStr = roxp1.replace(testString, (g) => g.letters + '-' + g.secondThreeDigits + '-' + g.firstThreeDigits)

    expect(
      changedStr
    ).toEqual('asdf-222-111');

  });

});
