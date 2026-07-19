/* ===========================
   Ver15
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

    bank:{

        mitake:0,

        takizawa:0

    },

    startBank:0,

    income:{

        papa:0,

        mama:0,

        extra:0

    },

    bonus:{

        summerForecast:0,

        summerActual:0,

        winterForecast:0,

        winterActual:0

    },

    annualItems:[],

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

        getYearKey(),

        JSON.stringify({

            goal:app.goal,

            startBank:app.startBank,

            bonus:app.bonus,

            annualItems:app.annualItems

        })

    );

    localStorage.setItem(

        getKey(),

        JSON.stringify({

            bank:app.bank,

            income:app.income,

            budgets:app.budgets,

            history:app.history

        })

    );

    const session={

        year:currentYear,

        month:currentMonth,

        page:JSON.parse(

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

    app.bank={

        mitake:0,

        takizawa:0

    };

    app.startBank=0;

    app.income={

        papa:0,

        mama:0,

        extra:0

    };

    app.bonus={

        summerForecast:0,

        summerActual:0,

        winterForecast:0,

        winterActual:0

    };

    app.annualItems=[];

    app.budgets=createDefaultBudgets();

    app.history=[];

    const saved=

        localStorage.getItem(getKey());

    if(saved){

        const data=JSON.parse(saved);

        app.bank=data.bank ?? app.bank;

        app.income=data.income ?? app.income;

        app.budgets=data.budgets ?? app.budgets;

        app.history=data.history ?? [];

    }

    const yearSaved=

        localStorage.getItem(getYearKey());

    if(yearSaved){

        const data=JSON.parse(yearSaved);

        app.goal=data.goal ?? app.goal;

        app.startBank=data.startBank ?? 0;

        app.bonus=data.bonus ?? app.bonus;

        app.annualItems=data.annualItems ?? [];

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

// 年度外の月を補正
if(currentMonth < 4){

    currentYear--;

}

const yearSelect =
    document.getElementById("yearSelect");

if(yearSelect){

    yearSelect.value =
        String(currentYear);

    yearSelect.onchange = ()=>{

        save();

        currentYear =
            Number(yearSelect.value);

        // 年度変更時は必ず4月開始
        currentMonth = 4;

        load();

        update();

        drawYearSummary();

        drawYearCategory();

        drawYearChart();

        showPage(
            JSON.parse(
                localStorage.getItem(getSessionKey())
                || "{}"
            ).page || "home"
        );

    };

}

load();

update();
/* ===========================
   ④ 月変更・画面更新
=========================== */

function getDisplayYear(month = currentMonth){

    return month <= 3
        ? currentYear + 1
        : currentYear;

}

function getFiscalYear(){

    return currentYear;

}

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

    const period =
        document.getElementById("period");

    if(period){

        period.textContent =
            `${getDisplayYear()}年 ${currentMonth}月`;

    }

    const fiscalTitle =
        document.getElementById("fiscalYear");

    if(fiscalTitle){

        fiscalTitle.textContent =
            `${getFiscalYear()}年度`;

    }

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

    const bankTotal =
        document.getElementById("bankTotal");

    const savingTotal =
        document.getElementById("savingTotal");

    if(bankTotal){

        bankTotal.textContent =
            "¥" + (
                app.bank.mitake +
                app.bank.takizawa
            ).toLocaleString();

    }

    if(savingTotal){

        const totalBank =
            app.bank.mitake +
            app.bank.takizawa;

        const saving =
            totalBank -
            (app.startBank || 0);

        savingTotal.textContent =
            (saving >= 0 ? "+" : "") +
            "¥" +
            saving.toLocaleString();

        savingTotal.className =
            "bank-saving " +
            (saving >= 0 ? "plus" : "minus");

    }

    drawCategories();

    updateAI();

    drawYearSummary();

    drawYearChart();

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

function editBank(){

    const mitakeText =
        prompt("みたけ銀行残高");

    if(mitakeText === null) return;

    const mitake =
        Number(mitakeText);

    if(isNaN(mitake)) return;

    const takizawaText =
        prompt("滝沢銀行残高");

    if(takizawaText === null) return;

    const takizawa =
        Number(takizawaText);

    if(isNaN(takizawa)) return;

    app.bank.mitake = mitake;

    app.bank.takizawa = takizawa;

    // 4月だけ今年の基準残高を更新
    if(currentMonth === 4){

        app.startBank =
            mitake +
            takizawa;

    }

    update();

}

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

const annualPage =
    document.getElementById("annualPage");

const categoryPage =
    document.getElementById("categoryPage");

const settingPage =
    document.getElementById("settingPage");

const pages = [
    homePage,
    yearPage,
    annualPage,
    categoryPage,
    settingPage
];

const navButtons =
    document.querySelectorAll(".bottom-nav button");

let lastPage = "home";

function showPage(page){

    pages.forEach(p=>{

        if(p){

            p.style.display="none";

        }

    });

    navButtons.forEach(btn=>
        btn.classList.remove("active")
    );

    switch(page){

        case "home":

            homePage.style.display="block";
            navButtons[0].classList.add("active");
            lastPage="home";
            break;

        case "year":

            yearPage.style.display="block";
            navButtons[1].classList.add("active");

            drawYearSummary();
            drawYearCategory();
            drawYearChart();

            lastPage="year";
            break;

        case "annual":

            annualPage.style.display="block";
            navButtons[2].classList.add("active");

            drawAnnualManage();

            lastPage="annual";
            break;

        case "setting":

            settingPage.style.display="block";
            navButtons[3].classList.add("active");

            drawBudgetList();

            lastPage="setting";
            break;

        case "category":

            categoryPage.style.display="block";
            break;

    }

    if(page!=="category"){

        const session =
            JSON.parse(
                localStorage.getItem(getSessionKey())
                || "{}"
            );

        session.page = page;

        localStorage.setItem(
            getSessionKey(),
            JSON.stringify(session)
        );

    }

}

function backPage(){

    showPage(lastPage);

}

navButtons[0].onclick =
()=>showPage("home");

navButtons[1].onclick =
()=>showPage("year");

navButtons[2].onclick =
()=>showPage("annual");

navButtons[3].onclick =
()=>showPage("setting");
/* ===========================
   ⑦ AI分析
=========================== */

function updateAI(){

    const advice =
        document.getElementById("aiAdvice");

    if(!advice) return;

    const saving =
        (
            app.bank.mitake +
            app.bank.takizawa
        ) -
        (app.startBank || 0);

    const bonus =
        (app.bonus.summerActual || app.bonus.summerForecast || 0) +
        (app.bonus.winterActual || app.bonus.winterForecast || 0);

    const progress =
        saving + bonus;

    const remain =
        Math.max(
            app.goal - progress,
            0
        );

    const months = [
        4,5,6,7,8,9,
        10,11,12,
        1,2,3
    ];

    const index =
        months.indexOf(currentMonth);

    const left =
        Math.max(
            1,
            12 - index
        );

    const need =
        Math.ceil(remain / left);

    const sorted =
        [...app.budgets]
        .sort(
            (a,b)=>
                (b.spent/b.budget) -
                (a.spent/a.budget)
        );

    const top =
        sorted[0];

    advice.innerHTML = `

<b>🎯 年間目標</b><br>

あと
<b>¥${remain.toLocaleString()}</b><br><br>

📅 毎月あと
<b>¥${need.toLocaleString()}</b>
改善すると達成できます。<br><br>

⚠️ 気になるカテゴリ<br>

${top.name}<br>

¥${top.spent.toLocaleString()}
／
¥${top.budget.toLocaleString()}<br><br>

💰 ボーナスは
実績優先、
未入力は予測で計算しています。

`;

}
/* ===========================
   ⑧ 年間サマリー
=========================== */

function drawYearSummary(){

    const title =
        document.getElementById("yearTitle");

    if(title){

        title.textContent =
            `${currentYear}年度`;

    }

    let income = 0;
    let spent = 0;

    for(const month of [4,5,6,7,8,9,10,11,12,1,2,3]){

        const year =
            month <= 3
                ? currentYear + 1
                : currentYear;

        const key =
            `maru-kakei-${year}-${String(month).padStart(2,"0")}`;

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
                (sum,item)=>
                    sum + (item.spent || 0),
                0
            );

    }

    const remain =
        income - spent;

    const saving =
        (
            app.bank.mitake +
            app.bank.takizawa
        ) -
        (app.startBank || 0);

    const bonusTotal =
        (app.bonus.summerActual || app.bonus.summerForecast || 0) +
        (app.bonus.winterActual || app.bonus.winterForecast || 0);

    const progress =
        saving + bonusTotal;

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
        `¥${progress.toLocaleString()} / ¥${app.goal.toLocaleString()}`;

    document.getElementById("goalBar").style.width =
        Math.min(
            progress /
            Math.max(app.goal,1)
            * 100,
            100
        ) + "%";

}
/* ===========================
   ⑱ 年間カテゴリ
=========================== */

function drawYearCategory(){

    const area =
        document.getElementById("yearCategory");

    if(!area) return;

    area.innerHTML = "";

    const ranking =
        app.budgets.map(budget=>{

            const list =
                app.history.filter(
                    h=>h.category===budget.name
                );

            const total =
                list.reduce(
                    (sum,h)=>sum+h.amount,
                    0
                );

            const yearlyBudget =
                budget.budget * 12;

            const percent =
                yearlyBudget===0
                ?0
                :Math.round(total/yearlyBudget*100);

            return{

                budget,
                list,
                total,
                yearlyBudget,
                percent,
                diff: yearlyBudget-total

            };

        })
        .sort((a,b)=>{

            if(a.percent>=100 && b.percent<100) return -1;
            if(a.percent<100 && b.percent>=100) return 1;

            return b.percent-a.percent;

        });

    ranking.forEach((item,index)=>{

        let medal="";

        if(index===0) medal="🥇";
        else if(index===1) medal="🥈";
        else if(index===2) medal="🥉";

        const diffText =
            item.diff>=0
            ?`残 ¥${item.diff.toLocaleString()}`
            :`超過 ¥${Math.abs(item.diff).toLocaleString()}`;

        const bar =
            Math.min(item.percent,100);

        let barClass="progress-bar";

        if(item.percent>=100){

            barClass+=" danger";

        }else if(item.percent>=80){

            barClass+=" warning";

        }

        const alert =
            item.percent>=100
            ?`<div class="danger-text">🚨 年間予算を超過しています</div>`
            :item.percent>=80
            ?`<div class="warning-text">⚠ 年間予算の80%を使用しています</div>`
            :"";

        area.innerHTML += `

<div class="card">

<button
class="setting-item"
onclick="showCategoryHistory('${item.budget.id}')">

<span>

${medal} ${item.budget.name}<br>

<small>

年間予算 ¥${item.yearlyBudget.toLocaleString()}

</small>

</span>

<span>

¥${item.total.toLocaleString()}<br>

${diffText}

</span>

</button>

<div class="progress">

<div
class="${barClass}"
style="width:${bar}%">

</div>

</div>

<div
style="
text-align:right;
font-size:12px;
margin-top:4px;">

達成率 ${item.percent}%

</div>

${alert}

</div>

`;

    });

}

function showCategoryHistory(categoryId){

    showPage("category");

    const budget =
        app.budgets.find(
            b=>b.id===categoryId
        );

    if(!budget) return;

    document
        .getElementById("categoryTitle")
        .textContent =
        budget.name;

    const list =
        app.history
        .filter(
            h=>h.category===budget.name
        )
        .sort(
            (a,b)=>
                new Date(b.date)-
                new Date(a.date)
        );

    const total =
        list.reduce(
            (sum,h)=>sum+h.amount,
            0
        );

    const yearlyBudget =
        budget.budget*12;

    const diff =
        yearlyBudget-total;

    const percent =
        yearlyBudget===0
        ?0
        :Math.round(total/yearlyBudget*100);

    document
        .getElementById("categorySummary")
        .innerHTML=`

年間予算：¥${yearlyBudget.toLocaleString()}<br>

年間支出：¥${total.toLocaleString()}<br>

達成率：${percent}%<br>

差額：¥${diff.toLocaleString()}<br>

件数：${list.length}件<br>

月平均：¥${Math.round(total/12).toLocaleString()}

`;

    const history =
        document.getElementById("categoryHistory");

    history.innerHTML="";

    const monthMap={};

    list.forEach(item=>{

        const month=
            item.date.substring(0,7);

        if(!monthMap[month]){

            monthMap[month]=[];

        }

        monthMap[month].push(item);

    });

    Object.keys(monthMap)
        .sort()
        .reverse()
        .forEach(month=>{

            const monthList=
                monthMap[month];

            const monthTotal=
                monthList.reduce(
                    (sum,h)=>sum+h.amount,
                    0
                );

            history.innerHTML+=`

<div class="card">

<h3>${month}</h3>

<div>

合計：¥${monthTotal.toLocaleString()}　
${monthList.length}件

</div>

</div>

`;

            monthList.forEach(item=>{

                history.innerHTML+=`

<div class="setting-item">

<span>

${item.date}<br>

${item.memo||""}

</span>

<span>

¥${item.amount.toLocaleString()}

</span>

</div>

`;

            });

        });

}
/* ===========================
   ⑩ 年間グラフ
=========================== */

function drawYearChart(){

    const chart =
        document.getElementById("yearChart");

    if(!chart) return;

    chart.innerHTML = "";

    const months = [
        4,5,6,7,8,9,
        10,11,12,
        1,2,3
    ];

    const MAX = 200000;
    const AREA = 80;

    const scale =
        document.createElement("div");

    scale.className = "chart-scale";

    [
        "20万",
        "15万",
        "10万",
        "5万",
        "0",
        "-5万",
        "-10万",
        "-15万",
        "-20万"
    ].forEach(text=>{

        const div =
            document.createElement("div");

        div.textContent = text;

        scale.appendChild(div);

    });

    chart.appendChild(scale);

    const bars =
        document.createElement("div");

    bars.className =
        "year-chart-bars";

    months.forEach(month=>{

        const year =
            month<=3
                ? currentYear+1
                : currentYear;

        const key =
            `maru-kakei-${year}-${String(month).padStart(2,"0")}`;

        const save =
            JSON.parse(
                localStorage.getItem(key) || "{}"
            );

        const income =
            (save.income?.papa || 0) +
            (save.income?.mama || 0) +
            (save.income?.extra || 0);

        const spent =
            (save.budgets || []).reduce(
                (sum,item)=>
                    sum + (item.spent || 0),
                0
            );

        const remain =
            income - spent;

        const monthBox =
            document.createElement("div");

        monthBox.className =
            "chart-month";

        monthBox.onclick = ()=>{

            changeMonthFromYear(
                year,
                month
            );

        };

        const bar =
            document.createElement("div");

        bar.className =
            "chart-bar " +
            (remain>=0
                ? "chart-positive"
                : "chart-negative");

        bar.style.height =
            Math.max(
                2,
                Math.min(
                    Math.abs(remain),
                    MAX
                ) / MAX * AREA
            ) + "px";

        const label =
            document.createElement("div");

        label.className =
            "chart-label";

        label.textContent =
            month + "月";

        monthBox.appendChild(bar);

        monthBox.appendChild(label);

        bars.appendChild(monthBox);

    });

    chart.appendChild(bars);

}

function changeMonthFromYear(year,month){

    save();

    currentYear = year;

    currentMonth = month;

    if(yearSelect){

        yearSelect.value =
            String(
                month<=3
                    ? year-1
                    : year
            );

    }

    load();

    update();

    showPage("home");

}
/* ===========================
   ⑪ 年間135万円管理
=========================== */

function drawAnnualManage(){

    const area =
        document.getElementById("annualManageList");

    if(!area) return;

    area.innerHTML = "";

    app.annualItems.forEach((item,index)=>{

        const remain =
            item.budget - item.used;

        area.innerHTML += `

<button
class="setting-item"
onclick="editAnnualItem(${index})">

<span>

${item.name}

</span>

<span>

¥${item.used.toLocaleString()} /
¥${item.budget.toLocaleString()}<br>

残り ¥${remain.toLocaleString()}

</span>

</button>

`;

    });

}

document
.getElementById("addAnnualManage")
.onclick = ()=>{

    const name =
        prompt("項目名");

    if(!name) return;

    const budget =
        Number(prompt("年間予算"));

    if(isNaN(budget)) return;

    app.annualItems.push({

        name,

        budget,

        used:0

    });

    drawAnnualManage();

    save();

};

function editAnnualItem(index){

    const used =
        Number(prompt(

            "使用額",

            app.annualItems[index].used

        ));

    if(isNaN(used)) return;

    app.annualItems[index].used = used;

    drawAnnualManage();

    save();

}

/* ===========================
   ⑪ 初期表示
=========================== */

drawYearSummary();

drawYearCategory();

drawYearChart();

drawAnnualManage();

showPage(
    session.page || "home"
);

update();

console.log(
    "🌸 まる家計 Ver15 完成版 起動"
);
