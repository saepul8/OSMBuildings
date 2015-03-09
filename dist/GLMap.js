var GLMap=function(a){function b(a){return a*o/180}function c(a,b){var c=a[0]-b[0],d=a[1]-b[1];return c*c+d*d}function d(a,b,c){return Math.min(c,Math.max(a,b))}function d(a,b,c){return Math.min(c,Math.max(a,b))}function e(a,b,c){var d=b/360+.5,e=Math.min(1,Math.max(0,.5-Math.log(Math.tan(Math.PI/4+Math.PI/2*a/180))/Math.PI/2));return{x:d*c,y:e*c}}function f(a,b,c){return a/=c,b/=c,{latitude:(2*Math.atan(Math.exp(Math.PI*(1-2*b)))-Math.PI/2)*(180/Math.PI),longitude:360*a-180}}function g(a,b){return a.replace(/\{(\w+)\}/g,function(a,c){return b[c]||a})}function h(a,b,c){a.addEventListener(b,c,!1)}function i(a){a.preventDefault&&a.preventDefault(),a.returnValue=!1}function j(a,b){this._url=a,b=b||{},this._tileSize=b.tileSize||p,this._fixedZoom=b.fixedZoom,this._tiles={},this._loading={},this._shader=new l("tileplane")}function k(a,b,c,d){this.x=a,this.y=b,this.z=c,this._texture=this._createTexture(d),this._vertexBuffer=this._createBuffer(3,new Float32Array([0,0,0,255,0,0,0,255,0,255,255,0])),this._texCoordBuffer=this._createBuffer(2,new Float32Array([0,0,1,0,0,1,1,1]))}function l(a){var b=q[a];if(this.id=n.createProgram(),this.name=a,!b.src)throw new Error('missing source for shader "'+a+'"');if(this._attach(n.VERTEX_SHADER,b.src.vertex),this._attach(n.FRAGMENT_SHADER,b.src.fragment),n.linkProgram(this.id),!n.getProgramParameter(this.id,n.LINK_STATUS))throw new Error(n.getProgramParameter(this.id,n.VALIDATE_STATUS)+"\n"+n.getError());this.attributeNames=b.attributes,this.uniformNames=b.uniforms}var m=function(a,b){b=b||{},this._listeners={},this._layers=[],this._container=document.getElementById(a),this.minZoom=parseFloat(b.minZoom)||10,this.maxZoom=parseFloat(b.maxZoom)||20,this.maxZoom<this.minZoom&&(this.maxZoom=this.minZoom),this._initState(b),this._initEvents(this._container),this._initRenderer(this._container)};m.prototype={_initState:function(a){this._center={},this._size={width:0,height:0},this.setCenter(a.center||{latitude:52.52,longitude:13.41}),this.setZoom(a.zoom||this.minZoom),this.setRotation(a.rotation||0),this.setTilt(a.tilt||0)},_initEvents:function(b){this._startX=0,this._startY=0,this._startRotation=0,this._startZoom=0,this._hasTouch="ontouchstart"in a,this._dragStartEvent=this._hasTouch?"touchstart":"mousedown",this._dragMoveEvent=this._hasTouch?"touchmove":"mousemove",this._dragEndEvent=this._hasTouch?"touchend":"mouseup",h(b,this._dragStartEvent,this._onDragStart.bind(this)),h(b,"dblclick",this._onDoubleClick.bind(this)),h(document,this._dragMoveEvent,this._onDragMove.bind(this)),h(document,this._dragEndEvent,this._onDragEnd.bind(this)),this._hasTouch?h(b,"gesturechange",this._onGestureChange.bind(this)):(h(b,"mousewheel",this._onMouseWheel.bind(this)),h(b,"DOMMouseScroll",this._onMouseWheel.bind(this))),h(a,"resize",this._onResize.bind(this))},_initRenderer:function(a){var b=document.createElement("CANVAS");b.style.position="absolute",b.style.pointerEvents="none",a.appendChild(b);try{n=b.getContext("experimental-webgl",{antialias:!0,depth:!0,premultipliedAlpha:!1})}catch(c){throw c}h(b,"webglcontextlost",function(a){i(a),clearInterval(this._loop)}.bind(this)),h(b,"webglcontextrestored",this._initGL.bind(this)),this._initGL()},_initGL:function(){this.setSize({width:this._container.offsetWidth,height:this._container.offsetHeight}),n.enable(n.CULL_FACE),n.enable(n.DEPTH_TEST),n.cullFace(n.FRONT),this._loop=setInterval(this._render.bind(this),17)},_render:function(){requestAnimationFrame(function(){n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT);for(var a=0;a<this._layers.length;a++)this._layers[a].render(this._projection)}.bind(this))},_onDragStart:function(a){if(void 0===a.button||0===a.button){if(i(a),void 0!==a.touches){if(this._startRotation=this._rotation,this._startZoom=this._zoom,a.touches.length>1)return;a=a.touches[0]}this._startX=a.clientX,this._startY=a.clientY,this._isDragging=!0}},_onDragMove:function(a){if(this._isDragging){if(void 0!==a.touches){if(a.touches.length>1)return;a=a.touches[0]}var b=a.clientX-this._startX,c=a.clientY-this._startY,d=this._rotatePoint(b,c,this._rotation*Math.PI/180);this.setCenter(f(this._origin.x-d.x,this._origin.y-d.y,this._worldSize)),this._startX=a.clientX,this._startY=a.clientY}},_onDragEnd:function(a){if(this._isDragging){if(void 0!==a.touches){if(a.touches.length>1)return;a=a.touches[0]}this._isDragging=!1;var b=a.clientX-this._startX,c=a.clientY-this._startY,d=this._rotatePoint(b,c,this._rotation*Math.PI/180);this.setCenter(f(this._origin.x-d.x,this._origin.y-d.y,this._worldSize))}},_rotatePoint:function(a,b,c){return{x:Math.cos(c)*a-Math.sin(c)*b,y:Math.sin(c)*a+Math.cos(c)*b}},_onGestureChange:function(a){i(a),this.setRotation(this._startRotation-a.rotation),this.setZoom(this._startZoom+(a.scale-1))},_onDoubleClick:function(a){i(a),this.setZoom(this._zoom+1,a)},_onMouseWheel:function(a){i(a);var b=0;a.wheelDeltaY?b=a.wheelDeltaY:a.wheelDelta?b=a.wheelDelta:a.detail&&(b=-a.detail);var c=.2*(b>0?1:0>b?-1:0);this.setZoom(this._zoom+c,a)},_onResize:function(){clearTimeout(this._resizeTimer),this._resizeTimer=setTimeout(function(){var a=this._container;(this._size.width!==a.offsetWidth||this._size.height!==a.offsetHeight)&&this.setSize({width:a.offsetWidth,height:a.offsetHeight})}.bind(this),250)},_emit:function(a){if(this._listeners[a])for(var b=this._listeners[a],c=0,d=b.length;d>c;c++)b[c]()},addLayer:function(a){this._layers.push(a)},removeLayer:function(a){for(var b=0;b<this._layers.length;b++)if(this._layers[b]===a)return void this._layers[b].splice(b,1)},on:function(a,b){var c=this._listeners[a]||(this._listeners[a]=[]);return c.push(b),this},_setOrigin:function(a){this._origin=a},off:function(){return this},getZoom:function(){return this._zoom},setZoom:function(a,b){if(a=d(parseFloat(a),this.minZoom,this.maxZoom),this._zoom!==a){if(b){var c=this.getSize(),g=c.width/2-b.clientX,h=c.height/2-b.clientY,i=f(this._origin.x-g,this._origin.y-h,this._worldSize);this._zoom=a,this._worldSize=p*Math.pow(2,a);var j=e(i.latitude,i.longitude,this._worldSize);this._setOrigin({x:j.x+g,y:j.y+h}),this._center=f(this._origin.x,this._origin.y,this._worldSize)}else this._zoom=a,this._worldSize=p*Math.pow(2,a),this._setOrigin(e(this._center.latitude,this._center.longitude,this._worldSize));this._emit("change")}return this},getCenter:function(){return this._center},setCenter:function(a){return a.latitude=d(parseFloat(a.latitude),-90,90),a.longitude=d(parseFloat(a.longitude),-180,180),(this._center.latitude!==a.latitude||this._center.longitude!==a.longitude)&&(this._center=a,this._setOrigin(e(a.latitude,a.longitude,this._worldSize)),this._emit("change")),this},getBounds:function(){var a=e(this._center.latitude,this._center.longitude,this._worldSize),b=this.getSize(),c=b.width/2,d=b.height/2,g=f(a.x-c,a.y-d,this._worldSize),h=f(a.x+c,a.y+d,this._worldSize);return{n:g.latitude,w:g.longitude,s:h.latitude,e:h.longitude}},setSize:function(a){var b=n.canvas;return(a.width!==this._size.width||a.height!==this._size.height)&&(b.width=this._size.width=a.width,b.height=this._size.height=a.height,n.viewport(0,0,a.width,a.height),this._projection=r.perspective(20,a.width,a.height,4e4),this._emit("resize")),this},getSize:function(){return this._size},getOrigin:function(){return this._origin},getRotation:function(){return this._rotation},setRotation:function(a){return a=parseFloat(a)%360,this._rotation!==a&&(this._rotation=a,this._emit("change")),this},getTilt:function(){return this._tilt},setTilt:function(a){return a=d(parseFloat(a),0,70),this._tilt!==a&&(this._tilt=a,this._emit("change")),this},getContext:function(){return n},destroy:function(){var a=n.canvas;a.parentNode.removeChild(a),n=null,this._listeners=null;for(var b=0;b<this._layers.length;b++)this._layers[b].destroy();this._layers=null}};var n,o=Math.PI,p=256,q={tileplane:{src:{vertex:"\nprecision mediump float;\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nuniform mat4 uMatrix;\nvarying vec2 vTexCoord;\nvoid main() {\n  gl_Position = uMatrix * aPosition;\n  vTexCoord = aTexCoord;\n}\n",fragment:"\nprecision mediump float;\nuniform sampler2D uTileImage;\nvarying vec2 vTexCoord;\nvoid main() {\n  vec4 texel = texture2D(uTileImage, vec2(vTexCoord.x, -vTexCoord.y));\n  gl_FragColor = texel;\n}\n"},attributes:["aPosition","aTexCoord"],uniforms:["uMatrix","uTileImage"]}};m.TileLayer=j,j.prototype={_updateTileBounds:function(){var a=this._map.getBounds(),b=this._tileSize,c=this._zoom=this._fixedZoom||Math.round(this._map.getZoom()),d=b<<c,f=e(a.n,a.w,d),g=e(a.s,a.e,d);this._tileBounds={minX:f.x/b<<0,minY:f.y/b<<0,maxX:Math.ceil(g.x/b),maxY:Math.ceil(g.y/b)}},_loadTiles:function(){var a,b,d,e,f=this._tileBounds,g=this._zoom,h=this._tiles,i=this._loading,j=[];for(b=f.minY;b<=f.maxY;b++)for(a=f.minX;a<=f.maxX;a++)d=[a,b,g].join(","),h[d]||i[d]||j.push({x:a,y:b,z:g});if(e=j.length){var k={x:f.minX+(f.maxX-f.minX-1)/2,y:f.minY+(f.maxY-f.minY-1)/2};j.sort(function(a,b){return c(b,k)-c(a,k)});for(var l=0;e>l;l++)this._loadTile(j[l].x,j[l].y,j[l].z);this._purge()}},_getURL:function(a,b,c){var d="abcd"[(a+b)%4];return g(this._url,{s:d,x:a,y:b,z:c})},_loadTile:function(a,b,c){var d=[a,b,c].join(","),e=new Image;e.crossOrigin="*",e.onload=function(){delete this._loading[d],this._tiles[d]=new k(a,b,c,e)}.bind(this),e.onerror=function(){delete this._loading[d]}.bind(this);var f={abort:function(){e.src=""}};return this._loading[d]=f,e.src=this._getURL(a,b,c),f},_purge:function(){var a,b=this._tiles,c=this._loading;for(a in b)this._isVisible(a,2)||(b[a].destroy(),delete b[a]);for(a in c)this._isVisible(a)||(c[a].abort(),delete c[a])},_isVisible:function(a,b){b=b||0;var c=this._tileSize,d=this._tileBounds,e=a.split(","),f=parseInt(e[0],10),g=parseInt(e[1],10),h=parseInt(e[2],10);return h!==this._zoom?!1:f>=d.minX-b-c&&f<=d.maxX+b&&g>=d.minY-b-c&&g<=d.maxY+b},addTo:function(a){this._map=a,a.addLayer(this),this._updateTileBounds(),this.update(),a.on("change",function(){this._updateTileBounds(),this.update(100)}.bind(this)),a.on("resize",function(){this._updateTileBounds(),this.update()}.bind(this))},remove:function(){this._map.remove(this),this._map=null},update:function(a){return a?void(this._isWaiting||(this._isWaiting=setTimeout(function(){this._isWaiting=null,this._loadTiles()}.bind(this),a))):void this._loadTiles()},render:function(a){n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT);var b=this._shader.use();for(var c in this._tiles)this._isVisible(c)&&this._tiles[c].render(b,a,this._map);b.end()},destroy:function(){clearTimeout(this._isWaiting);for(var a in this._tiles)this._tiles[a].destroy();this._tiles=null;for(a in this._loading)this._loading[a].abort();this._loading=null}},k.prototype={_createTexture:function(a){var b=n.createTexture();return n.bindTexture(n.TEXTURE_2D,b),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!0),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,a),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_NEAREST),n.generateMipmap(n.TEXTURE_2D),b},_createBuffer:function(a,b){var c=n.createBuffer();return c.itemSize=a,c.numItems=b.length/a,n.bindBuffer(n.ARRAY_BUFFER,c),n.bufferData(n.ARRAY_BUFFER,b,n.STATIC_DRAW),c},render:function(a,b,c){var d=1/Math.pow(2,this.z-c.getZoom()),e=p*d,f=c.getSize(),g=c.getOrigin(),h=r.create();h=r.scale(h,1.005*d,1.005*d,1),h=r.translate(h,this.x*e-g.x,this.y*e-g.y,0),h=r.rotateZ(h,c.getRotation()),h=r.rotateX(h,c.getTilt()),h=r.translate(h,f.width/2,f.height/2,0),h=r.multiply(h,b),n.uniformMatrix4fv(a.uniforms.uMatrix,!1,new Float32Array(h)),n.bindBuffer(n.ARRAY_BUFFER,this._vertexBuffer),n.vertexAttribPointer(a.attributes.aPosition,this._vertexBuffer.itemSize,n.FLOAT,!1,0,0),n.bindBuffer(n.ARRAY_BUFFER,this._texCoordBuffer),n.vertexAttribPointer(a.attributes.aTexCoord,this._texCoordBuffer.itemSize,n.FLOAT,!1,0,0),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this._texture),n.uniform1i(a.uniforms.uTileImage,0),n.drawArrays(n.TRIANGLE_STRIP,0,this._vertexBuffer.numItems)},destroy:function(){n.deleteBuffer(this._vertexBuffer),n.deleteBuffer(this._texCoordBuffer)}};var r={create:function(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]},multiply:function(a,b){var c=a[0],d=a[1],e=a[2],f=a[3],g=a[4],h=a[5],i=a[6],j=a[7],k=a[8],l=a[9],m=a[10],n=a[11],o=a[12],p=a[13],q=a[14],r=a[15],s=b[0],t=b[1],u=b[2],v=b[3],w=b[4],x=b[5],y=b[6],z=b[7],A=b[8],B=b[9],C=b[10],D=b[11],E=b[12],F=b[13],G=b[14],H=b[15];return[c*s+d*w+e*A+f*E,c*t+d*x+e*B+f*F,c*u+d*y+e*C+f*G,c*v+d*z+e*D+f*H,g*s+h*w+i*A+j*E,g*t+h*x+i*B+j*F,g*u+h*y+i*C+j*G,g*v+h*z+i*D+j*H,k*s+l*w+m*A+n*E,k*t+l*x+m*B+n*F,k*u+l*y+m*C+n*G,k*v+l*z+m*D+n*H,o*s+p*w+q*A+r*E,o*t+p*x+q*B+r*F,o*u+p*y+q*C+r*G,o*v+p*z+q*D+r*H]},perspective:function(a,b,c,d){return[2/b,0,0,0,0,-2/c,0,0,0,40/d,-2/d,a*(-2/d),-1,1,0,1]},translate:function(a,b,c,d){return this.multiply(a,[1,0,0,0,0,1,0,0,0,0,1,0,b,c,d,1])},rotateX:function(a,c){var d=b(c),e=Math.cos(d),f=Math.sin(d);return this.multiply(a,[1,0,0,0,0,e,f,0,0,-f,e,0,0,0,0,1])},rotateY:function(a,c){var d=b(c),e=Math.cos(d),f=Math.sin(d);return this.multiply(a,[e,0,-f,0,0,1,0,0,f,0,e,0,0,0,0,1])},rotateZ:function(a,c){var d=b(c),e=Math.cos(d),f=Math.sin(d);return this.multiply(a,[e,-f,0,0,f,e,0,0,0,0,1,0,0,0,0,1])},scale:function(a,b,c,d){return this.multiply(a,[b,0,0,0,0,c,0,0,0,0,d,0,0,0,0,1])},invert:function(a){var b=a[0],c=a[1],d=a[2],e=a[3],f=a[4],g=a[5],h=a[6],i=a[7],j=a[8],k=a[9],l=a[10],m=a[11],n=a[12],o=a[13],p=a[14],q=a[15],r=b*g-c*f,s=b*h-d*f,t=b*i-e*f,u=c*h-d*g,v=c*i-e*g,w=d*i-e*h,x=j*o-k*n,y=j*p-l*n,z=j*q-m*n,A=k*p-l*o,B=k*q-m*o,C=l*q-m*p,D=r*C-s*B+t*A+u*z-v*y+w*x;return D?(D=1/D,[(g*C-h*B+i*A)*D,(d*B-c*C-e*A)*D,(o*w-p*v+q*u)*D,(l*v-k*w-m*u)*D,(h*z-f*C-i*y)*D,(b*C-d*z+e*y)*D,(p*t-n*w-q*s)*D,(j*w-l*t+m*s)*D,(f*B-g*z+i*x)*D,(c*z-b*B-e*x)*D,(n*v-o*t+q*r)*D,(k*t-j*v-m*r)*D,(g*y-f*A-h*x)*D,(b*A-c*y+d*x)*D,(o*s-n*u-p*r)*D,(j*u-k*s+l*r)*D]):null},invert3:function(a){var b=a[0],c=a[1],d=a[2],e=a[4],f=a[5],g=a[6],h=a[8],i=a[9],j=a[10],k=j*f-g*i,l=-j*e+g*h,m=i*e-f*h,n=b*k+c*l+d*m;return n?(n=1/n,[k*n,(-j*c+d*i)*n,(g*c-d*f)*n,l*n,(j*b-d*h)*n,(-g*b+d*e)*n,m*n,(-i*b+c*h)*n,(f*b-c*e)*n]):null},transpose:function(a){return[a[0],a[3],a[6],a[1],a[4],a[7],a[2],a[5],a[8]]}};return l.prototype._attach=function(a,b){var c=n.createShader(a);if(n.shaderSource(c,b),n.compileShader(c),!n.getShaderParameter(c,n.COMPILE_STATUS))throw new Error(n.getShaderInfoLog(c));n.attachShader(this.id,c)},l.prototype.use=function(){n.useProgram(this.id);var a,b,c;if(this.attributeNames)for(this.attributes={},a=0;a<this.attributeNames.length;a++)b=this.attributeNames[a],c=n.getAttribLocation(this.id,b),0>c?console.error('could not locate attribute "'+b+'" in shader "'+this.name+'"'):(n.enableVertexAttribArray(c),this.attributes[b]=c);if(this.uniformNames)for(this.uniforms={},a=0;a<this.uniformNames.length;a++)b=this.uniformNames[a],c=n.getUniformLocation(this.id,b),0>c?console.error('could not locate uniform "'+b+'" in shader "'+this.name+'"'):this.uniforms[b]=c;return this},l.prototype.end=function(){if(n.useProgram(null),this.attributes)for(var a in this.attributes)n.disableVertexAttribArray(this.attributes[a]);this.attributes=null,this.uniforms=null},m}(this);