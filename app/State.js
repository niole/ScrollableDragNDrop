export default function initState() {
  function wrapState(state) {
    return Object.keys(state).reduce((acc, nextField) => {
      acc[nextField] = [state[nextField]];
      return acc;
    }, {});
  }

  return class State {
    constructor(initialState) {
      super();
      this.state = wrapState(initialState);
    }

    set(newState) {
      for (let key in newState) {
          if (Object.hasOwnProperty(key) && this.state[key]) {
            this.state[key].push(newState[key]);
          }
      }
      return newState;
    }

    get() {
      const fields = [...arguments];

      if (fields.length === 1) {
          const field = fields[0];
          return this.state[field][this.state[field].length-1];
      }

      return fields.reduce((acc, field) => {
          acc[field] = this.state[field][this.state[field].length-1];
          return acc;
      }, {});
    }
  }
};
