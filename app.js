/* ==================================
   まる家計 Ver2
================================== */

// ==========================
// アプリ
// ==========================

const app = {
    page: "home"
};

// ==========================
// 起動
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    setupNavigation();
    drawHome();

});

// ==========================
// ナビ
// ==========================

function setupNavigation() {

    document.querySelectorAll(".nav-btn").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".nav-btn")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            app.page = button.dataset.page;

            drawPage();

        });

    });

}

// ==========================
// ページ切替
// ==========================

function drawPage() {

    switch (app.page) {

        case "home":
            drawHome();
            break;

        case "year":
            drawYear();
            break;

        case "special":
            drawSpecial();
            break;

        case "setting":
            drawSetting();
            break;

    }

}

// ==========================
// ホーム
// ==========================

function drawHome() {

    document.getElementById("pageContainer").innerHTML = `

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
    <div class="card-title">🤖 AI</div>
    <div class="sub">
        AIアドバイスがここに表示されます。
    </div>
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

// ==========================
// 年間
// ==========================

function drawYear() {

    document.getElementById("pageContainer").innerHTML = `
        <h2>📊 年間</h2>
    `;

}

// ==========================
// 特別費
// ==========================

function drawSpecial() {

    document.getElementById("pageContainer").innerHTML = `
        <h2>💰 特別費</h2>
    `;

}

// ==========================
// 設定
// ==========================

function drawSetting() {

    document.getElementById("pageContainer").innerHTML = `
        <h2>⚙️ 設定</h2>
    `;

}
