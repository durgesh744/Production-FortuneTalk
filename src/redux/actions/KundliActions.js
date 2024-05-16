import * as actionTypes from '../actionTypes/kundliActionTypes'

export const getPanchangData = payload =>({
    type: actionTypes.GET_PANCHANG_DATA,
    payload
})

export const setPanchangData = payload =>({
    type: actionTypes.SET_PANCHANG_DATA,
    payload
})

export const setPanchangNew = payload =>({
    type: actionTypes.SET_PANCHANG_NEW,
    payload
})

export const setCurrentLatLong = payload =>({
    type: actionTypes.SET_CURRENT_LAT_LONG,
    payload
})
