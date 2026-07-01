import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot,
  query, orderBy, writeBatch, serverTimestamp, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

/* ---------------- Firebase init ---------------- */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

/* ---------------- DOM refs ---------------- */
const $ = (id) => document.getElementById(id);
const loginScreen = $("loginScreen");
const appEl = $("app");
const googleLoginBtn = $("googleLoginBtn");
const logoutBtn = $("logoutBtn");
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
const deletePageBtn = $("deletePageBtn");
const blocksContainer = $("blocksContainer");
const addBlockBtn = $("addBlockBtn");
const addBlockMenu = $("addBlockMenu");
const imageFileInput = $("imageFileInput");
const toastEl = $("toast");

/* ---------------- State ---------------- */
let currentUser = null;
let pagesById = new Map();       // id -> page data
let expandedIds = new Set();
let currentPageId = null;
let unsubPages = null;
let unsubBlocks = null;
let pendingImageBlockId = null;

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
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.add("hidden"), 2200);
}
function pagesCol() {
  return collection(db, "users", currentUser.uid, "pages");
}
function blocksCol(pageId) {
  return collection(db, "users", currentUser.uid, "pages", pageId, "blocks");
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
logoutBtn.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (unsubPages) unsubPages();
  if (unsubBlocks) unsubBlocks();
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

/* ---------------- Pages: realtime tree ---------------- */
function subscribeToPages() {
  const q = query(pagesCol(), orderBy("order", "asc"));
  unsubPages = onSnapshot(q, (snap) => {
    pagesById.clear();
    snap.forEach((d) => pagesById.set(d.id, { id: d.id, ...d.data() }));
    renderTree();
    // Keep header title in sync if the currently open page's title changed elsewhere
    if (currentPageId && pagesById.has(currentPageId)) {
      const p = pagesById.get(currentPageId);
      if (document.activeElement !== pageTitleEl) pageTitleEl.textContent = p.title || "";
      pageIconBtn.textContent = p.icon || "📄";
    } else if (currentPageId && !pagesById.has(currentPageId)) {
      showEmptyPageState();
    }
  }, (err) => {
    console.error(err);
    showToast("Lỗi tải danh sách trang");
  });
}

function renderTree() {
  const roots = [...pagesById.values()]
    .filter((p) => !p.parentId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  pageTree.innerHTML = "";
  sidebarEmpty.classList.toggle("hidden", roots.length > 0);
  roots.forEach((p) => pageTree.appendChild(buildNode(p)));
}

function buildNode(page) {
  const children = [...pagesById.values()]
    .filter((p) => p.parentId === page.id)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const li = document.createElement("li");
  const row = document.createElement("div");
  row.className = "page-node" + (page.id === currentPageId ? " selected" : "");
  row.dataset.id = page.id;

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

  const actions = document.createElement("span");
  actions.className = "node-actions";
  const addChildBtn = document.createElement("button");
  addChildBtn.textContent = "＋";
  addChildBtn.title = "Thêm trang con";
  addChildBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    expandedIds.add(page.id);
    createPage(page.id);
  });
  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑";
  delBtn.title = "Xóa trang";
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deletePageWithConfirm(page.id, page.title);
  });
  actions.append(addChildBtn, delBtn);

  row.append(caret, icon, title, actions);
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

async function createPage(parentId) {
  if (!currentUser) return;
  const siblingCount = [...pagesById.values()].filter((p) => p.parentId === (parentId || null)).length;
  const docRef = await addDoc(pagesCol(), {
    title: "",
    icon: "📄",
    parentId: parentId || null,
    order: siblingCount,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  openPage(docRef.id);
  setTimeout(() => pageTitleEl.focus(), 150);
}

async function deletePageWithConfirm(pageId, title) {
  const hasChildren = [...pagesById.values()].some((p) => p.parentId === pageId);
  const msg = hasChildren
    ? `Xóa "${title || "trang này"}" sẽ xóa luôn tất cả trang con bên trong. Tiếp tục?`
    : `Xóa "${title || "trang này"}"? Hành động này không thể hoàn tác.`;
  if (!confirm(msg)) return;
  await deletePageRecursive(pageId);
  if (currentPageId === pageId) showEmptyPageState();
  showToast("Đã xóa trang");
}

async function deletePageRecursive(pageId) {
  // delete blocks (and their images) of this page
  const blocksSnap = await getDocs(blocksCol(pageId));
  for (const b of blocksSnap.docs) {
    const data = b.data();
    if (data.type === "image" && data.storagePath) {
      deleteObject(ref(storage, data.storagePath)).catch(() => {});
    }
  }
  const batch = writeBatch(db);
  blocksSnap.forEach((b) => batch.delete(b.ref));
  await batch.commit();

  // delete child pages recursively
  const children = [...pagesById.values()].filter((p) => p.parentId === pageId);
  for (const c of children) {
    await deletePageRecursive(c.id);
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
  currentPageId = null;
  pageView.classList.add("hidden");
  emptyState.classList.remove("hidden");
  if (unsubBlocks) unsubBlocks();
  blocksContainer.innerHTML = "";
  renderTree();
  closeSidebarOnMobile();
}

function openPage(pageId) {
  currentPageId = pageId;
  emptyState.classList.add("hidden");
  pageView.classList.remove("hidden");

  const p = pagesById.get(pageId);
  pageTitleEl.textContent = p?.title || "";
  pageIconBtn.textContent = p?.icon || "📄";

  renderTree();
  subscribeToBlocks(pageId);
  closeSidebarOnMobile();
}

function subscribeToBlocks(pageId) {
  if (unsubBlocks) unsubBlocks();
  const q = query(blocksCol(pageId), orderBy("order", "asc"));
  unsubBlocks = onSnapshot(q, (snap) => {
    const blocks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderBlocks(blocks);
  }, (err) => {
    console.error(err);
    showToast("Lỗi tải nội dung trang");
  });
}

/* ---------------- Blocks: render ---------------- */
let draggedBlockId = null;

function renderBlocks(blocks) {
  blocksContainer.innerHTML = "";
  blocks.forEach((b) => blocksContainer.appendChild(buildBlockEl(b, blocks)));
}

function buildBlockEl(block, allBlocks) {
  const row = document.createElement("div");
  row.className = "block";
  row.draggable = true;
  row.dataset.id = block.id;

  row.addEventListener("dragstart", () => {
    draggedBlockId = block.id;
    row.classList.add("dragging");
  });
  row.addEventListener("dragend", () => row.classList.remove("dragging"));
  row.addEventListener("dragover", (e) => e.preventDefault());
  row.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!draggedBlockId || draggedBlockId === block.id) return;
    reorderBlocks(draggedBlockId, block.id, allBlocks);
  });

  const handle = document.createElement("div");
  handle.className = "block-handle";
  handle.textContent = "⠿";

  const body = document.createElement("div");
  body.className = "block-body";
  body.appendChild(buildBlockBody(block));

  const del = document.createElement("button");
  del.className = "block-delete";
  del.textContent = "✕";
  del.title = "Xóa khối";
  del.addEventListener("click", () => deleteBlock(block));

  row.append(handle, body, del);
  return row;
}

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
    updateDoc(doc(db, "users", currentUser.uid, "pages", currentPageId, "blocks", block.id), {
      content: div.textContent
    });
  }, 500);
  div.addEventListener("input", save);
  return div;
}

function buildTodo(block) {
  const wrap = document.createElement("div");
  wrap.className = "block-todo" + (block.checked ? " checked" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = !!block.checked;
  checkbox.addEventListener("change", () => {
    wrap.classList.toggle("checked", checkbox.checked);
    updateDoc(doc(db, "users", currentUser.uid, "pages", currentPageId, "blocks", block.id), {
      checked: checkbox.checked
    });
  });

  const text = document.createElement("div");
  text.className = "todo-text";
  text.contentEditable = "true";
  text.textContent = block.content || "";
  const save = debounce(() => {
    updateDoc(doc(db, "users", currentUser.uid, "pages", currentPageId, "blocks", block.id), {
      content: text.textContent
    });
  }, 500);
  text.addEventListener("input", save);

  wrap.append(checkbox, text);
  return wrap;
}

function buildImage(block) {
  const wrap = document.createElement("div");
  wrap.className = "block-image";
  if (block.imageUrl) {
    const img = document.createElement("img");
    img.src = block.imageUrl;
    img.alt = "";
    wrap.appendChild(img);
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
      if (url) {
        updateDoc(doc(db, "users", currentUser.uid, "pages", currentPageId, "blocks", block.id), {
          imageUrl: url.trim()
        });
      }
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
    const path = `users/${currentUser.uid}/images/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await updateDoc(doc(db, "users", currentUser.uid, "pages", currentPageId, "blocks", blockId), {
      imageUrl: url, storagePath: path
    });
    showToast("Đã tải ảnh lên");
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
      <span class="link-icon">🔗</span>
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
      updateDoc(doc(db, "users", currentUser.uid, "pages", currentPageId, "blocks", block.id), { url });
    });
    row.append(input, btn);
    wrap.appendChild(row);
  }
  return wrap;
}

/* ---------------- Blocks: add / delete / reorder ---------------- */
addBlockBtn.addEventListener("click", () => addBlockMenu.classList.toggle("hidden"));
document.addEventListener("click", (e) => {
  if (!addBlockBtn.contains(e.target) && !addBlockMenu.contains(e.target)) {
    addBlockMenu.classList.add("hidden");
  }
});
addBlockMenu.querySelectorAll("button[data-type]").forEach((btn) => {
  btn.addEventListener("click", () => {
    addBlockMenu.classList.add("hidden");
    addBlock(btn.dataset.type);
  });
});

async function addBlock(type) {
  if (!currentPageId) return;
  const snap = await getDocs(blocksCol(currentPageId));
  const order = snap.size;
  const base = { type, order, createdAt: serverTimestamp() };
  if (type === "todo") Object.assign(base, { content: "", checked: false });
  else if (type === "image") Object.assign(base, { imageUrl: "" });
  else if (type === "link") Object.assign(base, { url: "", label: "" });
  else Object.assign(base, { content: "" });
  await addDoc(blocksCol(currentPageId), base);
}

async function deleteBlock(block) {
  if (block.type === "image" && block.storagePath) {
    deleteObject(ref(storage, block.storagePath)).catch(() => {});
  }
  await deleteDoc(doc(db, "users", currentUser.uid, "pages", currentPageId, "blocks", block.id));
}

async function reorderBlocks(draggedId, targetId, allBlocks) {
  const ids = allBlocks.map((b) => b.id);
  const fromIdx = ids.indexOf(draggedId);
  const toIdx = ids.indexOf(targetId);
  if (fromIdx === -1 || toIdx === -1) return;
  ids.splice(toIdx, 0, ids.splice(fromIdx, 1)[0]);

  const batch = writeBatch(db);
  ids.forEach((id, idx) => {
    batch.update(doc(db, "users", currentUser.uid, "pages", currentPageId, "blocks", id), { order: idx });
  });
  await batch.commit();
}

/* ---------------- Sidebar toggle (mobile) ---------------- */
sidebarToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
function closeSidebarOnMobile() {
  if (window.innerWidth <= 768) sidebar.classList.remove("open");
}
