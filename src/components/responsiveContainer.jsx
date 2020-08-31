import React, {useRef, useState, useEffect} from 'react';
import {init, addAlive, nextStep, getGrid, savePosition, resetPosition} from '../util/GameOfLife';
import useInterval from '../util/useInterval';

function createGridPath(rows, columns, width, height) {
    let path = '';
    let xOffset = width / columns;
    let yOffset = height / rows;
    for (let x = xOffset; x < width; x = x + xOffset) {
        path = path + `M ${x} 0 v ${height} `
    }
    for (let y = yOffset; y < height; y = y + yOffset) {
        path = path + `M 0 ${y} h ${width} `
    }
    return path;
}

const ResponsiveContainer = ({rows, columns, palette, action}) => {
    const dim = [10000, 10000];
    const [d, setD] = useState('');
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        let tmpD = '';
        setTimer(null);
        if (dim[0] !== 0 && dim[1] !== 0) {
            tmpD = createGridPath(rows, columns, dim[0], dim[1]);
            init(rows, dim[1], columns, dim[0], 'cells');
        }
        setD(tmpD);
    }, [rows, columns, dim[0], dim[1]])

    let lastActionT = useRef(null)
    useEffect(() => {
        const [type, t] = action ? action.split('-') : [null, null];
        setTimer(null)
        if(t !== lastActionT.current){
            lastActionT.current = t;
            switch(type){
                default:
                case 'pause':
                    break;
                case 'clear':
                    init(rows, dim[1], columns, dim[0], 'cells');
                    break;
                case 'play':
                    savePosition()
                    setTimer(250)
                    break;
                case 'reset':
                    resetPosition();
                    break;
            }
        }
    }, [action])

    useInterval(() => {
        const stop = nextStep();
        if(stop) setTimer(null);
    }, timer)

    function captureClick(e) {
        let grid = getGrid();
        const el = document.getElementById('canvas')
        const x = e.clientX * dim[0] / el.getBoundingClientRect().width;
        const y = e.clientY * dim[1] / el.getBoundingClientRect().height;;
        const id = getIndexes(x, y);
        addAlive(id)
    }


    function getIndexes(x, y) {
        return ([
            Math.floor((x) * columns / dim[0]),
            Math.floor((y) * rows / dim[1])
        ])
    }

    let strokeWidthProperty = Math.min(0.1 * dim[0] / columns, 0.1 * dim[1] / rows, 10);

    return (
        <svg id="canvas" width={'100%'} height={'100%'} viewBox={"0 0 10000 10000"} preserveAspectRatio="none" onClick={e => captureClick(e)}>
            <rect fill={palette.dead} x="0" y="0" width={dim[0]} height={dim[1]}/>
            <path id='cells' fill={palette.alive}/>
            <path d={d} stroke={palette.grid} fill="none" strokeWidth={strokeWidthProperty}/>
        </svg>
    )
}

export default ResponsiveContainer;