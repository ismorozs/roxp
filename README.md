# Roxp
Easy to use library for creating regular expressions of any complexity through combining built-in data types such as ```Strings```, ```Objects``` and ```Arrays```, as well as ```Roxp``` objects themselves.  
Hence the name ```Roxp``` coming from **R**egular **O**bjective e**XP**ression.

## Why?
Because the longer the regular expressions is in its classical primordial form the harder it is to read, to understand, and to maintain.
For example take a look at this regular expression below.
```js
/(\w{4,4})-(\d{3,3})-(\w{4,4}-\(\d{7,9}\+\d{2,4}\))-\(\{\3\}\2\|\1\)/
```
WHAT?! HOW?! WHY?!  
Someone must have had resembling RegExp in their projects, and surely someone must have had even worse.
With ```Roxp``` you could create regular expression such as above writing code bellow
```js
$ = Roxp.specialCharacters();
const fourLetters = Roxp($.letter, { times: 4 });
const threeDigits = Roxp($.digit, { times: 3 });

const myIncredibleRegExp = Roxp(
  fourLetters, { group: 'firstLettersGroup' },
  '-' ,
  threeDigits, { group: 'digitsGroup' },
  '-',
  [[
    fourLetters,
    '-',
    $['('],
      $.digit, { inRange: [7,9] }, $['+'], $.digit, { inRange: [2,4] },
    $[')'],
  ]], { group: 'foobar' },
  '-',
  $['('],
    $['{'], [{ repeatMatch: 'foobar' }], $["}"],
    [{ repeatMatch: 'digitsGroup' }],
    $['|'],
    [{ repeatMatch: 'firstLettersGroup' }],
  $[')']
)
// => Roxp { regExp: /(\w{4,4})-(\d{3,3})-(\w{4,4}-\(\d{7,9}\+\d{2,4}\))-\(\{\3\}\2\|\1\)/g }
```
and then through methods on created ```Roxp``` instance fetch named capturing groups from string like this 
```js
const string = "aaaa-123-bbbb-(1234567+123)-({bbbb-(1234567+123)}123|aaaa)"
```
(someone must have had to match string like this in their projects) through
```js
const result = myIncredibleRegExp.search(string)
console.log(result.digitsGroup)
// => "123"
console.log(result.firstLettersGroup)
// => "aaaa"
console.log(result.foobar)
// => "bbbb-(1234567+123)"
```
Surely, constructing regular expressions with ```Roxp``` takes up more lines, but at the same time they are easier to write, read and understand. You can format your expression with as many whitespaces as you want. As well as forget about escaping special characters or figuring out where what group and backreference is. With ```Roxp``` you can give capturing groups names, to refer to those groups later for backreferencing or retriving those captured groups in ```Roxp``` instance methods.

## How to install
Install library through
```sh
npm install roxp
```
then include with
```js
var Roxp = require('roxp')
```
or
```js
import Func from 'roxp'
```
in your script file.

```roxp.js``` and ```roxp.min.js``` also can be included on the client through ```script``` tag, should you choose to use it without any bundler. 
## How to use
```Roxp``` function takes unlimited number of arguments, most of which could be considered sub-RegExp in themselves, and combine them together generating one more complex RegExp.
Still arguments must comply some rules, so that the function would understand what do you want from it.
Arguments passing to the function can be:

| Appearance | Name | Explanation | Example argument(s) | Produced RegExp |
|------------|------|-------------|---------------------|-----------------|
| `'string'`| String | simple string| `'string'`|  `/string/` |
| `[ ]`| Character set| simple character set| `['sym','blols', '0-9']` | `/[symbols0-9]/`|
| `[[ ]]` | Grouping | everything inside double brackets will be considered as a logical unit when applying options on the right in the arguments list| `[[ 'string', [0-9] ]], { onceOrMore: true }` |  `/(?:string[0-9])+/` |
| `[{ }]` | Backreference | backreference to the group defined earlier | `'\\w', { group: 'a' }, [{ repeatMatch: 'a' }]` | `/(\w)\1/` |
| `{ }` | Options| options from the object will be applied to the argument on the left in the arguments list | `'x', { times: 5 }` | `/x{5,5}/` |

Passing ```Roxp``` instance into ```Roxp``` function  will copy RegExp of a given instance into a new RegExp produced by function.
Notice: ```Roxp``` produces RegExp from strings (of type `String`) without any transformation of them.  
So the following produced ```Roxp``` instances are identical
```js
const objectiveApproach = Roxp(
    '\\d', { times: 3 },
    '-',
    '\\d', { times: 2 },
    '-',
    '\\d', { times: 2 }
);
const straightStringApproach = Roxp('\\d{3,3}-\\d{2,2}-\\d{2,2}');

console.log(objectiveApproach.regExp.source === straightStringApproach.regExp.source);
// => true
```
(There's a paragraph later in the readme about stopping writing special characters such as ```\\w``` and backslashes by hand, but some examples still use straight-backslashed approaches)

### Options
You modify argument-sub-RegExps in different ways by following them with objects with options
Full list of options is shown bellow.
#### Quantifiers
You add them to explain how many repeating symbols you want to match

| Option appearance | Example arguments | Produced RegExp |
|-------------------|-------------------|-----------------|
| { '>' } | `'x', { '>': 2  }` | `/x{3,}/` |
| { '<' } | `'x', { '<': 4  }` | `/x{,3}/` |
| { '>=' } | `'x', { '>=': 2  }` | `/x{2,}/` |
| { '<=' } | `'x', { '<=': 2  }` | `/x{,2}/` |
| { '=' } | `'x', { '=': 2  }` | `/x{2,2}/` |
| { times } | `'x', { times: 3  }` | `/x{3,3}/` |
| { inRange } | `'x', { inRange: [3,7]  }` | `/x{3,7}/` |
| { onceOrNever } | `'x', { onceOrNever: true  }` | `/x?/` |
| { onceOrMore } | `'x', { onceOrMore: true  }` | `/x+/` |
| { zeroOrMore } | `'x', { zeroOrMore: true  }` | `/x*/` |

Any quantifier additionally  can be followed by `lazy` option, making this quantifier lazy.  

Examples:

| Option appearance | Example arguments | Produced RegExp |
|-------------------|-------------------|-----------------|
| { onceOrMore, lazy } | `'x', { onceOrMore: true, lazy: true }` | `/x+?/` |
| { zeroOrMore, lazy } | `'x', { zeroOrMore: true, lazy: true  }` | `/x*?/` |

If it is a grouping (```[[ ]]```) you want to apply quantifier options to, and you didn't specified a group name of this given grouping, grouping will be enclosed in non-capturing group (```(?:)```).

| Option appearance | Example arguments | Produced RegExp |
|-------------------|-------------------|-----------------|
| { onceOrMore } | `[[ '\\w', [1,2,3], '\\w' ]], { onceOrMore: true }` | `/(?:\w[123]\w)+/` |

#### Alternation
If you want to capture either of strings in your RegExp, you put alternation symbol (```|```) between those strings.  
Or with ```Roxp``` you add option ```{ eitherOne }``` to the right of the grouping.

| Option appearance | Example arguments | Produced RegExp |
|-------------------|-------------------|-----------------|
| { eitherOne } | `[[ 'aaa', 'bbb', 'ccc' ]], { eitherOne: true }` | `/aaa\|bbb\|ccc/` |

#### Negating
Use negate option if you don't want your RegExp to match against particular symbols

| Option appearance | Example arguments | Produced RegExp |
|-------------------|-------------------|-----------------|
| { mustNotMatch } | `['abc'], { mustNotMatch: true  }` | `/[^abc]/` |
|| `'x', { mustNotMatch: true }` | `/(?!x)/` |
|| `[[ 'x', 'y', { times: 3 }, 'z']], { mustNotMatch: true }` | `/(?!xy{3,3}z)/` |

#### Capturing groups naming
Give a capturing group a name to refer to it later in methods or for backreferencing

| Option appearance | Example arguments | Produced Roxp object |
|-------------------|-------------------|----------------------|
| { group } | `'string', { group: 'string'  }` | `Roxp { regExp: /(string)/, groups: ['string'] }` |
|| `[['x', 'y', 'z']], { group: 'xyz'  }` | `Roxp { regExp: /(xyz)/, groups: ['xyz'] }` |

```prefixGroups``` option is used to resolve group naming conflicts between passed ```Roxp``` instances that may have the same group names. |

Example:
```js
const childRoxp = Roxp('qwerty', { group: 'childGroup' });
Roxp(
  childRoxp, { prefixGroups: 'first' },
  childRoxp, { prefixGroups: 'second' }
);
// => Roxp { regExp: /(qwerty)(qwerty)/, groups: ['firstChildGroup', 'secondChildGroup'] }
```
To create capturing group you don't acutally have to give it a meaningful name. 
```{ group: true }``` is legitimate option, but this way you probably won't be able to reference such a group by name in future.

| Example arguments | Produced Roxp object |
|-------------------|-----------------|
| `'nameless', { group: 'true'  }` | `Roxp { regExp: /(nameless)/, groups: [true] }` |

#### Backreferencing
Put backreferences (backslash + group number) in places where you expect exact symbolic matches to already matched groups at run-time.
Example of backreference:
```js
const regExp = /(\w{3})\1/;
regExp.test('aaaaaa');
// => true
regExp.test('aaabbb');
// => false
```
To make use of backreferencing with ```Roxp```, you pass argument of such format ```[{ repeatMatch: definedGroupName }]``` to ```Roxp``` function. 
Example:
```js
const roxp = Roxp(
    [[ '\\w', { times: 3 } ]],  { group: 'letters' },
    [{ repeatMatch: 'letters' }]
);
roxp.test('aaaaaa');
// => true
```
---
### Instance Methods
Every ```Roxp``` instance holds within a group of methods which mostly just delegate execution to underlying RegExp or String objects.  
But there're exceptions.
#### Roxp#test (String stringToTest)
#### Roxp#check (String stringToTest)
Two methods with the same behavior. Checks if ```stringToTest``` argument is matched against underlying RegExp and returns ```true``` or ```false```, accordingly.
Equivalent to ```RegExp#test```
```js
Roxp('string').test('string');
// => true
```
#### Roxp#find (String stringToFindGroups)
#### Roxp#exec (String stringToFindGroups)
#### Roxp#search (String stringToFindGroups)
Three methods with the same behavior. Checks if ```stringToFindGroups``` is matched and returns an array-object of matched strings, groups, index, etc. Behaves in the same way as ```RegExp#exec```, but in addition adds named capturing groups in the result set.
```js
Roxp(
    [[ '\\w', { times: 3 } ]], { group: 'letters' },
    '-',
    [[ '\\d', { times: 3 } ]], { group: 'digits' }
).search('zxc-123');
// => [ letters: 'zxc', digits: '123', ... ]
```
#### Roxp#replace (String stringToReplace, Function replaceFunction)
Finds and replaces matches in the string. Resembles behavior of ```String#replace```.  
```replaceFunction``` will perform replacing on matched snippets in ```stringToReplace``` string.  
```replaceFunction``` takes in one object, which holds all found matches on the ```stringToReplace```, as well as index, etc.
```js
Roxp(
    [[ '\\w', { times: 3 } ]], { group: 'letters' },
    '-',
    [[ '\\d', { times: 3 } ]], { group: 'digits' }
).replace('zxc-123', (matches) => matches.digits + '-' + matches.letters);
// => '123-zxc'
```
### Special characters
For simplicity purposes ```Roxp``` can prodivde an object with all (or at least most) special regular expression characters as well as escaped variants of special character to put them in ```Roxp``` constructor without backslashes.
To get hold of that object, you call ```Roxp#specialCharacters```
```js
const $ = Roxp.specialCharacters();
// => { letter: '\\w', digit: '\\d', space: '\\s', ... }
```
and then you use this object values for easier creation of RegExp that requiere use of special characters, forgetting about counting backslashes before each of them at the same time.

| Special character key | Produced RegExp | In plain string |
|-----------------------|-----------------|-----------------|
| `$.letter` |  `/\w/` | `\\w`|
| `$.digit` |  `/\d/` | `\\d`
| `$.space` |  `/\s/` | `\\s`
| `$.wordBoundary` |  `/\b/` | `\\b`
| `$.bound` |  `/\b/` | `\\b`
| `$.notLetter` |  `/\W/` | `\\W`
| `$.notDigit` |  `/\D/` | `\\D`
| `$.notSpace` |  `/\S/` | `\\S`
| `$.notWordBoundary` |  `/\B/` | `\\B`
| `$.notBound` | `/\B/` | `\\B`
| `$.tab` | `/\t/` | `\\t`
|    `$.dot` | `/\./` | `\\\.`
|    `$['.']` | `/\./` | `\\\.`
| `$['\\']` | `/\\/` | `\\\\`
|    `$['$']` | `/\$/` | `\\\$`
|    `$['^']` | `/\^/` | `\\\^`
|    `$['\|']` | `/\\|/` | `\\\|`
|    `$['?']` | `/\?/` | `\\\?`
|    `$['*']` | `/\*/` | `\\\*`
|    `$['+']` | `/\+/` | `\\\+`
|    `$['(']` | `/\(/` | `\\\(`
|    `$[')']` | `/\)/` | `\\\)`
|    `$['{']` | `/\{/` | `\\\{`
|    `$['}']` | `/\}/` | `\\\}`
|    `$['[']` | `/\[/` | `\\\[`
|    `$[']']` | `/\]/` | `\\\]`
| `$.newLine` | `/\n/` | `\\n`
| `$.lf` | `/\\n/` | `\\n`
| `$.cr` | `/\\r/` | `\\r`
| `$.feed` | `/\f/`| `\\f`
|`$.start` |  `/^/` | `^`
|`$.end` |  `/$/` | `$`
|`$.anything` |  `/./` | `.`
|`$.any` |  `/./` | `.`

### Flags
Setting flags can be done individually for every ```Roxp``` instance through ```Roxp.withFlags()``` method, which will return constructor ```Roxp``` function saving in memory that this particular instance should be with given flags.  
Example:

```js
Roxp.withFlags('gi')('globalCaseInsensitve');
// => Roxp { regExp: /globalCaseInsensitve/gi }
```

You can set flags globally as well for every created ```Roxp``` instance after settings given flags, using method ```Roxp.setFlagsGlobally()```  

```setFlagsGlobally()``` takes in one object argument of format ```{ flagName: boolean, ... }```, and then adds ```true``` flags and removes ```false``` flags to/from set of global ```Roxp``` flags.
Example:
```js
const a = Roxp('a');
// => Roxp { regExp: /a/ }

Roxp.setFlagsGlobally({ g: true, i: true });
const b = Roxp('b');
// => Roxp { regExp: /b/gi }
// all created instances will have 'g' and 'i' flags from now

Roxp.setFlagsGlobally({ i: false });
const c = Roxp('c');
// => Roxp { regExp: /c/g }
// 'i' flag was removed, only 'g' is left
```

---
### Issues and bug tracking 
If for some reason ```Roxp``` didn't create RegExp expected by you. Author would be glad to learn about and fix such instances.
