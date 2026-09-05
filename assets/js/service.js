

(() => {
    "use strict";


    

    const doc = document;

    const qs = (selector, scope = doc) => {
        return scope.querySelector(selector);
    };

    const qsa = (selector, scope = doc) => {
        return Array.from(
            scope.querySelectorAll(selector)
        );
    };

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    

    const isServicePage = () => {
        return Boolean(
            qs(".service-hero")
        );
    };


    

    const initServiceHero = () => {
        const hero = qs(
            ".service-hero"
        );

        if (
            !hero ||
            prefersReducedMotion ||
            !window.gsap
        ) {
            return;
        }


        const title = qs(
            ".page-hero__title",
            hero
        );

        const text = qs(
            ".page-hero__text",
            hero
        );

        const actions = qs(
            ".page-hero__actions",
            hero
        );

        const word = qs(
            ".page-hero__word",
            hero
        );

        const metrics = qsa(
            ".service-hero__metric",
            hero
        );

        const lines = qsa(
            ".decor-line",
            hero
        );

        const dots = qsa(
            ".decor-dot, .decor-square",
            hero
        );

        const waveLines = qsa(
            ".hero-wave-line",
            hero
        );


        

        if (title) {
            window.gsap.set(title, {
                opacity: 0,
                y: 44
            });
        }

        if (text) {
            window.gsap.set(text, {
                opacity: 0,
                y: 24
            });
        }

        if (actions) {
            window.gsap.set(actions, {
                opacity: 0,
                y: 18
            });
        }

        if (word) {
            window.gsap.set(word, {
                opacity: 0,
                scale: 0.96
            });
        }

        if (metrics.length) {
            window.gsap.set(metrics, {
                opacity: 0,
                scale: 0.9
            });
        }


        const timeline =
            window.gsap.timeline({
                defaults: {
                    ease: "power3.out"
                }
            });


        if (word) {
            timeline.to(
                word,
                {
                    opacity: 0.8,
                    scale: 1,
                    duration: 1.05
                },
                0
            );
        }


        if (lines.length) {
            timeline.fromTo(
                lines,
                {
                    opacity: 0,
                    scaleY: 0,
                    transformOrigin:
                        "50% 50%"
                },
                {
                    opacity: 1,
                    scaleY: 1,
                    duration: 0.82,
                    stagger: 0.04
                },
                0.06
            );
        }


        if (dots.length) {
            timeline.fromTo(
                dots,
                {
                    opacity: 0,
                    scale: 0.5
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.55,
                    stagger: 0.035
                },
                0.16
            );
        }


        if (waveLines.length) {
            timeline.fromTo(
                waveLines,
                {
                    opacity: 0
                },
                {
                    opacity: 1,
                    duration: 1
                },
                0.1
            );
        }


        if (title) {
            timeline.to(
                title,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.86
                },
                0.2
            );
        }


        if (text) {
            timeline.to(
                text,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.72
                },
                0.45
            );
        }


        if (actions) {
            timeline.to(
                actions,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.68
                },
                0.58
            );
        }


        if (metrics.length) {
            timeline.to(
                metrics,
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.7,
                    stagger: 0.1
                },
                0.5
            );
        }


        

        if (
            word &&
            window.ScrollTrigger
        ) {
            window.gsap.to(
                word,
                {
                    yPercent: 10,
                    scale: 1.025,
                    ease: "none",

                    scrollTrigger: {
                        trigger: hero,
                        start: "top top",
                        end: "bottom top",
                        scrub: 0.8
                    }
                }
            );
        }
    };


    

    const initServiceTabs = () => {
        const sections = qsa(
            ".service-tabs"
        );

        if (!sections.length) {
            return;
        }


        sections.forEach(
            (section, sectionIndex) => {

                const tabs = qsa(
                    ".service-tab",
                    section
                );

                const panels = qsa(
                    ".service-tab-panel",
                    section
                );


                if (
                    !tabs.length ||
                    !panels.length
                ) {
                    return;
                }


                let activeIndex =
                    Math.max(
                        0,
                        tabs.findIndex(
                            (tab) =>
                                tab.classList.contains(
                                    "is-active"
                                )
                        )
                    );


                const prepareAccessibility = () => {
                    tabs.forEach(
                        (tab, index) => {

                            const tabId =
                                tab.id ||
                                `service-tab-${sectionIndex}-${index}`;

                            const panel =
                                panels[index];

                            if (!panel) {
                                return;
                            }


                            const panelId =
                                panel.id ||
                                `service-panel-${sectionIndex}-${index}`;


                            tab.id = tabId;
                            panel.id = panelId;


                            tab.setAttribute(
                                "role",
                                "tab"
                            );

                            tab.setAttribute(
                                "aria-controls",
                                panelId
                            );

                            tab.setAttribute(
                                "aria-selected",
                                String(
                                    index ===
                                    activeIndex
                                )
                            );

                            tab.setAttribute(
                                "tabindex",
                                index ===
                                    activeIndex
                                    ? "0"
                                    : "-1"
                            );


                            panel.setAttribute(
                                "role",
                                "tabpanel"
                            );

                            panel.setAttribute(
                                "aria-labelledby",
                                tabId
                            );

                            panel.setAttribute(
                                "aria-hidden",
                                String(
                                    index !==
                                    activeIndex
                                )
                            );


                            tab.classList.toggle(
                                "is-active",
                                index ===
                                    activeIndex
                            );

                            panel.classList.toggle(
                                "is-active",
                                index ===
                                    activeIndex
                            );
                        }
                    );
                };


                const activateTab = (
                    nextIndex,
                    moveFocus = false
                ) => {
                    if (
                        nextIndex < 0 ||
                        nextIndex >=
                            tabs.length ||
                        nextIndex ===
                            activeIndex
                    ) {
                        return;
                    }


                    const previousPanel =
                        panels[
                            activeIndex
                        ];

                    const nextPanel =
                        panels[
                            nextIndex
                        ];

                    const previousTab =
                        tabs[
                            activeIndex
                        ];

                    const nextTab =
                        tabs[
                            nextIndex
                        ];


                    if (
                        !nextPanel ||
                        !nextTab
                    ) {
                        return;
                    }


                    activeIndex =
                        nextIndex;


                    tabs.forEach(
                        (tab, index) => {

                            const active =
                                index ===
                                nextIndex;


                            tab.classList.toggle(
                                "is-active",
                                active
                            );

                            tab.setAttribute(
                                "aria-selected",
                                String(active)
                            );

                            tab.setAttribute(
                                "tabindex",
                                active
                                    ? "0"
                                    : "-1"
                            );
                        }
                    );


                    panels.forEach(
                        (panel, index) => {
                            panel.setAttribute(
                                "aria-hidden",
                                String(
                                    index !==
                                    nextIndex
                                )
                            );
                        }
                    );


                    

                    if (
                        prefersReducedMotion ||
                        !window.gsap
                    ) {
                        previousPanel
                            ?.classList.remove(
                                "is-active"
                            );

                        nextPanel.classList.add(
                            "is-active"
                        );

                        window.SiteUI
                            ?.rebuildIcons?.();

                        window.SiteUI
                            ?.refresh?.();


                        if (moveFocus) {
                            nextTab.focus();
                        }

                        return;
                    }


                    

                    if (previousPanel) {
                        window.gsap.to(
                            previousPanel,
                            {
                                opacity: 0,
                                y: 8,

                                duration: 0.18,

                                ease:
                                    "power1.out",

                                onComplete() {
                                    previousPanel
                                        .classList
                                        .remove(
                                            "is-active"
                                        );


                                    window.gsap.set(
                                        previousPanel,
                                        {
                                            clearProps:
                                                "opacity,transform"
                                        }
                                    );


                                    nextPanel
                                        .classList
                                        .add(
                                            "is-active"
                                        );


                                    window.gsap.fromTo(
                                        nextPanel,
                                        {
                                            opacity: 0,
                                            y: 12
                                        },
                                        {
                                            opacity: 1,
                                            y: 0,

                                            duration:
                                                0.42,

                                            ease:
                                                "power2.out",

                                            onComplete() {
                                                window.gsap.set(
                                                    nextPanel,
                                                    {
                                                        clearProps:
                                                            "opacity,transform"
                                                    }
                                                );


                                                window.SiteUI
                                                    ?.refresh?.();
                                            }
                                        }
                                    );


                                    window.SiteUI
                                        ?.rebuildIcons?.();
                                }
                            }
                        );
                    } else {
                        nextPanel.classList.add(
                            "is-active"
                        );
                    }


                    if (moveFocus) {
                        nextTab.focus();
                    }
                };


                prepareAccessibility();


                tabs.forEach(
                    (tab, index) => {

                        tab.addEventListener(
                            "click",
                            () => {
                                activateTab(
                                    index
                                );
                            }
                        );


                        tab.addEventListener(
                            "keydown",
                            (event) => {

                                let nextIndex = null;


                                if (
                                    event.key ===
                                    "ArrowRight"
                                ) {
                                    nextIndex =
                                        (
                                            index +
                                            1
                                        ) %
                                        tabs.length;
                                }


                                if (
                                    event.key ===
                                    "ArrowLeft"
                                ) {
                                    nextIndex =
                                        (
                                            index -
                                            1 +
                                            tabs.length
                                        ) %
                                        tabs.length;
                                }


                                if (
                                    event.key ===
                                    "Home"
                                ) {
                                    nextIndex = 0;
                                }


                                if (
                                    event.key ===
                                    "End"
                                ) {
                                    nextIndex =
                                        tabs.length -
                                        1;
                                }


                                if (
                                    nextIndex ===
                                    null
                                ) {
                                    return;
                                }


                                event.preventDefault();


                                activateTab(
                                    nextIndex,
                                    true
                                );
                            }
                        );
                    }
                );
            }
        );
    };


    

    const initResultsSwipers = () => {
        const swipers = qsa(
            ".service-results-swiper"
        );

        if (
            !swipers.length ||
            !window.Swiper
        ) {
            return;
        }


        swipers.forEach(
            (swiperElement) => {

                const section =
                    swiperElement.closest(
                        ".service-results"
                    );


                const prev =
                    qs(
                        ".service-results-prev",
                        section
                    );

                const next =
                    qs(
                        ".service-results-next",
                        section
                    );

                const pagination =
                    qs(
                        ".swiper-pagination",
                        swiperElement
                    );


                const slides =
                    qsa(
                        ".swiper-slide",
                        swiperElement
                    );


                

                const useLoop =
                    slides.length > 3;


                const swiper =
                    new window.Swiper(
                        swiperElement,
                        {
                            loop:
                                useLoop,

                            loopAdditionalSlides:
                                useLoop
                                    ? 2
                                    : 0,

                            speed:
                                prefersReducedMotion
                                    ? 0
                                    : 680,

                            slidesPerView: 1,

                            spaceBetween: 14,

                            grabCursor:
                                !prefersReducedMotion,

                            watchOverflow: true,

                            resistanceRatio:
                                0.72,

                            navigation: {
                                prevEl: prev,
                                nextEl: next
                            },

                            pagination: {
                                el: pagination,
                                clickable: true
                            },

                            keyboard: {
                                enabled: true,
                                onlyInViewport:
                                    true
                            },

                            autoplay:
                                prefersReducedMotion ||
                                !useLoop
                                    ? false
                                    : {
                                        delay:
                                            4800,

                                        disableOnInteraction:
                                            false,

                                        pauseOnMouseEnter:
                                            true
                                    },

                            breakpoints: {
                                640: {
                                    slidesPerView:
                                        1.35,

                                    spaceBetween:
                                        15
                                },

                                800: {
                                    slidesPerView:
                                        2,

                                    spaceBetween:
                                        16
                                },

                                1100: {
                                    slidesPerView:
                                        3,

                                    spaceBetween:
                                        16
                                }
                            },

                            on: {
                                init() {
                                    window.SiteUI
                                        ?.refresh?.();
                                },

                                resize() {
                                    window.SiteUI
                                        ?.refresh?.();
                                }
                            }
                        }
                    );


                

                doc.addEventListener(
                    "visibilitychange",
                    () => {

                        if (
                            !swiper.autoplay
                        ) {
                            return;
                        }


                        if (doc.hidden) {
                            swiper.autoplay.stop();
                        } else if (
                            !prefersReducedMotion &&
                            useLoop
                        ) {
                            swiper.autoplay.start();
                        }
                    }
                );
            }
        );
    };


    

    const initProofSwipers = () => {
        const swipers = qsa(
            ".service-proof-swiper"
        );

        if (
            !swipers.length ||
            !window.Swiper
        ) {
            return;
        }


        swipers.forEach(
            (swiperElement) => {
                const pagination =
                    qs(
                        ".swiper-pagination",
                        swiperElement
                    );


                const swiper =
                    new window.Swiper(
                        swiperElement,
                        {
                            loop: true,

                            loopAdditionalSlides: 2,

                            speed:
                                prefersReducedMotion
                                    ? 0
                                    : 680,

                            slidesPerView: 1,

                            spaceBetween: 18,

                            grabCursor:
                                !prefersReducedMotion,

                            pagination: {
                                el: pagination,
                                clickable: true
                            },

                            keyboard: {
                                enabled: true,
                                onlyInViewport: true
                            },

                            autoplay:
                                prefersReducedMotion
                                    ? false
                                    : {
                                        delay: 4200,
                                        disableOnInteraction: false,
                                        pauseOnMouseEnter: true
                                    },

                            breakpoints: {
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 22
                                },

                                1100: {
                                    slidesPerView: 3,
                                    spaceBetween: 24
                                }
                            },

                            on: {
                                init() {
                                    window.SiteUI
                                        ?.refresh?.();
                                },

                                resize() {
                                    window.SiteUI
                                        ?.refresh?.();
                                }
                            }
                        }
                    );


                doc.addEventListener(
                    "visibilitychange",
                    () => {
                        if (
                            !swiper.autoplay
                        ) {
                            return;
                        }


                        if (doc.hidden) {
                            swiper.autoplay.stop();
                        } else if (
                            !prefersReducedMotion
                        ) {
                            swiper.autoplay.start();
                        }
                    }
                );
            }
        );
    };




    const initServiceCounters = () => {
        const counters = qsa(
            "[data-service-counter]"
        );


        if (!counters.length) {
            return;
        }


        const animateCounter = (
            element
        ) => {
            if (
                element.dataset
                    .counterDone ===
                "true"
            ) {
                return;
            }


            element.dataset.counterDone =
                "true";


            const target =
                Number.parseFloat(
                    element.dataset
                        .serviceCounter
                );


            if (
                Number.isNaN(target)
            ) {
                return;
            }


            const suffix =
                element.dataset
                    .counterSuffix ||
                "";


            const prefix =
                element.dataset
                    .counterPrefix ||
                "";


            const decimalPart =
                String(target)
                    .split(".")[1];


            const decimals =
                decimalPart
                    ? decimalPart.length
                    : 0;


            const render = (
                value
            ) => {
                element.textContent =
                    prefix +
                    value.toFixed(
                        decimals
                    ) +
                    suffix;
            };


            if (prefersReducedMotion) {
                render(target);
                return;
            }


            if (window.gsap) {
                const state = {
                    value: 0
                };


                window.gsap.to(
                    state,
                    {
                        value: target,

                        duration: 1.35,

                        ease:
                            "power2.out",

                        onUpdate() {
                            render(
                                state.value
                            );
                        },

                        onComplete() {
                            render(
                                target
                            );
                        }
                    }
                );

                return;
            }


            const duration = 1200;
            const start =
                performance.now();


            const tick = (time) => {
                const progress =
                    Math.min(
                        1,
                        (time - start) /
                        duration
                    );


                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );


                render(
                    target *
                    eased
                );


                if (progress < 1) {
                    window.requestAnimationFrame(
                        tick
                    );
                }
            };


            window.requestAnimationFrame(
                tick
            );
        };


        if (
            window.gsap &&
            window.ScrollTrigger
        ) {
            counters.forEach(
                (counter) => {
                    window.ScrollTrigger.create({
                        trigger: counter,

                        start:
                            "top 88%",

                        once: true,

                        onEnter() {
                            animateCounter(
                                counter
                            );
                        }
                    });
                }
            );

            return;
        }


        if (
            "IntersectionObserver"
            in window
        ) {
            const observer =
                new IntersectionObserver(
                    (entries) => {
                        entries.forEach(
                            (entry) => {

                                if (
                                    !entry
                                        .isIntersecting
                                ) {
                                    return;
                                }


                                animateCounter(
                                    entry.target
                                );


                                observer.unobserve(
                                    entry.target
                                );
                            }
                        );
                    },
                    {
                        threshold: 0.3
                    }
                );


            counters.forEach(
                (counter) => {
                    observer.observe(
                        counter
                    );
                }
            );

            return;
        }


        counters.forEach(
            animateCounter
        );
    };


    

    const initServiceParallax = () => {
        const sections = qsa(
            ".service-parallax"
        );


        if (
            !sections.length ||
            prefersReducedMotion
        ) {
            return;
        }


        const mediaQuery =
            window.matchMedia(
                "(min-width: 901px)"
            );


        let cleanups = [];


        const destroy = () => {
            cleanups.forEach(
                (cleanup) => {
                    cleanup?.();
                }
            );

            cleanups = [];
        };


        const setup = (
            section
        ) => {
            const image =
                qs(
                    ".service-parallax__image",
                    section
                );


            if (!image) {
                return null;
            }


            if (
                window.gsap &&
                window.ScrollTrigger
            ) {
                const tween =
                    window.gsap.fromTo(
                        image,
                        {
                            y: -32
                        },
                        {
                            y: 32,

                            ease: "none",

                            scrollTrigger: {
                                trigger: section,

                                start:
                                    "top bottom",

                                end:
                                    "bottom top",

                                scrub: 0.75,

                                invalidateOnRefresh:
                                    true
                            }
                        }
                    );


                return () => {
                    tween.scrollTrigger
                        ?.kill();

                    tween.kill();


                    window.gsap.set(
                        image,
                        {
                            clearProps:
                                "transform"
                        }
                    );
                };
            }


            

            let raf = null;


            const update = () => {
                raf = null;


                const rect =
                    section
                        .getBoundingClientRect();


                const viewport =
                    window.innerHeight;


                const progress =
                    (
                        viewport -
                        rect.top
                    ) /
                    (
                        viewport +
                        rect.height
                    );


                const clamped =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            progress
                        )
                    );


                const y =
                    -32 +
                    clamped * 64;


                image.style.transform =
                    `translate3d(0, ${y}px, 0)`;
            };


            const onScroll = () => {
                if (raf) {
                    return;
                }


                raf =
                    window.requestAnimationFrame(
                        update
                    );
            };


            update();


            window.addEventListener(
                "scroll",
                onScroll,
                {
                    passive: true
                }
            );


            return () => {
                window.removeEventListener(
                    "scroll",
                    onScroll
                );

                image.style.transform =
                    "";
            };
        };


        const build = () => {
            destroy();


            if (!mediaQuery.matches) {
                return;
            }


            sections.forEach(
                (section) => {
                    const cleanup =
                        setup(
                            section
                        );


                    if (cleanup) {
                        cleanups.push(
                            cleanup
                        );
                    }
                }
            );


            window.SiteUI
                ?.refresh?.();
        };


        build();


        if (
            typeof mediaQuery
                .addEventListener ===
            "function"
        ) {
            mediaQuery.addEventListener(
                "change",
                build
            );
        } else {
            mediaQuery.addListener(
                build
            );
        }
    };


    

    const initDataVisualDepth = () => {
        if (
            prefersReducedMotion ||
            !window.gsap ||
            !window.ScrollTrigger
        ) {
            return;
        }


        qsa(
            ".service-data"
        ).forEach(
            (section) => {

                const visual =
                    qs(
                        ".service-data__visual",
                        section
                    );


                if (!visual) {
                    return;
                }


                window.gsap.fromTo(
                    visual,
                    {
                        y: -12
                    },
                    {
                        y: 18,

                        ease: "none",

                        scrollTrigger: {
                            trigger: section,

                            start:
                                "top bottom",

                            end:
                                "bottom top",

                            scrub: 0.8
                        }
                    }
                );
            }
        );
    };


    

    const initOverviewVisualDepth = () => {
        if (
            prefersReducedMotion ||
            !window.gsap ||
            !window.ScrollTrigger
        ) {
            return;
        }


        qsa(
            ".service-overview__visual"
        ).forEach(
            (visual) => {

                const image =
                    qs(
                        "img, svg",
                        visual
                    );


                if (!image) {
                    return;
                }


                window.gsap.fromTo(
                    image,
                    {
                        y: -7
                    },
                    {
                        y: 9,

                        ease: "none",

                        scrollTrigger: {
                            trigger: visual,

                            start:
                                "top 90%",

                            end:
                                "bottom 10%",

                            scrub: 1
                        }
                    }
                );
            }
        );
    };


    

    const initCapabilityDepth = () => {
        if (
            prefersReducedMotion ||
            !window.matchMedia(
                "(hover: hover) and (pointer: fine)"
            ).matches
        ) {
            return;
        }


        qsa(
            ".capability-card"
        ).forEach(
            (card) => {

                let frame = null;


                const reset = () => {
                    card.style.transform =
                        "";
                };


                card.addEventListener(
                    "pointermove",
                    (event) => {

                        if (frame) {
                            window.cancelAnimationFrame(
                                frame
                            );
                        }


                        frame =
                            window.requestAnimationFrame(
                                () => {

                                    const rect =
                                        card
                                            .getBoundingClientRect();


                                    const x =
                                        (
                                            event.clientX -
                                            rect.left
                                        ) /
                                        rect.width -
                                        0.5;


                                    const y =
                                        (
                                            event.clientY -
                                            rect.top
                                        ) /
                                        rect.height -
                                        0.5;


                                    card.style.transform =
                                        `perspective(900px)
                                         rotateX(${-y * 1.6}deg)
                                         rotateY(${x * 1.6}deg)
                                         translateY(-5px)`;
                                }
                            );
                    }
                );


                card.addEventListener(
                    "pointerleave",
                    reset
                );
            }
        );
    };


    

    const initResultCardDepth = () => {
        if (
            prefersReducedMotion ||
            !window.matchMedia(
                "(hover: hover) and (pointer: fine)"
            ).matches
        ) {
            return;
        }


        qsa(
            ".service-result-card"
        ).forEach(
            (card) => {

                let frame = null;


                card.addEventListener(
                    "pointermove",
                    (event) => {

                        if (frame) {
                            window.cancelAnimationFrame(
                                frame
                            );
                        }


                        frame =
                            window.requestAnimationFrame(
                                () => {

                                    const rect =
                                        card
                                            .getBoundingClientRect();


                                    const x =
                                        (
                                            event.clientX -
                                            rect.left
                                        ) /
                                        rect.width -
                                        0.5;


                                    const y =
                                        (
                                            event.clientY -
                                            rect.top
                                        ) /
                                        rect.height -
                                        0.5;


                                    card.style.transform =
                                        `perspective(900px)
                                         rotateX(${-y * 1.3}deg)
                                         rotateY(${x * 1.3}deg)
                                         translateY(-4px)`;
                                }
                            );
                    }
                );


                card.addEventListener(
                    "pointerleave",
                    () => {
                        card.style.transform =
                            "";
                    }
                );
            }
        );
    };


    

    const initMarqueeInteraction = () => {
        qsa(
            ".service-marquee"
        ).forEach(
            (marquee) => {

                const track =
                    qs(
                        ".service-marquee__track",
                        marquee
                    );


                if (!track) {
                    return;
                }


                marquee.addEventListener(
                    "pointerenter",
                    () => {
                        track.style
                            .animationPlayState =
                            "paused";
                    }
                );


                marquee.addEventListener(
                    "pointerleave",
                    () => {
                        track.style
                            .animationPlayState =
                            "";
                    }
                );
            }
        );
    };


    

    const initCTAEffects = () => {
        if (
            prefersReducedMotion ||
            !window.gsap ||
            !window.ScrollTrigger
        ) {
            return;
        }


        qsa(
            ".service-cta__card"
        ).forEach(
            (card) => {

                const circles =
                    qsa(
                        ".service-cta__circle",
                        card
                    );


                const line =
                    qs(
                        ".service-cta__line",
                        card
                    );


                if (circles.length) {
                    window.gsap.fromTo(
                        circles,
                        {
                            y: -8
                        },
                        {
                            y: 10,

                            ease: "none",

                            stagger: 0.05,

                            scrollTrigger: {
                                trigger: card,

                                start:
                                    "top bottom",

                                end:
                                    "bottom top",

                                scrub: 1
                            }
                        }
                    );
                }


                if (line) {
                    window.gsap.fromTo(
                        line,
                        {
                            scaleY: 0.55,
                            transformOrigin:
                                "top"
                        },
                        {
                            scaleY: 1,

                            ease: "none",

                            scrollTrigger: {
                                trigger: card,

                                start:
                                    "top 90%",

                                end:
                                    "center 60%",

                                scrub: 0.7
                            }
                        }
                    );
                }
            }
        );
    };


    

    const finalRefresh = () => {
        window.requestAnimationFrame(
            () => {
                window.requestAnimationFrame(
                    () => {
                        window.SiteUI
                            ?.refresh?.();
                    }
                );
            }
        );
    };


    

    const init = () => {
        if (!isServicePage()) {
            return;
        }


        initServiceHero();

        initServiceTabs();

        initResultsSwipers();

        initProofSwipers();

        initServiceCounters();

        initServiceParallax();

        initDataVisualDepth();

        initOverviewVisualDepth();

        initCapabilityDepth();

        initResultCardDepth();

        initMarqueeInteraction();

        initCTAEffects();

        finalRefresh();


        doc.dispatchEvent(
            new CustomEvent(
                "service:ready"
            )
        );
    };


    

    if (
        doc.readyState ===
        "loading"
    ) {
        doc.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );
    } else {
        init();
    }

})();
