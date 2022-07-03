export interface BoardState {
    map: {
        size: [number, number],
        pages: {
            index: number,
            widgets: {
                geometry: [number, number, number, number],
                typeid: string,
                instanceid?: string,
            }[]
        }[]
    }
}


const INITIAL_STATE: BoardState = {
    "map": {
        "size": [4, 6], // w h
        "pages": [
            {
                "index": 0,
                "widgets": [{
                    "geometry": [1, 1, 2, 1], // x y w h
                    "typeid": "datetime"
                }, {
                    "geometry": [3, 1, 2, 1],
                    "typeid": "blank"
                }, {
                    "geometry": [1, 2, 1, 1],
                    "typeid": "stack"
                }, {
                    "geometry": [2, 2, 3, 2],
                    "typeid": "weather"
                }, {
                    "geometry": [1, 3, 1, 2],
                    "typeid": "blank"
                }, {
                    "geometry": [2, 4, 3, 2],
                    "typeid": "blank"
                }]
            },
        ]
    }
}

export enum BoardActions {
    NEW_LAYOUT,       // refresh / first screen ?
    BEGIN_LAYOUT,     // responde to touching
    END_LAYOUT,       // perform animation
    MOVE_WIDGET,    // layout changed ?
    REMOVE_WIDGET,
    ADD_WIDGET,
}

interface BoardAction {
    type: BoardActions,
    payload: BoardState | {},
}


const boardReducer = (state: BoardState, action: BoardAction) => {
    switch (action.type) {
        case BoardActions.NEW_LAYOUT:
            return {...state, ...action.payload};
        default:
            throw new Error("Unknown Action");
    }
}

export default boardReducer