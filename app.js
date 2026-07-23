/* ===================================
   まる家計 Ver2
   app.js
=================================== */

// ===============================
// 初期化
// ===============================

document.addEventListener("DOMContentLoaded", init);

function init() {
    setupNavigation();
    showPage("home");
}

// ===============================
// ナビゲーション
// ===============================

function setupNavigation() {

    const buttons = document.querySelectorAll(".nav-btn");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            showPage(button.dataset.page);

        });

    });

}

// ===============================
// ページ表示
// ===============================

function showPage(page) {

    const container = document.getElementById("pageContainer");

switch (page) {

    case "home":
        drawHomePage();
        break;

    case "year":
        drawYearPage();
        break;

    case "special":
        drawSpecialPage();
        break;

    case "setting":
        drawSettingPage();
        break;

}

}

// ===============================
// ホーム
// ===============================

function drawHomePage() {

    const container = document.getElementById("pageContainer");

    container.innerHTML = `

        <div class="card">
            <div class="card-title">📅 今月</div>
            <div class="value">¥0</div>
            <div class="sub">2026年7月</div>
        </div>

        <div class="card">
            <div class="card-title">💰 銀行残高</div>
            <div class="value">¥0</div>
            <div class="sub">後でデータと連動します</div>
        </div>

        <div class="card">
            <div class="card-title">🤖 AIアドバイス</div>
            <div class="sub">ここにAIコメントを表示します。</div>
        </div>

        <div class="menu-grid">

            <button class="menu-btn">
                💸<br>支出入力
            </button>

            <button class="menu-btn">
                💰<br>収入入力
            </button>

            <button class="menu-btn">
                📋<br>履歴
            </button>

            <button class="menu-btn">
                📊<br>カテゴリ
            </button>

        </div>

    `;

}
// ===============================
// 年間
// ===============================

function drawYearPage() {

    const container = document.getElementById("pageContainer");

    container.innerHTML = `
        <h2>📊 年間</h2>
    `;

}

// ===============================
// 特別費
// ===============================

function drawSpecialPage() {

    const container = document.getElementById("pageContainer");

    container.innerHTML = `
        <h2>💰 特別費</h2>
    `;

}

// ===============================
// 設定
// ===============================

function drawSettingPage() {

    const container = document.getElementById("pageContainer");

    container.innerHTML = `
        <h2>⚙️ 設定</h2>
    `;

}
