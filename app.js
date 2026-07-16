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

    drawCategories();

    updateAI();

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
   年間・設定ページ切替
=========================== */

const yearPage =
    document.getElementById("yearPage");

const settingPage =
    document.getElementById("settingPage");

const navButtons =
    document.querySelectorAll(".bottom-nav button");

navButtons[0].onclick = ()=>{

    yearPage.style.display = "none";

    settingPage.style.display = "none";

    document.querySelectorAll(".card").forEach(card=>{

        if(!card.closest("#yearPage") &&
           !card.closest("#settingPage")){

            card.style.display = "";

        }

    });

    navButtons[0].classList.add("active");
    navButtons[1].classList.remove("active");
    navButtons[2].classList.remove("active");

};

navButtons[1].onclick = ()=>{

    document.querySelectorAll("body > .card").forEach(card=>{

        card.style.display = "none";

    });

    settingPage.style.display = "none";

    yearPage.style.display = "block";

    navButtons[0].classList.remove("active");
    navButtons[1].classList.add("active");
    navButtons[2].classList.remove("active");

    drawYearSummary();
    drawYearCategory();
    drawYearChart();

};

navButtons[2].onclick = ()=>{

    document.querySelectorAll("body > .card").forEach(card=>{

        card.style.display = "none";

    });

    yearPage.style.display = "none";

    settingPage.style.display = "block";

    navButtons[0].classList.remove("active");
    navButtons[1].classList.remove("active");
    navButtons[2].classList.add("active");

};

/* ===========================
   設定
=========================== */

function drawBudgetList(){

    const area =
        document.getElementById("budgetList");

    area.innerHTML = "";

    app.budgets.forEach((item,index)=>{

        area.innerHTML += `

<button
class="setting-item"
onclick="editBudget(${index})">

    ${item.name}

    <span>

        ¥${item.budget.toLocaleString()}

    </span>

</button>

`;

    });

}

function editBudget(index){

    const budget =
        Number(prompt(

            `${app.budgets[index].name} の月予算`,

            app.budgets[index].budget

        ));

    if(!budget) return;

    app.budgets[index].budget = budget;

    save();

    update();

    drawBudgetList();

    drawYearCategory();

}

document.getElementById("editGoal").onclick = ()=>{

    const goal =
        Number(prompt(

            "年間目標を入力してください",

            app.goal

        ));

    if(!goal) return;

    app.goal = goal;

    save();

    update();

    drawYearSummary();

};

document.getElementById("deleteAll").onclick = ()=>{

    if(!confirm("すべてのデータを削除しますか？")){

        return;

    }

    localStorage.clear();

    location.reload();

};

navButtons[2].onclick = ()=>{

    document.querySelectorAll("body > .card").forEach(card=>{

        card.style.display = "none";

    });

    yearPage.style.display = "none";

    settingPage.style.display = "block";

    drawBudgetList();

    navButtons[0].classList.remove("active");
    navButtons[1].classList.remove("active");
    navButtons[2].classList.add("active");

};

/* ===========================
   設定
=========================== */

function drawBudgetList(){

    const area =
        document.getElementById("budgetList");

    area.innerHTML = "";

    app.budgets.forEach((item,index)=>{

        area.innerHTML += `

<button
class="setting-item"
onclick="editBudget(${index})">

    ${item.name}

    <span>

        ¥${item.budget.toLocaleString()}

    </span>

</button>

`;

    });

}

document.getElementById("editGoal").onclick = ()=>{

    const goal =
        Number(

            prompt(

                "年間目標を入力してください",

                app.goal

            )

        );

    if(!goal) return;

    app.goal = goal;

    save();

    update();

    drawYearSummary();

};

document.getElementById("editBonus").onclick = ()=>{

    const bonus =
        Number(

            prompt(

                "年間ボーナス貯金額",

                app.bonusSaving || 0

            )

        );

    if(isNaN(bonus)) return;

    app.bonusSaving = bonus;

    save();

    update();

};
/* ===========================
   年間カテゴリ分析
=========================== */

const yearlyBudget = {

    "食費":80000*12,
    "電気・水道":32000*12,
    "岩銀":40000*12,
    "楽天":20000*12,
    "休日":40000*12,
    "ガソリン":17000*12,
    "その他":30000*12

};

function drawYearCategory(){

    const area =
        document.getElementById("yearCategory");

    area.innerHTML = "";

    Object.keys(yearlyBudget).forEach(name=>{

        const budget =
            yearlyBudget[name];

        let actual = 0;

        for(let month=1; month<=12; month++){

            const key =
                `maru-kakei-${currentYear}-${String(month).padStart(2,"0")}`;

            const saved =
                localStorage.getItem(key);

            if(!saved) continue;

            const monthData =
                JSON.parse(saved);

            const item =
                monthData.budgets?.find(data=>

                    data.name.replace(/[^\u4E00-\u9FFFぁ-んァ-ヶー]/g,"").trim()
                    === name

                );

            if(item){

                actual += Number(item.spent) || 0;

            }

        }

        const diff =
            budget - actual;

        area.innerHTML += `

<div class="year-category">

    <h3>${name}</h3>

    <div class="year-line">

        <span>予算 ¥${budget.toLocaleString()}</span>

        <span>実績 ¥${actual.toLocaleString()}</span>

        <strong class="${diff>=0 ? "plus" : "minus"}">

            差額${diff>=0 ? "+" : "-"}¥${Math.abs(diff).toLocaleString()}

        </strong>

    </div>

</div>

`;

    });

}
/* ===========================
   年間合計
=========================== */

function drawYearSummary(){

    let income = 0;
    let spent = 0;

    for(let month=1; month<=12; month++){

        const key =
            `maru-kakei-${currentYear}-${String(month).padStart(2,"0")}`;

        const saved =
            localStorage.getItem(key);

        if(!saved) continue;

        const data =
            JSON.parse(saved);

        income +=
            (data.income?.papa || 0) +
            (data.income?.mama || 0) +
            (data.income?.extra || 0);

        spent +=
            (data.budgets || []).reduce(

                (sum,item)=>sum+(item.spent || 0),

                0

            );

    }

    const remain =
        income - spent;

    document.getElementById("yearIncome").textContent =
        "¥" + income.toLocaleString();

    document.getElementById("yearSpent").textContent =
        "¥" + spent.toLocaleString();

    const remainEl =
        document.getElementById("yearRemain");

    remainEl.textContent =
        "¥" + remain.toLocaleString();

    remainEl.className =
        "summary-money " +
        (remain >= 0 ? "plus" : "minus");

    document.getElementById("yearGoal").textContent =
        `¥${remain.toLocaleString()} / ¥${app.goal.toLocaleString()}`;

    const percent =
        Math.max(
            0,
            Math.min(remain / app.goal * 100, 100)
        );

    document.getElementById("goalBar").style.width =
        percent + "%";

}

/* ===========================
   月別推移
=========================== */

function drawYearChart(){

    const chart =
        document.getElementById("yearChart");

    chart.innerHTML = "";

    const months = [];

    let maxValue = 1;

    for(let month=1; month<=12; month++){

        const key =
            `maru-kakei-${currentYear}-${String(month).padStart(2,"0")}`;

        const saved =
            localStorage.getItem(key);

        let income = 0;
        let spent = 0;
        let remain = 0;

        if(saved){

            const data =
                JSON.parse(saved);

            income =
                (data.income?.papa || 0) +
                (data.income?.mama || 0) +
                (data.income?.extra || 0);

            spent =
                (data.budgets || []).reduce(

                    (sum,item)=>sum+(item.spent || 0),

                    0

                );

            remain =
                income - spent;

        }

        maxValue = Math.max(

            maxValue,

            Math.abs(remain)

        );

        months.push({

            month,

            remain

        });

    }

    months.forEach(item=>{

        const remainHeight =
            Math.max(

                Math.abs(item.remain) / maxValue * 140,

                2

            );

        const color =
            item.remain >= 0
            ? "#6FCF97"
            : "#EB5757";

        chart.innerHTML += `

<div
class="chart-month"
onclick="changeMonthFromYear(${item.month})">

    <div class="chart-area">

        <div class="chart-bars">

            <div
                class="chart-bar"
                style="
                    height:${remainHeight}px;
                    background:${color};
                ">

            </div>

        </div>

    </div>

    <div class="chart-label">

        ${item.month}月

    </div>

</div>

`;

    });

}
function changeMonthFromYear(month){

    currentMonth = month;

    load();

    update();

    navButtons[0].click();

}

drawYearSummary();
drawYearCategory();
drawYearChart();
