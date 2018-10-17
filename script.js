$('document').ready(function() {
  var canPlayerGuess = false;
  var stepArray = []                                        
  var currentColorIndex = 0;                                
  var availableColors = ['red','green','blue','yellow'];    
  var strictMode = true;                                   
  var highScore = 0;                                     
  var gameSpeed = 1000;                                  

  function blinkLight(color) {

    var colorButton = "#" + color;
    $(colorButton).addClass('lit');

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