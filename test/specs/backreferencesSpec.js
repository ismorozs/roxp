const Roxp = require('../../roxp.js');

describe("Roxp named groups and backreferences", function () {

  let roxp1;

  it("places backreferences in right places", function () {

    const roxp1 = Roxp(
      [[
        '\\w', { times: 4 },
        [[ '\\w', { times: 3 } ]], { group: 'threeLetters' },
        [[ '\\d', { times: 3 }]], { group: 'threeDigits' },
        '\\w', { times: 4 }
      ]], { group: 'superString' },
      [{ repeatMatch: 'superString' }],
      [{ repeatMatch: 'threeDigits' }],
      [{ repeatMatch: 'threeLetters' }]
    );

    expect(
      roxp1.regExp
    ).toEqual( new RegExp('(\\w{4,4}(\\w{3,3})(\\d{3,3})\\w{4,4})\\1\\3\\2') );

  });

});
