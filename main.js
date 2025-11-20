document.addEventListener('DOMContentLoaded', () => {
            // Cursor personalizado tipo TargetCursor
            const cursorWrapper = document.getElementById('target-cursor-wrapper');
            const cursorDot = document.getElementById('target-cursor-dot');
            const corners = cursorWrapper.querySelectorAll('.target-cursor-corner');
            let cursorVisible = true;

            // Oculta el cursor nativo
            document.body.style.cursor = 'none';

            // Mueve el cursor personalizado
            window.addEventListener('mousemove', e => {
                cursorWrapper.style.left = `${e.clientX}px`;
                cursorWrapper.style.top = `${e.clientY}px`;
            });

            // Animación de corners y selección al pasar sobre .cursor-target
            document.querySelectorAll('.cursor-target').forEach(target => {
                target.addEventListener('mouseenter', () => {
                    corners.forEach(corner => {
                        corner.style.transition = 'transform 0.3s cubic-bezier(0.77,0,0.175,1)';
                        corner.style.transform += ' scale(1.3)';
                    });
                    cursorDot.style.background = '#f9d423';
                    target.classList.add('card-selected');
                });
                target.addEventListener('mouseleave', () => {
                    corners.forEach(corner => {
                        corner.style.transition = 'transform 0.3s cubic-bezier(0.77,0,0.175,1)';
                        corner.style.transform = corner.classList.contains('corner-tl') ? 'translate(-150%, -150%)' :
                            corner.classList.contains('corner-tr') ? 'translate(50%, -150%)' :
                            corner.classList.contains('corner-br') ? 'translate(50%, 50%)' :
                            'translate(-150%, 50%)';
                    });
                    cursorDot.style.background = '#fff';
                    target.classList.remove('card-selected');
                });
                target.addEventListener('mousedown', () => {
                    target.classList.add('card-selected-active');
                });
                target.addEventListener('mouseup', () => {
                    target.classList.remove('card-selected-active');
                });
            });
        // Slideshow de fondo moderno
        const slides = document.querySelectorAll('.background-slideshow .slide');
        let currentSlide = 0;
        function showSlide(idx) {
            slides.forEach((img, i) => {
                if (i === idx) {
                    img.classList.add('active');
                    img.style.transform = 'translateX(0)';
                } else {
                    img.classList.remove('active');
                    img.style.transform = 'translateX(-100vw)';
                }
            });
        }
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
        showSlide(currentSlide);
    // Animación de botones con Anime.js
    const hasAnime = typeof anime !== 'undefined';
    const botones = document.querySelectorAll('button, .cta');
    // Aplica animación loop solo a los botones que NO son del navbar
    botones.forEach(btn => {
        if (!btn.classList.contains('nav-btn')) {
            btn.classList.add('btn-loop');
        }
        const ripple = document.createElement('span');
        ripple.className = 'pulse-ring';
        btn.appendChild(ripple);

        const isCTA = btn.classList.contains('cta');
        const isNav = btn.classList.contains('nav-btn');
        const isSubLink = btn.classList.contains('sub-link');
        const isCloseControl = btn.classList.contains('overlay-close');
        const shouldAnimateScale = !(isSubLink || isCloseControl);
        const hoverScale = shouldAnimateScale ? (isCTA ? 1.1 : isNav ? 1.04 : 1.06) : 1;
        const baseShadow = isCTA
            ? '0 14px 30px rgba(42, 94, 64, 0.28)'
            : isNav || isSubLink || isCloseControl
                ? '0 0 0 rgba(0,0,0,0)'
                : '0 4px 12px rgba(56,142,60,0.18)';
        const hoverShadow = isCTA
            ? '0 0 40px rgba(249,212,35,0.5)'
            : isNav
                ? '0 0 18px rgba(249,212,35,0.55)'
                : isSubLink || isCloseControl
                    ? '0 0 0 rgba(0,0,0,0)'
                    : '0 6px 18px rgba(56,142,60,0.26)';

        function positionRipple(event) {
            const rect = btn.getBoundingClientRect();
            ripple.style.left = `${event.clientX - rect.left}px`;
            ripple.style.top = `${event.clientY - rect.top}px`;
        }

        function animateButton(scale, shadow, duration, easing) {
            if (hasAnime) {
                anime.remove(btn);
                const animationConfig = {
                    targets: btn,
                    boxShadow: shadow,
                    duration,
                    easing
                };
                if (shouldAnimateScale) {
                    animationConfig.scale = scale;
                }
                anime(animationConfig);
                return;
            }
            if (shouldAnimateScale) {
                btn.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
                btn.style.transform = `scale(${scale})`;
            }
            btn.style.boxShadow = shadow;
        }

        function activate(event) {
            positionRipple(event);
            ripple.classList.add('active');
            animateButton(hoverScale, hoverShadow, 200, 'easeOutCubic');
        }

        function press(event) {
            if (event.button !== undefined && event.button !== 0) {
                return;
            }
            positionRipple(event);
            ripple.classList.add('active', 'pressed');
            if (isCTA) {
                btn.classList.add('is-pressed');
            }
            animateButton(shouldAnimateScale ? 0.97 : 1, '0 6px 16px rgba(249,212,35,0.42)', 120, 'easeOutCubic');
        }

        function release() {
            ripple.classList.remove('pressed');
            if (isCTA) {
                btn.classList.remove('is-pressed');
            }
            if (ripple.classList.contains('active')) {
                animateButton(hoverScale, hoverShadow, 170, 'easeOutBack');
            }
        }

        function deactivate() {
            ripple.classList.remove('active', 'pressed');
            if (isCTA) {
                btn.classList.remove('is-pressed');
            }
            animateButton(1, baseShadow, 300, 'easeOutElastic(1, .9)');
        }

        btn.addEventListener('pointerenter', activate);
        btn.addEventListener('pointermove', event => {
            if (ripple.classList.contains('active')) {
                positionRipple(event);
            }
        });
        btn.addEventListener('pointerdown', press);
        btn.addEventListener('pointerup', release);
        btn.addEventListener('pointerleave', deactivate);
        btn.addEventListener('pointercancel', deactivate);
    });

    if (hasAnime) {
        const heroCards = document.querySelectorAll('.inicio-cards .card');
        if (heroCards.length) {
            anime.set('.logo, header .nav-btn, .inicio-cards .card, .inicio-cards .cta', { opacity: 0 });
            anime.set('.logo', { translateY: -18 });
            anime.set('header .nav-btn', { translateY: 12 });
            anime.set('.inicio-cards .card', { translateY: 45 });
            anime.set('.inicio-cards .cta', { scale: 0.9 });

            anime.timeline({ easing: 'easeOutQuart', duration: 720 })
                .add({
                    targets: '.logo',
                    opacity: 1,
                    translateY: 0,
                    duration: 480
                })
                .add({
                    targets: 'header .nav-btn',
                    opacity: 1,
                    translateY: 0,
                    delay: anime.stagger(80),
                    offset: '-=320'
                })
                .add({
                    targets: '.inicio-cards .card',
                    opacity: 1,
                    translateY: 0,
                    delay: anime.stagger(120),
                    duration: 540,
                    offset: '-=260'
                })
                .add({
                    targets: '.inicio-cards .cta',
                    opacity: 1,
                    scale: 1,
                    delay: anime.stagger(90),
                    duration: 360,
                    elasticity: 520,
                    offset: '-=480'
                });
        }
    }

    const waterOverlay = document.createElement('div');
    waterOverlay.className = 'water-overlay';
    document.body.appendChild(waterOverlay);

    const liquidGlass = document.createElement('div');
    liquidGlass.className = 'liquid-glass';
    document.body.appendChild(liquidGlass);

    const glassState = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2
    };
    let glassFadeTimer;

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function animateLiquidGlass() {
        glassState.x += (glassState.targetX - glassState.x) * 0.16;
        glassState.y += (glassState.targetY - glassState.y) * 0.16;

        const velX = glassState.targetX - glassState.x;
        const velY = glassState.targetY - glassState.y;
        const velocity = Math.hypot(velX, velY);
        const tiltX = clamp(velX * 0.004, -0.22, 0.22);
        const tiltY = clamp(velY * 0.004, -0.22, 0.22);
        const scale = 1.02 + clamp(velocity * 0.0024, 0, 0.23);
        const twist = clamp(velocity * 0.016, -0.42, 0.42);

        liquidGlass.style.transform = `translate3d(${glassState.x}px, ${glassState.y}px, 0) translate3d(-50%, -50%, 0) scale(${scale}) rotate3d(${tiltY}, ${-tiltX}, 0, ${twist}rad)`;

        const radiusShiftX = clamp(velX * 0.014, -8, 8);
        const radiusShiftY = clamp(velY * 0.014, -8, 8);
        liquidGlass.style.borderRadius = `${45 + radiusShiftY}% ${55 - radiusShiftY}% ${50 + radiusShiftX}% ${50 - radiusShiftX}% / ${52 - radiusShiftX}% ${48 + radiusShiftX}% ${55 - radiusShiftY}% ${45 + radiusShiftY}%`;

        requestAnimationFrame(animateLiquidGlass);
    }

    requestAnimationFrame(animateLiquidGlass);

    function scheduleGlassFade() {
        clearTimeout(glassFadeTimer);
        glassFadeTimer = window.setTimeout(() => {
            liquidGlass.classList.remove('active');
        }, 1400);
    }

    window.addEventListener('pointermove', event => {
        glassState.targetX = event.clientX;
        glassState.targetY = event.clientY;
        if (!liquidGlass.classList.contains('active')) {
            liquidGlass.classList.add('active');
        }
        scheduleGlassFade();
    });

    window.addEventListener('pointerdown', () => {
        liquidGlass.classList.add('active');
        scheduleGlassFade();
    });

    window.addEventListener('pointerout', event => {
        if (!event.relatedTarget) {
            liquidGlass.classList.remove('active');
        }
    });

    window.addEventListener('resize', () => {
        glassState.x = window.innerWidth / 2;
        glassState.y = window.innerHeight / 2;
        glassState.targetX = glassState.x;
        glassState.targetY = glassState.y;
    });

    function smoothScrollTo(targetY) {
        if (hasAnime) {
            const scrollObj = { value: window.scrollY };
            anime({
                targets: scrollObj,
                value: targetY,
                duration: 520,
                easing: 'easeOutCubic',
                update: () => window.scrollTo(0, scrollObj.value)
            });
        } else {
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
    }

    const actionHandlers = {
        inicio: () => smoothScrollTo(0),
        inventario: () => toggleOverlay('inventario-panel', true),
        finanzas: () => toggleOverlay('finanzas-panel', true),
        soporte: () => toggleOverlay('soporte-panel', true),
        contacto: () => alert('Acceso al módulo de Contacto se habilitará próximamente.'),
        control: () => toggleOverlay('control-panel', true)
    };

    document.querySelectorAll('[data-action]').forEach(btn => {
        const action = btn.dataset.action;
        const handler = actionHandlers[action];
        if (handler) {
            btn.addEventListener('click', event => {
                event.preventDefault();
                handler();
            });
        }
    });

    document.querySelectorAll('[data-close]').forEach(btn => {
        const target = btn.dataset.close;
        btn.addEventListener('click', () => toggleOverlay(target, false));
    });

    const controlMenuButtons = document.querySelectorAll('#control-panel .sub-link');
    const controlPanels = document.querySelectorAll('#control-panel .overlay-panel');
    const inventoryMenuButtons = document.querySelectorAll('#inventario-panel .sub-link');
    const inventoryPanels = document.querySelectorAll('#inventario-panel .overlay-panel');
    const inventoryPanelsWrapper = document.querySelector('#inventario-panel .overlay-panels');
    const financeMenuButtons = document.querySelectorAll('#finanzas-panel .sub-link');
    const financePanels = document.querySelectorAll('#finanzas-panel .overlay-panel');
    const financePanelsWrapper = document.querySelector('#finanzas-panel .overlay-panels');
    const supportMenuButtons = document.querySelectorAll('#soporte-panel .sub-link');
    const supportPanels = document.querySelectorAll('#soporte-panel .overlay-panel');
    const supportPanelsWrapper = document.querySelector('#soporte-panel .overlay-panels');

    controlMenuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            if (!target) return;
            activateControlPanel(target);
        });
    });

    inventoryMenuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            if (!target) return;
            activateInventoryPanel(target);
        });
    });

    financeMenuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            if (!target) return;
            activateFinancePanel(target);
        });
    });

    supportMenuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            if (!target) return;
            activateSupportPanel(target);
        });
    });

    const overlay = document.getElementById('control-panel');
    if (overlay) {
        overlay.addEventListener('click', event => {
            if (event.target === overlay) {
                toggleOverlay('control-panel', false);
            }
        });
    }

    const inventoryOverlay = document.getElementById('inventario-panel');
    if (inventoryOverlay) {
        inventoryOverlay.addEventListener('click', event => {
            if (event.target === inventoryOverlay) {
                toggleOverlay('inventario-panel', false);
            }
        });
    }

    const financeOverlay = document.getElementById('finanzas-panel');
    if (financeOverlay) {
        financeOverlay.addEventListener('click', event => {
            if (event.target === financeOverlay) {
                toggleOverlay('finanzas-panel', false);
            }
        });
    }

    const supportOverlay = document.getElementById('soporte-panel');
    if (supportOverlay) {
        supportOverlay.addEventListener('click', event => {
            if (event.target === supportOverlay) {
                toggleOverlay('soporte-panel', false);
            }
        });
    }

    const controlMessages = {
        monitoreo: 'Configuración de monitoreo guardada correctamente.',
        riego: 'Plan de riego registrado. El equipo ejecutará el programa indicado.',
        alertas: 'Alertas fitosanitarias activadas. Recibirás notificaciones según lo configurado.',
        reportes: 'El reporte se generará y será enviado al destinatario seleccionado.',
        'fumigacion-dron': 'Fumigación aérea programada. Logística confirmará disponibilidad de drones en breve.',
        'aplicacion-terrestre': 'Brigada terrestre asignada. Recibirás confirmación del supervisor en los próximos minutos.'
    };

    const financeMessages = {
        solicitud: 'Solicitud de crédito registrada. El comité financiero será notificado.',
        pagos: 'Consulta actualizada. Se muestran los últimos movimientos disponibles.',
        disponibilidad: 'Disponibilidad verificada y registrada para el equipo comercial.',
        baja: 'La solicitud fue dada de baja y se envió confirmación al solicitante.',
        reclamo: 'Reclamación documentada. Se asignó un analista para darle seguimiento.'
    };

    const supportMessages = {
        'soporte-solicitudes': 'Tu solicitud se registró. El área correspondiente te contactará en menos de 4 horas.',
        'soporte-novedades': 'Registro completado. Recibirás novedades y descuentos en tu bandeja principal.'
    };

    const controlForms = document.querySelectorAll('#control-panel form');
    controlForms.forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            const panelKey = form.dataset.panel;
            const message = controlMessages[panelKey] || 'Solicitud enviada.';
            alert(message);
            form.reset();
            toggleOverlay('control-panel', false);
        });
    });

    const financeForms = document.querySelectorAll('#finanzas-panel form');
    financeForms.forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            const panelKey = form.dataset.panel;
            const message = financeMessages[panelKey] || 'Operación registrada.';
            alert(message);
            form.reset();
        });
    });

    const supportForms = document.querySelectorAll('#soporte-panel form');
    supportForms.forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            const panelKey = form.dataset.panel;
            const message = supportMessages[panelKey] || 'Registro enviado al equipo de soporte.';
            alert(message);
            form.reset();
        });
    });

    function toggleOverlay(id, show) {
        const panel = document.getElementById(id);
        if (!panel) return;
        if (show) {
            document.querySelectorAll('.overlay.active').forEach(activeOverlay => {
                if (activeOverlay.id !== id) {
                    activeOverlay.classList.remove('active');
                    activeOverlay.classList.add('hidden');
                }
            });
            panel.classList.remove('hidden');
            const content = panel.querySelector('.overlay-content');
            if (content) {
                content.scrollTop = 0;
                if (hasAnime) {
                    anime({
                        targets: content,
                        opacity: [0, 1],
                        translateY: [24, 0],
                        duration: 420,
                        easing: 'easeOutCubic'
                    });
                }
            }
            document.body.classList.add('overlay-open');
            if (id === 'control-panel') {
                activateControlPanel('monitoreo');
            } else if (id === 'inventario-panel') {
                activateInventoryPanel('foliares');
            } else if (id === 'finanzas-panel') {
                activateFinancePanel('solicitud');
            } else if (id === 'soporte-panel') {
                activateSupportPanel('equipo');
            }
            requestAnimationFrame(() => panel.classList.add('active'));
        } else {
            panel.classList.remove('active');
            setTimeout(() => {
                panel.classList.add('hidden');
                if (!document.querySelector('.overlay.active')) {
                    document.body.classList.remove('overlay-open');
                }
            }, 200);
        }
    }

    function activateControlPanel(target = 'monitoreo') {
        const panelId = `panel-${target}`;
        controlMenuButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === target);
        });
        controlPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === panelId);
        });
    }

    function activateInventoryPanel(target = 'foliares') {
        const panelId = `panel-${target}`;
        inventoryMenuButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === target);
        });
        inventoryPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === panelId);
        });
        if (inventoryPanelsWrapper) {
            inventoryPanelsWrapper.scrollTop = 0;
        }
    }

    function activateFinancePanel(target = 'solicitud') {
        const panelId = `panel-${target}`;
        financeMenuButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === target);
        });
        financePanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === panelId);
        });
        if (financePanelsWrapper) {
            financePanelsWrapper.scrollTop = 0;
        }
    }

    function activateSupportPanel(target = 'equipo') {
        const panelId = `panel-${target}`;
        supportMenuButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === target);
        });
        supportPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === panelId);
        });
        if (supportPanelsWrapper) {
            supportPanelsWrapper.scrollTop = 0;
        }
    }

    // Fondo animado molecular con Three.js
    const main = document.querySelector('main');
    const hasThree = typeof THREE !== 'undefined';
    if (main && hasThree) {
        const bgCanvas = document.createElement('canvas');
        bgCanvas.style.position = 'fixed';
        bgCanvas.style.top = 0;
        bgCanvas.style.left = 0;
        bgCanvas.style.width = '100vw';
        bgCanvas.style.height = '100vh';
        bgCanvas.style.zIndex = '-3';
        bgCanvas.id = 'bg-threejs';
        document.body.appendChild(bgCanvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1.5, 10);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setSize(window.innerWidth, window.innerHeight);

        const hasPostProcessing =
            typeof THREE.EffectComposer !== 'undefined' &&
            typeof THREE.RenderPass !== 'undefined' &&
            typeof THREE.UnrealBloomPass !== 'undefined' &&
            typeof THREE.FilmPass !== 'undefined';

        let composer = null;
        let bloomPass = null;
        let filmPass = null;

        if (hasPostProcessing) {
            composer = new THREE.EffectComposer(renderer);
            const renderPass = new THREE.RenderPass(scene, camera);
            composer.addPass(renderPass);

            bloomPass = new THREE.UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                1.15,
                0.5,
                0.82
            );
            composer.addPass(bloomPass);

            filmPass = new THREE.FilmPass(0.22, 0.035, 648, false);
            filmPass.renderToScreen = true;
            composer.addPass(filmPass);
        }

        scene.fog = new THREE.FogExp2(0x0f3048, 0.045);

        const ambient = new THREE.AmbientLight(0x9bd0b9, 0.42);
        scene.add(ambient);

        const light1 = new THREE.PointLight(0xffffff, 0.8, 120);
        light1.position.set(6, 8, 6);
        scene.add(light1);

        const light2 = new THREE.PointLight(0xf9d423, 0.6, 120);
        light2.position.set(-7, -4, -5);
        scene.add(light2);

        function createGradientTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return null;
            }

            const radial = ctx.createRadialGradient(512, 420, 80, 512, 420, 560);
            radial.addColorStop(0, 'rgba(146, 206, 255, 0.32)');
            radial.addColorStop(0.45, 'rgba(101, 178, 224, 0.58)');
            radial.addColorStop(1, 'rgba(15, 48, 72, 0.88)');

            ctx.fillStyle = radial;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(120, 210, 176, 0.38)';
            ctx.beginPath();
            ctx.ellipse(540, 760, 360, 220, Math.PI / 9, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 214, 115, 0.25)';
            ctx.beginPath();
            ctx.ellipse(340, 280, 240, 180, -Math.PI / 8, 0, Math.PI * 2);
            ctx.fill();

            return new THREE.CanvasTexture(canvas);
        }

        const gradientTexture = createGradientTexture();
        if (gradientTexture) {
            gradientTexture.needsUpdate = true;
            gradientTexture.minFilter = THREE.LinearFilter;
            gradientTexture.magFilter = THREE.LinearFilter;
        }

        const backgroundPlaneMaterial = new THREE.MeshBasicMaterial({
            map: gradientTexture || null,
            color: gradientTexture ? 0xffffff : 0x0f3048,
            transparent: true,
            opacity: 0.28,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const backgroundPlane = new THREE.Mesh(new THREE.PlaneGeometry(46, 30, 1, 1), backgroundPlaneMaterial);
        backgroundPlane.position.set(0, 0.4, -14);
        backgroundPlane.rotation.x = -0.08;
        scene.add(backgroundPlane);

        const coreGeometry = new THREE.SphereGeometry(1.4, 48, 48);
        const coreMaterial = new THREE.MeshStandardMaterial({
            color: 0xdcedc8,
            metalness: 0.4,
            roughness: 0.25,
            emissive: 0x9ccc65,
            emissiveIntensity: 0.25,
            transparent: true,
            opacity: 0.65
        });
        const centralCore = new THREE.Mesh(coreGeometry, coreMaterial);
        centralCore.rotation.y = Math.PI / 6;
        scene.add(centralCore);

        function hexToRgb(hexColor) {
            return {
                r: (hexColor >> 16) & 255,
                g: (hexColor >> 8) & 255,
                b: hexColor & 255
            };
        }

        function createLabelSprite(text, color) {
            const canvas = document.createElement('canvas');
            const size = 256;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return null;
            }

            const { r, g, b } = hexToRgb(color);
            ctx.clearRect(0, 0, size, size);

            ctx.save();
            ctx.translate(size / 2, size / 2);
            const radius = size * 0.42;

            const gradient = ctx.createRadialGradient(0, 0, radius * 0.15, 0, 0, radius);
            gradient.addColorStop(0, `rgba(${Math.min(r + 40, 255)}, ${Math.min(g + 40, 255)}, ${Math.min(b + 40, 255)}, 0.95)`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.58)`);

            ctx.fillStyle = gradient;
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.65)`;
            ctx.shadowBlur = 28;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.lineWidth = 7;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
            ctx.stroke();

            ctx.restore();

            const fontSize = text.length > 3 ? 92 : 118;
            ctx.font = `700 ${fontSize}px "Arial"`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';

            ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
            ctx.shadowBlur = 22;
            ctx.fillText(text, size / 2, size / 2);

            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
            ctx.lineWidth = 3;
            ctx.strokeText(text, size / 2, size / 2);

            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(2.2, 2.2, 2.2);
            return sprite;
        }

        const moleculePalette = [
            { label: 'N', color: 0x64b5f6, orbit: 5.6, satellites: 5 }, // Nitrógeno
            { label: 'P', color: 0xffb74d, orbit: 4.8, satellites: 4 }, // Fósforo
            { label: 'K', color: 0xff7043, orbit: 6.1, satellites: 5 }, // Potasio
            { label: 'CaO2', color: 0x81c784, orbit: 3.9, satellites: 4 }, // Calcio peróxido
            { label: 'Mg', color: 0xba68c8, orbit: 3.3, satellites: 4 }, // Magnesio
            { label: 'S', color: 0xfff176, orbit: 2.7, satellites: 3 }, // Azufre
            { label: 'Fe', color: 0xa1887f, orbit: 2.2, satellites: 3 } // Hierro
        ];

        const moleculeGroups = [];

        moleculePalette.forEach((mol, idx) => {
            const group = new THREE.Group();

            const nucleusGeometry = new THREE.SphereGeometry(0.55 + idx * 0.05, 40, 40);
            const nucleusMaterial = new THREE.MeshStandardMaterial({
                color: mol.color,
                emissive: mol.color,
                emissiveIntensity: 0.35,
                metalness: 0.65,
                roughness: 0.25,
                transparent: true,
                opacity: 0.85
            });
            const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
            group.add(nucleus);

            const labelSprite = createLabelSprite(mol.label, mol.color);
            if (labelSprite) {
                labelSprite.position.set(0, 0, 1.2);
                group.add(labelSprite);
            }

            const satellites = [];
            for (let i = 0; i < mol.satellites; i++) {
                const satGeometry = new THREE.SphereGeometry(0.18 + Math.random() * 0.05, 24, 24);
                const satMaterial = new THREE.MeshStandardMaterial({
                    color: mol.color,
                    emissive: mol.color,
                    emissiveIntensity: 0.55,
                    metalness: 0.45,
                    roughness: 0.3,
                    transparent: true,
                    opacity: 0.7
                });
                const sat = new THREE.Mesh(satGeometry, satMaterial);
                const angle = (i / mol.satellites) * Math.PI * 2;
                const radius = 0.9 + Math.random() * 0.5;
                sat.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
                sat.userData = { angle, radius, speed: 0.4 + Math.random() * 0.6 };
                group.add(sat);
                satellites.push(sat);
            }

            const orbitPoints = [];
            for (let k = 0; k <= 64; k++) {
                const angle = (k / 64) * Math.PI * 2;
                orbitPoints.push(new THREE.Vector3(Math.cos(angle) * 1.05, Math.sin(angle) * 1.05, 0));
            }
            const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
            const orbitMaterial = new THREE.LineBasicMaterial({ color: mol.color, transparent: true, opacity: 0.25 });
            const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
            group.add(orbit);

            group.position.set(
                Math.cos(idx * 0.9) * mol.orbit,
                Math.sin(idx * 0.6) * 1.8,
                Math.sin(idx * 0.7) * mol.orbit
            );
            group.userData = {
                orbitRadius: mol.orbit,
                angle: idx * 0.8,
                speed: 0.12 + idx * 0.018,
                satellites
            };

            moleculeGroups.push(group);
            scene.add(group);
        });

        let tick = 0;
        function animate() {
            requestAnimationFrame(animate);
            tick += 0.013;

            moleculeGroups.forEach((group, idx) => {
                const data = group.userData;
                data.angle += data.speed * 0.015;
                group.position.x = Math.cos(data.angle) * data.orbitRadius;
                group.position.z = Math.sin(data.angle) * data.orbitRadius;
                group.rotation.y += 0.003 + idx * 0.0007;
                group.rotation.x += 0.0015;

                data.satellites.forEach(sat => {
                    const satData = sat.userData;
                    satData.angle += satData.speed * 0.02;
                    sat.position.x = Math.cos(satData.angle) * satData.radius;
                    sat.position.y = Math.sin(satData.angle) * satData.radius;
                });
            });

            centralCore.rotation.y += 0.0008;
            centralCore.rotation.x += 0.0004;

            light1.position.x = Math.sin(tick * 0.6) * 7;
            light1.position.y = 5 + Math.cos(tick * 0.4) * 3;
            light2.position.z = Math.cos(tick * 0.5) * 6;

            if (bloomPass) {
                bloomPass.strength = 1.05 + Math.sin(tick * 0.35) * 0.18;
                bloomPass.radius = 0.6 + Math.cos(tick * 0.25) * 0.08;
                bloomPass.threshold = 0.6 + Math.sin(tick * 0.18) * 0.04;
            }
            backgroundPlane.position.x = Math.sin(tick * 0.12) * 0.9;
            backgroundPlane.position.y = 0.4 + Math.cos(tick * 0.11) * 0.3;
            backgroundPlane.material.opacity = 0.24 + Math.sin(tick * 0.16) * 0.04;

            if (filmPass) {
                filmPass.uniforms.grayscale.value = 0.35 + Math.sin(tick * 0.12) * 0.08;
            }

            if (composer) {
                composer.render();
            } else {
                renderer.render(scene, camera);
            }
        }
        animate();

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            if (composer) {
                composer.setSize(window.innerWidth, window.innerHeight);
            }
            if (bloomPass && bloomPass.setSize) {
                bloomPass.setSize(window.innerWidth, window.innerHeight);
            }
            backgroundPlane.scale.set(window.innerWidth / window.innerHeight > 1.5 ? 1.2 : 1, 1, 1);
        });
    }
});
