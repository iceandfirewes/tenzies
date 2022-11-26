import React from "react"
import {nanoid} from "nanoid"
export default function Die(props) {
    //row then column. This is used for the determinating the gridRow and gridColumn of each 
    //dot that make up the die face. for example, a number 1 die would have gridRow, gridColumn being 2,2
    const dotPositions = [
        [[2,2]],
        [[1,1], [3,3]],
        [[1,1], [2,2], [3,3]],
        [[1,1], [1,3], [3,1], [3,3]],
        [[1,1], [1,3], [2,2], [3,1], [3,3]],
        [[1,1], [1,3], [2,1], [2,3], [3,1], [3,3]]
    ]
    const dotElements = dotPositions[props.value - 1].map(pair => {
        
        return (<div key={nanoid()} className="die--dot" style={{
            gridRow: pair[0],
            gridColumn: pair[1],
        }}></div>)
    })
    return (
        <div 
            className="die-face"
            style={{backgroundColor: props.isHeld ? "#59E391" : "white"}}
            onClick={props.holdDice}
        >
        {dotElements}
        </div>
    )
}