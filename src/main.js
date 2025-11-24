import Termynal from "termynal";

async function nextContentPage() {
  let resolve = null;
  const promise = new Promise((res) => {
    resolve = res;
  });

  const pageContent = document.querySelector(".page-content");
  const activePage = document.querySelector(".content-page.active");
  if (activePage) {
    activePage.classList.add("fade");
    activePage.classList.remove("active");
    activePage.inert = true;
    activePage.addEventListener(
      "transitionend",
      () => {
        activePage.classList.remove("fade");

        if (pageContent) {
          pageContent.scrollTo({ top: 0 });
        }

        const nextPage = activePage.nextElementSibling;
        if (nextPage && nextPage.classList.contains("content-page")) {
          nextPage.classList.add("fade");
          nextPage.offsetWidth; // Trigger reflow
          nextPage.classList.add("active");
          nextPage.inert = false;
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
        value: "> Analiziram podatke...",
      },
      {
        type: "input",
        value: "> Preverjam vire...",
      },
      {
        type: "input",
        value: "> Dostopam do baze...",
      },
      { type: "progress", typeDelay: 30, delay: 1 },
      { value: "DOSTOP ODOBREN." },
      {
        value: "> Odpiram arhiv...",
        delay: 1,
      },
      { type: "progress", typeDelay: 10, delay: 1 },
      { value: "> Ustvarjam profil...", delay: 1 },
      { type: "progress", typeDelay: 60, delay: 1 },
      { value: "PROFIL USTVARJEN.", delay: 1000 },
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

const NUM_RESULTS = 6;

const RESULTS_OPTIONS = [
  {
    label: "Število oseb v imeniku, ki so na seznamu opazovancev 387-B",
    min: 2,
    max: 9,
  },
  {
    label: "Trajanje povprečnega klica ta mesec",
    min: 7 * 60 + 41,
    max: 11 * 60 + 12,
    type: "time",
  },
  {
    label: "Čas, preživet na straneh z eksplicitno vsebino v zadnjem letu",
    min: 1 * 60 + 37,
    max: 2 * 60 + 58,
    type: "time",
  },
  {
    label: "Število korakov v prvem tednu novembra",
    min: 39800,
    max: 47200,
  },
  {
    label: "Število sporočil z omembo besede “cena”",
    min: 2,
    max: 6,
  },
  {
    label: "Število sporočil z omembo besede “bomba”",
    min: 1,
    max: 4,
  },
  {
    label: "Število poslanih sporočil v prejšnjem tednu",
    min: 180,
    max: 310,
  },
  {
    label: "Število posnetih videoposnetkov v zadnjem mesecu",
    min: 8,
    max: 16,
  },
  {
    label: "Število oseb, s katerimi je potekala komunikacija v zadnjem tednu",
    min: 22,
    max: 41,
  },
  {
    label: "Število pogovorov s povzdignjenim glasom v zadnjem mesecu",
    min: 5,
    max: 9,
  },
  {
    label: "Število zgrešenih klicev v zadnjem tednu",
    min: 7,
    max: 12,
  },
  {
    label: "Oddaljenost najdaljšega klica od doma",
    min: 19,
    max: 28,
    type: "distance",
  },
  {
    label: "Število prečkanj meje v zadnjem letu",
    min: 4,
    max: 10,
  },
  {
    label: "Število ogledanih videov v zadnjih 72 urah",
    min: 31,
    max: 56,
  },
  {
    label: "Povprečna hitrost premikanja med 8. in 10. uro",
    min: 2.7,
    max: 3.6,
    type: "speed",
  },
  {
    label: "Število posnetih fotografij v zadnjem tednu",
    min: 32,
    max: 71,
  },
  {
    label: "Najpogosteje poslušana radijska postaja",
    values: [
      "Radio Študent",
      "Val 202",
      "Radio Center",
      "Radio 1",
      "Radio Antena",
    ],
  },
  {
    label: "Povprečna vrednost nakupa v spletni banki v zadnjem tednu",
    min: 28.9,
    max: 36.4,
    type: "currency",
  },
  // { label: "Trenutna vrednost baterije" },
  {
    label: "Čas vključenega zaslona včeraj",
    min: 4 * 60 + 58,
    max: 6 * 60 + 12,
    type: "time",
  },
  {
    label: "Število aplikacij, uporabljenih najmanj enkrat v zadnjem mesecu",
    min: 20,
    max: 34,
  },
  {
    label: "Povprečna srčna frekvenca med spanjem danes ponoči",
    min: 58,
    max: 67,
    type: "bpm",
  },
  {
    label: "Povprečni čas spanja v zadnjem tednu",
    min: 6 * 60 + 54,
    max: 7 * 60 + 43,
    type: "time",
  },
];

function loadResultValues() {
  const resultTemplate = document.querySelector(".js-result-template");
  const resultsSection = resultTemplate.closest(".results-section");

  if (resultsSection && resultTemplate) {
    const usedIndices = new Set();

    for (let i = 1; i <= NUM_RESULTS; i++) {
      const resultClone = resultTemplate.content.cloneNode(true);
      const resultLabel = resultClone.querySelector(".js-result-label");
      const resultValue = resultClone.querySelector(".js-result-value");
      if (resultLabel && resultValue) {
        const savedData = localStorage.getItem(`sova-result-data-${i}`);
        if (savedData && location.href.indexOf("sova-no-cache") === -1) {
          const parsedData = JSON.parse(savedData);
          resultLabel.textContent = parsedData.label;
          resultValue.textContent = parsedData.value;
          resultClone.querySelector(".alert").classList.add(parsedData.class);
          usedIndices.add(parsedData.optionIndex);
          resultsSection.appendChild(resultClone);
          continue;
        }

        let optionIndex = Math.floor(Math.random() * RESULTS_OPTIONS.length);
        while (usedIndices.has(optionIndex)) {
          // ensure unique options
          optionIndex = Math.floor(Math.random() * RESULTS_OPTIONS.length);
        }
        usedIndices.add(optionIndex);

        const option = RESULTS_OPTIONS[optionIndex];
        resultLabel.textContent = option.label;

        let className = option.class;
        if (!className) {
          const rand = Math.random();
          if (rand < 0.1) {
            className = "ok";
          } else if (rand < 0.55) {
            className = "warning";
          } else {
            className = "danger";
          }
        }

        resultClone.querySelector(".alert").classList.add(className);

        let value = "";
        if (option.min != null && option.max != null) {
          const randomValueFloat =
            Math.random() * (option.max - option.min) + option.min;
          const randomValue = Math.floor(randomValueFloat);
          const formatter = new Intl.NumberFormat("sl-SI", {
            maximumFractionDigits: 2,
          });
          const formattedValue = formatter.format(randomValue);
          const formattedValueFloat = formatter.format(randomValueFloat);

          if (option.type === "time") {
            const hours = Math.floor(randomValue / 60);
            const minutes = randomValue % 60;
            value = `${hours} h ${minutes} min`;
          } else if (option.type === "distance") {
            value = `${formattedValueFloat} km`;
          } else if (option.type === "speed") {
            value = `${formattedValueFloat} km/h`;
          } else if (option.type === "currency") {
            value = `${formattedValueFloat} €`;
          } else if (option.type === "bpm") {
            value = `${formattedValue} bpm`;
          } else {
            value = `${formattedValue}`;
          }
        } else if (option.values) {
          const randomIndex = Math.floor(Math.random() * option.values.length);
          value = option.values[randomIndex];
        } else {
          value = "";
        }
        resultValue.textContent = value;
        resultsSection.appendChild(resultClone);
        const dataToStore = {
          label: option.label,
          value: resultValue.textContent,
          class: className,
          optionIndex: optionIndex,
        };
        localStorage.setItem(
          `sova-result-data-${i}`,
          JSON.stringify(dataToStore)
        );
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

  const resultsBtn = document.querySelector(".js-results-btn");
  if (resultsBtn) {
    resultsBtn.addEventListener("click", async () => {
      await nextContentPage();
    });
  }

  loadResultValues();
});
