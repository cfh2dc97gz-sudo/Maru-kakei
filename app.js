/* ===========================
   Ver19
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
},

{
    id:"rent",
    name:"🏠 家賃",
    budget:50000,
    spent:0
},
];

function createDefaultBudgets(){

    return JSON.parse(
        JSON.stringify(DEFAULT_BUDGETS)
    );

}

const app={

    goal:3400000,

    reserveMin:500000,

    reserveFund:{

        balance:0,

        pending:0,

        history:[]

    },

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

    annualCategories:[

        {
            id:"birthday",
            title:"🎂 誕生日",
            budget:150000,
            history:[]
        },

        {
            id:"travel",
            title:"✈️ 旅行",
            budget:400000,
            history:[]
        },

        {
            id:"car",
            title:"🚗 車検",
            budget:120000,
            history:[]
        },

        {
            id:"property",
            title:"🏠 固定資産税",
            budget:70000,
            history:[]
        },

        {
            id:"kindergarten",
            title:"🎒 幼稚園",
            budget:235200,
            history:[]
        },

        {
            id:"medicine",
            title:"💊 ピル",
            budget:24000,
            history:[]
        },

        {
            id:"jokaso",
            title:"🚰 集中浄化槽",
            budget:48000,
            history:[]
        }

    ],

    budgets:createDefaultBudgets(),

    history:[]

};

let currentYear=2026;

let currentMonth=4;
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

    const yearData={

        goal:app.goal,

        startBank:app.startBank,

        reserveMin:app.reserveMin,

        reserveFund:JSON.parse(
            JSON.stringify(app.reserveFund)
        ),

        bonus:{...app.bonus},

        annualCategories:JSON.parse(
            JSON.stringify(app.annualCategories)
        )

    };

    localStorage.setItem(
        getYearKey(),
        JSON.stringify(yearData)
    );

    const monthData={

        bank:{...app.bank},

        income:{...app.income},

        budgets:JSON.parse(
            JSON.stringify(app.budgets)
        ),

        history:[...app.history]

    };

    localStorage.setItem(
        getKey(),
        JSON.stringify(monthData)
    );

    const session=
        JSON.parse(
            localStorage.getItem(getSessionKey())
            || "{}"
        );

    session.year=currentYear;

    session.month=currentMonth;

    session.page=session.page || "home";

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

    app.income={

        papa:0,

        mama:0,

        extra:0

    };

    app.startBank=0;

    app.reserveMin=500000;

    app.reserveFund={

        balance:0,

        pending:0,

        history:[]

    };

    app.bonus={

        summerForecast:0,

        summerActual:0,

        winterForecast:0,

        winterActual:0

    };

    app.budgets=createDefaultBudgets();

    app.history=[];

    const monthSaved=
        localStorage.getItem(getKey());

    if(monthSaved){

        const data=
            JSON.parse(monthSaved);

        app.bank=data.bank || app.bank;

        app.income=data.income || app.income;

        app.budgets=data.budgets || app.budgets;

        app.history=data.history || [];

    }

    const yearSaved=
        localStorage.getItem(getYearKey());

    if(yearSaved){

        const data=
            JSON.parse(yearSaved);

        app.goal=data.goal ?? app.goal;

        app.startBank=data.startBank ?? 0;

        app.reserveMin=data.reserveMin ?? 500000;

        app.reserveFund=data.reserveFund || app.reserveFund;

        app.bonus=data.bonus || app.bonus;

        app.annualCategories=
            data.annualCategories ||
            app.annualCategories;

    }

    app.budgets.forEach(item=>{

        if(item.spent===undefined){

            item.spent=0;

        }

    });

}
/* ===========================
   ③ 初期化・年度セレクト
=========================== */

// ===========================
// 年度・月 初期化
// ===========================

const today = new Date();

const currentFiscalYear =
    today.getMonth() >= 3
        ? today.getFullYear()
        : today.getFullYear() - 1;

const session =
    JSON.parse(
        localStorage.getItem(getSessionKey()) || "{}"
    );

currentYear =
    session.year ?? currentFiscalYear;

currentMonth =
    session.month ?? (today.getMonth() + 1);

// 画面復元
window.lastPage =
    session.page || "home";

// 年度セレクト
const yearSelect =
    document.getElementById("yearSelect");

if (yearSelect) {

    yearSelect.innerHTML = "";

    for (let y = 2024; y <= 2035; y++) {

        const option =
            document.createElement("option");

        option.value = y;
        option.textContent = `${y}年度`;

        yearSelect.appendChild(option);

    }

    yearSelect.value = currentYear;

    yearSelect.onchange = () => {

        save();

        currentYear =
            Number(yearSelect.value);

        currentMonth = 4;

        load();

        update();

        showPage(window.lastPage);

    };

}
/* ===========================
   ④ 月変更・画面更新
=========================== */

function getDisplayYear(month=currentMonth){

    return month<=3
        ?currentYear+1
        :currentYear;

}

function getFiscalYear(){

    return currentYear;

}

function changeMonth(step){

    save();

    currentMonth+=step;

    if(currentMonth>12){

        currentMonth=1;

    }else if(currentMonth<1){

        currentMonth=12;

    }

    load();

    update();

}

document
.getElementById("prevMonth")
.onclick=()=>changeMonth(-1);

document
.getElementById("nextMonth")
.onclick=()=>changeMonth(1);

function update(){

    if(yearSelect){

        yearSelect.value=String(currentYear);

    }

    const period=
        document.getElementById("period");

    if(period){

        period.textContent=
            `${getDisplayYear()}年 ${currentMonth}月`;

    }

    const fiscal=
        document.getElementById("fiscalYear");

    if(fiscal){

        fiscal.textContent=
            `${currentYear}年度`;

    }

    const income=

        app.income.papa+
        app.income.mama+
        app.income.extra;

    const spent=

        app.budgets.reduce(
            (sum,b)=>sum+b.spent,
            0
        );

    const remain=

        income-spent;

    document
        .getElementById("income")
        .textContent=
        "¥"+income.toLocaleString();

    document
        .getElementById("incomeSummary")
        .textContent=
        "¥"+income.toLocaleString();

    document
        .getElementById("spent")
        .textContent=
        "¥"+spent.toLocaleString();

    const remainEl=
        document.getElementById("remain");

    remainEl.textContent=
        "¥"+remain.toLocaleString();

    remainEl.className=
        "summary-money "+
        (remain>=0
            ?"plus"
            :"minus");

    const bankTotal=

        app.bank.mitake+
        app.bank.takizawa;

    const bankEl=
        document.getElementById("bankTotal");

    if(bankEl){

        bankEl.textContent=
            "¥"+bankTotal.toLocaleString();

    }

    const savingEl=
        document.getElementById("savingTotal");

    if(savingEl){

        const saving=

            bankTotal-
            app.startBank;

        savingEl.textContent=

            (saving>=0?"+":"")+
            "¥"+
            saving.toLocaleString();

        savingEl.className=

            "bank-saving "+

            (saving>=0
                ?"plus"
                :"minus");

    }

    drawCategories();

    drawAI();

    drawYearSummary();

    drawYearCategory();

    drawYearChart();

    drawAnnualManage();

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

    const text = prompt("収入金額");

    if(text === null) return;

    const amount = Number(text);

    if(isNaN(amount) || amount <= 0) return;

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
        prompt("金額 メモ");

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
function drawAI(){

    const ai =
        document.getElementById("aiComment");

    if(!ai) return;

    const income =
        Number(app.income.papa || 0) +
        Number(app.income.mama || 0) +
        Number(app.income.extra || 0);

    const spent =
        app.budgets.reduce(
            (sum,item)=>sum + Number(item.spent || 0),
            0
        );

    const bonus =
        Number(app.bonus.summerActual || app.bonus.summerForecast || 0) +
        Number(app.bonus.winterActual || app.bonus.winterForecast || 0);

    const bank =
        Number(app.bank.mitake || 0) +
        Number(app.bank.takizawa || 0);

    const saving =
        bank -
        Number(app.startBank || 0) +
        bonus;

    const goal =
        Number(app.goal || 0);

    const remain =
        Math.max(goal - saving,0);

    const monthsLeft =
        currentMonth <= 3
            ? 4 - currentMonth
            : 16 - currentMonth;

    let html = "";

    html += `
📊 <b>年間目標</b><br>
年間目標まで約¥${remain.toLocaleString()}不足する見込みです。<br>
残り${monthsLeft}か月は毎月約¥${Math.ceil(remain/Math.max(monthsLeft,1)).toLocaleString()}改善すると達成圏内になります。<br><br>
`;
       const overList =
    app.budgets
        .filter(item => item.id !== "rent")
        .map(item=>{

            const yearly =
                item.budget * 12;

            const forecast =
                item.spent * 12;

            return{

                name:item.name,

                over:forecast-yearly

            };

        })
        .filter(item=>item.over>0)
        .sort((a,b)=>b.over-a.over);

    if(overList.length){

        html += "📌 <b>気になるカテゴリ</b><br><br>";

        overList.slice(0,2).forEach(item=>{

            html += `
${item.name} は年間約¥${item.over.toLocaleString()}オーバー見込みです。<br>
毎月約¥${Math.ceil(item.over/12).toLocaleString()}抑えると予算内になります。<br><br>
`;

        });

    }else{

        html += "🎉 すべてのカテゴリが予算内ペースです！";

    }

    ai.innerHTML = html;

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

            let advice =
                "👍 この調子です";

            if(percent>=120){

                advice =
                    "🚨 優先的に見直しましょう";

            }else if(percent>=100){

                advice =
                    "⚠ 今月は支出を抑えましょう";

            }else if(percent>=80){

                advice =
                    "💡 少し節約すると安心です";

            }

            return{

                budget,
                list,
                total,
                yearlyBudget,
                percent,
                diff: yearlyBudget-total,
                advice

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

        let barClass =
            "progress-bar";

        if(item.percent>=100){

            barClass+=" danger";

        }else if(item.percent>=80){

            barClass+=" warning";

        }

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
style="width:${Math.min(item.percent,100)}%">

</div>

</div>

<div
style="
display:flex;
justify-content:space-between;
margin-top:8px;
font-size:12px;">

<span>

達成率 ${item.percent}%

</span>

<span>

${item.advice}

</span>

</div>

</div>

`;

    });

}

function showCategoryHistory(categoryId){

    lastPage="year";

    showPage("category");

    const budget=
        app.budgets.find(
            b=>b.id===categoryId
        );

    if(!budget) return;

    document.getElementById("categoryTitle").textContent=
        budget.name;

    const list=
        app.history
            .filter(
                h=>h.category===budget.name
            )
            .sort(
                (a,b)=>
                    new Date(b.date)-
                    new Date(a.date)
            );

    const total=
        list.reduce(
            (sum,h)=>sum+h.amount,
            0
        );

    const yearlyBudget=
        budget.budget*12;

    const percent=
        yearlyBudget===0
        ?0
        :Math.round(total/yearlyBudget*100);

    document.getElementById("categorySummary").innerHTML=`

年間予算：¥${yearlyBudget.toLocaleString()}<br>
年間支出：¥${total.toLocaleString()}<br>
達成率：${percent}%<br>
件数：${list.length}件

`;

    document.getElementById("editAnnualCategory").style.display="none";
document.getElementById("deleteAnnualCategory").style.display="none";
document.getElementById("addAnnualHistory").style.display="none";

    const history=
        document.getElementById("categoryHistory");

    history.innerHTML="";
       const monthMap={};

    list.forEach(item=>{

        const month=item.date.substring(0,7);

        if(!monthMap[month]){

            monthMap[month]=[];

        }

        monthMap[month].push(item);

    });

    Object.keys(monthMap)
        .sort()
        .reverse()
        .forEach(month=>{

            history.innerHTML+=`

<div class="card">

<h3>${month}</h3>

</div>

`;

            monthMap[month].forEach(item=>{

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

const ANNUAL_BUDGET = 1350000;

function getFiscalMonths() {
    return [4,5,6,7,8,9,10,11,12,1,2,3];
}

function getMonthYear(month){

    return month <= 3
        ? currentYear + 1
        : currentYear;

}

function getMonthlySpent(year,month){

    const saved = localStorage.getItem(
        `maru-kakei-${year}-${String(month).padStart(2,"0")}`
    );

    if(!saved) return 0;

    const data = JSON.parse(saved);

    return (data.budgets || []).reduce(
        (sum,item)=>sum+(item.spent||0),
        0
    );

}

function drawYearChart(){

    const canvas = document.getElementById("yearChart");
    if(!canvas) return;

    const ctx = canvas.getContext("2d");
    if(!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0,0,W,H);

    const months = getFiscalMonths();

    const values = months.map(month=>{

        const year = month <= 3
            ? currentYear + 1
            : currentYear;

        return getMonthlySpent(year,month);

    });

    const max = Math.max(...values,1);

    const left = 18;
    const bottom = 26;
    const graphHeight = H - bottom - 10;
    const barWidth = (W-left*2)/months.length;

    const hitAreas=[];

    values.forEach((value,index)=>{

        const h = value/max*graphHeight;

        const x = left + index*barWidth + 6;
        const y = graphHeight - h + 8;
        const w = barWidth - 12;

        ctx.fillStyle="#F7C948";
        ctx.fillRect(x,y,w,h);

        ctx.fillStyle="#666";
        ctx.font="11px sans-serif";
        ctx.textAlign="center";
        ctx.fillText(
            months[index]+"月",
            x+w/2,
            H-6
        );

        hitAreas.push({
            x,y,w,h,
            month:months[index]
        });

    });

    canvas.onclick=(e)=>{

        const rect=canvas.getBoundingClientRect();

        const scaleX=W/rect.width;
        const scaleY=H/rect.height;

        const x=(e.clientX-rect.left)*scaleX;
        const y=(e.clientY-rect.top)*scaleY;

        const hit=hitAreas.find(bar=>

            x>=bar.x &&
            x<=bar.x+bar.w &&
            y>=bar.y &&
            y<=bar.y+bar.h

        );

        if(!hit) return;

        currentMonth = hit.month;

        update();

        showPage("home");

    };

}
function getOtherReserveBudget(){

    const total = app.annualCategories
        .filter(c=>c.id!=="otherReserve")
        .reduce((sum,c)=>sum+c.budget,0);

    return Math.max(
        ANNUAL_BUDGET-total,
        0
    );

}

function refreshOtherReserve(){

    let other=app.annualCategories.find(
        c=>c.id==="otherReserve"
    );

    if(!other){

        other={

            id:"otherReserve",

            title:"📦 その他積立",

            budget:0,

            history:[]

        };

        app.annualCategories.push(other);

    }

    other.title="📦 その他積立";

    other.budget=getOtherReserveBudget();

}

function addAnnualCategory(){

    const title=prompt("カテゴリ名");

    if(!title) return;

    const budget=Number(prompt("予算"));

    if(isNaN(budget)) return;

    app.annualCategories.push({

        id:Date.now().toString(),

        title,

        budget,

        history:[]

    });

    refreshOtherReserve();

    save();

    drawAnnualManage();

}

function drawAnnualManage(){

    refreshOtherReserve();

    const area=document.getElementById(
        "annualManageList"
    );

    if(!area) return;

    area.innerHTML="";

    const totalUsed=
        app.annualCategories.reduce(

            (sum,c)=>

                sum+

                c.history.reduce(
                    (s,h)=>s+h.amount,
                    0
                ),

            0

        );

    const remain=
        ANNUAL_BUDGET-totalUsed;

    area.innerHTML+=`

<div class="card">

<h3>💰 特別費</h3>

<p>年間予算 ¥${ANNUAL_BUDGET.toLocaleString()}</p>

<p>使用 ¥${totalUsed.toLocaleString()}</p>

<p>残り ¥${remain.toLocaleString()}</p>

</div>

`;

    const list=[

        ...app.annualCategories.filter(
            c=>c.id!=="otherReserve"
        ),

        app.annualCategories.find(
            c=>c.id==="otherReserve"
        )

    ].filter(Boolean);

    list.forEach(category=>{

        const index=
            app.annualCategories.findIndex(
                c=>c.id===category.id
            );

        const used=
            category.history.reduce(
                (sum,h)=>sum+h.amount,
                0
            );

        const remain=
            category.budget-used;

        const percent=
            category.budget===0
            ?0
            :Math.min(
                used/category.budget*100,
                100
            );

        area.innerHTML+=`

<button
class="card"
onclick="openAnnualCategory(${index})">

<h3>${category.title}</h3>

<p>予算 ¥${category.budget.toLocaleString()}</p>

<p>使用 ¥${used.toLocaleString()}</p>

<p>残り ¥${remain.toLocaleString()}</p>

<div class="progress">

<div
class="progress-bar"
style="width:${percent}%">

</div>

</div>

</button>

`;

    });

    area.innerHTML+=`

<button
class="card"
onclick="addAnnualCategory()">

<h3>➕ カテゴリ追加</h3>

<p>新しいカテゴリを追加</p>

</button>

`;

}
function openAnnualCategory(index){

    currentAnnualCategory=index;

    const category=app.annualCategories[index];

    if(!category) return;

    lastPage="annual";

    showPage("category");

    document.getElementById("editAnnualCategory").style.display="block";
    document.getElementById("deleteAnnualCategory").style.display="block";
    document.getElementById("addAnnualHistory").style.display="block";

    document.getElementById("categoryTitle").textContent=
        category.title;

    const used=category.history.reduce(
        (sum,h)=>sum+h.amount,
        0
    );

    const remain=category.budget-used;

    let html=`

予算：¥${category.budget.toLocaleString()}<br>
使用：¥${used.toLocaleString()}<br>
残り：¥${remain.toLocaleString()}

`;

    if(category.id==="otherReserve"){

        html+=`

<br><br>

<small>

📦 この金額は他カテゴリから自動計算されています。

</small>

`;

    }

    document.getElementById("categorySummary").innerHTML=
        html;

    const history=document.getElementById(
        "categoryHistory"
    );

    history.innerHTML="";

    if(category.history.length===0){

        history.innerHTML=

        "<p>まだ履歴はありません😊</p>";

        return;

    }

    category.history.forEach((item,index)=>{

        history.innerHTML+=`

<button
class="setting-item"
onclick="deleteAnnualHistory(${index})">

<span>

<strong>${item.name}</strong><br>

${item.date}

</span>

<span>

¥${item.amount.toLocaleString()}

</span>

</button>

`;

    });

}

function addAnnualHistory(){

    if(currentAnnualCategory<0) return;

    const category=
        app.annualCategories[currentAnnualCategory];

    const name=prompt("名前");

    if(!name) return;

    const amount=
        Number(prompt("金額"));

    if(isNaN(amount)) return;

    const used=
        category.history.reduce(
            (sum,h)=>sum+h.amount,
            0
        );

    if(used+amount>category.budget){

        const over=
            used+amount-category.budget;

        if(!confirm(

`予算を¥${over.toLocaleString()}超えます。

登録しますか？`

        )) return;

    }

    category.history.unshift({

        name,

        amount,

        date:new Date().toLocaleDateString(
            "ja-JP",
            {
                year:"numeric",
                month:"numeric",
                day:"numeric"
            }
        )

    });

    save();

    drawAnnualManage();

    openAnnualCategory(currentAnnualCategory);

}
function editAnnualCategory(){

    if(currentAnnualCategory<0) return;

    const category=
        app.annualCategories[currentAnnualCategory];

    if(category.id==="otherReserve"){

        alert("📦 その他積立は自動計算です。");

        return;

    }

    const title=prompt(
        "カテゴリ名",
        category.title
    );

    if(!title) return;

    const budget=Number(
        prompt(
            "予算",
            category.budget
        )
    );

    if(isNaN(budget)) return;

    category.title=title;
    category.budget=budget;

    refreshOtherReserve();

    save();

    drawAnnualManage();

    openAnnualCategory(currentAnnualCategory);

}

function deleteAnnualCategory(){

    if(currentAnnualCategory<0) return;

    const category=
        app.annualCategories[currentAnnualCategory];

    if(category.id==="otherReserve"){

        alert("📦 その他積立は削除できません。");

        return;

    }

    if(!confirm(
        `「${category.title}」を削除しますか？`
    )) return;

    app.annualCategories.splice(
        currentAnnualCategory,
        1
    );

    currentAnnualCategory=-1;

    refreshOtherReserve();

    save();

    drawAnnualManage();

    showPage("annual");

}

function deleteAnnualHistory(index){

    if(currentAnnualCategory<0) return;

    if(!confirm("履歴を削除しますか？"))
        return;

    app.annualCategories[currentAnnualCategory]
        .history
        .splice(index,1);

    save();

    drawAnnualManage();

    openAnnualCategory(currentAnnualCategory);

}
/* ===========================
   ⑪ 初期表示
=========================== */

function initializeApp(){

    load();

    update();

    showPage(
        session.page || "home"
    );

}
initializeApp();

window.addEventListener(
    "beforeunload",
    save
);

console.log(
    "%c🌸 まる家計 Ver18",
    "color:#4CAF50;font-size:16px;font-weight:bold;"
);

console.log({

    version:"18.0",

    fiscalYear:currentYear,

    month:currentMonth,

    page:
        JSON.parse(
            localStorage.getItem(
                getSessionKey()
            ) || "{}"
        ).page || "home"

});
    
/* ===========================
   設定画面
=========================== */

function drawBudgetList(){

    const area =
        document.getElementById("budgetList");

    if(!area) return;

    area.innerHTML = "";

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

    const value =
        Number(
            prompt(
                "月予算",
                app.budgets[index].budget
            )
        );

    if(isNaN(value)) return;

    app.budgets[index].budget = value;

    update();

}

const editGoalBtn =
    document.getElementById("editGoal");

if(editGoalBtn){

    editGoalBtn.onclick = ()=>{

        const goal =
            Number(
                prompt(
                    "年間目標",
                    app.goal
                )
            );

        if(isNaN(goal)) return;

        app.goal = goal;

        update();

    };

}

const editBonusBtn =
    document.getElementById("editBonus");

if(editBonusBtn){

    editBonusBtn.onclick = ()=>{

        app.bonus.summerForecast =
            Number(prompt("夏予定",app.bonus.summerForecast)) || 0;

        app.bonus.summerActual =
            Number(prompt("夏実績",app.bonus.summerActual)) || 0;

        app.bonus.winterForecast =
            Number(prompt("冬予定",app.bonus.winterForecast)) || 0;

        app.bonus.winterActual =
            Number(prompt("冬実績",app.bonus.winterActual)) || 0;

        update();

    };

}

const annualBtn =
    document.getElementById("annualManage");

if(annualBtn){

    annualBtn.onclick = ()=>{

        showPage("annual");

    };

}

const deleteBtn =
    document.getElementById("deleteAll");

if(deleteBtn){

    deleteBtn.onclick = ()=>{

        if(!confirm("すべて削除しますか？"))
            return;

        localStorage.clear();

        location.reload();

    };

}

/* ===========================
   特別費管理
=========================== */

const addAnnualBtn =
    document.getElementById("addAnnualManage")
    ||
    document.getElementById("addAnnualItem");

if(addAnnualBtn){

    addAnnualBtn.onclick = ()=>{

        const title =
            prompt("項目名");

        if(!title) return;

        const amount =
            Number(
                prompt("金額")
            );

        if(isNaN(amount)) return;

        const date =
            prompt(
                "日付(YYYY-MM-DD)",
                new Date()
                    .toISOString()
                    .slice(0,10)
            );

        if(!date) return;

        app.annualItems.push({

            title,

            amount,

            date

        });

        update();

    };

}
