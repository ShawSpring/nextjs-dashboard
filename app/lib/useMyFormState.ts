import { useState } from 'react';
/**
 * useFormState 的自己实现
 */
function useMyFormState<State, Payload>(
  action: (state: State, payload: Payload) => Promise<State>,
  initialState: State,
): [state: State, dispatch: (payload: Payload) => void] {
  const [state, setState] = useState<State>(initialState);

  const dispatch = (payload: Payload) => {
    action(state, payload).then(setState);
  };

  return [state, dispatch];
}
export default useMyFormState;
