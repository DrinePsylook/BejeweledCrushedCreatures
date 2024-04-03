let hydra = require('../images/greenHydra.png'); //4
let wolf = require('../images/blueWolf.png'); //5
let golem = require('../images/blackGolem.png'); //6
let unicorne = require('../images/colorUnicorne.png'); //7
let phenix = require('../images/orangePhoenix.png'); //8
let kraken = require('../images/pinkKraken.png'); //9
let dragon = require('../images/redDragon.png'); //10
let griffin = require('../images/yellowGriffin.png'); //11


export const cardTab = [hydra, wolf, golem, unicorne, phenix, kraken, dragon, griffin]

export function randomCard() {
    let card = cardTab[Math.floor(Math.random() * cardTab.length)];
    return card;
}

//Je génère la grille :
export function generateGrid() {
    // console.log("tab Img : " + cardTab);            
    const grid = [];
    for (let x = 0; x < 8; x++) {
        const line = [];
        for (let y = 0; y < 8; y++) {
            let source = randomCard();
            line.push(source); //je calcule la position de l'image (i,j) par rapport au début de la ligne

        }

        grid.push(line);
    }
    // console.log("gamegrid : " + grid);

    return grid;
}

//Je vérifie si les images 1 et 2 sont adjacentes
export function isAdjacent(img1, img2) {
    const [x1, y1] = img1;
    const [x2, y2] = img2;
    if (x2 === x1 - 1 && y2 === y1
        || x2 === x1 + 1 && y2 === y1
        || x2 === x1 && y2 === y1 - 1
        || x2 === x1 && y2 === y1 + 1
    ) {
        return true;
    };
}

//Je parcours la grille de manière horizontale en ligne
export function browseGridHz(grid, action) {
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            action(grid[x][y], x, y);
        }
    }
}

//Je parcours la grille de manière verticale en colonne
export function browseGridVt(grid, action) {
    for (let y = 0; y < grid[0].length; y++) {
        for (let x = 0; x < grid.length - 2; x++) {
            action(grid[x][y], x, y);
        }
    }
}

//test les limites de la grille
export function isInGridLimit(x, y, grid) {
    if (x >= 0 && x <= grid.length - 1 && y >= 0 && y <= grid[0].length - 1) {
        return true;
    }
}

//fonction qui descend les images d'un cran
export function fallingImgY(grid, x, y) {
    let i = x - 1;
    while (i >= 0) {
        if (grid[i][y] !== null) {
            const temp = grid[x][y]
            grid[x][y] = grid[i][y];
            grid[i][y] = temp;
            x--;
        }
        i--;
    }

}

//fonction qui descend les images sur toute la colonne 
export function fallingImgX(grid, x, y, sequenceNeg, sequencePos) {
    let moveDown = sequenceNeg + sequencePos;
    for (let i = x; i >= 0; i--) {
        if (grid[i][y] !== null) {
            grid[i + moveDown][y] = grid[i][y];
            grid[i][y] = null;
        }
    }

}

export function emptyImg(grid) {
    let x = 0;
    let y = 0;
    //Je parcours ma grille
    browseGridHz(grid, function (source, x, y) {
        // si une image est nulle, je génère une image aléatoire
        if(grid[x][y] === null) {
            grid[x][y] = randomCard();
            //Je régénère l'image aléatoire tant qu'elle est semblable aux images adjacentes
            while(isInGridLimit(x +1, y, grid) && isInGridLimit(x-1, y, grid) && isInGridLimit(x +1, y+1, grid) && grid[x][y] === grid[x][y+1] && grid[x][y] === grid[x+1][y] && grid[x][y] === grid[x-1][y]){
                grid[x][y] = randomCard();
                
            }   
        explodeTriplets(grid);
        }
        
    });
};

export function explodeTriplets(grid){
    // let x = '';
    // let y = '';
    let i = 1;
    let j = 1;
    let sequencePos = 1;
    let sequenceNeg = 0;
    //Je parcours ma grille
    browseGridHz(grid, function (source, x, y) {
        //Je vérifie les limites de la grille et vois si l'img précédente et la suivante sont les mêmes que l'img sur laquelle on est
        if (isInGridLimit(x, y - 1, grid) && isInGridLimit(x, y + 1, grid) && grid[x][y] === grid[x][y - 1] && grid[x][y] === grid[x][y + 1]) {

            //Je mets les images semblables à null et je descends celles au-dessus
            while (isInGridLimit(x, y - j, grid) && grid[x][y] === grid[x][y - j]) {
                grid[x][y - j] = null;
                sequenceNeg++;
                fallingImgY(grid, x, y - j);
                j++;
            }

            while (isInGridLimit(x, y + i, grid) && grid[x][y] === grid[x][y + i]) {
                grid[x][y + i] = null;
                sequencePos++;
                fallingImgY(grid, x, y + i);
                i++;
            }
            grid[x][y] = null;
            fallingImgY(grid, x, y);
        }
    });
    emptyImg(grid); //Je remplis les images vides

    browseGridVt(grid, function (source, x, y) {
        
            if (isInGridLimit(x - 1, y, grid) && isInGridLimit(x + 1, y, grid) && grid[x][y] === grid[x - 1][y] && grid[x][y] === grid[x + 1][y]) {

                while (isInGridLimit(x - j, y, grid) && grid[x][y] === grid[x - j][y]) {
                    grid[x - j][y] = null;
                    sequenceNeg++;
                    j++;
                }
                while (isInGridLimit(x + i, y, grid) && grid[x][y] === grid[x + i][y]) {
                    grid[x + i][y] = null;
                    sequencePos++;
                    i++;
                }
                grid[x][y] = null;
                fallingImgX(grid, x, y, sequenceNeg, sequencePos);
            }
        
    });
    emptyImg(grid);
    
}

