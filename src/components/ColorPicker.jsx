import React, { useEffect, useState, useRef } from 'react'
import Color from '../util/Color';


const ColorPicker = ({ current, set }) => {
    let color = new Color(current);
    const DEG_TO_RAD = Math.PI / 180;
    let { h, s, v } = color.hsv;
    h = h <= 0 ? h + 360 : h;

    // Wheel
    const ray = 400;
    const cx = 550;
    const cy = 450;

    // lightness
    const length = 700;
    const x = 200;
    const y = 975

    // cursor
    const ccx = cx + ray * s * Math.cos(h * DEG_TO_RAD);
    const ccy = cy + ray * s * Math.sin(h * DEG_TO_RAD);

    let clx = x + v * length

    // Events
    const down = useRef(null)
    const mouseMove = e => {
        if (down.current === 'color') {
            setColor(e)
        }
        if (down.current === 'light') {
            setLightness(e)
        }
    };

    const setColor = e => {
        down.current = 'color';
        const colorPickerPos = document.getElementById('colorpicker').getBoundingClientRect();
        const ratio = colorPickerPos.height > colorPickerPos.width ? 1100 / colorPickerPos.height : 1100 / colorPickerPos.width;
        const x = ((e.pageX - colorPickerPos.left) * ratio) - cx;
        const y = ((e.pageY - colorPickerPos.top) * ratio) - cy;
        let angleDeg = (Math.atan2(y, x) / DEG_TO_RAD);
        angleDeg = angleDeg <= 0 ? angleDeg + 360 : angleDeg;
        let distance = Math.sqrt(x * x + y * y) / ray
        distance = distance > 1 ? 1 : distance;
        const newC = new Color({ h: angleDeg, s: distance, v: v }, 'hsv');
        set(newC.hex);
    }

    const setLightness = e => {
        down.current = 'light';
        const colorPickerPos = document.getElementById('colorpicker').getBoundingClientRect();
        const ratio = colorPickerPos.height > colorPickerPos.width ? 1100 / colorPickerPos.height : 1100 / colorPickerPos.width;
        let clickx = (e.pageX - colorPickerPos.left) * ratio;
        let newL = (clickx - x) / length;
        newL = newL < 0 ? 0 : newL > 1 ? 1 : newL
        const newC = new Color({ h: h, s: s, v: newL }, 'hsv');
        set(newC.hex);
    }

    return (
        <>
            <svg id='colorpicker' viewBox='0 0 1100 1100' onMouseMove={mouseMove} onMouseUp={() => down.current = null} onMouseLeave={() => down.current = null}>
                <g id='colorwheel' onMouseDown={setColor}>
                    <ColorCircle ray={ray} cx={cx} cy={cy} />
                    <circle cx={cx} cy={cy} r={ray} fill="black" opacity={1 - v} />
                    <circle cx={ccx} cy={ccy} r='40' fill={current} stroke='black' strokeWidth='10' />
                </g>
                <g id='lightning' onMouseDown={setLightness}>
                    <defs>
                        <linearGradient id='lightgrad' x1='0%' x2='100%' y1='100%' y2='100%' gradientUnits="userSpaceOnUse">
                            <stop offset='0%' stopColor={`black`} />
                            <stop offset='100%' stopColor={color.maxValueColor()} />
                        </linearGradient>
                    </defs>
                    <line x1={x} x2={x + length} y1={y} y2={y} stroke='black' strokeWidth='140' strokeLinecap='round' />
                    <line x1={x} x2={x + length} y1={y} y2={y} stroke='url(#lightgrad)' strokeWidth='120' strokeLinecap='round' />
                    <circle cx={clx} cy={y} r='40' fill={current} stroke='black' strokeWidth='10' />
                </g>
            </svg>
        </>

    )
}

const ColorCircle = React.memo(({ ray, cx, cy }) => {
    const DEG_TO_RAD = Math.PI / 180;
    // Hue
    const [hue, setHue] = useState([]);
    useEffect(() => {
        let tempHue = []
        for (let i = 0; i < 360; i = i + 1) {
            const endX = ray * Math.cos(i * DEG_TO_RAD);
            const endY = ray * Math.sin(i * DEG_TO_RAD)
            tempHue.push(<path key={i} d={`M ${cx} ${cy} l ${endX} ${endY}`} strokeWidth='10' stroke={`hsl(${i}, 100%, 50%)`} />)
        }
        setHue(tempHue)
    }, [])
    return (
        <>
            <defs>
                <radialGradient id='blackgrad' cx="50%" cy="50%" r="50%" >
                    <stop offset='0%' stopColor='rgba(255, 255, 255, 1)' />
                    <stop offset='100%' stopColor='rgba(255, 255, 255, 0)' />
                </radialGradient>
            </defs>
            <circle cx={cx} cy={cy} r={ray} strokeWidth='20' stroke='black' />
            <g id='ray'>
                {hue}
            </g>
            <circle cx={cx} cy={cy} r={ray} fill='url(#blackgrad)' />
        </>
    )
});

export default ColorPicker;