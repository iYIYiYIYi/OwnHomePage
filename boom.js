var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

let mouseX, mouseY;

var lifetime = 350;           //粒子生命周期
var max_particle_amount =  100;//最大粒子数，建议5的倍数
var init_particlt_amount =  75;//初始粒子数，建议5的倍数

canvas.height = innerHeight;
canvas.width = innerWidth;

addEventListener('resize', () => {
	canvas.height = innerHeight;
	canvas.width = innerWidth;
	init_particle();
});
addEventListener('mousemove', (e) => {
	mouseX = e.clientX;
	mouseY = e.clientY;
	return mouseX
});

class Particle{
	constructor(x, y, radius, color, velocity){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.velocity = {
			x: (Math.random() - 0.5) * velocity,
			y: (Math.random() - 0.5) * velocity
		}
        var mouseRange = 120;


		this.draw = function(){
			c.save();
			c.beginPath();
			c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			c.fillStyle = this.color;
			c.shadowColor = this.color;
			c.shadowBlur = 5;
			c.fill();
			c.closePath();
			c.restore();
		}
		this.update = function(){
			this.x += this.velocity.x;
			this.y += this.velocity.y;
			var defaultColor = color;
			const xDist = mouseX - this.x;
			const yDist = mouseY - this.y;


			if(this.x + this.radius > innerWidth || this.x - this.radius< 0){
				this.velocity.x = -this.velocity.x;
			}else if(this.y + this.radius > innerHeight || this.y -this.radius < 0){
				this.velocity.y = -this.velocity.y;
			}

			if(xDist < mouseRange && xDist > -mouseRange &&
				yDist < mouseRange && yDist > -mouseRange){
				this.color = '#fff';
				this.x += (4 * this.velocity.x);
				this.y += (4 * this.velocity.y);
			}else{
				this.color = defaultColor;
			}
            this.draw();
            
		}
	}
}

var particlesArray = [];
var colorsArray = ['#3498db','#1abc9c','#e74c3c','#9b59b6'];

function init_particle(){
    var u = navigator.userAgent;
    if(!!u.match(/AppleWebKit.*Mobile.*/)) {
        max_particle_amount /= 5;
        init_particlt_amount /= 5;
    }

	particlesArray = [];
	for(let i = 0; i < init_particlt_amount; i++){
		const randRadius = Math.random() * 8;
		const randX = Math.random() * innerWidth - (2 * randRadius) + randRadius;
		const randY = Math.random() * innerHeight - (2 * randRadius) + randRadius;
		const randVelocity = Math.random() * 6;
		var randColorIndex = Math.floor(Math.random() * colorsArray.length);
		particlesArray.push(new Particle(randX, randY, randRadius, colorsArray[randColorIndex], randVelocity));
    }
    
    //回收粒子
    setInterval(function f(){
        
        if(particlesArray.length > max_particle_amount)
            particlesArray.shift();

        if(particlesArray.length > 2 * max_particle_amount) {
            for(let i = 0;i < max_particle_amount/3; i++) {
                particlesArray.shift();
            }
        }

        if(particlesArray.length > 3 * max_particle_amount) {
            for(let i = 0;i < max_particle_amount/5; i++) {
                particlesArray.shift();
            }
		}
		
		if(particlesArray.length > 10 && Math.random()*100 >= 75) {
			particlesArray.shift();
		}

    },lifetime);
}
addEventListener('click', (e) => {
	for(let i = 0; i < 6; i++){
		const randRadius = Math.random() * 15;
		const randVelocity = Math.random() * 10;
		var randColorIndex = Math.floor(Math.random() * colorsArray.length);
		particlesArray.push(new Particle(e.x, e.y, randRadius, colorsArray[randColorIndex], randVelocity))
	}
});
function animate(){
	c.clearRect(0,0,innerWidth, innerHeight);
	particlesArray.forEach(particle => {
		particle.update();
	})
	requestAnimationFrame(animate);
}

