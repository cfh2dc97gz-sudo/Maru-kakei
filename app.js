/* ===========================
   Ver12
   ① データ・初期化
=========================== */

const app = {

    goal:3400000,

    bonusSaving:0,

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

const yearSelect =
    document.getElementById("yearSelect");

yearSelect.value =
    String(currentYear);

yearSelect.onchange = ()=>{

    save();

    currentYear =
        Number(yearSelect.value);

    currentMonth = 4;

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

    drawYearSummary();

    drawYearCategory();

    drawYearChart();

};

load();

update();
/* ===========================
   ② 保存・読込
=========================== */

function getKey(){

    const saveYear =
        currentMonth <= 3
        ? currentYear + 1
        : currentYear;

    return `maru-kakei-${saveYear}-${String(currentMonth).padStart(2,"0")}`;

}

function getYearKey(){

    return `maru-kakei-year-${currentYear}`;

}

function save(){

    localStorage.setItem(

        getKey(),

        JSON.stringify(app)

    );

    localStorage.setItem(

        getYearKey(),

        JSON.stringify({

            goal:app.goal,

            bonusSaving:app.bonusSaving

        })

    );

}
function load(){

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

        const yearData =
            JSON.parse(yearSaved);

        app.goal =
            yearData.goal ?? app.goal;

        app.bonusSaving =
            yearData.bonusSaving ?? app.bonusSaving;

    }

}
/* ===========================
   月変更
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
/* ===========================
   ③ 画面更新
=========================== */

function update(){

    yearSelect.value =
    String(currentYear);

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

    if(type==="パパ"){

        app.income.papa += amount;

    }

    if(type==="ママ"){

        app.income.mama += amount;

    }

    if(type==="臨時"){

        app.income.extra += amount;

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

    if(!confirm("今月をリセットしますか？")){

        return;

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

    update();

};
/* ===========================
   ⑤ 支出入力
=========================== */

function addSpent(index,isOverwrite=false){

    const input =
        prompt(
            "金額 メモ\n例：5000 マック"
        );

    if(!input) return;

    const parts =
        input.trim().split(" ");

    const amount =
        Number(parts[0]);

    if(!amount) return;

    const memo =
        parts.slice(1).join(" ");

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

        category:

            app.budgets[index].name,

        amount,

        memo

    });

    update();

}
/* ===========================
   ⑥ ページ切替
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

    document.getElementById("homePage").style.display =
        "block";

    navButtons[0].classList.add("active");
    navButtons[1].classList.remove("active");
    navButtons[2].classList.remove("active");

};

navButtons[1].onclick = ()=>{

    document.getElementById("homePage").style.display =
        "none";

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

    document.getElementById("homePage").style.display =
        "none";

    yearPage.style.display = "none";

    settingPage.style.display = "block";

    drawBudgetList();

    navButtons[0].classList.remove("active");
    navButtons[1].classList.remove("active");
    navButtons[2].classList.add("active");

};
/* ===========================
   ⑦ 設定
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

    <span>

        ${item.name}

    </span>

    <span>

        ¥${item.budget.toLocaleString()}

    </span>

</button>

`;

    });

}

function editBudget(index){

    const budget =
        Number(

            prompt(

                `${app.budgets[index].name} の月予算`,

                app.budgets[index].budget

            )

        );

    if(isNaN(budget)) return;

    app.budgets[index].budget = budget;

    save();

    update();

    drawBudgetList();

    drawYearCategory();

}

document
.getElementById("editGoal")
.onclick = ()=>{

    const goal =
        Number(

            prompt(

                "年間目標を入力してください",

                app.goal

            )

        );

    if(isNaN(goal)) return;

    app.goal = goal;

    save();

    update();

    drawYearSummary();

};

document
.getElementById("editBonus")
.onclick = ()=>{

    const bonus =
        Number(

            prompt(

                "年間ボーナス貯金額",

                app.bonusSaving

            )

        );

    if(isNaN(bonus)) return;

    app.bonusSaving = bonus;

    save();

    update();

};

document
.getElementById("deleteAll")
.onclick = ()=>{

    if(!confirm("すべてのデータを削除しますか？")){

        return;

    }

    localStorage.clear();

    location.reload();

};
/* ===========================
   ⑧ AIコンサルタント
=========================== */

function updateAI(){

    const advice =
        document.getElementById("aiAdvice");

    const income =
        app.income.papa +
        app.income.mama +
        app.income.extra;

    const spent =
        app.budgets.reduce(
            (sum,item)=>sum+item.spent,
            0
        );
const categoryForecast = app.budgets.map(item=>{

    const yearlyBudget = item.budget * 12;

    const yearlyForecast =
        currentMonth > 0
        ? Math.round(item.spent / currentMonth * 12)
        : 0;

    return{

        name:item.name,

        yearlyBudget,

        yearlyForecast,

        diff:yearlyForecast - yearlyBudget

    };

});
   
    if(income===0){

        advice.innerHTML =
            "収入を入力すると分析を開始します。";

        return;

    }

    const remain =
        income - spent;

    const monthlyTarget =
        Math.max(
            app.goal - app.bonusSaving,
            0
        );

    const remainMonths =
        12 - currentMonth;

    const forecast =
        Math.round(
            remain / currentMonth * 12
        );

    const shortage =
        monthlyTarget - forecast;
const overCategories = categoryForecast
    .filter(item=>item.diff > 0)
    .sort((a,b)=>b.diff-a.diff)
    .slice(0,2);

let categoryComment = "";

if(overCategories.length){

    categoryComment = "<br><br>📌 気になるカテゴリ<br>";

    overCategories.forEach(item=>{

        const monthlyOver =
            Math.ceil(item.diff / 12);

        categoryComment +=
            `${item.name} は年間約¥${item.diff.toLocaleString()}オーバー見込みです。<br>` +
            `毎月約¥${monthlyOver.toLocaleString()}抑えると予算内になります。<br><br>`;

    });

}
   
    if(shortage<=0){

        advice.innerHTML =

`✅ このペースなら年間目標を達成する見込みです。

年間目標：¥${app.goal.toLocaleString()}
ボーナス貯金：¥${app.bonusSaving.toLocaleString()}
毎月の目標：¥${monthlyTarget.toLocaleString()}${categoryComment}`;
        return;

    }

    const improve =
        Math.ceil(
            shortage / Math.max(remainMonths,1)
        );

    advice.innerHTML =

`📊 年間目標まで約¥${shortage.toLocaleString()}不足する見込みです。

残り${remainMonths}か月は毎月約¥${improve.toLocaleString()}改善すると達成圏内になります。${categoryComment}`;

}
/* ===========================
   ⑨ 年間
=========================== */

function drawYearSummary(){

    let income = 0;

    let spent = 0;

    for(let month=1; month<=12; month++){

        const saved =
            localStorage.getItem(

                `maru-kakei-${currentYear}-${String(month).padStart(2,"0")}`

            );

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

    const monthlyGoal =
        Math.max(
            app.goal - app.bonusSaving,
            0
        );

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
        (remain>=0 ? "plus" : "minus");

    document.getElementById("yearGoal").textContent =
        `¥${remain.toLocaleString()} / ¥${monthlyGoal.toLocaleString()}`;

    const percent =
        Math.max(
            0,
            Math.min(
                remain / monthlyGoal * 100,
                100
            )
        );

    document.getElementById("goalBar").style.width =
        percent + "%";

}

function drawYearCategory(){

    document.getElementById("yearCategory").innerHTML =
        "Ver13でAI分析へ統合予定";

}
/* ===========================
   ⑩ 月別推移
=========================== */

function drawYearChart(){

    const chart =
        document.getElementById("yearChart");

    chart.innerHTML = "";

    chart.innerHTML =
        "<div style='text-align:center;color:#888;padding:30px;'>Ver13で表示します</div>";

}

function changeMonthFromYear(month){

    currentMonth = month;

    load();

    update();

    navButtons[0].click();

}

/* ===========================
   初期表示
=========================== */

drawYearSummary();

drawYearCategory();

drawYearChart();

navButtons[0].click();
