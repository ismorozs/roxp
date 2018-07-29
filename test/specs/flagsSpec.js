const Roxp = require('../../roxp.js');

describe("Roxp flags", function () {

  let roxp1;
  let roxp2;

  it("assigns flags individually to instance", function () {

    const roxp1 = Roxp.withFlags('gi')
      ('globalCaseInsensitve');

    expect(
      roxp1.regExp
    ).toEqual( new RegExp('globalCaseInsensitve', 'gi') );

  });

  it("assigns flags globally", function () {

    Roxp.setFlagsGlobally({ i: true });

    const roxp2 = Roxp('caseInsensitve');

    expect(
      roxp2.regExp
    ).toEqual( new RegExp('caseInsensitve', 'i') );

  });

  afterEach(function () {
    Roxp.setFlagsGlobally({ i: false });
  });

});
