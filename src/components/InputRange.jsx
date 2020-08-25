import React from "react"
import './InputRange.css'

const InputRange = ({ title, value, setter }) => {
    return (
        <div className="range-container">
            <label htmlFor={title+'-range'}>{title}</label>
            <div className="range-input">
                <div>{value}</div>
                <input id={title+'-range'} type='range' min={10} step={10} max={250} value={value} onChange={e => setter(parseInt(e.target.value))} />
            </div>
        </div>
    )
}

export default InputRange;