/* ==================================
   まる家計 Ver2
   Step 2-2
================================== */

// ==========================
// アプリ状態
// ==========================

const app = {

    page: "home",

    currentYear: 2026,
    currentMonth: 7,

    bankBalance: 0,
    annualGoal: 0,

    monthlyIncome: 0,
    monthlyExpense: 0,

    incomeList: [],
    expenseList: [],
    history: [],
    budgets: []

};

// ==========================
// 起動
// ==========================

document.addEventListener("DOMContentLoaded", init);

function init() {

    setupNavigation();
    drawPage();

}

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

    const page = document.getElementById("pageContainer");

    page.innerHTML = `

<div class="card">

    <div class="card-title">
        📅 今月
    </div>

    <div class="value">
        ¥${formatMoney(app.monthlyExpense)}
    </div>

    <div class="sub">
        ${app.currentYear}年 ${app.currentMonth}月
    </div>

</div>

<div class="card">

    <div class="card-title">
        💰 銀行残高
    </div>

    <div class="value">
        ¥${formatMoney(app.bankBalance)}
    </div>

    <div class="sub">
        現在の銀行残高
    </div>

</div>

<div class="card">

    <div class="card-title">
        🎯 年間目標
    </div>

    <div class="value">
        ¥${formatMoney(app.annualGoal)}
    </div>

    <div class="sub">
        年度開始から増やしたい金額
    </div>

</div>

<div class="card">

    <div class="card-title">
        🤖 AIアドバイス
    </div>

    <div class="sub">
        まずは収入・支出・銀行残高を入力しましょう😊
    </div>

</div>

<div class="menu-grid">

    <button class="menu-btn" onclick="alert('次のStepで作成します')">
        💸<br>支出入力
    </button>

    <button class="menu-btn" onclick="alert('次のStepで作成します')">
        💰<br>収入入力
    </button>

    <button class="menu-btn" onclick="alert('次のStepで作成します')">
        🏦<br>銀行残高
    </button>

    <button class="menu-btn" onclick="alert('次のStepで作成します')">
        🎯<br>年間目標
    </button>

    <button class="menu-btn" onclick="alert('次のStepで作成します')">
        📋<br>履歴
    </button>

    <button class="menu-btn" onclick="alert('次のStepで作成します')">
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

<div class="card">

    <div class="card-title">
        📊 年間ページ
    </div>

    <div class="sub">
        ・年間目標
        <br>
        ・年間合計
        <br>
        ・月別推移
        <br>
        ・カテゴリ分析
    </div>

</div>

`;

}

// ==========================
// 特別費
// ==========================

function drawSpecial() {

    document.getElementById("pageContainer").innerHTML = `

<div class="card">

    <div class="card-title">
        💰 特別費
    </div>

    <div class="sub">
        特別費ページをこれから作ります。
    </div>

</div>

`;

}

// ==========================
// 設定
// ==========================

function drawSetting() {

    document.getElementById("pageContainer").innerHTML = `

<div class="card">

    <div class="card-title">
        ⚙️ 設定
    </div>

    <div class="sub">
        年間目標・予算・ボーナス設定などをここへ追加します。
    </div>

</div>

`;

}

// ==========================
// 共通
// ==========================

function formatMoney(value) {

    return Number(value || 0).toLocaleString("ja-JP");

}
