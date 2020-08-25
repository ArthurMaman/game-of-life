import React from 'react';
import './InputColor.css'

const InputColor = ({title, setter, value, onClick}) => {
    return(
        <div className="color-container">
            <label htmlFor={title+'-color'}>{title}</label>
            <div className="color-input">
                <div className="color-test" style={{backgroundColor: value}} onClick={onClick}/>
                <input className="color-input-text" value={value} onChange={e => setter(e.target.value)}/>
            </div>
        </div>
    );
}

export default InputColor;