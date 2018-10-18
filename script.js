(function() {
  'use strict';

  const $ = {
    elByID: el => document.getElementById(el),
    query: (search, callback) => {
      let els = Array.from(document.querySelectorAll(search));
      els.forEach(callback);
    }
  };

  let canPlayerGuess = false;
  let stepArray = []                                        
  let currentColorIndex = 0;                                
  let availableColors = [];
  let strictToggle = $.elByID('strictToggle');

  let highScore = 0;                                     
  let gameSpeed = 1000;                                  

  function blinkLight(color) {
    $.elByID(color).classList.add('lit');

    playSound(color);

    setTimeout(function() {
      $.elByID(color).classList.remove('lit');
      stopSound(color);
    },gameSpeed-200);
  }

  function playSound(color) {
    stopSound(color);
    let obj = document.getElementById(color).children[0];
    obj.play();
  }

  function stopSound(color) {
    let obj = document.getElementById(color).children[0];
    obj.pause();
    obj.currentTime = 0;
  }

  function playSequence() {
    canPlayerGuess = false;
    currentColorIndex = 0;

    stepArray.forEach((value, index) => {
      setTimeout(function() {
        blinkLight(value,gameSpeed);

      },gameSpeed * index);
      if (index === stepArray.length -1) {
        setTimeout(function(){
          canPlayerGuess = true;
        },gameSpeed * stepArray.length);
      }
    });
  }

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
    if (strictToggle.classList.contains('on')) {
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
    let ran = Math.round(Math.random() * 3);
    let nextStep = availableColors[ran];
    stepArray.push(nextStep);
    playSequence();

  }

  function initializeGame() {
    increaseSteps();
  }

  function updateDisplay(text) {
    let display = $.elByID('stepDisplay');
    if (text) {
      display.innerHTML = text;
    } else {
      display.innerHTML = stepArray.length.toString();
    }
  }

  function softReset() {
    stepArray = [];
    increaseSteps();
  }

  document.addEventListener('DOMContentLoaded', () => {
    $.query('#simon-controls .gameButton', el => {
      availableColors.push(el.getAttribute('id'));
    })

    strictToggle.addEventListener('click', () => {
      strictToggle.classList.toggle('on');
    });

    $.elByID('softReset').addEventListener('click', () => {
      softReset(); 
    });

    $.query('.gameButton', el => {
      el.addEventListener('click', e => {
        if (e.target || e.target.classList.contains('gameButton')) {
          if (canPlayerGuess) {
            let color = e.target.getAttribute('id');
            if (color === stepArray[currentColorIndex]) {
              correct(color);
            } else {
              incorrect();
            }
          }
        }
      });
    });

    initializeGame();

  });
}());