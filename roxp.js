(function (globalObj, isModuleGlobal) {

  const specialChararacters = {
    letter: '\\w',
    digit: '\\d',
    space: '\\s',
    wordBoundary: '\\b',
    bound: '\\b',
    notLetter: '\\W',
    notDigit: '\\D',
    notSpace: '\\S',
    notWordBoundary: '\\B',
    notBound: '\\B',
    start: '^',
    end: '$',
    anything: '.',
    any: '.',
    tab: '\\t',
    newLine: '\\n',
    lf: '\\n',
    cr: '\\r',
    feed: '\\f',
    dot: '\\\.',
    '\\': '\\\\',
    '.': '\\\.',
    '$': '\\\$',
    '^': '\\\^',
    '|': '\\\|',
    '?': '\\\?',
    '*': '\\\*',
    '+': '\\\+',
    '(': '\\\(',
    ')': '\\\)',
    '{': '\\\{',
    '}': '\\\}',
    '[': '\\\[',
    ']': '\\\]',
  };

  const globalFlags = {}

  buildInstance.specialCharacters = () => specialChararacters;
  buildInstance.setFlagsGlobally = (newFlags) => Object.assign(globalFlags, newFlags);
  buildInstance.withFlags = (localFlags) => function () {
    return new Roxp(arguments, localFlags);
  };

  if (isModuleGlobal) {
    globalObj.exports = buildInstance;
  } else {
    globalObj.Roxp = buildInstance;
  }

  function buildInstance () {
    return new Roxp(arguments);
  }

  function Roxp (buildParts, localFlags) {
    const result = buildRegExp(buildParts);
    this.groups = result.groups;
    this.backreferences = result.backreferences;
    this.regExpStr = setupBackreferences(result.regExpStr, result.groups, result.backreferences);
    const flags = localFlags ||  getTrueKeys(globalFlags);
    this.regExp = new RegExp(this.regExpStr, flags);
  }

  function buildRegExp (buildParts, parentOpts = {}) {
    const regExpStrs = [];
    const groups = [];
    const backreferences = {};

    for (let i = 0; i < buildParts.length; i++) {
      const buildPart = buildParts[i];
      const partOpts = ( isObject(buildParts[ i + 1 ]) && !isRoxpInstance(buildParts[i + 1]) ) ? buildParts[ ++i ] : {};
      const partType = determinePartType(buildPart);

      let regExpStr = '';
      let subBuildPart = {};

      switch (partType) {
        case 'grouping':
          subBuildPart = buildRegExp(buildPart[0], partOpts);
          regExpStr = subBuildPart.regExpStr;

          break;

        case 'instance':
          subBuildPart = { groups: buildPart.groups.slice() };
          regExpStr = buildPart.regExpStr;

          break;

        case 'backreference':
          const backreferenceName = buildPart[0].repeatMatch;
          const uniqueStrId =  'UNIQUE_STR_ID_PREFIX_YOURE_SUPPOSED_TO_NEVER_MEET_' + backreferenceName + '_' + Date.now();
          regExpStr = uniqueStrId;
          backreferences[backreferenceName] = uniqueStrId;

          break;

        case 'characterSet':
          regExpStr = '[' + ((partOpts.mustNotMatch) ? '^' : '') + buildPart.join('') + ']';
          break;

        default:
          regExpStr = buildPart;
          break;
      }

      const quantifier = prepareQuantifier(partOpts);

      if (partOpts.mustNotMatch && partType !== 'characterSet') {
        regExpStr = '(?!' + regExpStr + ')';

      } else if (partOpts.group) {
        regExpStr = '(' + regExpStr + ')';
        groups.push(partOpts.group);

      } else if (
        (quantifier && partType === 'grouping') ||
        (quantifier && partType === 'string' && !isSpecialCharacter(regExpStr) && regExpStr.length > 1)
      ) {
        regExpStr = '(?:' + regExpStr + ')';

      }

      regExpStr += quantifier;
      regExpStrs.push(regExpStr);

      if (subBuildPart.groups) {
        if (partOpts.prefixGroups) {
          subBuildPart.groups = subBuildPart.groups.map((groupName) => partOpts.prefixGroups + capitalize(groupName))
        }

        groups.splice.apply(groups, [ groups.length, 0 ].concat(subBuildPart.groups));
      }

      if (subBuildPart.backreferences) {
        Object.assign(backreferences, subBuildPart.backreferences);
      }
    }

    const stringJoiner = (parentOpts.eitherOne) ? '|' : '';

    return {
      regExpStr: regExpStrs.join(stringJoiner),
      groups,
      backreferences,
    };
  }

  function determinePartType (buildPart) {
    if (isRoxpInstance(buildPart)) {
      return 'instance';
    }

    if (isArray(buildPart) && isArray(buildPart[0]) && buildPart.length === 1) {
      return 'grouping';
    }

    if (isArray(buildPart) && isObject(buildPart[0]) && buildPart.length === 1) {
      return 'backreference';
    }

    if (isArray(buildPart)) {
      return 'characterSet';
    }

    return 'string';
  }

  function prepareQuantifier (options) {
    const numberedQuantifier = ['{', null, ',' , null, '}'];
    let specialQuantifier = '';

    for (let optKey in options) {
      let optVal = options[optKey];
      switch (optKey) {
        case '>':
          numberedQuantifier[1] = ++optVal;
          break;
        case '<':
          numberedQuantifier[3] = --optVal;
          break;
        case '>=':
          numberedQuantifier[1] = optVal;
          break;
        case '<=':
          numberedQuantifier[3] = optVal;
          break;
        case '=':
        case 'times':
          numberedQuantifier[1] = numberedQuantifier[3] = optVal;
          break;
        case 'inRange':
          numberedQuantifier[1] = optVal[0];
          numberedQuantifier[3] = optVal[1];
          break;
        case 'onceOrNever':
          numberedQuantifier[1] = numberedQuantifier[3] = null;
          specialQuantifier = '?';
          break;
        case 'onceOrMore':
          numberedQuantifier[1] = numberedQuantifier[3] = null;
          specialQuantifier = '+';
          break;
        case 'zeroOrMore':
          numberedQuantifier[1] = numberedQuantifier[3] = null;
          specialQuantifier = '*';
      }
    }

    let quantifier = (numberedQuantifier[1] || numberedQuantifier[3]) ? numberedQuantifier.join('') : specialQuantifier;

    if (options.lazy) {
      quantifier += '?';
    }

    return quantifier;
  }

  function setupBackreferences (regExpStr, groups, backreferencesObj) {
    for (let groupName in backreferencesObj) {
      const backreferenceIdx = groups.indexOf(groupName) + 1;
      regExpStr = regExpStr.replace(backreferencesObj[groupName], "\\" + backreferenceIdx);
    }
    return regExpStr;
  }

  /******************************************************************************

    GENERAL HELPERS

  *******************************************************************************/

  function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  function isObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  function isRoxpInstance (obj) {
    return obj instanceof Roxp;
  }

  function isSpecialCharacter (obj) {
    return obj.length === 2 && obj.indexOf('\\') === 0;
  }

  function capitalize (str) {
    return str[0].toUpperCase() + str.substr(1)
  }

  function getTrueKeys (obj) {
    let str = '';
    for (let k in obj) {
      if (obj[k]) {
        str += k;
      }
    }
    return str;
  }

  /******************************************************************************

    PROXY METHODS FOR WORKING WITH REGEXP

  *******************************************************************************/

  Roxp.prototype.test = Roxp.prototype.check = function (str) {
    return this.regExp.test(str);
  };

  function fillNamedGroupsObj (groups, result) {
    const groupsObj = {};

    groups.forEach((groupName, idx) => {
      if (result[ idx + 1 ]) {
        groupsObj[ groups[idx] ] = result[idx + 1];
      }
    });

    return groupsObj;
  }

  Roxp.prototype.find = Roxp.prototype.exec = Roxp.prototype.search = function (str) {
    const result = this.regExp.exec(str);
    if (result) {
      Object.assign(result, fillNamedGroupsObj(this.groups, result));
    }
    return result;
  };

  Roxp.prototype.replace = function (str, replacementFn) {
    const that = this;
    return str.replace(this.regExp, function () {
      const matchedData = Array.prototype.slice.call(arguments, 0, -2);
      Object.assign(
        matchedData,
        fillNamedGroupsObj(that.groups, matchedData),
        { index: arguments[ arguments.length - 2 ], input: str }
      );
      return replacementFn.call(this, matchedData);
    });
  }

})(typeof module !== 'undefined' ? module : window, typeof module !== 'undefined');