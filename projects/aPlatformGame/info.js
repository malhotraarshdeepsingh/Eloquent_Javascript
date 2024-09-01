// The game
// Our game will be roughly based on Dark Blue (www.lessmilk.com/games/10) by Thomas Palef. I chose that game because it is both entertaining and minimalist and because it can be built without too much code. It looks like this:
// The dark box represents the player, whose task is to collect the yellow boxes (coins) while avoiding the red stuff (lava). A level is completed when all coins have been collected.
// The player can walk around with the left and right arrow keys and can jump with the up arrow. Jumping is this game character’s specialty. It can reach several times its own height and can change direction in midair. This may not be entirely realistic, but it helps give the player the feeling of being in direct control of the on-screen avatar.
// The game consists of a static background, laid out like a grid, with the moving elements overlaid on that background. Each field on the grid is either empty, solid, or lava. The moving elements are the player, coins, and certain pieces of lava. The positions of these elements are not constrained to the grid—their coordinates may be fractional, allowing smooth motion.

// The technology
// We will use the browser DOM to display the game, and we’ll read user input by handling key events.
// The screen- and keyboard-related code is only a small part of the work we need to do to build this game. Since everything looks like colored boxes, drawing is uncomplicated: we create DOM elements and use styling to give them a background color, size, and position.
// We can represent the background as a table, since it is an unchanging grid of squares. The free-moving elements can be overlaid using absolutely positioned elements.
// In games and other programs that should animate graphics and respond to user input without noticeable delay, eﬀiciency is important. Although the DOM was not originally designed for high-performance graphics, it is actually better at this than you would expect. You saw some animations in Chapter 14. On a modern machine, a simple game like this performs well, even if we don’t worry about optimization very much.

// Levels
// We’ll want a human-readable, human-editable way to specify levels. Since it is okay for everything to start out on a grid, we could use big strings in which each character represents an element—either a part of the background grid or a moving element.
// The plan for a small level might look like this:

let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

// Periods are empty space, hash (#) characters are walls, and plus signs are lava. The player’s starting position is the at sign (@). Every O character is a coin, and the equal sign (=) at the top is a block of lava that moves back and forth horizontally.
// We’ll support two additional kinds of moving lava: the pipe character (|) creates vertically moving blobs, and v indicates dripping lava—vertically moving lava that doesn’t bounce back and forth but only moves down, jumping back to its start position when it hits the floor.
// A whole game consists of multiple levels that the player must complete. A level is completed when all coins have been collected. If the player touches lava, the current level is restored to its starting position, and the player may try again.

// Reading a level
// The following class stores a level object. Its argument should be the string that defines the level.

class Level {
  constructor(plan) {
    let rows = plan
      .trim()
      .split("\n")
      .map((l) => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];
    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch];
        if (typeof type != "string") {
          let pos = new Vec(x, y);
          this.startActors.push(type.create(pos, ch));
          type = "empty";
        }
        return type;
      });
    });
  }
}
// The trim method is used to remove whitespace at the start and end of the plan string. This allows our example plan to start with a newline so that all lines are directly below each other. The remaining string is split on newline characters, and each line is spread into an array, producing arrays of characters.
// So rows holds an array of arrays of characters, the rows of the plan. We can derive the level’s width and height from these. But we must still separate the moving elements from the background grid. We’ll call moving elements actors. They’ll be stored in an array of objects. The background will be an array of arrays of strings, holding field types such as "empty", "wall", or "lava".
// To create these arrays, we map over the rows and then over their content. Remember that map passes the array index as a second argument to the mapping function, which tells us the x- and y-coordinates of a given character. Positions in the game will be stored as pairs of coordinates, with the upper left being 0,0 and each background square being 1 unit high and wide.
// To interpret the characters in the plan, the Level constructor uses the levelChars object, which, for each character used in the level descriptions, holds a string if it is a background type, and a class if it produces an actor. When type is an actor class, its static create method is used to create an object, which is added to startActors, and the mapping function returns "empty" for this background square.
// The position of the actor is stored as a Vec object. This is a two-dimensional vector, an object with x and y properties, as seen in the exercises of Chapter 6.
// As the game runs, actors will end up in different places or even disappear entirely (as coins do when collected). We’ll use a State class to track the state of a running game.

class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }
  static start(level) {
    return new State(level, level.startActors, "playing");
  }
  get player() {
    return this.actors.find((a) => a.type == "player");
  }
}
// The status property will switch to "lost" or "won" when the game has ended.
// This is again a persistent data structure—updating the game state creates a new state and leaves the old one intact.

// Actors
// Actor objects represent the current position and state of a given moving element (player, coin, or mobile lava) in our game. All actor objects conform to the same interface. They have size and pos properties holding the size and the coordinates of the upper-left corner of the rectangle representing this actor, and an update method.
// This update method is used to compute their new state and position after a given time step. It simulates the thing the actor does—moving in response to the arrow keys for the player and bouncing back and forth for the lava—and returns a new, updated actor object.
// A type property contains a string that identifies the type of the actor—"player", "coin", or "lava". This is useful when drawing the game—the look of the rectangle drawn for an actor is based on its type.
// Actor classes have a static create method that is used by the Level constructor to create an actor from a character in the level plan. It is given the coordinates of the character and the character itself, which is necessary because the Lava class handles several different characters.

// This is the Vec class that we’ll use for our two-dimensional values, such as the position and size of actors.
class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}
// The times method scales a vector by a given number. It will be useful when we need to multiply a speed vector by a time interval to get the distance traveled during that time.

// The different types of actors get their own classes, since their behavior is very different. Let’s define these classes. We’ll get to their update methods later.

// The player class has a speed property that stores its current speed to simulate momentum and gravity.
class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }
  get type() {
    return "player";
  }
  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
  }
}
Player.prototype.size = new Vec(0.8, 1.5);
// Because a player is one-and-a-half squares high, its initial position is set to be half a square above the position where the @ character appeared. This way, its bottom aligns with the bottom of the square where it appeared.
// The size property is the same for all instances of Player, so we store it on the prototype rather than on the instances themselves. We could have used a getter like type, but that would create and return a new Vec object every time the property is read, which would be wasteful. (Strings, being immutable, don’t have to be re-created every time they are evaluated.)

// When constructing a Lava actor, we need to initialize the object differently depending on the character it is based on. Dynamic lava moves along at its current speed until it hits an obstacle. At that point, if it has a reset property, it will jump back to its start position (dripping). If it does not, it will invert its speed and continue in the other direction(bouncing).
// The create method looks at the character that the Level constructor passes and creates the appropriate lava actor.
class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }
  get type() {
    return "lava";
  }
  static create(pos, ch) {
    if (ch == "=") {
      return new Lava(pos, new Vec(2, 0));
    } else if (ch == "|") {
      return new Lava(pos, new Vec(0, 2));
    } else if (ch == "v") {
      return new Lava(pos, new Vec(0, 3), pos);
    }
  }
}
Lava.prototype.size = new Vec(1, 1);

// Coin actors are relatively simple. They mostly just sit in their place. But to liven up the game a little, they are given a “wobble”, a slight vertical back-and-forth motion. To track this, a coin object stores a base position as well as a wobble property that tracks the phase of the bouncing motion. Together, these determine the coin’s actual position (stored in the pos property).
class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }
  get type() {
    return "coin";
  }
  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos, Math.random() * Math.PI * 2);
  }
}
Coin.prototype.size = new Vec(0.6, 0.6);
// In Chapter 14, we saw that Math.sin gives us the y-coordinate of a point on a circle. That coordinate goes back and forth in a smooth waveform as we move along the circle, which makes the sine function useful for modeling a wavy motion.
// To avoid a situation where all coins move up and down synchronously, the starting phase of each coin is randomized. The period of Math.sin’s wave, the width of a wave it produces, is 2π. We multiply the value returned by Math.random by that number to give the coin a random starting position on the wave.

// We can now define the levelChars object that maps plan characters to either background grid types or actor classes.
const levelChars = {
  ".": "empty",
  "#": "wall",
  "+": "lava",
  "@": "Player",
  o: "Coin",
  "=": "Lava",
  "|": "Lava",
  v: "Lava",
};
// That gives us all the parts needed to create a Level instance.

let simpleLevel = new Level(simpleLevelPlan);
console.log(`${simpleLevel.width} by ${simpleLevel.height}`);
// → 22 by 9

// Drawing
// A game display object draws a given level and state. We pass its constructor to the game to allow it to be replaced. The display class we define in this chapter is called DOMDisplay because it uses DOM elements to show the level.
// We’ll be using a style sheet to set the actual colors and other fixed properties of the elements that make up the game. It would also be possible to directly assign to the elements’ style property when we create them, but that would produce more verbose programs.
// The following helper function provides a succinct way to create an element and give it some attributes and child nodes:
function elt(name, attrs, ...children) {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
}
// A display is created by giving it a parent element to which it should append itself and a level object.
class DOMDisplay {
  constructor(parent, level) {
    this.dom = elt("div", { class: "game" }, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }
  clear() {
    this.dom.remove();
  }
}
// The level’s background grid, which never changes, is drawn once. Actors are redrawn every time the display is updated with a given state. The actorLayer property will be used to track the element that holds the actors so that they can be easily removed and replaced.

// Our coordinates and sizes are tracked in grid units, where a size or distance of 1 means one grid block. When setting pixel sizes, we will have to scale these coordinates up—everything in the game would be ridiculously small at a single pixel per square. The scale constant gives the number of pixels that a single unit takes up on the screen.
const scale = 20;
function drawGrid(level) {
  return elt(
    "table",
    {
      class: "background",
      style: `width: ${level.width * scale}px`,
    },
    ...level.rows.map((row) =>
      elt(
        "tr",
        { style: `height: ${scale}px` },
        ...row.map((type) => elt("td", { class: type }))
      )
    )
  );
}
// The <table> element’s form nicely corresponds to the structure of the rows property of the level—each row of the grid is turned into a table row (<tr> element). The strings in the grid are used as class names for the table cell (<td>) elements. The code uses the spread (triple dot) operator to pass arrays of child nodes to elt as separate arguments.

function drawActors(actors) {
  return elt(
    "div",
    {},
    ...actors.map((actor) => {
      let rect = elt("div", { class: `actor ${actor.type}` });
      rect.style.width = `${actor.size.x * scale}px`;
      rect.style.height = `${actor.size.y * scale}px`;
      rect.style.left = `${actor.pos.x * scale}px`;
      rect.style.top = `${actor.pos.y * scale}px`;
      return rect;
    })
  );
}
// To give an element more than one class, we separate the class names by spaces. In the following CSS code, the actor class gives the actor their absolute position. Their type name is used as an extra class to give them a color. We don’t have to define the lava class again because we’re reusing the class for the lava grid squares we defined earlier.

// The syncState method is used to make the display show a given state. It first removes the old actor graphics, if any, and then redraws the actors in their new positions. It may be tempting to try to reuse the DOM elements for actors, but to make that work, we would need a lot of additional bookkeeping to associate actors with DOM elements and to make sure we remove elements when their actors vanish. Since there will typically be only a handful of actors in the game, redrawing all of them is not expensive.
DOMDisplay.prototype.syncState = function (state) {
  if (this.actorLayer) this.actorLayer.remove();
  this.actorLayer = drawActors(state.actors);
  this.dom.appendChild(this.actorLayer);
  this.dom.className = `game ${state.status}`;
  this.scrollPlayerIntoView(state);
};

// We can’t assume that the level always fits in the viewport, the element into which we draw the game. That is why we need the scrollPlayerIntoView it ensures that if the level is protruding outside the viewport, we scroll that viewport to make sure the player is near its center. The following CSS gives the game’s wrapping DOM element a maximum size and ensures that anything that sticks out of the element’s box is not visible. We also give it a relative position so that the actors inside it are positioned relative to the level’s upper-left corner.