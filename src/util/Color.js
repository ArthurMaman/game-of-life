export default class Color {
    constructor(color, type = 'hex'){
        this.hsv = {};
        this.hex = '';
        this.rgb = {};
        if(type === 'hsv'){
            this.hsv = color;
            this.rgb = hsvToRgb(this.hsv);
            this.hex = rgbToHex(this.rgb)
        } else if(type === 'rgb'){
            this.rgb = color;
            this.hsv = rgbToHsv(this.rgb);
            this.hex = rgbToHex(this.rgb);
        } else {
            this.hex = color;
            this.rgb = hexToRgb(this.hex);
            this.hsv = rgbToHsv(this.rgb);
        }
    }

    maxValueColor(){
        let {h, s, v} = {...this.hsv}
        let nc = new Color({h: h, s: s, v:1}, 'hsv');
        return nc.hex;
    }
}

const rgbToHsv = ({ r, g, b }) => {
    let h, s, v;
    let r1 = r / 255;
    let g1 = g / 255;
    let b1 = b / 255;

    let maxC = Math.max(r1, g1, b1);
    let minC = Math.min(r1, g1, b1);

    let chroma = maxC - minC;

    if (chroma === 0) {
        h = 0;
    } else {
        switch (maxC) {
            case r1:
            default:
                h = 60 * (g1 - b1) / chroma;
                break;
            case g1:
                h = 60 * (2 + (b1 - r1) / chroma)
                break;
            case b1:
                h = 60 * (4 + (r1 - g1) / chroma)
                break;
        }
    }
    s = maxC === 0 ? 0 : chroma / maxC;
    h = h <= 0 ? h + 360 : h;

    return ({
        h: h,
        s: s,
        v: maxC
    })
}

const hsvToRgb = ({ h, s, v }) => {
    let r, g, b;
    let chroma = s * v;
    let hp = h / 60;
    let x = chroma * (1 - Math.abs(hp % 2 - 1))

    let match = v - chroma;
    switch (Math.ceil(hp)) {
        default:
            [r, g, b] = [0, 0, 0];
            break;
        case 1:
            [r, g, b] = [chroma, x, 0];
            break;
        case 2:
            [r, g, b] = [x, chroma, 0];
            break;
        case 3:
            [r, g, b] = [0, chroma, x];
            break;
        case 4:
            [r, g, b] = [0, x, chroma];
            break;
        case 5:
            [r, g, b] = [x, 0, chroma];
            break;
        case 6:
            [r, g, b] = [chroma, 0, x];
            break;
    }

    return ({
        r: Math.round((r + match) * 255),
        g: Math.round((g + match) * 255),
        b: Math.round((b + match) * 255)
    })
}

const hexToRgb = hex => {
    let hexfull = hex + '00000000';
    return ({
        r: parseInt(hexfull.slice(1, 3), 16),
        g: parseInt(hexfull.slice(3, 5), 16),
        b: parseInt(hexfull.slice(5, 7), 16),
    })
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = ({ r, g, b }) => '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);

