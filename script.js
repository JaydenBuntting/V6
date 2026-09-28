document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
).matches;


/* =========================================================
   POP-UP ANIMATIONS
   ========================================================= */

const popElements = document.querySelectorAll('.pop');

if ('IntersectionObserver' in window) {

    const popObserver = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add('in');

                    popObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2
        }
    );

    popElements.forEach(function (element) {
        popObserver.observe(element);
    });

} else {

    popElements.forEach(function (element) {
        element.classList.add('in');
    });
}


/* =========================================================
   FEEDBACK FORM
   ========================================================= */

const feedbackForm = document.getElementById('feedback');

if (feedbackForm) {

    feedbackForm.addEventListener(
        'submit',
        function (event) {

            event.preventDefault();

            feedbackForm.style.display = 'none';

            const thanks = document.getElementById('thanks');

            if (thanks) {
                thanks.style.display = 'block';
            }
        }
    );
}


/* =========================================================
   SUBJECT PAGE DROPDOWNS
   =========================================================

   IMPORTANT:

   These are ONLY for subjects.html.

   They deliberately use the existing `.level`
   class and have nothing to do with the 91164
   lesson system.
   */

const subjectLevels = document.querySelectorAll('.level');

subjectLevels.forEach(function (levelButton) {

    levelButton.addEventListener(
        'click',
        function () {

            levelButton.classList.toggle('open');

            const content =
                levelButton.nextElementSibling;

            if (!content) {
                return;
            }

            if (levelButton.classList.contains('open')) {

                content.style.maxHeight =
                    content.scrollHeight + 'px';

            } else {

                content.style.maxHeight = '0px';
            }
        }
    );
});


/* =========================================================
   91164 LESSON SYSTEM
   =========================================================

   Structure:

   91164 OVERVIEW
       |
       |-- Lesson 1
       |-- Lesson 2
       |-- Lesson 3
       |-- Lesson 4
       |-- Lesson 5
       |
       +-- Past Papers
       +-- Resources


   When a lesson is opened:

       TOP BAR
       -------------------------
       91164 / Lesson / Part
       -------------------------

       SLIDE
       -------------------------
       Content
       -------------------------

       BOTTOM NAV
       -------------------------
       Previous        Next
       -------------------------


   Each lesson contains exactly:

       1. Content
       2. Example Walk-through
       3. Practice

   ========================================================= */


/* ---------------------------------------------------------
   Main elements
   --------------------------------------------------------- */

const standardOverview =
    document.getElementById('standardOverview');

const lessonMode =
    document.getElementById('lessonMode');

const lessonCards =
    document.querySelectorAll('.lesson-card');

const lessonInstances =
    document.querySelectorAll('.lesson-instance');


/* ---------------------------------------------------------
   Navigation controls
   --------------------------------------------------------- */

const backToStandard =
    document.getElementById('backToStandard');

const previousLessonSlide =
    document.getElementById('previousLessonSlide');

const nextLessonSlide =
    document.getElementById('nextLessonSlide');


/* ---------------------------------------------------------
   Lesson information
   --------------------------------------------------------- */

const lessonTitle =
    document.getElementById('lessonTitle');

const lessonNumber =
    document.getElementById('lessonNumber');

const lessonTotal =
    document.getElementById('lessonTotal');

const currentPart =
    document.getElementById('currentPart');

const totalParts =
    document.getElementById('totalParts');

const partTitle =
    document.getElementById('partTitle');


/* ---------------------------------------------------------
   Lesson names

   These should correspond to the order of
   `.lesson-instance` elements in 91164.html.
   --------------------------------------------------------- */

const lessonNames = [
    'Lewis Structures',
    'Covalent Bonding',
    'Metallic Bonding',
    'Structure & Properties',
    'Energy Changes'
];


/* ---------------------------------------------------------
   Current position
   --------------------------------------------------------- */

let activeLesson = 0;
let activePart = 0;

let suppressHashHandling = false;

function updateHash() {

    suppressHashHandling = true; // this write will fire hashchange; ignore that one

    if (lessonMode && lessonMode.classList.contains('active')) {

        window.location.hash = 'l' + activeLesson + '-p' + activePart;

    } else {

        history.replaceState(
            null, '',
            window.location.pathname + window.location.search
        );
    }
}


/* =========================================================
   SHOW 91164 OVERVIEW
   ========================================================= */
function showStandardOverview() {

    if (!standardOverview || !lessonMode) {
        return;
    }


    /*
        Show overview
    */

    standardOverview.classList.add('active');


    /*
        Hide lesson reader
    */

    lessonMode.classList.remove('active');

    lessonMode.setAttribute(
        'aria-hidden',
        'true'
    );


    /*
        Return page to normal scrolling
    */

    document.body.classList.remove('lesson-reading');

    document.documentElement.classList.remove('lesson-reading');


    /*
        Return focus to overview where possible
    */

    if (document.activeElement &&
        typeof document.activeElement.blur === 'function') {

        document.activeElement.blur();
    }


    /*
        Clear the lesson position from the URL
    */

    updateHash();

}


/* =========================================================
   OPEN LESSON
   ========================================================= */

function openLesson(lessonIndex, partIndex = 0, options = {}) {

    if (!standardOverview || !lessonMode) {
        return;
    }

    const { skipHashUpdate = false } = options;

    activeLesson = lessonIndex;
    activePart = partIndex;

    standardOverview.classList.remove('active');

    lessonMode.classList.add('active');
    lessonMode.setAttribute('aria-hidden', 'false');

    document.body.classList.add('lesson-reading');
    document.documentElement.classList.add('lesson-reading');

    lessonInstances.forEach(function (lesson) {
        lesson.classList.remove('active');
    });

    const selectedLesson = document.querySelector(
        '.lesson-instance[data-lesson="' + activeLesson + '"]'
    );

    if (!selectedLesson) {
        return;
    }

    selectedLesson.classList.add('active');

    const slides = selectedLesson.querySelectorAll('.lesson-slide');

    slides.forEach(function (slide) {
        slide.classList.remove('active');
    });

    const targetSlide = slides[activePart] || slides[0];

    if (targetSlide) {
        targetSlide.classList.add('active');
    }

    updateLessonInterface();

    if (!skipHashUpdate) {
        updateHash();
    }

    window.scrollTo({
        top: 0,
        behavior: reduceMotion ? 'auto' : 'smooth'
    });
}


/* =========================================================
   UPDATE LESSON INTERFACE
   ========================================================= */

function updateLessonInterface() {

    const selectedLesson =
        document.querySelector(
            '.lesson-instance[data-lesson="' +
            activeLesson +
            '"]'
        );


    if (!selectedLesson) {
        return;
    }


    const slides =
        selectedLesson.querySelectorAll(
            '.lesson-slide'
        );


    const total =
        slides.length;


    /* -----------------------------------------------------
       Lesson title
       ----------------------------------------------------- */

    if (lessonTitle) {

        lessonTitle.textContent =
            lessonNames[activeLesson] ||
            'Lesson ' + (activeLesson + 1);
    }


    /* -----------------------------------------------------
       Lesson number
       ----------------------------------------------------- */

    if (lessonNumber) {

        lessonNumber.textContent =
            String(activeLesson + 1).padStart(2, '0');
    }


    /* -----------------------------------------------------
       Total lessons
       ----------------------------------------------------- */

    if (lessonTotal) {

        lessonTotal.textContent =
            String(lessonInstances.length).padStart(2, '0');
    }


    /* -----------------------------------------------------
       Current part
       ----------------------------------------------------- */

    if (currentPart) {

        currentPart.textContent =
            String(activePart + 1).padStart(2, '0');
    }


    /* -----------------------------------------------------
       Total parts
       ----------------------------------------------------- */

    if (totalParts) {

        totalParts.textContent =
            String(total).padStart(2, '0');
    }


    /* -----------------------------------------------------
       Current part title

       Reads the data-part-title attribute from
       the active slide.
       ----------------------------------------------------- */

    if (partTitle && slides[activePart]) {

        partTitle.textContent =
            slides[activePart].dataset.partTitle ||
            '';
    }


    /* -----------------------------------------------------
       Previous button
       ----------------------------------------------------- */

    if (previousLessonSlide) {

        previousLessonSlide.disabled =
            activeLesson === 0 &&
            activePart === 0;
    }


    /* -----------------------------------------------------
       Next button
       ----------------------------------------------------- */

    if (nextLessonSlide) {

        nextLessonSlide.disabled =
            activeLesson === lessonInstances.length - 1 &&
            activePart === total - 1;
    }
}


/* =========================================================
   SHOW SPECIFIC SLIDE
   ========================================================= */

function showPart(partIndex) {

    const selectedLesson =
        document.querySelector(
            '.lesson-instance[data-lesson="' +
            activeLesson +
            '"]'
        );


    if (!selectedLesson) {
        return;
    }


    const slides =
        selectedLesson.querySelectorAll(
            '.lesson-slide'
        );


    /*
        Prevent invalid slide numbers
    */

    if (
        partIndex < 0 ||
        partIndex >= slides.length
    ) {
        return;
    }


    /*
        Hide every slide
    */

    slides.forEach(function (slide) {

        slide.classList.remove('active');

    });


    /*
        Show requested slide
    */

    slides[partIndex].classList.add('active');


    /*
        Update position
    */

    activePart = partIndex;


    /*
        Update header / navigation
    */

    updateLessonInterface();


    /*
        Keep viewport at the top.

        This is important.

        We DON'T want the browser to scroll down
        when changing slides.
    */

    updateHash();

    window.scrollTo({
        top: 0,
        behavior: reduceMotion ? 'auto' : 'smooth'
    });

}


/* =========================================================
   NEXT
   ========================================================= */

function goNext() {

    const selectedLesson =
        document.querySelector(
            '.lesson-instance[data-lesson="' +
            activeLesson +
            '"]'
        );


    if (!selectedLesson) {
        return;
    }


    const slides =
        selectedLesson.querySelectorAll(
            '.lesson-slide'
        );


    /*
        First move through the three lesson parts.
    */

    if (activePart < slides.length - 1) {

        showPart(activePart + 1);

        return;
    }


    /*
        Once Practice is finished,
        move to the next lesson.
    */

    if (activeLesson < lessonInstances.length - 1) {

        openLesson(activeLesson + 1);
    }
}


/* =========================================================
   PREVIOUS
   ========================================================= */

function goPrevious() {

    /*
        Move backwards through the current lesson.
    */

    if (activePart > 0) {

        showPart(activePart - 1);

        return;
    }


    /*
        If we're at the first part,
        move to the previous lesson.
    */

    if (activeLesson > 0) {

        const previousLessonIndex =
            activeLesson - 1;


        const previousLesson =
            document.querySelector(
                '.lesson-instance[data-lesson="' +
                previousLessonIndex +
                '"]'
            );


        if (!previousLesson) {
            return;
        }


        activeLesson =
            previousLessonIndex;


        /*
            Get previous lesson slides
        */

        const slides =
            previousLesson.querySelectorAll(
                '.lesson-slide'
            );


        /*
            Start on the final part of
            the previous lesson.
        */

        activePart =
            slides.length - 1;


        /*
            Hide all lesson instances
        */

        lessonInstances.forEach(function (lesson) {

            lesson.classList.remove('active');

        });


        /*
            Show previous lesson
        */

        previousLesson.classList.add('active');


        /*
            Hide all its slides
        */

        slides.forEach(function (slide) {

            slide.classList.remove('active');

        });


        /*
            Show final slide
        */

        if (slides[activePart]) {

            slides[activePart].classList.add('active');
        }


        updateLessonInterface();


        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? 'auto' : 'smooth'
        });
    }
}


/* =========================================================
   LESSON CARD CLICK
   ========================================================= */

lessonCards.forEach(function (card) {

    card.addEventListener(
        'click',
        function () {

            const lessonIndex =
                Number(card.dataset.lesson);

            if (Number.isNaN(lessonIndex)) {
                return;
            }

            openLesson(lessonIndex);
        }
    );
});


/* =========================================================
   BACK TO 91164
   ========================================================= */

if (backToStandard) {

    backToStandard.addEventListener(
        'click',
        function () {

            showStandardOverview();
        }
    );
}


/* =========================================================
   NEXT BUTTON
   ========================================================= */

if (nextLessonSlide) {

    nextLessonSlide.addEventListener(
        'click',
        function () {

            goNext();
        }
    );
}


/* =========================================================
   PREVIOUS BUTTON
   ========================================================= */

if (previousLessonSlide) {

    previousLessonSlide.addEventListener(
        'click',
        function () {

            goPrevious();
        }
    );
}


/* =========================================================
   KEYBOARD NAVIGATION
   ========================================================= */

document.addEventListener(
    'keydown',
    function (event) {

        /*
            Only respond while lesson reader
            is actually open.
        */

        if (
            !lessonMode ||
            !lessonMode.classList.contains('active')
        ) {
            return;
        }


        /*
            Don't hijack keyboard input fields.
        */

        const tag =
            event.target.tagName.toLowerCase();


        if (
            tag === 'input' ||
            tag === 'textarea' ||
            tag === 'select'
        ) {
            return;
        }


        /*
            Right arrow = next
        */

        if (event.key === 'ArrowRight') {

            event.preventDefault();

            goNext();
        }


        /*
            Left arrow = previous
        */

        if (event.key === 'ArrowLeft') {

            event.preventDefault();

            goPrevious();
        }


        /*
            Escape = return to overview
        */

        if (event.key === 'Escape') {

            event.preventDefault();

            showStandardOverview();
        }
    }
);


/* =========================================================
   INITIAL STATE
   ========================================================= */

function restoreFromHash() {

    if (suppressHashHandling) {
        suppressHashHandling = false;
        return;
    }

    if (!standardOverview || !lessonMode) {
        return;
    }

    const match = window.location.hash.match(/^#l(\d+)-p(\d+)$/);

    if (match) {

        const lessonIndex = Number(match[1]);
        const partIndex = Number(match[2]);

        openLesson(lessonIndex, partIndex, { skipHashUpdate: true });

    } else {

        showStandardOverview();
    }
}

restoreFromHash();

window.addEventListener('hashchange', restoreFromHash);


function updateHash() {

    if (lessonMode && lessonMode.classList.contains('active')) {

        window.location.hash = 'l' + activeLesson + '-p' + activePart;

    } else {

        history.replaceState(
            null, '',
            window.location.pathname + window.location.search
        );
    }
}


/* =========================================================
   VALENCE ELECTRON QUIZ
   ========================================================= */

const veQuiz = document.getElementById('veQuiz');

if (veQuiz) {

    const veRows = veQuiz.querySelectorAll('.ve-quiz-row');
    const veMarkButton = document.getElementById('veQuizMark');
    const veResetButton = document.getElementById('veQuizReset');
    const veScore = document.getElementById('veQuizScore');

    veMarkButton.addEventListener('click', function () {

        let correctCount = 0;

        veRows.forEach(function (row) {

            const input = row.querySelector('.ve-quiz-input');
            const correctAnswer = Number(row.dataset.answer);
            const userAnswer = Number(input.value);

            row.classList.remove('correct', 'incorrect');

            if (input.value.trim() === '') {
                return; // leave unmarked if left blank
            }

            if (userAnswer === correctAnswer) {
                row.classList.add('correct');
                correctCount++;
            } else {
                row.classList.add('incorrect');
            }
        });

        veScore.textContent = correctCount + ' / ' + veRows.length + ' correct';
    });

    veResetButton.addEventListener('click', function () {

        veRows.forEach(function (row) {

            row.classList.remove('correct', 'incorrect');
            row.querySelector('.ve-quiz-input').value = '';
        });

        veScore.textContent = '';
    });
}


/* =========================================================
   LEWIS STRUCTURE DRAWING WIDGETS
   ========================================================= */

const lewisDrawWidgets = document.querySelectorAll('.lewis-draw');

lewisDrawWidgets.forEach(function (widget) {

    const canvas = widget.querySelector('.lewis-draw-canvas');
    const ctx = canvas.getContext('2d');

    const colorButtons = widget.querySelectorAll('.lewis-color');
    const sizeButtons = widget.querySelectorAll('.lewis-size');
    const undoButton = widget.querySelector('.lewis-undo');
    const clearButton = widget.querySelector('.lewis-clear');
    const revealButton = widget.querySelector('.lewis-reveal');
    const answerImage = widget.querySelector('.lewis-draw-answer');

    let currentColor = '#1a1714';
    let currentSize = 2.5;

    let drawing = false;
    let currentStroke = null;
    let strokes = []; // each stroke: { color, size, points: [{x, y}, ...] }

    /* -----------------------------------------------------
       Canvas sizing (handles high-DPI screens + resizing)
       ----------------------------------------------------- */

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
        return; // still hidden — nothing to size yet
    }

    const ratio = window.devicePixelRatio || 1;

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    redraw();
}

const canvasResizeObserver = new ResizeObserver(function () {
    resizeCanvas();
});

canvasResizeObserver.observe(canvas);


    /* -----------------------------------------------------
       Redraw all strokes (used after undo/clear/resize)
       ----------------------------------------------------- */

    function redraw() {

        const rect = canvas.getBoundingClientRect();

        ctx.clearRect(0, 0, rect.width, rect.height);

        strokes.forEach(function (stroke) {
            drawStroke(stroke);
        });
    }

    function drawStroke(stroke) {

        if (stroke.points.length < 1) {
            return;
        }

        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

        stroke.points.forEach(function (point) {
            ctx.lineTo(point.x, point.y);
        });

        ctx.stroke();
    }

    /* -----------------------------------------------------
       Pointer position helper
       ----------------------------------------------------- */

    function getPoint(event) {

        const rect = canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    /* -----------------------------------------------------
       Drawing events (pointer events cover mouse + touch + pen)
       ----------------------------------------------------- */

    canvas.addEventListener('pointerdown', function (event) {

        drawing = true;

        currentStroke = {
            color: currentColor,
            size: currentSize,
            points: [getPoint(event)]
        };

        canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener('pointermove', function (event) {

        if (!drawing || !currentStroke) {
            return;
        }

        currentStroke.points.push(getPoint(event));

        redraw();
        drawStroke(currentStroke);
    });

    function endStroke() {

        if (!drawing || !currentStroke) {
            return;
        }

        strokes.push(currentStroke);

        currentStroke = null;
        drawing = false;
    }

    canvas.addEventListener('pointerup', endStroke);
    canvas.addEventListener('pointercancel', endStroke);
    canvas.addEventListener('pointerleave', endStroke);

    /* -----------------------------------------------------
       Toolbar: colors
       ----------------------------------------------------- */

    colorButtons.forEach(function (button) {

        button.addEventListener('click', function () {

            colorButtons.forEach(function (b) {
                b.classList.remove('active');
            });

            button.classList.add('active');
            currentColor = button.dataset.color;
        });
    });

    /* -----------------------------------------------------
       Toolbar: pen size
       ----------------------------------------------------- */

    sizeButtons.forEach(function (button) {

        button.addEventListener('click', function () {

            sizeButtons.forEach(function (b) {
                b.classList.remove('active');
            });

            button.classList.add('active');
            currentSize = Number(button.dataset.size);
        });
    });

    /* -----------------------------------------------------
       Undo / Clear
       ----------------------------------------------------- */

    undoButton.addEventListener('click', function () {

        strokes.pop();
        redraw();
    });

    clearButton.addEventListener('click', function () {

        strokes = [];
        redraw();
    });

    /* -----------------------------------------------------
       Reveal answer
       ----------------------------------------------------- */

    if (revealButton && answerImage) {

        revealButton.addEventListener('click', function () {

            const isVisible = answerImage.classList.toggle('visible');

            revealButton.textContent = isVisible
                ? 'Hide answer'
                : 'Show answer';
        });
    }

    /* -----------------------------------------------------
       Initial sizing
       ----------------------------------------------------- */

    resizeCanvas();
});