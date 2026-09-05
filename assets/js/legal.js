

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


    

    const isLegalPage = () => {
        return Boolean(
            qs(".legal-main") ||
            qs(".legal-hero")
        );
    };


    

    const initLegalHero = () => {
        const hero = qs(
            ".legal-hero"
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
            window.gsap.set(
                title,
                {
                    opacity: 0,
                    y: 42
                }
            );
        }

        if (text) {
            window.gsap.set(
                text,
                {
                    opacity: 0,
                    y: 22
                }
            );
        }

        if (actions) {
            window.gsap.set(
                actions,
                {
                    opacity: 0,
                    y: 18
                }
            );
        }

        if (word) {
            window.gsap.set(
                word,
                {
                    opacity: 0,
                    scale: 0.96
                }
            );
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
                    duration: 0.9
                },
                0.12
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
                0.44
            );
        }


        if (actions) {
            timeline.to(
                actions,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.66
                },
                0.56
            );
        }


        

        if (
            word &&
            window.ScrollTrigger
        ) {
            window.gsap.to(
                word,
                {
                    yPercent: 9,
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


    

    const initLegalNavigation = () => {
        const sidebar = qs(
            ".legal-sidebar"
        );

        if (!sidebar) {
            return;
        }


        const links = qsa(
            '.legal-sidebar__link[href^="#"]',
            sidebar
        );


        if (!links.length) {
            return;
        }


        const items = links
            .map((link) => {
                const href =
                    link.getAttribute("href");

                if (
                    !href ||
                    href === "#"
                ) {
                    return null;
                }


                const id = decodeURIComponent(
                    href.slice(1)
                );


                const section =
                    doc.getElementById(id);


                if (!section) {
                    return null;
                }


                return {
                    id,
                    link,
                    section
                };
            })
            .filter(Boolean);


        if (!items.length) {
            return;
        }


        let activeId = null;


        const setActive = (id) => {
            if (
                !id ||
                activeId === id
            ) {
                return;
            }


            activeId = id;


            items.forEach(
                (item) => {
                    const active =
                        item.id === id;


                    item.link.classList.toggle(
                        "is-active",
                        active
                    );


                    if (active) {
                        item.link.setAttribute(
                            "aria-current",
                            "location"
                        );
                    } else {
                        item.link.removeAttribute(
                            "aria-current"
                        );
                    }
                }
            );
        };


        

        if (window.location.hash) {
            const hashId =
                decodeURIComponent(
                    window.location.hash
                        .slice(1)
                );


            if (
                items.some(
                    (item) =>
                        item.id === hashId
                )
            ) {
                setActive(
                    hashId
                );
            }
        }


        

        let ticking = false;


        const updateActiveSection = () => {
            ticking = false;


            const header =
                qs(".site-header");


            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;


            const referenceLine =
                headerHeight + 90;


            let current =
                items[0];


            items.forEach(
                (item) => {
                    const rect =
                        item.section
                            .getBoundingClientRect();


                    if (
                        rect.top <=
                        referenceLine
                    ) {
                        current =
                            item;
                    }
                }
            );


            if (current) {
                setActive(
                    current.id
                );
            }
        };


        const requestUpdate = () => {
            if (ticking) {
                return;
            }


            ticking = true;


            window.requestAnimationFrame(
                updateActiveSection
            );
        };


        updateActiveSection();


        window.addEventListener(
            "scroll",
            requestUpdate,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            requestUpdate,
            {
                passive: true
            }
        );


        

        links.forEach(
            (link) => {
                link.addEventListener(
                    "click",
                    () => {
                        const href =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !href ||
                            href === "#"
                        ) {
                            return;
                        }


                        setActive(
                            decodeURIComponent(
                                href.slice(1)
                            )
                        );
                    }
                );
            }
        );
    };


    

    const initLegalPageNav = () => {
        const page =
            doc.body.dataset.page;


        if (!page) {
            return;
        }


        const fileMap = {
            privacy:
                "privacy.html",

            terms:
                "terms.html",

            cookies:
                "cookies.html"
        };


        const currentFile =
            fileMap[page];


        if (!currentFile) {
            return;
        }


        qsa(
            ".legal-page-nav__link"
        ).forEach(
            (link) => {
                const href =
                    link.getAttribute(
                        "href"
                    );


                if (!href) {
                    return;
                }


                const active =
                    href
                        .split("#")[0]
                        .endsWith(
                            currentFile
                        );


                if (active) {
                    link.setAttribute(
                        "aria-current",
                        "page"
                    );
                } else {
                    link.removeAttribute(
                        "aria-current"
                    );
                }
            }
        );
    };


    

    const initMobileTOC = () => {
        const nav = qs(
            ".legal-sidebar__nav"
        );


        if (!nav) {
            return;
        }


        const mobileQuery =
            window.matchMedia(
                "(max-width: 900px)"
            );


        const handleClick = (
            event
        ) => {
            if (!mobileQuery.matches) {
                return;
            }


            const link =
                event.target.closest(
                    ".legal-sidebar__link"
                );


            if (!link) {
                return;
            }


            window.setTimeout(
                () => {
                    link.scrollIntoView({
                        behavior:
                            prefersReducedMotion
                                ? "auto"
                                : "smooth",

                        block:
                            "nearest",

                        inline:
                            "center"
                    });
                },
                80
            );
        };


        nav.addEventListener(
            "click",
            handleClick
        );
    };


    

    const initLegalTables = () => {
        const wrappers = qsa(
            ".legal-table-wrap"
        );


        if (!wrappers.length) {
            return;
        }


        const update = () => {
            wrappers.forEach(
                (wrapper) => {
                    const overflow =
                        wrapper.scrollWidth >
                        wrapper.clientWidth +
                        2;


                    if (overflow) {
                        wrapper.setAttribute(
                            "tabindex",
                            "0"
                        );

                        wrapper.setAttribute(
                            "role",
                            "region"
                        );

                        if (
                            !wrapper.hasAttribute(
                                "aria-label"
                            )
                        ) {
                            wrapper.setAttribute(
                                "aria-label",
                                "Scrollable information table"
                            );
                        }
                    } else {
                        wrapper.removeAttribute(
                            "tabindex"
                        );

                        wrapper.removeAttribute(
                            "role"
                        );
                    }
                }
            );
        };


        update();


        let resizeTimer = null;


        window.addEventListener(
            "resize",
            () => {
                window.clearTimeout(
                    resizeTimer
                );


                resizeTimer =
                    window.setTimeout(
                        update,
                        120
                    );
            },
            {
                passive: true
            }
        );
    };


    

    const initHashSync = () => {
        window.addEventListener(
            "hashchange",
            () => {
                const id =
                    decodeURIComponent(
                        window.location.hash
                            .replace("#", "")
                    );


                if (!id) {
                    return;
                }


                const link =
                    qs(
                        `.legal-sidebar__link[href="#${CSS.escape(id)}"]`
                    );


                if (!link) {
                    return;
                }


                qsa(
                    ".legal-sidebar__link"
                ).forEach(
                    (item) => {
                        const active =
                            item === link;


                        item.classList.toggle(
                            "is-active",
                            active
                        );


                        if (active) {
                            item.setAttribute(
                                "aria-current",
                                "location"
                            );
                        } else {
                            item.removeAttribute(
                                "aria-current"
                            );
                        }
                    }
                );
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
        if (!isLegalPage()) {
            return;
        }


        initLegalHero();

        initLegalNavigation();

        initLegalPageNav();

        initMobileTOC();

        initLegalTables();

        initHashSync();

        finalRefresh();


        doc.dispatchEvent(
            new CustomEvent(
                "legal:ready"
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
