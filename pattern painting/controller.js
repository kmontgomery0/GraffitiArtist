
// This is where your state machines and game logic lives


class Controller {

    // This is the state we start with.
    constructor() {
        this.left_rotation = 0;
        this.right_rotation = 0;

        this.left_rotation2 = 0;
        this.right_rotation2 = 0;
        this.rotation_threshold = 2;

        this.left_pressed_time = -1;
        this.right_pressed_time = -1;
        this.left_pressed_time2 = -1;
        this.right_pressed_time2 = -1;
        this.press_threshold = 500;
        this.move_interval = 150;

        this.gameState = "START";
        this.round = 1;
        playerOne.position = 14;
        playerTwo.position = 17;
        this.round_data = {
            2: {
                'playerOneColor': color(248, 169, 2),
                'playerTwoColor': color(105, 113, 199),
                'playerOnePaint': color(255, 216, 130),
                'playerTwoPaint': color(152, 159, 235),
                'playerOnePosition': -1,
                'playerTwoPosition': -1,
                'pattern': [[0, 1], [1, 0], [1, 0], [0, 1], [1, 1], [0, 1], [1, 0], [1, 0], [0, 1], [0, 1], [1, 0]],
                'pattern_complete': [[0, 1], [1, 0], [1, 0], [0, 1], [1, 1], [0, 1], [1, 0], [1, 0], [0, 1], [0, 1], [1, 0], [1, 0], [0, 1], [1, 1], [0, 1], [1, 0], [1, 0], [0, 1], [0, 1], [1, 0], [1, 0]]
            },
            1: {
                'playerOneColor': color(105, 113, 199),
                'playerTwoColor': color(246, 118, 104),
                'playerOnePaint': color(152, 159, 235),
                'playerTwoPaint': color(255, 200, 194),
                'playerOnePosition': -1,
                'playerTwoPosition': -1,
                'pattern': [[1, 0], [1, 0], [1, 1], [1, 1], [0, 1], [0, 1], [1, 0], [1, 0], [1, 1], [1, 1], [0, 1], [0, 1], [1, 0]],
                'pattern_complete': [[1, 0], [1, 0], [1, 1], [1, 1], [0, 1], [0, 1], [1, 0], [1, 0], [1, 1], [1, 1], [0, 1], [0, 1], [1, 0], [1, 0], [1, 1], [1, 1], [0, 1], [0, 1], [1, 0], [1, 0], [1, 1]]
            },
        }

        this.progress_animation = {
            1: {
                9: color(255, 216, 130),
                10: color(255, 216, 130),
                11: color(255, 216, 130)
            },
            2: {
                7: color(255, 178, 130),
                8: color(255, 178, 130),
                12: color(255, 178, 130),
                13: color(255, 178, 130)
            },
            3: {
                5: color(255, 151, 130),
                6: color(255, 151, 130),
                14: color(255, 151, 130),
                15: color(255, 151, 130)
            }
        }
        
    }

    mix(colors) { // list of colors
        let prop = 1/colors.length;
        let red = 0;
        let green = 0;
        let blue = 0;

        for(let i = 0; i < colors.length; i++) {
            red += prop*colors[i]['levels'][0];
            green += prop*colors[i]['levels'][1];
            blue += prop*colors[i]['levels'][2];
        }

        return color(red, green, blue);
    }

    // This is called from draw() in sketch.js with every frame
    update() {

        // STATE MACHINE ////////////////////////////////////////////////
        // This is where your game logic lives
        /////////////////////////////////////////////////////////////////
        switch(this.gameState) {

            case "BLANK": 
                break;

            case "START": 
                // reset player data and update for next round
                playerOne.painted_locations = {};
                playerTwo.painted_locations = {};

                // set player + paint colors based on current round
                if(this.round_data[this.round]['playerOnePosition'] > 0) {
                    playerOne.position = this.round_data[this.round]['playerOnePosition'];
                }
                
                if(this.round_data[this.round]['playerTwoPosition'] > 0) {
                    playerTwo.position = this.round_data[this.round]['playerTwoPosition'];
                }
                
                playerOne.playerColor = this.round_data[this.round]['playerOneColor'];
                playerTwo.playerColor = this.round_data[this.round]['playerTwoColor'];
                playerOne.paintColor = this.round_data[this.round]['playerOnePaint'];
                playerTwo.paintColor = this.round_data[this.round]['playerTwoPaint'];

                this.gameState = "PLAY";


            // main game state
            case "PLAY":
                // clear screen at frame rate so we always start fresh      
                display.clear();

                display2.clear();


                // show pattern
                let pattern_pixel = [];
                for(let i = 0; i < this.round_data[this.round]['pattern'].length; i++) {
                    pattern_pixel = [];
                    if(this.round_data[this.round]['pattern'][i][0] > 0) {
                        for(let j = 0; j < this.round_data[this.round]['pattern'][i][0]; j++) {
                            pattern_pixel.push(playerOne.paintColor);
                        }
                    }

                    if(this.round_data[this.round]['pattern'][i][1] > 0) {
                        for(let j = 0; j < this.round_data[this.round]['pattern'][i][1]; j++) {
                            pattern_pixel.push(playerTwo.paintColor);
                        }
                    }

                    display.setPixel(i, this.mix(pattern_pixel));
                }

                // show all painted pixels
                for (let i = 0; i < displaySize; i++) {
                    if(i in playerOne.painted_locations && i in playerTwo.painted_locations) {
                        display.setPixel(i, this.mix([playerOne.paintColor, playerTwo.paintColor]))
                    } else if(i in playerOne.painted_locations) {
                        display.setPixel(i, playerOne.paintColor);
                    } else if(i in playerTwo.painted_locations) {
                        display.setPixel(i, playerTwo.paintColor);
                    }
                }


                // check if pattern is complete     
                let canvas = structuredClone(this.round_data[this.round]['pattern']);
                let pixel = [];

                for(let i = this.round_data[this.round]['pattern'].length; i < displaySize; i++) {
                    pixel = [0, 0];
                    if(i in playerOne.painted_locations) {
                        pixel[0] = 1
                    }
                    if(i in playerTwo.painted_locations) {
                        pixel[1] = 1
                    }
                    canvas.push(structuredClone(pixel));
                }

                // adding where player painted between pattern
                for(let i = 0; i < this.round_data[this.round]['pattern'].length; i++) {
                    if(JSON.stringify(this.round_data[this.round]['pattern'][i]) === JSON.stringify([0, 0]) && (i in playerOne.painted_locations || i in playerTwo.painted_locations)) {
                        pixel = [0, 0];
                        if(i in playerOne.painted_locations) {
                            pixel[0] = 1
                        }
                        if(i in playerTwo.painted_locations) {
                            pixel[1] = 1
                        }
                        canvas[i] = structuredClone(pixel);
                    }
                }

                if(JSON.stringify(canvas) === JSON.stringify(this.round_data[this.round]['pattern_complete'])) {
                    this.gameState = "SUCCESS";
                    
                }

                // show players
                if(keyIsDown(83) && (typeof this.round_data[this.round]['pattern'][playerOne.position] === 'undefined' || JSON.stringify(this.round_data[this.round]['pattern'][playerOne.position]) === JSON.stringify([0, 0]))) {
                    //display.setPixel(playerOne.position, playerOne.paintColor);
                    display2.setPixel(playerOne.position, playerOne.playerColor);
                }
                else {
                    //display.setPixel(playerOne.position, playerOne.playerColor);
                    display2.setPixel(playerOne.position, playerOne.playerColor);
                }

                if(keyIsDown(DOWN_ARROW) && (typeof this.round_data[this.round]['pattern'][playerTwo.position] === 'undefined' || JSON.stringify(this.round_data[this.round]['pattern'][playerTwo.position]) === JSON.stringify([0, 0]))) {
                    //display.setPixel(playerTwo.position, playerTwo.paintColor);
                    display2.setPixel(playerTwo.position, playerTwo.playerColor);
                }
                else {
                    //display.setPixel(playerTwo.position, playerTwo.playerColor);
                    display2.setPixel(playerTwo.position, playerTwo.playerColor);
                }

                // hold to keep moving


                if(this.left_pressed_time == -1 && keyIsDown(65)) {
                    this.left_pressed_time = performance.now();
                } else if(performance.now() - this.left_pressed_time > this.press_threshold && keyIsDown(65)) {
                    //console.log(parseInt(performance.now() - this.left_pressed_time) % this.move_interval);
                    if(parseInt(performance.now() - this.left_pressed_time) % this.move_interval <= 10 || parseInt(performance.now() - this.left_pressed_time) % this.move_interval >= this.move_interval - 10) {
                        playerOne.move(-1);
                    }
                }

                if(this.right_pressed_time == -1 && keyIsDown(68)) {
                    this.right_pressed_time = performance.now();
                } else if(performance.now() - this.right_pressed_time > this.press_threshold && keyIsDown(68)) {
                    //console.log(parseInt(performance.now() - this.left_pressed_time) % this.move_interval);
                    if(parseInt(performance.now() - this.right_pressed_time) % this.move_interval <= 10 || parseInt(performance.now() - this.right_pressed_time) % this.move_interval >= this.move_interval - 10) {
                        playerOne.move(1);
                    }
                }

                if(this.left_pressed_time2 == -1 && keyIsDown(37)) {
                    this.left_pressed_time2 = performance.now();
                } else if(performance.now() - this.left_pressed_time2 > this.press_threshold && keyIsDown(37)) {
                    //console.log(parseInt(performance.now() - this.left_pressed_time) % this.move_interval);
                    if(parseInt(performance.now() - this.left_pressed_time2) % this.move_interval <= 10 || parseInt(performance.now() - this.left_pressed_time2) % this.move_interval >= this.move_interval - 10) {
                        playerTwo.move(-1);
                    }
                }

                if(this.right_pressed_time2 == -1 && keyIsDown(39)) {
                    this.right_pressed_time2 = performance.now();
                } else if(performance.now() - this.right_pressed_time2 > this.press_threshold && keyIsDown(39)) {
                    //console.log(parseInt(performance.now() - this.left_pressed_time) % this.move_interval);
                    if(parseInt(performance.now() - this.right_pressed_time2) % this.move_interval <= 10 || parseInt(performance.now() - this.right_pressed_time2) % this.move_interval >= this.move_interval - 10) {
                        playerTwo.move(1);
                    }
                }

                

                break;
 
            case "SUCCESS":       
                // increment round, show success + progression animation
                display.clear();

                let prev_progress_time = 500; // can also be 0
                let new_progress_time = 750;
                let start_time = 1250;
                
                let prevProgressTimeout = setTimeout(() => {
                    // display prev progress
                    for(let i = 1; i < this.round + 1; i++) {
                        for(const key in this.progress_animation[i]) {
                            display.setPixel(key, this.progress_animation[i][key])
                        }
                    }
                }, prev_progress_time);

                let progressTimeout = setTimeout(() => {
                    display.clear(); // do we need this
                    this.round += 1;
                    for(let i = 1; i < this.round + 1; i++) {
                        for(const key in this.progress_animation[i]) {
                            display.setPixel(key, this.progress_animation[i][key])
                        }
                    }
                    // display new progress

                }, prev_progress_time + new_progress_time);

                let startTimeout = setTimeout(() => {
                    this.gameState = "START";

                }, prev_progress_time + new_progress_time + start_time)
                

                this.gameState = "BLANK";
                break;

            // Not used, it's here just for code compliance
            default:
                break;
        }
    }
}


function keyReleased() {
    if (key == 'A' || key == 'a') {
        controller.left_pressed_time = -1;

      }
    
    // And so on...
    if (key == 'D' || key == 'd') {
        controller.right_pressed_time = -1;
    }    

    if (key == 'I' || key == 'i') {
        controller.left_pressed_time2 = -1;
    }
    
    if (key == 'P' || key == 'P') {
        controller.right_pressed_time2 = -1;
    }

}

function keyPressed() {
    if (key == "H" || key == "h") {
        controller.left_rotation += 1;
        if(controller.left_rotation >= controller.rotation_threshold) {
            playerOne.move(-1);
            controller.left_rotation = 0;   
        }
    }

    if (key == "J" || key == "j") {
        controller.right_rotation += 1;
        if(controller.right_rotation >= controller.rotation_threshold) {
            playerOne.move(1);
            controller.right_rotation = 0;   
        }
    }

    if (key == "N" || key == "n") {
        controller.left_rotation2 += 1;
        if(controller.left_rotation2 >= controller.rotation_threshold) {
            playerTwo.move(-1);
            controller.left_rotation2 = 0;   
        }
    }

    if (key == "M" || key == "m") {
        controller.right_rotation2 += 1;
        if(controller.right_rotation2 >= controller.rotation_threshold) {
            playerTwo.move(1);
            controller.right_rotation2 = 0;   
        }
    }

    // Move player one to the left if letter A is pressed
    if (key == 'A' || key == 'a') {
        playerOne.move(-1);
      }
    
    // And so on...
    if (key == 'D' || key == 'd') {
        playerOne.move(1);
    }    

    if (key == 'S' || key == 's') {
        // so u cant paint on the pattern
        if(!(playerOne.position in playerOne.painted_locations) && (typeof controller.round_data[controller.round]['pattern'][playerOne.position] === 'undefined' || JSON.stringify(controller.round_data[controller.round]['pattern'][playerOne.position]) === JSON.stringify([0, 0]))) {
            // paint
            playerOne.painted_locations[playerOne.position] = playerOne.position;
            // paint over other player's color 
            // if(playerOne.position in playerTwo.painted_locations) {
            //     delete playerTwo.painted_locations[playerOne.position];
            // }
        }
        else {
            // unpaint
            delete playerOne.painted_locations[playerOne.position];
        }
    }    

    if (key == 'I' || key == 'i') {
        playerTwo.move(-1);
    }
    
    if (key == 'P' || key == 'p') {
        playerTwo.move(1);
    }

    if (key == 'O' || key == 'o') {
        // might change back to array + move toggle logic to controller.js
        if(!(playerTwo.position in playerTwo.painted_locations) && (typeof controller.round_data[controller.round]['pattern'][playerTwo.position] === 'undefined' || JSON.stringify(controller.round_data[controller.round]['pattern'][playerTwo.position]) === JSON.stringify([0, 0]))) {
            // paint
            playerTwo.painted_locations[playerTwo.position] = playerTwo.position;
            // paint over other player's color 
            // if(playerTwo.position in playerOne.painted_locations) {
            //     delete playerOne.painted_locations[playerTwo.position];
            // }
        }
        else {
            // unpaint
            delete playerTwo.painted_locations[playerTwo.position];
        }
    }    
    
    // When you press the letter R, the game resets back to the play state
    if (key == 'R' || key == 'r') {
        controller.gameState = "START";
    }
  }