var confetti = function(){
	var obj = this ;
	var canvas;
	var ctx;
	var confettiHandler;
	var W;
	var H;
	var mp = 70; //max particles
	var particles = [];
	var logo = new Image();  
	var fallType = 'normal' ;
	$(window).resize(function () {
	    canvas = document.getElementById("canvas");
	    W = window.innerWidth;
	    H = window.innerHeight;
	    canvas.width = W;
	    canvas.height = H;
	});
	$(document).ready(function () {
	    canvas = document.getElementById("canvas");
	    ctx = canvas.getContext("2d");
	    W = window.innerWidth;
	    H = window.innerHeight;
	    canvas.width = W;
	    canvas.height = H;
		var colors = ["#ff8110","#ffd81a","#67ccce","#ff3366","#e38c8d"]
	    for (var i = 0; i < mp; i++) {
	        particles.push({
	            x: Math.random() * W, //x-coordinate
	            y: Math.random() * H, //y-coordinate
	            r: randomFromTo(5, 30), //radius
	            d: (Math.random() * mp) + 10, //density
	            color: colors[parseInt(Math.random()*5)],
	            tilt: Math.floor(Math.random() * 10) - 10,
	            tiltAngleIncremental: (Math.random() * 0.07) + .05,
	            tiltAngle: 0
	        });
	    }
	});
	function draw() {
	    ctx.clearRect(0, 0, W, H);
	    var n = 0 ;
	    for (var i = 0; i < mp; i++) {
	        var p = particles[i];
	        if(n==0){
	            ctx.beginPath();
	            ctx.arc(p.x, p.y,p.r/2, 0, Math.PI * 2, true);
	            ctx.fillStyle = p.color;
	            ctx.fill();
	        }else if(n==1){
	            ctx.beginPath();
	            ctx.lineWidth = p.r / 2;
	            ctx.strokeStyle = p.color;  // Green path
	            ctx.moveTo(p.x + p.tilt + (p.r / 4), p.y);
	            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 4));
	            ctx.stroke();  // Draw it
	        }else if(n==2){
	        	if(fallType=='egg'){
					ctx.drawImage(logo, p.x, p.y,2.695*p.r,3.5*p.r);
	        	}else{
	        		ctx.drawImage(logo, p.x, p.y,25,25);
	        	}
				n=-1;
	        }
	        n++;
	    }
	    update();
	}
	function randomFromTo(from, to) {
	    return Math.floor(Math.random() * (to - from + 1) + from);
	}
	var TiltChangeCountdown = 5;
	var angle = 0;
	var tiltAngle = 0;
	function update() {
	    angle += 0.01;
	    tiltAngle += 0.1;
	    TiltChangeCountdown--;
	    for (var i = 0; i < mp; i++) {
	        var p = particles[i];
	        p.tiltAngle += p.tiltAngleIncremental;
	        p.y += (Math.cos(angle + p.d) + 1 + p.r / 2) / 2;
	        p.x += Math.sin(angle);
	        p.tilt = (Math.sin(p.tiltAngle - (i / 3))) * 15;
	        if (p.x > W + 5 || p.x < -5 || p.y > H) {
	            if (i % 5 > 0 || i % 2 == 0){
	                particles[i] = { x: Math.random() * W, y: -10, r: p.r, d: p.d, color: p.color, tilt: Math.floor(Math.random() * 10) - 10, tiltAngle: p.tiltAngle, tiltAngleIncremental: p.tiltAngleIncremental };
	            }else {
	                if (Math.sin(angle) > 0) {
	                    particles[i] = { x: -5, y: Math.random() * H, r: p.r, d: p.d, color: p.color, tilt: Math.floor(Math.random() * 10) - 10, tiltAngleIncremental: p.tiltAngleIncremental };
	                }else {
	                    particles[i] = { x: W + 5, y: Math.random() * H, r: p.r, d: p.d, color: p.color, tilt: Math.floor(Math.random() * 10) - 10, tiltAngleIncremental: p.tiltAngleIncremental };
	                }
	            }
	        }
	    }
	}
	this.StartConfetti = function(type) {
	    W = window.innerWidth;
	    H = window.innerHeight;
	    canvas.width = W;
	    canvas.height = H;
	    if(type=='egg'){
	    	fallType = 'egg';
			logo.src = "public/images/money.png"; 
	    }else{
	    	fallType = 'normal';
	    	logo.src = "public/images/logo.png"; 
	    }
	    confettiHandler = setInterval(draw, 15);
	}
	this.StopConfetti = function() {
	    clearTimeout(confettiHandler);
	    if (ctx == undefined) return;
	    ctx.clearRect(0, 0, W, H);
	}
}
