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
	// graf draw
	var ctx2 = gcnv.getContext('2d');
	var h2 = gcnv.height;
	var w2 = gcnv.width;
	// mass distribution
	var ctx_m = mass_cnv.getContext('2d');
	var h_m = mass_cnv.height;
	var w_m = mass_cnv.width;
	// second graf draw
	// var ctx_g = g2cnv.getContext('2d');
	// var ctx_g2 = g3cnv.getContext('2d');
	//
	// CONSTS
	//

	var y = h/2; // for center draw
	var C = 100; // жесткость пружин
	var dt0 = 2*Math.PI*Math.pow(1/C,0.5)/100; // шаг по времени
	var fps = 60;
	var y_scale = 1;
	// объекты html(интерфейс
	var N = (document.getElementById('Quantity').value); // количество частиц
	var yscal = document.getElementById('yscale'); // масштаб по Oy
	var speedy = document.getElementById('speed'); // скорость моделирования через dt
	var mode = document.getElementsByName('mode'); // режим
	var massbtn = document.getElementById('mass'); // присвоение массы частице
	var mass_text = document.getElementById('mass_value'); // какое значение присваиваем 
	var fps_value = document.getElementById('fps_range');
	// переменные
	var sp = speedy.value;
	var dt = sp*dt0;
	var r;
	var v;
	var coord1;
	var coord2;
	energ = document.getElementById('energy');
	spd.innerHTML = sp;
	var flag = 0;
	var partcls = []; // массив частиц
	// var partclsB = []; // для решения через ф бесселя
	var move = false;
	var Mark = []; // массив для понимания, выбрали ли мы частицу уже или нет( нужно в части выбора частиц)
	var marker;
	var d = 0;
	var time = 0;
	var spp = 1;
	var howOfP = document.getElementById('HOP').value;
	var t = 0;
	// var t_bes = 0;
	var v0 = +(document.getElementById('v').value);
	var tt = 0;
	var stepp;
	var E_zones = [];
	var step_W = w/2;
	var is = 0;
	
	function switchdt() {
		switch (flag) {
			case 0: {
				flag = 1;
				sp = 0;
				spp = 0;
				break;
			}
			case 1: {
				flag = 0;
				sp = speed.value;
				spp = 1;

			}
		}
	}	
	HOP.onchange = function () { 
		howOfP = parseInt(HOP.value);
		clearint(interv);
		if (howOfP != 1) {interv = setInterval(control_sec,1000/fps);} else {interv = setInterval(control,1000/fps);} 
	}
		
	Pause.onclick = function () { switchdt();}
	function draw_mass () { 
		ctx.clearRect(0,0,w,h);
		ctx_m.clearRect(0,0,w_m,h_m);
		for (var q = 1; q<=N; q++) {
			var c = String(255-partcls[q].m*60);
			ctx.beginPath();
			partcls[q].rgb = "rgba("+c+","+c+","+c+",255)";
			ctx.fillStyle = partcls[q].rgb;
			ctx.arc(partcls[q].x,y,r,0,2*M.PI);
			ctx.fill();
			ctx.stroke();
		}
		var n_pred = 1;
		for (q = 2; q<=N+1; q++) { 
			if ((q == N+1)||(String(partcls[q].m) != String(partcls[q-1].m))) { 
			 // если массы не равны, то ставим разделитель
			 ctx_m.beginPath(); 
			 ctx_m.fillStyle = partcls[q-1].rgb; 
			 ctx_m.rect(partcls[n_pred].x - r,0,partcls[q-1].x + r,h_m);
			 ctx_m.fill();
			 if ((2*r) <= h_m) { 
				if (2*r <= 8) {
					ctx_m.font= "12px Arial";
				}else {
				ctx_m.font= String(2*r)+"px" + " Arial";
				}
			 } else { 
				ctx_m.font= String(h_m) + "px" + " Arial";
			 }
			var c = 60*partcls[q-1].m
			ctx_m.fillStyle = "rgba("+c+","+c+","+c+",255)";
			ctx_m.fillText((partcls[q-1].m).toFixed(2),(partcls[q-1].x+partcls[n_pred].x)/2,h_m-3);
			n_pred = q;
			 ctx_m.stroke();
			}
		}
		
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
	yscale.oninput = function () { 
		y_scale = parseFloat(yscal.value);
	}
		
	massbtn.onclick = function () { 
		// должны присвоить массы и снять выделение с частиц
		var mass = parseFloat(mass_text.value); 
		ctx.beginPath();
		for (q = 1;q<=N; q++) {
			if (partcls[q].rgb == "rgba(255,0,0,255)") {
				partcls[q].m = mass;
				partcls[q].flag = 1;
			}
			var c = String(255-partcls[q].m*75);
			partcls[q].rgb = "rgba("+c+","+c+","+c+",255)"
			ctx.beginPath();
			ctx.arc(partcls[q].x,y,r,0,2*Math.PI);
			ctx.fillStyle = partcls[q].rgb;
			ctx.fill();
			ctx.stroke();
		}
		draw_mass();
	}

	Model.onclick = function() {
		if (Number(document.getElementById('num').value) != 0) { 
			is = 0;
			N = Number(document.getElementById('Quantity').value);
			count(N);
			zero();
			set_exp(Number(document.getElementById('num').value));
		} else {
			flag = 0;
			i = document.getElementById('first').value % N;
			if ( i == 0) { i = N;}
			for (q = 1;q<=N; q++) {
				dist = 35/15*r;
				partcls[q].x = r+(q-1)*dist;
				partcls[q].u = 0;
				partcls[q].v = 0;
				ctx.beginPath();
				ctx.arc(partcls[q].x,y,r,0,2*Math.PI);
				ctx.fillStyle = partcls[q].rgb;
				ctx.fill();
				ctx.stroke();
			}
			partcls[i].v = parseFloat(document.getElementById('v').value);
			coeff = partcls[i].v;
			draw_mass();
		}
	}
	New.onclick = function() {
		is = 0;
		flag = 0;
		marker = 1;
		N = Number(document.getElementById('Quantity').value);
		count(N);
		i = document.getElementById('first').value % N;
		point = i;
		partcls[i].v = parseFloat(document.getElementById('v').value);
		coeff = partcls[i].v;
		document.getElementById('num').value = 0;
		draw_mass ();
		check_exp(marker);
		exper.innerHTML = '';
	}

	document.getElementById('masses').onchange = () => {
		main_block.style.display = 'none';
		text_slide.style.display = 'inline';
		clearint(interv); // остановили моделирование
		num.value = 0;
		ctx.clearRect(0,0,w,h);
		for (q = 1;q<=N; q++) {
			ctx.beginPath();
			ctx.arc(partcls[q].x,y,r,0,2*Math.PI);
			ctx.fillStyle = partcls[q].rgb;
			ctx.fill();
			ctx.stroke();
		}
	}
	// OneM.onchange = () => {
		// varyM.style.display = 'none';
		// выбрали режим одинаковых масс, значит, надо все привести к начальному виду
		// t = 0; // время 0-ое,
		// flag = 0;
		// switchdt();
		// count(N); // нулевые н.у
		// coeff = 0; // коэфф при фиях бесселя тоже 0 
		// теперь надо очистить графики радиуса инерции и энергетического центра
		// time = 0;
		// ctx_g.clearRect(0,0,w,h);
		// ctx_g2.clearRect(0,0,w,h);
		// document.getElementById('num').value = 0; // нулевой эксперимент 
		// draw_mass ();// рисуем массы
		// Bess.style.display = 'inline';
	// }
	// ManyM.onchange = () => {
		// varyM.style.display = 'inline';
		// Bess.style.display = 'none';
	// }
	document.getElementById('model').onchange = () => {
		main_block.style.display = 'inline';
		massbtn.style.display = 'none';
		mass_text.style.display = 'none';
		text_slide.style.display = 'none';
		interv = setInterval(control,1000/fps);
		draw_mass();
		exp1.style.display = 'none';
		exp2.style.display = 'none';
	}
		
	function count(number){
		r = w*15/(35*number-5);
		dist = 35/15*r;
		for (var i = 1; i <= number; i++) {
			var b = [];            
			b.u = 0;   b.v = 0; b.x = i*w/(number+1/2); b.m = 1; b.flag = 1; b.v_p = 0;
			var c = String(255-b.m*75); b.rgb = "rgba("+c+","+c+","+c+",255)";
			partcls[i] = b;               
		}
		// for (var i = 1; i <= number; i++) {
			// var b = [];            
			// b.u = 0;   b.v = 0; b.x = i*w/(number+1/2); b.m = 1; b.flag = 1; b.v_p = 0;
			// var c = String(255-b.m*75); b.rgb = "rgba("+c+","+c+","+c+",255)";
			// partclsB[i] = b;               
		// }
	}
	function zero() { 
		for (q = 1; q<=N; q++) { 
			partcls[q].v = 0;
			partcls[q].u = 0;
		}
	}
	count(N);
	
			partcls[1].v += (partcls[2].u-2*partcls[1].u+partcls[N].u)*C*dt/partcls[1].m;
		for (var i=2;i<N;i++) {
			partcls[i].v += (partcls[i+1].u-2*partcls[i].u+partcls[i-1].u)*C*dt/partcls[i].m;
		}
		// для последнего
		partcls[N].v += (partcls[1].u-2*partcls[N].u+partcls[N-1].u)*C*dt/partcls[N].m;
		for (var a = 1; a<=N;a++) { 
			partcls[a].u += partcls[a].v*dt;
		}

	function phys () {
		// найдем координаты центра масс чтобы потом учесть его смещение
		// if (t == 0) { h0 = Ene*(x_c - x_c_pr)/dt;}
		t += dt;
		var numr = 0;
		var denum = 0;
		for (i = 1; i<=N; i++) {
			numr += partcls[i].m*(partcls[i].x+partcls[i].u);
			denum += partcls[i].m;
		}
		var coords1 = numr/denum;
		// теперь надо расписать два случая: dt < 0, dt > 0
		dt = dt0*sp;
		// запомним ускорение
		// для первого 
		// пересчет
		// для последнего 
		if (dt > 0) {
			// для первого
			partcls[1].v += (partcls[2].u-2*partcls[1].u+partcls[N].u)*C*dt/partcls[1].m;
			for (var i=2;i<N;i++) {
				partcls[i].v += (partcls[i+1].u-2*partcls[i].u+partcls[i-1].u)*C*dt/partcls[i].m;
			}
			// для последнего
			partcls[N].v += (partcls[1].u-2*partcls[N].u+partcls[N-1].u)*C*dt/partcls[N].m;
			// partcls[N].v = 0; 
			for (var a = 1; a<=N;a++) { 
				partcls[a].u += partcls[a].v*dt;
			}
			
		} else {
		// dt < 0
			// сначала считаем перемещения
			for (var a = 1; a<=N; a++) { 
				partcls[a].u += partcls[a].v*dt;
			}
			// теперь скорости 
			// для 1-го
			partcls[1].v += (partcls[2].u-2*partcls[1].u+partcls[N].u)*C*dt/partcls[1].m;
			// середина
			for (var i=2;i<N;i++) {
				partcls[i].v += (partcls[i+1].u-2*partcls[i].u+partcls[i-1].u)*C*dt/partcls[i].m;
			}
			// последний
			partcls[N].v += (partcls[1].u-2*partcls[N].u+partcls[N-1].u)*C*dt/partcls[N].m;
		}
		partcls[1].v_p = (partcls[2].u-2*partcls[1].u+partcls[N].u)*C/partcls[1].m; 
		for (q = 2; q<N; q++) { 
			partcls[q].v_p = (partcls[q+1].u-2*partcls[q].u+partcls[q-1].u)*C/partcls[q].m; 
		}
		partcls[N].v_p = (partcls[1].u-2*partcls[N].u+partcls[N-1].u)*C/partcls[N].m; 
		numr = 0;
		denum = 0;
		for (i = 1; i<=N; i++) {
			numr += partcls[i].m*(partcls[i].x+partcls[i].u);
			denum += partcls[i].m;
		}
		var coords2 = numr/denum;
		d = coords2 - coords1;
		// теперь посчитаем энергию во всех зонах
		countEnerg(2);
	}
		function countEnerg(nums) { 
			var howmany = parseInt(N/nums);
			E_zones = [];
			for (var joj = 0; joj < nums; joj++) {E_zones[joj] = 0;}
			E_zones[0] += parseFloat(partcls[1].m)*Math.pow(partcls[1].v,2)/2 + 1/4*C*(Math.pow(partcls[2].u-partcls[1].u,2)+Math.pow(partcls[1].u - partcls[N].u,2));
			for (var q = 2; q<N; q++) {
				var ii = Math.floor(q/howmany);
				E_zones[ii] += parseFloat(partcls[q].m)*Math.pow(partcls[q].v,2)/2 + 1/4*C*(Math.pow(partcls[q+1].u-partcls[q].u,2)+Math.pow(partcls[q].u - partcls[q-1].u,2));
			}
			E_zones[nums-1] += parseFloat(partcls[N].m)*Math.pow(partcls[N].v,2)/2 + 1/4*C*(Math.pow(partcls[1].u-partcls[N].u,2)+Math.pow(partcls[N].u - partcls[N-1].u,2));
		}
		
		
		function _horner(arr, v) { for(var i = 0, z = 0; i < arr.length; ++i) z = v * z + arr[i]; return z; }
	function _bessel_iter(x, n, f0, f1, sign) {
  if(n === 0) return f0;
  if(n === 1) return f1;
  var tdx = 2 / x, f2 = f1;
  for(var o = 1; o < n; ++o) {
    f2 = f1 * o * tdx + sign * f0;
    f0 = f1; f1 = f2;
  }
  return f2;
}
	function _bessel_wrap(bessel0, bessel1, name, nonzero, sign) {
  return function bessel(x,n) {
    if(nonzero) {
      if(x === 0) return (nonzero == 1 ? -Infinity : Infinity);
      else if(x < 0) return NaN;
    }
    if(n === 0) return bessel0(x);
    if(n === 1) return bessel1(x);
    if(n < 0) return NaN;
    n|=0;
    var b0 = bessel0(x), b1 = bessel1(x);
    return _bessel_iter(x, n, b0, b1, sign);
  };
}
	function phys_Bessel(){
		t_bes = nu*t;
		for (var i = 1; i < partclsB.length; i++) {
			// partclsB[i].v = offset*besselj(t_bes, 2*i-point);
			partclsB[i].u = offset*( besselj(t_bes, 2*(i-point)) + besselj(t_bes,2*(i-point)+2*N) + besselj(t_bes,2*(i-point)-2*N));
			//besselj(t_bes,i-point+(partclsB.length-1))+besselj(t_bes,i-point-(partclsB.length-1))+besselj(t_bes,i-point+2*(partclsB.length-1))+besselj(t_bes,i-point+3*(partclsB.length-1))+besselj(t_bes,i-point+4*(partclsB.length-1))+besselj(t_bes,i-point-2*(partclsB.length-1))+besselj(t_bes,i-point-3*(partclsB.length-1))+besselj(t_bes,i-point-4*(partclsB.length-1)));
		}
			
		t += dt;
	}
	var besselj = (function() {
  var W = 0.636619772; // 2 / Math.PI

  var b0_a1a = [57568490574.0, -13362590354.0, 651619640.7, -11214424.18, 77392.33017, -184.9052456].reverse();
  var b0_a2a = [57568490411.0, 1029532985.0, 9494680.718, 59272.64853, 267.8532712, 1.0].reverse();
  var b0_a1b = [1.0, -0.1098628627e-2, 0.2734510407e-4, -0.2073370639e-5, 0.2093887211e-6].reverse();
  var b0_a2b = [-0.1562499995e-1, 0.1430488765e-3, -0.6911147651e-5, 0.7621095161e-6, -0.934935152e-7].reverse();

  function bessel0(x) {
    var a=0, a1=0, a2=0, y = x * x;
    if(x < 8) {
      a1 = _horner(b0_a1a, y);
      a2 = _horner(b0_a2a, y);
      a = a1 / a2;
    } else {
      var xx = x - 0.785398164;
      y = 64 / y;
      a1 = _horner(b0_a1b, y);
      a2 = _horner(b0_a2b, y);
      a = M.sqrt(W/x)*(M.cos(xx)*a1-M.sin(xx)*a2*8/x);
    }
    return a;
  }

  var b1_a1a = [72362614232.0, -7895059235.0, 242396853.1, -2972611.439, 15704.48260, -30.16036606].reverse();
  var b1_a2a = [144725228442.0, 2300535178.0, 18583304.74, 99447.43394, 376.9991397, 1.0].reverse();
  var b1_a1b = [1.0, 0.183105e-2, -0.3516396496e-4, 0.2457520174e-5, -0.240337019e-6].reverse();
  var b1_a2b = [0.04687499995, -0.2002690873e-3, 0.8449199096e-5, -0.88228987e-6, 0.105787412e-6].reverse();

  function bessel1(x) {
    var a=0, a1=0, a2=0, y = x*x, xx = M.abs(x) - 2.356194491;
    if(Math.abs(x)< 8) {
      a1 = x*_horner(b1_a1a, y);
      a2 = _horner(b1_a2a, y);
      a = a1 / a2;
    } else {
      y = 64 / y;
      a1=_horner(b1_a1b, y);
      a2=_horner(b1_a2b, y);
      a=M.sqrt(W/M.abs(x))*(M.cos(xx)*a1-M.sin(xx)*a2*8/M.abs(x));
      if(x < 0) a = -a;
    }
    return a;
  }

  return function besselj(x, n) {
    n = Math.round(n);
    if(!isFinite(x)) return isNaN(x) ? x : 0;
    if(n < 0) return ((n%2)?-1:1)*besselj(x, -n);
    if(x < 0) return ((n%2)?-1:1)*besselj(-x, n);
    if(n === 0) return bessel0(x);
    if(n === 1) return bessel1(x);
    if(x === 0) return 0;

    var ret=0.0;
    if(x > n) {
      ret = _bessel_iter(x, n, bessel0(x), bessel1(x),-1);
    } else {
      var m=2*M.floor((n+M.floor(M.sqrt(40*n)))/2);
      var jsum=false;
      var bjp=0.0, sum=0.0;
      var bj=1.0, bjm = 0.0;
      var tox = 2 / x;
      for (var j=m;j>0;j--) {
        bjm=j*tox*bj-bjp;
        bjp=bj;
        bj=bjm;
        if (M.abs(bj) > 1E10) {
          bj *= 1E-10;
          bjp *= 1E-10;
          ret *= 1E-10;
          sum *= 1E-10;
        }
        if (jsum) sum += bj;
        jsum=!jsum;
        if (j == n) ret=bjp;
      }
      sum=2.0*sum-bj;
      ret /= sum;
    }
    return ret;
  };
})();
	
	cnv.onmousedown = function () { 
		if (mode[0].checked) {
			if (massbtn.style.display == 'none') {
				massbtn.style.display = 'inline';
			}
			if (mass_text.style.display == 'none') {
				mass_text.style.display = 'inline';
			}
			var rect = cnv.getBoundingClientRect();
			coord1 = event.clientX - rect.left;
			Mark = [];
			for (i = 1;i<=N; i++) {
				Mark[i] = 0;
			}
			move = true;
		}
	}
	cnv.onmousemove = function () { 
		if (move) {
			ctx.clearRect(0,0,w,h);
			var rect = cnv.getBoundingClientRect();
			coord2 = event.clientX - rect.left;
			if (coord2 < coord1) {
				var prom = coord1;
				coord1 = coord2;
				coord2 = prom;
			}
			for (q = 1;q<=N;q++) {
				if ((Mark[q] == 0)&&(((partcls[q].x-r> coord1)&&(partcls[q].x-r<coord2))||((partcls[q].x+r> coord1)&&(partcls[q].x+r<coord2)))) {
					switch (partcls[q].flag) {
						case 0: {
							partcls[q].flag = 1;
							var c = String(255-partcls[q].m*75);
							partcls[q].rgb = "rgba("+c+","+c+","+c+",255)"
							Mark[q] = 1;
							continue
						}
						case 1: {
							partcls[q].flag = 0;
							partcls[q].rgb = "rgba(255,0,0,255)"
							Mark[q] = 1;
						}
					}		
				}
				ctx.beginPath();
				ctx.arc(partcls[q].x,y,r,0,2*Math.PI);
				ctx.fillStyle = partcls[q].rgb;
				ctx.fill();
				ctx.stroke();
			}
		}
	}
	cnv.onmouseup = function () {
		move = false;
	}
	function clearint(interv) { 
		clearInterval(interv);
	}
	
	function drawP() { 
		ctx.clearRect(0,0,w,h);
		ctx.beginPath();
		for (var q = 1; q<= N; q++) { 
			ctx.arc(partcls[q].x,y,r,0,2*Math.PI);
			ctx.stroke();
			ctx.fillStyle = partcls[q].rgb;
			ctx.fill();
		
		}
		
	}
	
	function draw_2() {
	// рисуем сами частицы и график в одном цикле
		// нарисованию линию
		ctx2.clearRect(0,0,w2,h2);
		ctx2.beginPath();
		ctx2.moveTo(0,h/2);
		ctx2.lineTo(w,h/2);
		ctx2.stroke();
		// рисуем скорости частиц
		ctx2.beginPath();
		ctx2.moveTo(partcls[1].x,-partcls[1].v*y_scale+h/2);
		for (var q = 1;q<=N;q++) {
			ctx2.lineTo(partcls[q].x,-partcls[q].v*y_scale+h/2);
		}
		ctx2.strokeStyle = 'black';
		ctx2.stroke();
		// кин энергия частиц
		// ctx2.beginPath();
		// ctx2.moveTo(0,h);
		// for (var q = 1;q<=N;q++) { 	
			// ctx2.lineTo(partcls[q].x,h-partcls[q].m*Math.pow(partcls[q].v,2)/2*y_scale/2);
		// }
		// ctx2.strokeStyle = 'blue';
		// ctx2.stroke();
		// рисуем энергетический центр всей цепочки
	}
	// var h0;
	function draw_graf () {
		// рисуем график движения энергетического центра 
		// сначала отрисовываем оси
		if (time == 1000) {
			var dataURL = g2cnv.toDataURL("image/jpg");
			var link = document.createElement("a");
			document.body.appendChild(link); 
			link.href = dataURL;
			link.download = String(ioio)+"_absENERG.jpg";
			link.click();
			document.body.removeChild(link);
			time = 0;
			ctx_g.clearRect(0,0,1000,250);
			ioio++;
		}
		// if (time == 1) {console.log(E_zones[0],E_zones[1]);}
		// энергетический центр всей цепочки

		// правой цепочки
		time += spp*1;
		
		for (var p = 0; p<2; p++) {
			ctx2.beginPath();
			ctx2.moveTo(p*step_W,250 - E_zones[p]/50);
			ctx2.lineTo((p+1)*step_W,250 - E_zones[p]/50);
			ctx2.stroke();
			ctx2.fillText(E_zones[p],(2*p+1)*step_W/2,240 - E_zones[p]/50);
		}
		ctx_g.beginPath();
		ctx_g.arc(time,250 - Math.abs(E_zones[0]-E_zones[1])/50,2,0,2*Math.PI);
		ctx_g.stroke();
		// ctx_g.fillText(Math.abs(E_zones[0]-E_zones[1]),time,240 - Math.abs(E_zones[0]-E_zones[1])*5);
		
	}
		
	function set_exp(N_exp) {
		ctx.clearRect(0,0,w,h);
		marker = 1; // по умолчанию это не волна
		if (N_exp == 1) {
			Quantity.value = N = 3000;
			count(N);
			zero();
			var a = partcls[10].x - partcls[9].x;
			stepp = parseInt(N/2);
			for (var io = 0; io<2; io++) {
				if ((io+1) % 2 == 0) {
					for (var q = 1; q<stepp; q++) { 
						partcls[io*stepp + q].m = 2;
					}
				}
			}
			
			
			// нужно ввести счетчик волн 
			var cnt = 0;
			var Q = [];
			do {
				// СЛЕВА
				// сначала обнуляем все условия 
				zero();
				// дальше задаем новые
				cnt = 0;
				Q = [];
				while (cnt != 42) { 
					var q = M.floor(M.random()*42+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
					for (var io = parseInt(10*q + 25*(q-1)); io<=parseInt(10*q + 25*q); io++) {
						partcls[io].u += 0.5*(Math.cos(2*Math.PI/25*(io-parseInt(10*q + 25*(q-1))))-1);
						}
					}
				}
				cnt = 0;
				Q = [];
				
				while (cnt != 30) { 
					var q = M.floor(M.random()*30+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 38*(q-1)); io<=parseInt(10*q + 38*q); io++) {
							partcls[io].u += 0.5*(Math.cos(2*Math.PI/38*(io-parseInt(10*q + 38*(q-1))))-1);
					
						}
					}
				}
				cnt = 0;
				Q = [];
				while (cnt != 16) { 
					var q = M.floor(M.random()*16+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 80*(q-1)); io<=parseInt(10*q + 80*q); io++) {
							partcls[io].u += 0.3*(Math.cos(2*Math.PI/20*(io-parseInt(10*q + 20*(q-1))))-1);

						}
					}
				}
				cnt = 0;
				Q = [];
				while (cnt != 59) { 
					var q = M.floor(M.random()*59+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 15*(q-1)); io<=parseInt(10*q + 15*q); io++) {
							partcls[io].u += 0.4*(Math.cos(2*Math.PI/15*(io-parseInt(10*q + 15*(q-1))))-1);
							
						}
					}
				}
				cnt = 0;
				Q = [];
				while (cnt != 19) { 
					var q = M.floor(M.random()*19+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 66*(q-1)); io<=parseInt(10*q + 66*q); io++) {
							partcls[io].u += 0.7*(Math.cos(2*Math.PI/33*(io-parseInt(10*q + 33*(q-1))))-1);
			
						}
					}
				}
				cnt = 0;
				Q = [];
				while (cnt != 27) { 
					var q = M.floor(M.random()*27+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 44*(q-1)); io<=parseInt(10*q + 44*q); io++) {
							partcls[io].u += 0.45*(Math.cos(2*Math.PI/11*(io-parseInt(10*q + 11*(q-1))))-1);
						}
					}
				}
				cnt = 0;
				Q = [];
				while (cnt != 51) { 
					var q = M.floor(M.random()*51+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 19*(q-1)); io<=parseInt(10*q + 19*q); io++) {
							partcls[io].u += 1*(Math.cos(2*Math.PI/19*(io-parseInt(10*q + 19*(q-1))))-1);
						}
					}
				}
				cnt = 0;
				Q = [];
				while (cnt != 40) { 
					var q = M.floor(M.random()*40+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 27*(q-1)); io<=parseInt(10*q + 27*q); io++) {
							partcls[io].u += 0.45*(Math.cos(2*Math.PI/27*(io-parseInt(10*q + 27*(q-1))))-1);
						}
					}
				}
				cnt = 0;
				Q = [];
				while (cnt != 38) { 
					var q = M.floor(M.random()*38+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 29*(q-1)); io<=parseInt(10*q + 29*q); io++) {
							partcls[io].u += 0.32*(Math.cos(2*Math.PI/29*(io-parseInt(10*q + 29*(q-1))))-1);
						}
					}
				}
				// СПРАВА
				
				
				
				cnt = 0;
				Q = [];
				while (cnt != 19) { 
					var q = M.floor(M.random()*19+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
					for (var io = parseInt(10*q + 68*(q-1) + N/2); io<=parseInt(10*q + 68*q + N/2); io++) {
						partcls[io].u += 0.3*(Math.cos(2*Math.PI/34*(io-parseInt(10*q + 34*(q-1) + N/2)))-1);
						}
					}
				}
				cnt = 0;
				Q = [];
				
				while (cnt != 44) { 
					var q = M.floor(M.random()*44+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 24*(q-1) + N/2); io<=parseInt(10*q + 24*q + N/2); io++) {
							partcls[io].u += 0.3*(Math.cos(2*Math.PI/24*(io-parseInt(10*q + 24*(q-1) + N/2)))-1);
					
						}
					}
				}
				cnt = 0;
				Q = [];
				while (cnt != 15) { 
					var q = M.floor(M.random()*15+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 90*(q-1) + N/2); io<=parseInt(10*q + 90*q + N/2); io++) {
							partcls[io].u += 0.5*(Math.cos(2*Math.PI/90*(io-parseInt(10*q + 90*(q-1) + N/2)))-1);

						}
					}
				}
				cnt = 0;
				Q = [];
				while (cnt != 53) { 
					var q = M.floor(M.random()*53+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 18*(q-1) + N/2); io<=parseInt(10*q + 18*q + N/2); io++) {
							partcls[io].u += 0.65308*(Math.cos(2*Math.PI/18*(io-parseInt(10*q + 18*(q-1) + N/2)))-1);
							
						}
					}
				}
				cnt = 0;
				Q = [];
				while (cnt != 23) { 
					var q = M.floor(M.random()*23+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 55*(q-1) + N/2); io<=parseInt(10*q + 55*q + N/2); io++) {
							partcls[io].u += 1.4*(Math.cos(2*Math.PI/55*(io-parseInt(10*q + 55*(q-1) + N/2)))-1);
			
						}
					}
				}
				cnt = 0;
				Q = [];
				while (cnt != 48) { 
					var q = M.floor(M.random()*48+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 21*(q-1) + N/2); io<=parseInt(10*q + 21*q + N/2); io++) {
							partcls[io].u += 0.9*(Math.cos(2*Math.PI/21*(io-parseInt(10*q + 21*(q-1) + N/2)))-1);
						}
					}
				}
				cnt = 0;
				Q = [];
				while (cnt != 30) { 
					var q = M.floor(M.random()*30+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 40*(q-1) + N/2); io<=parseInt(10*q + 40*q + N/2); io++) {
							partcls[io].u += 0.85*(Math.cos(2*Math.PI/40*(io-parseInt(10*q + 40*(q-1) + N/2)))-1);
						}
					}
				}
				cnt = 0;
				Q = [];
				while (cnt != 17) { 
					var q = M.floor(M.random()*17+1);
					if (Q.indexOf(q) == -1) { 
						cnt++;
						Q.push(q);
						for (var io = parseInt(10*q + 76*(q-1) + N/2); io<=parseInt(10*q + 76*q + N/2); io++) {
							partcls[io].u += 1.2*(Math.cos(2*Math.PI/19*(io-parseInt(10*q + 19*(q-1) + N/2)))-1);
						}
					}
				}
				var res = countAverEnrg2(100, N);
				
			} while ((res[0]/res[1] < M.sqrt(1/2)*0.99)||(res[0]/res[1] > M.sqrt(1/2)*1.01));
			// СПРАВА
			// for (var q = 36; q<=57; q++) { 
			// if (Math.random() < 0.25) { 
				// for (var io = parseInt(10*q + 55*(q-1) - 750); io<=parseInt(10*q + 55*q - 750); io++) {
					// partcls[io].u += 1.5*(Math.cos(2*Math.PI/55*(io-parseInt(10*q - 750 + 55*(q-1))))-1);
					// partcls[io].v = -1.5*2*Math.pow(50,1/2)*Math.sin(Math.PI/55)*Math.sin(2*Math.PI/55*(io-parseInt(10*q - 750 + 55*(q-1))));
				// }
			// }
			// }
				// for (var q = 22; q<=34; q++) { 
			// if (Math.random() < 0.25) { 
				// for (var io = parseInt(10*q + 100*(q-1) - 750); io<=parseInt(10*q + 100*q - 750); io++) {
					// partcls[io].u += 1.5*(Math.cos(2*Math.PI/50*(io-parseInt(10*q - 750 + 50*(q-1))))-1);
					// partcls[io].v = -1.5*2*Math.pow(50,1/2)*Math.sin(Math.PI/100)*Math.sin(2*Math.PI/100*(io-parseInt(10*q - 750 + 100*(q-1))));
				// }
			// }
			// }
			// for (var q = 41; q<=64; q++) { 
			// if (Math.random() < 0.25) { 
				// for (var io = parseInt(10*q + 48*(q-1) - 750); io<=parseInt(10*q + 48*q - 750); io++) {
					// partcls[io].u += 0.9*(Math.cos(2*Math.PI/24*(io-parseInt(10*q - 750 + 24*(q-1))))-1);
					// partcls[io].v = -1.5*2*Math.pow(50,1/2)*Math.sin(Math.PI/100)*Math.sin(2*Math.PI/100*(io-parseInt(10*q - 750 + 100*(q-1))));
				// }
			// }
			// }
			
			// var E_kin = 0; var E_pot = 0;
			// E_kin = 1/2*partcls[1].m * partcls[1].v * partcls[1].v;
			// E_pot = 1/4*C*(Math.pow(partcls[1].u-partcls[N].u,2)+Math.pow(partcls[N].u - partcls[N-1].u,2));
			// console.log(E_kin/E_pot);
			// for (q = 2; q<=N-1; q++) { 
				// E_kin = 1/2*partcls[q].m * partcls[q].v * partcls[q].v;
				// E_pot = 1/4*C*(Math.pow(partcls[q-1].u-partcls[q].u,2)+Math.pow(partcls[q+1].u - partcls[q].u,2));
				// console.log(E_kin/E_pot);
			// }
			// E_kin = 1/2*partcls[N].m * partcls[N].v * partcls[N].v;
			// E_pot = 1/4*C*(Math.pow(partcls[1].u-partcls[N].u,2)+Math.pow(partcls[N].u - partcls[N-1].u,2));

			// marker = 0; // значит не нужны данные о начальной частице и скорости
			// y_scale = 30;
			// exper.innerHTML = 'Гауссиан на границе двух масс';
		} 
		if (N_exp == 2) {
			for (var i = parseInt(N/3);i<= parseInt(2*N/3);i++) {partcls[i].m = 2;}
			for (var i = parseInt(2*N/3);i<=N; i++) { partcls[i].m = 3;}
			ind = parseInt(N/5);
			partcls[ind-1].u = -10;
			partcls[ind].v = -200;
			partcls[ind+1].u = 10; 
			marker = 0; // нужны данные о начальной частице и скорости
			exper.innerHTML = 'Три разных массы';
		}
		if (N_exp == 3) {
			for (var i = 1;i<= parseInt(N/3);i++) {partcls[i].m = 3;}
			for (var i = parseInt(2*N/3);i<=N; i++) { partcls[i].m = 3;}
			ind = parseInt(N/2);
			partcls[ind-1].u = -10;
			partcls[ind].v = -200;
			partcls[ind+1].u = 10; 
			marker = 0;
			exper.innerHTML = 'Волна на границе двух масс';
		}
		if (N_exp == 4) {
			for (var i = 1;i<= parseInt(N/3);i++) {partcls[i].m = 3;}
			for (var i = parseInt(2*N/3);i<=N; i++) { partcls[i].m = 3;}
			ind = parseInt(N/2);
			partcls[ind].v = -200;
			marker = 1;
			exper.innerHTML = 'Симметричное возмущение на границе двух масс';
		}
		// if (N_exp == 5) { // пускаем волну косинуса
			// надо расположить частицы по косинусу
			// var fst = document.getElementById('first2').value % N;
			// if (fst == 0) { fst = N;}
			// var lambda = document.getElementById('howmany').value;
			// var len = document.getElementById('area').value;
			// for (q = fst; q<=lambda*len+fst-1; q++) { 
				// if (q > N) { 
					// var qn = q % N;
				// } else { var qn = q;}
				// if (qn == 0) { qn = N;}
				// partcls[qn].u = Math.cos(2*Math.PI*(qn - fst)/(lambda));
				// partcls[qn].v = -(dist-2*r)*Math.pow(C,1/2)*Math.sin((qn-fst)*2*Math.PI/(lambda*(dist-2*r)))*2*Math.PI/(lambda*(dist-2*r));
			// }
			// y_scale = 30;
			// marker = 2;
			// exper.innerHTML = 'Волна косинуса';
		// }
		// if (N_exp == 6) { // пускаем волну синуса
			// var fst = document.getElementById('first2').value % N;
			// var lambda = parseInt(document.getElementById('howmany').value);
			// var len = parseInt(document.getElementById('area').value);
			// console.log(fst,lambda,len);
			// for (q = fst; q<=lambda*len+fst-1; q++) { 
				// if (q > N) { 
					// var qn = q % N;
				// } else { var qn = q;}
				// partcls[qn].u = Math.sin(2*Math.PI*(qn - fst)/(lambda));
				// partcls[qn].v = -2*Math.pow(C,1/2)*Math.sin(2*Math.PI*(qn - fst)/(lambda)/2)*Math.cos(2*Math.PI*(qn - fst)/(lambda));
				
			// }
			// marker = 2;
			// exper.innerHTML = 'Волна синуса';
		// }
		// if (N_exp == 7) { 
			// попробуем задать гауссиан.
			
			// var c = Math.pow(C,1/2)*(dist-2*r);
			// for (q = 20; q<=40; q++) {
				// partcls[q].u = Math.exp(-Math.pow(q-30,2)/18);
				// partcls[q].v = -1*c*Math.exp(-Math.pow(q-30,2)/18)*(30-q)/9;
			// }
			// y_scale = 5;
			// marker = 0;
			// exper.innerHTML = 'Гауссиан';
		// }
		if (N_exp == 5) { // эксперимент с изотопами углерода. конц 50 проц
			var numC = parseInt(0.01*N); // количество C13 
			for (q = 1; q<=N; q++) { partcls[q].flag = 0;}
			for (q = 1; q<=numC; q++) { 
				while (1) {
					var i = parseInt(Math.random()*N)+1;
					if ((partcls[i].m != (parseFloat(13/12)))&(i != parseInt(N/5))) {
						partcls[i].m = (parseFloat(13/12));
						partcls[i].rgb = "rgba(15,15,15,255)"
						break
					}
				}
			}
			y_scale = 1.4;
			var ind = parseInt(N/5);
			partcls[ind].v = parseFloat(document.getElementById('v').value);
			marker = 0;
			exper.innerHTML = 'Изотоп углерода, концентрация 1%';
		}
		
		if (N_exp == 6) { // эксперимент с изотопами углерода. конц 50 проц
			var numC = parseInt(0.5*N); // количество C13 
			for (q = 1; q<=N; q++) { partcls[q].flag = 0;}
			for (q = 1; q<=numC; q++) { 
				while (1) {
					var i = parseInt(Math.random()*N)+1;
					if ((partcls[i].m != (parseFloat(13/12)))&(i != parseInt(N/5))) {
						partcls[i].m = (parseFloat(13/12));
						partcls[i].rgb = "rgba(15,15,15,255)"
						break
					}
				}
			}
			y_scale = 1.4;
			var ind = parseInt(N/5);
			partcls[ind].v = parseFloat(document.getElementById('v').value);
			marker = 0;
			exper.innerHTML = 'Изотоп углерода, концентрация 50%';
		}
		if (N_exp == 7) { // эксперимент с изотопами углерода. конц 50 проц
			y_scale = 1.4;
			var numC = parseInt(0.99*N); // количество C13 
			for (q = 1; q<=N; q++) { partcls[q].flag = 0;}
			for (q = 1; q<=numC; q++) { 
				while (1) {
					var i = parseInt(Math.random()*N)+1;
					if ((partcls[i].m != (parseFloat(13/12)))&(i != parseInt(N/5))) {
						partcls[i].m = (parseFloat(13/12));
						partcls[i].rgb = "rgba(15,15,15,255)"
						break
					}
				}
			}
			var ind = parseInt(N/5);
			partcls[ind].v = parseFloat(document.getElementById('v').value);
			marker = 0;
			exper.innerHTML = 'Изотоп углерода, концентрация 99%';
		}
		
		if (N_exp) {
			// теперь раскрасим частицы в соответствующие цвета
			check_exp(marker);
			// теперь разграничим области мас
			draw_mass();
			document.getElementById('num').value = N_exp; 
		}
		
	}
	function check_exp (mark) { 
			if (marker == 2) { 
				for_wave.style.display = 'none';
				wave.style.display = 'inline';
			} else { 
					if (marker == 1) {
						for_wave.style.display = 'inline';
						wave.style.display = 'none';
					} else {
						for_wave.style.display = 'none';
						wave.style.display = 'none';
					}
			}
	}
	function set_mass(N_exp) { 
		if (N_exp == 1) {
			for (q = 1; q<= parseInt(N/2); q++) { 
				partcls[parseInt(2*q - 1)].m = parseFloat(document.getElementById('exp1_1').value);
				partcls[parseInt(2*q)].m = parseFloat(document.getElementById('exp1_2').value);
			}
			exp1.style.display = 'inline';
			exp2.style.display = 'none';
		}
		if (N_exp == 2) {
			for (q = 1; q<= N; q++) { 
				partcls[q].m = q;
			}
			exp1.style.display = 'none';
			exp2.style.display = 'inline';
		}
	}
	change_mass = function() { 
		count(N);
		set_mass(document.getElementById('mass_ex').value);
		for (q = 1; q<= N; q++) { 
			var c = String(255-partcls[q].m*75);
			partcls[q].rgb = "rgba("+c+","+c+","+c+",255)"
			ctx.beginPath();
			ctx.arc(partcls[q].x,y,r,0,2*Math.PI);
			ctx.fillStyle = partcls[q].rgb;
			ctx.fill();
			ctx.stroke();
		}
		draw_mass();
	}
	function countAverEnrg2(numOfAreas, numOfPartcls) { // consider, that numOfPartcls//2 % numOfAreas = 0
		// count in first part of the chain
		var numDivide2 = parseInt(numOfPartcls/2);
		var E_zones = []; var aver1 = 0;
		for (var joj = 0; joj < numOfAreas; joj++) {E_zones[joj] = 0;}
		// for (var j = 0; j<numOfAreas; j++) { 
			// var step = parseIntnumDivide2/numOfAreas);
		E_zones[0] += parseFloat(partcls[1].m)*Math.pow(partcls[1].v,2)/2 + 25*(Math.pow(partcls[2].u-partcls[1].u,2)+Math.pow(partcls[1].u - partcls[N].u,2));
		howmany = numOfPartcls/numOfAreas/2; // how many partcls in one counting part
		for (var q = 2; q <= numDivide2; q++) { 
			var ii = Math.floor((q-1)/howmany);
			E_zones[ii] += parseFloat(partcls[q].m)*Math.pow(partcls[q].v,2)/2 + 25*(Math.pow(partcls[q+1].u-partcls[q].u,2)+Math.pow(partcls[q].u - partcls[q-1].u,2));
		}
		E_zones[numOfAreas-1] += parseFloat(partcls[numDivide2].m)*Math.pow(partcls[numDivide2].v,2)/2 + 25*(Math.pow(partcls[1].u-partcls[numDivide2].u,2)+Math.pow(partcls[numDivide2].u - partcls[numDivide2-1].u,2));
		// мы посчитали энергии в каждой из участков первой половины цепочки
		// можем посчитать среднюю энергию
		for (var joj = 0; joj < numOfAreas; joj++) {aver1+= E_zones[joj];} 
		aver1 /= numOfAreas;
		// Err1 = [];
		// for (var joj = 0; joj < numOfAreas; joj++) { Err1[joj] = Math.abs(E_zones[joj] - aver1)/aver1;}
		// теперь посчитаем среднюю энергию во второй части цепочки 
		E_zones = []; var aver2 = 0;
		for (var joj = 0; joj < numOfAreas; joj++) {E_zones[joj] = 0;}
		for (var q = numDivide2+1; q < N; q++) { 
			var ii = Math.floor((q-1-numDivide2)/howmany);
			E_zones[ii] += parseFloat(partcls[q].m)*Math.pow(partcls[q].v,2)/2 + 25*(Math.pow(partcls[q+1].u-partcls[q].u,2)+Math.pow(partcls[q].u - partcls[q-1].u,2));
		}
		E_zones[numOfAreas-1] += parseFloat(partcls[N].m)*Math.pow(partcls[N].v,2)/2 + 25*(Math.pow(partcls[1].u-partcls[N].u,2)+Math.pow(partcls
		[N].u - partcls[N-1].u,2));
		for (var joj = 0; joj < numOfAreas; joj++) {aver2 += E_zones[joj];} 
		aver2 /= numOfAreas;
		// Err2 = [];
		// for (var joj = 0; joj < numOfAreas; joj++) { Err2[joj] = Math.abs(E_zones[joj] - aver2)/aver2;}
		var result = [aver1,aver2];
		return result;
	}
	function getMaxOfArray(numArray) {
		return M.max.apply(null, numArray);
	}
			
	mass_ex.onchange = function () {
		change_mass();
	}
	exp1_1.onchange = function () { 
		change_mass();
	}
	exp1_2.onchange = function () { 
		change_mass();
	}
	
	
	num.onchange = function() { 
		if (num.value == 0) { exper.innerHTML = '';}
		N = (Number(document.getElementById('Quantity').value));
		count(N);
		set_exp(Number(document.getElementById('num').value));
		flag = 0;
		document.getElementById('yscale').value = y_scale;
	}
	
	function control() {
		phys();
		draw_2();
		// draw_graf();
	}
	function control_sec() {
		is++;
		phys();
		if (is % howOfP == 0) { 
			draw_2();
		}
		// draw_graf();
	}
	
	flag = 0; // моделирование идет
	marker = 1; // не волна
	N = Number(document.getElementById('Quantity').value); // считали колво частиц
	count(N); // создали их
	i = document.getElementById('first').value % N; // номер той у которой задаем скорость 
	check_exp(marker);
	exper.innerHTML = '';
	howof.innerHTML = fps;
	set_exp(2);
	interv = setInterval(control,1000/fps);
}