import { useReducer, useRef, useCallback } from 'react';

const initialState = {
  error: null,
  pending: false,
  data: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'START': {
      return { ...state, pending: true };
    }
    case 'SUCCESS': {
      return { ...state, pending: false, error: null, data: action.data };
    }
    case 'ERROR':
    default: {
      return { ...state, pending: false, error: action.error };
    }
  }
}

const useAsyncCallback = (callback, deps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const cancelPrevious = useRef(null);

  const run = useCallback(
    async (...args) => {
      if (cancelPrevious.current != null) {
        cancelPrevious.current();
      }

      let canceled = false;
      cancelPrevious.current = () => {
        canceled = true;
      };

      dispatch({ type: 'START' });

      try {
        const data = await callback(...args);
        if (!canceled) {
          dispatch({ type: 'SUCCESS', data });
        }
      } catch (error) {
        if (!canceled) {
          dispatch({ type: 'ERROR', error });
        }
      }
    },
    // We don't add `dispatch` and `callback` to deps to let the caller manage
    // them himself.
    // This is _ok_ as `dispatch` will never change and the latest `callback`
    // will only be used if `deps` changes, which is the behaviour of
    // `React.useEffect`.
    deps
  );

  return [run, state];
};

export default useAsyncCallback;
