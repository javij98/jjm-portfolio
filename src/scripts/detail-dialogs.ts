/** Shared behavior for project and work-case dialogs. */
document.querySelectorAll<HTMLDialogElement>("[data-detail-dialog]").forEach((dialog) => {
  const opener = document.querySelector<HTMLButtonElement>(`[aria-controls="${dialog.id}"]`);
  const closeButton = dialog.querySelector<HTMLButtonElement>("[data-detail-close]");
  if (!opener || !closeButton) return;

  opener.hidden = false;
  opener.addEventListener("click", () => {
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    document.documentElement.style.setProperty("--project-dialog-scrollbar", `${scrollbarWidth}px`);
    dialog.showModal();
    dialog.scrollTop = 0;
    document.documentElement.classList.add("project-dialog-open");
    closeButton.focus();
  });
  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("project-dialog-open");
    document.documentElement.style.removeProperty("--project-dialog-scrollbar");
    // Native dialogs usually restore focus before this asynchronous close event.
    // Avoid overriding a keyboard action that has already moved focus elsewhere.
    if (document.activeElement === document.body || dialog.contains(document.activeElement)) {
      opener.focus({ preventScroll: true });
    }
  });
});

// Reuse the normal opener for links to details, including collapsed cases.
function openLinkedDetail() {
  const id = window.location.hash.slice(1);
  if (!/^(project-dialog|work-case-dialog)-\d+$/.test(id)) return;
  const dialog = document.getElementById(id) as HTMLDialogElement | null;
  const opener = document.querySelector<HTMLButtonElement>(`[aria-controls="${id}"]`);
  if (!dialog || dialog.open || !opener) return;
  const additional = opener.closest<HTMLElement>("[data-work-examples-more]");
  if (additional?.hidden) document.querySelector<HTMLButtonElement>("[data-work-examples-toggle]")?.click();
  opener.click();
}

window.addEventListener("hashchange", openLinkedDetail);
window.setTimeout(openLinkedDetail, 0);
