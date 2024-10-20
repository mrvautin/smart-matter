import yaml from 'js-yaml';
import md5 from 'md5';
import fs from 'fs';
import { Matter, MatterOptions } from './types';

// Regex
const metaRegex = /(?<=---)(.*?)(?=---)/sm;
const bodyRegex = /---.*?---/s;

export const file = (filepath: string) => {
    // Check file exists
    if(!fs.existsSync(filepath)){
        return { empty: true, error: 'File not found' };
    }

    const fileContents = fs.readFileSync(filepath, 'utf-8');
    return matter(fileContents, { type: 'file', file: filepath });
};

export const contents = (contents: string) => {
    return matter(contents, {});
};

const matter = (contents: string, opts: MatterOptions) => {
    const matterMatch = contents.match(metaRegex);

    // Check for matter
    if(!matterMatch || !matterMatch[0]){
        return { empty: true, error: 'No front matter matched' };
    }

    // Setup matter
    const matter = yaml.load(matterMatch[0]) as Matter;
    matter.matter = matterMatch[0];

    if(opts && opts.type === 'file'){
        matter.file = opts.file || '';
        matter.lastupdated = fs.statSync(matter.file).mtime;
    }

    // If we have a title, generate a md5 hash
    if(matter.title){
        matter.hash = md5(matter.title);
    }

    const body = contents.replace(bodyRegex, '');
    matter.content = body;

    // If we have a date, parse it
    if(matter.date){
        try{
            matter.dateObject = new Date(matter.date);
            matter.dateISO = new Date(matter.date).toISOString();
        }catch(ex){
            return { empty: true, error: 'Invalid Date' };
        }
    }

    // No errors
    matter.error = '';
    matter.empty = false;

    // Return matter
    return matter;
};