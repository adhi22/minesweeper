document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    const flagCnt = document.querySelector(".left");
    let gameIsOver = false;
    const width = 10;
    const bombs = 15;
    let flags = 0;
    let squares = [];
    flagCnt.innerHTML = bombs;

    const createBoard = () => {
        const bombsArray = Array(bombs).fill("bomb");
        const emptyArray = Array(width * width - bombs).fill("valid");
        const gameArray = bombsArray.concat(emptyArray);
        gameArray.sort(() => Math.random() - 0.5);
        // console.log(gameArray);

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("id", i);
            square.classList.add(gameArray[i]);
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener("click", function (e) {
                click(square);
            });

            square.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(square);
            };
        }

        // console.log(squares);

        for (let i = 0; i < width * width; i++) {
            let total = 0;
            let x = Math.floor(i / width),
                y = i % width;

            if (squares[i].classList.value === "valid") {
                // top
                if (
                    x > 0 &&
                    squares[(x - 1) * width + y].classList.value === "bomb"
                )
                    total++;

                // bottom
                if (
                    x < 9 &&
                    squares[(x + 1) * width + y].classList.value === "bomb"
                )
                    total++;

                // left
                if (
                    y > 0 &&
                    squares[width * x + y - 1].classList.value === "bomb"
                )
                    total++;

                // right
                if (
                    y < 9 &&
                    squares[width * x + y + 1].classList.value === "bomb"
                )
                    total++;

                // top-left
                if (
                    x > 0 &&
                    y > 0 &&
                    squares[(x - 1) * width + y - 1].classList.value === "bomb"
                )
                    total++;

                // top-right
                if (
                    x > 0 &&
                    y < 9 &&
                    squares[(x - 1) * width + y + 1].classList.value === "bomb"
                )
                    total++;

                // bottom-left
                if (
                    x < 9 &&
                    y > 0 &&
                    squares[(x + 1) * width + y - 1].classList.value === "bomb"
                )
                    total++;

                // bottom-right
                if (
                    x < 9 &&
                    y < 9 &&
                    squares[(x + 1) * width + y + 1].classList.value === "bomb"
                )
                    total++;

                squares[i].setAttribute("data", total);
                // console.log(squares[i]);
            }
        }
    };

    createBoard();

    function addFlag(square) {
        if (gameIsOver) return;
        if (!square.classList.contains("ckecked") && flags < bombs) {
            if (!square.classList.contains("flag")) {
                square.classList.add("flag");
                square.innerHTML = "🚩";
                flags++;
                flagCnt.innerHTML--;
                checkWin();
            } else {
                square.classList.remove("flag");
                square.innerHTML = "";
                flags--;
                flagCnt.innerHTML++;
            }
        }
    }

    function click(square) {
        let currentID = square.id;
        // console.log(currentID);

        if (
            gameIsOver ||
            square.classList.contains("checked") ||
            square.classList.contains("flag")
        )
            return;

        if (square.classList.value === "bomb") {
            gameOver();
        } else {
            let tot = square.getAttribute("data");
            square.classList.add("checked");
            if (tot !== "0") {
                square.innerHTML = tot;
            } else {
                checkSquare(currentID);
            }
        }
    }

    function checkSquare(currentID) {
        let x = Math.floor(currentID / width),
            y = currentID % width;

        setTimeout(() => {
            // top
            if (x > 0) {
                const newID = (x - 1) * width + y;
                const newSquare = document.getElementById(newID);
                click(newSquare);
            }

            // bottom
            if (x < 9) {
                const newID = (x + 1) * width + y;
                const newSquare = document.getElementById(newID);
                click(newSquare);
            }

            // left
            if (y > 0) {
                const newID = width * x + y - 1;
                click(document.getElementById(newID));
            }

            // right
            if (y < 9) {
                const newID = width * x + y + 1;
                click(document.getElementById(newID));
            }

            // top-left
            if (x > 0 && y > 0) {
                const newID = (x - 1) * width + y - 1;
                click(document.getElementById(newID));
            }

            // top-right
            if (x > 0 && y < 9) {
                const newID = (x - 1) * width + y + 1;
                click(document.getElementById(newID));
            }

            // bottom-left
            if (x < 9 && y > 0) {
                const newID = (x + 1) * width + y - 1;
                click(document.getElementById(newID));
            }

            // bottom-right
            if (x < 9 && y < 9) {
                const newID = (x + 1) * width + y + 1;
                click(document.getElementById(newID));
            }
        }, 50);
    }

    function gameOver() {
        console.log("game over");
        gameIsOver = true;

        squares.forEach((square) => {
            if (square.classList.contains("bomb")) {
                square.innerHTML = "💣";
            }
        });

        showBombs();
    }

    function checkWin() {
        let correctPos = 0;

        for (let i = 0; i < width * width; i++) {
            if (
                squares[i].classList.contains("flag") &&
                squares[i].classList.contains("bomb")
            ) {
                correctPos++;
            }
        }

        if (correctPos === bombs) {
            console.log("You Win");
            gameIsOver = true;
            showBombs();
        }
    }

    function showBombs() {
        for (let i = 0; i < width * width; i++) {
            if (squares[i].classList.contains("bomb")) {
                squares[i].classList.add("showBomb");
            }
        }
    }
});
