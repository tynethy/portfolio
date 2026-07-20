/* Work page filtering */
const filterTabs = document.querySelectorAll(".filter-tab");
const workItems = document.querySelectorAll(".work-item");

function applyFilter(filter) {
  workItems.forEach((item) => {
    const categories = item.dataset.category.split(" ");
    const matches = categories.includes(filter);
    item.style.display = matches ? "" : "none";
  });
}

if (filterTabs.length && workItems.length) {
  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;

      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      applyFilter(filter);
    });
  });

  // Run once on load, using whichever tab is marked active in the HTML
  const initialTab = document.querySelector(".filter-tab.active");
  if (initialTab) {
    applyFilter(initialTab.dataset.filter);
  }
}

/* Work page project detail dialog, project copy lives in assets/projects-data.js and defined in PROJECT_DETAILS object. */
const projectDialog = document.getElementById("projectDialog");

if (projectDialog && workItems.length) {
  const dialogImage = document.getElementById("dialogImage");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogTagline = document.getElementById("dialogTagline");
  const dialogMeta = document.getElementById("dialogMeta");
  const dialogDesc = document.getElementById("dialogDesc");
  const dialogTags = document.getElementById("dialogTags");
  const dialogClose = document.getElementById("dialogClose");

  const EXT_ICON = `<svg class="ext-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>`;

  function openProjectDialog(key) {
    const p = PROJECT_DETAILS[key];
    if (!p) return;

    dialogImage.src = p.image || "";
    dialogImage.alt = p.title ? `${p.title} image` : "";

    // If there's an external site, the title itself is the link, otherwise it's a heading.
    if (p.link) {
      dialogTitle.innerHTML = `<a class="title-link" href="${p.link}" target="_blank" rel="noopener">${p.title}${EXT_ICON}</a>`;
    } else {
      dialogTitle.textContent = p.title || "";
    }

    dialogTagline.textContent = p.tagline || "";

    dialogMeta.innerHTML = "";
    if (p.role) dialogMeta.innerHTML += `<span>Role <b>${p.role}</b></span>`;
    if (p.year) dialogMeta.innerHTML += `<span>Year <b>${p.year}</b></span>`;

    dialogDesc.innerHTML = p.description || "";

    dialogTags.innerHTML = (p.tags || [])
      .map((t) => `<span>${t}</span>`)
      .join("");

    projectDialog.showModal();
  }

  workItems.forEach((item) => {
    item.addEventListener("click", () =>
      openProjectDialog(item.dataset.project),
    );
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProjectDialog(item.dataset.project);
      }
    });
  });

  dialogClose.addEventListener("click", () => projectDialog.close());

  // Clicking on the backdrop (outside the content box) also closes it
  projectDialog.addEventListener("click", (e) => {
    if (e.target === projectDialog) projectDialog.close();
  });
}

const emailLink = document.getElementById("emailLink");
if (emailLink) {
  const user = "tabernethy5";
  const domain = "gmail.com";
  const email = `${user}@${domain}`;
  emailLink.href = `mailto:${email}`;

  const copyToast = document.getElementById("copyToast");

  emailLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(email).catch(() => {});

    if (copyToast) {
      copyToast.classList.add("visible");
      clearTimeout(emailLink._toastTimer);
      emailLink._toastTimer = setTimeout(() => {
        copyToast.classList.remove("visible");
      }, 1500);
    }
  });
}
