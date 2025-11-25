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
    type: "time_min_sec",
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

function fixSavedData(parsedData, key) {
  if (!parsedData.fixVersion) {
    parsedData.fixVersion = 0;
  }
  if (parsedData.fixVersion < 1) {
    if (parsedData.label === "Trajanje povprečnega klica ta mesec") {
      console.log("Fixing time format for:", parsedData);
      // fix time format from "X h Y min" to "X min Y s"
      const timeParts = /(\d+)\s*h\s*(\d+)\s*min/.exec(parsedData.value);
      if (timeParts) {
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);
        const newValue = `${minutes} min ${seconds} s`;
        parsedData.value = newValue;
      }
    }
    parsedData.fixVersion = 1;
  }
  localStorage.setItem(key, JSON.stringify(parsedData));
  return parsedData;
}

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
          const parsedData = fixSavedData(
            JSON.parse(savedData),
            `sova-result-data-${i}`
          );
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
          } else if (option.type === "time_min_sec") {
            const minutes = Math.floor(randomValue / 60);
            const seconds = randomValue % 60;
            value = `${minutes} min ${seconds} s`;
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
          fixVersion: 1,
        };
        localStorage.setItem(
          `sova-result-data-${i}`,
          JSON.stringify(dataToStore)
        );
      }
    }
  }
}

function selectEmailContent() {
  const emailContent = document.querySelector(".js-email-content");
  if (emailContent) {
    const range = document.createRange();
    range.selectNodeContents(emailContent);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    return selection;
  }
  return null;
}

function addNewsletterListeners() {
  const form = document.querySelector(".content-footer .newsletter-form");
  if (form) {
    const email = form.querySelector("#newsletter-email");
    const checkbox = form.querySelector("#newsletter-checkbox");
    const submit = form.querySelector("button[type=submit]");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          segment_id: 21,
        }),
      };

      // load start
      email.disabled = true;
      checkbox.disabled = true;
      submit.disabled = true;
      const previousText = submit.innerHTML;
      submit.textContent = "⏳ Pošiljanje...";

      fetch("https://podpri.lb.djnd.si/api/subscribe/", options)
        .then((response) => response.json())
        .then((data) => {
          if (data.msg === "mail sent") {
            email.value = "";
            checkbox.checked = false;
            // load end
            email.disabled = false;
            checkbox.disabled = false;
            submit.disabled = false;
            submit.innerHTML = previousText;
            alert(
              "Hvala! Poslali smo ti sporočilo s povezavo, na kateri lahko potrdiš prijavo!"
            );
          } else {
            // load end
            email.disabled = false;
            checkbox.disabled = false;
            submit.disabled = false;
            submit.innerHTML = previousText;
            alert("Prišlo je do napake :(");
          }
        })
        .catch((error) => {
          console.error(error);
          // load end
          email.disabled = false;
          checkbox.disabled = false;
          submit.disabled = false;
          submit.innerHTML = previousText;
          alert("Prišlo je do napake :(");
        });
    });
  }
}

function skipToExplanationIfNeeded() {
  let pageClass = null;
  if (location.hash === "#razlaga") {
    pageClass = "explanation";
  } else if (location.hash === "#rezultati") {
    pageClass = "results";
  }

  if (!pageClass) {
    return;
  }

  const pages = document.querySelectorAll(".content-page");
  pages.forEach((page) => {
    if (pageClass && page.classList.contains(pageClass)) {
      page.classList.add("active");
      page.inert = false;
    } else {
      page.classList.remove("active");
      page.inert = true;
    }
  });
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

  const copyMailBtn = document.querySelector(".js-copy-mail-btn");
  if (copyMailBtn) {
    copyMailBtn.addEventListener("click", () => {
      const emailContent = document.querySelector(".js-email-content");
      if (emailContent) {
        const selection = selectEmailContent();
        try {
          document.execCommand("copy");
          selection.removeAllRanges();
          const previousText = copyMailBtn.querySelector("span").textContent;
          copyMailBtn.querySelector("span").innerHTML =
            "<strong>SKOPIRANO!</strong>";
          setTimeout(() => {
            copyMailBtn.querySelector("span").textContent = previousText;
          }, 2000);
        } catch (err) {
          console.error("Failed to copy text: ", err);
        }
      }
    });
  }

  const openMailBtn = document.querySelector(".js-open-mail-btn");
  if (openMailBtn) {
    openMailBtn.addEventListener("click", () => {
      const selection = selectEmailContent();
      const emailContent = selection.toString().trim();
      selection.removeAllRanges();
      const emailSubject = document.querySelector(".js-email-subject");
      const emailTo = document.querySelector(".js-email-to");
      if (emailContent && emailSubject && emailTo) {
        const mailtoLink = `mailto:${encodeURIComponent(
          emailTo.textContent.trim().replace(/\s+/g, "")
        )}?subject=${encodeURIComponent(
          emailSubject.textContent.trim()
        )}&body=${encodeURIComponent(emailContent)}`;
        window.open(mailtoLink, "_blank");
      }
    });
  }

  loadResultValues();
  addNewsletterListeners();
  skipToExplanationIfNeeded();
  window.addEventListener("hashchange", () => {
    skipToExplanationIfNeeded();
  });
});
