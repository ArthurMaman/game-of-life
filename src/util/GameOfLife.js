class GameOfLife{
    constructor(row, height, col, width, ref){
        this.alive = [];
        this.old = [];
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
}

let GameOfLifeVar = null;

export function init(row, height, col, width, ref){
    GameOfLifeVar = new GameOfLife(row, height, col, width, ref)
}

export function addAlive(pt){
    let index = isAlreadyAlive(pt, GameOfLifeVar.alive)
    if(index === -1){
        GameOfLifeVar.alive.push(pt);
        GameOfLifeVar.grid[pt[0]][pt[1]] = 1;
    } else {
        GameOfLifeVar.alive.splice(index, 1);
        GameOfLifeVar.grid[pt[0]][pt[1]] = 0;
    }
    GameOfLifeVar.draw();
}

export function getAlive(){
    return GameOfLifeVar.alive;
}

export function setAlive(alive, row, col){
    GameOfLifeVar.alive = alive;
    GameOfLifeVar.row = row;
    GameOfLifeVar.col = col;
    GameOfLifeVar.grid = zero(GameOfLifeVar.row, GameOfLifeVar.col);
    for(let pt of GameOfLifeVar.alive){
        GameOfLifeVar.grid[pt[0]][pt[1]] = 1;
    }
    regenerate();
}

const isAlreadyAlive = (pt, alive) => {
    let result = -1;
    let index = 0;
    while(result === -1 && index < alive.length){
        if(alive[index][0] === pt[0] && alive[index][1] === pt[1]){
            result = index;
        } else {
            index += 1;
        }
    }
    return result;
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
            }
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

export function savePosition(){
    GameOfLifeVar.old = JSON.parse(JSON.stringify(GameOfLifeVar.alive));
}

export function resetPosition(){
    GameOfLifeVar.alive = GameOfLifeVar.old;
    GameOfLifeVar.grid = zero(GameOfLifeVar.row, GameOfLifeVar.col);
    for(let pt of GameOfLifeVar.alive){
        GameOfLifeVar.grid[pt[0]][pt[1]] = 1;
    }
    regenerate();
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