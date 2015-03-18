var snow = function() {
        function a() {
            for (var a = 0; h > a; a++)
                k.push({x: Math.random() * l,y: Math.random() * m,size: 1 + 3 * Math.random(),weight: Math.random() * h,angle: 360 * Math.random()});
            b(), window.addEventListener("resize", b), window.addEventListener("mousemove", c), void 0 !== window.orientation && window.addEventListener("deviceorientation", d), document.body.insertBefore(p, document.body.firstChild), window.requestAnimationFrame(e)
        }
        function b() {
            l = window.innerWidth, m = window.innerHeight, n = l / 2, p.width = l, p.height = m
        }
        function c(a) {
            o.x = a.x || a.clientX, o.y = a.y || a.clientY, i.x = f(o.x - n, -n, n, 4, -4)
        }
        function d(a) {
            null !== a.gamma && (i.x = window.orientation % 180 ? f(a.beta, -60, 60, 4, -4) : f(a.gamma, -60, 60, -4, 4), r && (window.removeEventListener("mousemove", mousemove), r = !1))
        }
        function e() {
            q.clearRect(0, 0, l, m), q.fillStyle = "rgba(250,250,250,0.8)", q.beginPath();
            for (var a = 0; h > a; a++) {
                var b = k[a];
                q.moveTo(b.x, b.y), q.arc(b.x, b.y, b.size, 0, j, !0)
            }
            q.fill(), g(), requestAnimationFrame(e)
        }
        function f(a, b, c, d, e) {
            return (a - b) * (e - d) / (c - b) + d
        }
        function g() {
            for (var a = 0; h > a; a++) {
                var b = k[a];
                b.angle += .01, b.y += Math.cos(b.weight) + i.y + b.size / 2, b.x += Math.sin(b.angle) + i.x, (b.x > l + 5 || b.x < -5 || b.y > m) && (a % 3 > 0 ? (b.x = Math.random() * l, b.y = -5) : b.x > n ? (b.x = -5, b.y = Math.random() * m) : (b.x = l + 5, b.y = Math.random() * m))
            }
        }
        var h = 75, i = {x: 2,y: 1}, j = 2 * Math.PI, k = [], l = window.innerWidth, m = window.innerHeight, n = l / 2, o = {x: 0,y: 0}, p = document.createElement("canvas"), q = p.getContext("2d");
        p.className = "snow", a();
        var r = !0
    };
	
	snow();
	
	document.write('<style>.snow{position: fixed;z-index: 999999;width: 100%;height: 100%;pointer-events: none;}</style>');

/*
SmallStars = 50; 
LargeStars = 20;
SmallYpos = new Array();
SmallXpos = new Array();
LargeYpos = new Array();
LargeXpos = new Array();
Smallspeed= new Array();
Largespeed= new Array();
ns=(document.layers)?1:0;
if (ns) {
for (i = 0; i < SmallStars; i++) {
document.write("<LAYER NAME='sn"+i+"' LEFT=0 TOP=0 BGCOLOR='#FFFFF0' CLIP='0,0,1,1'></LAYER>");
}
for (i = 0; i < LargeStars; i++) {
document.write("<LAYER NAME='ln"+i+"' LEFT=0 TOP=0 BGCOLOR='#FFFFFF' CLIP='0,0,2,2'></LAYER>");
   }
}
else {


	for (i = 0; i < SmallStars; i++) {
		document.write('<img src="http://clipartmountain.com/clip3/star1.gif" class="stars" style="position:fixed;top:0;z-index:999999;left:0;width:3px;height:3px;font-size:1px" />');
	}

	for (i = 0; i < LargeStars; i++) {
		document.write('<img src="http://clipartmountain.com/clip3/star1.gif" class="stars2" style="z-index:999999;position:fixed;top:0;left:0;width:25px;height:25px;font-size:2px" />');
	}

}
WinHeight = window.document.body.clientHeight;
WinWidth = window.document.body.clientWidth;

for (i = 0; i < SmallStars; i++) {
SmallYpos[i] = Math.round(Math.random() * WinHeight);
SmallXpos[i] = Math.round(Math.random() * WinWidth);
Smallspeed[i]= Math.random() * 5 + 1;
}
for (i = 0; i < LargeStars; i++) {
LargeYpos[i] = Math.round(Math.random() * WinHeight);
LargeXpos[i] = Math.round(Math.random() * WinWidth);
Largespeed[i] = Math.random() * 10 + 5;
}
function fly() {
	var WinHeight = (document.layers)?window.innerHeight:window.document.body.clientHeight;
	var WinWidth = (document.layers)?window.innerWidth:window.document.body.clientWidth;
	var hscrll = (document.layers)?window.pageYOffset:document.body.scrollTop;
	var wscrll = (document.layers)?window.pageXOffset:document.body.scrollLeft;
	
	var starrrs = document.getElementsByClassName('stars2');
	var starrrs2 = document.getElementsByClassName('stars');
	
	for (i = 0; i < LargeStars; i++) 
	{
		LargeXpos[i] -= Largespeed[i];
		if (LargeXpos[i] < -10) {
			LargeXpos[i] = WinWidth;
			LargeYpos[i] = Math.round(Math.random() * WinHeight);
			Largespeed[i] = Math.random() * 10 + 5;
		}
		
		starrrs[i].style.left = LargeXpos[i] + 'px';
		starrrs[i].style.top = LargeYpos[i] + hscrll + 'px';
	}
	for (i = 0; i < SmallStars; i++) {
		SmallXpos[i] -= Smallspeed[i];
		if (SmallXpos[i] < -10) {
			SmallXpos[i] = WinWidth;
			SmallYpos[i] = Math.round(Math.random()*WinHeight);
			Smallspeed[i] = Math.random() * 5 + 1;
		}
		
		starrrs2[i].style.left = SmallXpos[i] + 'px';
		starrrs2[i].style.top = SmallYpos[i] + hscrll + 'px';
	}
	setTimeout('fly()', 10);
}
fly();


setInterval(function(){
things = $('img,div');
var index = Math.floor(Math.random()*things.length)
var thing = things[index];
$(thing).ClassyWiggle()
}, 3000);*/
