const app = {
    goal: 3400000,

    income: {
        papa: 0,
        mama: 0,
        extra: 0
    },

    budgets: [
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
            id: "gas",
            name: "⛽ ガソリン",
            budget: 17000,
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
            id: "other",
            name: "📦 その他",
            budget: 30000,
            spent: 0
        }
    ],

    history: []
};

load();
update();

function save() {
    localStorage.setItem(
        "maru-kakei-v3",
        JSON.stringify(app)
    );
}

function load() {

    const saved =
        localStorage.getItem("maru-kakei-v3");

    if (!saved) return;

    Object.assign(app, JSON.parse(saved));

}function update() {

    const incomeTotal =
        app.income.papa +
        app.income.mama +
        app.income.extra;

    document.getElementById("income").textContent =
        "¥" + incomeTotal.toLocaleString();

const foodArea =
    document.getElementById("foodArea");

const gridArea =
    document.getElementById("gridArea");

foodArea.innerHTML = "";
gridArea.innerHTML = "";

    let totalSpent = 0;

  const order = [
    "food",
    "utility",
    "iwagin",
    "rakuten",
    "holiday",
    "gas",
    "other"
];

const budgets = order
    .map(id => app.budgets.find(b => b.id === id))
    .filter(Boolean);

budgets.forEach((item, index) => {

    totalSpent += item.spent;

    const remain = item.budget - item.spent;

    const history = app.history
        .filter(h => h.category === item.name)
        .slice()
        .reverse();

    let historyHtml = "";

    // 岩銀・楽天は履歴なし
   if (item.id === "food") {
    foodArea.innerHTML = card;
} else {
    gridArea.innerHTML += card;
}

        history.slice(0, item.id === "food" ? 5 : 2)
            .forEach(h => {

                historyHtml += `
                <div class="mini-history">

                    ${h.memo ? `<div class="history-memo">${h.memo}</div>` : ""}

                    <div class="mini-row">
                        <small>${h.date}</small>
                        <b>¥${h.amount.toLocaleString()}</b>
                    </div>

                </div>
                `;

            });

    }

    const foodClass =
        item.id === "food"
            ? "food-card"
            : "small-card";

const card = `
<div class="input-card ${foodClass}"
onclick="addSpent(${index}, ${item.id === "iwagin" || item.id === "rakuten"})">

    <div class="input-name">
        ${item.name}
    </div>

    <div class="input-left ${remain < 0 ? "over" : ""}">
        残 ¥${remain.toLocaleString()}
    </div>

    ${historyHtml}

    

</div>
`;

if (item.id === "food") {
    foodArea.innerHTML = card;
} else {
    gridArea.innerHTML += card;
}
    
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

    const diff = app.goal - remainMoney;

    document.getElementById("advice").textContent =
        diff <= 0
            ? "🎉 このままなら目標達成！"
            : `😊 あと ¥${diff.toLocaleString()} 改善で目標達成！`;

    save();

}
function addSpent(index, isOverwrite = false) {

    const input = prompt(
        "金額 メモ"
    );

    if (!input) return;

    const parts = input.trim().split(" ");

    const amount = Number(parts[0]);

    if (!amount) return;

    const memo = parts.slice(1).join(" ");

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

    const amount =
        Number(prompt("収入金額"));

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

    if (!confirm("今月をリセットしますか？"))
        return;

    app.budgets.forEach(item => {

        item.spent = 0;

    });

    app.history = [];

    app.income = {
        papa: 0,
        mama: 0,
        extra: 0
    };

    update();

}
