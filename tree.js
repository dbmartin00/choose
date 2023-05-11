const fs = require('fs');
const path = require('path');
const readline = require('readline');

// const d3 = require('d3');
// const sharp = require('sharp');
// const { JSDOM } = require('jsdom');
const d3 = require('d3');
const sharp = require('sharp');
const { JSDOM } = require('jsdom');

let arrows = [];
let nodes = [];

const directoryPath = './';
fs.readdir(directoryPath, async (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  const storyFiles = files.filter(file => path.extname(file) === '.story');
  // console.log('storyFiles', storyFiles);
  // console.log('Files ending with .story:');
  let count = 1;
  storyFiles.forEach(file => {    
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

    // console.log('id', sourceChapter + '-' + sourceSection);
    // console.log('sourceChapter', sourceChapter);
    // console.log('sourceSection', sourceSection);

    const title = story.match(/^.+?(?=\n|$)/)[0]; // first line of story
    // if(sourceSection == 10) {
    //   console.log('title', title);
    //   console.log('matches', matches);
    // }  

    for(const link of matches) {
      const l = {
        title: title,
        source: {
          chapter: sourceChapter,
          section: sourceSection,
          story: story
        },
        destination: {
          chapter: link[1],
          section: link[2],
          description: link[3]
        }
      }
      // console.log('l', l);
      arrows.push(l);
    }
  });
  // console.log('arrows', arrows);
  let nodeSet = new Set();
  for(const arrow of arrows) {
    const id = arrow.source.chapter + '-' + arrow.source.section;
    // console.log('id', id);
    if(!nodeSet.has(id)) {
      nodes.push({
        id: id,
        title: arrow.title,
        chapter: arrow.source.chapter,
        section: arrow.source.section
      });
      nodeSet.add(id);
    }
  }
  console.log('nodes', nodes);

  let links = [];
  for(const arrow of arrows) {
    // console.log('arrow', arrow);
    const source = arrow.source.chapter + '-' + arrow.source.section;
    links.push({
      source: source, 
      target: arrow.destination.chapter + '-' + arrow.destination.section
    })
  }
  console.log('links', links);

  drawTree('1-1', '', links);

});

let count = 0;
let seen = new Set();
function drawTree(id, tab, links) {
    console.log(tab + id + ': ' + getTitle(id));
    if(!seen.has(id)) {
      seen.add(id);
      for(const link of links) {
        if(link.source === id && link.source !== link.target) {
          drawTree(link.target, tab + '--', links);
        }
      }
    } 
}

function getTitle(id) {
  let result = 'title not found';

  for(const node of nodes) {
    if(node.id === id) {
      result = node.title;
      break;
    }
  }

  return result;
}

function sleep(ms) {
  console.log('waiting for ' + ms + '(ms)');
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });   
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

