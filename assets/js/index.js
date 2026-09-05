

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


    

    const initHeroAnimation = () => {
        const hero = qs(".home-hero");

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

        const backgroundWord = qs(
            ".page-hero__word",
            hero
        );

        const floatingCards = qsa(
            ".home-hero__floating-card",
            hero
        );

        const signals = qsa(
            ".home-hero__signal",
            hero
        );

        const decorLines = qsa(
            ".decor-line",
            hero
        );

        const decorDots = qsa(
            ".decor-dot, .decor-square",
            hero
        );


        const timeline =
            window.gsap.timeline({
                defaults: {
                    ease:
                        "power3.out"
                }
            });


        if (backgroundWord) {
            timeline.fromTo(
                backgroundWord,
                {
                    opacity: 0,
                    scale: 0.96
                },
                {
                    opacity: 0.8,
                    scale: 1,
                    duration: 1.15
                },
                0
            );
        }


        if (decorLines.length) {
            timeline.fromTo(
                decorLines,
                {
                    opacity: 0,
                    scaleY: 0,
                    transformOrigin:
                        "50% 50%"
                },
                {
                    opacity: 1,
                    scaleY: 1,
                    duration: 0.9,
                    stagger: 0.045
                },
                0.08
            );
        }


        if (decorDots.length) {
            timeline.fromTo(
                decorDots,
                {
                    opacity: 0,
                    scale: 0.5
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.035
                },
                0.2
            );
        }


        if (title) {
            timeline.fromTo(
                title,
                {
                    opacity: 0,
                    y: 48
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9
                },
                0.2
            );
        }


        if (text) {
            timeline.fromTo(
                text,
                {
                    opacity: 0,
                    y: 25
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.75
                },
                0.48
            );
        }


        if (actions) {
            timeline.fromTo(
                actions,
                {
                    opacity: 0,
                    y: 20
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7
                },
                0.62
            );
        }


        if (floatingCards.length) {
            timeline.fromTo(
                floatingCards,
                {
                    opacity: 0,
                    scale: 0.88
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.75,
                    stagger: 0.1
                },
                0.52
            );
        }


        if (signals.length) {
            timeline.fromTo(
                signals,
                {
                    opacity: 0,
                    scale: 0
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.55,
                    stagger: 0.08
                },
                0.7
            );
        }


        

        if (
            backgroundWord &&
            window.ScrollTrigger
        ) {
            window.gsap.to(
                backgroundWord,
                {
                    yPercent: 12,
                    scale: 1.035,
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


    

    const initTestimonialsSwiper = () => {
        const swiperElement = qs(
            "[data-testimonials-swiper]"
        );

        if (
            !swiperElement ||
            !window.Swiper
        ) {
            return;
        }


        const prevButton = qs(
            ".testimonial-prev"
        );

        const nextButton = qs(
            ".testimonial-next"
        );

        const pagination = qs(
            ".swiper-pagination",
            swiperElement
        );


        const swiper = new window.Swiper(
            swiperElement,
            {
                loop: true,

                speed: prefersReducedMotion
                    ? 0
                    : 720,

                slidesPerView: 1,

                spaceBetween: 14,

                grabCursor:
                    !prefersReducedMotion,

                watchOverflow: true,

                observer: true,

                observeParents: true,

                resistanceRatio: 0.7,

                navigation: {
                    prevEl: prevButton,
                    nextEl: nextButton
                },

                pagination: {
                    el: pagination,
                    clickable: true
                },

                autoplay:
                    prefersReducedMotion
                        ? false
                        : {
                            delay: 5200,
                            disableOnInteraction:
                                false,

                            pauseOnMouseEnter:
                                true
                        },

                keyboard: {
                    enabled: true,
                    onlyInViewport: true
                },

                breakpoints: {
                    680: {
                        slidesPerView: 1.35,
                        spaceBetween: 16
                    },

                    900: {
                        slidesPerView: 1.55,
                        spaceBetween: 18
                    },

                    1200: {
                        slidesPerView: 2,
                        spaceBetween: 18
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
    };


    

    const initCaseStudies = () => {
        const filterContainer = qs(
            "[data-case-filters]"
        );

        const grid = qs(
            "[data-case-grid]"
        );

        if (
            !filterContainer ||
            !grid
        ) {
            return;
        }


        const buttons = qsa(
            ".case-filter",
            filterContainer
        );

        const cards = qsa(
            ".case-card",
            grid
        );


        if (
            !buttons.length ||
            !cards.length
        ) {
            return;
        }


        let activeFilter = "all";
        let transitionTimer = null;


        const setButtonState = (
            currentButton
        ) => {
            buttons.forEach(
                (button) => {
                    const active =
                        button ===
                        currentButton;

                    button.classList.toggle(
                        "is-active",
                        active
                    );

                    button.setAttribute(
                        "aria-selected",
                        String(active)
                    );
                }
            );
        };


        const showAll = () => {
            window.clearTimeout(
                transitionTimer
            );


            cards.forEach((card) => {
                card.classList.remove(
                    "is-active",
                    "is-hidden"
                );

                card.removeAttribute(
                    "aria-hidden"
                );
            });


            

            grid.classList.remove(
                "is-filtered"
            );


            window.SiteUI
                ?.refresh?.();
        };


        const showSingleCategory = (
            category
        ) => {
            window.clearTimeout(
                transitionTimer
            );


            const matches =
                cards.filter((card) => {
                    return (
                        card.dataset.category ===
                        category
                    );
                });


            if (!matches.length) {
                showAll();
                return;
            }


            

            const selectedCard =
                matches[0];


            grid.classList.add(
                "is-filtered"
            );


            cards.forEach((card) => {
                const active =
                    card ===
                    selectedCard;

                card.classList.toggle(
                    "is-active",
                    active
                );

                card.classList.toggle(
                    "is-hidden",
                    !active
                );

                card.setAttribute(
                    "aria-hidden",
                    String(!active)
                );
            });


            window.SiteUI
                ?.refresh?.();
        };


        const applyFilter = (
            button
        ) => {
            const filter =
                button.dataset.filter;

            if (
                !filter ||
                filter === activeFilter
            ) {
                return;
            }


            activeFilter = filter;

            setButtonState(button);


            

            grid.style.opacity = "0.72";

            grid.style.transform =
                "scale(0.992)";


            transitionTimer =
                window.setTimeout(
                    () => {
                        if (
                            filter === "all"
                        ) {
                            showAll();
                        } else {
                            showSingleCategory(
                                filter
                            );
                        }


                        window.requestAnimationFrame(
                            () => {
                                grid.style.opacity =
                                    "";

                                grid.style.transform =
                                    "";
                            }
                        );
                    },
                    prefersReducedMotion
                        ? 0
                        : 130
                );
        };


        buttons.forEach(
            (button) => {
                button.addEventListener(
                    "click",
                    () => {
                        applyFilter(
                            button
                        );
                    }
                );
            }
        );
    };


    

    const initCounters = () => {
        const counters = qsa(
            "[data-counter]"
        );

        if (!counters.length) {
            return;
        }


        const animateCounter = (
            element
        ) => {
            if (
                element.dataset.counted ===
                "true"
            ) {
                return;
            }


            element.dataset.counted =
                "true";


            const target =
                Number.parseFloat(
                    element.dataset.counter
                );


            if (
                Number.isNaN(target)
            ) {
                return;
            }


            const suffix =
                element.dataset
                    .counterSuffix || "";


            const decimals =
                String(target).includes(".")
                    ? String(target)
                        .split(".")[1]
                        .length
                    : 0;


            if (
                prefersReducedMotion
            ) {
                element.textContent =
                    target.toFixed(
                        decimals
                    ) +
                    suffix;

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

                        duration: 1.45,

                        ease:
                            "power2.out",

                        onUpdate() {
                            element.textContent =
                                state.value
                                    .toFixed(
                                        decimals
                                    ) +
                                suffix;
                        },

                        onComplete() {
                            element.textContent =
                                target.toFixed(
                                    decimals
                                ) +
                                suffix;
                        }
                    }
                );

                return;
            }


            

            const duration = 1300;
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


                const current =
                    target * eased;


                element.textContent =
                    current.toFixed(
                        decimals
                    ) +
                    suffix;


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
            window.ScrollTrigger &&
            window.gsap
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
                                    !entry.isIntersecting
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


    

    const initParallax = () => {
        const sections = qsa(
            "[data-parallax-section]"
        );

        if (
            !sections.length ||
            prefersReducedMotion
        ) {
            return;
        }


        const desktopQuery =
            window.matchMedia(
                "(min-width: 901px)"
            );


        const setupSection = (
            section
        ) => {
            const image = qs(
                "[data-parallax-image]",
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
                            y: -34
                        },
                        {
                            y: 34,

                            ease: "none",

                            scrollTrigger: {
                                trigger: section,

                                start:
                                    "top bottom",

                                end:
                                    "bottom top",

                                scrub: 0.7,

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
                    section.getBoundingClientRect();

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
                    -34 +
                    clamped * 68;


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


        let cleanups = [];


        const destroy = () => {
            cleanups.forEach(
                (cleanup) => {
                    cleanup?.();
                }
            );

            cleanups = [];
        };


        const build = () => {
            destroy();


            if (!desktopQuery.matches) {
                return;
            }


            sections.forEach(
                (section) => {
                    const cleanup =
                        setupSection(
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
            typeof desktopQuery
                .addEventListener ===
            "function"
        ) {
            desktopQuery.addEventListener(
                "change",
                build
            );
        } else {
            desktopQuery.addListener(
                build
            );
        }
    };


    

    const initCardDepth = () => {
        if (
            prefersReducedMotion ||
            !window.matchMedia(
                "(hover: hover) and (pointer: fine)"
            ).matches
        ) {
            return;
        }


        const cards = qsa(
            ".performance-stat"
        );


        cards.forEach((card) => {
            let frame = null;


            const reset = () => {
                card.style.transform = "";
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
                                    card.getBoundingClientRect();


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
                                    `perspective(800px)
                                     rotateX(${-y * 2.2}deg)
                                     rotateY(${x * 2.2}deg)
                                     translateY(-2px)`;
                            }
                        );
                }
            );


            card.addEventListener(
                "pointerleave",
                reset
            );
        });
    };


    

    const initRobotDepth = () => {
        const section = qs(
            ".robot-marquee"
        );

        const visual = qs(
            ".robot-marquee__visual",
            section
        );

        if (
            !section ||
            !visual ||
            prefersReducedMotion ||
            !window.gsap ||
            !window.ScrollTrigger
        ) {
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
    };


    

    const initLabelLines = () => {
        if (
            prefersReducedMotion ||
            !window.gsap ||
            !window.ScrollTrigger
        ) {
            return;
        }


        qsa(
            ".section-label"
        ).forEach((label) => {
            window.gsap.fromTo(
                label,
                {
                    "--label-shift":
                        "-8px"
                },
                {
                    "--label-shift":
                        "0px",

                    duration: 0.6,

                    ease:
                        "power2.out",

                    scrollTrigger: {
                        trigger: label,

                        start:
                            "top 92%",

                        once: true
                    }
                }
            );
        });
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
        

        if (
            document.body.dataset.page !==
            "home"
        ) {
            return;
        }


        initHeroAnimation();

        initTestimonialsSwiper();

        initCaseStudies();

        initCounters();

        initParallax();

        initCardDepth();

        initRobotDepth();

        initLabelLines();

        finalRefresh();


        doc.dispatchEvent(
            new CustomEvent(
                "home:ready"
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
