

(() => {
    "use strict";


    

    const doc = document;
    const html = doc.documentElement;
    const body = doc.body;

    const config = window.SiteConfig || {};

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const MOBILE_BREAKPOINT = 1200;

    let menuOpen = false;
    let scrollLockPadding = 0;
    let refreshTimer = null;


    

    const qs = (selector, scope = doc) => {
        return scope.querySelector(selector);
    };


    const qsa = (selector, scope = doc) => {
        return Array.from(
            scope.querySelectorAll(selector)
        );
    };


    const safeText = (value) => {
        return typeof value === "string"
            ? value
            : "";
    };


    const getNestedValue = (object, path) => {
        if (!object || !path) {
            return undefined;
        }

        return path
            .split(".")
            .reduce((current, key) => {
                if (
                    current &&
                    Object.prototype.hasOwnProperty.call(
                        current,
                        key
                    )
                ) {
                    return current[key];
                }

                return undefined;
            }, object);
    };


    const formatConfigString = (value) => {
        if (typeof value !== "string") {
            return value;
        }

        return value.replace(
            /\{companyName\}/g,
            safeText(config.companyName)
        );
    };


    const applyTemplatePlaceholders = () => {
        if (!config.companyName || !body) {
            return;
        }

        const replaceAttribute = (element, attribute) => {
            const value = element.getAttribute(attribute);

            if (
                typeof value === "string" &&
                value.includes("{companyName}")
            ) {
                element.setAttribute(
                    attribute,
                    formatConfigString(value)
                );
            }
        };

        qsa("meta[content]").forEach((element) => {
            replaceAttribute(element, "content");
        });

        qsa("[aria-label], [title], [alt]").forEach((element) => {
            replaceAttribute(element, "aria-label");
            replaceAttribute(element, "title");
            replaceAttribute(element, "alt");
        });

        const walker = doc.createTreeWalker(
            body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const parent = node.parentElement;

                    if (
                        !parent ||
                        parent.closest("script, style")
                    ) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return node.nodeValue.includes("{companyName}")
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_SKIP;
                }
            }
        );

        let node = walker.nextNode();

        while (node) {
            node.nodeValue = formatConfigString(
                node.nodeValue
            );

            node = walker.nextNode();
        }
    };


    const getScrollbarWidth = () => {
        return Math.max(
            0,
            window.innerWidth -
            doc.documentElement.clientWidth
        );
    };


    const isModifiedClick = (event) => {
        return (
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
        );
    };


    const debounce = (callback, delay = 120) => {
        let timer;

        return (...args) => {
            window.clearTimeout(timer);

            timer = window.setTimeout(() => {
                callback(...args);
            }, delay);
        };
    };


    

    const requestRefresh = () => {
        window.clearTimeout(refreshTimer);

        refreshTimer = window.setTimeout(() => {
            if (
                window.ScrollTrigger &&
                typeof window.ScrollTrigger.refresh === "function"
            ) {
                window.ScrollTrigger.refresh();
            }

            if (
                window.AOS &&
                typeof window.AOS.refresh === "function"
            ) {
                window.AOS.refresh();
            }
        }, 90);
    };


    

    const applyConfigText = () => {
        qsa("[data-config-text], [data-config]").forEach((element) => {
            const path =
                element.getAttribute(
                    "data-config-text"
                ) ||
                element.getAttribute(
                    "data-config"
                );

            const value = getNestedValue(
                config,
                path
            );

            if (
                typeof value === "string" ||
                typeof value === "number"
            ) {
                element.textContent = String(
                    formatConfigString(value)
                );
            }
        });
    };


    const applyConfigAttribute = (
        selector,
        configAttribute,
        targetAttribute,
        transform = (value) => value
    ) => {
        qsa(selector).forEach((element) => {
            const path = element.getAttribute(
                configAttribute
            );

            const value = getNestedValue(
                config,
                path
            );

            if (
                typeof value !== "string" &&
                typeof value !== "number"
            ) {
                return;
            }

            const prefix =
                element.getAttribute(
                    "data-config-prefix"
                ) || "";

            const suffix =
                element.getAttribute(
                    "data-config-suffix"
                ) || "";

            element.setAttribute(
                targetAttribute,
                transform(
                    String(
                        formatConfigString(
                            `${prefix}${String(value)}${suffix}`
                        )
                    )
                )
            );
        });
    };


    const applyConfigImages = () => {
        applyConfigAttribute(
            "[data-config-src]",
            "data-config-src",
            "src"
        );

        if (config.logo) {
            qsa("[data-config-logo]").forEach((image) => {
                image.src = config.logo;
            });
        }

        if (config.favicon) {
            qsa("[data-config-favicon]").forEach((link) => {
                link.href = config.favicon;
            });

            qsa('link[rel~="icon"]').forEach((link) => {
                link.href = config.favicon;
            });
        }
    };


    const applyConfigLinks = () => {
        applyConfigAttribute(
            "[data-config-href]",
            "data-config-href",
            "href",
            (value) => {
                if (
                    value.includes("@") &&
                    !value.startsWith("mailto:")
                ) {
                    return `mailto:${value}`;
                }

                return value;
            }
        );

        applyConfigAttribute(
            "[data-config-value]",
            "data-config-value",
            "value"
        );
    };


    const applyConfigAriaLabels = () => {
        applyConfigAttribute(
            "[data-config-aria-label]",
            "data-config-aria-label",
            "aria-label"
        );
    };


    const applyConfigEmail = () => {
        if (!config.email) {
            return;
        }

        qsa("[data-config-email-link]").forEach((link) => {
            link.href = `mailto:${config.email}`;

            const textNode = qs(
                '[data-config-text="email"]',
                link
            );

            if (textNode) {
                textNode.textContent = config.email;
            } else if (!link.children.length) {
                link.textContent = config.email;
            }
        });
    };


    

    const getCurrentPageTitleKey = () => {
        const page = body.dataset.page || "home";

        const map = {
            home: "home",

            "google-ads":
                "googleAds",

            "google-ads-management":
                "googleAds",

            "lead-generation":
                "leadGeneration",

            ecommerce:
                "ecommerce",

            "ecommerce-advertising":
                "ecommerce",

            tracking:
                "trackingAutomation",

            "tracking-automation":
                "trackingAutomation",

            privacy:
                "privacy",

            terms:
                "terms",

            cookies:
                "cookies"
        };

        return map[page] || page;
    };


    const applyDocumentTitle = () => {
        if (!config.pageTitles) {
            return;
        }

        const pageKey = getCurrentPageTitleKey();

        const pageTitle =
            config.pageTitles[pageKey];

        if (!pageTitle) {
            return;
        }

        doc.title =
            formatConfigString(pageTitle);
    };


    const applyMetaDescription = () => {
        if (!config.metaDescription) {
            return;
        }

        let meta = qs(
            'meta[name="description"]'
        );

        if (!meta) {
            meta = doc.createElement("meta");

            meta.setAttribute(
                "name",
                "description"
            );

            doc.head.appendChild(meta);
        }

        meta.setAttribute(
            "content",
            config.metaDescription
        );
    };


    const applyCurrentYear = () => {
        const year =
            new Date().getFullYear();

        qsa("[data-current-year]").forEach(
            (element) => {
                element.textContent = year;
            }
        );
    };


    const hydrateSiteConfig = () => {
        applyConfigText();
        applyConfigLinks();
        applyConfigImages();
        applyConfigAriaLabels();
        applyConfigEmail();
        applyTemplatePlaceholders();
        applyDocumentTitle();
        applyMetaDescription();
        applyCurrentYear();
    };


    

    const initLucide = () => {
        if (
            !window.lucide ||
            typeof window.lucide.createIcons !==
                "function"
        ) {
            return;
        }

        window.lucide.createIcons({
            attrs: {
                "aria-hidden": "true"
            }
        });
    };


    

    const initHeader = () => {
        const header = qs(
            ".site-header"
        );

        if (!header) {
            return;
        }

        let ticking = false;

        const updateHeader = () => {
            const scrolled =
                window.scrollY > 16;

            header.classList.toggle(
                "is-scrolled",
                scrolled
            );

            ticking = false;
        };


        const requestHeaderUpdate = () => {
            if (ticking) {
                return;
            }

            ticking = true;

            window.requestAnimationFrame(
                updateHeader
            );
        };


        updateHeader();

        window.addEventListener(
            "scroll",
            requestHeaderUpdate,
            {
                passive: true
            }
        );
    };


    

    const initMobileMenu = () => {
        const toggle = qs(
            "[data-menu-toggle]"
        );

        const menu = qs(
            "[data-mobile-menu]"
        );

        if (!toggle || !menu) {
            return;
        }


        const lockBody = () => {
            scrollLockPadding =
                getScrollbarWidth();

            if (scrollLockPadding > 0) {
                body.style.paddingRight =
                    `${scrollLockPadding}px`;
            }

            body.classList.add(
                "menu-open"
            );
        };


        const unlockBody = () => {
            body.classList.remove(
                "menu-open"
            );

            body.style.paddingRight = "";

            scrollLockPadding = 0;
        };


        const openMenu = () => {
            if (menuOpen) {
                return;
            }

            menuOpen = true;

            toggle.classList.add(
                "is-active"
            );

            menu.classList.add(
                "is-open"
            );

            toggle.setAttribute(
                "aria-expanded",
                "true"
            );

            toggle.setAttribute(
                "aria-label",
                "Close menu"
            );

            menu.setAttribute(
                "aria-hidden",
                "false"
            );

            lockBody();


            const firstLink = qs(
                "a, button",
                menu
            );

            window.setTimeout(() => {
                if (firstLink) {
                    firstLink.focus({
                        preventScroll: true
                    });
                }
            }, 80);
        };


        const closeMenu = ({
            returnFocus = false
        } = {}) => {
            if (!menuOpen) {
                return;
            }

            menuOpen = false;

            toggle.classList.remove(
                "is-active"
            );

            menu.classList.remove(
                "is-open"
            );

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

            toggle.setAttribute(
                "aria-label",
                "Open menu"
            );

            menu.setAttribute(
                "aria-hidden",
                "true"
            );

            unlockBody();

            if (returnFocus) {
                toggle.focus({
                    preventScroll: true
                });
            }
        };


        toggle.addEventListener(
            "click",
            () => {
                if (menuOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }
            }
        );


        menu.addEventListener(
            "click",
            (event) => {
                const link =
                    event.target.closest("a");

                if (!link) {
                    return;
                }

                closeMenu();
            }
        );


        doc.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Escape" &&
                    menuOpen
                ) {
                    closeMenu({
                        returnFocus: true
                    });
                }
            }
        );


        const handleResize = debounce(() => {
            if (
                window.innerWidth >
                    MOBILE_BREAKPOINT &&
                menuOpen
            ) {
                closeMenu();
            }
        }, 120);


        window.addEventListener(
            "resize",
            handleResize,
            {
                passive: true
            }
        );


        

        menu.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key !== "Tab" ||
                    !menuOpen
                ) {
                    return;
                }

                const focusable = qsa(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
                    menu
                ).filter((element) => {
                    return (
                        element.offsetParent !==
                        null
                    );
                });

                if (!focusable.length) {
                    return;
                }

                const first =
                    focusable[0];

                const last =
                    focusable[
                        focusable.length - 1
                    ];

                if (
                    event.shiftKey &&
                    doc.activeElement === first
                ) {
                    event.preventDefault();
                    last.focus();
                } else if (
                    !event.shiftKey &&
                    doc.activeElement === last
                ) {
                    event.preventDefault();
                    first.focus();
                }
            }
        );


        window.SiteUI =
            window.SiteUI || {};

        window.SiteUI.openMenu =
            openMenu;

        window.SiteUI.closeMenu =
            closeMenu;
    };


    

    const initAnchors = () => {
        doc.addEventListener(
            "click",
            (event) => {
                const anchor =
                    event.target.closest(
                        'a[href*="#"]'
                    );

                if (!anchor) {
                    return;
                }

                if (
                    isModifiedClick(event) ||
                    anchor.target === "_blank"
                ) {
                    return;
                }

                const rawHref =
                    anchor.getAttribute("href");

                if (
                    !rawHref ||
                    rawHref === "#" ||
                    rawHref.startsWith(
                        "javascript:"
                    )
                ) {
                    return;
                }

                let url;

                try {
                    url = new URL(
                        rawHref,
                        window.location.href
                    );
                } catch {
                    return;
                }

                const currentPath =
                    window.location.pathname
                        .replace(/\/+$/, "");

                const targetPath =
                    url.pathname
                        .replace(/\/+$/, "");

                if (
                    url.origin !==
                        window.location.origin ||
                    targetPath !== currentPath ||
                    !url.hash
                ) {
                    return;
                }

                const id = decodeURIComponent(
                    url.hash.slice(1)
                );

                if (!id) {
                    return;
                }

                const target =
                    doc.getElementById(id);

                if (!target) {
                    return;
                }

                event.preventDefault();


                if (
                    window.SiteUI &&
                    typeof window.SiteUI
                        .closeMenu === "function"
                ) {
                    window.SiteUI.closeMenu();
                }


                target.scrollIntoView({
                    behavior:
                        prefersReducedMotion
                            ? "auto"
                            : "smooth",

                    block: "start"
                });


                if (
                    window.history &&
                    typeof window.history
                        .pushState ===
                        "function"
                ) {
                    window.history.pushState(
                        null,
                        "",
                        `#${id}`
                    );
                }
            }
        );
    };


    

    const initActiveNavigation = () => {
        const page =
            body.dataset.page;

        if (!page) {
            return;
        }

        const pathname =
            window.location.pathname
                .split("/")
                .pop() || "index.html";

        qsa(
            ".site-nav__link, .mobile-menu__link, .site-footer__nav a"
        ).forEach((link) => {
            const href =
                link.getAttribute("href");

            if (!href) {
                return;
            }

            let linkPath;

            try {
                linkPath =
                    new URL(
                        href,
                        window.location.href
                    )
                        .pathname
                        .split("/")
                        .pop();
            } catch {
                return;
            }

            const isCurrent =
                linkPath &&
                linkPath === pathname &&
                !href.includes("#");

            link.classList.toggle(
                "is-active",
                Boolean(isCurrent)
            );

            if (isCurrent) {
                link.setAttribute(
                    "aria-current",
                    "page"
                );
            } else {
                link.removeAttribute(
                    "aria-current"
                );
            }
        });
    };


    

    const initAccordions = () => {
        qsa("[data-accordion]").forEach(
            (accordion, accordionIndex) => {

                const items = qsa(
                    ".accordion-item",
                    accordion
                );

                const allowMultiple =
                    accordion.hasAttribute(
                        "data-accordion-multiple"
                    );


                items.forEach(
                    (item, itemIndex) => {

                        const trigger = qs(
                            ".accordion-trigger",
                            item
                        );

                        const content = qs(
                            ".accordion-content",
                            item
                        );

                        if (
                            !trigger ||
                            !content
                        ) {
                            return;
                        }


                        const triggerId =
                            trigger.id ||
                            `accordion-trigger-${accordionIndex}-${itemIndex}`;

                        const contentId =
                            content.id ||
                            `accordion-content-${accordionIndex}-${itemIndex}`;


                        trigger.id =
                            triggerId;

                        content.id =
                            contentId;


                        trigger.setAttribute(
                            "aria-controls",
                            contentId
                        );

                        content.setAttribute(
                            "aria-labelledby",
                            triggerId
                        );


                        const initiallyOpen =
                            item.classList.contains(
                                "is-open"
                            );

                        trigger.setAttribute(
                            "aria-expanded",
                            String(
                                initiallyOpen
                            )
                        );


                        const closeItem = () => {
                            item.classList.remove(
                                "is-open"
                            );

                            trigger.setAttribute(
                                "aria-expanded",
                                "false"
                            );
                        };


                        const openItem = () => {
                            if (!allowMultiple) {
                                items.forEach(
                                    (otherItem) => {
                                        if (
                                            otherItem ===
                                            item
                                        ) {
                                            return;
                                        }

                                        otherItem.classList.remove(
                                            "is-open"
                                        );

                                        const otherTrigger =
                                            qs(
                                                ".accordion-trigger",
                                                otherItem
                                            );

                                        if (
                                            otherTrigger
                                        ) {
                                            otherTrigger.setAttribute(
                                                "aria-expanded",
                                                "false"
                                            );
                                        }
                                    }
                                );
                            }

                            item.classList.add(
                                "is-open"
                            );

                            trigger.setAttribute(
                                "aria-expanded",
                                "true"
                            );
                        };


                        trigger.addEventListener(
                            "click",
                            () => {
                                const isOpen =
                                    item.classList.contains(
                                        "is-open"
                                    );

                                if (isOpen) {
                                    closeItem();
                                } else {
                                    openItem();
                                }

                                requestRefresh();
                            }
                        );
                    }
                );
            }
        );
    };


    

    const initCookieConsent = () => {
        const consent = qs(
            "[data-cookie-consent]"
        );

        if (!consent) {
            return;
        }

        const acceptButton = qs(
            "[data-cookie-accept]",
            consent
        );

        const declineButton = qs(
            "[data-cookie-decline]",
            consent
        );

        const storageKey =
            config.cookies?.storageKey ||
            "site_cookie_consent";


        const getChoice = () => {
            try {
                return window.localStorage.getItem(
                    storageKey
                );
            } catch {
                return null;
            }
        };


        const setChoice = (choice) => {
            try {
                window.localStorage.setItem(
                    storageKey,
                    choice
                );
            } catch {
                
            }
        };


        const showConsent = () => {
            consent.classList.add(
                "is-visible"
            );
        };


        const hideConsent = () => {
            consent.classList.remove(
                "is-visible"
            );
        };


        const storedChoice =
            getChoice();


        if (
            storedChoice !== "accepted" &&
            storedChoice !== "declined"
        ) {
            window.setTimeout(
                showConsent,
                prefersReducedMotion
                    ? 0
                    : 550
            );
        }


        if (acceptButton) {
            acceptButton.addEventListener(
                "click",
                () => {
                    setChoice(
                        "accepted"
                    );

                    hideConsent();


                    doc.dispatchEvent(
                        new CustomEvent(
                            "site:cookiesAccepted"
                        )
                    );
                }
            );
        }


        if (declineButton) {
            declineButton.addEventListener(
                "click",
                () => {
                    setChoice(
                        "declined"
                    );

                    hideConsent();


                    doc.dispatchEvent(
                        new CustomEvent(
                            "site:cookiesDeclined"
                        )
                    );
                }
            );
        }


        window.SiteUI =
            window.SiteUI || {};

        window.SiteUI.resetCookieConsent =
            () => {
                try {
                    window.localStorage.removeItem(
                        storageKey
                    );
                } catch {
                    
                }

                showConsent();
            };
    };


    

    const initContactForms = () => {
        qsa("[data-contact-form]").forEach(
            (form) => {

                const status = qs(
                    "[data-form-status]",
                    form
                ) || qs(
                    "[data-form-status]",
                    form.parentElement
                );

                const submitButton = qs(
                    '[type="submit"]',
                    form
                );

                let isSubmitting = false;


                const showStatus = (
                    message,
                    type
                ) => {
                    if (!status) {
                        return;
                    }

                    status.textContent =
                        message;

                    status.classList.remove(
                        "is-success",
                        "is-error"
                    );

                    status.classList.add(
                        "is-visible",
                        type === "success"
                            ? "is-success"
                            : "is-error"
                    );
                };


                const clearStatus = () => {
                    if (!status) {
                        return;
                    }

                    status.classList.remove(
                        "is-visible",
                        "is-success",
                        "is-error"
                    );

                    status.textContent = "";
                };


                form.addEventListener(
                    "input",
                    clearStatus
                );


                form.addEventListener(
                    "submit",
                    async (event) => {
                        event.preventDefault();

                        if (isSubmitting) {
                            return;
                        }


                        if (
                            !form.checkValidity()
                        ) {
                            form.reportValidity();
                            return;
                        }


                        const endpoint =
                            form.getAttribute(
                                "action"
                            ) ||
                            config.contactEndpoint ||
                            "contact.php";


                        const originalButtonText =
                            submitButton
                                ? submitButton.textContent
                                : "";


                        if (submitButton) {
                            submitButton.disabled =
                                true;

                            submitButton.setAttribute(
                                "aria-busy",
                                "true"
                            );

                            submitButton.textContent =
                                "Sending...";
                        }


                        isSubmitting = true;


                        clearStatus();


                        try {
                            const response =
                                await fetch(
                                    endpoint,
                                    {
                                        method: "POST",

                                        body:
                                            new FormData(
                                                form
                                            ),

                                        headers: {
                                            "X-Requested-With":
                                                "XMLHttpRequest",

                                            Accept:
                                                "application/json"
                                        }
                                    }
                                );


                            const rawText =
                                await response.text();


                            let result = null;

                            try {
                                result =
                                    JSON.parse(
                                        rawText
                                    );
                            } catch {
                                result = null;
                            }


                            if (!response.ok) {
                                const message =
                                    result?.message ||
                                    "Something went wrong. Please try again.";

                                throw new Error(
                                    message
                                );
                            }


                            if (
                                !result ||
                                result.success !== true
                            ) {
                                throw new Error(
                                    result?.message ||
                                    "Something went wrong. Please try again."
                                );
                            }


                            const message =
                                config.contactSuccessMessage ||
                                result?.message ||
                                "Successfully sent!";


                            showStatus(
                                message,
                                "success"
                            );


                            form.reset();


                            doc.dispatchEvent(
                                new CustomEvent(
                                    "site:formSuccess",
                                    {
                                        detail: {
                                            form
                                        }
                                    }
                                )
                            );

                        } catch (error) {
                            showStatus(
                                error?.message ||
                                "Something went wrong. Please try again.",
                                "error"
                            );

                        } finally {
                            isSubmitting = false;

                            if (submitButton) {
                                submitButton.disabled =
                                    false;

                                submitButton.removeAttribute(
                                    "aria-busy"
                                );

                                submitButton.textContent =
                                    originalButtonText;
                            }
                        }
                    }
                );
            }
        );
    };


    

    const initAOS = () => {
        if (
            prefersReducedMotion ||
            !window.AOS ||
            typeof window.AOS.init !==
                "function"
        ) {
            return;
        }


        

        html.classList.add(
            "aos-enabled"
        );


        window.AOS.init({
            once: true,

            mirror: false,

            offset: 45,

            duration: 620,

            delay: 0,

            easing:
                "ease-out-cubic",

            anchorPlacement:
                "top-bottom",

            disableMutationObserver:
                false
        });


        

        window.setTimeout(() => {
            if (
                typeof window.AOS.refreshHard ===
                "function"
            ) {
                window.AOS.refreshHard();
            }
        }, 250);
    };


    

    const initGSAP = () => {
        if (!window.gsap) {
            return;
        }

        if (window.ScrollTrigger) {
            window.gsap.registerPlugin(
                window.ScrollTrigger
            );


            

            window.ScrollTrigger.config({
                ignoreMobileResize: true
            });
        }
    };


    

    const initImageRefresh = () => {
        const images = qsa(
            "img"
        ).filter((image) => {
            return !image.complete;
        });

        if (!images.length) {
            return;
        }

        let remaining =
            images.length;


        const onSettled = () => {
            remaining -= 1;

            if (remaining <= 0) {
                requestRefresh();
            }
        };


        images.forEach((image) => {
            image.addEventListener(
                "load",
                onSettled,
                {
                    once: true
                }
            );

            image.addEventListener(
                "error",
                onSettled,
                {
                    once: true
                }
            );
        });
    };


    

    const initResizeHandler = () => {
        let lastWidth =
            window.innerWidth;


        const onResize = debounce(() => {
            const currentWidth =
                window.innerWidth;


            

            if (
                Math.abs(
                    currentWidth -
                    lastWidth
                ) < 2
            ) {
                return;
            }


            lastWidth =
                currentWidth;

            requestRefresh();
        }, 180);


        window.addEventListener(
            "resize",
            onResize,
            {
                passive: true
            }
        );
    };


    

    const handleInitialHash = () => {
        if (!window.location.hash) {
            return;
        }

        const id = decodeURIComponent(
            window.location.hash.slice(1)
        );

        const target =
            doc.getElementById(id);

        if (!target) {
            return;
        }


        

        window.setTimeout(() => {
            target.scrollIntoView({
                behavior: "auto",
                block: "start"
            });
        }, 90);
    };


    

    const exposePublicAPI = () => {
        window.SiteUI =
            window.SiteUI || {};


        window.SiteUI.config =
            config;

        window.SiteUI.refresh =
            requestRefresh;

        window.SiteUI.rebuildIcons =
            initLucide;

        window.SiteUI.prefersReducedMotion =
            prefersReducedMotion;
    };


    

    const init = () => {
        hydrateSiteConfig();

        initGSAP();

        initHeader();

        initMobileMenu();

        initAnchors();

        initActiveNavigation();

        initAccordions();

        initCookieConsent();

        initContactForms();

        initLucide();

        initAOS();

        initImageRefresh();

        initResizeHandler();

        exposePublicAPI();

        handleInitialHash();


        html.classList.add(
            "site-ready"
        );


        doc.dispatchEvent(
            new CustomEvent(
                "site:ready"
            )
        );
    };


    

    if (
        doc.readyState === "loading"
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
