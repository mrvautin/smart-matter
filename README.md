# Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save smart-matter
```

## How does it work

`smart-matter` parses front-matter either from a file path or from a string containing `front-matter`.

If supplied, `smart-matter` will parse a `date` input into a Javascript Date Object. When using the `file`(path) API, `smart-matter` will return last modified date of the file.

# API

## File

Input is a string with the full path to the input file.

**Params**

* `input` **{String}**: A full path string to the file with `front matter`.

## Contents

Input is a string contents which returns an object.

**Params**

* `input` **{String}**: String with the contents of the file with `front matter`.

# Examples

## file (path)

```js
const path = require('path');
const { file } = require('smart-matter');
const sm = file(path.join(__dirname, 'file.markdown'));
console.log('matter', sm);
```

This assumes that `file.markdown` is formatted similar to this:

``` yaml
---
title: Hello World
permalink: hello-world
date: '2021-07-03 19:17:00'
tags: 
  - my
  - tags
---

## Hello world
```

`smart-matter` will parse this file and return an object like this:

```javascript
{
    title: "Hello World",
    permalink: "hello-world",
    date: "2021-07-03 19:17:00",
    tags: [ "my", "tags" ],
    matter: "title: Hello World\n
        permalink: hello-world\n
        date: 2021-07-03 19:17:00\n
        tags: \n
          - my\n
          - tags\n",
    file: "/Users/mark/Documents/Code/smart-matter/tests/test.markdown",
    lastupdated: 2021-08-03T06:45:46.170Z,
    hash: "b10a8db164e0754105b7a99be72e3fe5",
    content: "\n\n## Hello world",
    dateObject: 2021-07-03T09:47:00.000Z,
    dateISO: "2021-07-03T09:47:00.000Z",
    error: null,
    empty: false
}
```

## contents (string)

```js
const fs = require('fs');
const { contents } = require('smart-matter');
const filePath = fs.readFileSync('file.markdown', 'utf8');
const sm = contents(filePath);
console.log('matter', sm);
```

This assumes that `file.markdown` is formatted similar to this:

``` yaml
---
title: Hello World
permalink: hello-world
date: '2021-07-03 19:17:00'
tags: 
  - my
  - tags
---

## Hello world
```

`smart-matter` will parse this file and return an object like this:

```javascript
{
    title: "Hello World",
    permalink: "hello-world",
    date: "2021-07-03 19:17:00",
    tags: [ "my", "tags" ],
    matter: "title: Hello World\n
        permalink: hello-world\n
        date: 2021-07-03 19:17:00\n
        tags: \n
          - my\n
          - tags\n",
    hash: "b10a8db164e0754105b7a99be72e3fe5",
    content: "\n\n## Hello world",
    dateObject: 2021-07-03T09:47:00.000Z,
    dateISO: "2021-07-03T09:47:00.000Z",
    error: null,
    empty: false
}
```

## Object returned

Added values to the object are:

- `matter`: **{String}** The raw front-matter string
- `content`: **{String}** The contents of the file outside of the front-matter data
- `date`: **{String}** The original date value
- `dateObject`: **{Date}** The `date` value parsed onto a Javascript Date
- `dateISO`: **{String}** The `date` value parsed and formatted into an ISO Date
- `hash`: **{String}** This is the `md5` hash of the front-matter title (if supplied)
- `lastupdated`: **{Date}** The last updated value of the file on the disk 

> Note: When using the `file` API more options are returned. Eg: `file` (the input file path) and `lastupdated` (the last updated date of the file on the disk)