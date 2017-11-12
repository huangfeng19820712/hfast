/**
 * @author:   * @date: 2016/2/29
 */
define([
        "core/js/controls/Control",
        "text!"+APP_NAME+"/tmpl/xVertex.html",
        "text!"+APP_NAME+"/tmpl/xFragment.html",
        APP_NAME+"/clouds/assets/three.min",
        APP_NAME+"/clouds/assets/Detector",
    ],
    function (Control,xVertex,xFragment) {
        var Clouds = Control.extend({
            container:null,
            camera:null,
            scene:null,
            renderer:null,
            mesh:null,
            geometry:null,
            material:null,
            mouseX:0,
            mouseY:0,
            start_time:Date.now(),
            halfX:null,
            halfY:null,
            initializeHandle:function(){
                if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
                this.start_time = Date.now();
            },
            mountContent:function(){
                this.width = this.$container.width();
                this.height = this.$container.height();
                this.$container.css("overflow","hidden");
                this.halfX = this.width / 2;
                this.halfY = this.height / 2;
                var canvas = document.createElement( 'canvas' );
                canvas.width = 32;
                canvas.height = this.height;

                var context = canvas.getContext( '2d' );

                var gradient = context.createLinearGradient( 0, 0, 0, canvas.height );
                gradient.addColorStop(0, "#1e4877");
                gradient.addColorStop(0.5, "#4584b4");

                context.fillStyle = gradient;
                context.fillRect(0, 0, canvas.width, canvas.height);
                this.$el.css({
                    background:'url(' + canvas.toDataURL('image/png') + ')',
                    backgroundSize:'32px 100%'
                });
               /* $el.style.background = 'url(' + canvas.toDataURL('image/png') + ')';
                container.style.backgroundSize = '32px 100%';*/

                //

                this.camera = new THREE.PerspectiveCamera( 30, this.width / this.height, 1, 3000 );
                this.camera.position.z = 6000;

                this.scene = new THREE.Scene();

                this.geometry = new THREE.Geometry();

                var texture = THREE.ImageUtils.loadTexture( 'clouds/cloud10.png', null, $.proxy(this.animate,this));
                texture.magFilter = THREE.LinearMipMapLinearFilter;
                texture.minFilter = THREE.LinearMipMapLinearFilter;

                var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );

                this.material = new THREE.ShaderMaterial( {

                    uniforms: {

                        "map": { type: "t", value: texture },
                        "fogColor" : { type: "c", value: fog.color },
                        "fogNear" : { type: "f", value: fog.near },
                        "fogFar" : { type: "f", value: fog.far },

                    },
                    vertexShader: xVertex,
                    fragmentShader: xFragment,
                    depthWrite: false,
                    depthTest: false,
                    transparent: true

                } );

                var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );

                for ( var i = 0; i < 8000; i++ ) {

                    plane.position.x = Math.random() * 1000 - 500;
                    plane.position.y = - Math.random() * Math.random() * 200 - 15;
                    plane.position.z = i;
                    plane.rotation.z = Math.random() * Math.PI;
                    plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

                    THREE.GeometryUtils.merge( this.geometry, plane );

                }

                this.mesh = new THREE.Mesh( this.geometry, this.material );
                this.scene.add( this.mesh );

                this.mesh = new THREE.Mesh( this.geometry, this.material );
                this.mesh.position.z = - 8000;
                this.scene.add( this.mesh );

                this.renderer = new THREE.WebGLRenderer( { antialias: false } );
                this.renderer.setSize( this.width, this.height );
                this.$el.append( this.renderer.domElement );
                var that = this;

                /*this.$el.mousemove(function(event){
                    that.mouseX = ( event.clientX - that.windowHalfX ) * 0.25;
                    that.mouseY = ( event.clientY - that.windowHalfY ) * 0.15;
                });*/
                //document.addEventListener( 'mousemove', onDocumentMouseMove, false );
            },
            mouseMoveHandle:function( event ) {
                this.mouseX = ( event.clientX - this.halfX ) * 0.25;
                this.mouseY = ( event.clientY - this.halfY ) * 0.15;

            },
            resizeHandle:function ( event ) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();

                this.renderer.setSize( window.innerWidth, window.innerHeight );
            },
            unregisterEvent:function(){
                //取消绑定
                $(window).off("resize", this.resizeHandle);
                this._super();
            },
            /**
             * 注册窗口代表事件
             */
            registerEvent:function(){
                this._super();
                this.$el.mousemove(_.bind(this.mouseMoveHandle, this));
                $(window).on("resize", $.proxy(this.resizeHandle,this));
            },

            animate:function () {
                requestAnimationFrame( $.proxy(this.animate,this));
                var position = ( ( Date.now() - this.start_time ) * 0.03 ) % 8000;
                this.camera.position.x += ( this.mouseX - this.camera.position.x ) * 0.01;
                this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * 0.01;
                this.camera.position.z = - position + 8000;
                this.renderer.render( this.scene, this.camera );
            },
            /**
             * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
             * @override
             */
            destroy: function () {
                this.unregisterEvent();
                this.$el = null;
                this._super();
            }
        });

        return Clouds;

    });

