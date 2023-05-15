# Choose

Create a choose-your-own adventure story, with tools to map the progress of the story and show which sections and chapters are still unwritten.

In each section you'll be given chapter and section markers to choose, like '1-2' or '2-9'.  You must choose from the choices given, or you may also type 'back' (which erases your last choice) or 'exit' (which ends the program).

The program automatically saves your progress and if you exit and then want to start from where you were playing, just say 'yes' to loading your game when prompted at startup.

```javascript
git clone <repository url>
npm install
node index.js
```

That launches the adventure.  The choices available at the end of each "card" are chapter and section (e.g. 1-2), usually two choices.  You can 'exit' any time and your game will be saved.  When you launch with a saved game, it will prompt you to start from the saved game.  You can type 'back' any time to go to the previou section.

