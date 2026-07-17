/* ===========================
   Ver14
   ① データ・初期化
=========================== */

const DEFAULT_BUDGETS = [

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

];

function createDefaultBudgets(){

    return JSON.parse(
        JSON.stringify(DEFAULT_BUDGETS)
    );

}

const app = {

    goal:3400000,

    bonusSaving:0,

    income:{

        papa:0,

        mama:0,

        extra:0

    },

    budgets:createDefaultBudgets(),

    history:[]

};

let currentYear = 2026;

let currentMonth = 4;
/* ===========================
   ② 保存・読込
=========================== */

function getKey(){

    return `maru-kakei-${currentYear}-${String(currentMonth).padStart(2,"0")}`;

}

function getYearKey(){

    return `maru-kakei-year-${currentYear}`;

}

function getSessionKey(){

    return "maru-kakei-session";

}

function save(){

    localStorage.setItem(

        getKey(),

        JSON.stringify({

            income:app.income,

            budgets:app.budgets,

            history:app.history

        })

    );

    localStorage.setItem(

        getYearKey(),

        JSON.stringify({

            goal:app.goal,

            bonusSaving:app.bonusSaving

        })

    );

    const session = {

        year:currentYear,

        month:currentMonth,

        page:

            JSON.parse(

                localStorage.getItem(getSessionKey())

                || "{}"

            ).page || "home"

    };

    localStorage.setItem(

        getSessionKey(),

        JSON.stringify(session)

    );

}

function load(){

    app.income = {

        papa:0,

        mama:0,

        extra:0

    };

    app.budgets =

        createDefaultBudgets();

    app.history = [];

    const saved =

        localStorage.getItem(getKey());

    if(saved){

        const data =

            JSON.parse(saved);

        app.income =

            data.income ?? app.income;

        app.budgets =

            data.budgets ?? app.budgets;

        app.history =

            data.history ?? [];

    }

    const yearSaved =

        localStorage.getItem(getYearKey());

    if(yearSaved){

        const data =

            JSON.parse(yearSaved);

        app.goal =

            data.goal ?? app.goal;

        app.bonusSaving =

            data.bonusSaving ?? app.bonusSaving;

    }

}
/* ===========================
   ③ 初期化・年度セレクト
=========================== */

const session =

    JSON.parse(

        localStorage.getItem(getSessionKey())

        || "{}"

    );

currentYear =

    session.year ?? 2026;

currentMonth =

    session.month ?? 4;

const yearSelect =

    document.getElementById("yearSelect");

if(yearSelect){

    yearSelect.value =

        String(currentYear);

    yearSelect.onchange = ()=>{

        save();

        currentYear =

            Number(yearSelect.value);

        currentMonth = 4;

        load();

        update();

        drawYearSummary();

        drawYearCategory();

        drawYearChart();

    };

}

load();

update();
/* ===========================
   ④ 月変更・画面更新
=========================== */

function changeMonth(step){

    save();

    currentMonth += step;

    if(currentMonth > 12){

        currentMonth = 1;

    }

    if(currentMonth < 1){

        currentMonth = 12;

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

function update(){

    if(yearSelect){

        yearSelect.value =
            String(currentYear);

    }

    document.getElementById("period").textContent =
        `${currentMonth}月`;

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
   ⑤ カテゴリ・収入・支出
=========================== */

function drawCategories(){

    const grid =
        document.getElementById("gridArea");

    if(!grid) return;

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

    app.budgets =
        createDefaultBudgets();

    app.history = [];

    update();

};

function addSpent(index,isOverwrite=false){

    const input =
        prompt("金額 メモ\n例：5000 マック");

    if(!input) return;

    const parts =
        input.trim().split(" ");

    const amount =
        Number(parts[0]);

    if(!amount) return;

    const memo =
        parts.slice(1).join(" ");

    if(isOverwrite){

        app.budgets[index].spent =
            amount;

    }else{

        app.budgets[index].spent +=
            amount;

    }

    app.history.push({

        date:new Date().toLocaleDateString(
            "ja-JP",
            {
                month:"numeric",
                day:"numeric"
            }
        ),

        category:
            app.budgets[index].name,

        amount,

        memo

    });

    update();

}
/* ===========================
   ⑥ ページ切替・設定
=========================== */

const homePage =
    document.getElementById("homePage");

const yearPage =
    document.getElementById("yearPage");

const settingPage =
    document.getElementById("settingPage");

const navButtons =
    document.querySelectorAll(".bottom-nav button");

function showPage(page){

    homePage.style.display = "none";
    yearPage.style.display = "none";
    settingPage.style.display = "none";

    navButtons.forEach(btn=>
        btn.classList.remove("active")
    );

    if(page==="home"){

        homePage.style.display="block";
        navButtons[0].classList.add("active");

    }

    if(page==="year"){

        yearPage.style.display="block";
        navButtons[1].classList.add("active");

        drawYearSummary();
        drawYearCategory();
        drawYearChart();

    }

    if(page==="setting"){

        settingPage.style.display="block";
        navButtons[2].classList.add("active");

        drawBudgetList();

    }

    const session = JSON.parse(

        localStorage.getItem(getSessionKey())

        || "{}"

    );

    session.page = page;

    localStorage.setItem(

        getSessionKey(),

        JSON.stringify(session)

    );

}

navButtons[0].onclick=()=>showPage("home");

navButtons[1].onclick=()=>showPage("year");

navButtons[2].onclick=()=>showPage("setting");

function drawBudgetList(){

    const area =
        document.getElementById("budgetList");

    if(!area) return;

    area.innerHTML="";

    app.budgets.forEach((item,index)=>{

        area.innerHTML += `

<button
class="setting-item"
onclick="editBudget(${index})">

<span>${item.name}</span>

<span>¥${item.budget.toLocaleString()}</span>

</button>

`;

    });

}

function editBudget(index){

    const value = Number(

        prompt(

            `${app.budgets[index].name} の月予算`,

            app.budgets[index].budget

        )

    );

    if(isNaN(value)) return;

    app.budgets[index].budget = value;

    update();

    drawBudgetList();

}

document
.getElementById("editGoal")
.onclick=()=>{

    const value=Number(

        prompt(

            "年間目標",

            app.goal

        )

    );

    if(isNaN(value)) return;

    app.goal=value;

    update();

};

document
.getElementById("editBonus")
.onclick=()=>{

    const value=Number(

        prompt(

            "年間ボーナス貯金",

            app.bonusSaving

        )

    );

    if(isNaN(value)) return;

    app.bonusSaving=value;

    update();

};

document
.getElementById("deleteAll")
.onclick=()=>{

    if(!confirm("全データを削除しますか？"))

        return;

    localStorage.clear();

    location.reload();

};
/* ===========================
   ⑦ AI・年間画面・初期表示
=========================== */

function updateAI(){

    const advice =
        document.getElementById("aiAdvice");

    if(!advice) return;

    const income =
        app.income.papa +
        app.income.mama +
        app.income.extra;

    const spent =
        app.budgets.reduce(
            (sum,item)=>sum+item.spent,
            0
        );

    if(income===0){

        advice.innerHTML =
            "収入を入力すると分析を開始します。";

        return;

    }

    const remain =
        income - spent;

    const target =
        Math.max(
            app.goal - app.bonusSaving,
            0
        );

    const forecast =
        remain * 12;

    if(forecast >= target){

        advice.innerHTML =
            `✅ このペースなら年間目標達成見込みです。<br><br>
年間目標：¥${app.goal.toLocaleString()}<br>
ボーナス予定：¥${app.bonusSaving.toLocaleString()}`;

    }else{

        const diff =
            target - forecast;

        advice.innerHTML =
            `📊 年間目標まで約 ¥${diff.toLocaleString()} 不足見込みです。`;

    }

}

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
                (sum,item)=>sum+(item.spent||0),
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

    document.getElementById("goalBar").style.width =
        Math.min(
            remain / Math.max(app.goal,1) * 100,
            100
        ) + "%";

}
function drawYearCategory(){

    const area =
        document.getElementById("yearCategory");

    if(!area) return;

    area.innerHTML =
        "<div style='padding:20px;text-align:center;color:#888;'>Ver14.1でカテゴリ分析を追加予定</div>";

}

function drawYearChart(){

    const chart = document.getElementById("yearChart");
if (!chart) return;

chart.innerHTML = "";

const months = [4,5,6,7,8,9,10,11,12,1,2,3];
const data = [];
let max = 1;

months.forEach(month => {

    const key = `maru-kakei-${currentYear}-${String(month).padStart(2,"0")}`;
    const saved = localStorage.getItem(key);

    let remain = 0;

    if(saved){

        const d = JSON.parse(saved);

        const income =
            (d.income?.papa || 0) +
            (d.income?.mama || 0) +
            (d.income?.extra || 0);

        const spent =
            (d.budgets || [])
            .reduce((sum,item)=>sum + (item.spent || 0),0);

        remain = income - spent;

    }

    max = Math.max(max, Math.abs(remain));

    data.push({
        month,
        remain
    });

});
   data.forEach(item => {

    const column = document.createElement("div");
column.className = "chart-month";
column.onclick = () => changeMonthFromYear(item.month);

const height = Math.max(
    2,
    Math.round((Math.abs(item.remain) / max) * 50)
);

let html = "";

if(item.remain > 0){

    html += `
        <div
            class="chart-bar chart-positive"
            style="height:${height}px;">
        </div>
    `;

}

if(item.remain < 0){

    html += `
        <div
            class="chart-bar chart-negative"
            style="height:${height}px;">
        </div>
    `;

}

html += `
    <div class="chart-label">
        ${item.month}
    </div>
`;

column.innerHTML = html;

chart.appendChild(column);

});
   }

function changeMonthFromYear(month){

    currentMonth = month;

    load();

    update();

    showPage("home");

}

drawYearSummary();

drawYearCategory();

drawYearChart();

showPage(session.page || "home");

update();
