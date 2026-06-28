const STORAGE_KEY = "electromelillaWorks";

let pendingDownload = null;

function fileWorks() {
  return Array.isArray(window.ELECTROMELILLA_WORKS) ? window.ELECTROMELILLA_WORKS : [];
}

function localWorks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getWorks() {
  return [...localWorks(), ...fileWorks()];
}

function setLocalWorks(works) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "trabajo";
}

function normalizeFileName(inputName, title, file) {
  const extension = (file?.name?.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const typed = inputName.trim();
  if (typed) {
    return typed.includes(".") ? slugify(typed.split(".").slice(0, -1).join(".")) + "." + typed.split(".").pop().toLowerCase() : slugify(typed) + "." + extension;
  }
  return `${slugify(title)}.${extension}`;
}

function jsString(value = "") {
  return JSON.stringify(String(value));
}

function createPublishCode(work) {
  return `  {
    id: ${jsString(work.id)},
    title: ${jsString(work.title)},
    category: ${jsString(work.category)},
    date: ${jsString(work.date || "")},
    description: ${jsString(work.description || "")},
    image: ${jsString(work.publishImage || work.image)}
  }`;
}

function workCard(work, includeDelete = false) {
  return `
    <article class="work-card">
      <img src="${escapeHtml(work.image)}" alt="${escapeHtml(work.title)}" loading="lazy">
      <div class="work-card-body">
        <div class="work-meta"><span>${escapeHtml(work.category)}</span><span>${escapeHtml(work.date || "")}</span></div>
        <h3>${escapeHtml(work.title)}</h3>
        <p>${escapeHtml(work.description || "")}</p>
        ${includeDelete && work.local ? `<button class="btn btn-danger" data-delete="${escapeHtml(work.id)}" type="button">Borrar vista previa</button>` : ""}
      </div>
    </article>
  `;
}

function renderGallery(filter = "Todos") {
  const grid = document.querySelector("#workGrid");
  const empty = document.querySelector("#emptyState");
  if (!grid) return;
  const works = getWorks();
  const visible = filter === "Todos" ? works : works.filter((work) => work.category === filter);
  grid.innerHTML = visible.map((work) => workCard(work)).join("");
  if (empty) empty.classList.toggle("is-visible", visible.length === 0);
}

function renderAdmin() {
  const grid = document.querySelector("#adminGrid");
  if (!grid) return;
  const works = getWorks();
  grid.innerHTML = works.map((work) => workCard(work, true)).join("");
  grid.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      setLocalWorks(localWorks().filter((work) => work.id !== button.dataset.delete));
      renderAdmin();
    });
  });
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderGallery(button.dataset.filter);
  });
});

const form = document.querySelector("#workForm");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const file = document.querySelector("#photo").files[0];
    if (!file) return;

    const title = document.querySelector("#title").value.trim();
    const fileName = normalizeFileName(document.querySelector("#fileName").value, title, file);
    const imagePath = `IMAGE/${fileName}`;

    const reader = new FileReader();
    reader.onload = () => {
      const work = {
        id: slugify(`${title}-${Date.now()}`),
        title,
        category: document.querySelector("#category").value,
        date: document.querySelector("#date").value,
        description: document.querySelector("#description").value.trim(),
        image: reader.result,
        publishImage: imagePath,
        local: true
      };

      setLocalWorks([work, ...localWorks()]);
      pendingDownload = { file, fileName };

      const publishCode = document.querySelector("#publishCode");
      if (publishCode) publishCode.value = createPublishCode(work);

      const downloadButton = document.querySelector("#downloadImageBtn");
      if (downloadButton) downloadButton.disabled = false;

      form.reset();
      renderAdmin();
    };
    reader.readAsDataURL(file);
  });
}

const copyCodeButton = document.querySelector("#copyCodeBtn");
if (copyCodeButton) {
  copyCodeButton.addEventListener("click", async () => {
    const code = document.querySelector("#publishCode")?.value || "";
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      copyCodeButton.textContent = "Codigo copiado";
      setTimeout(() => { copyCodeButton.textContent = "Copiar codigo"; }, 1600);
    } catch {
      document.querySelector("#publishCode").select();
    }
  });
}

const downloadImageButton = document.querySelector("#downloadImageBtn");
if (downloadImageButton) {
  downloadImageButton.addEventListener("click", () => {
    if (!pendingDownload) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pendingDownload.file);
    link.download = pendingDownload.fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

const exportButton = document.querySelector("#exportBtn");
if (exportButton) {
  exportButton.addEventListener("click", () => {
    const exportable = getWorks().map((work) => ({
      id: work.id,
      title: work.title,
      category: work.category,
      date: work.date || "",
      description: work.description || "",
      image: work.publishImage || work.image
    }));
    const content = `window.ELECTROMELILLA_WORKS = ${JSON.stringify(exportable, null, 2)};\n`;
    const blob = new Blob([content], { type: "text/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "works-data.js";
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

const importFile = document.querySelector("#importFile");
if (importFile) {
  importFile.addEventListener("change", () => {
    const file = importFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result).replace(/^window\.ELECTROMELILLA_WORKS\s*=\s*/, "").replace(/;\s*$/, "");
        const imported = JSON.parse(text);
        if (Array.isArray(imported)) {
          setLocalWorks(imported.map((work) => ({ ...work, local: true })));
          renderAdmin();
        }
      } catch {
        alert("Archivo no valido.");
      }
    };
    reader.readAsText(file);
  });
}

const clearButton = document.querySelector("#clearBtn");
if (clearButton) {
  clearButton.addEventListener("click", () => {
    if (confirm("Seguro que quieres borrar las vistas previas guardadas en este navegador?")) {
      localStorage.removeItem(STORAGE_KEY);
      renderAdmin();
    }
  });
}

renderGallery();
renderAdmin();
