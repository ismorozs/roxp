const Roxp = require('../../roxp.js');

describe("Roxp", function () {

  let roxp1;
  let roxp2;

  it("throws error when option is not valid", function () {

    try {
      Roxp('asdf', { notValidOption: true });

    } catch (e) {

      expect(
        e.message
      ).toEqual("'notValidOption' isn't a valid option to pass into Roxp constructor");

    }

  });

  it("throws error when backreference references to not existing group", function () {

    try {

      Roxp('asdf', { group: 'validGroup' }, [{ repeatMatch: 'invalidGroup' }] );

    } catch (e) {

      expect(
        e.message
      ).toEqual("Trying to setup a backreference to not existing group 'invalidGroup'");

    }

  });

});
