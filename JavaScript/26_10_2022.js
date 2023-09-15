window.addEventListener('load',main,false);
function main () {
		var mathMethods = Object.getOwnPropertyNames(Math);
	for (var i in mathMethods)
		this[mathMethods[i]] = Math[mathMethods[i]];
		var M = Math;
	// canvases
	// particles draw
	var ctx = cnv.getContext('2d');
	var h = cnv.height;
	var w = cnv.width;
	//
	// CONSTS
	//
	var y = h/2; // for center draw
	var C = 100; // жесткость пружин
	var E1,E2;
	var t = 0;
	var c1 = M.pow(C/1,1/2);
	var c2 = M.pow(C/2,1/2);
	var dt0 = 2*Math.PI*Math.pow(1/C,0.5); // шаг по времени
	var fps = 120;
	var y_scale = 10;
	// объекты html(интерфейс
	var fps_value = document.getElementById('fps_range');
	// переменные
	var speedy = document.getElementById('speed');
	var sp = speedy.value;
	var dt = sp*dt0;
	spd.innerHTML = sp;
	var partcls = []; // массив частиц
	// var partclsB = []; // для решения через ф бесселя
	var move = false;
	var time = 0;
	var spp = 1;
	var howOfP = document.getElementById('HOP').value;
	var ioio = 0;
	Massive = [];
	var P1_x_plus = []; // массив квазичастиц
	var P1_x_minus = [];
	var P2_x_plus = [];
	var P2_x_minus = [];
	var value = 0;
	function generateP_ravn(Numb, left,right) { // генерация равномерно распределенных одинаковых частиц ( 2*Numb)
		var rad = (right - left)/Numb;
		var rad_2 = rad/2;
		var pplus = [];
		for (var i = 0; i < Numb; i++) {
			pplus.push(left + rad*i + rad_2);
		}
		return [pplus,rad_2]; // возвращает массив и радиус частиц
	}
	
	HOP.onchange = function () { 
		howOfP = parseInt(HOP.value);
		clearint(interv);
		if (howOfP != 1) {interv = setInterval(control_sec,1000/fps);} else {interv = setInterval(control,1000/fps);} 
	}			
			
	speed.oninput = function () {
		if (flag != 1) {
			sp = parseFloat(speedy.value);
			spd.innerHTML = sp;
		}
	}
	fps_range.oninput = function () { 
		if (flag != 1) {
			fps = fps_value.value;
			howof.innerHTML = fps;
			clearint(interv);
			if (howOfP != 1) { interv = setInterval(control_sec,1000/fps);} else { interv = setInterval(control,1000/fps);}
		}
	}
	
	function phys() {
		t += dt;
		dt = dt0*sp;
		for (var i = 0; i < P1_x_plus.length; i++) {
			// console.log(P1_x_plus[0]);
			P1_x_plus[i] = (P1_x_plus[i] + c1*dt) % w;
			// P1_x_plus[i] += 10;
			// console.log(P1_x_plus[0]);
			// P1_x_plus[i] += c1*dt;
			P1_x_minus[i] = (P1_x_minus[i] - c1*dt >= 0) ? P1_x_minus[i] - c1*dt : w + P1_x_minus[i] - c1*dt;
		}     
		for (var j = 0; j < P2_x_plus.length; j++) {
			P2_x_plus[j] = (P2_x_plus[j] + c2*dt) % w;
			P2_x_minus[j] = (P2_x_minus[j] - c2*dt >= 0) ? P2_x_minus[j] - c2*dt : w + P2_x_minus[j] - c2*dt;
		}
		// теперь, когда посчитали новые иксы, должны понять, к какой части цепочки они относятся
		for (var i = 0; i< P1_x_plus.length; i++) {
			if (P1_x_plus[i] > 500) { 
				// тогда удаляет отсюда, добавляем в другой массив
				P2_x_plus.push(P1_x_plus[i]);
				P1_x_plus.splice(i,1);
			}
		}
		for (var i = 0; i< P1_x_minus.length; i++) {
			if (P1_x_minus[i] > 500) { 
				// тогда удаляет отсюда, добавляем в другой массив
				P2_x_minus.push(P1_x_minus[i]);
				P1_x_minus.splice(i,1);
			}
		}
		for (var i = 0; i< P2_x_plus.length; i++) {
			if (P2_x_plus[i] <= 500) { 
				// тогда удаляет отсюда, добавляем в другой массив
				P1_x_plus.push(P2_x_plus[i]);
				P2_x_plus.splice(i,1);
			}
		}
		for (var i = 0; i< P2_x_minus.length; i++) {
			if (P2_x_minus[i] <= 500) { 
				// тогда удаляет отсюда, добавляем в другой массив
				P1_x_minus.push(P2_x_minus[i]);
				P2_x_minus.splice(i,1);
			}
		}
		// теперь, мы правильно поняли в какой части находятся частицы, можем посчитать энергию в каждой части цепочки
		ENE1 = (P1_x_minus.length + P1_x_plus.length)*E1;
		ENE2 = (P2_x_minus.length + P2_x_plus.length)*E2;
		
	}
	function writeEnerg() {
		// рисуем график движения энергетического центра 
		// сначала отрисовываем оси
		if (time == 6000) {
		  time = 0;
		  ioio++;
		  var element = document.createElement('a');
		  element.setAttribute('href', 'data:text/plain;charset=utf-8,'+ encodeURIComponent(Massive) +"\n");
		  var namewrite = String(ioio)+'_F1.txt';
		  element.setAttribute('download', namewrite);

		  element.style.display = 'none';
		  document.body.appendChild(element);

		  element.click();

		  document.body.removeChild(element);
		  Massive = [];
		  set_exp();
		}
		time += spp*1;
		Massive.push(ENE1-ENE2);
		
	}
	function draw() {
		ctx.clearRect(0,0,w,h);
		ctx.beginPath();
		for (var i = 0; i<P1_x_plus.length; i++) {
			ctx.arc(P1_x_plus[i], 125, radius1, 0, 2*M.PI);
			// ctx.stroke();
		}
		for (var i = 0; i<P1_x_minus.length; i++) {
			ctx.arc(P1_x_minus[i], 125, radius1, 0, 2*M.PI);
			// ctx.stroke();
		}
		for (var i = 0; i<P2_x_plus.length; i++) {
			ctx.arc(P2_x_plus[i], 125, radius2, 0, 2*M.PI);
			// ctx.stroke();
		}
		for (var i = 0; i<P2_x_minus.length; i++) {
			ctx.arc(P2_x_minus[i], 125, radius2, 0, 2*M.PI);
		}
		ctx.stroke();
	}
	function clearint(interv) { 
		clearInterval(interv);
	}

	function control() {
		phys();
		draw();
		writeEnerg();
	}
	function set_exp() {
		E1 = 5;
		res1 = generateP_ravn(30, 0,500,);
		P1_x_plus = P1_x_minus = res1[0];
		radius1 = res1[1];
		b1 = 2*radius1;
		res2 = generateP_ravn(10, 500,1000);
		P2_x_plus = P2_x_minus = res2[0];
		radius2 = res2[1];
		b2 = 2*radius2;
		E2 = c1/c2*b2/b1*E1;
	}
	set_exp();
	// draw();
	// var A = [1,2,3]
	// interv = setInterval(control,1000/fps);
	control();
	control();
}