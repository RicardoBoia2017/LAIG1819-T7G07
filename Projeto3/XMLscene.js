var DEGREE_TO_RAD = Math.PI / 180;

//struct to store game information
let game =
{
    board: "[[x,w,x,w,x],[x,x,b,x,x],[x,x,x,x,x],[x,x,w,x,x],[x,b,x,b,x]]",
    blackPositions: [
            [2, 3],
            [5, 2],
            [5, 4]
        ],
    whitePositions: [
            [1, 2],
            [1, 4],
            [4, 3]
        ],
    color: 'b',
    piece: 0,
    currentPlayer: 0,
    players: ["Human", "Human"],
    arrowPosition: [],
    pastBoards: [],
    pastAnimations: [],
};

let scene;
/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};

        scene = this;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();
        this.defaultView = 0;
        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.counter = 0;

        this.lastUpdate = 0;
        this.waterTimer = 0;
        this.setUpdatePeriod(100);

        this.setPickEnabled(true);

        this.choosingDirection = false;
        this.animationInProgress = false;

        this.turnTime = 60;

        this.movValues = [2, 2.1];

        this.objects = [];

        for (let i = 0; i < 25; i++)
            this.objects.push(new MyQuad(this, [0, 0, 1, 1]));

        this.undo = new MyQuad(this, [0, 0, 1, 1]);

        game.pastBoards.push(game.board);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

                if (light[5] != null) {
                    this.lights[i].setSpotDirection(light[5][0] - light[1][0], light[5][1] - light[1][1], light[5][2] - light[1][2], light[5][3] - light[1][3])
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }

    }

    /**
     * Initializes the scene views with the values read from the XML file.
     */
    initViews() {
        this.cameras = [];
        for (var key in this.graph.views) {
            if (this.graph.views[key][0] == "perspective") {

                var near = this.graph.views[key][1];
                var far = this.graph.views[key][2];
                var fov = this.graph.views[key][3];
                var from = this.graph.views[key][4];
                var to = this.graph.views[key][5];
                this.cameras[key] = new CGFcamera(fov, near, far, vec3.fromValues(from[0], from[1], from[2]), to);
            }

            else {
                var near = this.graph.views[key][1];
                var far = this.graph.views[key][2];
                var left = this.graph.views[key][3];
                var right = this.graph.views[key][4];
                var top = this.graph.views[key][5];
                var bottom = this.graph.views[key][6];
                var from = this.graph.views[key][7];
                var to = this.graph.views[key][8];
                this.cameras[key] = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, [0, 1, 0]);
            }
        }

    }

    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        this.defaultView = this.graph.defaultView;
        this.initViews();

        this.camera = this.cameras[this.defaultView];
        this.interface.setActiveCamera(this.camera);

        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.setGlobalAmbientLight(this.graph.ambientSpecs[0], this.graph.ambientSpecs[1], this.graph.ambientSpecs[2], this.graph.ambientSpecs[3]);
        this.gl.clearColor(this.graph.backgroundSpecs[0], this.graph.backgroundSpecs[1], this.graph.backgroundSpecs[2], this.graph.backgroundSpecs[3]);

        this.initLights();
        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);
        this.interface.addViewsGroup(this.graph.views);
        this.interface.addScenesGroup();
        this.interface.addMenu();

        this.sceneInited = true;
    }

	/**
	* Updates active view to the one selected
	*/
    updateViews() {
        if (this.graph.views[this.defaultView][0] == "perspective") {
            var near = this.graph.views[this.defaultView][1];
            var far = this.graph.views[this.defaultView][2];
            var fov = this.graph.views[this.defaultView][3];
            var from = this.graph.views[this.defaultView][4];
            var to = this.graph.views[this.defaultView][5];
            this.camera = new CGFcamera(fov, near, far, from, to);
        }

        else {
            var near = this.graph.views[this.defaultView][1];
            var far = this.graph.views[this.defaultView][2];
            var left = this.graph.views[this.defaultView][3];
            var right = this.graph.views[this.defaultView][4];
            var top = this.graph.views[this.defaultView][5];
            var bottom = this.graph.views[this.defaultView][6];
            var from = this.graph.views[this.defaultView][7];
            var to = this.graph.views[this.defaultView][8];
            this.camera = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, [0, 1, 0]);
        }

        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Checks which square was selected by user
     */
    logPicking() {
        //If no animation is in progress
        if (this.pickMode == false && !this.animationInProgress) {
            if (this.pickResults != null && this.pickResults.length > 0) {

                for (var i = 0; i < this.pickResults.length; i++) {

                    var obj = this.pickResults[i][0];
                    if (obj) {
                        var customId = this.pickResults[i][1];

                        if(customId == 0)
                            this.undoTurn();

                        //if a piece is selected
                        else if (this.choosingDirection) {
                            //If user selects another piece
                            if (this.positionHasPiece(Math.floor(customId / 10), customId % 10, true))
                                this.validDirections();

                            //If user selects a direction
                            else {
                                this.moveRequest(Math.floor(customId / 10), customId % 10);
                                this.choosingDirection = false;
                                
                            }
                        }
                        //if a piece is not selected
                        else {
                            if (this.positionHasPiece(Math.floor(customId / 10), customId % 10, true)) {
                                this.validDirections();
                                this.choosingDirection = true;
                            }
                        }
                        //            this.getPrologRequest("move(" + Dir + "," + game.board + "," + Row + "," + Col +",'b')", this.handleReply);
                        //                    this.getPrologRequest("initGame('PvP')", this.handleReply);
                        //                      this.getPrologRequest("valid_moves(" + this.convertBoardToString(this.board) + ",2,3)", this.handleReply);
                        //                      this.getPrologRequest("game_over(" + this.convertBoardToString(this.board) + ",'w')", this.handleReply);
                        //                        this.getPrologRequest("bot_move(" + this.convertBoardToString(this.board) + ",2,'b')", this.handleReply);

                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }

    }

    //Gets previous board and restores it, animating piece movement
    undoTurn()
    {
        if(game.pastBoards.length == 1) //only has initial board
            return;

        let lastBoard = game.pastBoards.pop();
        let lastAnimation = game.pastAnimations.pop();


        //Restores board 
        game.board = game.pastBoards[game.pastBoards.length-1];
        
        //Retrieves information from last move
        let pieceName = lastAnimation[0];
        let lastPieceMoved = Number(lastAnimation[0].substring(lastAnimation[0].length-1));
        let rowDiff = lastAnimation[2];
        let colDiff = lastAnimation[1];

        let time;

        if (colDiff != 0) 
            time = Math.abs(colDiff);
        else
            time = Math.abs(rowDiff);

        this.animationInProgress = true;

        //Creates inverted animation
        this.graph.components[pieceName].animations[0] = new LinearAnimation(this, time, [[0,0,0], [-colDiff * this.movValues[0], 0, -rowDiff * this.movValues[1]]]);
        this.graph.components[pieceName].currentAnimation = 0;

        //Reverts position change from last move and changes player  
        if (game.color == 'b') 
        {
            let currentRow = game.whitePositions[lastPieceMoved - 1][0];
            let currentCol = game.whitePositions[lastPieceMoved - 1][1];

            game.whitePositions[lastPieceMoved - 1] = [currentRow - rowDiff, currentCol - colDiff];
            game.color = 'w';
        }
        
        else if (game.color == 'w') 
        {
            let currentRow = game.blackPositions[lastPieceMoved - 1][0];
            let currentCol = game.blackPositions[lastPieceMoved - 1][1];

            game.blackPositions[lastPieceMoved - 1] = [currentRow - rowDiff, currentCol - colDiff];
            game.color = 'b';
        }
    }

    //checks if the selected position has a piece of current player
    positionHasPiece(Row, Col, changePiece) {
        let valid = 0;
        let coords = [Row, Col];
        let array = [];

        if (game.color == 'b')
            array = game.blackPositions;
        else
            array = game.whitePositions;

        for (let i = 0; i < array.length; i++) {
            let elem = array[i];

            for (let j = 0; j < elem.length; j++) {
                if (elem[j] == coords[j]) {
                    if (j == elem.length - 1) {
                        valid = 1;
                        if (changePiece)
                            game.piece = i + 1;

                        break;
                    }
                }
                else
                    break;
            }
            if (valid)
                break;
        }

        return valid;
    }

    //Calculates the direction given starting and target positions, and makes move request
    moveRequest(targetRow, targetCol) {
        let startingRow;
        let startingCol;
        let dir;

        if (game.color == 'b') {
            startingRow = game.blackPositions[game.piece - 1][0];
            startingCol = game.blackPositions[game.piece - 1][1];
        }

        if (game.color == 'w') {
            startingRow = game.whitePositions[game.piece - 1][0];
            startingCol = game.whitePositions[game.piece - 1][1];
        }

        if (startingRow == targetRow) {
            if (startingCol < targetCol)
                dir = 3; //east
            else
                dir = 2; //west
        }

        else if (startingCol == targetCol) {
            if (startingRow < targetRow)
                dir = 4; //south
            else
                dir = 1; //north
        }

        else if (startingRow < targetRow) {
            if (startingCol < targetCol)
                dir = 7; //southeast
            else
                dir = 8; //southwest
        }

        else if (startingRow > targetRow) {
            if (startingCol < targetCol)
                dir = 5; //northeast
            else
                dir = 6; //northwest
        }
        this.getPrologRequest("move(" + dir + "," + game.board + "," + startingRow + "," + startingCol + "," + game.color + ")", this.moveReply);
    }

    //Request for valid direction of selected piece
    validDirections() {
        let row;
        let col;

        if (game.color == 'b') {
            row = game.blackPositions[game.piece - 1][0];
            col = game.blackPositions[game.piece - 1][1];
        }

        if (game.color == 'w') {
            row = game.whitePositions[game.piece - 1][0];
            col = game.whitePositions[game.piece - 1][1];
        }

        this.getPrologRequest("valid_moves(" + game.board + "," + row + "," + col + ")", this.validMovesReply);
    }

    /**
     * Sends request asking if current player won
     */
    gameOver() {
        this.getPrologRequest("game_over(" + game.board + "," + game.color + ")", this.gameOverReply);
    }

    /**
     * Sends request to prolog server
     */
    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.game = game;
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    /**
     * Handles the reply for move requests. Updates positions array and sets animation
     * @param {*} data 
     */
    moveReply(data) {
        let reply = data.target.response.split("-");

        game.board = reply[0];
        game.pastBoards.push(game.board);

        let targetRow = Number(reply[1]);
        let targetCol = Number(reply[2]);
        let startingRow;
        let startingCol;
        let componentName;

        if (game.color == 'b') {
            startingRow = game.blackPositions[game.piece - 1][0];
            startingCol = game.blackPositions[game.piece - 1][1];
            componentName = "blackpeca" + game.piece;
        }

        if (game.color == 'w') {
            startingRow = game.whitePositions[game.piece - 1][0];
            startingCol = game.whitePositions[game.piece - 1][1];
            componentName = "whitepeca" + game.piece;
        }

        let diff1 = targetCol - startingCol;
        let diff2 = targetRow - startingRow;
        let time;

        if (diff1 != 0) 
            time = Math.abs(diff1);
        else
            time = Math.abs(diff2);

        scene.animationInProgress = true;

        scene.graph.components[componentName].animations[0] = new LinearAnimation(scene, time, [[0, 0, 0], [diff1 * scene.movValues[0], 0, diff2 * scene.movValues[1]]]);
        scene.graph.components[componentName].currentAnimation = 0;

        //Piece being moved, horizontal movement, vertical movement
        game.pastAnimations.push([componentName, diff1, diff2]);

        //Updates positions array
        if (game.color == 'b') 
            game.blackPositions[game.piece - 1] = [Number(reply[1]), Number(reply[2])];

        else if (game.color == 'w')
            game.whitePositions[game.piece - 1] = [Number(reply[1]), Number(reply[2])];

        scene.gameOver();
    }

    /**
     * Handles the reply for valid moves requests. Fills arrowPosition array with coordinates of valid directions
     * @param {*} data 
     */
    validMovesReply(data) {
        let reply = data.target.response;
        let values = reply.substring(1, reply.length - 1).split(",");

        if (values.length == 0)
            console.log("No valid moves!");

        game.arrowPosition = [];
        let row;
        let col;

        if (game.color == 'b') {
            row = game.blackPositions[game.piece - 1][0];
            col = game.blackPositions[game.piece - 1][1];
        }

        if (game.color == 'w') {
            row = game.whitePositions[game.piece - 1][0];
            col = game.whitePositions[game.piece - 1][1];
        }

        for (let i = 0; i < values.length; i++) {
            switch (Number(values[i])) {
                case 1:
                    {
                        game.arrowPosition.push((row - 1) * 10 + col);
                        break;
                    }

                case 2:
                    {
                        game.arrowPosition.push(row * 10 + (col - 1));
                        break;
                    }
                case 3:
                    {
                        game.arrowPosition.push(row * 10 + (col + 1));
                        break;
                    }
                case 4:
                    {
                        game.arrowPosition.push((row + 1) * 10 + col);
                        break;
                    }
                case 5:
                    {
                        game.arrowPosition.push((row - 1) * 10 + (col + 1));
                        break;
                    }
                case 6:
                    {
                        game.arrowPosition.push((row - 1) * 10 + (col - 1));
                        break;
                    }
                case 7:
                    {
                        game.arrowPosition.push((row + 1) * 10 + (col + 1));
                        break;
                    }
                case 8:
                    {
                        game.arrowPosition.push((row + 1) * 10 + (col - 1));
                        break;
                    }
            }
        }
    }

    /**
     *  Checks if any game ending condition verifies. If true, the game ends, otherwise player's turn ends
     * */
    gameOverReply(data) {
        let reply = data.target.response;

        if(reply == "1")
        {
            console.log(game.color + " has won the game!");
            scene.endGame();
        }
        
        else if(scene.checkDraw())
        {
            console.log("Draw");
            scene.endGame();
        }

        //Changes player
        if (game.color == 'b') 
            game.color = 'w';
        
        else if (game.color == 'w') 
            game.color = 'b';
        
        game.arrowPosition = [];
    }

    /**
     * Checks if the board happened for the third time. If true, then the game ends as a draw.
     *  */
    checkDraw()
    {
        let currentBoard = game.board;
        let counter = 0;
        
        for(let i  = 0; i < game.pastBoards.length - 1; i++)
        {
            let board = game.pastBoards[i];

            if(board == currentBoard)
                counter++;
        }

        if (counter == 2)
            return 1;

        return 0;
    }
    
    newGame(mode)
    {
        mat4.copy(this.graph.components['blackpeca1'].matrixTransf, this.graph.components['blackpeca1'].originalMatrix);
        mat4.copy(this.graph.components['blackpeca2'].matrixTransf, this.graph.components['blackpeca2'].originalMatrix);
        mat4.copy(this.graph.components['blackpeca3'].matrixTransf, this.graph.components['blackpeca3'].originalMatrix);
        mat4.copy(this.graph.components['whitepeca1'].matrixTransf, this.graph.components['whitepeca1'].originalMatrix);
        mat4.copy(this.graph.components['whitepeca2'].matrixTransf, this.graph.components['whitepeca2'].originalMatrix);
        mat4.copy(this.graph.components['whitepeca3'].matrixTransf, this.graph.components['whitepeca3'].originalMatrix);

        game.board = "[[x,w,x,w,x],[x,x,b,x,x],[x,x,x,x,x],[x,x,w,x,x],[x,b,x,b,x]]";
        game.blackPositions = [
            [2, 3],
            [5, 2],
            [5, 4]
        ],
        game.whitePositions = [
            [1, 2],
            [1, 4],
            [4, 3]
        ],
        game.color = 'b';
        game.piece = 0;
        game.currentPlayer = 0;
        game.arrowPosition = [];
        game.pastBoards = [];
        game.pastAnimations = [];
        game.pastBoards.push(game.board);

        switch(mode)
        {
            case 1:
            {
                game.players=["Human", "Human"];
                break;
            }
            case 2:
            {
                game.players=["Human", "BotEasy"];
                break;
            }
            case 3:
            {
                game.players=["Human", "BotHard"];
                break;
            }
            case 4:
            {
                game.players=["BotEasy", "BotEasy"];
                break;
            }
            case 5:
            {
                game.players=["BotHard", "BotHard"];                
                break;
            }
        }

        this.choosingDirection = false;
        this.animationInProgress = false;

        if(this.interface.gameMovie != null)
        {
            this.interface.gui.remove(this.interface.gameMovie);
        }
    }

    endGame()
    {
        this.interface.gameOptions.open();
        this.interface.gameMovie = this.interface.gui.add(this, 'ViewGameFilm');
    }

    /**
     * Puts pieces in their initial position and calls function that will display animations
     */
    ViewGameFilm()
    {
        if(this.animationInProgress || this.gameMovieInProgress)
            return;

        mat4.copy(this.graph.components['blackpeca1'].matrixTransf, this.graph.components['blackpeca1'].originalMatrix);
        mat4.copy(this.graph.components['blackpeca2'].matrixTransf, this.graph.components['blackpeca2'].originalMatrix);
        mat4.copy(this.graph.components['blackpeca3'].matrixTransf, this.graph.components['blackpeca3'].originalMatrix);
        mat4.copy(this.graph.components['whitepeca1'].matrixTransf, this.graph.components['whitepeca1'].originalMatrix);
        mat4.copy(this.graph.components['whitepeca2'].matrixTransf, this.graph.components['whitepeca2'].originalMatrix);
        mat4.copy(this.graph.components['whitepeca3'].matrixTransf, this.graph.components['whitepeca3'].originalMatrix);

        this.gameMovieInProgress = true;
        this.doPastAnimation(0);
    }

    /**
     * Recursive function that sets animation and, after the animation finishes, calls the function to set the next one
     * @param {index of animation being set} index 
     */
    doPastAnimation(index)
    {
        if(index == game.pastAnimations.length)
        {
            scene.gameMovieInProgress = false;
            return;
        }
        
        let animation = game.pastAnimations[index];

        let pieceName = animation[0];
        let rowDiff = animation[2];
        let colDiff = animation[1];

        let time;

        if (colDiff != 0) 
            time = Math.abs(colDiff);
        else
            time = Math.abs(rowDiff);

        scene.graph.components[pieceName].animations[0] = new LinearAnimation(scene, time, [[0, 0, 0], [colDiff * scene.movValues[0], 0, rowDiff * scene.movValues[1]]]);
        scene.graph.components[pieceName].currentAnimation = 0;    

        let waitingTime = (time + 0.25) * 1000;
        setTimeout(scene.doPastAnimation, waitingTime, ++index);
    }

    /**************************************************************************/

    HvH()
    {
        this.newGame(1);
        console.log("HvH");
    }

    HvC_Easy()
    {
        this.newGame(2);
        console.log("HvC_Easy");
    }

    HvC_Hard()
    {
        this.newGame(3);
        console.log("HvC_Hard");
    }

    CvC_Easy()
    {
        this.newGame(4);
        console.log("CvC_Easy");
    }

    CvC_Hard()
    {
        this.newGame(5);
        console.log("CvC_Hard");
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            //this.axis.display();
            var i = 0;

            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key] == 1) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }
            if (this.defaultView != this.lastView)
                this.updateViews();

            this.lastView = this.defaultView

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    update(currentTime) {
        if (this.lastUpdate == 0)
            this.lastUpdate = currentTime;

        for (var key in this.graph.components) {
            if (this.graph.components[key].getAnimationsLenght() > 0)
                this.graph.components[key].updateAnimation((currentTime - this.lastUpdate) / 1000);
        }

        this.waterTimer += 0.05 * (currentTime - this.lastUpdate) / 1000;
        this.counter += (currentTime - this.lastUpdate) / 1000;

        this.lastUpdate = currentTime;

    }
}