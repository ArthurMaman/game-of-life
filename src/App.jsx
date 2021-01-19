import React, { useState, useReducer, useEffect } from 'react'
import './App.css'
import ResponsiveContainer from "./components/responsiveContainer";
import InputRange from './components/InputRange';
import InputColor from './components/InputColor';
import ColorPicker from './components/ColorPicker';

import {getAlive} from "./util/GameOfLife";

function App() {
    // State of the game and of the menu
    const [rows, setRows] = useState(50);
    const [col, setCol] = useState(50);
    const [open, set] = useState('none');

    // Palette handlers
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
    useEffect(() => {
        if(action?.includes('play')){
            document.body.style.setProperty("--shadowcolor", palette.alive);
        } else {
            document.body.style.setProperty("--shadowcolor", '#bfbfbf');
        }
    }, [action, palette])

    // Manage saved game
    const [title, setTitle] = useState('Change me');
    const [options, setOptions] = useState(JSON.parse(window.sessionStorage.getItem("saved_gamesoflife_titles")) || []);
    const [selected, setSelected] = useState(options.length > 0 ? options[0] : null);
    const [savedGame, setSavedGame] = useState(null);

    const save = e => {
        e.preventDefault();
        let savedGames = JSON.parse(window.sessionStorage.getItem("saved_gamesoflife_alive") || '{}');
        savedGames[title] = {
            rows: rows,
            col: col,
            alive: getAlive()
        };
        const newOptions = [...options, title]
        setOptions(newOptions);
        window.sessionStorage.setItem("saved_gamesoflife_titles", JSON.stringify(newOptions));
        window.sessionStorage.setItem("saved_gamesoflife_alive", JSON.stringify(savedGames));
    }

    const load = () => {
        const newGame = JSON.parse(window.sessionStorage.getItem("saved_gamesoflife_alive"))[selected];
        if(newGame.rows && newGame.col && newGame.alive){
            setRows(newGame.rows);
            setCol(newGame.col);
            setSavedGame(newGame.alive)
        }
    }

    const deleteGame = () => {
        const newOptions = options.filter(it => it !== selected)
        const newSelected = newOptions.length > 0 ? newOptions[0] : null;
        let newGames =  JSON.parse(window.sessionStorage.getItem("saved_gamesoflife_alive") || '{}');
        if(newGames[selected]) delete newGames[selected];
        setOptions(newOptions);
        setSelected(newSelected);
        window.sessionStorage.setItem("saved_gamesoflife_titles", JSON.stringify(newOptions));
        window.sessionStorage.setItem("saved_gamesoflife_alive", JSON.stringify(newGames));
    }

    return (
        <div className="App">
            <div className="Container">
                <ResponsiveContainer rows={rows} columns={col} palette={palette} action={action} set={setAction} saved={savedGame}/>
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
                        <button className="button-action" onClick={() => setAction('reset-'+Date.now())}>
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
                        <button className="button-action" onClick={() => openOrClose('saveload')}>
                            <img src="save.svg" alt="game rules" />
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
                <div className="card" style={{ display: open === 'saveload' ? "block" : "none"}}>
                    <form onSubmit={e => save(e)}>
                        <div className="card__title">Save Current</div>
                        <input className="card__input" type="text" value={title} onChange={e => setTitle(e.target.value)}/>
                        <input className="card__button" type="submit" value="Save" />
                    </form>
                    <div>
                        <div className="card__title">Manage Saves</div>
                        <select className="card__input" aria-label="Select a saved game" onChange={e => setSelected(e.target.value)}>
                            {options.map(it =>
                                <option value={it} key={it}>{it}</option>
                            )}
                        </select>
                        <button className="card__button half" onClick={load}>Load</button>
                        <button className="card__button half" onClick={deleteGame}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
