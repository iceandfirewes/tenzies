
import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [startTime, setStartTime] = React.useState(Date.now())
    const [play, setPlay] = React.useState({roll:0, time:createTime(startTime)})
    const [record, setRecord] = React.useState(() => {
        const tempRecord = localStorage.getItem("record")
        return tempRecord ? JSON.parse(tempRecord) : {roll:0, time:{minute:"00", second:"00"}}
    })
    const [timer, setTimer] = React.useState(createTime(startTime))
    const [roll, setRoll] = React.useState(0)
    //time increment
    React.useEffect(() => 
    {
        //this is so that timer doesnt increment the time when the game is won
        if(!tenzies)
        {
            let timer = setInterval(() => {
                setTimer(createTime(startTime))},1000)
            return () => window.clearInterval(timer);
        }
    },[timer])
    //win condition checker
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])
    //record keeping. executed everytime the game is won
    React.useEffect(() => {
        if(tenzies)
        {
            const temp = {
                roll: roll,
                time: {minute:timer.minute, second:timer.second}}
            const existing = JSON.parse(localStorage.getItem("record"))
            //compare the two record
            if(existing)
            {
                if(temp.time.minute < existing.time.minute)
                {
                    localStorage.setItem("record", JSON.stringify(temp))
                    setRecord(temp)
                }
                else if(temp.time.minute == existing.time.minute){
                    if(temp.time.second < existing.time.second)
                    {
                        localStorage.setItem("record", JSON.stringify(temp))
                        setRecord(temp)
                    }
                }
            }
            else{
                localStorage.setItem("record", JSON.stringify(temp))
                setRecord(temp)
            }
        }

    }, [tenzies])
    //calculate time difference to the startTime ie when the page is loaded or the dice is reset
    function createTime(newStart)
    {
        const temp = Date.now()
        let ss = Math.floor((temp - newStart) / 1000 % 60).toString()
        let mm = Math.floor((temp - newStart) / (60 * 1000) % 60).toString()
        return {
            minute: mm.padStart(2,0),
            second: ss.padStart(2,0)
        }
    }
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            //newDice.push(generateNewDie())
            newDice.push({value:6, isHeld:false, id:nanoid()})
        }
        return newDice
    }
    //function used by the button
    function rollDice() {
        //if not won. reset die that isnt held
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRoll(prev => prev + 1)
        //if won. reset everything
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setStartTime(Date.now())
            setRoll(0)
            setTimer(createTime(startTime))
        }
    }
    //function that get passed down to each die
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            <h3 className="highScore">{`Record:#${record.roll} - ${record.time.minute}:${record.time.second}`}</h3>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies </h1>
            <h3 style={{marginTop: "none"}}>{`#${roll} ${timer.minute}:${timer.second}`}</h3>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}