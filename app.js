import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
  EmailAuthProvider, linkWithCredential, signInWithEmailAndPassword, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, collectionGroup, doc, addDoc, updateDoc, deleteDoc, onSnapshot,
  query, where, orderBy, writeBatch, serverTimestamp, getDocs, increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ---------------- Firebase init ---------------- */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

/* ---------------- DOM refs ---------------- */
const $ = (id) => document.getElementById(id);
const loginScreen = $("loginScreen");
const appEl = $("app");
const googleLoginBtn = $("googleLoginBtn");
const logoutBtn = $("logoutBtn");
const themeToggleBtn = $("themeToggleBtn");
const themeToggleHeroBtn = $("themeToggleHeroBtn");
const themeToggleSettingsBtn = $("themeToggleSettingsBtn");
const helpFabBtn = $("helpFabBtn");
const helpModal = $("helpModal");
const helpCloseBtn = $("helpCloseBtn");
const helpNavBtns = document.querySelectorAll(".help-nav-btn");
const helpSections = document.querySelectorAll(".help-section");

/* ---------------- Theme (light/dark) ---------------- */
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  try { localStorage.setItem("theme", theme); } catch (e) {}
}
function toggleTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  applyTheme(isDark ? "light" : "dark");
}
themeToggleBtn.addEventListener("click", toggleTheme);
themeToggleHeroBtn.addEventListener("click", toggleTheme);
themeToggleSettingsBtn.addEventListener("click", toggleTheme);

/* ---------------- Help / hướng dẫn sử dụng ---------------- */
function openHelpModal() {
  helpModal.classList.remove("hidden");
}
function closeHelpModal() {
  helpModal.classList.add("hidden");
}
helpFabBtn.addEventListener("click", openHelpModal);
helpCloseBtn.addEventListener("click", closeHelpModal);
helpModal.addEventListener("click", (e) => { if (e.target === helpModal) closeHelpModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !helpModal.classList.contains("hidden")) closeHelpModal();
});
helpNavBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.helpSection;
    helpNavBtns.forEach((b) => b.classList.toggle("active", b === btn));
    helpSections.forEach((s) => s.classList.toggle("active", s.dataset.helpContent === target));
  });
});
const userAvatar = $("userAvatar");
const userName = $("userName");
const newRootPageBtn = $("newRootPageBtn");
const pageTree = $("pageTree");
const sidebarEmpty = $("sidebarEmpty");
const sidebar = $("sidebar");
const sidebarToggle = $("sidebarToggle");
const emptyState = $("emptyState");
const pageView = $("pageView");
const pageIconBtn = $("pageIconBtn");
const pageTitleEl = $("pageTitle");
const pageDateLabel = $("pageDateLabel");
const pageMenuBtn = $("pageMenuBtn");
const nodeActionsMenu = $("nodeActionsMenu");
const pageMenu = $("pageMenu");
const sortBtn = $("sortBtn");
const sortMenu = $("sortMenu");
const groupBtn = $("groupBtn");
const groupMenu = $("groupMenu");
const viewStatusBar = $("viewStatusBar");
const sortStatusChip = $("sortStatusChip");
const groupStatusChip = $("groupStatusChip");
const clearSortBtn = $("clearSortBtn");
const clearGroupBtn = $("clearGroupBtn");
const deletePageBtn = $("deletePageBtn");
const blocksContainer = $("blocksContainer");
const addBlockBtn = $("addBlockBtn");
const addBlockMenu = $("addBlockMenu");
const addBlockWrap = $("addBlockWrap");
const imageFileInput = $("imageFileInput");
const toastEl = $("toast");
const confirmModal = $("confirmModal");
const confirmTitle = $("confirmTitle");
const confirmMessage = $("confirmMessage");
const confirmCancelBtn = $("confirmCancelBtn");
const confirmOkBtn = $("confirmOkBtn");
const offlineBanner = $("offlineBanner");
const todayNavBtn = $("todayNavBtn");
const todayView = $("todayView");
const todayGroups = $("todayGroups");
const todayEmpty = $("todayEmpty");
const sidebarSkeleton = $("sidebarSkeleton");
const pageSkeleton = $("pageSkeleton");
const toastMessage = $("toastMessage");
const toastActionBtn = $("toastActionBtn");
const emptyStateNewBtn = $("emptyStateNewBtn");
const detailModal = $("detailModal");
const detailCloseBtn = $("detailCloseBtn");
const detailCheckbox = $("detailCheckbox");
const detailTitle = $("detailTitle");
const detailDueDate = $("detailDueDate");
const detailDueTime = $("detailDueTime");
const detailToolbar = $("detailToolbar");
const detailDescription = $("detailDescription");
const detailSaveDescBtn = $("detailSaveDescBtn");
const detailImageWrap = $("detailImageWrap");
const detailLinkWrap = $("detailLinkWrap");
const detailImageFileInput = $("detailImageFileInput");
const detailFilesInput = $("detailFilesInput");
const detailFolderInput = $("detailFolderInput");
const detailFilesWrap = $("detailFilesWrap");
const detailAddFilesBtn = $("detailAddFilesBtn");
const detailAddFolderBtn = $("detailAddFolderBtn");
const detailEditDescBtn = $("detailEditDescBtn");
const detailDescActions = $("detailDescActions");
const detailCancelDescBtn = $("detailCancelDescBtn");
const detailWordCount = $("detailWordCount");
const detailDescImageFileInput = $("detailDescImageFileInput");
const detailDeleteBtn = $("detailDeleteBtn");
const trashNavBtn = $("trashNavBtn");
const trashCountBadge = $("trashCountBadge");
const trashView = $("trashView");
const trashToolbar = $("trashToolbar");
const trashSelectAllCheckbox = $("trashSelectAllCheckbox");
const trashSelectedCount = $("trashSelectedCount");
const trashRestoreSelectedBtn = $("trashRestoreSelectedBtn");
const trashDeleteSelectedBtn = $("trashDeleteSelectedBtn");
const trashEmptyAllBtn = $("trashEmptyAllBtn");
const trashGroups = $("trashGroups");
const trashEmptyState = $("trashEmptyState");
const settingsNavBtn = $("settingsNavBtn");
const settingsModal = $("settingsModal");
const settingsCloseBtn = $("settingsCloseBtn");
const settingsAvatar = $("settingsAvatar");
const settingsName = $("settingsName");
const settingsEmail = $("settingsEmail");
const settingsLogoutBtn = $("settingsLogoutBtn");
const settingsOpenTrashBtn = $("settingsOpenTrashBtn");
const searchTriggerBtn = $("searchTriggerBtn");
const paletteModal = $("paletteModal");
const paletteInput = $("paletteInput");
const paletteCloseBtn = $("paletteCloseBtn");
const paletteResults = $("paletteResults");
const paletteTagFilterBtn = $("paletteTagFilterBtn");
const paletteTagFilterCount = $("paletteTagFilterCount");
const paletteTagDropdown = $("paletteTagDropdown");
const paletteDateField = $("paletteDateField");
const paletteDateRange = $("paletteDateRange");
const pageBreadcrumb = $("pageBreadcrumb");
const pageTagsRow = $("pageTagsRow");
const emailLoginToggleBtn = $("emailLoginToggleBtn");
const emailLoginForm = $("emailLoginForm");
const emailLoginInput = $("emailLoginInput");
const passwordLoginInput = $("passwordLoginInput");
const emailLoginSubmitBtn = $("emailLoginSubmitBtn");
const emailLoginForgotBtn = $("emailLoginForgotBtn");
const settingsPasswordSection = $("settingsPasswordSection");
const settingsPasswordForm = $("settingsPasswordForm");
const settingsPasswordDone = $("settingsPasswordDone");
const settingsNewPasswordInput = $("settingsNewPasswordInput");
const settingsSetPasswordBtn = $("settingsSetPasswordBtn");

/* ---------------- State ---------------- */
let currentUser = null;
let pagesById = new Map();       // id -> page data
let expandedIds = new Set();
let draggedPageId = null; // trang đang được kéo trong sidebar tree
let currentPageId = null;
let unsubPages = null;
let unsubBlocks = null;
let unsubToday = null;
let blockElements = new Map(); // blockId -> rendered DOM element, for reconciled re-render
let activeSortMode = null; // null | 'dueDate' | 'alpha' | 'createdAt'
let activeGroupMode = null; // null | 'type' | 'todoStatus' | 'dueDate'
let latestBlocks = []; // cache của lần snapshot gần nhất, để sắp xếp/nhóm lại ngay không cần chờ Firestore
let nodeActionsPendingPageId = null; // page mà menu "⋮" trong sidebar tree đang mở cho
let pendingImageBlockId = null;
let pagesFirstLoadDone = false;
let currentView = "empty"; // 'empty' | 'page' | 'today' | 'trash'
let detailContext = null; // { pageId, blockId }
let descEditBackupHTML = null;
let unsubTrashPages = null;
let unsubTrashBlocks = null;
let trashedPages = [];
let trashedBlocks = [];
let trashSelection = new Set(); // "page:ID" hoặc "block:PAGEID:BLOCKID"
const TRASH_RETENTION_DAYS = 30;

/* ---------------- Utils ---------------- */
function debounce(fn, wait = 500) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
function escapeHtml(str = "") {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}
function showToast(msg, { actionLabel = null, onAction = null, duration = 2200 } = {}) {
  toastMessage.textContent = msg;
  toastActionBtn.onclick = null;
  if (actionLabel && onAction) {
    toastActionBtn.textContent = actionLabel;
    toastActionBtn.classList.remove("hidden");
    toastActionBtn.onclick = () => {
      onAction();
      toastEl.classList.add("hidden");
      clearTimeout(showToast._t);
    };
  } else {
    toastActionBtn.classList.add("hidden");
  }
  toastEl.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.add("hidden"), duration);
}
function pagesCol() {
  return collection(db, "users", currentUser.uid, "pages");
}
function blocksCol(pageId) {
  return collection(db, "users", currentUser.uid, "pages", pageId, "blocks");
}
function blockRef(pageId, blockId) {
  return doc(db, "users", currentUser.uid, "pages", pageId, "blocks", blockId);
}

/* ---------------- Image upload via Vercel Blob ---------------- */
function compressImage(file, maxDim = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => { img.src = reader.result; };
    reader.onerror = reject;
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Nén ảnh thất bại")), "image/jpeg", quality);
    };
    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadImageToBlob(file) {
  const compressed = await compressImage(file);
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
  const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
    method: "POST",
    body: compressed
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = `Tải ảnh lên thất bại (HTTP ${res.status})`;
    try {
      const data = JSON.parse(text);
      if (data.error) message = data.error;
    } catch (_) {
      // response không phải JSON - thường là do /api/upload không tồn tại (404)
      // hoặc đang test bằng Live Server, không chạy được serverless function
      if (res.status === 404) message = "Không tìm thấy /api/upload (404) - kiểm tra đã deploy đủ thư mục api/ và package.json lên Vercel chưa, hoặc bạn đang test bằng Live Server (không chạy được API route).";
    }
    throw new Error(message);
  }
  return res.json(); // { url, ... }
}

function deleteImageFromBlob(url) {
  if (!url) return;
  fetch(`/api/delete-image?url=${encodeURIComponent(url)}`, { method: "DELETE" }).catch(() => {});
}

/* ---------------- Auth ---------------- */
googleLoginBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error(err);
    showToast("Đăng nhập thất bại: " + err.message);
  }
});

emailLoginToggleBtn.addEventListener("click", () => {
  emailLoginForm.classList.toggle("hidden");
});
emailLoginSubmitBtn.addEventListener("click", async () => {
  const email = emailLoginInput.value.trim();
  const password = passwordLoginInput.value;
  if (!email || !password) return showToast("Nhập đủ email và mật khẩu");
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    showToast("Đăng nhập thất bại: sai email hoặc mật khẩu");
  }
});
emailLoginForgotBtn.addEventListener("click", async () => {
  const email = emailLoginInput.value.trim();
  if (!email) return showToast("Nhập email trước để nhận link đặt lại mật khẩu");
  try {
    await sendPasswordResetEmail(auth, email);
    showToast("Đã gửi email đặt lại mật khẩu (123456)");
  } catch (err) {
    console.error(err);
    showToast("Lỗi: " + err.message);
  }
});
logoutBtn.addEventListener("click", async () => {
  const ok = await showConfirm("Đăng xuất?", "Bạn cần đăng nhập lại để xem các trang của mình.", { danger: false, confirmText: "Đăng xuất" });
  if (ok) signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (unsubPages) unsubPages();
  if (unsubBlocks) unsubBlocks();
  if (unsubToday) unsubToday();
  if (unsubTrashPages) unsubTrashPages();
  if (unsubTrashBlocks) unsubTrashBlocks();
  trashSelection.clear();
  pagesFirstLoadDone = false;
  currentPageId = null;
  pagesById.clear();

  if (user) {
    loginScreen.classList.add("hidden");
    appEl.classList.remove("hidden");
    userAvatar.src = user.photoURL || "";
    userName.textContent = user.displayName || user.email || "Người dùng";
    subscribeToPages();
    showEmptyPageState();
  } else {
    appEl.classList.add("hidden");
    loginScreen.classList.remove("hidden");
  }
});

/* ---------------- Confirm modal ---------------- */
function showConfirm(title, message, { danger = true, confirmText = "Xác nhận" } = {}) {
  return new Promise((resolve) => {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmOkBtn.textContent = confirmText;
    confirmOkBtn.classList.toggle("btn-danger", danger);
    confirmModal.classList.remove("hidden");

    const cleanup = (result) => {
      confirmModal.classList.add("hidden");
      confirmOkBtn.removeEventListener("click", onOk);
      confirmCancelBtn.removeEventListener("click", onCancel);
      confirmModal.removeEventListener("click", onOverlay);
      resolve(result);
    };
    const onOk = () => cleanup(true);
    const onCancel = () => cleanup(false);
    const onOverlay = (e) => { if (e.target === confirmModal) cleanup(false); };

    confirmOkBtn.addEventListener("click", onOk);
    confirmCancelBtn.addEventListener("click", onCancel);
    confirmModal.addEventListener("click", onOverlay);
  });
}

/* ---------------- Network status ---------------- */
function updateOnlineBanner() {
  offlineBanner.classList.toggle("hidden", navigator.onLine);
}
window.addEventListener("online", () => {
  updateOnlineBanner();
  showToast("Đã có mạng lại — dữ liệu đang đồng bộ");
});
window.addEventListener("offline", () => {
  updateOnlineBanner();
  showToast("Mất kết nối mạng — nội dung bạn gõ vẫn được giữ, sẽ tự lưu khi có mạng lại", { duration: 4000 });
});
updateOnlineBanner();

/* ---------------- Pages: realtime tree ---------------- */
function subscribeToPages() {
  sidebarSkeleton.classList.remove("hidden");
  pageTree.classList.add("hidden");
  const q = query(pagesCol(), orderBy("order", "asc"));
  unsubPages = onSnapshot(q, (snap) => {
    pagesById.clear();
    snap.forEach((d) => pagesById.set(d.id, { id: d.id, ...d.data() }));
    pagesFirstLoadDone = true;
    sidebarSkeleton.classList.add("hidden");
    pageTree.classList.remove("hidden");
    renderTree();
    if (currentPageId && pagesById.has(currentPageId)) {
      const p = pagesById.get(currentPageId);
      if (document.activeElement !== pageTitleEl) pageTitleEl.textContent = p.title || "";
      pageIconBtn.textContent = p.icon || "📄";
      renderPageDateLabel(p);
      renderBreadcrumb(currentPageId);
      renderPageTags(currentPageId);
    } else if (currentPageId && !pagesById.has(currentPageId)) {
      showEmptyPageState();
    }
  }, (err) => {
    console.error(err);
    showToast("Lỗi tải danh sách trang");
  });
}

function clearTreeDropIndicators() {
  document.querySelectorAll(".page-node.drop-before, .page-node.drop-inside, .page-node.drop-after")
    .forEach((el) => el.classList.remove("drop-before", "drop-inside", "drop-after"));
}

function isDescendantOf(candidateId, ancestorId) {
  let cur = pagesById.get(candidateId);
  while (cur?.parentId) {
    if (cur.parentId === ancestorId) return true;
    cur = pagesById.get(cur.parentId);
  }
  return false;
}

async function moveTreeNode(draggedId, targetId, zone) {
  if (draggedId === targetId) return;
  // Không cho thả 1 trang vào chính nó hoặc vào trang con/cháu của nó (tránh vòng lặp vô hạn)
  if (targetId === draggedId || isDescendantOf(targetId, draggedId)) {
    showToast("Không thể chuyển trang vào chính trang con của nó");
    return;
  }
  const dragged = pagesById.get(draggedId);
  const target = pagesById.get(targetId);
  if (!dragged || !target) return;

  if (zone === "inside") {
    const siblings = [...pagesById.values()].filter((p) => p.parentId === targetId && !p.deleted && p.id !== draggedId);
    const maxOrder = siblings.length ? Math.max(...siblings.map((p) => p.order ?? 0)) : -1;
    await updateDoc(doc(db, "users", currentUser.uid, "pages", draggedId), {
      parentId: targetId, order: maxOrder + 1, updatedAt: serverTimestamp()
    });
    expandedIds.add(targetId);
    showToast(`Đã chuyển vào trong "${target.title || "trang này"}"`);
    return;
  }

  const newParentId = target.parentId || null;
  const siblings = [...pagesById.values()]
    .filter((p) => p.parentId === newParentId && !p.deleted && p.id !== draggedId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const targetIdx = siblings.findIndex((p) => p.id === targetId);
  const beforeIdx = zone === "before" ? targetIdx - 1 : targetIdx;
  const afterIdx = zone === "before" ? targetIdx : targetIdx + 1;
  const beforeOrder = siblings[beforeIdx]?.order ?? (target.order ?? 0) - 2;
  const afterOrder = siblings[afterIdx]?.order ?? (target.order ?? 0) + 2;
  const newOrder = (beforeOrder + afterOrder) / 2;

  await updateDoc(doc(db, "users", currentUser.uid, "pages", draggedId), {
    parentId: newParentId, order: newOrder, updatedAt: serverTimestamp()
  });
}

function renderTree() {
  const roots = [...pagesById.values()]
    .filter((p) => !p.parentId && !p.deleted)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  pageTree.innerHTML = "";
  sidebarEmpty.classList.toggle("hidden", roots.length > 0 || !pagesFirstLoadDone);
  roots.forEach((p) => pageTree.appendChild(buildNode(p)));
}

function buildNode(page) {
  const children = [...pagesById.values()]
    .filter((p) => p.parentId === page.id && !p.deleted)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const li = document.createElement("li");
  const row = document.createElement("div");
  row.className = "page-node" + (page.id === currentPageId ? " selected" : "");
  row.dataset.id = page.id;
  row.draggable = true;

  row.addEventListener("dragstart", (e) => {
    e.stopPropagation();
    draggedPageId = page.id;
    row.classList.add("dragging");
  });
  row.addEventListener("dragend", () => {
    row.classList.remove("dragging");
    clearTreeDropIndicators();
  });
  row.addEventListener("dragover", (e) => {
    if (!draggedPageId || draggedPageId === page.id) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = row.getBoundingClientRect();
    const ratio = (e.clientY - rect.top) / rect.height;
    const zone = ratio < 0.25 ? "before" : ratio > 0.75 ? "after" : "inside";
    clearTreeDropIndicators();
    row.classList.add("drop-" + zone);
  });
  row.addEventListener("dragleave", () => row.classList.remove("drop-before", "drop-inside", "drop-after"));
  row.addEventListener("drop", async (e) => {
    if (!draggedPageId || draggedPageId === page.id) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = row.getBoundingClientRect();
    const ratio = (e.clientY - rect.top) / rect.height;
    const zone = ratio < 0.25 ? "before" : ratio > 0.75 ? "after" : "inside";
    clearTreeDropIndicators();
    await moveTreeNode(draggedPageId, page.id, zone);
    draggedPageId = null;
  });

  const caret = document.createElement("span");
  caret.className = "caret" + (children.length ? "" : " empty") + (expandedIds.has(page.id) ? " open" : "");
  caret.textContent = "▶";
  caret.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!children.length) return;
    expandedIds.has(page.id) ? expandedIds.delete(page.id) : expandedIds.add(page.id);
    renderTree();
  });

  const icon = document.createElement("span");
  icon.className = "node-icon";
  icon.textContent = page.icon || "📄";

  const title = document.createElement("span");
  title.className = "node-title";
  title.textContent = page.title || "Không có tiêu đề";

  const badge = document.createElement("span");
  if (page.todoOpenCount > 0) {
    badge.className = "node-badge";
    badge.textContent = page.todoOpenCount;
    badge.title = `${page.todoOpenCount} việc cần làm chưa xong`;
  }

  const actions = document.createElement("span");
  actions.className = "node-actions";
  const menuBtn = document.createElement("button");
  menuBtn.className = "node-menu-btn";
  menuBtn.title = "Thêm tùy chọn";
  menuBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    nodeActionsPendingPageId = page.id;
    positionFixedMenu(nodeActionsMenu, menuBtn);
    nodeActionsMenu.classList.remove("hidden");
  });
  actions.appendChild(menuBtn);

  row.append(caret, icon, title, badge, actions);
  row.addEventListener("click", () => openPage(page.id));

  li.appendChild(row);

  if (children.length && expandedIds.has(page.id)) {
    const ul = document.createElement("ul");
    children.forEach((c) => ul.appendChild(buildNode(c)));
    li.appendChild(ul);
  }
  return li;
}

/* ---------------- Page create / delete ---------------- */
newRootPageBtn.addEventListener("click", () => createPage(null));
emptyStateNewBtn.addEventListener("click", () => createPage(null));

async function createPage(parentId) {
  if (!currentUser) return;
  const siblingCount = [...pagesById.values()].filter((p) => p.parentId === (parentId || null)).length;
  const docRef = await addDoc(pagesCol(), {
    title: "",
    icon: "📄",
    parentId: parentId || null,
    order: siblingCount,
    todoOpenCount: 0,
    todoTotalCount: 0,
    deleted: false,
    deletedAt: null,
    tags: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  openPage(docRef.id);
  setTimeout(() => pageTitleEl.focus(), 150);
}

async function deletePageWithConfirm(pageId, title) {
  const hasChildren = [...pagesById.values()].some((p) => p.parentId === pageId);
  const msg = hasChildren
    ? `Xóa "${title || "trang này"}" sẽ chuyển vào Thùng rác, kèm theo tất cả trang con bên trong.`
    : `Xóa "${title || "trang này"}"? Trang sẽ được chuyển vào Thùng rác, có thể khôi phục trong 30 ngày.`;
  const ok = await showConfirm("Xóa trang?", msg, { danger: true, confirmText: "Xóa" });
  if (!ok) return;

  await softDeletePageRecursive(pageId);
  if (currentPageId === pageId) showEmptyPageState();

  showToast(`Đã chuyển "${title || "trang này"}" vào thùng rác`, {
    actionLabel: "Hoàn tác",
    duration: 5000,
    onAction: async () => {
      await restorePageRecursive(pageId);
      showToast("Đã khôi phục");
    }
  });
}

/* Xóa mềm: đánh dấu deleted=true trên trang + toàn bộ trang con + toàn bộ khối bên trong,
   KHÔNG xóa dữ liệu thật - để có thể khôi phục từ Thùng rác trong 30 ngày. */
async function softDeletePageRecursive(pageId) {
  const blocksSnap = await getDocs(blocksCol(pageId));
  const batch = writeBatch(db);
  const now = serverTimestamp();
  blocksSnap.forEach((b) => batch.update(b.ref, { deleted: true, deletedAt: now }));
  batch.update(doc(db, "users", currentUser.uid, "pages", pageId), { deleted: true, deletedAt: now });
  await batch.commit();

  const children = [...pagesById.values()].filter((p) => p.parentId === pageId);
  for (const c of children) {
    await softDeletePageRecursive(c.id);
  }
}

/* Khôi phục: bỏ đánh dấu deleted trên trang + trang con + khối bên trong */
async function restorePageRecursive(pageId) {
  const blocksSnap = await getDocs(blocksCol(pageId));
  const batch = writeBatch(db);
  blocksSnap.forEach((b) => batch.update(b.ref, { deleted: false, deletedAt: null }));
  batch.update(doc(db, "users", currentUser.uid, "pages", pageId), { deleted: false, deletedAt: null });
  await batch.commit();

  const children = [...pagesById.values()].filter((p) => p.parentId === pageId);
  for (const c of children) {
    await restorePageRecursive(c.id);
  }
}

/* Xóa vĩnh viễn thật sự - chỉ gọi từ Thùng rác hoặc tự động dọn sau 30 ngày */
async function permanentlyDeletePageRecursive(pageId) {
  const blocksSnap = await getDocs(blocksCol(pageId));
  for (const b of blocksSnap.docs) {
    const data = b.data();
    if (data.type === "image" && data.storagePath) deleteImageFromBlob(data.storagePath);
    if (data.type === "todo") {
      const imgs = data.descImages || (data.descImageUrl ? [data.descImageUrl] : []);
      imgs.forEach((url) => deleteImageFromBlob(url));
    }
  }
  const batch = writeBatch(db);
  blocksSnap.forEach((b) => batch.delete(b.ref));
  await batch.commit();

  const children = [...pagesById.values()].filter((p) => p.parentId === pageId);
  for (const c of children) {
    await permanentlyDeletePageRecursive(c.id);
  }
  await deleteDoc(doc(db, "users", currentUser.uid, "pages", pageId));
}

deletePageBtn.addEventListener("click", () => {
  if (!currentPageId) return;
  const p = pagesById.get(currentPageId);
  deletePageWithConfirm(currentPageId, p?.title);
});

/* ---------------- Page title / icon ---------------- */
const saveTitleDebounced = debounce((pageId, title) => {
  updateDoc(doc(db, "users", currentUser.uid, "pages", pageId), {
    title, updatedAt: serverTimestamp()
  });
}, 500);

pageTitleEl.addEventListener("input", () => {
  if (!currentPageId) return;
  saveTitleDebounced(currentPageId, pageTitleEl.textContent.trim());
});
pageTitleEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") e.preventDefault();
});

pageIconBtn.addEventListener("click", () => {
  if (!currentPageId) return;
  const emoji = prompt("Nhập 1 emoji làm biểu tượng trang:", pageIconBtn.textContent);
  if (emoji === null) return;
  const clean = emoji.trim() || "📄";
  pageIconBtn.textContent = clean;
  updateDoc(doc(db, "users", currentUser.uid, "pages", currentPageId), {
    icon: clean, updatedAt: serverTimestamp()
  });
});

/* ---------------- Open page / blocks ---------------- */
function showEmptyPageState() {
  currentView = "empty";
  currentPageId = null;
  pageView.classList.add("hidden");
  pageSkeleton.classList.add("hidden");
  todayView.classList.add("hidden");
  todayNavBtn.classList.remove("active");
  trashView.classList.add("hidden");
  trashNavBtn.classList.remove("active");
  emptyState.classList.remove("hidden");
  if (unsubBlocks) unsubBlocks();
    if (unsubToday) unsubToday();
    if (unsubTrashPages) unsubTrashPages();
    if (unsubTrashBlocks) unsubTrashBlocks();
    blockElements.clear();
    blocksContainer.innerHTML = "";
  renderTree();
  closeSidebarOnMobile();
}

function openPage(pageId) {
  currentView = "page";
  currentPageId = pageId;
  emptyState.classList.add("hidden");
  todayView.classList.add("hidden");
  trashView.classList.add("hidden");
  if (unsubToday) unsubToday();
  if (unsubTrashPages) unsubTrashPages();
  if (unsubTrashBlocks) unsubTrashBlocks();
  todayNavBtn.classList.remove("active");
  trashNavBtn.classList.remove("active");

  const p = pagesById.get(pageId);
  pageTitleEl.textContent = p?.title || "";
  pageIconBtn.textContent = p?.icon || "📄";
  renderPageDateLabel(p);
  renderBreadcrumb(pageId);
  renderPageTags(pageId);
  pushRecentPage(pageId);
  activeSortMode = null;
  activeGroupMode = null;
  latestBlocks = [];
  updateViewStatusBar();

  pageView.classList.add("hidden");
  pageSkeleton.classList.remove("hidden");

  renderTree();
  subscribeToBlocks(pageId);
  closeSidebarOnMobile();
}

function subscribeToBlocks(pageId) {
  if (unsubBlocks) unsubBlocks();
  blockElements.clear();
  blocksContainer.innerHTML = ""; // xóa DOM block của trang cũ, tránh bị lặp khi chuyển trang
  blocksViewWasGrouped = false;
  let firstLoad = true;
  const q = query(blocksCol(pageId), orderBy("order", "asc"));
  unsubBlocks = onSnapshot(q, (snap) => {
    if (firstLoad) {
      firstLoad = false;
      pageSkeleton.classList.add("hidden");
      pageView.classList.remove("hidden");
    }
    const blocks = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((b) => !b.deleted);
    latestBlocks = blocks;
    renderBlocksView(blocks);
    // Tự vá field "uid" / "deleted" cho block cũ tạo trước khi có các field này
    snap.docs.forEach((d) => {
      const data = d.data();
      const patch = {};
      if (!data.uid) patch.uid = currentUser.uid;
      if (data.deleted === undefined) patch.deleted = false;
      if (Object.keys(patch).length) updateDoc(d.ref, patch).catch(() => {});
    });
  }, (err) => {
    console.error(err);
    pageSkeleton.classList.add("hidden");
    pageView.classList.remove("hidden");
    showToast("Lỗi tải nội dung trang");
  });
}

/* ---------------- Blocks: render ---------------- */
let draggedBlockId = null;

let blocksViewWasGrouped = false; // để renderBlocks() biết cần dọn sạch label nhóm còn sót khi chuyển từ chế độ Nhóm về phẳng

function renderBlocks(blocks) {
  if (blocksViewWasGrouped) {
    // Chuyển từ chế độ Nhóm về phẳng: các .block-group-label không nằm trong blockElements
    // nên cơ chế dọn dẹp bên dưới (dựa theo id) sẽ bỏ sót chúng - phải xóa sạch DOM trước.
    blockElements.clear();
    blocksContainer.innerHTML = "";
    blocksViewWasGrouped = false;
  }
  // Chỉ "bảo vệ" DOM khi người dùng đang THỰC SỰ gõ chữ (contenteditable/input/textarea).
  // Trước đây bảo vệ luôn khi bấm nút (ưu tiên, ngày hạn...) khiến phải load lại trang mới thấy cập nhật.
  const active = document.activeElement;
  const isEditingText = !!active && (active.isContentEditable || active.tagName === "INPUT" || active.tagName === "TEXTAREA");
  const activeBlockEl = isEditingText ? active.closest?.(".block") : null;
  const activeId = activeBlockEl?.dataset?.id || null;
  const seen = new Set();

  blocks.forEach((b, idx) => {
    seen.add(b.id);
    const existing = blockElements.get(b.id);

    if (existing && b.id === activeId) {
      // Đang gõ trong khối này - giữ nguyên DOM, chỉ đảm bảo đúng vị trí
      if (blocksContainer.children[idx] !== existing) {
        blocksContainer.insertBefore(existing, blocksContainer.children[idx] || null);
      }
      return;
    }

    const el = buildBlockEl(b, blocks);
    blockElements.set(b.id, el);
    if (existing && existing.parentNode === blocksContainer) {
      existing.remove(); // gỡ khỏi vị trí cũ - quan trọng khi thứ tự đã đổi (kéo-thả)
    }
    // Luôn chèn vào đúng vị trí idx theo thứ tự mới, không "thay tại chỗ" (tránh sai thứ tự sau khi kéo-thả)
    blocksContainer.insertBefore(el, blocksContainer.children[idx] || null);
  });

  [...blockElements.keys()].forEach((id) => {
    if (!seen.has(id)) {
      blockElements.get(id)?.remove();
      blockElements.delete(id);
    }
  });
}

/* ---------------- Icon set (line-icons, đồng nhất phong cách, không phụ thuộc CDN) ---------------- */
const ICONS = {
  text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="18" x2="12" y2="18"/></svg>',
  heading: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 5v14M15 5v14M5 12h10"/><path d="M19 8v11M17 8h4"/></svg>',
  todo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 12l2.4 2.4L16 9"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.6"/><path d="M21 15l-5-5-9 9"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v18"/><path d="M5 4h11l-2.5 4L16 12H5"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"/></svg>',
  grip: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>'
};
function iconEl(name, className) {
  const span = document.createElement("span");
  span.className = className || "";
  span.innerHTML = ICONS[name] || "";
  return span;
}

function buildInsertZone(prevBlock, nextBlock) {
  const zone = document.createElement("div");
  zone.className = "block-insert-zone";
  const btn = document.createElement("button");
  btn.className = "block-insert-btn";
  btn.type = "button";
  btn.title = "Chèn khối vào đây";
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    openAddBlockMenuAt(zone, prevBlock, nextBlock);
  });
  zone.appendChild(btn);
  return zone;
}

function buildBlockEl(block, allBlocks) {
  const row = document.createElement("div");
  row.className = "block";
  row.draggable = false; // chỉ bật draggable khi bắt đầu kéo từ tay cầm (xem handle.mousedown bên dưới)
  row.dataset.id = block.id;

  const reorderDisabled = !!(activeSortMode || activeGroupMode);

  row.addEventListener("dragstart", () => {
    if (reorderDisabled) return;
    draggedBlockId = block.id;
    row.classList.add("dragging");
  });
  row.addEventListener("dragend", () => {
    row.classList.remove("dragging");
    row.draggable = false;
  });
  row.addEventListener("dragover", (e) => { if (!reorderDisabled) e.preventDefault(); });
  row.addEventListener("drop", (e) => {
    if (reorderDisabled) return;
    e.preventDefault();
    if (!draggedBlockId || draggedBlockId === block.id) return;
    reorderBlocks(draggedBlockId, block.id, allBlocks);
  });

  const idx = allBlocks.findIndex((b) => b.id === block.id);
  const prevBlock = idx > 0 ? allBlocks[idx - 1] : null;
  if (!reorderDisabled) row.appendChild(buildInsertZone(prevBlock, block));

  const handle = document.createElement("div");
  handle.className = "block-handle";
  handle.appendChild(iconEl("grip"));
  if (reorderDisabled) {
    handle.style.opacity = "0.25";
    handle.style.cursor = "not-allowed";
    handle.title = "Bỏ Sắp xếp/Nhóm để kéo-thả sắp xếp thủ công";
  } else {
    handle.addEventListener("mousedown", () => { row.draggable = true; });
    handle.addEventListener("mouseup", () => { row.draggable = false; });
  }

  const typeIcon = iconEl(block.type === "heading" ? "heading" : block.type, "block-type-icon");

  const body = document.createElement("div");
  body.className = "block-body";
  body.appendChild(buildBlockBody(block));

  const del = document.createElement("button");
  del.className = "block-delete";
  del.appendChild(iconEl("trash"));
  del.title = "Xóa khối";
  del.addEventListener("click", () => deleteBlock(block));

  const timeLabel = document.createElement("span");
  timeLabel.className = "block-time";
  timeLabel.dataset.createdAt = block.createdAt?.toMillis ? block.createdAt.toMillis() : "";
  timeLabel.textContent = formatBlockTime(block.createdAt);
  timeLabel.title = fullDateTimeLabel(block.createdAt);

  row.append(handle, typeIcon, body, timeLabel, del);
  return row;
}

/* ---------------- Thời gian tạo khối ---------------- */
function formatBlockTime(ts) {
  if (!ts?.toDate) return "";
  const d = ts.toDate();
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "Vừa xong";
  if (min < 60) return `${min} phút trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} giờ trước`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} ngày trước`;
  const sameYear = d.getFullYear() === new Date().getFullYear();
  const datePart = `${d.getDate()} thg ${d.getMonth() + 1}`;
  return sameYear ? datePart : `${datePart}, ${d.getFullYear()}`;
}
function fullDateTimeLabel(ts) {
  if (!ts?.toDate) return "";
  const d = ts.toDate();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `Tạo lúc ${hh}:${mm}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}
setInterval(() => {
  document.querySelectorAll(".block-time").forEach((el) => {
    const ms = Number(el.dataset.createdAt);
    if (!ms) return;
    el.textContent = formatBlockTime({ toDate: () => new Date(ms) });
  });
}, 60000);

function buildBlockBody(block) {
  switch (block.type) {
    case "heading":
      return buildEditableText(block, "block-heading", "Tiêu đề...");
    case "todo":
      return buildTodo(block);
    case "image":
      return buildImage(block);
    case "link":
      return buildLink(block);
    case "text":
    default:
      return buildEditableText(block, "block-text", "Nhập văn bản...");
  }
}

function buildEditableText(block, className, placeholder) {
  const div = document.createElement("div");
  div.className = className;
  div.contentEditable = "true";
  div.dataset.placeholder = placeholder;
  div.textContent = block.content || "";
  const save = debounce(() => {
    updateDoc(blockRef(currentPageId, block.id), { content: div.textContent });
  }, 500);
  div.addEventListener("input", save);
  return div;
}

/* ---------------- Todo: due date, priority, detail modal ---------------- */
const PRIORITY_LABELS = { high: "Cao", medium: "Trung bình", low: "Thấp" };
const PRIORITY_ORDER = [null, "low", "medium", "high"];

function formatDueDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}`;
}
function dueStatus(iso) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(iso + "T00:00:00");
  if (due < today) return "overdue";
  if (due.getTime() === today.getTime()) return "today";
  return "upcoming";
}

async function setTodoChecked(pageId, blockId, checked) {
  await updateDoc(blockRef(pageId, blockId), { checked });
  await updateDoc(doc(db, "users", currentUser.uid, "pages", pageId), {
    todoOpenCount: increment(checked ? -1 : 1)
  });
}

function buildTodo(block, pageIdOverride) {
  const pageId = pageIdOverride || currentPageId;
  const wrap = document.createElement("div");
  wrap.className = "block-todo" + (block.checked ? " checked" : "");

  // Ảnh bìa (Trello-style cover): dùng ảnh đầu tiên trong descImages, hoặc descImageUrl cũ (tương thích ngược)
  const images = block.descImages || (block.descImageUrl ? [block.descImageUrl] : []);
  if (images[0]) {
    const cover = document.createElement("div");
    cover.className = "todo-cover";
    const coverImg = document.createElement("img");
    coverImg.src = images[0];
    coverImg.alt = "";
    cover.appendChild(coverImg);
    cover.addEventListener("click", () => openDetailModal(pageId, block));
    wrap.appendChild(cover);
  }

  const top = document.createElement("div");
  top.className = "todo-top";

  const checkboxWrap = document.createElement("span");
  checkboxWrap.className = "checkbox-pop";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = !!block.checked;
  checkbox.addEventListener("change", () => {
    wrap.classList.toggle("checked", checkbox.checked);
    checkboxWrap.classList.remove("pop");
    void checkboxWrap.offsetWidth;
    checkboxWrap.classList.add("pop");
    setTodoChecked(pageId, block.id, checkbox.checked);
  });
  checkboxWrap.appendChild(checkbox);

  const rightCol = document.createElement("div");
  rightCol.style.flex = "1";
  rightCol.style.minWidth = "0";

  const text = document.createElement("div");
  text.className = "todo-text";
  text.contentEditable = "true";
  text.textContent = block.content || "";
  const save = debounce(() => {
    updateDoc(blockRef(pageId, block.id), { content: text.textContent });
  }, 500);
  text.addEventListener("input", save);

  const meta = document.createElement("div");
  meta.className = "todo-meta";

  if (block.dueDate) {
    const chip = document.createElement("span");
    chip.className = "due-chip " + dueStatus(block.dueDate);
    const timeLabel = block.dueTime ? ` ${block.dueTime}` : "";
    chip.appendChild(iconEl("calendar", "chip-icon"));
    chip.append(` ${formatDueDate(block.dueDate)}${timeLabel} `);
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "✕";
    clearBtn.title = "Bỏ hạn";
    clearBtn.addEventListener("click", () => {
      updateDoc(blockRef(pageId, block.id), { dueDate: null, dueTime: null });
    });
    chip.appendChild(clearBtn);
    meta.appendChild(chip);
  } else {
    const dateBtn = document.createElement("button");
    dateBtn.className = "todo-meta-btn";
    dateBtn.appendChild(iconEl("calendar", "chip-icon"));
    dateBtn.append(" Thêm hạn");
    dateBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "date";
      input.className = "due-date-input";
      input.addEventListener("change", () => {
        if (input.value) updateDoc(blockRef(pageId, block.id), { dueDate: input.value });
      });
      dateBtn.replaceWith(input);
      input.showPicker ? input.showPicker() : input.focus();
    });
    meta.appendChild(dateBtn);
  }

  const flagBtn = document.createElement("button");
  const currentPriority = block.priority || null;
  flagBtn.className = "priority-flag" + (currentPriority ? " set " + currentPriority : "");
  flagBtn.title = "Bấm để đổi mức ưu tiên";
  if (currentPriority) {
    const dot = document.createElement("span");
    dot.className = "priority-dot " + currentPriority;
    flagBtn.appendChild(dot);
    flagBtn.append(PRIORITY_LABELS[currentPriority]);
  } else {
    flagBtn.appendChild(iconEl("flag", "chip-icon"));
    flagBtn.append(" Ưu tiên");
  }
  flagBtn.addEventListener("click", () => {
    const idx = PRIORITY_ORDER.indexOf(currentPriority);
    const next = PRIORITY_ORDER[(idx + 1) % PRIORITY_ORDER.length];
    updateDoc(blockRef(pageId, block.id), { priority: next });
  });
  meta.appendChild(flagBtn);

  const files = block.descFiles || [];
  const links = block.descLinks || (block.descLinkUrl ? [{ url: block.descLinkUrl, label: block.descLinkLabel }] : []);
  const hasDetail = !!(block.description || images.length || links.length || files.length);
  const folderCount = [...new Set(
  files
    .map((f) => (f.path || f.webkitRelativePath || "").split("/").slice(0, -1).join("/"))
    .filter(Boolean)
  )].length;
  const expandBtn = document.createElement("button");
  expandBtn.className = "detail-expand-btn" + (hasDetail ? " has-content" : "");
  if (hasDetail) {
    const badges = [];
    if (block.description) badges.push("Mô tả");
    if (images.length) badges.push(`${images.length} ảnh`);
    if (links.length) badges.push(`${links.length} link`);
    if (files.length) {
      badges.push(folderCount > 0 ? `${files.length} tệp · ${folderCount} thư mục` : `${files.length} tệp`);
    }
    expandBtn.appendChild(iconEl("expand", "chip-icon"));
    expandBtn.append(" " + badges.join(" · "));
  } else {
    expandBtn.appendChild(iconEl("expand", "chip-icon"));
    expandBtn.append(" Mở rộng");
  }
  expandBtn.title = "Xem chi tiết: mô tả, ảnh, link, file";
  expandBtn.addEventListener("click", () => openDetailModal(pageId, block));
  meta.appendChild(expandBtn);

  rightCol.append(text, meta);
  top.append(checkboxWrap, rightCol);
  wrap.appendChild(top);
  return wrap;
}

/* ---------------- Detail modal (Trello-style) ---------------- */
function openDetailModal(pageId, block) {
  detailContext = { pageId, blockId: block.id };
  detailCheckbox.checked = !!block.checked;
  detailTitle.textContent = block.content || "";
  detailDescription.innerHTML = block.description || "";
  exitDescEditMode(); // luôn mở ở chế độ xem, không phải chỉnh sửa
  detailDueDate.value = block.dueDate || "";
  detailDueTime.value = block.dueTime || "";
  const images = block.descImages || (block.descImageUrl ? [block.descImageUrl] : []);
  const links = block.descLinks || (block.descLinkUrl ? [{ url: block.descLinkUrl, label: block.descLinkLabel }] : []);
  renderDetailImages(images);
  renderDetailLinks(links);
  renderDetailFiles(block.descFiles || []);
  detailModal.classList.remove("hidden");
  setTimeout(() => detailTitle.focus(), 50);
}
function closeDetailModal() {
  detailModal.classList.add("hidden");
  detailContext = null;
}
detailCloseBtn.addEventListener("click", closeDetailModal);
detailModal.addEventListener("click", (e) => { if (e.target === detailModal) closeDetailModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !detailModal.classList.contains("hidden")) closeDetailModal();
});

detailCheckbox.addEventListener("change", () => {
  if (!detailContext) return;
  setTodoChecked(detailContext.pageId, detailContext.blockId, detailCheckbox.checked);
});

const saveDetailTitle = debounce(() => {
  if (!detailContext) return;
  updateDoc(blockRef(detailContext.pageId, detailContext.blockId), { content: detailTitle.textContent });
}, 500);
detailTitle.addEventListener("input", saveDetailTitle);
detailTitle.addEventListener("keydown", (e) => { if (e.key === "Enter") e.preventDefault(); });

/* ---- Due date + time ---- */
function saveDetailDueDateTime() {
  if (!detailContext) return;
  updateDoc(blockRef(detailContext.pageId, detailContext.blockId), {
    dueDate: detailDueDate.value || null,
    dueTime: detailDueDate.value ? (detailDueTime.value || null) : null
  });
  showToast("Đã lưu thời gian !");
}
detailDueDate.addEventListener("change", saveDetailDueDateTime);
detailDueTime.addEventListener("change", saveDetailDueDateTime);

/* ---- Mô tả: chế độ Xem / Chỉnh sửa, toolbar định dạng bằng execCommand ---- */
function flushSaveDetailDescription() {
  if (!detailContext) return;
  updateDoc(blockRef(detailContext.pageId, detailContext.blockId), { description: detailDescription.innerHTML });
}
function updateWordCount() {
  const words = detailDescription.textContent.trim().split(/\s+/).filter(Boolean).length;
  detailWordCount.textContent = `${words} từ`;
}
function enterDescEditMode() {
  descEditBackupHTML = detailDescription.innerHTML;
  detailDescription.contentEditable = "true";
  detailToolbar.classList.remove("hidden");
  detailDescActions.classList.remove("hidden");
  detailWordCount.classList.remove("hidden");
  detailEditDescBtn.classList.add("hidden");
  updateWordCount();
  detailDescription.focus();
}
function exitDescEditMode() {
  detailDescription.contentEditable = "false";
  detailToolbar.classList.add("hidden");
  detailDescActions.classList.add("hidden");
  detailWordCount.classList.add("hidden");
  detailEditDescBtn.classList.remove("hidden");
}
detailEditDescBtn.addEventListener("click", enterDescEditMode);
detailSaveDescBtn.addEventListener("click", () => {
  flushSaveDetailDescription();
  exitDescEditMode();
  showToast("Đã lưu mô tả !");
});
detailCancelDescBtn.addEventListener("click", () => {
  detailDescription.innerHTML = descEditBackupHTML || "";
  exitDescEditMode();
});
detailDescription.addEventListener("input", () => {
  if (detailDescription.contentEditable === "true") updateWordCount();
});

function insertChecklistItem() {
  document.execCommand("insertHTML", false, '<div class="detail-checklist-item"><input type="checkbox"> <span>Việc cần làm</span></div>');
}
function insertTable() {
  document.execCommand("insertHTML", false, '<table><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></table><div><br></div>');
}

// Checkbox trong checklist bấm được cả khi đang xem (không cần bật Chỉnh sửa) - tự lưu ngay
detailDescription.addEventListener("click", (e) => {
  const checkbox = e.target.closest('.detail-checklist-item input[type="checkbox"]');
  if (!checkbox) return;
  checkbox.toggleAttribute("checked", checkbox.checked);
  checkbox.closest(".detail-checklist-item")?.classList.toggle("done", checkbox.checked);
  flushSaveDetailDescription();
});

detailToolbar.querySelectorAll("button[data-cmd]").forEach((btn) => {
  btn.addEventListener("mousedown", (e) => e.preventDefault());
  btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd;
    detailDescription.focus();
    if (cmd === "createLink") {
      const url = prompt("Dán URL:");
      if (url) document.execCommand("createLink", false, url);
    } else if (cmd === "checklist") {
      insertChecklistItem();
    } else if (cmd === "table") {
      insertTable();
    } else if (cmd === "image") {
      detailDescImageFileInput.click();
      return;
    } else if (btn.dataset.value) {
      document.execCommand(cmd, false, btn.dataset.value);
    } else {
      document.execCommand(cmd, false, null);
    }
    updateWordCount();
  });
});

detailDescImageFileInput.addEventListener("change", async () => {
  const file = detailDescImageFileInput.files[0];
  detailDescImageFileInput.value = "";
  if (!file) return;
  try {
    showToast("Đang tải ảnh lên...");
    const blob = await uploadImageToBlob(file);
    document.execCommand("insertHTML", false, `<img src="${blob.url}" alt="">`);
    updateWordCount();
    showToast("Đã tải ảnh lên thành công !");
  } catch (err) {
    console.error(err);
    showToast("Lỗi tải ảnh: " + err.message);
  }
});

// Kéo-thả ảnh trực tiếp vào vùng mô tả (chỉ khi đang ở chế độ Chỉnh sửa)
detailDescription.addEventListener("dragover", (e) => {
  if (detailDescription.contentEditable === "true") e.preventDefault();
});
detailDescription.addEventListener("drop", async (e) => {
  if (detailDescription.contentEditable !== "true") return;
  const file = [...(e.dataTransfer?.files || [])].find((f) => f.type.startsWith("image/"));
  if (!file) return;
  e.preventDefault();
  try {
    showToast("Đang tải ảnh lên...");
    const blob = await uploadImageToBlob(file);
    document.execCommand("insertHTML", false, `<img src="${blob.url}" alt="">`);
    updateWordCount();
    showToast("Đã tải ảnh lên thành công !");
  } catch (err) {
    console.error(err);
    showToast("Lỗi tải ảnh: " + err.message);
  }
});
function openDetailImageGallery(url, images) {
  if (typeof Fancybox === "undefined") return;

  const startIndex = images.indexOf(url);
  Fancybox.show(
    images.map((src) => ({ src, type: "image" })),
    {
      startIndex: startIndex >= 0 ? startIndex : 0
    }
  );
}
/* ---- Nhiều ảnh ---- */
function renderDetailImages(images) {
  detailImageWrap.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "detail-image-grid";
  images.forEach((url) => {
    const wrap = document.createElement("div");
    wrap.className = "detail-image-preview";
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Ảnh đính kèm";
    img.style.cursor = "pointer";
    img.addEventListener("click", () => openDetailImageGallery(url, images));

    const removeBtn = document.createElement("button");
    removeBtn.className = "detail-image-remove";
    removeBtn.textContent = "✕";
    removeBtn.title = "Xóa ảnh";
    removeBtn.addEventListener("click", async () => {
      if (!detailContext) return;
      const ok = await showConfirm("Xóa ảnh này?", "Ảnh sẽ bị xóa vĩnh viễn khỏi thẻ.", { danger: true, confirmText: "Xóa" });
      if (!ok) return;
      deleteImageFromBlob(url);
      const next = images.filter((u) => u !== url);
      await updateDoc(blockRef(detailContext.pageId, detailContext.blockId), { descImages: next });
      renderDetailImages(next);
      showToast("Đã xóa ảnh thành công !");
    });
    wrap.append(img, removeBtn);
    grid.appendChild(wrap);
  });
  detailImageWrap.appendChild(grid);

  const addBtn = document.createElement("button");
  addBtn.className = "btn";
  addBtn.textContent = "🏞️ Thêm ảnh";
  addBtn.addEventListener("click", () => detailImageFileInput.click());
  detailImageWrap.appendChild(addBtn);
}

detailImageFileInput.addEventListener("change", async () => {
  const file = detailImageFileInput.files[0];
  detailImageFileInput.value = "";
  if (!file || !detailContext) return;
  const uploadingMsg = document.createElement("div");
  uploadingMsg.className = "detail-image-uploading";
  uploadingMsg.textContent = "Đang tải ảnh lên...";
  detailImageWrap.appendChild(uploadingMsg);
  try {
    const blob = await uploadImageToBlob(file);
    const snap = await getDocs(blocksCol(detailContext.pageId));
    const current = snap.docs.find((d) => d.id === detailContext.blockId)?.data() || {};
    const images = current.descImages || (current.descImageUrl ? [current.descImageUrl] : []);
    const next = [...images, blob.url];
    await updateDoc(blockRef(detailContext.pageId, detailContext.blockId), { descImages: next });
    renderDetailImages(next);
    showToast("Đã tải ảnh lên thành công !");
  } catch (err) {
    console.error(err);
    showToast("Lỗi tải ảnh: " + err.message);
    uploadingMsg.remove();
  }
});

/* ---- Tệp đính kèm (bất kỳ loại file, kể cả upload cả thư mục) ---- */
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB - giới hạn body của Vercel Serverless Function

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

async function uploadRawFileToBlob(file) {
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
  const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
    method: "POST",
    body: file
  });
  if (!res.ok) {
    let message = `Tải lên thất bại (HTTP ${res.status})`;
    try { const data = await res.json(); if (data.error) message = data.error; } catch (_) {}
    throw new Error(message);
  }
  return res.json();
}

function renderDetailFiles(files) {
  detailFilesWrap.innerHTML = "";
  files.forEach((f) => {
    const row = document.createElement("div");
    row.className = "detail-file-item";
    const icon = document.createElement("div");
    icon.className = "detail-file-icon";
    icon.innerHTML = ICONS.file;
    const info = document.createElement("div");
    info.className = "detail-file-info";
    const a = document.createElement("a");
    a.className = "detail-file-name";
    a.href = f.url; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.textContent = f.name;
    const size = document.createElement("div");
    size.className = "detail-file-size";
    size.textContent = formatFileSize(f.size || 0);
    info.append(a, size);
    const removeBtn = document.createElement("button");
    removeBtn.className = "detail-file-remove";
    removeBtn.title = "Xóa tệp";
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", async () => {
      if (!detailContext) return;
      const ok = await showConfirm("Xóa tệp này?", `"${f.name}" sẽ bị xóa vĩnh viễn.`, { danger: true, confirmText: "Xóa" });
      if (!ok) return;
      deleteImageFromBlob(f.url);
      const next = files.filter((x) => x.url !== f.url);
      await updateDoc(blockRef(detailContext.pageId, detailContext.blockId), { descFiles: next });
      renderDetailFiles(next);
    });
    row.append(icon, info, removeBtn);
    detailFilesWrap.appendChild(row);
  });
}

async function handleFilesSelected(fileList) {
  if (!detailContext || !fileList.length) return;
  const snap = await getDocs(blocksCol(detailContext.pageId));
  let current = snap.docs.find((d) => d.id === detailContext.blockId)?.data() || {};
  let files = current.descFiles || [];

  for (const file of fileList) {
    if (file.size > MAX_FILE_SIZE) {
      showToast(`"${file.name}" vượt quá 4MB, bỏ qua`);
      continue;
    }
    const uploadingMsg = document.createElement("div");
    uploadingMsg.className = "detail-file-uploading";
    uploadingMsg.textContent = `Đang tải "${file.name}"...`;
    detailFilesWrap.appendChild(uploadingMsg);
    try {
      const blob = await uploadRawFileToBlob(file);
      files = [...files, { url: blob.url, name: file.name, size: file.size, type: file.type || "", path: file.webkitRelativePath || "" }];
      await updateDoc(blockRef(detailContext.pageId, detailContext.blockId), { descFiles: files });
      renderDetailFiles(files);
      showToast(`Đã tải "${file.name}" lên thành công !`);
    } catch (err) {
      console.error(err);
      showToast(`Lỗi tải "${file.name}": ` + err.message);
      uploadingMsg.remove();
    }
  }
}

detailAddFilesBtn.addEventListener("click", () => detailFilesInput.click());
detailAddFolderBtn.addEventListener("click", () => detailFolderInput.click());
detailFilesInput.addEventListener("change", () => {
  handleFilesSelected([...detailFilesInput.files]);
  detailFilesInput.value = "";
});
detailFolderInput.addEventListener("change", () => {
  handleFilesSelected([...detailFolderInput.files]);
  detailFolderInput.value = "";
});

/* ---- Nhiều link ---- */
function renderDetailLinks(links) {
  detailLinkWrap.innerHTML = "";
  links.forEach((link, idx) => {
    const card = document.createElement("div");
    card.className = "detail-link-card";
    const a = document.createElement("a");
    a.href = link.url; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.textContent = link.label || link.url;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.title = "Bỏ link";
    removeBtn.addEventListener("click", async () => {
      if (!detailContext) return;
      const ok = await showConfirm("Bỏ liên kết này?", "", { danger: true, confirmText: "Bỏ link" });
      if (!ok) return;
      const next = links.filter((_, i) => i !== idx);
      await updateDoc(blockRef(detailContext.pageId, detailContext.blockId), { descLinks: next });
      renderDetailLinks(next);
    });
    card.append(a, removeBtn);
    detailLinkWrap.appendChild(card);
  });

  const row = document.createElement("div");
  row.className = "link-edit-row";
  const input = document.createElement("input");
  input.placeholder = "Dán URL, ví dụ https://...";
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.textContent = "＋ Thêm link";
  btn.addEventListener("click", async () => {
    if (!detailContext) return;
    let cleanUrl = input.value.trim();
    if (!cleanUrl) return;
    if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = "https://" + cleanUrl;
    let hostname = cleanUrl;
    try { hostname = new URL(cleanUrl).hostname; } catch (_) {}
    const next = [...links, { url: cleanUrl, label: hostname }];
    await updateDoc(blockRef(detailContext.pageId, detailContext.blockId), { descLinks: next });
    renderDetailLinks(next);
    input.value = "";
    showToast("Đã thêm liên kết thành công !");
  });
  row.append(input, btn);
  detailLinkWrap.appendChild(row);
}

detailDeleteBtn.addEventListener("click", async () => {
  if (!detailContext) return;
  const ok = await showConfirm("Xóa thẻ này?", "Thẻ sẽ được chuyển vào Thùng rác, có thể khôi phục trong 30 ngày.", { danger: true, confirmText: "Xóa thẻ" });
  if (!ok) return;
  const { pageId, blockId } = detailContext;
  const snap = await getDocs(blocksCol(pageId));
  const blockDoc = snap.docs.find((d) => d.id === blockId);
  closeDetailModal();
  if (!blockDoc) return;
  await softDeleteBlock(pageId, { id: blockId, ...blockDoc.data() });
});

/* ---------------- Image / Link blocks (page content) ---------------- */
function buildImage(block) {
  const wrap = document.createElement("div");
  wrap.className = "block-image";
  if (block.imageUrl) {
    const frame = document.createElement("div");
    frame.className = "block-image-frame";
    const img = document.createElement("img");
    img.src = block.imageUrl;
    img.alt = "";
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      openDetailImageGallery(block.imageUrl, [block.imageUrl]);
    });
    const removeBtn = document.createElement("button");
    removeBtn.className = "detail-image-remove block-image-remove";
    removeBtn.textContent = "✕";
    removeBtn.title = "Xóa ảnh";
    removeBtn.addEventListener("click", async () => {
      const ok = await showConfirm("Xóa ảnh này?", "Ảnh sẽ bị xóa vĩnh viễn.", { danger: true, confirmText: "Xóa" });
      if (!ok) return;
      if (block.storagePath) deleteImageFromBlob(block.storagePath);
      await updateDoc(blockRef(currentPageId, block.id), { imageUrl: "", storagePath: "" });
    });
    frame.append(img, removeBtn);
    wrap.appendChild(frame);
  } else {
    const box = document.createElement("div");
    box.className = "block-image-empty";
    box.innerHTML = "Chưa có ảnh.";
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = "Tải ảnh lên";
    btn.addEventListener("click", () => {
      pendingImageBlockId = block.id;
      imageFileInput.click();
    });
    const urlBtn = document.createElement("button");
    urlBtn.className = "btn";
    urlBtn.style.marginLeft = "8px";
    urlBtn.textContent = "Dán link ảnh";
    urlBtn.addEventListener("click", () => {
      const url = prompt("Dán URL ảnh:");
      if (url) updateDoc(blockRef(currentPageId, block.id), { imageUrl: url.trim() });
    });
    box.append(document.createElement("br"), btn, urlBtn);
    wrap.appendChild(box);
  }
  return wrap;
}

imageFileInput.addEventListener("change", async () => {
  const file = imageFileInput.files[0];
  imageFileInput.value = "";
  if (!file || !pendingImageBlockId || !currentUser || !currentPageId) return;
  const blockId = pendingImageBlockId;
  pendingImageBlockId = null;
  try {
    showToast("Đang tải ảnh lên...");
    const blob = await uploadImageToBlob(file);
    await updateDoc(blockRef(currentPageId, blockId), { imageUrl: blob.url, storagePath: blob.url });
    showToast("Đã tải ảnh lên thành công !");
  } catch (err) {
    console.error(err);
    showToast("Lỗi tải ảnh: " + err.message);
  }
});

function buildLink(block) {
  const wrap = document.createElement("div");
  wrap.className = "block-link";
  if (block.url) {
    let hostname = block.url;
    try { hostname = new URL(block.url).hostname; } catch (_) {}
    const a = document.createElement("a");
    a.className = "link-card";
    a.href = block.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = `
      <span class="link-info">
        <span class="link-label">${escapeHtml(block.label || hostname)}</span>
        <span class="link-url">${escapeHtml(block.url)}</span>
      </span>
    `;
    wrap.appendChild(a);
  } else {
    const row = document.createElement("div");
    row.className = "link-edit-row";
    const input = document.createElement("input");
    input.placeholder = "Dán URL, ví dụ https://...";
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = "Lưu";
    btn.addEventListener("click", () => {
      let url = input.value.trim();
      if (!url) return;
      if (!/^https?:\/\//i.test(url)) url = "https://" + url;
      updateDoc(blockRef(currentPageId, block.id), { url });
    });
    row.append(input, btn);
    wrap.appendChild(row);
  }
  return wrap;
}

/* ---------------- Blocks: add / delete / reorder ---------------- */
let pendingInsertOrder = null; // null = thêm vào cuối trang; số = chèn vào đúng vị trí đó

/* Định vị menu "Thêm khối" bằng position:fixed + tọa độ tính bằng JS, gắn vào <body>.
   Bắt buộc phải làm vậy vì layout mới có overflow:hidden (.page-view) và overflow-y:auto
   (.blocksContainer) để cố định header/footer + cuộn phần giữa - nếu menu vẫn định vị kiểu
   position:absolute theo phần tử cha như trước, nó sẽ bị các vùng overflow đó cắt mất/ẩn đi
   mỗi khi mở từ 1 khối nằm giữa danh sách dài. */
function positionAddBlockMenu(anchorEl) {
  document.body.appendChild(addBlockMenu);
  const rect = anchorEl.getBoundingClientRect();
  const menuWidth = 200;
  const menuHeightEstimate = 230;

  let left = rect.left;
  if (left + menuWidth > window.innerWidth - 12) left = window.innerWidth - menuWidth - 12;
  left = Math.max(12, left);

  let top = rect.bottom + 6;
  if (top + menuHeightEstimate > window.innerHeight - 12) top = rect.top - menuHeightEstimate - 6;
  top = Math.max(12, top);

  addBlockMenu.style.left = `${left}px`;
  addBlockMenu.style.top = `${top}px`;
}

function openAddBlockMenuAt(anchorEl, prevBlock, nextBlock) {
  pendingInsertOrder = prevBlock ? (prevBlock.order + nextBlock.order) / 2 : nextBlock.order - 1;
  positionAddBlockMenu(anchorEl);
  addBlockMenu.classList.remove("hidden");
}

addBlockBtn.addEventListener("click", () => {
  const willOpen = addBlockMenu.classList.contains("hidden");
  pendingInsertOrder = null; // nút ở cuối trang luôn thêm vào cuối
  if (willOpen) positionAddBlockMenu(addBlockBtn);
  addBlockMenu.classList.toggle("hidden", !willOpen);
});
document.addEventListener("click", (e) => {
  if (!addBlockBtn.contains(e.target) && !addBlockMenu.contains(e.target) && !e.target.closest(".block-insert-btn")) {
    addBlockMenu.classList.add("hidden");
  }
});
addBlockMenu.querySelectorAll("button[data-type]").forEach((btn) => {
  btn.addEventListener("click", () => {
    addBlockMenu.classList.add("hidden");
    addBlock(btn.dataset.type, pendingInsertOrder);
    pendingInsertOrder = null;
  });
});

async function addBlock(type, insertOrder = null) {
  if (!currentPageId) return;
  let order;
  if (insertOrder !== null && insertOrder !== undefined) {
    order = insertOrder;
  } else {
    const snap = await getDocs(blocksCol(currentPageId));
    order = snap.size ? Math.max(...snap.docs.map((d) => d.data().order ?? 0)) + 1 : 0;
  }
  const base = { type, order, uid: currentUser.uid, deleted: false, deletedAt: null, createdAt: serverTimestamp() };
  if (type === "todo") {
    Object.assign(base, {
      content: "", checked: false, dueDate: null, dueTime: null, priority: null,
      description: "", descImages: [], descLinks: []
    });
  } else if (type === "image") Object.assign(base, { imageUrl: "" });
  else if (type === "link") Object.assign(base, { url: "", label: "" });
  else Object.assign(base, { content: "" });
  await addDoc(blocksCol(currentPageId), base);
  if (type === "todo") {
    await updateDoc(doc(db, "users", currentUser.uid, "pages", currentPageId), {
      todoTotalCount: increment(1), todoOpenCount: increment(1)
    });
  }
}

function blockPreviewLabel(block) {
  if (block.content) return block.content;
  if (block.type === "image") return "(Hình ảnh)";
  if (block.type === "link") return block.label || block.url || "(Liên kết)";
  return "(Không có nội dung)";
}

async function deleteBlock(block) {
  const ok = await showConfirm("Xóa khối này?", "Khối sẽ được chuyển vào Thùng rác, có thể khôi phục trong 30 ngày.", { danger: true, confirmText: "Xóa" });
  if (!ok) return;
  await softDeleteBlock(currentPageId, block);
}

/* Xóa mềm 1 khối - dùng cho cả nút xóa khối lẫn nút "Xóa thẻ này" trong modal chi tiết */
async function softDeleteBlock(pageId, block) {
  await updateDoc(blockRef(pageId, block.id), { deleted: true, deletedAt: serverTimestamp() });
  if (block.type === "todo") {
    await updateDoc(doc(db, "users", currentUser.uid, "pages", pageId), {
      todoTotalCount: increment(-1),
      todoOpenCount: increment(block.checked ? 0 : -1)
    });
  }
  showToast(`Đã chuyển "${blockPreviewLabel(block)}" vào thùng rác`, {
    actionLabel: "Hoàn tác",
    duration: 5000,
    onAction: async () => {
      await restoreBlock(pageId, block);
      showToast("Đã khôi phục");
    }
  });
}

/* deleteBlockById giữ lại tên cũ để tương thích các chỗ gọi trước đó - nay cũng là xóa mềm */
async function deleteBlockById(pageId, block) {
  await softDeleteBlock(pageId, block);
}

async function restoreBlock(pageId, block) {
  await updateDoc(blockRef(pageId, block.id), { deleted: false, deletedAt: null });
  if (block.type === "todo") {
    await updateDoc(doc(db, "users", currentUser.uid, "pages", pageId), {
      todoTotalCount: increment(1),
      todoOpenCount: increment(block.checked ? 0 : 1)
    });
  }
}

/* Xóa vĩnh viễn thật sự - chỉ gọi từ Thùng rác hoặc tự động dọn sau 30 ngày */
async function permanentlyDeleteBlock(pageId, block) {
  if (block.type === "image" && block.storagePath) deleteImageFromBlob(block.storagePath);
  if (block.type === "todo") {
    const images = block.descImages || (block.descImageUrl ? [block.descImageUrl] : []);
    images.forEach((url) => deleteImageFromBlob(url));
  }
  await deleteDoc(blockRef(pageId, block.id));
}

async function reorderBlocks(draggedId, targetId, allBlocks) {
  const ids = allBlocks.map((b) => b.id);
  const fromIdx = ids.indexOf(draggedId);
  const toIdx = ids.indexOf(targetId);
  if (fromIdx === -1 || toIdx === -1) return;
  ids.splice(toIdx, 0, ids.splice(fromIdx, 1)[0]);

  const batch = writeBatch(db);
  ids.forEach((id, idx) => {
    batch.update(blockRef(currentPageId, id), { order: idx });
  });
  await batch.commit();
}

/* ---------------- Today view: all open todos across pages ---------------- */
todayNavBtn.addEventListener("click", openTodayView);

function openTodayView() {
  currentView = "today";
  currentPageId = null;
  if (unsubBlocks) unsubBlocks();
  if (unsubTrashPages) unsubTrashPages();
  if (unsubTrashBlocks) unsubTrashBlocks();
  emptyState.classList.add("hidden");
  pageView.classList.add("hidden");
  pageSkeleton.classList.add("hidden");
  trashView.classList.add("hidden");
  trashNavBtn.classList.remove("active");
  todayView.classList.remove("hidden");
  todayNavBtn.classList.add("active");
  renderTree();
  closeSidebarOnMobile();
  subscribeToday();
}

function subscribeToday() {
  if (unsubToday) unsubToday();
  const q = query(
    collectionGroup(db, "blocks"),
    where("uid", "==", currentUser.uid),
    where("type", "==", "todo"),
    where("checked", "==", false)
  );
  unsubToday = onSnapshot(q, (snap) => {
    const items = [];
    snap.forEach((d) => {
      const pageId = d.ref.parent.parent.id;
      items.push({ id: d.id, pageId, ...d.data() });
    });
    renderTodayGroups(items);
  }, (err) => {
    console.error(err);
    showToast("Lỗi tải danh sách việc cần làm");
  });
}

function renderTodayGroups(items) {
  const priorityRank = { high: 0, medium: 1, low: 2, undefined: 3, null: 3 };
  const groups = { overdue: [], today: [], upcoming: [], none: [] };
  items.forEach((it) => {
    if (!it.dueDate) groups.none.push(it);
    else groups[dueStatus(it.dueDate)].push(it);
  });
  Object.values(groups).forEach((arr) =>
    arr.sort((a, b) => (priorityRank[a.priority] - priorityRank[b.priority]) || (a.dueDate || "").localeCompare(b.dueDate || ""))
  );

  const sections = [
    { key: "overdue", label: "⚠️ Quá hạn", cls: "overdue" },
    { key: "today", label: "☀️ Hôm nay", cls: "today" },
    { key: "upcoming", label: "📆 Sắp tới", cls: "" },
    { key: "none", label: "◽ Không có hạn", cls: "" }
  ];

  todayGroups.innerHTML = "";
  const total = items.length;
  todayEmpty.classList.toggle("hidden", total > 0);

  sections.forEach(({ key, label, cls }) => {
    const arr = groups[key];
    if (!arr.length) return;
    const section = document.createElement("div");
    const heading = document.createElement("div");
    heading.className = "today-group-label " + cls;
    heading.textContent = `${label} (${arr.length})`;
    section.appendChild(heading);
    arr.forEach((it) => section.appendChild(buildTodayItem(it)));
    todayGroups.appendChild(section);
  });
}

function buildTodayItem(item) {
  const row = document.createElement("div");
  row.className = "today-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = false;
  checkbox.addEventListener("change", () => setTodoChecked(item.pageId, item.id, true));

  const body = document.createElement("div");
  body.className = "today-item-body";

  const text = document.createElement("div");
  text.className = "today-item-text";
  text.textContent = item.content || "(không có nội dung)";
  text.style.cursor = "pointer";
  text.addEventListener("click", () => openDetailModal(item.pageId, item));

  const meta = document.createElement("div");
  meta.className = "today-item-meta";

  const page = pagesById.get(item.pageId);
  const pageLink = document.createElement("span");
  pageLink.className = "today-item-page";
  pageLink.textContent = `${page?.icon || "📄"} ${page?.title || "Không có tiêu đề"}`;
  pageLink.addEventListener("click", () => openPage(item.pageId));
  meta.appendChild(pageLink);

  if (item.dueDate) {
    const chip = document.createElement("span");
    chip.className = "due-chip " + dueStatus(item.dueDate);
    chip.appendChild(iconEl("calendar", "chip-icon"));
    chip.append(` ${formatDueDate(item.dueDate)}`);
    meta.appendChild(chip);
  }
  if (item.priority) {
    const dot = document.createElement("span");
    dot.className = "priority-dot " + item.priority;
    meta.appendChild(dot);
  }

  body.append(text, meta);
  row.append(checkbox, body);
  return row;
}

/* ---------------- Thùng rác ---------------- */
trashNavBtn.addEventListener("click", openTrashView);
settingsOpenTrashBtn.addEventListener("click", () => { closeSettingsModal(); openTrashView(); });

function openTrashView() {
  currentView = "trash";
  currentPageId = null;
  trashSelection.clear();
  if (unsubBlocks) unsubBlocks();
  if (unsubToday) unsubToday();
  emptyState.classList.add("hidden");
  pageView.classList.add("hidden");
  pageSkeleton.classList.add("hidden");
  todayView.classList.add("hidden");
  todayNavBtn.classList.remove("active");
  trashView.classList.remove("hidden");
  trashNavBtn.classList.add("active");
  renderTree();
  closeSidebarOnMobile();
  subscribeTrash();
  purgeOldTrash();
}

function subscribeTrash() {
  if (unsubTrashPages) unsubTrashPages();
  if (unsubTrashBlocks) unsubTrashBlocks();

  const pagesQ = query(pagesCol(), where("deleted", "==", true));
  unsubTrashPages = onSnapshot(pagesQ, (snap) => {
    trashedPages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderTrash();
  }, (err) => {
    console.error(err);
    showToast("Lỗi tải thùng rác (trang)");
  });

  const blocksQ = query(
    collectionGroup(db, "blocks"),
    where("uid", "==", currentUser.uid),
    where("deleted", "==", true)
  );
  unsubTrashBlocks = onSnapshot(blocksQ, (snap) => {
    trashedBlocks = snap.docs.map((d) => ({ id: d.id, pageId: d.ref.parent.parent.id, ...d.data() }));
    renderTrash();
  }, (err) => {
    console.error(err);
    showToast("Lỗi tải thùng rác (khối)");
  });
}

function daysLeft(deletedAt) {
  if (!deletedAt?.toMillis) return TRASH_RETENTION_DAYS;
  const elapsedMs = Date.now() - deletedAt.toMillis();
  const left = TRASH_RETENTION_DAYS - Math.floor(elapsedMs / 86400000);
  return Math.max(0, left);
}

function renderTrash() {
  const total = trashedPages.length + trashedBlocks.length;
  trashCountBadge.classList.toggle("hidden", total === 0);
  trashCountBadge.textContent = total;
  if (currentView !== "trash") return;

  trashToolbar.classList.toggle("hidden", total === 0);
  trashEmptyState.classList.toggle("hidden", total > 0);
  trashGroups.innerHTML = "";
  if (total === 0) { updateTrashToolbarState(); return; }

  if (trashedPages.length) {
    const section = document.createElement("div");
    const label = document.createElement("div");
    label.className = "trash-group-label";
    label.textContent = `📄 Trang đã xóa (${trashedPages.length})`;
    section.appendChild(label);
    trashedPages.forEach((p) => section.appendChild(buildTrashPageItem(p)));
    trashGroups.appendChild(section);
  }
  if (trashedBlocks.length) {
    const section = document.createElement("div");
    const label = document.createElement("div");
    label.className = "trash-group-label";
    label.textContent = `🧩 Khối đã xóa (${trashedBlocks.length})`;
    section.appendChild(label);
    trashedBlocks.forEach((b) => section.appendChild(buildTrashBlockItem(b)));
    trashGroups.appendChild(section);
  }
  updateTrashToolbarState();
}

function buildTrashPageItem(page) {
  const key = `page:${page.id}`;
  const row = document.createElement("div");
  row.className = "trash-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = trashSelection.has(key);
  checkbox.addEventListener("change", () => {
    checkbox.checked ? trashSelection.add(key) : trashSelection.delete(key);
    updateTrashToolbarState();
  });

  const body = document.createElement("div");
  body.className = "trash-item-body";
  const title = document.createElement("div");
  title.className = "trash-item-title";
  title.textContent = `${page.icon || "📄"} ${page.title || "Không có tiêu đề"}`;
  const meta = document.createElement("div");
  meta.className = "trash-item-meta";
  const left = daysLeft(page.deletedAt);
  const daysSpan = document.createElement("span");
  daysSpan.className = "trash-item-days" + (left <= 5 ? " soon" : "");
  daysSpan.textContent = `Còn ${left} ngày`;
  meta.appendChild(daysSpan);
  body.append(title, meta);

  const actions = document.createElement("div");
  actions.className = "trash-item-actions";
  const restoreBtn = document.createElement("button");
  restoreBtn.className = "trash-restore-btn";
  restoreBtn.title = "Khôi phục";
  restoreBtn.innerHTML = "↩";
  restoreBtn.addEventListener("click", async () => {
    await restorePageRecursive(page.id);
    trashSelection.delete(key);
    showToast("Đã khôi phục trang");
  });
  const delBtn = document.createElement("button");
  delBtn.className = "trash-delete-btn";
  delBtn.title = "Xóa vĩnh viễn";
  delBtn.innerHTML = "🗑";
  delBtn.addEventListener("click", async () => {
    const ok = await showConfirm("Xóa vĩnh viễn?", `"${page.title || "Trang này"}" và toàn bộ nội dung bên trong sẽ bị xóa vĩnh viễn, không thể khôi phục.`, { danger: true, confirmText: "Xóa vĩnh viễn" });
    if (!ok) return;
    await permanentlyDeletePageRecursive(page.id);
    trashSelection.delete(key);
    showToast("Đã xóa vĩnh viễn");
  });
  actions.append(restoreBtn, delBtn);

  row.append(checkbox, body, actions);
  return row;
}

function buildTrashBlockItem(block) {
  const key = `block:${block.pageId}:${block.id}`;
  const page = pagesById.get(block.pageId);
  const row = document.createElement("div");
  row.className = "trash-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = trashSelection.has(key);
  checkbox.addEventListener("change", () => {
    checkbox.checked ? trashSelection.add(key) : trashSelection.delete(key);
    updateTrashToolbarState();
  });

  const body = document.createElement("div");
  body.className = "trash-item-body";
  const title = document.createElement("div");
  title.className = "trash-item-title";
  title.textContent = blockPreviewLabel(block);
  const meta = document.createElement("div");
  meta.className = "trash-item-meta";
  const left = daysLeft(block.deletedAt);
  const daysSpan = document.createElement("span");
  daysSpan.className = "trash-item-days" + (left <= 5 ? " soon" : "");
  daysSpan.textContent = `Còn ${left} ngày`;
  const pageSpan = document.createElement("span");
  pageSpan.textContent = `từ trang: ${page?.icon || "📄"} ${page?.title || "Không rõ"}`;
  meta.append(daysSpan, pageSpan);
  body.append(title, meta);

  const actions = document.createElement("div");
  actions.className = "trash-item-actions";
  const restoreBtn = document.createElement("button");
  restoreBtn.className = "trash-restore-btn";
  restoreBtn.title = "Khôi phục";
  restoreBtn.innerHTML = "↩";
  restoreBtn.addEventListener("click", async () => {
    await restoreBlock(block.pageId, block);
    trashSelection.delete(key);
    showToast("Đã khôi phục khối");
  });
  const delBtn = document.createElement("button");
  delBtn.className = "trash-delete-btn";
  delBtn.title = "Xóa vĩnh viễn";
  delBtn.innerHTML = "🗑";
  delBtn.addEventListener("click", async () => {
    const ok = await showConfirm("Xóa vĩnh viễn?", "Khối này sẽ bị xóa vĩnh viễn, không thể khôi phục.", { danger: true, confirmText: "Xóa vĩnh viễn" });
    if (!ok) return;
    await permanentlyDeleteBlock(block.pageId, block);
    trashSelection.delete(key);
    showToast("Đã xóa vĩnh viễn");
  });
  actions.append(restoreBtn, delBtn);

  row.append(checkbox, body, actions);
  return row;
}

function allTrashKeys() {
  return [
    ...trashedPages.map((p) => `page:${p.id}`),
    ...trashedBlocks.map((b) => `block:${b.pageId}:${b.id}`)
  ];
}

function updateTrashToolbarState() {
  const all = allTrashKeys();
  const selectedCount = [...trashSelection].filter((k) => all.includes(k)).length;
  trashSelectedCount.textContent = selectedCount > 0 ? `Đã chọn ${selectedCount}` : "";
  trashSelectAllCheckbox.checked = all.length > 0 && selectedCount === all.length;
  trashRestoreSelectedBtn.disabled = selectedCount === 0;
  trashDeleteSelectedBtn.disabled = selectedCount === 0;
  trashEmptyAllBtn.disabled = all.length === 0;
}

trashSelectAllCheckbox.addEventListener("change", () => {
  if (trashSelectAllCheckbox.checked) {
    allTrashKeys().forEach((k) => trashSelection.add(k));
  } else {
    trashSelection.clear();
  }
  renderTrash();
});

async function resolveTrashKey(key) {
  const [kind, a, b] = key.split(":");
  if (kind === "page") return { kind, page: trashedPages.find((p) => p.id === a) };
  return { kind, block: trashedBlocks.find((bl) => bl.pageId === a && bl.id === b), pageId: a };
}

trashRestoreSelectedBtn.addEventListener("click", async () => {
  const keys = [...trashSelection];
  if (!keys.length) return;
  for (const key of keys) {
    const item = await resolveTrashKey(key);
    if (item.kind === "page" && item.page) await restorePageRecursive(item.page.id);
    else if (item.kind === "block" && item.block) await restoreBlock(item.pageId, item.block);
  }
  trashSelection.clear();
  showToast(`Đã khôi phục ${keys.length} mục`);
});

trashDeleteSelectedBtn.addEventListener("click", async () => {
  const keys = [...trashSelection];
  if (!keys.length) return;
  const ok = await showConfirm("Xóa vĩnh viễn các mục đã chọn?", `${keys.length} mục sẽ bị xóa vĩnh viễn, không thể khôi phục.`, { danger: true, confirmText: "Xóa vĩnh viễn" });
  if (!ok) return;
  for (const key of keys) {
    const item = await resolveTrashKey(key);
    if (item.kind === "page" && item.page) await permanentlyDeletePageRecursive(item.page.id);
    else if (item.kind === "block" && item.block) await permanentlyDeleteBlock(item.pageId, item.block);
  }
  trashSelection.clear();
  showToast(`Đã xóa vĩnh viễn ${keys.length} mục`);
});

trashEmptyAllBtn.addEventListener("click", async () => {
  const total = trashedPages.length + trashedBlocks.length;
  if (!total) return;
  const ok = await showConfirm("Xóa tất cả trong thùng rác?", `Toàn bộ ${total} mục sẽ bị xóa vĩnh viễn, không thể khôi phục.`, { danger: true, confirmText: "Xóa tất cả" });
  if (!ok) return;
  for (const p of [...trashedPages]) await permanentlyDeletePageRecursive(p.id);
  for (const b of [...trashedBlocks]) await permanentlyDeleteBlock(b.pageId, b);
  trashSelection.clear();
  showToast("Đã dọn sạch thùng rác");
});

/* Tự động xóa vĩnh viễn các mục đã nằm trong thùng rác quá 30 ngày - chạy mỗi khi mở Thùng rác */
async function purgeOldTrash() {
  try {
    const cutoff = Date.now() - TRASH_RETENTION_DAYS * 86400000;
    const pagesSnap = await getDocs(query(pagesCol(), where("deleted", "==", true)));
    for (const d of pagesSnap.docs) {
      const data = d.data();
      if (data.deletedAt?.toMillis && data.deletedAt.toMillis() < cutoff) {
        await permanentlyDeletePageRecursive(d.id);
      }
    }
    const blocksSnap = await getDocs(query(
      collectionGroup(db, "blocks"),
      where("uid", "==", currentUser.uid),
      where("deleted", "==", true)
    ));
    for (const d of blocksSnap.docs) {
      const data = d.data();
      if (data.deletedAt?.toMillis && data.deletedAt.toMillis() < cutoff) {
        const pageId = d.ref.parent.parent.id;
        await permanentlyDeleteBlock(pageId, { id: d.id, ...data });
      }
    }
  } catch (err) {
    console.error("purgeOldTrash lỗi:", err);
  }
}

/* ---------------- Cài đặt ---------------- */
function hasPasswordLinked() {
  return !!currentUser?.providerData?.some((p) => p.providerId === "password");
}
function openSettingsModal() {
  settingsAvatar.src = currentUser?.photoURL || "";
  settingsName.textContent = currentUser?.displayName || "Người dùng";
  settingsEmail.textContent = currentUser?.email || "";
  settingsPasswordForm.classList.toggle("hidden", hasPasswordLinked());
  settingsPasswordDone.classList.toggle("hidden", !hasPasswordLinked());
  settingsModal.classList.remove("hidden");
  settingsEmailInline.textContent = currentUser?.email || "";
}
settingsSetPasswordBtn.addEventListener("click", async () => {
  const password = settingsNewPasswordInput.value;
  if (!password || password.length < 6) return showToast("Mật khẩu cần ít nhất 6 ký tự");
  try {
    const cred = EmailAuthProvider.credential(currentUser.email, password);
    await linkWithCredential(currentUser, cred);
    settingsNewPasswordInput.value = "";
    settingsPasswordForm.classList.add("hidden");
    settingsPasswordDone.classList.remove("hidden");
    showToast("Đã đặt mật khẩu phụ - dùng email + mật khẩu này để đăng nhập trên máy lạ");
  } catch (err) {
    console.error(err);
    showToast("Lỗi: " + err.message);
  }
});
function closeSettingsModal() {
  settingsModal.classList.add("hidden");
}
settingsNavBtn.addEventListener("click", openSettingsModal);
settingsCloseBtn.addEventListener("click", closeSettingsModal);
settingsModal.addEventListener("click", (e) => { if (e.target === settingsModal) closeSettingsModal(); });
settingsLogoutBtn.addEventListener("click", () => {
  closeSettingsModal();
  logoutBtn.click();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !settingsModal.classList.contains("hidden")) closeSettingsModal();
});

/* ---------------- Phím tắt: Ctrl/Cmd + Shift + O = Trang mới ---------------- */
document.addEventListener("keydown", (e) => {
  if (!currentUser) return;
  const key = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === "o") {
    e.preventDefault();
    createPage(null);
  }
});

/* ---------------- Breadcrumb ---------------- */
function renderBreadcrumb(pageId) {
  const chain = [];
  let cur = pagesById.get(pageId);
  while (cur?.parentId) {
    const parent = pagesById.get(cur.parentId);
    if (!parent) break;
    chain.unshift(parent);
    cur = parent;
  }
  pageBreadcrumb.innerHTML = "";
  pageBreadcrumb.classList.toggle("hidden", chain.length === 0);
  chain.forEach((p) => {
    const item = document.createElement("span");
    item.className = "page-breadcrumb-item";
    item.textContent = `${p.icon || "📄"} ${p.title || "Không có tiêu đề"}`;
    item.addEventListener("click", () => openPage(p.id));
    pageBreadcrumb.appendChild(item);
    const sep = document.createElement("span");
    sep.className = "page-breadcrumb-sep";
    sep.textContent = "/";
    pageBreadcrumb.appendChild(sep);
  });
}

/* ---------------- Tags (đơn giản, gắn ở cấp trang) ---------------- */
function renderPageTags(pageId) {
  const page = pagesById.get(pageId);
  const tags = page?.tags || [];
  pageTagsRow.innerHTML = "";
  tags.forEach((tag) => {
    const chip = document.createElement("span");
    chip.className = "page-tag-chip";
    const label = document.createElement("span");
    label.textContent = tag;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.title = "Bỏ tag";
    removeBtn.addEventListener("click", async () => {
      const next = tags.filter((t) => t !== tag);
      await updateDoc(doc(db, "users", currentUser.uid, "pages", pageId), { tags: next, updatedAt: serverTimestamp() });
    });
    chip.append(label, removeBtn);
    pageTagsRow.appendChild(chip);
  });
  const addBtn = document.createElement("button");
  addBtn.className = "page-tag-add-btn";
  addBtn.textContent = "+ Tag";
  addBtn.addEventListener("click", async () => {
    const input = prompt("Thêm tag mới:");
    const value = input?.trim();
    if (!value || tags.includes(value)) return;
    await updateDoc(doc(db, "users", currentUser.uid, "pages", pageId), { tags: [...tags, value], updatedAt: serverTimestamp() });
  });
  pageTagsRow.appendChild(addBtn);
}

function getAllTags() {
  const set = new Set();
  pagesById.forEach((p) => { if (!p.deleted) (p.tags || []).forEach((t) => set.add(t)); });
  return [...set].sort();
}

/* ---------------- Recent pages (localStorage) ---------------- */
const RECENT_KEY = "duotodo_recent_pages";
function pushRecentPage(pageId) {
  try {
    let list = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    list = list.filter((id) => id !== pageId);
    list.unshift(pageId);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 8)));
  } catch (e) {}
}
function getRecentPages() {
  try {
    const ids = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return ids.map((id) => pagesById.get(id)).filter((p) => p && !p.deleted);
  } catch (e) { return []; }
}

/* ---------------- Command Palette (Ctrl/Cmd + K) ---------------- */
let paletteAllBlocks = [];
let paletteBlocksLoaded = false;
let paletteTagFilter = new Set();
let paletteActiveIndex = -1;

function pagePathLabel(pageId) {
  const chain = [];
  let cur = pagesById.get(pageId);
  while (cur) { chain.unshift(cur.title || "Không có tiêu đề"); cur = cur.parentId ? pagesById.get(cur.parentId) : null; }
  return chain.join(" / ");
}

async function ensurePaletteBlocksLoaded() {
  if (paletteBlocksLoaded || !currentUser) return;
  try {
    const snap = await getDocs(query(collectionGroup(db, "blocks"), where("uid", "==", currentUser.uid)));
    paletteAllBlocks = snap.docs
      .map((d) => ({ id: d.id, pageId: d.ref.parent.parent.id, ...d.data() }))
      .filter((b) => !b.deleted && b.content);
    paletteBlocksLoaded = true;
  } catch (err) {
    console.error(err);
  }
}

function openPalette() {
  if (!currentUser) return;
  paletteModal.classList.remove("hidden");
  paletteInput.value = "";
  paletteInput.focus();
  renderPaletteTagDropdown();
  ensurePaletteBlocksLoaded().then(renderPaletteResults);
  renderPaletteResults();
}
function closePalette() {
  paletteModal.classList.add("hidden");
  paletteTagDropdown.classList.add("hidden");
}
searchTriggerBtn.addEventListener("click", openPalette);
paletteCloseBtn.addEventListener("click", closePalette);
paletteModal.addEventListener("click", (e) => { if (e.target === paletteModal) closePalette(); });
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    paletteModal.classList.contains("hidden") ? openPalette() : closePalette();
  } else if (e.key === "Escape" && !paletteModal.classList.contains("hidden")) {
    closePalette();
  }
});

function renderPaletteTagDropdown() {
  const tags = getAllTags();
  paletteTagDropdown.innerHTML = "";
  if (!tags.length) {
    paletteTagDropdown.innerHTML = '<div class="palette-tag-empty">Chưa có tag nào</div>';
    return;
  }
  tags.forEach((tag) => {
    const label = document.createElement("label");
    label.className = "palette-tag-option";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = paletteTagFilter.has(tag);
    cb.addEventListener("change", () => {
      cb.checked ? paletteTagFilter.add(tag) : paletteTagFilter.delete(tag);
      paletteTagFilterCount.textContent = paletteTagFilter.size;
      paletteTagFilterCount.classList.toggle("hidden", paletteTagFilter.size === 0);
      renderPaletteResults();
    });
    label.append(cb, document.createTextNode(tag));
    paletteTagDropdown.appendChild(label);
  });
}
paletteTagFilterBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  paletteTagDropdown.classList.toggle("hidden");
});
document.addEventListener("click", () => paletteTagDropdown.classList.add("hidden"));
paletteTagDropdown.addEventListener("click", (e) => e.stopPropagation());

function withinDateFilter(page) {
  const range = paletteDateRange.value;
  if (range === "all") return true;
  const field = paletteDateField.value;
  const ts = page[field];
  if (!ts?.toMillis) return true;
  const days = Number(range);
  return Date.now() - ts.toMillis() <= days * 86400000;
}

function highlightMatch(text, q) {
  if (!q) return escapeHtml(text);
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return escapeHtml(text);
  return escapeHtml(text.slice(0, idx)) + "<mark>" + escapeHtml(text.slice(idx, idx + q.length)) + "</mark>" + escapeHtml(text.slice(idx + q.length));
}

paletteInput.addEventListener("input", renderPaletteResults);
paletteDateField.addEventListener("change", renderPaletteResults);
paletteDateRange.addEventListener("change", renderPaletteResults);

function renderPaletteResults() {
  const q = paletteInput.value.trim().toLowerCase();
  paletteActiveIndex = -1;
  paletteResults.innerHTML = "";

  let pages = [...pagesById.values()].filter((p) => !p.deleted);
  if (paletteTagFilter.size) pages = pages.filter((p) => (p.tags || []).some((t) => paletteTagFilter.has(t)));
  pages = pages.filter(withinDateFilter);

  if (!q) {
    const recents = getRecentPages().filter((p) => pages.includes(p));
    if (!recents.length) {
      paletteResults.innerHTML = '<div class="palette-empty">Gõ để tìm trang, việc cần làm, ghi chú...</div>';
      return;
    }
    const label = document.createElement("div");
    label.className = "palette-section-label";
    label.textContent = "Gần đây";
    paletteResults.appendChild(label);
    recents.forEach((p) => paletteResults.appendChild(buildPaletteItem({ kind: "page", page: p }, "")));
    updatePaletteActiveHighlight();
    return;
  }

  const pageMatches = pages.filter((p) => (p.title || "").toLowerCase().includes(q));
  const pageIdsInFilter = new Set(pages.map((p) => p.id));
  const blockMatches = paletteAllBlocks
    .filter((b) => pageIdsInFilter.has(b.pageId) && (b.content || "").toLowerCase().includes(q))
    .slice(0, 25);

  if (!pageMatches.length && !blockMatches.length) {
    paletteResults.innerHTML = '<div class="palette-empty">Không tìm thấy kết quả nào</div>';
    return;
  }

  if (pageMatches.length) {
    const label = document.createElement("div");
    label.className = "palette-section-label";
    label.textContent = `Trang (${pageMatches.length})`;
    paletteResults.appendChild(label);
    pageMatches.forEach((p) => paletteResults.appendChild(buildPaletteItem({ kind: "page", page: p }, q)));
  }
  if (blockMatches.length) {
    const label = document.createElement("div");
    label.className = "palette-section-label";
    label.textContent = `Nội dung (${blockMatches.length})`;
    paletteResults.appendChild(label);
    blockMatches.forEach((b) => paletteResults.appendChild(buildPaletteItem({ kind: "block", block: b }, q)));
  }
  updatePaletteActiveHighlight();
}

function buildPaletteItem(entry, q) {
  const row = document.createElement("div");
  row.className = "palette-item";

  const icon = document.createElement("div");
  icon.className = "palette-item-icon";
  const body = document.createElement("div");
  body.className = "palette-item-body";
  const title = document.createElement("div");
  title.className = "palette-item-title";
  const path = document.createElement("div");
  path.className = "palette-item-path";

  if (entry.kind === "page") {
    icon.textContent = entry.page.icon || "📄";
    title.innerHTML = highlightMatch(entry.page.title || "Không có tiêu đề", q);
    path.textContent = pagePathLabel(entry.page.id);
    row.addEventListener("click", () => { closePalette(); openPage(entry.page.id); });
  } else {
    icon.appendChild(iconEl(entry.block.type === "heading" ? "heading" : entry.block.type));
    title.innerHTML = highlightMatch(entry.block.content || "", q);
    path.textContent = pagePathLabel(entry.block.pageId);
    row.addEventListener("click", () => { closePalette(); openPage(entry.block.pageId); });
  }
  body.append(title, path);
  row.append(icon, body);
  return row;
}

function paletteItemEls() { return [...paletteResults.querySelectorAll(".palette-item")]; }
function updatePaletteActiveHighlight() {
  const items = paletteItemEls();
  items.forEach((el, i) => el.classList.toggle("active", i === paletteActiveIndex));
  if (paletteActiveIndex >= 0) items[paletteActiveIndex]?.scrollIntoView({ block: "nearest" });
}
paletteInput.addEventListener("keydown", (e) => {
  const items = paletteItemEls();
  if (!items.length) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    paletteActiveIndex = Math.min(paletteActiveIndex + 1, items.length - 1);
    updatePaletteActiveHighlight();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    paletteActiveIndex = Math.max(paletteActiveIndex - 1, 0);
    updatePaletteActiveHighlight();
  } else if (e.key === "Enter" && paletteActiveIndex >= 0) {
    e.preventDefault();
    items[paletteActiveIndex]?.click();
  }
});

/* ---------------- Ngày tạo trang (hiện dưới tiêu đề) ---------------- */
const VN_WEEKDAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
function formatVietnameseDate(ts) {
  if (!ts?.toDate) return "";
  const d = ts.toDate();
  return `${VN_WEEKDAYS[d.getDay()]}, ngày ${d.getDate()} tháng ${d.getMonth() + 1}`;
}
function renderPageDateLabel(page) {
  pageDateLabel.textContent = formatVietnameseDate(page?.createdAt);
}

/* ---------------- Menu "..." của trang (thay nút xóa đứng riêng - sẽ thêm Sắp xếp/Nhóm ở đây sau) ---------------- */
function positionFixedMenu(menuEl, anchorEl) {
  document.body.appendChild(menuEl);
  const rect = anchorEl.getBoundingClientRect();
  const menuWidth = 200;
  const menuHeightEstimate = 120;

  let left = rect.right - menuWidth; // căn theo mép phải nút, giống ảnh minh họa
  if (left < 12) left = rect.left;
  left = Math.max(12, Math.min(left, window.innerWidth - menuWidth - 12));

  let top = rect.bottom + 6;
  if (top + menuHeightEstimate > window.innerHeight - 12) top = rect.top - menuHeightEstimate - 6;
  top = Math.max(12, top);

  menuEl.style.left = `${left}px`;
  menuEl.style.top = `${top}px`;
}

pageMenuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const willOpen = pageMenu.classList.contains("hidden");
  if (willOpen) positionFixedMenu(pageMenu, pageMenuBtn);
  pageMenu.classList.toggle("hidden", !willOpen);
});
document.addEventListener("click", (e) => {
  if (!pageMenu.classList.contains("hidden") && !pageMenu.contains(e.target) && e.target !== pageMenuBtn) {
    pageMenu.classList.add("hidden");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !pageMenu.classList.contains("hidden")) pageMenu.classList.add("hidden");
});
// Xóa trang giờ nằm trong menu "..." - đóng menu trước khi mở confirm để tránh 2 lớp che nhau
deletePageBtn.addEventListener("click", () => pageMenu.classList.add("hidden"), { capture: true });

/* ---------------- Sắp xếp & Nhóm khối ---------------- */
function getBlockSortText(block) {
  if (block.type === "link") return (block.label || block.url || "").toLowerCase();
  if (block.type === "image") return "hình ảnh";
  return (block.content || "").toLowerCase();
}
function blockDueMillis(block) {
  if (block.type !== "todo" || !block.dueDate) return Infinity;
  return new Date(`${block.dueDate}T${block.dueTime || "00:00"}`).getTime();
}
function sortBlocks(blocks, mode) {
  const arr = [...blocks];
  if (mode === "alpha") {
    arr.sort((a, b) => getBlockSortText(a).localeCompare(getBlockSortText(b), "vi"));
  } else if (mode === "createdAt") {
    arr.sort((a, b) => (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0));
  } else if (mode === "dueDate") {
    arr.sort((a, b) => blockDueMillis(a) - blockDueMillis(b));
  }
  return arr;
}

const BLOCK_TYPE_LABELS = { heading: "Tiêu đề", todo: "Việc cần làm", text: "Văn bản", image: "Hình ảnh", link: "Liên kết" };
function groupBlocks(blocks, mode) {
  if (mode === "type") {
    const order = ["heading", "todo", "text", "image", "link"];
    const buckets = {};
    blocks.forEach((b) => { (buckets[b.type] ||= []).push(b); });
    return order.filter((t) => buckets[t]?.length).map((t) => ({ label: BLOCK_TYPE_LABELS[t], items: buckets[t] }));
  }
  if (mode === "todoStatus") {
    const notDone = blocks.filter((b) => b.type === "todo" && !b.checked);
    const done = blocks.filter((b) => b.type === "todo" && b.checked);
    const others = blocks.filter((b) => b.type !== "todo");
    const groups = [];
    if (notDone.length) groups.push({ label: "Chưa hoàn thành", items: notDone });
    if (done.length) groups.push({ label: "Đã hoàn thành", items: done });
    if (others.length) groups.push({ label: "Khác (không phải việc cần làm)", items: others });
    return groups;
  }
  if (mode === "dueDate") {
    const buckets = { overdue: [], today: [], upcoming: [], none: [] };
    blocks.forEach((b) => {
      if (b.type !== "todo" || !b.dueDate) buckets.none.push(b);
      else buckets[dueStatus(b.dueDate)].push(b);
    });
    const groups = [];
    if (buckets.overdue.length) groups.push({ label: "⚠️ Quá hạn", items: buckets.overdue });
    if (buckets.today.length) groups.push({ label: "☀️ Hôm nay", items: buckets.today });
    if (buckets.upcoming.length) groups.push({ label: "📆 Sắp tới", items: buckets.upcoming });
    if (buckets.none.length) groups.push({ label: "Không có hạn / Khác", items: buckets.none });
    return groups;
  }
  return [{ label: null, items: blocks }];
}

function renderBlocksView(blocks) {
  let list = blocks;
  if (activeSortMode) list = sortBlocks(list, activeSortMode);

  if (activeGroupMode) {
    renderBlocksGrouped(groupBlocks(list, activeGroupMode));
  } else {
    renderBlocks(list);
  }
}

function renderBlocksGrouped(groups) {
  const active = document.activeElement;
  const isEditingText = !!active && (active.isContentEditable || active.tagName === "INPUT" || active.tagName === "TEXTAREA");
  if (isEditingText && blocksContainer.contains(active)) return; // đang gõ dở - bỏ qua lần render này để không mất nội dung/con trỏ

  blockElements.clear();
  blocksContainer.innerHTML = "";
  blocksViewWasGrouped = true;
  const flatOrder = groups.flatMap((g) => g.items);
  groups.forEach((g) => {
    if (g.label) {
      const label = document.createElement("div");
      label.className = "block-group-label";
      label.textContent = `${g.label} (${g.items.length})`;
      blocksContainer.appendChild(label);
    }
    g.items.forEach((b) => {
      const el = buildBlockEl(b, flatOrder);
      blockElements.set(b.id, el);
      blocksContainer.appendChild(el);
    });
  });
}

const SORT_MODE_LABELS = { dueDate: "Ngày đến hạn", alpha: "Thứ tự bảng chữ cái", createdAt: "Ngày tạo" };
const GROUP_MODE_LABELS = { type: "Loại khối", todoStatus: "Trạng thái hoàn thành", dueDate: "Ngày đến hạn" };

function updateViewStatusBar() {
  sortStatusChip.classList.toggle("hidden", !activeSortMode);
  if (activeSortMode) sortStatusChip.querySelector(".view-status-label").textContent = `↕ Sắp xếp: ${SORT_MODE_LABELS[activeSortMode]}`;
  groupStatusChip.classList.toggle("hidden", !activeGroupMode);
  if (activeGroupMode) groupStatusChip.querySelector(".view-status-label").textContent = `▤ Nhóm: ${GROUP_MODE_LABELS[activeGroupMode]}`;
  viewStatusBar.classList.toggle("hidden", !activeSortMode && !activeGroupMode);
  sortBtn.classList.toggle("active", !!activeSortMode);
  groupBtn.classList.toggle("active", !!activeGroupMode);
  sortMenu.querySelectorAll("[data-sort]").forEach((b) => b.classList.toggle("active", b.dataset.sort === activeSortMode));
  groupMenu.querySelectorAll("[data-group]").forEach((b) => b.classList.toggle("active", b.dataset.group === activeGroupMode));
}

sortBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const willOpen = sortMenu.classList.contains("hidden");
  groupMenu.classList.add("hidden");
  if (willOpen) positionFixedMenu(sortMenu, sortBtn);
  sortMenu.classList.toggle("hidden", !willOpen);
});
groupBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const willOpen = groupMenu.classList.contains("hidden");
  sortMenu.classList.add("hidden");
  if (willOpen) positionFixedMenu(groupMenu, groupBtn);
  groupMenu.classList.toggle("hidden", !willOpen);
});
document.addEventListener("click", (e) => {
  if (!sortMenu.classList.contains("hidden") && !sortMenu.contains(e.target) && !sortBtn.contains(e.target)) sortMenu.classList.add("hidden");
  if (!groupMenu.classList.contains("hidden") && !groupMenu.contains(e.target) && !groupBtn.contains(e.target)) groupMenu.classList.add("hidden");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { sortMenu.classList.add("hidden"); groupMenu.classList.add("hidden"); }
});

sortMenu.querySelectorAll("[data-sort]").forEach((btn) => {
  btn.addEventListener("click", () => {
    activeSortMode = activeSortMode === btn.dataset.sort ? null : btn.dataset.sort; // bấm lại mục đang chọn = bỏ chọn
    sortMenu.classList.add("hidden");
    updateViewStatusBar();
    renderBlocksView(latestBlocks);
  });
});
groupMenu.querySelectorAll("[data-group]").forEach((btn) => {
  btn.addEventListener("click", () => {
    activeGroupMode = activeGroupMode === btn.dataset.group ? null : btn.dataset.group;
    groupMenu.classList.add("hidden");
    updateViewStatusBar();
    renderBlocksView(latestBlocks);
  });
});
clearSortBtn.addEventListener("click", () => {
  activeSortMode = null;
  updateViewStatusBar();
  renderBlocksView(latestBlocks);
});
clearGroupBtn.addEventListener("click", () => {
  activeGroupMode = null;
  updateViewStatusBar();
  renderBlocksView(latestBlocks);
});

/* ---------------- Menu "..." của từng trang trong sidebar tree ---------------- */
document.addEventListener("click", (e) => {
  if (!nodeActionsMenu.classList.contains("hidden") && !nodeActionsMenu.contains(e.target) && !e.target.closest(".node-menu-btn")) {
    nodeActionsMenu.classList.add("hidden");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !nodeActionsMenu.classList.contains("hidden")) nodeActionsMenu.classList.add("hidden");
});
nodeActionsMenu.querySelectorAll("[data-node-action]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    nodeActionsMenu.classList.add("hidden");
    const pageId = nodeActionsPendingPageId;
    if (!pageId) return;
    const page = pagesById.get(pageId);
    if (btn.dataset.nodeAction === "add-child") {
      expandedIds.add(pageId);
      createPage(pageId);
    } else if (btn.dataset.nodeAction === "delete") {
      deletePageWithConfirm(pageId, page?.title);
    }
  });
});

/* ---------------- Sidebar toggle (mobile) ---------------- */
sidebarToggle.addEventListener("click", () => 
{
  sidebar.classList.toggle("open");
  sidebarToggle.classList.toggle("open")
});
function closeSidebarOnMobile() {
  if (window.innerWidth <= 768){
    sidebar.classList.remove("open");
    sidebarToggle.classList.remove("open")
  } 
}