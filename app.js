/* =====================================================
   🌸 まる家計 Ver20
   ---------------------------------------------
   ① 基本設定・データ構造・共通定数
   （Ver20 新設計）
===================================================== */

"use strict";

/* =====================================================
   アプリ情報
===================================================== */

const APP_INFO = {
    name: "まる家計",
    version: "20.0.0",
    storage: "maru-kakei"
};

/* =====================================================
   年度設定
===================================================== */

const FISCAL = {
    START_MONTH: 4,
    END_MONTH: 3,
    MONTHS: [4,5,6,7,8,9,10,11,12,1,2,3]
};

/* =====================================================
   月予算 初期値
===================================================== */

const DEFAULT_BUDGETS = [

    {
        id: "food",
        name: "🍚 食費",
        budget: 80000,
        spent: 0
    },

    {
        id: "utility",
        name: "💡 電気・水道",
        budget: 32000,
        spent: 0
    },

    {
        id: "iwagin",
        name: "🏦 岩銀",
        budget: 40000,
        spent: 0
    },

    {
        id: "rakuten",
        name: "💳 楽天",
        budget: 20000,
        spent: 0
    },

    {
        id: "holiday",
        name: "🎉 休日",
        budget: 40000,
        spent: 0
    },

    {
        id: "gas",
        name: "⛽ ガソリン",
        budget: 17000,
        spent: 0
    },

    {
        id: "other",
        name: "📦 その他",
        budget: 30000,
        spent: 0
    },

    {
        id: "rent",
        name: "🏠 家賃",
        budget: 50000,
        spent: 0
    }

];

/* =====================================================
   年間カテゴリ 初期値
===================================================== */

const DEFAULT_ANNUAL_CATEGORIES = [

    {
        id: "birthday",
        title: "🎂 誕生日",
        budget: 150000,
        history: []
    },

    {
        id: "travel",
        title: "✈️ 旅行",
        budget: 400000,
        history: []
    },

    {
        id: "car",
        title: "🚗 車検",
        budget: 120000,
        history: []
    },

    {
        id: "property",
        title: "🏠 固定資産税",
        budget: 70000,
        history: []
    },

    {
        id: "kindergarten",
        title: "🎒 幼稚園",
        budget: 235200,
        history: []
    },

    {
        id: "medicine",
        title: "💊 ピル",
        budget: 24000,
        history: []
    },

    {
        id: "jokaso",
        title: "🚰 集中浄化槽",
        budget: 48000,
        history: []
    }

];

/* =====================================================
   共通
===================================================== */

const ANNUAL_SPECIAL_BUDGET = 1350000;

/* =====================================================
   Deep Copy
===================================================== */

function deepCopy(data){

    return JSON.parse(JSON.stringify(data));

}

/* =====================================================
   初期データ生成
===================================================== */

function createDefaultBudgets(){

    return deepCopy(DEFAULT_BUDGETS);

}

function createDefaultAnnualCategories(){

    return deepCopy(DEFAULT_ANNUAL_CATEGORIES);

}

/* =====================================================
   メインデータ
===================================================== */

const app = {

    goal: 3400000,

    reserveMin: 500000,

    reserveFund: {

        balance: 0,

        pending: 0,

        history: []

    },

    bank: {

        mitake: 0,

        takizawa: 0

    },

    startBank: 0,

    income: {

        papa: 0,

        mama: 0,

        extra: 0

    },

    bonus: {

        summerForecast: 0,

        summerActual: 0,

        winterForecast: 0,

        winterActual: 0

    },

    budgets: createDefaultBudgets(),

    annualCategories: createDefaultAnnualCategories(),

    history: []

};

/* =====================================================
   現在表示中
===================================================== */

let currentYear = 2026;

let currentMonth = 4;

let currentAnnualCategory = -1;

let lastPage = "home";

/* =====================================================
   Ver20
   Part ① End
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20
   ---------------------------------------------
   ② 共通関数・年度管理・保存キー
===================================================== */

/* =====================================================
   今日
===================================================== */

const TODAY = new Date();

/* =====================================================
   年度判定
===================================================== */

function getCurrentFiscalYear() {

    return TODAY.getMonth() + 1 >= FISCAL.START_MONTH
        ? TODAY.getFullYear()
        : TODAY.getFullYear() - 1;

}

/* =====================================================
   表示年
===================================================== */

function getDisplayYear(month = currentMonth) {

    return month <= 3
        ? currentYear + 1
        : currentYear;

}

/* =====================================================
   年度配列
===================================================== */

function getFiscalMonths() {

    return [...FISCAL.MONTHS];

}

/* =====================================================
   保存キー
===================================================== */

function getMonthKey(year = currentYear, month = currentMonth) {

    return `${APP_INFO.storage}-${year}-${String(month).padStart(2, "0")}`;

}

function getYearKey(year = currentYear) {

    return `${APP_INFO.storage}-year-${year}`;

}

function getSessionKey() {

    return `${APP_INFO.storage}-session`;

}

/* =====================================================
   LocalStorage
===================================================== */

function loadStorage(key, defaultValue = null) {

    try {

        const value = localStorage.getItem(key);

        if (!value) {

            return defaultValue;

        }

        return JSON.parse(value);

    } catch (e) {

        console.error(e);

        return defaultValue;

    }

}

function saveStorage(key, value) {

    localStorage.setItem(

        key,

        JSON.stringify(value)

    );

}

/* =====================================================
   月データ取得
===================================================== */

function getMonthData(year, month) {

    return loadStorage(

        getMonthKey(year, month),

        null

    );

}

/* =====================================================
   共通計算
===================================================== */

function getIncomeTotal() {

    return (

        Number(app.income.papa || 0) +

        Number(app.income.mama || 0) +

        Number(app.income.extra || 0)

    );

}

function getSpentTotal() {

    return app.budgets.reduce(

        (sum, item) =>

            sum + Number(item.spent || 0),

        0

    );

}

function getRemainTotal() {

    return getIncomeTotal() - getSpentTotal();

}

function getBankTotal() {

    return (

        Number(app.bank.mitake || 0) +

        Number(app.bank.takizawa || 0)

    );

}

/* =====================================================
   年間目標進捗
   （Ver20仕様）
===================================================== */

function getGoalProgress() {

    return getBankTotal() - Number(app.startBank || 0);

}

function getGoalRemain() {

    return Math.max(

        Number(app.goal || 0) - getGoalProgress(),

        0

    );

}

function getGoalPercent() {

    if (app.goal <= 0) return 0;

    return Math.min(

        getGoalProgress() / app.goal * 100,

        100

    );

}

/* =====================================================
   日付
===================================================== */

function todayString() {

    return new Date().toLocaleDateString(

        "ja-JP",

        {

            year: "numeric",

            month: "2-digit",

            day: "2-digit"

        }

    );

}

/* =====================================================
   金額表示
===================================================== */

function yen(value) {

    return "¥" + Number(value || 0).toLocaleString();

}

/* =====================================================
   Ver20
   Part② End
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20
   ---------------------------------------------
   ③ 保存・読込・セッション復元
===================================================== */

/* =====================================================
   保存
===================================================== */

function save() {

    const yearData = {

        goal: app.goal,

        reserveMin: app.reserveMin,

        reserveFund: deepCopy(app.reserveFund),

        startBank: app.startBank,

        bonus: deepCopy(app.bonus),

        annualCategories: deepCopy(app.annualCategories)

    };

    const monthData = {

        bank: deepCopy(app.bank),

        income: deepCopy(app.income),

        budgets: deepCopy(app.budgets),

        history: deepCopy(app.history)

    };

    const sessionData = {

        year: currentYear,

        month: currentMonth,

        page: lastPage

    };

    try {

        saveStorage(

            getYearKey(),

            yearData

        );

        saveStorage(

            getMonthKey(),

            monthData

        );

        saveStorage(

            getSessionKey(),

            sessionData

        );

    } catch (e) {

        console.error(e);

        alert("保存に失敗しました");

    }

}

/* =====================================================
   読込
===================================================== */

function load() {

    app.goal = 3400000;

    app.reserveMin = 500000;

    app.reserveFund = {

        balance: 0,

        pending: 0,

        history: []

    };

    app.bank = {

        mitake: 0,

        takizawa: 0

    };

    app.startBank = 0;

    app.income = {

        papa: 0,

        mama: 0,

        extra: 0

    };

    app.bonus = {

        summerForecast: 0,

        summerActual: 0,

        winterForecast: 0,

        winterActual: 0

    };

    app.budgets = createDefaultBudgets();

    app.annualCategories = createDefaultAnnualCategories();

    app.history = [];

    /* -----------------------
       月データ
    ----------------------- */

    const monthData = loadStorage(

        getMonthKey(),

        null

    );

    if (monthData) {

        app.bank = monthData.bank || app.bank;

        app.income = monthData.income || app.income;

        app.budgets = monthData.budgets || app.budgets;

        app.history = monthData.history || [];

    }

    /* -----------------------
       年度データ
    ----------------------- */

    const yearData = loadStorage(

        getYearKey(),

        null

    );

    if (yearData) {

        app.goal =

            yearData.goal ??

            app.goal;

        app.reserveMin =

            yearData.reserveMin ??

            app.reserveMin;

        app.reserveFund =

            yearData.reserveFund ||

            app.reserveFund;

        app.startBank =

            yearData.startBank ??

            app.startBank;

        app.bonus =

            yearData.bonus ||

            app.bonus;

        app.annualCategories =

            yearData.annualCategories ||

            app.annualCategories;

    }

    app.budgets.forEach(item => {

        if (item.spent === undefined) {

            item.spent = 0;

        }

    });

}

/* =====================================================
   セッション復元
===================================================== */

const session = loadStorage(

    getSessionKey(),

    {}

);

currentYear =

    session.year ??

    getCurrentFiscalYear();

currentMonth =

    session.month ??

    TODAY.getMonth() + 1;

lastPage =

    session.page ??

    "home";

/* =====================================================
   Ver20
   Part③ End
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20
   ---------------------------------------------
   ④ 初期化・年度選択・月移動
===================================================== */

/* =====================================================
   年度セレクト
===================================================== */

const yearSelect = document.getElementById("yearSelect");

function initializeYearSelect() {

    if (!yearSelect) return;

    yearSelect.innerHTML = "";

    for (let year = 2024; year <= 2035; year++) {

        const option = document.createElement("option");

        option.value = year;

        option.textContent = `${year}年度`;

        yearSelect.appendChild(option);

    }

    yearSelect.value = currentYear;

    yearSelect.onchange = () => {

        save();

        currentYear = Number(yearSelect.value);

        currentMonth = 4;

        load();

        update();

        showPage(lastPage);

    };

}

/* =====================================================
   月変更
===================================================== */

function changeMonth(step) {

    save();

    currentMonth += step;

    if (currentMonth > 12) {

        currentMonth = 1;

    }

    if (currentMonth < 1) {

        currentMonth = 12;

    }

    if (currentMonth === 4 && step === 1) {

        currentYear++;

    }

    if (currentMonth === 3 && step === -1) {

        currentYear--;

    }

    load();

    update();

    showPage(lastPage);

}

/* =====================================================
   ボタン
===================================================== */

const prevMonthButton = document.getElementById("prevMonth");

if (prevMonthButton) {

    prevMonthButton.onclick = () => {

        changeMonth(-1);

    };

}

const nextMonthButton = document.getElementById("nextMonth");

if (nextMonthButton) {

    nextMonthButton.onclick = () => {

        changeMonth(1);

    };

}

/* =====================================================
   初期化
===================================================== */

initializeYearSelect();

/* =====================================================
   Ver20
   Part④ End
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20
   ---------------------------------------------
   ⑤ ホーム画面更新
===================================================== */

function update() {

    /* =========================
       年度
    ========================= */

    if (yearSelect) {

        yearSelect.value = String(currentYear);

    }

    /* =========================
       表示期間
    ========================= */

    const period = document.getElementById("period");

    if (period) {

        period.textContent =
            `${getDisplayYear()}年 ${currentMonth}月`;

    }

    const fiscalYear = document.getElementById("fiscalYear");

    if (fiscalYear) {

        fiscalYear.textContent =
            `${currentYear}年度`;

    }

    /* =========================
       金額
    ========================= */

    const income = getIncomeTotal();

    const spent = getSpentTotal();

    const remain = getRemainTotal();

    const bank = getBankTotal();

    const saving = getGoalProgress();

    /* =========================
       収入
    ========================= */

    const incomeEl = document.getElementById("income");

    if (incomeEl) {

        incomeEl.textContent = yen(income);

    }

    const incomeSummary = document.getElementById("incomeSummary");

    if (incomeSummary) {

        incomeSummary.textContent = yen(income);

    }

    /* =========================
       支出
    ========================= */

    const spentEl = document.getElementById("spent");

    if (spentEl) {

        spentEl.textContent = yen(spent);

    }

    /* =========================
       残金
    ========================= */

    const remainEl = document.getElementById("remain");

    if (remainEl) {

        remainEl.textContent = yen(remain);

        remainEl.className =
            "summary-money " +
            (remain >= 0 ? "plus" : "minus");

    }

    /* =========================
       銀行残高
    ========================= */

    const bankTotal = document.getElementById("bankTotal");

    if (bankTotal) {

        bankTotal.textContent = yen(bank);

    }

    /* =========================
       年間貯蓄
    ========================= */

    const savingTotal = document.getElementById("savingTotal");

    if (savingTotal) {

        savingTotal.textContent =
            (saving >= 0 ? "+" : "") +
            yen(saving);

        savingTotal.className =
            "bank-saving " +
            (saving >= 0 ? "plus" : "minus");

    }

    /* =========================
       各画面
    ========================= */

    drawCategories();

    drawAI();

    drawYearSummary();

    drawYearCategory();

    drawYearChart();

    drawAnnualManage();

    save();

}

/* =====================================================
   Ver20
   Part⑤ End
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20.2
   ---------------------------------------------
   ⑥ カテゴリ表示・収入・支出・銀行
===================================================== */

/* =====================================================
   カテゴリ表示
===================================================== */

function drawCategories() {

    const grid = document.getElementById("gridArea");

    if (!grid) return;

    grid.innerHTML = "";

    app.budgets.forEach((item, index) => {

        const remain = item.budget - item.spent;

        grid.innerHTML += `

<button
class="input-card"
onclick="addSpent(${index}, ${item.id === "iwagin" || item.id === "rakuten"})">

    <div class="input-name">
        ${item.name}
    </div>

    <div class="input-left ${remain < 0 ? "over" : ""}">
        ${yen(remain)}
    </div>

</button>

`;

    });

}

/* =====================================================
   共通履歴追加
===================================================== */

function addHistory({

    categoryId = "",

    category = "",

    amount = 0,

    memo = "",

    income = false,

    annual = false

}) {

    app.history.unshift({

        id: Date.now(),

        date: todayString(),

        categoryId,

        category,

        amount,

        memo,

        income,

        annual

    });

}

/* =====================================================
   収入入力
===================================================== */

function addIncome(type) {

    openNumberModal(`${type}収入`, (amount, memo) => {

        amount = Number(amount);

        if (amount <= 0) return;

        switch (type) {

            case "パパ":
                app.income.papa += amount;
                break;

            case "ママ":
                app.income.mama += amount;
                break;

            case "臨時":
                app.income.extra += amount;
                break;

        }

        addHistory({

            categoryId: "income",

            category: `${type}収入`,

            amount,

            memo,

            income: true

        });

        update();

    });

}

/* =====================================================
   支出入力
===================================================== */

function addSpent(index, overwrite = false) {

    const item = app.budgets[index];

    if (!item) return;

    openNumberModal(item.name, (amount, memo) => {

        amount = Number(amount);

        if (amount <= 0) return;

        if (overwrite) {

            item.spent = amount;

        } else {

            item.spent += amount;

        }

        addHistory({

            categoryId: item.id,

            category: item.name,

            amount,

            memo

        });

        update();

    });

}

/* =====================================================
   銀行残高
===================================================== */

function editBank() {

    openNumberModal("みたけ銀行", mitake => {

        openNumberModal("滝沢銀行", takizawa => {

            app.bank.mitake = Number(mitake);

            app.bank.takizawa = Number(takizawa);

            if (currentMonth === 4) {

                app.startBank =
                    app.bank.mitake +
                    app.bank.takizawa;

            }

            update();

        });

    });

}

/* =====================================================
   月リセット
===================================================== */

function resetMonth() {

    if (!confirm("今月のデータをリセットしますか？")) {

        return;

    }

    app.income = {

        papa: 0,

        mama: 0,

        extra: 0

    };

    app.budgets = createDefaultBudgets();

    app.history = [];

    update();

}

/* =====================================================
   ボタン登録
===================================================== */

[
    ["incomePapa", () => addIncome("パパ")],
    ["incomeMama", () => addIncome("ママ")],
    ["incomeExtra", () => addIncome("臨時")],
    ["resetMonth", resetMonth]
].forEach(([id, func]) => {

    const button = document.getElementById(id);

    if (button) {

        button.onclick = func;

    }

});

/* =====================================================
   Ver20.2
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20
   ---------------------------------------------
   ⑦ ページ切替・ナビゲーション
===================================================== */

/* =====================================================
   ページ取得
===================================================== */

const homePage = document.getElementById("homePage");

const yearPage = document.getElementById("yearPage");

const annualPage = document.getElementById("annualPage");

const categoryPage = document.getElementById("categoryPage");

const settingPage = document.getElementById("settingPage");

const pages = [
    homePage,
    yearPage,
    annualPage,
    categoryPage,
    settingPage
];

const navButtons =
    document.querySelectorAll(".bottom-nav button");

/* =====================================================
   全ページ非表示
===================================================== */

function hideAllPages() {

    pages.forEach(page => {

        if (page) {

            page.style.display = "none";

        }

    });

    navButtons.forEach(button => {

        button.classList.remove("active");

    });

}

/* =====================================================
   ページ表示
===================================================== */

function showPage(page) {

    hideAllPages();

    switch (page) {

        case "home":

            homePage.style.display = "block";

            navButtons[0].classList.add("active");

            break;

        case "year":

            yearPage.style.display = "block";

            navButtons[1].classList.add("active");

            drawYearSummary();

            drawYearCategory();

            drawYearChart();

            break;

        case "annual":

            annualPage.style.display = "block";

            navButtons[2].classList.add("active");

            drawAnnualManage();

            break;

        case "setting":

            settingPage.style.display = "block";

            navButtons[3].classList.add("active");

            drawBudgetList();

            break;

        case "category":

            categoryPage.style.display = "block";

            break;

    }

    lastPage = page;

    save();

}

/* =====================================================
   戻る
===================================================== */

function backPage() {

    showPage(lastPage);

}

/* =====================================================
   ナビ
===================================================== */

if (navButtons[0]) {

    navButtons[0].onclick = () => {

        showPage("home");

    };

}

if (navButtons[1]) {

    navButtons[1].onclick = () => {

        showPage("year");

    };

}

if (navButtons[2]) {

    navButtons[2].onclick = () => {

        showPage("annual");

    };

}

if (navButtons[3]) {

    navButtons[3].onclick = () => {

        showPage("setting");

    };

}

/* =====================================================
   Ver20
   Part⑦ End
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20
   ---------------------------------------------
   ⑧ AI分析（Ver20 新設計）
   AIは
   ①分析
   ②コメント生成
   ③表示
   に完全分離
===================================================== */

/* =====================================================
   AI分析
===================================================== */

function analyzeHousehold() {

    const income = getIncomeTotal();

    const spent = getSpentTotal();

    const remain = getRemainTotal();

    const bank = getBankTotal();

    const saving = getGoalProgress();

    const goalRemain = getGoalRemain();

    const goalPercent = getGoalPercent();

    const monthsLeft =
        Math.max(
            currentMonth <= 3
                ? 4 - currentMonth
                : 16 - currentMonth,
            1
        );

    const monthlyNeed =
        Math.ceil(goalRemain / monthsLeft);

    const overBudget = app.budgets
        .filter(item => item.id !== "rent")
        .map(item => {

            const yearlyBudget =
                item.budget * 12;

            const forecast =
                item.spent * 12;

            return {

                id: item.id,

                name: item.name,

                yearlyBudget,

                forecast,

                over: forecast - yearlyBudget

            };

        })
        .sort((a, b) => b.over - a.over);

    return {

        income,

        spent,

        remain,

        bank,

        saving,

        goalRemain,

        goalPercent,

        monthsLeft,

        monthlyNeed,

        overBudget

    };

}

/* =====================================================
   コメント生成
===================================================== */

function generateAIComment(result) {

    let html = "";

    html += `
📊 <b>年間目標</b><br>
現在の年間貯蓄は
<b>${yen(result.saving)}</b>です。<br>
`;

    if (result.goalRemain > 0) {

        html += `
目標まで
<b>${yen(result.goalRemain)}</b>
不足しています。<br>

残り${result.monthsLeft}か月で
毎月約<b>${yen(result.monthlyNeed)}</b>
改善すると達成できます。<br><br>
`;

    } else {

        html += `
🎉 年間目標を達成しています！<br><br>
`;

    }

    const over = result.overBudget
        .filter(item => item.over > 0)
        .slice(0, 3);

    if (over.length) {

        html += "<b>💡 見直し候補</b><br>";

        over.forEach(item => {

            html += `
${item.name}
年間約${yen(item.over)}オーバー予測<br>
`;

        });

    } else {

        html += `
🎉 すべてのカテゴリが
予算内ペースです😊
`;

    }

    return html;

}

/* =====================================================
   表示
===================================================== */

function drawAI() {

    const area =
        document.getElementById("aiComment");

    if (!area) return;

    const result =
        analyzeHousehold();

    area.innerHTML =
        generateAIComment(result);

}

/* =====================================================
   Ver20
   Part⑧ End
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20
   ---------------------------------------------
   ⑨ 年間サマリー
   （Ver20仕様）
===================================================== */

/* =====================================================
   年間合計取得
===================================================== */

function getYearSummary() {

    let papa = 0;
    let mama = 0;
    let extra = 0;

    let spent = 0;

    getFiscalMonths().forEach(month => {

        const year =
            month <= 3
                ? currentYear + 1
                : currentYear;

        const data = getMonthData(year, month);

        if (!data) return;

        papa += Number(data.income?.papa || 0);

        mama += Number(data.income?.mama || 0);

        extra += Number(data.income?.extra || 0);

        spent += (data.budgets || []).reduce(

            (sum, item) =>

                sum + Number(item.spent || 0),

            0

        );

    });

    const income =
        papa +
        mama +
        extra;

    const remain =
        income -
        spent;

    return {

        papa,

        mama,

        extra,

        income,

        spent,

        remain

    };

}

/* =====================================================
   年間表示
===================================================== */

function drawYearSummary() {

    const title =
        document.getElementById("yearTitle");

    if (title) {

        title.textContent =
            `${currentYear}年度`;

    }

    const result =
        getYearSummary();

    document.getElementById("yearIncome").textContent =
        yen(result.income);

    document.getElementById("yearSpent").textContent =
        yen(result.spent);

    const remainEl =
        document.getElementById("yearRemain");

    remainEl.textContent =
        yen(result.remain);

    remainEl.className =
        "summary-money " +
        (result.remain >= 0 ? "plus" : "minus");

    /* =========================
       年間目標
       （銀行残高増加のみ）
    ========================= */

    const progress =
        getGoalProgress();

    document.getElementById("yearGoal").textContent =
        `${yen(progress)} / ${yen(app.goal)}`;

    document.getElementById("goalBar").style.width =
        `${getGoalPercent()}%`;

}

/* =====================================================
   Ver20
   Part⑨ End
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20
   ---------------------------------------------
   ⑩ 年間カテゴリ集計
===================================================== */

/* =====================================================
   カテゴリ年間集計
===================================================== */

function getYearCategoryData() {

    const result = [];

    DEFAULT_BUDGETS.forEach(base => {

        let budget = 0;
        let spent = 0;

        getFiscalMonths().forEach(month => {

            const year =
                month <= 3
                    ? currentYear + 1
                    : currentYear;

            const data =
                getMonthData(year, month);

            if (!data) return;

            const item =
                data.budgets.find(

                    b => b.id === base.id

                );

            if (!item) return;

            budget += Number(item.budget || 0);

            spent += Number(item.spent || 0);

        });

        result.push({

            id: base.id,

            name: base.name,

            budget,

            spent,

            remain: budget - spent

        });

    });

    return result;

}

/* =====================================================
   一覧表示
===================================================== */

function drawYearCategory() {

    const list =
        document.getElementById("yearCategoryList");

    if (!list) return;

    list.innerHTML = "";

    const data =
        getYearCategoryData();

    data.forEach(item => {

        const percent =
            item.budget === 0
                ? 0
                : Math.min(
                    100,
                    Math.round(
                        item.spent /
                        item.budget *
                        100
                    )
                );

        list.innerHTML += `

<div class="year-card">

    <div class="year-head">

        <span>${item.name}</span>

        <span>
            ${yen(item.spent)}
            /
            ${yen(item.budget)}
        </span>

    </div>

    <div class="progress">

        <div
            class="progress-fill"
            style="width:${percent}%">
        </div>

    </div>

    <div class="year-footer">

        <span>

            残り
            ${yen(item.remain)}

        </span>

        <span>

            ${percent}%

        </span>

    </div>

</div>

`;

    });

}

/* =====================================================
   年間円グラフ用データ
===================================================== */

function getChartData() {

    return getYearCategoryData()

        .filter(item => item.spent > 0)

        .map(item => ({

            label: item.name,

            value: item.spent

        }));

}

/* =====================================================
   Ver20
   Part⑩ End
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20
   ---------------------------------------------
   ⑪ 年間グラフ
===================================================== */

/* =====================================================
   グラフ
===================================================== */

let yearChart = null;

function drawYearChart() {

    const canvas =
        document.getElementById("yearChart");

    if (!canvas) return;

    const data =
        getChartData();

    if (yearChart) {

        yearChart.destroy();

    }

    yearChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels:

                data.map(item => item.label),

            datasets: [

                {

                    data:

                        data.map(item => item.value),

                    borderWidth: 0

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "65%",

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}

/* =====================================================
   年間ランキング
===================================================== */

function getRanking() {

    return getYearCategoryData()

        .sort((a, b) =>

            b.spent - a.spent

        );

}

function drawRanking() {

    const area =
        document.getElementById("rankingList");

    if (!area) return;

    area.innerHTML = "";

    getRanking().forEach((item, index) => {

        area.innerHTML += `

<div class="rank-card">

    <span>

        ${index + 1}位

    </span>

    <span>

        ${item.name}

    </span>

    <span>

        ${yen(item.spent)}

    </span>

</div>

`;

    });

}

/* =====================================================
   年間画面更新
===================================================== */

function refreshYearPage() {

    drawYearSummary();

    drawYearCategory();

    drawYearChart();

    drawRanking();

}

/* =====================================================
   Ver20
   Part⑪ End
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20.3
   ---------------------------------------------
   ⑫ 年間管理
===================================================== */

/* =====================================================
   使用額取得
===================================================== */

function getAnnualSpent(item) {

    if (!item.history) return 0;

    return item.history.reduce(

        (sum, h) => sum + Number(h.amount || 0),

        0

    );

}

/* =====================================================
   一覧表示
===================================================== */

function drawAnnualManage() {

    const list = document.getElementById("annualList");

    if (!list) return;

    list.innerHTML = "";

    app.annualCategories.forEach((item, index) => {

        const spent = getAnnualSpent(item);

        const remain = item.budget - spent;

        const percent =
            item.budget === 0
                ? 0
                : Math.min(
                    100,
                    Math.round(spent / item.budget * 100)
                );

        list.innerHTML += `

<div class="annual-card">

    <div class="annual-title">

        <span>${item.title}</span>

        <span>${yen(spent)} / ${yen(item.budget)}</span>

    </div>

    <div class="progress">

        <div
            class="progress-fill"
            style="width:${percent}%">
        </div>

    </div>

    <div class="annual-footer">

        <span>

            残り ${yen(remain)}

        </span>

        <button onclick="editAnnual(${index})">

            入力

        </button>

    </div>

</div>

`;

    });

}

/* =====================================================
   年間支出入力
===================================================== */

function editAnnual(index) {

    const item = app.annualCategories[index];

    if (!item) return;

    openNumberModal(

        item.title,

        (amount, memo) => {

            amount = Number(amount);

            if (amount <= 0) return;

            if (!item.history) {

                item.history = [];

            }

            item.history.unshift({

                id: Date.now(),

                date: todayString(),

                amount,

                memo

            });

            addHistory({

                categoryId: item.id,

                category: item.title,

                amount,

                memo,

                annual: true

            });

            update();

        }

    );

}

/* =====================================================
   年間予算編集
===================================================== */

function editAnnualBudget(index) {

    const item = app.annualCategories[index];

    if (!item) return;

    openNumberModal(

        `${item.title}予算`,

        amount => {

            amount = Number(amount);

            if (amount <= 0) return;

            item.budget = amount;

            update();

        }

    );

}

/* =====================================================
   年間合計
===================================================== */

function getAnnualBudgetTotal() {

    return app.annualCategories.reduce(

        (sum, item) =>

            sum + Number(item.budget || 0),

        0

    );

}

function getAnnualSpentTotal() {

    return app.annualCategories.reduce(

        (sum, item) =>

            sum + getAnnualSpent(item),

        0

    );

}

/* =====================================================
   Ver20.3
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20.4
   ---------------------------------------------
   ⑬ 履歴管理
===================================================== */

/* =====================================================
   履歴表示
===================================================== */

function drawHistory() {

    const list = document.getElementById("historyList");

    if (!list) return;

    list.innerHTML = "";

    if (app.history.length === 0) {

        list.innerHTML = `
<div class="empty">
履歴はまだありません😊
</div>
`;
        return;

    }

    app.history.forEach((item) => {

        list.innerHTML += `

<div class="history-card">

    <div class="history-top">

        <span>${item.category}</span>

        <span>${yen(item.amount)}</span>

    </div>

    <div class="history-bottom">

        <span>${item.date}</span>

        <span>${item.memo || ""}</span>

    </div>

    <button
        class="delete-button"
        onclick="deleteHistory(${item.id})">

        削除

    </button>

</div>

`;

    });

}

/* =====================================================
   削除
===================================================== */

function deleteHistory(id) {

    if (!confirm("削除しますか？")) return;

    const index = app.history.findIndex(h => h.id === id);

    if (index === -1) return;

    const item = app.history[index];

    /* -----------------------
       月支出
    ----------------------- */

    if (!item.income && !item.annual) {

        const budget = app.budgets.find(

            b => b.id === item.categoryId

        );

        if (budget) {

            budget.spent = Math.max(
                0,
                budget.spent - item.amount
            );

        }

    }

    /* -----------------------
       年間支出
    ----------------------- */

    if (item.annual) {

        const annual = app.annualCategories.find(

            a => a.id === item.categoryId

        );

        if (annual && annual.history) {

            const historyIndex =
                annual.history.findIndex(

                    h => h.id === id

                );

            if (historyIndex >= 0) {

                annual.history.splice(

                    historyIndex,

                    1

                );

            }

        }

    }

    /* -----------------------
       収入
    ----------------------- */

    if (item.income) {

        switch (item.category) {

            case "パパ収入":
                app.income.papa -= item.amount;
                break;

            case "ママ収入":
                app.income.mama -= item.amount;
                break;

            case "臨時収入":
                app.income.extra -= item.amount;
                break;

        }

    }

    app.history.splice(index, 1);

    update();

}

/* =====================================================
   全削除
===================================================== */

function clearHistory() {

    if (!confirm("履歴をすべて削除しますか？")) return;

    app.history = [];

    app.budgets.forEach(item => {

        item.spent = 0;

    });

    app.annualCategories.forEach(item => {

        item.history = [];

    });

    app.income = {

        papa: 0,

        mama: 0,

        extra: 0

    };

    update();

}

/* =====================================================
   更新時
===================================================== */

const oldUpdate = update;

update = function () {

    oldUpdate();

    drawHistory();

};

/* =====================================================
   Ver20.4
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20.1
   ---------------------------------------------
   ⑭ 設定画面・予算編集
===================================================== */

/* =====================================================
   月予算一覧
===================================================== */

function drawBudgetList() {

    const area = document.getElementById("budgetList");

    if (!area) return;

    area.innerHTML = "";

    app.budgets.forEach((item, index) => {

        area.innerHTML += `

<div class="budget-card">

    <div class="budget-left">

        <div class="budget-name">
            ${item.name}
        </div>

        <div class="budget-value">
            ${yen(item.budget)}
        </div>

    </div>

    <button
        class="edit-button"
        onclick="editBudget(${index})">

        編集

    </button>

</div>

`;

    });

}

/* =====================================================
   月予算編集
===================================================== */

function editBudget(index) {

    const item = app.budgets[index];

    if (!item) return;

    openNumberModal(

        `${item.name}予算`,

        amount => {

            if (amount <= 0) return;

            item.budget = amount;

            update();

        }

    );

}

/* =====================================================
   年間目標
===================================================== */

function editGoal() {

    openNumberModal(

        "年間貯蓄目標",

        amount => {

            if (amount <= 0) return;

            app.goal = amount;

            update();

        }

    );

}

/* =====================================================
   年度開始残高
===================================================== */

function editStartBank() {

    openNumberModal(

        "年度開始残高",

        amount => {

            if (amount < 0) return;

            app.startBank = amount;

            update();

        }

    );

}

/* =====================================================
   年間積立
===================================================== */

function editSpecialBudget() {

    openNumberModal(

        "年間積立",

        amount => {

            if (amount < 0) return;

            app.specialBudget = amount;

            update();

        }

    );

}

/* =====================================================
   最低残高
===================================================== */

function editReserveMin() {

    openNumberModal(

        "最低残高",

        amount => {

            if (amount < 0) return;

            app.reserveMin = amount;

            update();

        }

    );

}

/* =====================================================
   設定画面更新
===================================================== */

function refreshSettingPage() {

    drawBudgetList();

}

/* =====================================================
   ボタン登録
===================================================== */

[
    ["editGoal", editGoal],
    ["editStartBank", editStartBank],
    ["editSpecialBudget", editSpecialBudget],
    ["editReserveMin", editReserveMin]

].forEach(([id, func]) => {

    const button = document.getElementById(id);

    if (button) {

        button.onclick = func;

    }

});

/* =====================================================
   Ver20.1
   Part⑭ End
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20
   ---------------------------------------------
   ⑮ 数値入力モーダル
===================================================== */

/* =====================================================
   モーダル取得
===================================================== */

const numberModal =
    document.getElementById("numberModal");

const modalTitle =
    document.getElementById("modalTitle");

const amountInput =
    document.getElementById("amountInput");

const memoInput =
    document.getElementById("memoInput");

const okButton =
    document.getElementById("modalOk");

const cancelButton =
    document.getElementById("modalCancel");

let modalCallback = null;

/* =====================================================
   開く
===================================================== */

function openNumberModal(title, callback) {

    modalCallback = callback;

    if (modalTitle) {

        modalTitle.textContent = title;

    }

    if (amountInput) {

        amountInput.value = "";

        amountInput.focus();

    }

    if (memoInput) {

        memoInput.value = "";

    }

    if (numberModal) {

        numberModal.classList.add("show");

    }

}

/* =====================================================
   閉じる
===================================================== */

function closeNumberModal() {

    if (numberModal) {

        numberModal.classList.remove("show");

    }

}

/* =====================================================
   OK
===================================================== */

function submitNumberModal() {

    if (!modalCallback) {

        closeNumberModal();

        return;

    }

    const amount =
        Number(amountInput.value || 0);

    const memo =
        memoInput
            ? memoInput.value.trim()
            : "";

    modalCallback(amount, memo);

    closeNumberModal();

}

/* =====================================================
   ボタン
===================================================== */

if (okButton) {

    okButton.onclick =
        submitNumberModal;

}

if (cancelButton) {

    cancelButton.onclick =
        closeNumberModal;

}

/* =====================================================
   Enterキー
===================================================== */

if (amountInput) {

    amountInput.addEventListener(

        "keydown",

        event => {

            if (event.key === "Enter") {

                submitNumberModal();

            }

        }

    );

}

/* =====================================================
   モーダル外クリック
===================================================== */

if (numberModal) {

    numberModal.onclick = event => {

        if (event.target === numberModal) {

            closeNumberModal();

        }

    };

}

/* =====================================================
   Ver20
   Part⑮ End
===================================================== */
/* =====================================================
   🌸 まる家計 Ver20
   ---------------------------------------------
   ⑯ 起動処理
===================================================== */

/* =====================================================
   初回起動
===================================================== */

function initializeApp() {

    load();

    initializeYearSelect();

    update();

    showPage(lastPage || "home");

}

/* =====================================================
   初期化
===================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initializeApp();

    }

);

/* =====================================================
   自動保存
===================================================== */

window.addEventListener(

    "beforeunload",

    () => {

        save();

    }

);

/* =====================================================
   デバッグ
===================================================== */

window.maru = {

    app,

    update,

    save,

    load,

    showPage,

    getMonthData,

    getYearSummary,

    getYearCategoryData,

    analyzeHousehold

};

/* =====================================================
   Ver20 完成
===================================================== */

console.log(`
🌸 まる家計 Ver20
-------------------------
起動しました。

・年度管理
・月管理
・年間管理
・AI分析
・年間グラフ
・履歴管理
・銀行残高管理
・年間目標管理

Ready.
`);
