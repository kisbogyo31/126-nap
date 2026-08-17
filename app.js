const TOTAL_DAYS = 126;


// ==================================================
// HTML ELEMEK
// ==================================================

const homeScreen =
    document.getElementById("homeScreen");

const historyScreen =
    document.getElementById("historyScreen");

const quoteScreen =
    document.getElementById("quoteScreen");

const memoryScreen =
    document.getElementById("memoryScreen");


const dayText =
    document.getElementById("dayText");

const quoteElement =
    document.getElementById("quote");

const personalMessage =
    document.getElementById("personalMessage");

const counter =
    document.getElementById("counter");


const historyButton =
    document.getElementById("historyButton");

const memoryButton =
    document.getElementById("memoryButton");

const resetButton =
    document.getElementById("resetButton");


const backFromHistory =
    document.getElementById("backFromHistory");

const backFromQuote =
    document.getElementById("backFromQuote");

const backFromMemory =
    document.getElementById("backFromMemory");


const historyList =
    document.getElementById("historyList");


const previousDayTitle =
    document.getElementById("previousDayTitle");

const previousQuote =
    document.getElementById("previousQuote");

const previousMessage =
    document.getElementById("previousMessage");


const memoryDay =
    document.getElementById("memoryDay");

const memoryQuote =
    document.getElementById("memoryQuote");

const memoryMessage =
    document.getElementById("memoryMessage");

const memoryCounter =
    document.getElementById("memoryCounter");

const previousMemory =
    document.getElementById("previousMemory");

const nextMemory =
    document.getElementById("nextMemory");


// ==================================================
// ÁLLAPOT
// ==================================================

let state =
    JSON.parse(
        localStorage.getItem(
            "quoteAppState"
        )
    ) || null;


// Az emlékkönyv aktuális oldala

let memoryPage = 1;


// ==================================================
// ELSŐ INDÍTÁS
// ==================================================

function createInitialState() {

    const quoteOrder =
        shuffle(
            [...Array(quotes.length).keys()]
        );


    return {

        startDate:
            getToday(),

        currentDay:
            1,

        quoteOrder:
            quoteOrder

    };
}


// ==================================================
// RANDOM SORREND
// ==================================================

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];
    }


    return array;
}


// ==================================================
// MAI DÁTUM
// ==================================================

function getToday() {

    const today =
        new Date();


    return today
        .toISOString()
        .split("T")[0];
}


// ==================================================
// NAPOK KÜLÖNBSÉGE
// ==================================================

function daysBetween(
    start,
    end
) {

    const startDate =
        new Date(start);

    const endDate =
        new Date(end);


    const difference =
        endDate - startDate;


    return Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
    );
}


// ==================================================
// AKTUÁLIS NAP FRISSÍTÉSE
// ==================================================

function updateCurrentDay() {

    const today =
        getToday();


    const passedDays =
        daysBetween(
            state.startDate,
            today
        );


    state.currentDay =
        Math.min(
            passedDays + 1,
            TOTAL_DAYS
        );


    saveState();
}


// ==================================================
// IDÉZET LEKÉRÉSE EGY ADOTT NAPHOZ
// ==================================================

function getQuoteForDay(day) {

    const index =
        state.quoteOrder[day - 1];


    return quotes[index];
}


// ==================================================
// SZEMÉLYES ÜZENET EGY ADOTT NAPHOZ
// ==================================================

function getMessageForDay(
    day,
    selectedQuote
) {

    // Az első napnak mindig
    // ez legyen az üzenete.

    if (day === 1) {

        return "Nagyon várom már a napot, hogy újra lássalak kicsi pacsulim.";

    }


    // Ha egy későbbi idézethez
    // tartozik saját üzenet,
    // azt használjuk.

    if (
        selectedQuote &&
        selectedQuote.message
    ) {

        return selectedQuote.message;
    }


    // Ha nincs személyes üzenet,
    // üres szöveget adunk vissza.

    return "";
}


// ==================================================
// FŐOLDAL MEGJELENÍTÉSE
// ==================================================

function displayToday() {

    const day =
        state.currentDay;


    const selectedQuote =
        getQuoteForDay(day);


    // Nap száma

    dayText.textContent =
        `${day}. nap`;


    // Idézet

    quoteElement.textContent =
        `„${selectedQuote.quote}”`;


    // Személyes üzenet

    const message =
        getMessageForDay(
            day,
            selectedQuote
        );


    if (message) {

        personalMessage.textContent =
            message;

        personalMessage.style.display =
            "block";

    } else {

        personalMessage.textContent =
            "";

        personalMessage.style.display =
            "none";
    }


    // Számláló

    counter.textContent =
        `${day} / ${TOTAL_DAYS}`;


    // A 126. napon jelenjen meg
    // az emlékkönyv gombja.

    if (
        day >= TOTAL_DAYS
    ) {

        memoryButton.classList.remove(
            "hidden"
        );

    } else {

        memoryButton.classList.add(
            "hidden"
        );
    }
}


// ==================================================
// KORÁBBI IDÉZETEK LISTÁJA
// ==================================================

function renderHistory() {

    historyList.innerHTML =
        "";


    // A legutóbbi korábbi naptól
    // haladunk visszafelé az elsőig.

    for (
        let day = state.currentDay - 1;
        day >= 1;
        day--
    ) {

        const selectedQuote =
            getQuoteForDay(day);


        const item =
            document.createElement(
                "button"
            );


        item.className =
            "history-item";


        // Nap

        const dayElement =
            document.createElement(
                "div"
            );


        dayElement.className =
            "history-day";


        dayElement.textContent =
            `${day}. nap`;


        // Üzenet

        const messageElement =
            document.createElement(
                "div"
            );


        messageElement.className =
            "history-message-preview";


        const message =
            getMessageForDay(
                day,
                selectedQuote
            );


        if (message) {

            messageElement.textContent =
                message;

        } else {

            messageElement.style.display =
                "none";
        }


        // Idézet előnézete

        const quoteElementHistory =
            document.createElement(
                "div"
            );


        quoteElementHistory.className =
            "history-preview";


        quoteElementHistory.textContent =
            `„${selectedQuote.quote}”`;


        // Elemsorrend

        item.appendChild(
            dayElement
        );


        item.appendChild(
            messageElement
        );


        item.appendChild(
            quoteElementHistory
        );


        // Kattintás

        item.addEventListener(
            "click",
            () => {

                openPreviousQuote(day);

            }
        );


        historyList.appendChild(
            item
        );
    }


    // Ha még nincs korábbi idézet

    if (
        state.currentDay === 1
    ) {

        historyList.innerHTML = `

            <div class="history-item">

                <div class="history-day">
                    Még nincs korábbi idézet
                </div>

                <div class="history-preview">
                    Holnap már itt lesz az első
                    korábbi idézeted. ❤️
                </div>

            </div>

        `;
    }
}


// ==================================================
// KORÁBBI IDÉZET MEGNYITÁSA
// ==================================================

function openPreviousQuote(day) {

    const selectedQuote =
        getQuoteForDay(day);


    // Cím

    previousDayTitle.textContent =
        `${day}. nap`;


    // Idézet

    previousQuote.textContent =
        `„${selectedQuote.quote}”`;


    // Üzenet

    const message =
        getMessageForDay(
            day,
            selectedQuote
        );


    if (message) {

        previousMessage.textContent =
            message;

        previousMessage.style.display =
            "block";

    } else {

        previousMessage.textContent =
            "";

        previousMessage.style.display =
            "none";
    }


    // Képernyőváltás

    historyScreen.classList.add(
        "hidden"
    );


    quoteScreen.classList.remove(
        "hidden"
    );
}


// ==================================================
// EMLÉKKÖNYV MEGNYITÁSA
// ==================================================

function openMemoryBook() {

    memoryPage =
        1;


    updateMemoryPage();


    homeScreen.classList.add(
        "hidden"
    );


    memoryScreen.classList.remove(
        "hidden"
    );
}


// ==================================================
// EMLÉKKÖNYV AKTUÁLIS OLDALA
// ==================================================

function updateMemoryPage() {

    const selectedQuote =
        getQuoteForDay(memoryPage);


    // Nap

    memoryDay.textContent =
        `${memoryPage}. nap`;


    // Idézet

    memoryQuote.textContent =
        `„${selectedQuote.quote}”`;


    // Üzenet

    const message =
        getMessageForDay(
            memoryPage,
            selectedQuote
        );


    if (message) {

        memoryMessage.textContent =
            message;

        memoryMessage.style.display =
            "block";

    } else {

        memoryMessage.textContent =
            "";

        memoryMessage.style.display =
            "none";
    }


    // Oldalszám

    memoryCounter.textContent =
        `${memoryPage} / ${TOTAL_DAYS}`;


    // Bal nyíl

    previousMemory.disabled =
        memoryPage <= 1;


    // Jobb nyíl

    nextMemory.disabled =
        memoryPage >= TOTAL_DAYS;
}


// ==================================================
// EMLÉKKÖNYV - ELŐZŐ OLDAL
// ==================================================

previousMemory.addEventListener(
    "click",
    () => {

        if (
            memoryPage <= 1
        ) {

            return;
        }


        memoryPage--;


        updateMemoryPage();
    }
);


// ==================================================
// EMLÉKKÖNYV - KÖVETKEZŐ OLDAL
// ==================================================

nextMemory.addEventListener(
    "click",
    () => {

        if (
            memoryPage >= TOTAL_DAYS
        ) {

            return;
        }


        memoryPage++;


        updateMemoryPage();
    }
);


// ==================================================
// KORÁBBI IDÉZETEK MEGNYITÁSA
// ==================================================

historyButton.addEventListener(
    "click",
    () => {

        renderHistory();


        homeScreen.classList.add(
            "hidden"
        );


        historyScreen.classList.remove(
            "hidden"
        );
    }
);


// ==================================================
// VISSZA A FŐOLDALRA
// ==================================================

backFromHistory.addEventListener(
    "click",
    () => {

        historyScreen.classList.add(
            "hidden"
        );


        homeScreen.classList.remove(
            "hidden"
        );
    }
);


// ==================================================
// VISSZA AZ ELŐZMÉNYEKBŐL
// ==================================================

backFromQuote.addEventListener(
    "click",
    () => {

        quoteScreen.classList.add(
            "hidden"
        );


        historyScreen.classList.remove(
            "hidden"
        );
    }
);


// ==================================================
// VISSZA AZ EMLÉKKÖNYVBŐL
// ==================================================

backFromMemory.addEventListener(
    "click",
    () => {

        memoryScreen.classList.add(
            "hidden"
        );


        homeScreen.classList.remove(
            "hidden"
        );
    }
);


// ==================================================
// EMLÉKKÖNYV GOMB
// ==================================================

memoryButton.addEventListener(
    "click",
    () => {

        openMemoryBook();

    }
);


// ==================================================
// ÚJRakezdés
// ==================================================

resetButton.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Biztosan újra szeretnéd kezdeni a 126 napot?"
            );


        if (!confirmed) {

            return;
        }


        // Új véletlenszerű sorrend

        state =
            createInitialState();


        saveState();


        // Biztosan a főoldalon
        // maradunk.

        historyScreen.classList.add(
            "hidden"
        );

        quoteScreen.classList.add(
            "hidden"
        );

        memoryScreen.classList.add(
            "hidden"
        );

        homeScreen.classList.remove(
            "hidden"
        );


        // Új első nap megjelenítése

        displayToday();
    }
);


// ==================================================
// ÁLLAPOT MENTÉSE
// ==================================================

function saveState() {

    localStorage.setItem(
        "quoteAppState",
        JSON.stringify(state)
    );
}


// ==================================================
// ALKALMAZÁS INDÍTÁSA
// ==================================================

if (!state) {

    // Első indítás

    state =
        createInitialState();


    saveState();

} else {

    // Ha már használtuk az appot,
    // kiszámoljuk, hányadik nap van.

    updateCurrentDay();
}


// Megjelenítjük a mai idézetet.

displayToday();


// ==================================================
// SERVICE WORKER
// ==================================================

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("sw.js")
                .then(
                    () => {

                        console.log(
                            "Offline mód aktív."
                        );

                    }
                )
                .catch(
                    error => {

                        console.error(
                            "Service Worker hiba:",
                            error
                        );

                    }
                );

        }
    );
}