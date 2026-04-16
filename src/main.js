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

document.addEventListener("DOMContentLoaded", () => {
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
          emailTo.textContent.trim().replace(/\s+/g, ""),
        )}?subject=${encodeURIComponent(
          emailSubject.textContent.trim(),
        )}&body=${encodeURIComponent(emailContent)}`;
        window.open(mailtoLink, "_blank");
      }
    });
  }
});
