const initialState = { name: '', phone: '', age: '', gender: '', service: '', date: '', slot: '', notes: '', doctor: '', doctorName: '', acceptTerms: false };

export function createStore() {
  let state = { ...initialState };
  const listeners = new Set();
  return {
    get: () => ({ ...state }),
    set(patch) {
      state = { ...state, ...patch };
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      fn(state);
      return () => listeners.delete(fn);
    },
  };
}
