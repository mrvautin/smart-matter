const {
    serial: test
} = require('ava');
const path = require('path');
const fs = require('fs');
const h = require('../helper');
const { file, contents } = require('../../lib/index');

test('Get from file path', async t => {
    const filePath = path.join(__dirname, '../', 'valid.markdown');
    const sm = file(filePath);

    t.is(sm.title, 'Alter tradere');
    t.is(sm.permalink, 'alter-tradere');
    t.is(sm.file, filePath);
    t.is((sm.lastupdated instanceof Date), true);
    t.is(h.greaterThan(sm.matter.length, 0), true);
    t.is(h.greaterThan(sm.content.length, 0), true);
    t.is(Array.isArray(sm.tags), true);
    t.is(sm.empty, false);
    t.is(sm.error, null);
});

test('Get from file contents', async t => {
    const filePath = path.join(__dirname, '../', 'valid.markdown');
    const sm = contents(fs.readFileSync(filePath, 'utf-8'));

    t.is(sm.title, 'Alter tradere');
    t.is(sm.permalink, 'alter-tradere');
    t.is(h.greaterThan(sm.matter.length, 0), true);
    t.is(h.greaterThan(sm.content.length, 0), true);
    t.is(Array.isArray(sm.tags), true);
    t.is(sm.empty, false);
    t.is(sm.error, null);
});

test('Try get from non existant file', async t => {
    const filePath = path.join(__dirname, 'non-existant.markdown');
    const sm = file(filePath);

    t.is(sm.empty, true);
    t.is(sm.error, 'File not found');
});

test('Try get from empty string', async t => {
    const sm = contents('');

    t.is(sm.empty, true);
    t.is(sm.error, 'No front matter matched');
});

test('Try get from string with no matter', async t => {
    const sm = contents('some contents but no matter ---');

    t.is(sm.empty, true);
    t.is(sm.error, 'No front matter matched');
});

test('Invalid matter tags', async t => {
    const filePath = path.join(__dirname, '../', 'matter-not-ended.markdown');
    const sm = contents(fs.readFileSync(filePath, 'utf-8'));

    t.is(sm.empty, true);
    t.is(sm.error, 'No front matter matched');
});

test('Invalid date', async t => {
    const filePath = path.join(__dirname, '../', 'invalid-date.markdown');
    const sm = contents(fs.readFileSync(filePath, 'utf-8'));

    t.is(sm.date, 'invalid');
    t.is(sm.dateObject, null);
    t.is(sm.dateISO, null);
    t.is(sm.empty, false);
    t.is(sm.error, null);
});
