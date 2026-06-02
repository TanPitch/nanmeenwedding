// Large img - Top page resize
function initFocalPoint() {
    const img = document.querySelector("#large-image");
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;

    // console.log(
    //     `w: ${aspectRatio < 0.8 ? "mobile" : aspectRatio >= 0.8 && aspectRatio <= 1.6 ? "tablet" : "desktop"}`,
    // );

    // mobile
    if (aspectRatio < 0.8) {
        img.style.objectPosition = "58% 20%";
    }

    // tablet
    else if (aspectRatio >= 0.8 && aspectRatio <= 1.6) {
        img.style.objectPosition = "center 25%";
    }

    // desktop
    else {
        img.style.objectPosition = "center 27%";
    }
}

// Fade In
const initFade = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            // แยกกลุ่ม Elements ที่กำลังเข้ามา และกำลังออกจากหน้าจอ
            const intersectingEntries = entries.filter((entry) => entry.isIntersecting);
            const exitingEntries = entries.filter((entry) => !entry.isIntersecting);

            // 1. ขาเข้า: Fade In แบบไล่ระดับ (Staggered)
            intersectingEntries.forEach((entry, index) => {
                setTimeout(() => {
                    // console.log(entry.target, index)
                    // ตรวจสอบซ้ำอีกครั้งว่ายังอยู่ในหน้าจอไหม ก่อนจะเล่นแอนิเมชัน
                    if (entry.isIntersecting) {
                        entry.target.classList.remove("opacity-0", "translate-y-10");
                        entry.target.classList.add("opacity-100", "translate-y-0");
                    }
                }, index * 300);
            });

            // 2. ขาออก: Fade Out ทันทีเมื่อหลุดหน้าจอ
            exitingEntries.forEach((entry) => {
                entry.target.classList.remove("opacity-100", "translate-y-0");
                entry.target.classList.add("opacity-0", "translate-y-10");
            });
        },
        {
            threshold: 0.1,
        },
    );

    const elements = document.querySelectorAll(".fade-in-element");
    elements.forEach((el) => observer.observe(el));
};

// Slow scroll
const initScroll = () => {
    // Select your wrapper element
    const wrapper = document.querySelector(".page-wrapper");

    wrapper.addEventListener("scroll", () => {
        const scrolled = wrapper.scrollTop;
        const targetObjects = document.querySelectorAll(".parallax-element");

        targetObjects.forEach((obj) => {
            const speed = obj.getAttribute("data-speed");
            const yPos = -(scrolled * speed);
            obj.style.transform = `translateY(${yPos}px)`;
        });
    });
};

// Countdown
const countdown = () => {
    const targetDate = new Date(2026, 6, 15); // July 15, 2026
    const countdownEl = document.querySelector(".countdown"); // Renamed variable to avoid confusion

    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        if (countdownEl) countdownEl.innerHTML = "";
        clearInterval(countdownInterval);
        return;
    }

    let months =
        (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());

    let tempDate = new Date(targetDate);
    tempDate.setMonth(tempDate.getMonth() - months);
    if (tempDate <= now) months--;

    const futureMonthDate = new Date(now);
    futureMonthDate.setMonth(futureMonthDate.getMonth() + months);

    let remainingTime = targetDate - futureMonthDate;
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    // Update HTML
    if (countdownEl) {
        countdownEl.innerHTML = `
          ${months !== 0 ? `<div class="flex flex-col items-center"><span class="text-2xl md:text-[2rem]">${months}</span><span>MONTHS</span></div>` : ""}
          ${days !== 0 ? `<div class="flex flex-col items-center"><span class="text-2xl md:text-[2rem]">${days}</span><span>DAYS</span></div>` : ""}
          ${hours !== 0 ? `<div class="flex flex-col items-center"><span class="text-2xl md:text-[2rem]">${hours}</span><span>HOURS</span></div>` : ""}
          ${minutes !== 0 ? `<div class="flex flex-col items-center"><span class="text-2xl md:text-[2rem]">${minutes}</span><span>MIN</span></div>` : ""}
          ${seconds !== 0 ? `<div class="flex flex-col items-center"><span class="text-2xl md:text-[2rem]">${seconds}</span><span>SEC</span></div>` : ""}
        `;
    }
};

// Map
const initMap = () => {
    // resize update
    const resize = () => {
        const width = window.innerWidth;
        const isMobile = width < 768;
        if (isMobile) map.setView([13.599, 100.6082], 14);
        else map.setView([13.599, 100.6082], 15);
    };

    var map = L.map("map", {
        attributionControl: false,
        zoomControl: false, // Hides the +/- buttons
        // dragging: false, // Prevents panning
        // scrollWheelZoom: false, // Prevents zooming with mouse wheel
        doubleClickZoom: false, // Prevents zooming on double click
        boxZoom: false, // Prevents shift-drag zooming
        touchZoom: false, // Prevents pinching on mobile
        keyboard: false, // Prevents arrow key panning
    }).setView([13.599, 100.6082], 15);
    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}" + (L.Browser.retina ? "@2x.png" : ".png"),
    ).addTo(map);

    resize();

    // pin
    const makePin = (icon, class1 = "", text = "", class2 = "") => {
        return L.divIcon({
            html: `
            <div class="flex flex-col items-center">
              ${text != "" ? `<span class="font-noto px-2 text-nowrap rounded-md${class2}">${text}</span>` : ""}
              <span class="material-symbols-outlined${class1}">${icon}</span>
            </div>`,
            className: `icon pointer-events-none!${text == "หยกพิมานย์" ? " z-[999]!" : ""}`,
            iconSize: [50, 50],
            iconAnchor: [25, 50],
        });
    };

    L.marker([13.599438771664571, 100.59687867056049], {
        icon: makePin("location_on", " text-zinc-400", "ศาลากลาง", " bg-zinc-400 text-zinc-100"),
    }).addTo(map);
    L.marker([13.602125828277684, 100.59710145734616], {
        icon: makePin("location_on", " text-zinc-400", "BTS ปากน้ำ", " bg-zinc-400 text-zinc-100"),
    }).addTo(map);
    L.marker([13.595314621749015, 100.60115212662605], {
        icon: makePin("location_on", " text-zinc-400", "รพ.เมืองสมุทรปากน้ำ", " bg-zinc-400 text-zinc-100"),
    }).addTo(map);
    L.marker([13.592076277122604, 100.60887877766763], {
        icon: makePin("location_on", " text-zinc-400", "BTS ศรีนครินทร์", " bg-zinc-400 text-zinc-100"),
    }).addTo(map);
    L.marker([13.59844465137868, 100.61448895418371], {
        icon: makePin("location_on", " text-zinc-400", "รพ.เปาโลสมุทรปราการ", " bg-zinc-400 text-zinc-100"),
    }).addTo(map);
    L.marker([13.59628283761302, 100.60722918084508], {
        icon: makePin("location_on", " text-zinc-800", "หยกพิมานย์", " bg-zinc-800 text-zinc-100"),
    }).addTo(map);

    // click to Google Map
    map.on("click", (e) => {
        window.open("https://maps.app.goo.gl/kNNAx1ag8gW5S3Bz5", "_blank");
    });

    // resize update
    window.onresize = resize;
};

// Image
const initImg = () => {
    const lightboxs = document.querySelectorAll(".lightbox");
    // lightboxs.forEach((el) => {
    //     el.onclick = () => {
    //         const instance = basicLightbox.create(`<img class="rounded-md" src="${el.src}">`);
    //         instance.show();
    //     };
    // });

    const imgs = document.querySelectorAll("img");
    imgs.forEach((el) => {
        el.setAttribute("draggable", false);
    });
};

// Title marquee
const titleMarquee = () => {
    var documentTitle = document.title + "";

    document.title = documentTitle = documentTitle.substring(1) + documentTitle.substring(0, 1);
    setTimeout(titleMarquee, 200);
};



function init() {
    initFocalPoint();
    window.addEventListener("resize", initFocalPoint);
    let countdownInterval = setInterval(countdown, 1000);
    countdown();
    initMap();
    new Splide(".splide", {
        type: "loop",
        autoWidth: true,
        gap: "16px",
        clones: undefined,
        pagination: false,
        arrows: false,
    }).mount();
    initImg();

    initFade();
    document.querySelector(".page-wrapper").addEventListener("scroll", initScroll);

    // titleMarquee();
}
document.addEventListener("DOMContentLoaded", init);
