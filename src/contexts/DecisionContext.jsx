import React, { createContext, useContext, useReducer } from "react";

/** ---------- TYPES ---------- */

const initialState = {
  inputs: null,
  results: null,
  issues: [],
  isCalculating: false,
};

export const ACTIONS = {
  SET_INPUTS: "SET_INPUTS",
  SET_RESULTS: "SET_RESULTS",
  ADD_ISSUE: "ADD_ISSUE",
  CLEAR_ISSUES: "CLEAR_ISSUES",
  SET_CALCULATING: "SET_CALCULATING",
  RESET: "RESET",
};

/** ---------- REDUCER ---------- */

function decisionReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_INPUTS:
      return {
        ...state,
        inputs: action.payload,
      };

    case ACTIONS.SET_RESULTS:
      return {
        ...state,
        results: action.payload,
        isCalculating: false,
      };

    case ACTIONS.ADD_ISSUE:
      return {
        ...state,
        issues: [...state.issues, action.payload],
      };

    case ACTIONS.CLEAR_ISSUES:
      return {
        ...state,
        issues: [],
      };

    case ACTIONS.SET_CALCULATING:
      return {
        ...state,
        isCalculating: action.payload,
      };

    case ACTIONS.RESET:
      return initialState;

    default:
      return state;
  }
}

/** ---------- CONTEXT ---------- */

const DecisionContext = createContext(null);

export function DecisionProvider({ children }) {
  const [state, dispatch] = useReducer(decisionReducer, initialState);

  const value = {
    state,
    setInputs: (inputs) =>
      dispatch({ type: ACTIONS.SET_INPUTS, payload: inputs }),
    setResults: (results) =>
      dispatch({ type: ACTIONS.SET_RESULTS, payload: results }),
    addIssue: (issue) =>
      dispatch({ type: ACTIONS.ADD_ISSUE, payload: issue }),
    clearIssues: () =>
      dispatch({ type: ACTIONS.CLEAR_ISSUES }),
    setCalculating: (flag) =>
      dispatch({ type: ACTIONS.SET_CALCULATING, payload: flag }),
    reset: () => dispatch({ type: ACTIONS.RESET }),
  };

  return (
    <DecisionContext.Provider value={value}>
      {children}
    </DecisionContext.Provider>
  );
}

export function useDecision() {
  const context = useContext(DecisionContext);
  if (!context) {
    throw new Error("useDecision must be used within DecisionProvider");
  }
  return context;
}
