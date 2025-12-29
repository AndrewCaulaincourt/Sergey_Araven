import "./style.css";
import "./about.css";
import "./artists.css";

// Импорт HTML
import headerHtml from "./parts/header.html?raw";
import footerHtml from "./parts/footer.html?raw";

// Импорт AOS
import AOS from "aos";
import "aos/dist/aos.css";

// Вставка HTML
function injectHtml(id, html) {
  const element = document.getElementById(id);
  if (element) element.innerHTML = html;
}

// ГЛАВНАЯ ФУНКЦИЯ
function initApp() {
  if (!document.querySelector(".header"))
    injectHtml("header-placeholder", headerHtml);
  if (!document.querySelector(".footer"))
    injectHtml("footer-placeholder", footerHtml);

  setTimeout(() => {
    AOS.init({
      duration: 800,
      offset: 50,
      once: false,
      mirror: true,
      anchorPlacement: "top-bottom",
    });
    AOS.refresh();
  }, 100);

  setupBurger();
  highlightActiveLink();
  initAboutPageLogic(); // Эта функция запускает ВСЁ для страницы "Обо мне"
  initArtistsPageLogic();
}

// ЛОГИКА БУРГЕРА
function setupBurger() {
  setTimeout(() => {
    const burger = document.querySelector(".header__burger");
    const nav = document.querySelector(".header__nav");
    if (burger && nav) {
      const newBurger = burger.cloneNode(true);
      burger.parentNode.replaceChild(newBurger, burger);
      newBurger.addEventListener("click", () => {
        nav.classList.toggle("is-active");
        newBurger.classList.toggle("is-active");
        if (nav.classList.contains("is-active")) {
          Object.assign(nav.style, {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            top: "60px",
            left: "0",
            width: "100%",
            height: "calc(100vh - 60px)",
            background: "white",
            padding: "20px",
            zIndex: "1000",
            borderTop: "1px solid #eee",
          });
          document.body.style.overflow = "hidden";
        } else {
          nav.style = "";
          document.body.style.overflow = "";
        }
      });
    }
  }, 50);
}

// ПОДСВЕТКА ССЫЛОК
function highlightActiveLink() {
  setTimeout(() => {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll(".nav__link");
    links.forEach((link) => {
      link.style.color = "";
      link.style.fontWeight = "";
      if (
        link.getAttribute("href").includes(currentPath) &&
        currentPath !== "/"
      ) {
        link.style.color = "var(--color-primary-dark)";
        link.style.fontWeight = "700";
      }
    });
  }, 50);
}

// ЛОГИКА СТРАНИЦЫ "ОБО МНЕ"

// 1. Слайдер-гармошка (для Дипломов)
function initGalleryLogic() {
  const slides = document.querySelectorAll(".gallery-slide");

  if (slides.length > 0) {
    slides.forEach((slide) => {
      slide.addEventListener("click", () => {
        slides.forEach((s) => s.classList.remove("active"));
        slide.classList.add("active");
      });

      slide.addEventListener("mouseenter", () => {
        if (window.innerWidth > 900) {
          slides.forEach((s) => s.classList.remove("active"));
          slide.classList.add("active");
        }
      });
    });
  }
}

// 2. 3D Карусель "Center Stage" (Для Хроники)
function init3DCarousel() {
  const track = document.getElementById("c-track");
  const cards = Array.from(document.querySelectorAll(".c-card"));
  const btnPrev = document.getElementById("c-prev");
  const btnNext = document.getElementById("c-next");

  if (!track || cards.length === 0) return;

  let currentIndex = 0;

  // Функция обновления позиций карточек
  const updateCards = () => {
    cards.forEach((card, index) => {
      // Сброс стилей
      card.classList.remove("active");
      card.style.zIndex = "0";

      // Расстояние от центра (активного слайда)
      const diff = index - currentIndex;

      if (diff === 0) {
        // ЭТО ЦЕНТР
        card.classList.add("active");
        // Выдвигаем вперед и увеличиваем
        card.style.transform = `translateX(0) scale(1.1) translateZ(50px)`;
        card.style.zIndex = "10"; // Поверх всех
        card.style.opacity = "1";
      } else {
        // ЭТО БОКОВЫЕ
        // Сдвигаем влево/вправо (220px шаг)
        const xOffset = diff * 220;
        // Поворачиваем для объема
        const rotate = diff > 0 ? -10 : 10;

        card.style.transform = `translateX(${xOffset}px) scale(0.8) perspective(1000px) rotateY(${rotate}deg)`;

        // Чем дальше, тем ниже слой
        card.style.zIndex = 5 - Math.abs(diff);

        // Скрываем совсем далекие карточки, чтобы не мусорить
        if (Math.abs(diff) > 2) card.style.opacity = "0";
        else card.style.opacity = "0.5";
      }
    });
  };

  // Запуск при старте
  updateCards();

  // Клик Вперед
  if (btnNext) {
    btnNext.addEventListener("click", () => {
      if (currentIndex < cards.length - 1) {
        currentIndex++;
        updateCards();
      } else {
        // Если дошли до конца — прыгаем в начало (цикл)
        currentIndex = 0;
        updateCards();
      }
    });
  }

  // Клик Назад
  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCards();
      } else {
        // Если в начале — прыгаем в конец
        currentIndex = cards.length - 1;
        updateCards();
      }
    });
  }

  // Клик по боковой карточке делает её активной
  cards.forEach((card, index) => {
    card.addEventListener("click", (e) => {
      if (currentIndex !== index) {
        e.stopPropagation(); // Не открывать лайтбокс
        e.preventDefault();
        currentIndex = index;
        updateCards();
      }
    });
  });
}

// 3. Лайтбокс (Увеличение фото)
function initLightbox() {
  const modal = document.getElementById("lightbox");
  const modalImg = document.getElementById("lightbox-img");
  const captionText = document.getElementById("caption");
  const closeBtn = document.querySelector(".lightbox-close");

  // Ищем картинки с классом .lightbox-trigger
  const items = document.querySelectorAll(".lightbox-trigger");

  if (!modal) return;

  items.forEach((img) => {
    img.onclick = function () {
      modal.style.display = "flex";
      modal.style.flexDirection = "column";
      modal.style.justifyContent = "center";
      modalImg.src = this.src;

      // Логика подписи: берем из соседнего блока .c-info или .grid-caption
      let text = this.alt;
      const siblingInfo = this.nextElementSibling;

      // Проверка для 3D карусели (.c-info) или сетки
      if (
        siblingInfo &&
        (siblingInfo.classList.contains("c-info") ||
          siblingInfo.classList.contains("grid-caption"))
      ) {
        // Берем текст из заголовка h3
        const h3 = siblingInfo.querySelector("h3");
        if (h3) text = h3.innerText;
        else text = siblingInfo.innerText;
      }

      captionText.innerHTML = text;
      document.body.style.overflow = "hidden";
    };
  });

  const closeLightbox = () => {
    modal.style.display = "none";
    document.body.style.overflow = "";
  };
  if (closeBtn) closeBtn.onclick = closeLightbox;
  modal.onclick = (e) => {
    if (e.target === modal) closeLightbox();
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display !== "none") closeLightbox();
  });
}

// 4. СБОРКА ВСЕЙ ЛОГИКИ ОБО МНЕ
function initAboutPageLogic() {
  initGalleryLogic(); // Слайдер дипломов
  init3DCarousel(); // 3D Карусель Хроники
  initLightbox(); // Увеличение фото

  // Логика кругов экспертизы (Hotspots)
  const listItems = document.querySelectorAll(".education__item");
  const hotspots = document.querySelectorAll(".hotspot");
  if (listItems.length > 0) {
    const highlightPair = (id) => {
      listItems.forEach((el) => el.classList.remove("active"));
      hotspots.forEach((el) => el.classList.remove("active"));
      const item = document.querySelector(`.education__item[data-id="${id}"]`);
      const spot = document.querySelector(`.hotspot[data-link="${id}"]`);
      if (item) item.classList.add("active");
      if (spot) spot.classList.add("active");
    };
    listItems.forEach(
      (item) =>
        (item.onmouseenter = () => highlightPair(item.getAttribute("data-id")))
    );
    hotspots.forEach(
      (spot) =>
        (spot.onmouseenter = () =>
          highlightPair(spot.getAttribute("data-link")))
    );
  }

  // Логика нейросети и орбит
  const coreScene = document.getElementById("core-scene");
  if (coreScene) {
    const orbits = document.querySelectorAll(".orbit");
    document.onmousemove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 100;
      const y = (e.clientY - window.innerHeight / 2) / 100;
      orbits.forEach((o) => {
        const s = o.getAttribute("data-speed") || 1;
        o.style.transform = `translate(calc(-50% + ${x * s}px), calc(-50% + ${
          y * s
        }px))`;
      });
    };

    const bioBlocks = document.querySelectorAll(".bio-block");
    const nodes = document.querySelectorAll(".neural-node");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Array.from(bioBlocks).indexOf(entry.target);
          const currentNode = nodes[index];

          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            if (currentNode) currentNode.classList.add("active");
          } else {
            entry.target.classList.remove("active");
            if (currentNode) currentNode.classList.remove("active");
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    bioBlocks.forEach((block) => observer.observe(block));
  }
}

// ЛОГИКА "АРТИСТАМ"
function initArtistsPageLogic() {
  const spotlight = document.getElementById("spotlight-layer");
  if (spotlight) {
    document.onmousemove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      spotlight.style.setProperty("--mouse-x", `${x}%`);
      spotlight.style.setProperty("--mouse-y", `${y}%`);
    };
  }
  // Плеер
  const playBtn = document.getElementById("play-btn");
  const audio = document.getElementById("real-audio-player");
  const vinyl = document.getElementById("vinyl-disk");
  const wave = document.querySelector(".waveform-visualizer");

  if (playBtn && audio) {
    const newBtn = playBtn.cloneNode(true);
    playBtn.parentNode.replaceChild(newBtn, playBtn);

    newBtn.onclick = () => {
      if (audio.paused) {
        audio.play();
        newBtn.textContent = "❚❚";
        if (vinyl) vinyl.classList.add("playing");
        if (wave) wave.classList.add("playing");
      } else {
        audio.pause();
        newBtn.textContent = "▶";
        if (vinyl) vinyl.classList.remove("playing");
        if (wave) wave.classList.remove("playing");
      }
    };
  }
}

document.addEventListener("DOMContentLoaded", initApp);

window.addEventListener("pageshow", (event) => {
  if (event.persisted) initApp();
});
