// similar to $(document).ready() from jquery
var domIsReady = (function (domIsReady) {
    var isBrowserIeOrNot = function () {
        return (!document.attachEvent || typeof document.attachEvent === "undefined" ? "not-ie" : "ie");
    }

    domIsReady = function (callback) {
        if (callback && typeof callback === "function") {
            if (isBrowserIeOrNot() !== "ie") {
                // DOM ready syntax for almost all browsers
                document.addEventListener("DOMContentLoaded", function () {
                    return callback();
                });
            } else {
                // DOM ready syntax for Internet Explorer
                document.attachEvent("onreadystatechange", function () {
                    if (document.readyState === "complete") {
                        return callback();
                    }
                });
            }
        } else {
            console.error("The callback is not a function!");
        }
    }
    return domIsReady;
})(domIsReady || {});

/****** END OF DOCUMENT READY FUNCTION ******/

/****** BEGINNING OF FUNCTIONS ******/

// style the nav acording to the pageYOffset
function navAppearance() {
    const nav = document.querySelector(".c-nav");
    if (window.pageYOffset > 40) {
        nav.style.background = "rgb(0, 0, 1)";
        nav.style.height = "65px";
    } else {
        nav.style.background = "transparent";
        nav.style.height = "90px";
    }
}

// set the x coordinates of the underline element in relation
// to the section the user is viewing
function translateUnderline(elemId, x1, x2) {
    const elem = document.getElementById(elemId);
    if (window.scrollY > elem.offsetTop - 250) {
        document.documentElement.style.setProperty("--x1", `${x1}px`);
        document.documentElement.style.setProperty("--x2", `${x2}px`);
    }
}

// set the underline position for every section
function underlinePosition() {
    translateUnderline("home", 0, 22);
    translateUnderline("features", 73, 95);
    translateUnderline("about", 145, 167);
    translateUnderline("testimonials", 229, 251);
    translateUnderline("pricing", 320, 342);
    translateUnderline("contact", 392, 414);
}

// select the element with the query selector and get it's top position relative to the viewport
function getElementY(query) {
    return window.pageYOffset + document.querySelector(query).getBoundingClientRect().top;
}

function scrollToElement(element, duration) {
    var startingY = window.pageYOffset;
    var elementY = getElementY(element);
    // If element is close to page's bottom then window will scroll only to some position above the element.
    var targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY;
    var diff = targetY - startingY - 65;
    // Easing function: easeInOutCubic
    // From: https://gist.github.com/gre/1650294
    var easing = function (t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    };
    var start;

    // exit the function if there is no difference
    if (!diff) return;

    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp;
        // Elapsed miliseconds since start of scrolling.
        var time = timestamp - start;
        // Get percent of completion in range [0, 1].
        var percent = Math.min(time / duration, 1);
        // Apply the easing.
        // It can cause bad-looking slow frames in browser performance tool, so be careful.
        percent = easing(percent);

        window.scrollTo(0, startingY + diff * percent);

        // Proceed with animation as long as we wanted it to.
        if (time < duration) {
            window.requestAnimationFrame(step);
        }
    });
}

function bindScrollFun(scrollLinks) {
    for (var i = 0; i < scrollLinks.length; i++) {
        (function (index) {
            var section = `${scrollLinks[index].children[0].hash}`;
            scrollLinks[i].onclick = function (event) {
                event.preventDefault();
                scrollToElement(section, 1000);
                // sideNavWidth("0px");
            }
        })(i);
    }
}

// assign the initial slideIndex
let slideIndex = 0;
const slide = document.getElementsByClassName("c-slider__slide");
const slideIcons = document.getElementsByClassName("c-slider__icon");

function showSlide(n) {
    var i;
    // hide all the slides
    for (i = 0; i < slide.length; i++) {
        slide[i].style.display = "none";
    }
    // remove the active effect for every slide
    for (i = 0; i < slideIcons.length; i++) {
        slideIcons[i].className = slideIcons[i].className.replace("c-slider__icon--active", "");
    }
    // reveal the slide with the "slideIndex" index(which is 0 on page load)
    slide[slideIndex].style.display = "flex";
    // stile the corresponding slider dot by adding the active class(which is 0 on page load)
    slideIcons[slideIndex].className += "c-slider__icon--active";
}

function currentSlide(n) {
    // The initial "slideIndex" is 0. By making it equal to "n" we can manipulate any slide we want
    showSlide(slideIndex = n);
}

function automaticSlideShow() {
    // reset the display and stile of all slides and icons
    for (var i = 0; i < slide.length; i++) {
        slide[i].style.display = "none";
    }
    for (i = 0; i < slideIcons.length; i++) {
        slideIcons[i].className = slideIcons[i].className.replace("c-slider__icon--active", "");
    }
    // display and style the according slide
    slide[slideIndex].style.display = "flex";
    slideIcons[slideIndex].className += "c-slider__icon--active";
    // increment the "slideIndex" and assign it to 0 if it is equal to the slide length
    slideIndex++;
    if (slideIndex == slide.length) {
        slideIndex = 0
    }
    // call this function every 15s
    setTimeout(automaticSlideShow, 15000);
}

/****** END OF FUNCTIONS ******/

/****** BEGINNING OF THE PROGRAM ******/

// set the nav appearance immediately after the page shows up
navAppearance();

// set the underline position immediately after the page shows up
underlinePosition();

// scroll to section on navLink click
const navLinks = document.querySelectorAll(".c-nav__link");
bindScrollFun(navLinks);

// on document ready
(function (document, window, domIsReady, undefined) {
    domIsReady(function () {

        // set trasition for nav underline on page ready
        document.documentElement.style.setProperty("--tr", ".1s linear");

        // get the index of each item in the node list to display the needed slide after click
        const slideDots = document.getElementsByClassName("c-slider__dots")[0];
        for (var i = 0; i < slideDots.children.length; i++) {
            (function (index) {
                // iterate through slideDots child elements
                slideDots.children[i].onclick = function () {
                    currentSlide(index);
                }
            })(i);
        }

        showSlide(slideIndex);
        automaticSlideShow();

        // hover effect on price plan when order button is hovered
        const orderButtons = document.getElementsByClassName("js-order-btn");
        for (var i = 0; i < orderButtons.length; i++) {
            var orderButton = orderButtons[i];
            // add hover effect on orderButton mouseover
            orderButton.onmouseover = function () {
                var grandParent = this.parentElement.parentElement;
                grandParent.children[0].classList.add("u-name-hov");
                grandParent.children[1].classList.add("u-price-hov");
            }
            // remove hover effect on orderButton mouseleave
            orderButton.onmouseleave = function () {
                var grandParent = this.parentElement.parentElement;
                grandParent.children[0].classList.remove("u-name-hov");
                grandParent.children[1].classList.remove("u-price-hov");
            }
        }

        window.onscroll = function () {
            navAppearance();
            underlinePosition();
        };

    });
})(document, window, domIsReady);
