/** Shared behavior for project and work-case dialogs. */
document.querySelectorAll<HTMLDialogElement>("[data-detail-dialog]").forEach((dialog) => {
  const opener = document.querySelector<HTMLButtonElement>(`[aria-controls="${dialog.id}"]`);
  const closeButton = dialog.querySelector<HTMLButtonElement>("[data-detail-close]");
  if (!opener || !closeButton) return;
  let opening: Animation | undefined;

  opener.hidden = false;
  opener.addEventListener("click", () => {
    const source = (opener.closest<HTMLElement>(".gallery-card, .work-example") ?? opener).getBoundingClientRect();
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    document.documentElement.style.setProperty("--project-dialog-scrollbar", `${scrollbarWidth}px`);
    dialog.showModal();
    dialog.scrollTop = 0;
    document.documentElement.classList.add("project-dialog-open");
    closeButton.focus();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && typeof dialog.animate === "function") {
      const target = dialog.getBoundingClientRect();
      const sourceVisible = source.width > 0 && source.height > 0 && target.width > 0 && target.height > 0 && source.right > 0 && source.left < innerWidth && source.bottom > 0 && source.top < innerHeight;
      const x = sourceVisible ? source.left + source.width / 2 - (target.left + target.width / 2) : 0;
      const y = sourceVisible ? source.top + source.height / 2 - (target.top + target.height / 2) : 18;
      const scaleX = sourceVisible ? source.width / target.width : 0.94;
      const scaleY = sourceVisible ? source.height / target.height : 0.94;
      opening?.cancel();
      opening = dialog.animate([
        { transform: `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`, opacity: 0.15 },
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
      ], { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
  });
  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    // The native close event is asynchronous; the same dialog may already be open again.
    if (dialog.open) return;
    opening?.cancel();
    opening = undefined;
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
