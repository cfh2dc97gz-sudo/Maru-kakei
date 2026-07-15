/* ===========================
   Ver11
   ① データ・初期化
=========================== */

const app = {

    goal:3400000,

    income:{
        papa:0,
        mama:0,
        extra:0
    },

    budgets:[

        {
            id:"food",
            name:"🍚 食費",
            budget:80000,
            spent:0
        },

        {
            id:"utility",
            name:"💡 電気・水道",
            budget:32000,
            spent:0
        },

        {
            id:"iwagin",
            name:"🏦 岩銀",
            budget:40000,
            spent:0
        },

        {
            id:"rakuten",
            name:"💳 楽天",
            budget:20000,
            spent:0
        },

        {
            id:"holiday",
            name:"🎉 休日",
            budget:40000,
            spent:0
        },

        {
            id:"gas",
            name:"⛽ ガソリン",
            budget:17000,
            spent:0
        },

        {
            id:"other",
            name:"📦 その他",
            budget:30000,
            spent:0
        }

    ],

    history:[]

};

let currentYear = 2026;
let currentMonth = 4;

load();

update();
/* ===========================
   ② 保存・読込
=========================== */

function getKey(){

    return `maru-kakei-${currentYear}-${String(currentMonth).padStart(2,"0")}`;

}

function save(){

    localStorage.setItem(

        getKey(),

        JSON.stringify(app)

    );

}

function load(){

    const saved =

        localStorage.getItem(getKey());

    if(!saved) return;

    const data = JSON.parse(saved);

    app.goal = data.goal ?? app.goal;

    app.income = data.income ?? app.income;

    app.budgets = data.budgets ?? app.budgets;

    app.history = data.history ?? [];

}

/* ===========================
   月変更
=========================== */

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

    load();

    update();

}

document
.getElementById("prevMonth")
.onclick = ()=>changeMonth(-1);

document
.getElementById("nextMonth")
.onclick = ()=>changeMonth(1);
/* ===========================
   ③ 画面更新
=========================== */

function update(){

    document.getElementById("period").textContent =
        `${currentYear}年${currentMonth}月`;

    const incomeTotal =
        app.income.papa +
        app.income.mama +
        app.income.extra;

    const totalSpent =
        app.budgets.reduce(
            (sum,item)=>sum+item.spent,
            0
        );

    const remain =
        incomeTotal - totalSpent;

    document.getElementById("income").textContent =
        "¥" + incomeTotal.toLocaleString();

    document.getElementById("incomeSummary").textContent =
        "¥" + incomeTotal.toLocaleString();

    document.getElementById("spent").textContent =
        "¥" + totalSpent.toLocaleString();

    const remainEl =
        document.getElementById("remain");

    remainEl.textContent =
        "¥" + remain.toLocaleString();

    remainEl.className =
        "summary-money " +
        (remain >= 0 ? "plus" : "minus");

    document.getElementById("forecast").textContent =
        "現在予測 ¥"
        + remain.toLocaleString();

    const diff =
        app.goal - remain;

    document.getElementById("advice").textContent =
        diff <= 0
        ? "🎉 このままで目標達成！"
        : `😊 あと¥${diff.toLocaleString()}で目標達成！`;

    drawCategories();

    save();

}
/* ===========================
   ④ カテゴリ・収入・リセット
=========================== */

function drawCategories(){

    const grid =
        document.getElementById("gridArea");

    grid.innerHTML = "";

    app.budgets.forEach((item,index)=>{

        const remain =
            item.budget - item.spent;

        grid.innerHTML += `

<button
class="input-card"
onclick="addSpent(${index},${item.id==="iwagin"||item.id==="rakuten"})">

    <span class="input-name">
        ${item.name}
    </span>

    <span class="input-left ${remain<0?"over":""}">
        ¥${remain.toLocaleString()}
    </span>

</button>

`;

    });

}

function addIncome(type){

    const amount =
        Number(prompt("収入金額"));

    if(!amount) return;

    if(type==="パパ") app.income.papa += amount;
    if(type==="ママ") app.income.mama += amount;
    if(type==="臨時") app.income.extra += amount;

    update();

}

document
.getElementById("incomePapa")
.onclick = ()=>addIncome("パパ");

document
.getElementById("incomeMama")
.onclick = ()=>addIncome("ママ");

document
.getElementById("incomeExtra")
.onclick = ()=>addIncome("臨時");

document
.getElementById("resetMonth")
.onclick = ()=>{

    if(!confirm("今月をリセットしますか？"))
        return;

    app.income = {

        papa:0,
        mama:0,
        extra:0

    };

    app.budgets.forEach(item=>{

        item.spent = 0;

    });

    app.history = [];

    update();

};
/* ===========================
   ⑤ 支出入力
=========================== */

function addSpent(index,isOverwrite=false){

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
/* ===========================
   年間ページ切替
=========================== */

const homePage =
    document.body;

const yearPage =
    document.getElementById("yearPage");

const navButtons =
    document.querySelectorAll(".bottom-nav button");

navButtons[0].onclick = ()=>{

    yearPage.style.display = "none";

    document.querySelectorAll(".card").forEach(card=>{

        if(!card.closest("#yearPage")){

            card.style.display = "";

        }

    });

    navButtons[0].classList.add("active");
    navButtons[1].classList.remove("active");

};

navButtons[1].onclick = ()=>{

    document.querySelectorAll("body > .card").forEach(card=>{

        card.style.display = "none";

    });

    yearPage.style.display = "block";

    navButtons[1].classList.add("active");
    navButtons[0].classList.remove("active");

};
