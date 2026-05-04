const header = document.querySelector("[data-header]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const reveals = document.querySelectorAll(".reveal");

reveals.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll("[data-accordion]").forEach((accordion) => {
  accordion.addEventListener("toggle", (event) => {
    const activeItem = event.target;

    if (!(activeItem instanceof HTMLDetailsElement) || !activeItem.open) {
      return;
    }

    accordion.querySelectorAll("details").forEach((item) => {
      if (item !== activeItem) {
        item.removeAttribute("open");
      }
    });
  }, true);
});

const buildVimeoUrl = (source) => {
  const url = new URL(source);
  const params = {
    autoplay: "1",
    byline: "0",
    dnt: "1",
    muted: "1",
    playsinline: "1",
    portrait: "0",
    title: "0",
  };

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
};

const loadReel = (frame) => {
  if (frame.vimeoPlayer || frame.classList.contains("is-loading")) {
    return frame.vimeoPlayer;
  }

  const source = frame.dataset.videoSrc;
  const title = frame.dataset.videoTitle || "Peak Automations reel";

  if (!source) {
    return null;
  }

  frame.classList.add("is-loading");

  const iframe = document.createElement("iframe");
  iframe.src = buildVimeoUrl(source);
  iframe.title = title;
  iframe.loading = "lazy";
  iframe.allow = "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";

  frame.append(iframe);
  frame.classList.add("is-loaded");

  if (window.Vimeo?.Player) {
    frame.vimeoPlayer = new window.Vimeo.Player(iframe);
    frame.vimeoPlayer.ready().then(() => {
      frame.vimeoPlayer.setMuted(true);
      frame.vimeoPlayer.play().catch(() => {});
    });
  }

  return frame.vimeoPlayer;
};

const playReel = (frame) => {
  const player = loadReel(frame);
  player?.play?.().catch(() => {});
};

const pauseReel = (frame) => {
  frame.vimeoPlayer?.pause?.().catch(() => {});
};

document.querySelectorAll(".reel-frame[data-video-src]").forEach((frame) => {
  const button = frame.querySelector(".reel-cover");

  button?.addEventListener("click", () => {
    playReel(frame);
  });
});

if ("IntersectionObserver" in window) {
  const reelObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const frame = entry.target;

        if (entry.isIntersecting) {
          playReel(frame);
        } else {
          pauseReel(frame);
        }
      });
    },
    {
      rootMargin: "-18% 0px -18% 0px",
      threshold: 0.42,
    }
  );

  document.querySelectorAll(".reel-frame[data-video-src]").forEach((frame) => {
    reelObserver.observe(frame);
  });
}
