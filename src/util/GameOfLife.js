class GameOfLife{
    constructor(row, height, col, width, ref){
        this.alive = [];
        this.col = col;
        this.row = row
        this.width = width;
        this.height = height;
        this.ref = ref;
        this.grid = zero(row, col);
        this.draw();
    }

    aliveToPath(){
        function createCellPath(x, y, width, height) {
            return (`M ${x} ${y} h ${width} v ${height} h ${-width} v ${-height}`)
        }
        let tmpPath = '';
        let xOffset = this.width / this.col;
        let yOffset = this.height / this.row;
        this.alive.forEach(it => tmpPath = tmpPath + createCellPath(it[0] * xOffset, it[1] * yOffset, xOffset, yOffset))
        return tmpPath;
    }

    draw(){
        const d = this.aliveToPath();
        document.getElementById(this.ref).setAttribute("d", d)
    }

    getAlive(){
        return this.alive;
    }
}

let GameOfLifeVar = null;

export function init(row, height, col, width, ref){
    GameOfLifeVar = new GameOfLife(row, height, col, width, ref)
}

export function addAlive(pt){
    GameOfLifeVar.alive.push(pt);
    GameOfLifeVar.grid[pt[0]][pt[1]] = 1
    GameOfLifeVar.draw();
}

export function nextStep(){
    let newAlive = [];
    let newGrid = zero(GameOfLifeVar.row, GameOfLifeVar.col)
    for(let i = 0; i < GameOfLifeVar.col; i ++){
        for(let j = 0; j < GameOfLifeVar.row; j++ ){
            let score = 0;
            for(let x of [-1, 0, 1]){
                for(let y of [-1, 0, 1]){
                    if(i + x >= 0 && i + x < GameOfLifeVar.col && j + y >= 0 && j + y < GameOfLifeVar.row && GameOfLifeVar.grid[i+x][j+y] === 1) score += 1;
                }
            }
            if(score === 3 || (score===4 && GameOfLifeVar.grid[i][j] === 1)){ 
                newGrid[i][j] = 1;
                newAlive.push([i, j])
            };
        }
    }
    GameOfLifeVar.grid = newGrid;
    GameOfLifeVar.alive = newAlive;
    GameOfLifeVar.draw();
    return  newAlive.length === 0;
}

export function regenerate(){
    GameOfLifeVar.draw();
}

export function getGrid(){
    return GameOfLifeVar.grid;
}

const zero = (x, y) => {
    let arr = [];
    for(let i = 0; i < y; i ++){
        arr.push([]);
        for(let j = 0; j < x; j ++){
            arr[i].push(0)
        }
    }
    return arr;
}