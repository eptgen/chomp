# Chomp

A web version of [Chomp](https://en.wikipedia.org/wiki/Chomp), the two-player game played on a rectangular grid of squares (a "chocolate bar"). On each turn a player picks a remaining square and eats it along with every square above and to the right of it. The player forced to eat the last (bottom-left, "poisoned") square loses.

The frontend is a React app (Create React App). Game state lives on a backend API, so two players can play each other online.

## Running locally

```sh
npm install
npm start
```

Then open http://localhost:3000.

## Playing

1. Enter a name and click **Sign In**.
2. Optionally set the number of rows and columns and click **Change Board Size** (default is 15 × 3).
3. Click **Start Game** to host a game. The game ID is shown under the board.
4. The other player signs in, enters that game ID, and clicks **Join Game**.
5. Take turns clicking squares on the board.
