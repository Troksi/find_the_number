class FindTheNumberGame {
  constructor() {
    this.time = 60;
    this.score = 0;
    this.level = 1;
    this.isTimeOver;
    this.timerInterval = null;
    this.gridSizes = [
      [2, 3],
      [3, 4],
      [4, 4],
      [5, 5]
    ];
    this.colors = [
      "#FA6371", 
      "#fffb00", 
      "#FFC065", 
      "#73E55B", 
      "#06e0fd", 
      "#AA56CB"  
    ];

    this.$grid = $('#grid');
    this.$target = $('#target-number');
    this.$time = $('#time');
    this.$points = $('#points');
    this.$final = $('#final-score');

  }

  startGame() {
    $('#game-ui-start').hide();
    $('#game-ui').show();

    this.updateUI();
    this.generateRound();
    this.isTimeOver = false;
    this.timerInterval = setInterval(() => {
      if (this.time > 0) this.time--;      
      this.$time.text(this.time);
      if (this.time <= 0) this.isTimeOver = true;
    }, 1000);
    this.applyColorScheme();
    
  }

  endGame() {
    clearInterval(this.timerInterval);
    this.$grid.empty();
    $('#game-ui').hide();
    $('#end-message').show();
    let scoreResult = `${Math.floor(this.score / this.level * 100)}% ${this.score} из ${this.level}`;
    this.$final.text(scoreResult);
  }

  generateNumber(digits = 2,nonRepeating = 0) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    let answer;
    do {
      answer = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (answer === nonRepeating);

    return answer;
  }
  applyColorScheme() {
  const bgColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  let tileColor;
  do {
    tileColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  } while (tileColor === bgColor);

  $('body').css('background-color', bgColor);

  this.tileBackgroundColor = tileColor;
}


  generateRound() {
    const gridIndex = Math.min(this.level - 1, this.gridSizes.length - 1);
    const [rows, cols] = this.gridSizes[gridIndex];
    const tileCount = rows * cols;
    const numberLength = Math.min(2 + Math.floor(this.level / 2), 4);
    const correctIndex = Math.floor(Math.random() * tileCount);
    const targetNumber = this.generateNumber(numberLength);

    this.applyColorScheme();

      this.$grid.css({
        'grid-template-columns': `repeat(${cols}, 1fr)`,
        'grid-template-rows': `repeat(${rows}, 1fr)`
      });
    this.$grid.empty();
    this.$target.text(targetNumber);

    for (let i = 0; i < tileCount; i++) {
      const num = (i === correctIndex) ? targetNumber : this.generateNumber(numberLength,targetNumber);
      const $tile = $('<div>').addClass('tile').text(num);
      $tile.css('background-color', this.colors[Math.floor(Math.random() * this.colors.length)]);

      this.applyRandomEffects($tile);

      if (i === correctIndex) {
        $tile.on('click', () => this.handleCorrect());
      } else {
        $tile.on('click', () => this.handleWrong($tile));
      }

      this.$grid.append($tile);
    }
  }

  handleCorrect() {
    this.score++;
    if (this.isTimeOver) this.endGame();
    this.level++;
    this.$points.text(this.score);
    this.generateRound();
  }
  
  handleWrong() {
    if (this.isTimeOver) this.endGame();
    this.level++;
    this.$points.text(this.score);
    this.generateRound();
  }

  applyRandomEffects($tile) {
    if (this.level >= 2 && Math.random() < 0.2) {
      $tile.css('background-color', this.tileBackgroundColor);
    }
    if (this.level >= 3 && Math.random() < 0.3) {
      $tile.addClass('rotate');
    }
    if (this.level >= 4 && Math.random() < 0.3) {
      $tile.addClass('shrink-grow');
    }
    if (this.level >= 5 && Math.random() < 0.3) {
      $tile.addClass('fade-in-out');
    }
    if (this.level >= 6 && Math.random() < 0.3) {
      $tile.addClass('hidden-text');
    }
  }

  updateUI() {
    this.$time.text(this.time);
    this.$points.text(this.score);
  }
}

let game;

$(document).ready(() => {
  game = new FindTheNumberGame();

  $('#start-button').on('click', () => {
    game.startGame();
  });
});
