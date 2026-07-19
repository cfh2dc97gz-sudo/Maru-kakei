/* =====================================================
   まる家計 Ver20
   app.js
===================================================== */

"use strict";

/* =====================================================
   基本設定
===================================================== */

const STORAGE_KEY = "marukakei_ver20";

const MONTHS = [
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
    "1月",
    "2月",
    "3月"
];

const CATEGORY_LIST = [
    "🍚 食費",
    "🧻 日用品",
    "🚗 車",
    "🏠 家",
    "👶 子ども",
    "🎮 娯楽",
    "🏥 医療",
    "📱 通信",
    "⚡ 光熱費",
    "📦 その他"
];

/* =====================================================
   アプリデータ
===================================================== */

let app = {
    year: 2026,
    month: 0,

    goal: 3400000,

    bonus: {
        summer: 0,
        winter: 0
    },

    bank: {
        balance: 0,
        saving: 0
    },

    taxItems: [],

    months: {}
};

/* =====================================================
   共通
===================================================== */

function monthKey() {
    return `${app.year}-${app.month}`;
}

function createMonthData() {

    return {

        income: {

            papa: 0,
            mama: 0,
            extra: 0

        },

        categories: {},

        memo: ""

    };

}

function currentMonth() {

    const key = monthKey();

    if (!app.months[key]) {

        app.months[key] = createMonthData();

    }

    return app.months[key];

}

/* =====================================================
   保存
===================================================== */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(app)
    );

}

function loadData() {

    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return;

    try{

        app = JSON.parse(data);

    }catch(e){

        console.error(e);

    }

}

/* =====================================================
   金額
===================================================== */

function money(value){

    return "¥" + Number(value).toLocaleString();

}

function totalIncome(){

    const m = currentMonth();

    return (
        Number(m.income.papa)
        + Number(m.income.mama)
        + Number(m.income.extra)
    );

}

function totalSpent(){

    const m = currentMonth();

    return Object.values(
        m.categories
    ).reduce(

        (sum,value)=>

        sum + Number(value),

        0

    );

}

function remainMoney(){

    return totalIncome() - totalSpent();

}
/* =====================================================
   ホーム画面
===================================================== */

function updatePeriod() {

    document.getElementById("period").textContent =
        `${app.year}年${MONTHS[app.month]}`;

    document.getElementById("yearTitle").textContent =
        `${app.year}年度`;

    document.getElementById("yearSelect").value =
        app.year;

}

/* =====================================================
   カテゴリ
===================================================== */

function createCategoryButtons() {

    const area =
        document.getElementById("gridArea");

    area.innerHTML = "";

    CATEGORY_LIST.forEach(name => {

        const button =
            document.createElement("button");

        button.className =
            "category-button";

        button.textContent =
            name;

        button.addEventListener(
            "click",
            () => editCategory(name)
        );

        area.appendChild(button);

    });

}

/* =====================================================
   ホーム描画
===================================================== */

function drawHome() {

    const month =
        currentMonth();

    document.getElementById(
        "incomeSummary"
    ).textContent =
        money(totalIncome());

    document.getElementById(
        "spentSummary"
    ).textContent =
        money(totalSpent());

    document.getElementById(
        "remainSummary"
    ).textContent =
        money(remainMoney());

    document.getElementById(
        "incomeTotal"
    ).textContent =
        money(totalIncome());

    document.getElementById(
        "bankTotal"
    ).textContent =
        money(app.bank.balance);

    document.getElementById(
        "savingTotal"
    ).textContent =
        money(app.bank.saving);

}

/* =====================================================
   月移動
===================================================== */

function prevMonth() {

    app.month--;

    if(app.month < 0){

        app.month = 11;

        app.year--;

    }

    refresh();

}

function nextMonth() {

    app.month++;

    if(app.month > 11){

        app.month = 0;

        app.year++;

    }

    refresh();

}

/* =====================================================
   年度変更
===================================================== */

function changeYear(value){

    app.year =
        Number(value);

    app.month = 0;

    refresh();

}

/* =====================================================
   リフレッシュ
===================================================== */

function refresh() {

    normalizeData();

    updatePeriod();

    drawHome();

    drawAI();

    drawFamily();

    drawYear();

    drawTax();

    saveData();

}
/* =====================================================
   ダイアログ
===================================================== */

let dialogMode = "";
let dialogTarget = "";

const dialog =
    document.getElementById("inputDialog");

function openDialog(title, mode, target = "") {

    dialogMode = mode;
    dialogTarget = target;

    document.getElementById("dialogTitle").textContent =
        title;

    document.getElementById("dialogValue").value = "";

    dialog.showModal();

}

function closeDialog() {

    dialog.close();

}

function saveDialog() {

    const value = Number(
        document.getElementById("dialogValue").value || 0
    );

    const month = currentMonth();

    switch (dialogMode) {

        case "category":

            month.categories[dialogTarget] = value;
            break;

        case "papa":

            month.income.papa = value;
            break;

        case "mama":

            month.income.mama = value;
            break;

        case "extra":

            month.income.extra = value;
            break;

        case "bank":

            app.bank.balance = value;
            break;

        case "saving":

            app.bank.saving = value;
            break;

    }

    closeDialog();

    refresh();

}

/* =====================================================
   入力
===================================================== */

function editCategory(name) {

    openDialog(
        name,
        "category",
        name
    );

}

function editPapaIncome() {

    openDialog(
        "パパの収入",
        "papa"
    );

}

function editMamaIncome() {

    openDialog(
        "ママの収入",
        "mama"
    );

}

function editExtraIncome() {

    openDialog(
        "臨時収入",
        "extra"
    );

}

function editBank() {

    const result = confirm(
        "OK：銀行残高\nキャンセル：貯蓄額"
    );

    if (result) {

        openDialog(
            "銀行残高",
            "bank"
        );

    } else {

        openDialog(
            "貯蓄額",
            "saving"
        );

    }

}

/* =====================================================
   イベント登録
===================================================== */

function registerEvents() {

    document.getElementById("prevMonth")
        .addEventListener("click", prevMonth);

    document.getElementById("nextMonth")
        .addEventListener("click", nextMonth);

    document.getElementById("yearSelect")
        .addEventListener("change", e =>
            changeYear(e.target.value)
        );

    document.getElementById("incomePapa")
        .addEventListener("click", editPapaIncome);

    document.getElementById("incomeMama")
        .addEventListener("click", editMamaIncome);

    document.getElementById("incomeExtra")
        .addEventListener("click", editExtraIncome);

    document.getElementById("editBank")
        .addEventListener("click", editBank);

    document.getElementById("dialogCancel")
        .addEventListener("click", closeDialog);

    document.getElementById("dialogSave")
        .addEventListener("click", saveDialog);

}
/* =====================================================
   AIアドバイス
===================================================== */

function drawAI() {

    const remain = remainMoney();

    let comment = "";

    if (totalIncome() === 0) {

        comment =
            "まずは今月の収入を登録しましょう😊";

    } else if (remain >= totalIncome() * 0.5) {

        comment =
            "とても良いペースです！このまま貯蓄を増やしていきましょう🌸";

    } else if (remain >= totalIncome() * 0.2) {

        comment =
            "順調ですが、少し支出を意識するとさらに良くなります✨";

    } else if (remain >= 0) {

        comment =
            "残りのお金は計画的に使いましょう💡";

    } else {

        comment =
            "今月は赤字です。支出を見直してみましょう💦";

    }

    document.getElementById("aiComment").textContent =
        comment;

}
/* =====================================================
   年度対象データ取得
===================================================== */

function getFiscalMonths() {

    const list = [];

    for (let i = 0; i < 12; i++) {

        let year = app.year;
        let month = i;

        if (i >= 9) {
            year++;
        }

        const key = `${year}-${month}`;

        list.push(
            app.months[key] || createMonthData()
        );

    }

    return list;

}
/* =====================================================
   年間集計
===================================================== */

function yearTotalIncome() {

    let total = 0;

    getFiscalMonths().forEach(month => {

        total +=
            Number(month.income.papa)
            + Number(month.income.mama)
            + Number(month.income.extra);

    });

    return total;

}

function yearTotalSpent() {

    let total = 0;

    getFiscalMonths().forEach(month => {

        total += Object.values(month.categories).reduce(
            (sum, value) => sum + Number(value),
            0
        );

    });

    return total;

}
/* =====================================================
   年間画面
===================================================== */

function drawYear() {

    const income = totalYearIncomeWithBonus();
    const spent = yearTotalSpent();
    const remain = income - spent;

    document.getElementById("yearIncome").textContent =
        money(income);

    document.getElementById("yearSpent").textContent =
        money(spent);

    document.getElementById("yearRemain").textContent =
        money(remain);

    document.getElementById("yearGoal").textContent =
        `${money(remain)} / ${money(app.goal)}`;

    const percent =
        Math.min(remain / app.goal * 100, 100);

    document.getElementById("goalBar").style.width =
        Math.max(percent, 0) + "%";

    drawYearChart();
    drawCategoryAnalysis();

}

/* =====================================================
   年間グラフ
===================================================== */

function drawYearChart() {

    const canvas =
        document.getElementById("yearChart");

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const values = [];

    for (let i = 0; i < 12; i++) {

        let year = app.year;

if (i >= 9) {
    year++;
}

const key = `${year}-${i}`;

const m =
    app.months[key] || createMonthData();

        values.push(
            Number(m.income.papa)
            + Number(m.income.mama)
            + Number(m.income.extra)
            - Object.values(m.categories).reduce(
                (s, v) => s + Number(v),
                0
            )
        );

    }

    const max =
        Math.max(...values, 1);

    const width = 45;

    values.forEach((value, index) => {

        const height =
            value / max * 180;

        const x =
            25 + index * 55;

        const y =
            220 - height;

        ctx.fillStyle = "#7ec8ff";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

    });

}

/* =====================================================
   カテゴリ分析
===================================================== */

function drawCategoryAnalysis() {

    const totals = {};

    CATEGORY_LIST.forEach(name => {

        totals[name] = 0;

    });

    getFiscalMonths().forEach(m => {

    
        CATEGORY_LIST.forEach(name => {

            totals[name] +=
                Number(m.categories[name] || 0);

        });

    });

    const list = Object.entries(totals)
        .sort((a, b) => b[1] - a[1]);

    const area =
        document.getElementById("categoryAnalysis");

    area.innerHTML = list
        .map(item =>
            `<div>${item[0]}：${money(item[1])}</div>`
        )
        .join("");

}
/* =====================================================
   135万円管理
===================================================== */

function taxTotal() {

    return app.taxItems.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
    );

}

function drawTax() {

    const total = taxTotal();

    document.getElementById("taxSummary").textContent =
        `${money(total)} / ${money(1350000)}`;

    const percent = Math.min(total / 1350000 * 100, 100);

    document.getElementById("taxBar").style.width =
        percent + "%";

    const list =
        document.getElementById("taxList");

    list.innerHTML = "";

    app.taxItems.forEach((item, index) => {

        const row =
            document.createElement("div");

        row.className = "tax-item";

        row.innerHTML = `
            <div>
                <div class="tax-name">${item.name}</div>
                <div class="tax-money">${money(item.amount)}</div>
            </div>

            <div>
                <button data-edit="${index}">編集</button>
                <button data-delete="${index}">削除</button>
            </div>
        `;

        list.appendChild(row);

    });

    list.querySelectorAll("[data-edit]").forEach(btn => {

        btn.addEventListener("click", () => {

            editTaxItem(
                Number(btn.dataset.edit)
            );

        });

    });

    list.querySelectorAll("[data-delete]").forEach(btn => {

        btn.addEventListener("click", () => {

            deleteTaxItem(
                Number(btn.dataset.delete)
            );

        });

    });

}

function addTaxItem() {

    const name =
        prompt("項目名");

    if (!name) return;

    const amount =
        Number(prompt("金額") || 0);

    app.taxItems.push({
        name,
        amount
    });

    refresh();

}

function editTaxItem(index) {

    const item = app.taxItems[index];

    const name =
        prompt("項目名", item.name);

    if (name === null) return;

    const amount =
        Number(prompt("金額", item.amount) || 0);

    item.name = name;
    item.amount = amount;

    refresh();

}

function deleteTaxItem(index) {

    if (!confirm("削除しますか？")) return;

    app.taxItems.splice(index, 1);

    refresh();

}

/* =====================================================
   設定
===================================================== */

function editGoal() {

    const value =
        Number(prompt(
            "年間目標",
            app.goal
        ));

    if (!value) return;

    app.goal = value;

    refresh();

}

function editBonus() {

    const summer =
        Number(prompt(
            "夏のボーナス",
            app.bonus.summer
        ) || 0);

    const winter =
        Number(prompt(
            "冬のボーナス",
            app.bonus.winter
        ) || 0);

    app.bonus.summer = summer;
    app.bonus.winter = winter;

    refresh();

}

function editBudget() {

    alert(
        "カテゴリ予算機能はVer20後半で実装します。"
    );

}

function deleteAllData() {

    if (!confirm(
        "すべてのデータを削除しますか？"
    )) return;

    localStorage.removeItem(STORAGE_KEY);

    location.reload();

}
/* =====================================================
   ページ切り替え
===================================================== */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId)
        .classList.add("active");

    document.querySelectorAll(".bottom-nav button")
        .forEach(button => {
            button.classList.remove("active");
        });

    const activeButton = {
        homePage: "navHome",
        yearPage: "navYear",
        taxPage: "navTax",
        settingPage: "navSetting"
    };

    document.getElementById(activeButton[pageId])
        .classList.add("active");

}

/* =====================================================
   ナビゲーション
===================================================== */

function registerNavigation() {

    document.getElementById("navHome")
        .addEventListener("click", () => {
            showPage("homePage");
        });

    document.getElementById("navYear")
        .addEventListener("click", () => {
            showPage("yearPage");
            drawYear();
        });

    document.getElementById("navTax")
        .addEventListener("click", () => {
            showPage("taxPage");
            drawTax();
        });

    document.getElementById("navSetting")
        .addEventListener("click", () => {
            showPage("settingPage");
        });

}

/* =====================================================
   設定イベント
===================================================== */

function registerSettingEvents() {

    document.getElementById("editGoal")
        .addEventListener("click", editGoal);

    document.getElementById("editBonus")
        .addEventListener("click", editBonus);

    document.getElementById("editBudget")
        .addEventListener("click", editBudget);

    document.getElementById("editBankButton")
        .addEventListener("click", editBank);

    document.getElementById("deleteAll")
        .addEventListener("click", deleteAllData);

    document.getElementById("addTaxItem")
        .addEventListener("click", addTaxItem);

}

/* =====================================================
   初期化
===================================================== */

function initialize() {

    loadData();

    migrateData();

    normalizeData();

    currentMonth();

    createCategoryButtons();

    registerEvents();

    registerNavigation();

    registerSettingEvents();

    refresh();

}
/* =====================================================
   起動
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);
/* =====================================================
   家族キャラクター
===================================================== */

const FAMILY_STATUS = [
    {
        max: 0,
        icon: "🌱",
        name: "はる・りん",
        comment: "まずは収入を登録してみよう♪"
    },
    {
        max: 30000,
        icon: "😊",
        name: "はる・りん",
        comment: "少しずつ貯金ができているね！"
    },
    {
        max: 100000,
        icon: "😄",
        name: "はる・りん",
        comment: "順調！この調子でいこう🌸"
    },
    {
        max: 300000,
        icon: "🥳",
        name: "はる・りん",
        comment: "とてもいい家計管理だね✨"
    },
    {
        max: Infinity,
        icon: "👑",
        name: "はる・りん",
        comment: "最高！目標達成まであと少し！"
    }
];

function drawFamily() {

    const remain = remainMoney();

    const status =
        FAMILY_STATUS.find(item => remain <= item.max);

    document.getElementById("familyImage").textContent =
        status.icon;

    document.getElementById("familyName").textContent =
        status.name;

    document.getElementById("familyComment").textContent =
        status.comment;

}

/* =====================================================
   ボーナス込み年間収入
===================================================== */

function totalYearIncomeWithBonus() {

    return (
        yearTotalIncome()
        + Number(app.bonus.summer || 0)
        + Number(app.bonus.winter || 0)
    );

}

/* =====================================================
   入力値補正
===================================================== */

function normalizeData() {

    Object.keys(app.months).forEach(key => {

        const month = app.months[key];

        if (!month.income) {

            month.income = {
                papa: 0,
                mama: 0,
                extra: 0
            };

        }

        if (!month.categories) {

            month.categories = {};

        }

        CATEGORY_LIST.forEach(category => {

            if (month.categories[category] == null) {

                month.categories[category] = 0;

            }

        });

    });

}


/* =====================================================
   Ver20 Part7 完了
===================================================== */
/* =====================================================
   データ補完
===================================================== */

function migrateData() {

    if (!app.goal) {
        app.goal = 3400000;
    }

    if (!app.bonus) {
        app.bonus = {
            summer: 0,
            winter: 0
        };
    }

    if (!app.bank) {
        app.bank = {
            balance: 0,
            saving: 0
        };
    }

    if (!Array.isArray(app.taxItems)) {
        app.taxItems = [];
    }

    if (!app.months) {
        app.months = {};
    }

}


/* =====================================================
   デバッグ（開発用）
===================================================== */

window.marukakei = {

    app,

    saveData,

    loadData,

    refresh,

    currentMonth,

    yearTotalIncome,

    yearTotalSpent

};

/* =====================================================
   自動保存
===================================================== */

window.addEventListener("beforeunload", () => {

    saveData();

});

/* =====================================================
   Ver20 完成
===================================================== */

console.log(
    "🌸 まる家計 Ver20 Ready!"
);
