const l = require('lucide-react');
const names = Object.keys(l).filter(k => /insta|twitter|x/i.test(k)).sort();
console.log(names.join('\n'));
