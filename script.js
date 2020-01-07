const cvs = document.getElementById('pong');
const ctx = cvs.getContext('2d');


/*User paddle*/

const user ={
    x:0,
    y:cvs.height/2 -100/2,
    width : 10,
    height : 100,
    color :'white',
    score : 0

}
//computer paddle
const comp ={
    x:cvs.width -10,
    y:cvs.height/2 -100/2,
    width : 10,
    height : 100,
    color :'white',
    score : 0

}

// create ball

const ball ={
    x :cvs.width/2,
    y : cvs.height/2,
    radius :10,
    speed :5,
    velocityX : 5,
    velocityY : 5,
    color : "white"
}
function drawRect(x,y,w,h,color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

function drawCanvas(x,y,w,h,color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}
drawCanvas(0,0,cvs.width,cvs.height,"black");

function drawCircle(x,y,r,color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}
function drawText(text,x,y,color){
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text,x,y);
}

// create Net

const net = {
    x : cvs.width/2 - 1,
    y : 0,
    width :2,
    height : 10,
    color : "white"
}

function drawNet(){
    for(let i = 0 ;i<=cvs.height;i+=15){
        drawRect(net.x,net.y+i,net.width,net.height,net.color);
    }
}

function render(){

    //clearing canvas
    drawRect(0,0,cvs.width,cvs.height,"black");

    drawNet();

    //drawScore

    drawText(user.score,cvs.width/4,cvs.height/5,"white");
    drawText(comp.score,3*cvs.width/4,cvs.height/5,"white");


    //draw paddles
    drawRect(user.x,user.y,user.width,user.height,user.color);
    drawRect(comp.x,comp.y,comp.width,comp.height,user.color);
    
    //draw ball

    drawCircle(ball.x,ball.y,ball.radius,'white');
}
//collison beetween ball and player
function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && 
    b.top < p.bottom;
}
//reset ball
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

//upadte-->move,etc

function update(){
    ball.x += ball.velocityX;
    ball.y  += ball.velocityY;

    //AI to control comp paddle
    let complevel = 0.1;
    comp.y += (ball.y - (comp.y + comp.height/2)) * complevel;    


    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }
    let player = (ball.x < cvs.width/2) ? user : comp;

    if(collision(ball,player)){
            let collidepoint = ball.y - (player.y + (player.height/2));

            collidepoint = collidepoint/player.height/2;
            
            let angleRad = collidepoint * Math.PI/4;
            //change direction after hitting
            let direction = (ball.x < cvs.width/2) ? 1:-1;
            //change vel x and Y

            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = ball.speed * Math.sin(angleRad);

            //increse speed

            ball.speed+= 0.3;

    }
    if(ball.x - ball.radius < 0){
        comp.score++;
        resetBall();
    }else if(ball.x + ball.radius > cvs.width){
            user.score++;
            resetBall();
    }

}

//usesr control
cvs.addEventListener('mousemove',movePaddle);
function movePaddle(){
    let rect = cvs.getBoundingClientRect(event);
    user.y = event.clientY - rect.top - user.height/2;

}


//game

function game(){
    update();
    render();
}
setInterval(game,1000/50);
