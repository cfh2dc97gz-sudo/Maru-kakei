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

const settingPage =
    document.getElementById("settingPage");

const navButtons =
    document.querySelectorAll(".bottom-nav button");

function showPage(page){

    homePage.style.display="none";
    yearPage.style.display="none";
    settingPage.style.display="none";

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

    const session=JSON.parse(

        localStorage.getItem(getSessionKey())

        || "{}"

    );

    session.page=page;

    localStorage.setItem(

        getSessionKey(),

        JSON.stringify(session)

    );

}

navButtons[0].onclick=()=>showPage("home");
navButtons[1].onclick=()=>showPage("year");
navButtons[2].onclick=()=>showPage("setting");

function drawBudgetList(){

    const area=
        document.getElementById("budgetList");

    if(!area) return;

    area.innerHTML="";

    app.budgets.forEach((item,index)=>{

        area.innerHTML+=`

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

    const value=Number(

        prompt(

            `${app.budgets[index].name} の月予算`,

            app.budgets[index].budget

        )

    );

    if(isNaN(value)) return;

    app.budgets[index].budget=value;

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

    const summerForecast=Number(prompt("夏ボーナス予測",app.bonus.summerForecast));

    if(isNaN(summerForecast)) return;

    const summerActual=Number(prompt("夏ボーナス実績",app.bonus.summerActual));

    if(isNaN(summerActual)) return;

    const winterForecast=Number(prompt("冬ボーナス予測",app.bonus.winterForecast));

    if(isNaN(winterForecast)) return;

    const winterActual=Number(prompt("冬ボーナス実績",app.bonus.winterActual));

    if(isNaN(winterActual)) return;

    app.bonus={

        summerForecast,

        summerActual,

        winterForecast,

        winterActual

    };

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
   ⑦ AI分析
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
            (sum,item)=>sum + item.spent,
            0
        );

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

    const remainGoal =
        Math.max(
            app.goal - progress,
            0
        );

    const monthsLeft =
        Math.max(
            1,
            12 -
            ([4,5,6,7,8,9,10,11,12,1,2,3]
            .indexOf(currentMonth))
        );

    const needPerMonth =
        Math.ceil(remainGoal / monthsLeft);

    let worst =
        app.budgets[0];

    app.budgets.forEach(item=>{

        const rate =
            item.budget === 0
                ? 0
                : item.spent / item.budget;

        const worstRate =
            worst.budget === 0
                ? 0
                : worst.spent / worst.budget;

        if(rate > worstRate){

            worst = item;

        }

    });

    let message = "";

    if(progress >= app.goal){

        message +=
            "🎉 年間目標を達成しています！";

    }else{

        message +=
            `🎯 年間目標まであと ¥${remainGoal.toLocaleString()}<br>`;

        message +=
            `📅 毎月約 ¥${needPerMonth.toLocaleString()} の改善で達成できます。`;

    }

    message += "<br><br>";

    message +=
        `⚠️ 気になるカテゴリ：${worst.name}<br>`;

    message +=
        `現在 ¥${worst.spent.toLocaleString()} / ¥${worst.budget.toLocaleString()}<br><br>`;

    message +=
        "💡 ボーナスは実績がある場合は実績、未入力なら予測を反映しています。";

    advice.innerHTML = message;

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
   ⑨ 年間カテゴリ
=========================== */

function drawYearCategory(){

    const area =
        document.getElementById("yearCategory");

    if(!area) return;

    const totals = {};

    app.budgets.forEach(item=>{

        totals[item.id]={
            name:item.name,
            total:0,
            count:0
        };

    });

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

        (data.budgets || []).forEach(item=>{

            if(!totals[item.id]) return;

            totals[item.id].total += item.spent || 0;

            if((item.spent || 0) > 0){

                totals[item.id].count++;

            }

        });

    }

    area.innerHTML="";

    Object.values(totals).forEach(item=>{

        const average =
            Math.round(item.total / 12);

        area.innerHTML += `

<button
class="setting-item"
onclick="openCategoryDetail('${item.name}')">

<span>${item.name}</span>

<span>

¥${item.total.toLocaleString()}<br>

<small>

月平均 ¥${average.toLocaleString()}

</small>

</span>

</button>

`;

    });

}

function openCategoryDetail(name){

    alert(
`${name}

詳細画面は次のセクションで追加します。`
    );

}
/* ===========================
   ⑩ 年間グラフ
=========================== */

function drawYearChart(){

    const chart =
        document.getElementById("yearChart");

    if(!chart) return;

    chart.innerHTML="";

    const months=[
        4,5,6,7,8,9,
        10,11,12,
        1,2,3
    ];

    const data=[];

    months.forEach(month=>{

        const year=
            month<=3
                ? currentYear+1
                : currentYear;

        const key=
            `maru-kakei-${year}-${String(month).padStart(2,"0")}`;

        const save=
            JSON.parse(
                localStorage.getItem(key) || "{}"
            );

        const income=
            (save.income?.papa || 0)+
            (save.income?.mama || 0)+
            (save.income?.extra || 0);

        const spent=
            (save.budgets || []).reduce(
                (sum,item)=>
                    sum+(item.spent || 0),
                0
            );

        data.push({

            year,

            month,

            remain:income-spent

        });

    });

    const scale=document.createElement("div");

    scale.className="chart-scale";

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

        const div=document.createElement("div");

        div.textContent=text;

        scale.appendChild(div);

    });

    chart.appendChild(scale);

    const bars=document.createElement("div");

    bars.className="year-chart-bars";

    const MAX=200000;

    const AREA=80;

    data.forEach(item=>{

        const month=document.createElement("div");

        month.className="chart-month";

        const bar=document.createElement("div");

        bar.className=
            "chart-bar "+
            (item.remain>=0
                ? "chart-positive"
                : "chart-negative");

        bar.style.height=
            Math.max(
                2,
                Math.min(
                    Math.abs(item.remain),
                    MAX
                )/MAX*AREA
            )+"px";

        const value=document.createElement("div");

        value.className="chart-value";

        value.textContent=
            "¥"+
            item.remain.toLocaleString();

        const label=document.createElement("div");

        label.className="chart-label";

        label.textContent=item.month+"月";

        month.appendChild(value);
        month.appendChild(bar);
        month.appendChild(label);

        month.onclick=()=>{

            changeMonthFromYear(
                item.year,
                item.month
            );

        };

        bars.appendChild(month);

    });

    chart.appendChild(bars);

}

function changeMonthFromYear(year,month){

    save();

    currentYear=year;

    currentMonth=month;

    if(yearSelect){

        yearSelect.value=String(

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
   ⑪ 初期表示
=========================== */

drawYearSummary();

drawYearCategory();

drawYearChart();

showPage(session.page || "home");

update();

console.log("🌸 まる家計 Ver15 起動");
