const initialState = { 
    players: [],
    currentPlayers : null
}

function playerReducer(state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'ADD_PLAYER':
            nextState = {
                ...state,
                players: [...state.players, action.value]
            }
            return nextState    
        case 'ADD_CURRENT_PLAYER':
            nextState = {
                ...state,
                currentPlayers: action.value[0]
            }
            return nextState
        default:
            return state
    }
}

export default playerReducer;