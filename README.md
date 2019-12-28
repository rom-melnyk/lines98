# Lines98: the classic game implemented in browser

## Run

- `npm install && npm run demo`
- [Live demo.](https://melnyk.site/post/17)

## Architecture overview

### Front end compiling

[ParcelJS](https://parceljs.org/) was considered because of zero setup. All "out of the box" build options work perfectly fine for this project.

ParcelJS compiles the code into `dist/` which is .gitignore-d.

### Styling

- Cell is implemented as simple `<div>` with `::before` pseudo-element responsible for ball (if any).
- Cell styling is made for following states:
  - `<div class="cell" ball="...">` for a ball cell; it might have extra `selected` class as well.
  - `<div class="cell" intention="...">` for an intended ball cell (the ball will be spawn at next move).
  - `<div class="cell" trace="...">` for a cell that resides on the trace from selected one to hovered one.
  - The value for `ball`, `intention` and `trace` attributes defines the color.
    - All the colors are combined into _the palette;_ see `styles/playground/_palette.scss`.

### Logic

- Each HTML cell `<div>` has appropriate representation as the instance of `Cell` class; see `scripts/cell.ts`.
  - The instance of `Cell` class contains the **state data** (ball color, intention color, trace color).
  - Setting state parameters of `Cell` intance updates the HTML. Think "MVVM" pattern.
- All the cells are stored in the `Playground`.
- The **runtime data** (like score, history etc). are stored in the `Runtime`.

So in order to understand what's currently on we need all cells and the runtime instance. This pair of parameters is often passed to multiple functions.

Both `Playground` and `Runtime` are used by the `Gameplay`.
- It uses the [FSM](https://en.wikipedia.org/wiki/Finite-state_machine) for game states and transitions between them. See `scripts/gameplay/fsm/`. It contains text schema and the FSM implementation.
- There are following concepts used:
  - **Opearations** mutate the state/runtime in "atomic" (often undoable) manner.
  - **Actions** are sequences of operations wrapped into some logic. They are FSM entities (see below).
  - **UI handlers** invoke some FSM "entry points". They are the way to run the flow again after automaton hit the stable (final) state.  
     Mouse click handlers are perfect examples here.

#### FSM

The FSM is realized as map of states which have unique name and are functions per se.

Once runned they might return
- Another "state" or its name. This means the state is transitional and the automaton continues it's flow.
- Nothing / `void`. This means that the sate is stable (final) and automaton stops.

The FSM states might be invoked from the outer world (e.g., `gameplay.init()` or mouse click). FSM runs from invoked state to the stable (final) one.

For current purposes there weas no need to implement asynchronous FSM flow. However it's good practice in general because it's pretty easy to hit Stack overflow with cyclic transitions.

#### Finding shortest path

In order to find shortest path from selected cell to hovered one the modified [Dijkstra algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) is used. See `scripts/gameplay/trace-utils.ts`
- instead of assigning the minimal _tentative distance_ (sic) to each node the _shortest path_ is assigned;
- the "neighbors" are pre-sorted by distance to destination (it might look expensive but we perform that operation only when necessary).

---
 
Credits: Roman Melnyk, <https://melnyk.site>
