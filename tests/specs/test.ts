import {describe, expect, test} from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { file, contents } from '../../src/index';
import { Matter } from '../../src/types';

describe('smart-matter tests', () => {
    test('Get from file path', () => {
        const filePath = path.join(__dirname, '../', 'valid.markdown');
        const sm = file(filePath) as Matter;

        expect(sm.title).toBe('Alter tradere');
        expect(sm.permalink).toBe('alter-tradere');
        expect(sm.file).toBe(filePath);
        expect(typeof sm.lastupdated).toBe('object');
        if(sm.matter){
            expect(sm.matter.length > 0).toBe(true);
        }
        if(sm.content){
            expect(sm.content.length > 0).toBe(true);
        }
        expect(Array.isArray(sm.tags)).toBe(true);
        expect(sm.empty).toBe(false);
        expect(sm.error).toBe('');
    });

    test('Get from file contents', () => {
        const filePath = path.join(__dirname, '../', 'valid.markdown');
        const sm = contents(fs.readFileSync(filePath, 'utf-8')) as Matter;

        expect(sm.title).toBe('Alter tradere');
        expect(sm.permalink).toBe('alter-tradere');
        if(sm.matter){
            expect(sm.matter.length > 0).toBe(true);
        }
        if(sm.content){
            expect(sm.content.length > 0).toBe(true);
        }
        expect(Array.isArray(sm.tags)).toBe(true);
        expect(sm.empty).toBe(false);
        expect(sm.error).toBe('');
    });

    test('Try get from non existant file', () => {
        const filePath = path.join(__dirname, 'non-existant.markdown');
        const sm = file(filePath);

        expect(sm.empty).toBe(true);
        expect(sm.error).toBe('File not found');
    });

    test('Try get from empty string', () => {
        const sm = contents('');

        expect(sm.empty).toBe(true);
        expect(sm.error).toBe('No front matter matched');
    });

    test('Try get from string with no matter', () => {
        const sm = contents('some contents but no matter ---');

        expect(sm.empty).toBe(true);
        expect(sm.error).toBe('No front matter matched');
    });

    test('Invalid matter tags', () => {
        const filePath = path.join(__dirname, '../', 'matter-not-ended.markdown');
        const sm = contents(fs.readFileSync(filePath, 'utf-8'));

        expect(sm.empty).toBe(true);
        expect(sm.error).toBe('No front matter matched');
    });

    test('Invalid date', () => {
        const filePath = path.join(__dirname, '../', 'invalid-date.markdown');
        const sm = contents(fs.readFileSync(filePath, 'utf-8')) as Matter;

        expect(sm.empty).toBe(true);
        expect(sm.error).toBe('Invalid Date');
    });

});