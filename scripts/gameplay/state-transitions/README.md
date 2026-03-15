# State transitions

When FSM state `X` is entered, approprate state transition takes place. This logic relies on the runtime data and can return
- another state name (so the FSM transites to following state),
- `null` (so the FSM has reached a stable state and is awaiting the input from the outside).

State transitions can utilize more complicated logic from [operations](../operations/README.md).
