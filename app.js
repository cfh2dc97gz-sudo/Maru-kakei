const app = {
    goal: 2414000,

    income: {
        papa: 0,
        mama: 0,
        extra: 0,
        papaBonus: 0,
        mamaBonus: 0
    },

    bankBalance: 0,

    budgets: [
        {
            id: "rent",
            name: "🏠 家賃",
            budget: 91000,
            spent: 91000,
            fixed: true,
            enabled: true
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
    const saved = localStorage.getItem("maru-kakei-v2");

    if (!saved) return;

    const data = JSON.parse(saved);

    Object.assign(app, data);
}
function update() {

    const incomeTotal =
        app.income.papa +
        app.income.mama +
        app.income.extra +
        app.income.papaBonus +
        app.income.mamaBonus;

    document.getElementById("income").textContent =
        "¥" + incomeTotal.toLocaleString();

    const budgetList = document.getElementById("budgetList");

    budgetList.innerHTML = "";

    let totalSpent = 0;

    app.budgets.forEach(item => {

        totalSpent += item.spent;

        const remain = item.budget - item.spent;

        const color = remain < 0 ? "red" : "black";

        budgetList.innerHTML += `
            <div style="margin-bottom:20px;">
                <strong>${item.name}</strong><br>
                予算 ¥${item.budget.toLocaleString()}<br>
                使用 ¥${item.spent.toLocaleString()}<br>
                <span style="color:${color}">
                    残り ¥${remain.toLocaleString()}
                </span>
            </div>
        `;
    });

    const forecast = incomeTotal - totalSpent;

    document.getElementById("forecast").textContent =
        "現在予測 ¥" + forecast.toLocaleString();

    const diff = app.goal - forecast;

    const advice = document.getElementById("advice");

    if (diff <= 0) {

        advice.textContent =
            "🎉 目標達成ペースです！";

    } else {

        advice.textContent =
            "あと ¥" +
            diff.toLocaleString() +
            " 改善すると目標達成です！";

    }

    const historyList =
        document.getElementById("historyList");

    historyList.innerHTML = "";

    if (app.history.length === 0) {

        historyList.innerHTML =
            "<p>まだ履歴はありません</p>";

    } else {

        app.history
            .slice()
            .reverse()
            .forEach(item => {

                historyList.innerHTML += `
                    <p>
                        ${item.date}<br>
                        ${item.category}
                        ¥${item.amount.toLocaleString()}
                    </p>
                    <hr>
                `;

            });

    }

    save();

}
function addExpense() {

    let text = "";

    app.budgets.forEach((item, index) => {
        text += (index + 1) + " " + item.name + "\n";
    });

    const category = prompt(text);

    if (!category) return;

    const amount = Number(prompt("金額"));

    if (!amount) return;

    const budget = app.budgets[category - 1];

    budget.spent += amount;

    app.history.push({
        date: new Date().toLocaleDateString("ja-JP"),
        category: budget.name,
        amount: amount
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

        case "パパボーナス":
            app.income.papaBonus += amount;
            break;

        case "ママボーナス":
            app.income.mamaBonus += amount;
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
