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
        }

    ],

    history: []

};
let currentYear = 2026;
let currentMonth = 4;

load();
update();

function save(){

    const key =
        `maru-kakei-${currentYear}-${String(currentMonth).padStart(2,"0")}`;

    localStorage.setItem(
        key,
        JSON.stringify(app)
    );

}

function load(){

    const key =
        `maru-kakei-${currentYear}-${String(currentMonth).padStart(2,"0")}`;

    const saved =
        localStorage.getItem(key);

    if(!saved) return;

    Object.assign(
        app,
        JSON.parse(saved)
    );

}

function update(){
    
     document.getElementById("period").textContent =
    `${currentYear}年${currentMonth}月`;
    
    const incomeTotal =
        app.income.papa +
        app.income.mama +
        app.income.extra;

    document.getElementById("income").textContent =
        "¥" + incomeTotal.toLocaleString();

    document.getElementById("incomeSummary").textContent =
        "¥" + incomeTotal.toLocaleString();

    const incomeHistory =
        document.getElementById("incomeHistory");

    incomeHistory.innerHTML = "";

    app.history
        .filter(h => h.category === "収入")
        .slice()
        .reverse()
        .forEach(h => {

            incomeHistory.innerHTML += `
<div class="mini-history">

    <div class="history-memo">
        ${h.memo}
    </div>

    <div class="mini-row">
        <small>${h.date}</small>
        <b>¥${h.amount.toLocaleString()}</b>
    </div>

</div>
`;

        });

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

    budgets.forEach((item,index)=>{

        totalSpent += item.spent;

        const remain =
            item.budget - item.spent;

        const history = app.history
            .filter(h => h.category === item.name)
            .slice()
            .reverse();

        let historyHtml = "";

        if(
            item.id !== "iwagin" &&
            item.id !== "rakuten"
        ){
                        history
                .slice(0, item.id === "food" ? 5 : 2)
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
        残高<br>
        ¥${remain.toLocaleString()}
    </div>

</div>
`;

        if(item.id === "food"){
            foodArea.innerHTML = card;
        }else{
            gridArea.innerHTML += card;
        }

    });

    document.getElementById("spent").textContent =
        "¥" + totalSpent.toLocaleString();

    const remainMoney =
        incomeTotal - totalSpent;

    const remainEl =
        document.getElementById("remain");

    remainEl.textContent =
        "¥" + remainMoney.toLocaleString();

    remainEl.className =
    "summary-money " +
    (remainMoney >= 0 ? "plus" : "minus");

document.getElementById("forecast").textContent =
    "現在予測 ¥" +
    remainMoney.toLocaleString();

const diff =
    app.goal - remainMoney;

document.getElementById("advice").textContent =
    diff <= 0
        ? "🎉 このままなら目標達成！"
        : `😊 あと ¥${diff.toLocaleString()} 改善で目標達成！`;

save();

}
function addSpent(index, isOverwrite = false){
    const input = prompt(
        "金額 メモ\n例：5000 マック"
    );

    if(!input) return;

    const parts = input.trim().split(" ");

    const amount = Number(parts[0]);

    if(!amount) return;

    const memo = parts.slice(1).join(" ");

    if(isOverwrite){
        app.budgets[index].spent = amount;
    }else{
        app.budgets[index].spent += amount;
    }

    app.history.push({

        date:new Date().toLocaleDateString(
            "ja-JP",
            {
                month:"numeric",
                day:"numeric"
            }
        ),

        category:app.budgets[index].name,

        amount:amount,

        memo:memo

    });

    update();

}

function addIncome(type){

    let amount;
    let memo = "";

    if(type === "臨時"){

        const input = prompt(
            "金額 メモ\n例：5000 お祝い"
        );

        if(!input) return;

        const parts = input.trim().split(" ");

        amount = Number(parts[0]);

        if(!amount) return;

        memo = parts.slice(1).join(" ");

    }else{

        amount = Number(
            prompt("収入金額")
        );

        if(!amount) return;

    }

    switch(type){

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

    if(type === "臨時"){

        app.history.push({

            date:new Date().toLocaleDateString(
                "ja-JP",
                {
                    month:"numeric",
                    day:"numeric"
                }
            ),

            category:"収入",

            amount:amount,

            memo:memo || "臨時収入"

        });

    }

    update();

}
    function resetMonth(){

    if(!confirm("今月をリセットしますか？")){
        return;
    }

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
    function changeMonth(step){

    save();

    currentMonth += step;

    if(currentMonth > 12){

        currentMonth = 1;
        currentYear++;

    }

    if(currentMonth < 1){

        currentMonth = 12;
        currentYear--;

    }

    app.income = {
        papa:0,
        mama:0,
        extra:0
    };

    app.budgets.forEach(item=>{

        item.spent = 0;

    });

    app.history = [];

    load();
    update();

}

