$('document').ready(function() {
    //Initialize variables
    
    var canPlayerGuess = false;                                 // Determines if player can press color buttons.
    var stepArray = []                                          // Array that contains the current sequence.
    var currentColorIndex = 0;                                  // Index of step that player has to guess.
    var availableColors = ['red','green','blue','yellow'];      // Helper array that contains all available colors.
    var strictMode = true;                                     // Toggles whether game resets after incorrect press.
    var highScore = 0;                                          // Tracks highest sequence reached.
    var gameSpeed = 1000;                                       // Speed of events in game.
    
    function blinkLight(color) {
        /// <summary>Lights up specified button, then turns it off after specified time.</summary>  
        /// <param name="color" type="String">The color of the button to change.</param>
        
        var colorButton = "#" + color;
        $(colorButton).addClass('lit');
        
        // Defer playing sound to other function
        playSound(color);
        
        setTimeout(function() {
            $(colorButton).removeClass('lit');
            stopSound(color);
        },gameSpeed-200);
    }
    
    function playSound(color) {
        var obj = document.getElementById(color + "Sound");
        obj.play();
    }
    
    function playSequence() {
        /// <summary>Cycles through step array and lights each color.</summary>  
        /// <param name="gamegameSpeed" type="Number">How long to light each button, in milliseconds.</param>
        
        canPlayerGuess = false;
        currentColorIndex = 0;
        
        $.each(stepArray, function(index, value) {
            setTimeout(function(){
                blinkLight(value,gameSpeed);
                
            },gameSpeed * index);
            if (index === stepArray.length -1) {
                setTimeout(function(){
                    canPlayerGuess = true;
                },gameSpeed * stepArray.length);
            }
        });
    }
    
    $("#strictToggle").click(function() {
        if (strictMode) {
            $('#strictToggle').removeClass('on');
        } else {
            $('#strictToggle').addClass('on');
        }
        
        strictMode = !strictMode;
    });
    
    $("#softReset").click(function() {
       softReset(); 
    });
    
    $(".gameButton").click(function() {
        if (canPlayerGuess) {
            var color = $(this).attr('id');
            if (color === stepArray[currentColorIndex]) {
                correct(color);
            } else {
                incorrect();
            }
        }
    });
    
    function correct(color) {
        blinkLight(color,500);
        currentColorIndex++;
        if (currentColorIndex === stepArray.length) {
            canPlayerGuess = false;
            if (stepArray.length > 20) {
                updateDisplay("You win!");
                setTimeout(function() {
                   softReset(); 
                },6000);
            } else {
                updateDisplay("Correct!");
                setTimeout(function() {
                    increaseSteps();
                },gameSpeed*2);
            }
        }
    }
    
    function incorrect() {
        canPlayerGuess = false;
        if (strictMode) {
            updateDisplay("Nope!");
            setTimeout(function(){
                softReset();
            },gameSpeed*2);
        } else {
            updateDisplay("Watch carefully");
            playSequence();
        }
    }
    
    function increaseSteps() {
        updateDisplay();
        var ran = Math.round(Math.random() * 3);
        var nextStep = availableColors[ran];
        stepArray.push(nextStep);
        playSequence();
        
    }
    
    function initializeGame() {
        increaseSteps();
    }
    
    function updateDisplay(text) {
        if (text) {
            $('#stepDisplay').text(text);
        } else {
            $('#stepDisplay').text(stepArray.length.toString());
        }
    }
    
    function softReset() {
        stepArray = [];
        increaseSteps();
    }
    
    initializeGame();
    
});