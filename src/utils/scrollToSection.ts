interface ScrollToSectionOptions {
  behavior?: ScrollBehavior;
  mobileExtraOffset?: number;
  desktopExtraOffset?: number;
}

const DEFAULT_OPTIONS: Required<ScrollToSectionOptions> = {
  behavior: "smooth",
  mobileExtraOffset: 8,
  desktopExtraOffset: 16,
};

export function scrollToSectionById(
  sectionId: string,
  options: ScrollToSectionOptions = {},
): boolean {
  const target = document.getElementById(sectionId);
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const {
    behavior,
    mobileExtraOffset,
    desktopExtraOffset,
  } = { ...DEFAULT_OPTIONS, ...options };

  const computeTargetTop = () => {
    const nav = document.getElementById("sticky-recruiter-nav");
    const navHeight = nav instanceof HTMLElement ? nav.getBoundingClientRect().height : 0;
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const extraOffset = isMobile ? mobileExtraOffset : desktopExtraOffset;
    return Math.max(window.scrollY + target.getBoundingClientRect().top - navHeight - extraOffset, 0);
  };

  window.scrollTo({
    top: computeTargetTop(),
    behavior,
  });

  return true;
}
