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