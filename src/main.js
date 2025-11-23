import Termynal from "termynal";

async function nextContentPage() {
  let resolve = null;
  const promise = new Promise((res) => {
    resolve = res;
  });

  const activePage = document.querySelector(".content-page.active");
  if (activePage) {
    activePage.classList.add("fade");
    activePage.classList.remove("active");
    activePage.addEventListener(
      "transitionend",
      () => {
        activePage.classList.remove("fade");

        const nextPage = activePage.nextElementSibling;
        if (nextPage && nextPage.classList.contains("content-page")) {
          nextPage.classList.add("fade");
          nextPage.offsetWidth; // Trigger reflow
          nextPage.classList.add("active");
          nextPage.classList.remove("fade");
          nextPage.addEventListener(
            "transitionend",
            () => {
              resolve();
            },
            { once: true }
          );
        }
      },
      { once: true }
    );
  }

  return promise;
}

async function startTermynal() {
  const termynal = new Termynal(
    "#autotype",
    {
      autoplay: true,
      startDelay: 0,
      typeDelay: 10,
      lineDelay: 400,
      progressLength: 30,
    },
    [
      {
        type: "input",
        value: "> Iniciam varno povezavo...",
      },
      {
        type: "input",
        value: "> IP naslov zaznan: 192.168.X.X...",
      },
      {
        type: "input",
        value: "> Obhajam požarne zidove...",
      },
      {
        type: "input",
        value: "> Dostopam do baze SOVA_MAIN_DB...",
      },
      {
        type: "input",
        value: "> Šifrirni ključ: 4096-bit RSA...",
      },
      { type: "progress", typeDelay: 30, delay: 1 },
      { value: "DOSTOP ODOBREN." },
      {
        value: "> Prenašanje metapodatkov...",
        delay: 1,
      },
      { type: "progress", typeDelay: 10, delay: 1 },
      { value: "> Nalaganje ...", delay: 1 },
      { type: "progress", typeDelay: 60, delay: 1 },
      { value: "NALAGANJE ZAKLJUČENO.", delay: 1000 },
      { value: "", className: "termynal-done" },
    ]
  );

  // listen for the element with class "termynal-done" to appear
  await new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.classList.contains("termynal-done")
          ) {
            observer.disconnect();
            resolve();
          }
        }
      }
    });

    observer.observe(termynal.container, { childList: true });
  });
}

const RESULT_RANGES = [
  { min: 2000, max: 50000 },
  { min: 5, max: 15 },
  { min: 2000, max: 15000, type: "time" },
  { min: 90, max: 800, type: "time" },
  { values: ["cena", "sova", "jabolko"] },
];

function loadResultValues() {
  for (let i = 1; i <= 5; i++) {
    const resultValue = document.querySelector(`.js-result-value-${i}`);
    if (resultValue) {
      const storedValue = localStorage.getItem(`sova-result-value-${i}`);
      if (storedValue != null) {
        resultValue.textContent = storedValue;
      } else {
        const range = RESULT_RANGES[i - 1];
        let value = "";
        if (range.values) {
          const randomIndex = Math.floor(Math.random() * range.values.length);
          value = range.values[randomIndex];
        } else {
          const randomValue =
            Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
          if (range.type === "time") {
            const minutes = Math.floor(randomValue / 60);
            const seconds = randomValue % 60;
            value = `${minutes} min ${seconds} s`;
          } else {
            value = randomValue.toString();
          }
        }
        resultValue.textContent = value;
        // localStorage.setItem(`sova-result-value-${i}`, value);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const checkBtn = document.querySelector(".js-check-btn");
  if (checkBtn) {
    checkBtn.addEventListener("click", async () => {
      await nextContentPage();
      await startTermynal();
      await nextContentPage();
    });
  }

  loadResultValues();
});
