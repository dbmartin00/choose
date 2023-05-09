const fs = require('fs');
const path = require('path');
const readline = require('readline');

let arrows = [];

const directoryPath = './';
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  const storyFiles = files.filter(file => path.extname(file) === '.story');

  // console.log('Files ending with .story:');
  let count = 1;
  storyFiles.forEach(file => {
    // console.log(file);
    const story = fs.readFileSync(file).toString();
    //console.log(story);
    const regex = /\[\[(\?|\d+)-(\?|\d+)\] ([^\]]+)\]/gm;

    // const matches = [story.match(regex)];
    const matches = [...story.matchAll(regex)]    
    // console.log('matches', matches);
    // console.log('file', file);
    const prefix = 's-';
    const suffix = '.story';
    const middle = file.substring(file.indexOf(prefix) + prefix.length, file.indexOf(suffix));
    const sourceChapter = middle.substring(0, middle.indexOf('-'));
    const sourceSection = middle.substring(middle.indexOf('-') + 1);
    // console.log('sourceChapter', sourceChapter);
    // console.log('sourceSection', sourceSection);

    for(const link of matches) {
      const l = {
        source: {
          chapter: sourceChapter,
          section: sourceSection
        },
        destination: {
          chapter: link[1],
          section: link[2],
          description: link[3]
        }
      }
      arrows.push(l);
    }
  });

  // console.log('arrows', arrows);
  const tree = {};
  arrows.forEach((item) => {
    const source = `Chapter ${item.source.chapter}, Section ${item.source.section}`;
    const destination = `Chapter ${item.destination.chapter}, Section ${item.destination.section}`;
    const description = item.destination.description;

    if (!tree[source]) {
      tree[source] = { destination: source, description: '', children: [] };
    }

    tree[source].children.push({ destination, description, children: [] });
  });

  Object.keys(tree).forEach((source) => {
    console.log(source);
    printTree(tree[source]);
    console.log('');
  });    

  let currentChaper = 1;
  let currentSection = 1;

});

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

function printTree(node, prefix = '') {
  if (!node.children.length) return;

  const childCount = node.children.length;
  node.children.forEach((child, index) => {
    const isLast = index === childCount - 1;
    const childPrefix = prefix + (isLast ? '└── ' : '├── ');

    console.log(childPrefix + child.destination);
    console.log(childPrefix + '  Description: ' + child.description);

    printTree(child, prefix + (isLast ? '    ' : '│   '));
  });
}
