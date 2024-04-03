const initialState = {
    scoreList: [],
}

function ScoreReducer(state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'SET_HIGH_SCORES':
            nextState = {
                ...state,
                scoreList: action.value
            }
            return nextState
        default:
            return state
    }
}
export default ScoreReducer