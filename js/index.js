$(() => {
    "use strict";

    // Recording the user's choices
    let versusPlayer = "AI";
    let player1Piece = "X";
    let player2Piece = "O";

    // First Turn: X
    let currentPlayer = "X";

    // Variables for the Scoreboard
    let player1Score = 0;
    let player2Score = 0;

    // Game State
    let board = [
        ["_", "_", "_"],
        ["_", "_", "_"],
        ["_", "_", "_"]
    ];

    /* Countdown Timer
    =========================================== */

    let timer;

    // Call to start timer
    function countupTimer() {
        let minutes = 0;
        let seconds = 0;
        // Countdown with time interval of 1 second
        timer = setInterval(
            function() {
                // If 1 minute has passed
                if (seconds > 59) {
                    seconds = 0;
                    minutes++;
                }

                // Updating the Countup Timer in the App
                if (seconds <= 9) $("#time").html(minutes + ":0" + seconds++);
                else $("#time").html(minutes + ":" + seconds++);
            },
            1000,
            minutes,
            seconds
        );
    }

    // Display Winning Pattern
    function highlightWinPattern(winPattern) {
        if (winPattern.indexOf(0) != -1)
            $("#btnBoard0").css("background", "#393939");
        if (winPattern.indexOf(1) != -1)
            $("#btnBoard1").css("background", "#393939");
        if (winPattern.indexOf(2) != -1)
            $("#btnBoard2").css("background", "#393939");
        if (winPattern.indexOf(3) != -1)
            $("#btnBoard3").css("background", "#393939");
        if (winPattern.indexOf(4) != -1)
            $("#btnBoard4").css("background", "#393939");
        if (winPattern.indexOf(5) != -1)
            $("#btnBoard5").css("background", "#393939");
        if (winPattern.indexOf(6) != -1)
            $("#btnBoard6").css("background", "#393939");
        if (winPattern.indexOf(7) != -1)
            $("#btnBoard7").css("background", "#393939");
        if (winPattern.indexOf(8) != -1)
            $("#btnBoard8").css("background", "#393939");
    }

        // This function returns true if there are moves
    // remaining on the board. It returns false if
    function isMovesLeft(board) {
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                if (board[i][j] == '_')
                    return true;
        return false;
    }

    // Evaluating Win Conditions
    function evaluate(b, highlight) {
        // Checking for Rows for X or O victory.
        for (let row = 0; row < 3; row++) {
            if (b[row][0] == b[row][1] && b[row][1] == b[row][2]) {
                if (b[row][0] == player2Piece) {
                    if (highlight) highlightWinPattern([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
                    return +10;
                } else if (b[row][0] == player1Piece) {
                    if (highlight) highlightWinPattern([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
                    return -10;
                }
            }
        }

        // Checking for Columns for X or O victory.
        for (let col = 0; col < 3; col++) {
            if (b[0][col] == b[1][col] && b[1][col] == b[2][col]) {
                if (b[0][col] == player2Piece) {
                    if (highlight) highlightWinPattern([col, 3 + col, 6 + col]);
                    return +10;
                } else if (b[0][col] == player1Piece) {
                    if (highlight) highlightWinPattern([col, 3 + col, 6 + col]);
                    return -10;
                }
            }
        }

        // Checking for Diagonals for X or O victory.
        if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
            if (b[0][0] == player2Piece) {
                if (highlight) highlightWinPattern([0, 4, 8]);
                return +10;
            } else if (b[0][0] == player1Piece) {
                if (highlight) highlightWinPattern([0, 4, 8]);
                return -10;
            }
        }

        if (b[0][2] == b[1][1] && b[1][1] == b[2][0]) {
            if (b[0][2] == player2Piece) {
                if (highlight) highlightWinPattern([2, 4, 6]);
                return +10;
            } else if (b[0][2] == player1Piece) {
                if (highlight) highlightWinPattern([2, 4, 6]);
                return -10;
            }
        }

        // Else if none of them have won then return 0
        return 0;
    }

    // the possible ways the game can go and returns
    // the value of the board
    function minimax(board, depth, isMax) {
        let score = evaluate(board, false);

        // evaluated score
        if (score == 10)
            return score - depth;

        // evaluated score
        if (score == -10)
            return score + depth;

        // If there are no more moves and no winner then
        // it is a tie
        if (isMovesLeft(board) == false)
            return 0;

        // If this maximizer's move
        if (isMax) {
            let best = -1000;

            // Traverse all cells
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // Check if cell is empty
                    if (board[i][j] == '_') {
                        // Make the move
                        board[i][j] = player2Piece;

                        // Call minimax recursively and choose
                        // the maximum value
                        best = Math.max(best,
                            minimax(board, depth + 1, !isMax));

                        // Undo the move
                        board[i][j] = '_';
                    }
                }
            }
            return best;
        }

        // If this minimizer's move
        else {
            let best = 1000;

            // Traverse all cells
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    // Check if cell is empty
                    if (board[i][j] == '_') {
                        // Make the move
                        board[i][j] = player1Piece;

                        // Call minimax recursively and choose
                        // the minimum value
                        best = Math.min(best,
                            minimax(board, depth + 1, !isMax));

                        // Undo the move
                        board[i][j] = '_';
                    }
                }
            }
            return best;
        }
    }

    // This will return the best possible move for the player
    function findBestMove(board) {
        let bestVal = -1000;
        let bestMove = { row: -1, col: -1 };

        // Traverse all cells, evalutae minimax function for
        // all empty cells. And return the cell with optimal
        // value.
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Check if celll is empty
                if (board[i][j] == '_') {
                    // Make the move
                    board[i][j] = player2Piece;

                    // compute evaluation function for this
                    // move.
                    let moveVal = minimax(board, 0, false);

                    // Undo the move
                    board[i][j] = '_';

                    // If the value of the current move is
                    // more than the best value, then update
                    // best
                    if (moveVal > bestVal) {
                        bestMove.row = i;
                        bestMove.col = j;
                        bestVal = moveVal;
                    }
                }
            }
        }

        return bestMove;
    }

    /* AI's Logic
    =========================================== */

    // For AI's turn: set click event to a specific button
    function triggerBtnClick(row, col) {
        if (row == 0 && col == 0) $("#btnBoard0").trigger("click");
        else if (row == 0 && col == 1) $("#btnBoard1").trigger("click");
        else if (row == 0 && col == 2) $("#btnBoard2").trigger("click");
        else if (row == 1 && col == 0) $("#btnBoard3").trigger("click");
        else if (row == 1 && col == 1) $("#btnBoard4").trigger("click");
        else if (row == 1 && col == 2) $("#btnBoard5").trigger("click");
        else if (row == 2 && col == 0) $("#btnBoard6").trigger("click");
        else if (row == 2 && col == 1) $("#btnBoard7").trigger("click");
        else if (row == 2 && col == 2) $("#btnBoard8").trigger("click");
    }

    function aiTurn() {
        let bestMove = findBestMove(board);
        setTimeout(() => triggerBtnClick(bestMove.row, bestMove.col), 500);
    }

    /* Actions inside class cb1
    =========================================== */

    // If VS AI button is pressed
    $(".container").on("click", "#btnVSAI", function() {
        versusPlayer = "AI";
        // Go to next screen
        $(".cb1").hide();
        $(".cb2").fadeIn(1000);

        // Update next screens info
        $(".txtPlayers").html("YOU <span>VS</span> AI");
        $(".txtPlayers").css("left", "10px");
    });

    // If VS HUMAN button is pressed
    $(".container").on("click", "#btnVSHuman", function() {
        versusPlayer = "Human";

        // Go to next screen
        $(".cb1").hide();
        $(".cb2").fadeIn(1000);

        // Update next screens info
        $(".txtPlayers").html("YOU <span>VS</span> HUMAN");
        $(".txtPlayers").css("left", "10px");
    });

    /* Actions inside class cb2
    =========================================== */

    // Going to next screen and starting the game
    function updatePlayerTurn() {
        // Go to next screen
        $(".cb2").hide();
        $(".cb3").fadeIn(1000);

        // Update next screen info
        $(".title").animate({ top: "10px" });
        $(".scoreboard").animate({ top: "-20px" });
        $(".container-body").css("top", "0px");

        // Make the Game Board buttons clickable
        $(".btn-board").prop("disabled", false);

        // Start timer
        countupTimer();

        // Set the current player info
        if (currentPlayer == player1Piece) $("#txtCurrentPlayer").text("your");
        else $("#txtCurrentPlayer").text(versusPlayer + "'s");

        // X : Blue
        $("#txtCurrentPlayer").css("color", "#0080FF");

        // If AI's turn
        if (versusPlayer == "AI" && currentPlayer == player2Piece) aiTurn();
    }

    // If X button is pressed
    $(".container").on("click", "#btnX", function() {
        // Update Players Info
        player1Piece = "X";
        player2Piece = "O";

        // Start Timer
        updatePlayerTurn();
    });

    // If O button is pressed
    $(".container").on("click", "#btnO", function() {
        // Update Players Info
        player1Piece = "O";
        player2Piece = "X";

        // Start Timer
        updatePlayerTurn();
    });

    // If Return button is pressed
    $(".container").on("click", "#btnReturn", function() {
        // Go to previous screen
        $(".cb2").hide();
        $(".cb1").fadeIn(1000);
    });

    /* Actions inside class cb3
    =========================================== */

    function resetGame() {
        // Make the Game Board buttons clickable
        $(".btn-board").prop("disabled", false);
        $(".btn-board").text("");

        // Update current Player's Info
        currentPlayer = "X";
        if (player1Piece == currentPlayer) $("#txtCurrentPlayer").text("your");
        else $("#txtCurrentPlayer").text(versusPlayer + "'s");

        // X : Blue
        $("#txtCurrentPlayer").css("color", "#0080FF");

        // Resetting Players move history
        board = [
            ["_", "_", "_"],
            ["_", "_", "_"],
            ["_", "_", "_"]
        ];

        // If AI's turn
        if (versusPlayer == "AI" && currentPlayer == player2Piece) aiTurn();
    }

    // If Quit button is pressed
    $(".container").on("click", "#btnQuit", function() {
        // Go to the first screen
        $(".cb3").hide();
        $(".cb1").fadeIn(1000);

        // Update screens info
        $(".title").animate({ top: "100px" });
        $(".scoreboard").css("top", "-50px");
        $(".container-body").css("top", "120px");

        // Close the alert
        $("#alert").css("display", "none");

        resetGame();
        clearInterval(timer);

        // Make the Game Board buttons not clickable
        $(".btn-board").prop("disabled", true);

        //Resetting the scoreboard
        player1Score = 0;
        player2Score = 0;
        $("#txtPlayer1Score").text(player1Score + " - ");
        $("#txtPlayer2Score").text(" - " + player2Score);
    });

    // If the alert's 'close' button is pressed
    $("body").on("click", ".closebtn", function() {
        // Close the alert
        $("#alert").css("display", "none");

        // Remove board button highlight
        $(".btn-board").css("background", "#262626");

        /* Start the game */
        resetGame();

        // Start the timer
        countupTimer();
    });

    // If one of the game board buttons is pressed
    $(".container").on("click", ".btn-board", function() {
        // Get the position of the button in the board
        let row = $(this).data("row");
        let col = $(this).data("col");

        // Update the game board and
        // add the move in the player's move history
        if (currentPlayer == "X") {
            $(this).css("color", "#0080FF");
            board[row][col] = "X";
        } else {
            $(this).css("color", "#FF9100");
            board[row][col] = "O";
        }

        // Disable the Pressed button
        $(this).text(currentPlayer);
        $(this).prop("disabled", true);

        // Check for a winner
        let winner = evaluate(board, true);

        // If there is a winner
        if (winner == -10) {
            player1Score += 1;
            $("#txtWinner").text("Player 1 (" + player1Piece + ") has won!");
            $("#txtPlayer1Score").text(player1Score + " - ");
        } else if (winner == 10) {
            player2Score += 1;
            $("#txtWinner").text("Player 2 (" + player2Piece + ") has won!");
            $("#txtPlayer2Score").text(" - " + player2Score);
        }

        // Check if there is a draw
        if (!isMovesLeft(board) && winner != 10 && winner != -10) {
            $("#txtWinner").text("It's a draw!");
            winner = -1;
        }

        // If there is a winner
        if (winner == 10 || winner == -10 || winner == -1) {
            $("#alert").fadeIn(1000);
            $(".btn-board").prop("disabled", true);

            // Stop timer
            clearInterval(timer);
            return;
        }

        // X : Blue   O : Orange
        if (currentPlayer == "X") $("#txtCurrentPlayer").css("color", "#FF9100");
        else $("#txtCurrentPlayer").css("color", "#0080FF");

        // Update current player's info
        if (currentPlayer == player1Piece) {
            $("#txtCurrentPlayer").text(versusPlayer + "'s");
            currentPlayer = player2Piece;
        } else {
            $("#txtCurrentPlayer").text("your");
            currentPlayer = player1Piece;
        }
        // If AI's turn
        if (versusPlayer == "AI" && currentPlayer == player2Piece) {
            aiTurn();
        }
    });
});
