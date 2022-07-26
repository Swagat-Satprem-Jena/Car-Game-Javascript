import React, { useEffect, useRef } from "react";
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  // console.log(window.screen.width);
  const points = useRef(0);

  useEffect(() => {
    const scoreEl = document.querySelector('.score');
    const msgEl = document.querySelector('.msg');
    const msgTextEl = document.querySelector('.msg-text');
    const gameAreaEl = document.querySelector('.gameArea');

    scoreEl.innerHTML = 'SCORE : 0';


    const keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false
    }

    const keyup = (event) => {
      // console.log(event);
      event.preventDefault();
      keys[event.key] = false;
    }

    const keydown = (event) => {
      keys[event.key] = true;
      event.preventDefault();
      console.log(event.key);
    }

    const moveLines = () => {
      let lineElArr = document.querySelectorAll('.line');
      lineElArr.forEach((item) => {
        let x = item.offsetTop;
        if (x > 770) {
          x = -200;
        }

        item.style.top = (x + player.speed) + 'px';


      })
    }

    const moveEnemyCars = (userCarEl) => {
      let enemyCarElArr = document.querySelectorAll('.enemy-car');
      enemyCarElArr.forEach((item) => {
        if (isCollide(userCarEl, item)) {
          player.start = false;
        }
        let x = item.offsetTop;

        if (x > 770) {
          x = -250;
          item.style.left = Math.floor(Math.random() * 350 + 1) + 'px';
          item.querySelector('.car-img').style.background = randomColor();
        }

        item.style.top = x + player.speed + 'px';
      })
    }

    const isCollide = (userCarEl, enemyCarEl) => {
      let userCarDimObj = userCarEl.getBoundingClientRect();
      let enemyCarDimObj = enemyCarEl.getBoundingClientRect();

      return !((userCarDimObj.right < enemyCarDimObj.left) || (userCarDimObj.left > enemyCarDimObj.right) || (userCarDimObj.bottom < enemyCarDimObj.top) || (userCarDimObj.top > enemyCarDimObj.bottom));

    }

    const gamePlay = () => {


      if (player.start) {
        let gameAreaDimObj = gameAreaEl.getBoundingClientRect();
        let userCarEl = document.querySelector('.car');

        moveLines();
        moveEnemyCars(userCarEl);

        // console.log(gameAreaDimObj);

        // console.log(player.x - player.speed)

        if ((keys.ArrowRight) && (player.x + player.speed < 400 - 50)) {
          console.log('right');
          player.x += player.speed;
        }
        else if ((keys.ArrowDown) && (player.y + player.speed < gameAreaDimObj.bottom - 70)) {
          console.log('down');
          player.y += player.speed;
        }
        else if ((keys.ArrowLeft) && (player.x - player.speed > 0)) {
          console.log('left');
          player.x -= player.speed;
        }
        else if ((keys.ArrowUp) && (player.y - player.speed > gameAreaDimObj.top)) {
          console.log('top');
          player.y -= player.speed;
        }

        userCarEl.style.left = player.x + 'px';
        userCarEl.style.top = player.y + 'px';

        points.current = points.current + 1;
        scoreEl.innerHTML = 'SCORE : ' + points.current;
        if(points.current % 1000 === 0 && points.current > 0)
        player.speed += 5;
        window.requestAnimationFrame(gamePlay);
      }
      else {
        msgEl.classList.remove('hide');
        msgTextEl.innerHTML = `<p>GAME OVER</p><p>HOPE YOU ENJOYED</p><p>YOUR SCORE IS ${points.current}</p><p>CLICK HERE TO START AGAIN</p>`;
        // msgEl.removeEventListener('click', start);
      }

    }

    const randomColor = () => {
      function c() {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ("0" + String(hex)).substr(-2);
      }
      return '#' + c() + c() + c();
    }

    const start = () => {
      console.log(window.screen.height);

      player.start = true;

      msgEl.classList.add('hide');
      // gameAreaEl.classList.remove('hide');
      gameAreaEl.innerHTML = '';
      points.current = 0;
      player.speed = 5;

      let carEl = document.createElement('div');
      carEl.setAttribute('class', 'car');
      let carImgEl = document.createElement('img');
      carImgEl.setAttribute('class', 'car-img');
      carImgEl.setAttribute('src', `${process.env.PUBLIC_URL}images/car.png`);
      carImgEl.setAttribute('alt', 'user-car-img');
      carImgEl.style.background = randomColor();

      gameAreaEl.appendChild(carEl);
      carEl.appendChild(carImgEl);

      player.x = carEl.offsetLeft;
      player.y = carEl.offsetTop;

      // console.log(player.x + " " + player.y);

      for (let i = 0; i < 5; i++) {
        const lineEl = document.createElement('div');
        lineEl.setAttribute('class', 'line');
        lineEl.style.top = (i * 200) + 'px';
        gameAreaEl.appendChild(lineEl);
      }

      for (let i = 0; i < 3; i++) {
        const enemyCarEl = document.createElement('div');
        enemyCarEl.setAttribute('class', 'enemy-car');
        const enemyCarImgEl = document.createElement('img');
        enemyCarImgEl.setAttribute('src', `${process.env.PUBLIC_URL}images/car.png`);
        enemyCarImgEl.setAttribute('class', 'car-img');
        enemyCarImgEl.setAttribute('alt', 'enemy-car-img');
        enemyCarImgEl.style.background = randomColor();
        enemyCarEl.style.left = Math.floor(Math.random() * 350 + 1) + 'px';
        enemyCarEl.style.top = (((i + 1) * 300) * -1) + 'px';

        gameAreaEl.appendChild(enemyCarEl);
        enemyCarEl.appendChild(enemyCarImgEl);
      }

      window.requestAnimationFrame(gamePlay);
    }

    msgEl.addEventListener('click', start);

    document.addEventListener('keyup', keyup);
    document.addEventListener('keydown', keydown);

    const player = { speed: 5 };
  })




  return (
    <>
      <div className="main-div">
        <div className="score"></div>
        <div className="msg">
          <div className="msg-text">
            <p>CLICK HERE TO START THE GAME</p>
            <p>CONTROLS ARE ARROW KEYS</p>
            <p>IF YOU COLLIDE WITH ANY OTHER CAR THEN GAME ENDS</p>
          </div>
        </div>
        <div className="gameArea"></div>
      </div>
    </>
  );
}


export default App;
