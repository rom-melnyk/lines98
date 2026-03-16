# Lines98: the classic game implemented in browser

## Run

- `npm install && npm run demo`
- [Live demo.](https://melnyk.site/prj/20)

## Architecture overview

### Front end compiling

[ParcelJS](https://parceljs.org/) was considered because of zero setup. All "out of the box" build options work perfectly fine for this project.

ParcelJS compiles the code into `dist/` which is .gitignore-d.

### Styling

- A cell is implemented as simple `<div>` with `::before` pseudo-element responsible for the ball (if any).
- Cell styling is foreseen for following states:
  - `<div class="cell" ball="...">` for a ball cell; it might have extra `selected` class as well.
  - `<div class="cell" planned="...">` for a cell where the ball will be dropped at next move.
  - `<div class="cell" trace="...">` for a cell that resides on the trace from selected one to hovered one.
  - The value for `ball`, `planned` and `trace` attributes defines the color.
    - All the colors are combined into _a palette;_ see `styles/playground/_palette.scss`.

### Logic

- Each cell is represented as an  instance of `Cell` class; see `scripts/cell.ts`.
  - The instance of `Cell` class is tied to its HTML `<div>`.
  - It contains the **state data** (ball color, future planned color, trace color) as well.
  - Updating state parameters updates the HTML. Think "MVVM" pattern.
- All the cells are stored in the (instance of) `Playground` class.
- The **runtime data** (like score, history etc.) are stored in the instance of the `Runtime` class.

So in order to understand what's currently on we need _all cells_ and the _runtime instance._ This pair of parameters is often passed to multiple functions.

Both (instances of) `Playground` and `Runtime` classes are used by the `Gameplay` class.
- It uses the [FSM](https://en.wikipedia.org/wiki/Finite-state_machine) for game states and transitions between them. Check the `scripts/gameplay/fsm/`.
- There are following concepts used:
  - FSM states are associated with actions, triggered upon entering the state.
  - The actions can return
    - another state (which implies transition to appropriate state),
    - `null` (implies "stable" state; the FSM awaits user input).
  - **Opearations** mutate the runtime in "atomic" (often undoable) manner.
    State actions contain of operations:
    ```ts
    fsm.registerState('clicked_on_cell', () => {
      operation_1()
      if (runtime.condition) operation_2()
      return 'next_state'
    })
    ```
  - **UI handlers** (mouse clicks and `Ctrl-Z` listener) invoke appropriate FSM states directly.They are the way to run the flow again after automaton hit the stable (final) state.
- The gameplay data (score + cell setup) is stored on each move in the local storage. Reloading the page automatically loads last game.

#### FSM

The FSM is a map of actions associated with human-friendly names. \
Once entered, the FSM states might cause transition to another state or might reach the final (stable) state. In that case, external invocatio (e.g., via user action) re-runs the FSM again.

For current purposes there was no need to implement _asynchronous FSM flow._ However it's good practice in general because it's pretty easy to hit `RangeError: "Maximum call size exceeded"` with cyclic transitions.

#### Finding shortest path

In order to find shortest path from selected cell to hovered one the modified [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) is used. See `scripts/gameplay/utils/trace-utils.ts`.
- Instead of assigning the minimal _tentative distance_ (sic) to each node the _shortest path_ is assigned. The principle remains (path length is semantically equal to the "distance" as each edge has weight of 1).
- The "neighbors" are pre-sorted by distance to destination cell (it might look expensive but we perform that operation only when necessary and for maximum four cells).
- After _any path_ to destination cell has been found the altorithm won't continue with paths which are _already_ of same length or longer (because they cannot deliver shorter solution).

Thosee optimizations made finding the shortest path pretty fast. Better observed on non-mobile devices (mouse needed).

## Deployment

`npm run prod` generates production-ready code in the `dist/`. It contains the `index.html`, the JS and CSS files (both minified). Being served from local folder, the `index.html` should work in browser.

---

Credits: Roman Melnyk, <https://melnyk.site>
