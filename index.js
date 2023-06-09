const fs = require('fs');
const path = require('path');

let arrows = [];

const directoryPath = './story';
fs.readdir(directoryPath, async (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  } else {
    console.log('story cards: ', files.length);
  }

  const storyFiles = files.filter(file => path.extname(file) === '.story');
  // console.log('storyFiles', storyFiles);
  // console.log('Files ending with .story:');
  let count = 1;
  storyFiles.forEach(file => {    
    const story = fs.readFileSync(directoryPath + '/' + file).toString();
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

    const title = story.match(/^.+?(?=\n|$)/)[0]; // first line of story

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
      // console.log('arrow', l);
      arrows.push(l);
    }
  });

  let chapter = 1;
  let section = 1;

  if(fs.existsSync('saved')) {
    // const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));
    // const answer = await question('> You have a saved game. Load it? ');
    const answer = readlineSync.question('You have a saved game. Load it? ');
    console.log(`Answer: ${answer}`);
    if(answer.toLowerCase().startsWith('y')) {
      const jsonStack = fs.readFileSync('saved');
      stack = JSON.parse(jsonStack);
      if(stack.length < 1) {
        chapter = 1;
        section = 1;
      } else {
        chapter = stack[stack.length - 1].chapter;
        section = stack[stack.length - 1].section;
      }
    }
  }

  do {
    story = await showStoryAndTakeChoice(chapter, section);
    chapter = story.chapter;
    section = story.section;
  } while (true);

});

class Node {
    constructor(name) {
        this.name = name;
        this.children = [];
    }

    linkTo(node) {
        this.children.push(node);
    }
}

const readlineSync = require('readline-sync');

function printWithFixedWidth(text, width, height) {
    const words = text.split(' ');
    let line = '';
    let lineCount = 0;

    for (let i = 0; i < words.length; i++) {
        if (line.length + words[i].length <= width) {
            line += words[i] + ' ';
        } else {
            console.log(line);
            line = words[i] + ' ';
            lineCount++;
            if (lineCount % height == 0) {
                readlineSync.question('\n\nPress Enter to continue...\n\n');
                //console.log('\x1Bc'); // optionally clear the screen
            }
        }
    }

    // Print the remaining line (if it's not empty)
    if (line.trim() !== '') {
        console.log(line);
    }
}

let stack = [];

async function showStoryAndTakeChoice(chapter, section) {
  process.stdout.write('\x1Bc');
  printWithFixedWidth(findStory(chapter, section), 80, 12);
  //console.log('stack', stack);
  fs.writeFileSync('saved', JSON.stringify(stack, null, 2));

  let story = {chapter: chapter, section: section};

  // const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));
  // const answer = await question('> Please choose: ');
  let answer = readlineSync.question('Please choose: ');
  console.log(`Answer: ${answer}`);

  if(answer === '') {
    answer = readlineSync.question('Please choose chapter and section (e.g. 1-2), back or exit: ');
    console.log(`Answer: ${answer}`);    
  }

  if(!isChapterAndSection(answer) && answer !== 'exit' && answer !== 'back') {
    console.log('> I do not recognize this answer. Try a chapter - number (e.g. 1-2), back, or exit');    
    return story; // tread water
  } else {
    if(answer === 'exit') {
      process.exit(0);
    } else if (answer === 'back') {
      let backStory = {chapter: 1, section: 1};
      if(stack.length > 1) {
        stack.pop(); // current story
        backStory = stack.pop(); // the one before it
        console.log('> back to ', backStory);
        return backStory;
      } else {
        return {chapter: 1, section: 1 };
      }
    } else {
      const c = answer.substring(0, answer.indexOf('-'));
      const s = answer.substring(answer.indexOf('-')+1);

      if(isLegalChoice(chapter, section, c,s)) {
        story = {chapter: c, section: s}
        stack.push(story);
      } else {
        console.log('> choice not available from here');
      }
    }
  }
  return story;
}

function isLegalChoice(chapter, section, c, s) {
  let result = false;

  for(const arrow of arrows) {
    if(arrow.source.chapter == chapter
      && arrow.source.section == section 
      && arrow.destination.chapter == c
      && arrow.destination.section == s)
       {
      result = true;
      break;
    }    
  }

  return result;
}

function isChapterAndSection(answer) {
  const regex = /(\?|\d+)-(\?|\d+)/;
  return regex.test(answer);
}

function sleep(ms) {
  console.log('waiting for ' + ms + '(ms)');
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });   
}

function findStory(chapter, section) {
  let story;
  for(const arrow of arrows) {
    if(arrow.source.chapter == chapter
      && arrow.source.section == section) {
      story = arrow.source.story;
      break;
    }
  }
  story = chapter + '-' + section + ' ' + story;
  return story;
}

