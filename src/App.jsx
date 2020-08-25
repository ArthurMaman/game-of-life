import React, { useState, useReducer, useEffect } from 'react'
import './App.css'
import ResponsiveContainer from "./components/responsiveContainer";
import InputRange from './components/InputRange';
import InputColor from './components/InputColor';
import ColorPicker from './components/ColorPicker';

function App() {
    const [rows, setRows] = useState(50);
    const [col, setCol] = useState(50);
    const [open, set] = useState('none');

    const paletteReducer = (old, { type, color }) => {
        if (type === 'reset') return ({
            alive: '#FF7B9C',
            dead: '#FFFFFF',
            grid: '#000000'
        })
        const newP = { ...old };
        newP[type] = color;
        return newP
    }

    const [palette, setPalette] = useReducer(paletteReducer, {
        alive: '#FF7B9C',
        dead: '#FFFFFF',
        grid: '#000000'
    })

    const openOrClose = value => open === value ? set('none') : set(value);

    const [currentColor, setCurrent] = useState('alive');

    const [action, setAction] = useState(null);

    return (
        <div className="App">
            <div className="Container">
                <ResponsiveContainer rows={rows} columns={col} palette={palette} action={action}/>
            </div>
            <div className="left">
                <div className="card">
                    <div className="card__bar">
                        <button className="button-action" onClick={() => setAction('play-'+Date.now())}>
                            <img src="/play.svg" alt="play" />
                        </button>
                        <button className="button-action" onClick={() => setAction('pause-'+Date.now())}>
                            <img src="/pause.svg" alt="pause" />
                        </button>
                        <button className="button-action">
                            <img src="refresh.svg" alt="reset canvas" />
                        </button>
                        <button className="button-action" onClick={() => setAction('clear-'+Date.now())}>
                            <img src="clear.svg" alt="clear canvas" />
                        </button>
                    </div>
                    <div className="card__bar">
                        <button className="button-action" onClick={() => openOrClose('dim')}>
                            <img src="ruler.svg" alt="canvas dimensions" />
                        </button>
                        <button className="button-action" onClick={() => openOrClose('palette')}>
                            <img src="palette.svg" alt="canvas colors" />
                        </button>
                        <button className="button-action" onClick={() => openOrClose('rules')}>
                            <img src="info.svg" alt="game rules" />
                        </button>
                        <button className="button-action" onClick={() => openOrClose('info')}>
                            <img src="help.svg" alt="about this site" />
                        </button>
                    </div>
                </div>
                <div className="card" style={{ display: open === 'dim' ? "block" : "none" }}>
                    <div className="card__title">Dimensions</div>
                    <div>
                        <InputRange title='Rows' setter={setRows} value={rows} />
                    </div>
                    <div>
                        <InputRange title='Columns' setter={setCol} value={col} />
                    </div>
                </div>
                <div className="card" style={{ display: open === 'palette' ? "block" : "none" }}>
                    <div className="card__title">Palette</div>
                    <div>
                        <InputColor onClick={() => setCurrent('alive')} title='Alive' setter={c => setPalette({ type: 'alive', color: c })} value={palette.alive} />
                    </div>
                    <div>
                        <InputColor onClick={() => setCurrent('dead')} title='Dead' setter={c => setPalette({ type: 'dead', color: c })} value={palette.dead} />
                    </div>
                    <div>
                        <InputColor onClick={() => setCurrent('grid')} title='Grid' setter={c => setPalette({ type: 'grid', color: c })} value={palette.grid} />
                    </div>
                    <ColorPicker current={palette[currentColor]} set={c => setPalette({ type: currentColor, color: c })}/>
                    <button onClick={() => setPalette({ type: 'reset' })}>Reset</button>
                </div>
            </div>
        </div>
    )
}

export default App;
