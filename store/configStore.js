import { combineReducers } from 'redux';
import PlayerReducer from './reducer/PlayerReducer';
import { configureStore } from '@reduxjs/toolkit';
import ScoreReducer from './reducer/ScoreReducer';

const rootReducer = combineReducers({
    PlayerReducer,
    ScoreReducer
})

const store = configureStore({reducer : rootReducer})
export default store