const app = {
    goal: 3400000,

    income: {
        papa: 0,
        mama: 0,
        extra: 0,
        papaBonus: 0,
        mamaBonus: 0
    },

    budgets: [
        {
            id: "rent",
            name: "🏠 家賃",
            budget: 91000,
            spent: 91000,
            fixed: true
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
            id: "food",
            name: "🍚 食費",
            budget: 80000,
            spent: 0
        },
        {
            id: "gas",
            name: "⛽ ガソリン",
            budget: 17000,
            spent: 0
        }
    ],

    history: []
};

load();
update();

function save() {
    localStorage.setItem(
        "maru-kakei-v2",
        JSON.stringify(app)
    );
}

function load() {

    const saved =
        localStorage.getItem("maru-kakei-v2");

    if (!saved) return;

    Object.assign(app, JSON.parse(saved));
}
function update() {

    const incomeTotal =
        app.income.papa +
        app.income.mama +
        app.income.extra;

    document.getElementById("income").textContent =
        "¥" + incomeTotal.toLocaleString();

    const budgetList =
        document.getElementById("budgetList");

    budgetList.innerHTML = "";

    let totalSpent = 0;

    app.budgets.forEach((item, index) => {

        if (item.id === "rent") return;

        totalSpent += item.spent;

        const remain =
            item.budget - item.spent;

        budgetList.innerHTML += `
<div class="input-card">

<div class="input-name">
${item.name}
</div>

<div class="input-used">
¥${item.spent.toLocaleString()} / ¥${item.budget.toLocaleString()}
</div>

<div class="input-left ${remain < 0 ? "over" : ""}">
残 ¥${remain.toLocaleString()}
</div>

<button class="mini-btn"
onclick="addSpent(${index}, ${item.id === "iwagin" || item.id === "rakuten"})">
＋
</button>

</div>
`;

    });

    document.getElementById("spent").textContent =
        "¥" + totalSpent.toLocaleString();

    const remainMoney =
        incomeTotal - totalSpent;

    document.getElementById("remain").textContent =
        "¥" + remainMoney.toLocaleString();

    document.getElementById("forecast").textContent =
        "現在予測 ¥"
        + remainMoney.toLocaleString();

    const diff =
        app.goal - remainMoney;

    document.getElementById("advice").textContent =
        diff <= 0
            ? "🎉 このままなら目標達成！"
            : "😊 あと ¥"
            + diff.toLocaleString()
            + " 改善で目標達成！";
const historyList =
    document.getElementById("historyList");

historyList.innerHTML = "";

app.history
    .slice()
    .reverse()
    .forEach(item => {

        historyList.innerHTML += `
<div class="history-item">

    <div class="history-date">
        ${item.date}
    </div>

    <div class="history-main">
        <span>${item.category}</span>

        <span class="history-amount">
            ¥${item.amount.toLocaleString()}
        </span>

    </div>

</div>
`;

    });

    save();

}

    function addSpent(index, isOverwrite = false) {

    const amount = Number(prompt("金額を入力"));
    if (!amount) return;

const memo = prompt("メモ（任意）") || "";
    if (isOverwrite) {
        app.budgets[index].spent = amount;
    } else {
        app.budgets[index].spent += amount;
    }

    app.history.push({
    date: new Date().toLocaleDateString("ja-JP"),
    category: app.budgets[index].name,
    amount: amount,
    memo: memo
});

    update();
}

function addIncome(type) {

    const amount = Number(prompt("収入金額"));

    if (!amount) return;

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

    update();

}

function resetMonth() {

    if (!confirm("今月をリセットしますか？")) return;

    app.budgets.forEach(item => {

        if (!item.fixed) {
            item.spent = 0;
        }

    });

    app.history = [];

    app.income = {
        papa: 0,
        mama: 0,
        extra: 0,
        papaBonus: 0,
        mamaBonus: 0
    };

    update();

}
function addFood() {
    addSpent(5);
}

function addHoliday() {
    addSpent(4);
}

function addGas() {
    addSpent(6);
}

function addUtility() {
    addSpent(1);
}

function setIwagin() {
    addSpent(2, true);
}

function setRakuten() {
    addSpent(3, true);
}
