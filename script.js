const amazonAuthorUrl = "https://www.amazon.com.br/stores/Ricardo-C-Freitas/author/B0GP76WBJG?ref=ap_rdr&shoppingPortalEnabled=true";

const defaultContent = {
  brandName: "Ricardo C Freitas",
  headline: "Ricardo C Freitas",
  description: "Obras para quem busca clareza emocional, presenca, desenvolvimento pessoal e uma relacao mais consciente com a propria historia.",
  featuredTitle: "A arte de viver: Jornada consciente",
  featuredSubtitle: "Nao ha roteiro pronto. Ha escolhas. Ha presenca. Ha vida.",
  aboutText: "Um projeto sobre consciencia, tempo, presenca e autenticidade. A proposta e abrir espaco para uma vida menos automatica e mais alinhada ao que realmente importa.",
  buyLink: amazonAuthorUrl,
  whatsapp: "5500000000000",
  contactText: "Use o formulario ou o WhatsApp para conversar sobre livros, divulgacao, leitura em grupo e parcerias."
};

const storageKey = "ricardoAuthorSiteContent";
const savedContent = JSON.parse(localStorage.getItem(storageKey) || "{}");
let content = { ...defaultContent, ...savedContent };

const applyContent = () => {
  document.querySelectorAll("[data-admin-field]").forEach((element) => {
    const field = element.dataset.adminField;
    if (content[field]) {
      element.textContent = content[field];
    }
  });

  document.querySelectorAll("[data-buy-link]").forEach((link) => {
    link.href = content.buyLink || defaultContent.buyLink;
  });

  const whatsappNumber = String(content.whatsapp || "").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber || defaultContent.whatsapp}`;
  document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
    link.href = whatsappUrl;
  });

  document.querySelectorAll("#adminForm [name]").forEach((field) => {
    field.value = content[field.name] || "";
  });
};

const saveContent = (updates) => {
  content = { ...content, ...updates };
  localStorage.setItem(storageKey, JSON.stringify(content));
  applyContent();
};

applyContent();

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a, button").forEach((item) => {
  item.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".section-reveal").forEach((section) => {
  revealObserver.observe(section);
});

const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector(".form-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const message = [
    `Nome: ${formData.get("name")}`,
    `E-mail: ${formData.get("email")}`,
    "",
    formData.get("message")
  ].join("\n");

  const mailto = `mailto:?subject=${encodeURIComponent("Contato sobre os livros de Ricardo C Freitas")}&body=${encodeURIComponent(message)}`;
  window.location.href = mailto;
  formStatus.textContent = "Mensagem preparada no seu aplicativo de e-mail.";
  contactForm.reset();
});

const adminDialog = document.querySelector("#adminDialog");
const loginBox = document.querySelector("[data-login-box]");
const adminFields = document.querySelector("[data-admin-fields]");
const adminPassword = document.querySelector("#adminPassword");

document.querySelector("[data-open-admin]").addEventListener("click", () => {
  adminDialog.showModal();
  loginBox.hidden = false;
  adminFields.hidden = true;
  adminPassword.value = "";
  adminPassword.focus();
});

document.querySelector("[data-close-admin]").addEventListener("click", () => {
  adminDialog.close();
});

document.querySelector("[data-login-admin]").addEventListener("click", () => {
  if (adminPassword.value === "admin123") {
    loginBox.hidden = true;
    adminFields.hidden = false;
  } else {
    adminPassword.setCustomValidity("Senha incorreta");
    adminPassword.reportValidity();
    adminPassword.setCustomValidity("");
  }
});

document.querySelector("#adminForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const updates = {};
  formData.forEach((value, key) => {
    updates[key] = String(value).trim();
  });
  saveContent(updates);
  adminDialog.close();
});

document.querySelector("[data-reset-admin]").addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  content = { ...defaultContent };
  applyContent();
});
