const yaml = require('js-yaml');
const md5 = require('md5');
const fs = require('fs');

// Regex
const metaRegex = /(?<=---)(.*?)(?=---)/sm;
const bodyRegex = /---.*?---/s;

const file = (filepath) => {
    // Check file exists
    if(!fs.existsSync(filepath)){
        return { empty: true, error: 'File not found' };
    }

    const fileContents = fs.readFileSync(filepath, 'utf-8');
    return matter(fileContents, { type: 'file', file: filepath });
};

const contents = (contents) => {
    return matter(contents);
};

const matter = (contents, opts) => {
    const matterMatch = contents.match(metaRegex);

    // Check for matter
    if(!matterMatch || !matterMatch[0]){
        return { empty: true, error: 'No front matter matched' };
    }

    // Setup matter
    const matter = yaml.load(matterMatch[0]);
    matter.matter = matterMatch[0];

    if(opts && opts.type === 'file'){
        matter.file = opts.file;
        matter.lastupdated = fs.statSync(opts.file).mtime;
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
            matter.dateObject = null;
            matter.dateISO = null;
        }
    }

    // No errors
    matter.error = null;
    matter.empty = false;

    // Return matter
    return matter;
};

module.exports = {
    file,
    contents
};
