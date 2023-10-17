export function createStore(reducer) {
  let currentState: any = null;
  const currentListeners: any[] = [];

  function getState() {
    return currentState;
  }
  function subscribe(listener) {
    currentListeners.push(listener);
  }
  function dispatch(action) {
    currentState = reducer(currentState, action);
    currentListeners.forEach((v) => v());
    return action;
  }
  dispatch({ type: '@REACT_FIRST_ACTION' }); //初始化state
  return { getState, subscribe, dispatch };
}
