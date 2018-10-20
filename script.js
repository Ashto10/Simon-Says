(function() {
  'use strict';

  const $ = {
    elByID: el => document.getElementById(el),
    query: (search, callback) => {
      let els = Array.from(document.querySelectorAll(search));
      els.forEach(callback);
    }
  };

  let canPlayerGuess = false,
      stepArray = [],                        
      currentColorIndex = 0,                                
      availableColors = [],
      strictToggle = $.elByID('strictToggle'),
      gameSpeed = 1000;                                  

  function blinkLight(color) {
    if (color === undefined) { return; }
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

  function playSequence(count = 0) {
    canPlayerGuess = false;
    currentColorIndex = 0;
    $.query('.gameButton', el => {
      el.classList.remove('waiting');
    });

    if (count >= stepArray.length) {
      setTimeout(() => {
        canPlayerGuess = true;
        $.query('.gameButton', el => {
          el.classList.add('waiting');
        });
      }, gameSpeed)
      canPlayerGuess = true;
    } else {
      setTimeout(function() {
        blinkLight(stepArray[count],gameSpeed);
        playSequence(count + 1);
      }, gameSpeed);
    }
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
    $.query('.gameButton', el => {
      el.classList.remove('waiting');
    });
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
    availableColors.forEach(color => {
      stopSound(color);
      $.elByID(color).classList.remove('lit');
    });
    increaseSteps();
  }

  document.addEventListener('DOMContentLoaded', () => {
    $.query('#simon-controls .gameButton', el => {
      availableColors.push(el.getAttribute('id'));
    });

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