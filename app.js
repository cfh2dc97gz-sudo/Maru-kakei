/* Ver12｜2026/7/24｜最終調整 */

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
    annualBudget:1350000,
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
incomeHistory:[],

bonus:{

    papaSummerForecast:600000,
    mamaSummerForecast:300000,

    papaWinterForecast:600000,
    mamaWinterForecast:300000,

    papaSummerActual:0,
    mamaSummerActual:0,

    papaWinterActual:0,
    mamaWinterActual:0,

  summerKeep:0,
winterKeep:0

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

    history:[],

    atm:{
        amount:0,
        coop:0,
        food:0,
        gas:0,
        holiday:0,
        date:null
    }

};

let currentYear=2026;

let currentMonth=4;

let incomeFilter = "extra";
/* ===========================
   ② 保存・読込
=========================== */

function getKey(){

    const year = getDisplayYear(
        currentMonth,
        currentYear
    );

    return `maru-kakei-${year}-${String(currentMonth).padStart(2,"0")}`;

}

function getMonthData(year,month){

    const saved = localStorage.getItem(
        `maru-kakei-${year}-${String(month).padStart(2,"0")}`
    );

    if(!saved){

        return null;

    }

    try{

        return JSON.parse(saved);

    }catch(e){

        console.error(
            "月データの読込に失敗しました",
            e
        );

        return null;

    }

}
function getYearKey(){

    return `maru-kakei-year-${currentYear}`;

}

function getSessionKey(){

    return "maru-kakei-session";

}

function save(){

    const yearData = {

        goal: app.goal,
        annualBudget: app.annualBudget,
        startBank: app.startBank,

        reserveMin: app.reserveMin,

        reserveFund: JSON.parse(
            JSON.stringify(app.reserveFund)
        ),
        

        bonus: { ...app.bonus },

        annualCategories: JSON.parse(
            JSON.stringify(app.annualCategories)
        )

    };

    const monthData = {

        bank: { ...app.bank },

        income: { ...app.income },

        budgets: JSON.parse(
            JSON.stringify(app.budgets)
        ),

        history: JSON.parse(
            JSON.stringify(app.history)
        ),

        incomeHistory: JSON.parse(
            JSON.stringify(app.incomeHistory)
        ),

        atm: JSON.parse(
            JSON.stringify(app.atm)
        )

    };

    const sessionData = {

        year: currentYear,

        month: currentMonth,

        page: window.lastPage || "home"

    };

    try{

        localStorage.setItem(
            getYearKey(),
            JSON.stringify(yearData)
        );

        localStorage.setItem(
            getKey(),
            JSON.stringify(monthData)
        );

        localStorage.setItem(
            getSessionKey(),
            JSON.stringify(sessionData)
        );

    }catch(e){

        console.error(
            "データの保存に失敗しました",
            e
        );

        alert("データの保存に失敗しました。");

    }

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

app.bonus = {

    papaSummerForecast:600000,
    mamaSummerForecast:300000,

    papaWinterForecast:600000,
    mamaWinterForecast:300000,

    papaSummerActual:0,
    mamaSummerActual:0,

    papaWinterActual:0,
    mamaWinterActual:0,

    summerKeep:0,
    winterKeep:0

};
    app.budgets=createDefaultBudgets();

     app.history=[];

    app.incomeHistory=[];

    app.atm={
        amount:0,
        coop:0,
        food:0,
        gas:0,
        holiday:0,
        date:null
    };
    
    const monthSaved=
        localStorage.getItem(getKey());

    if(monthSaved){

        const data=
            JSON.parse(monthSaved);

        app.bank=data.bank || app.bank;

        app.income=data.income || app.income;

        app.budgets=data.budgets || app.budgets;

              app.history=data.history || [];

        app.incomeHistory =
            data.incomeHistory || [];

        app.atm =
            data.atm || app.atm;
        
        
    }

    const yearSaved=
        localStorage.getItem(getYearKey());

    if(yearSaved){

        const data=
            JSON.parse(yearSaved);

        app.goal=data.goal ?? app.goal;
        
         app.annualBudget =
        data.annualBudget ?? 1350000;
        
        app.startBank=data.startBank ?? 0;

        app.reserveMin=data.reserveMin ?? 500000;

        app.reserveFund=data.reserveFund || app.reserveFund;

        app.bonus = {

    ...app.bonus,

    ...(data.bonus || {})

};

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

        currentYear = Number(yearSelect.value);

        currentMonth = 4;

        load();

        update();

        showPage(window.lastPage || "home");

    };

}

/* ===========================
   ④ 月変更・画面更新
=========================== */

function getDisplayYear(month = currentMonth, fiscalYear = currentYear){

    return month <= 3
        ? fiscalYear + 1
        : fiscalYear;

}

function getFiscalYear(){

    return currentYear;

}

function changeMonth(step){
    
app.categoryFilter = null;
currentAnnualCategory = -1;
    save();

    if(currentMonth === 4 && step === -1){

        currentMonth = 3;
        currentYear--;

    }else if(currentMonth === 3 && step === 1){

        currentMonth = 4;
        currentYear++;

    }else{

        currentMonth += step;

    }

    if(currentMonth < 1){

        currentMonth = 12;

    }

    if(currentMonth > 12){

        currentMonth = 1;

    }

load();
update();
window.lastPage = "home";
showPage("home");

    }

function goToMonth(month){

    let displayYear = getDisplayYear(currentMonth);

    currentMonth = month;

    currentYear = month <= 3
        ? displayYear - 1
        : displayYear;

    load();

    update();

    showPage("home");

    requestAnimationFrame(()=>{
        window.scrollTo({
            top:0,
            behavior:"smooth"
        });
    });

}
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

    drawYearChart();

    drawAnnualManage();

    drawIncomeHistory();
    
    save();

}
/* ===========================
   ⑤ カテゴリ・収入・支出
=========================== */
function drawCategories(){

    const grid =
        document.getElementById("gridArea");

    if(!grid) return;

    /*
       🏧 ATM
       ATMは「支出」ではなく、
       現金を食費・ガソリン・休日へ
       振り分けるための管理機能。
    */

    grid.innerHTML = `

<button
class="input-card atm-card"
onclick="openATM()">

    <span class="input-name">
        🏧 ATM
    </span>

    <span class="input-left">
        ¥${Number(app.atm.amount || 0).toLocaleString()}
    </span>

</button>

`;

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
function openATM(){

    openNumberModal(
        "🏧 ATM引出額",
        (amount)=>{

            if(amount<=0) return;

            openNumberModal(
                "🛒 生協引落額（食費）",
                (coop)=>{

                    coop =
                        Math.max(
                            0,
                            Number(coop || 0)
                        );

                    /*
                       食費80,000円から
                       生協引落分を先に差し引く
                    */

                    const foodNeed =
                        Math.max(
                            80000 - coop,
                            0
                        );

                    let remaining = amount;

                    /*
                       ① 食費
                    */

                    const food =
                        Math.min(
                            foodNeed,
                            remaining
                        );

                    remaining -= food;

                    /*
                       ② ガソリン
                       最大17,000円
                    */

                    const gas =
                        Math.min(
                            17000,
                            remaining
                        );

                    remaining -= gas;

                    /*
                       ③ 休日
                       残った金額を全部入れる
                    */

                    const holiday =
                        Math.max(
                            remaining,
                            0
                        );

                    app.atm = {

                        amount,

                        coop,

                        food,

                        gas,

                        holiday,

                        date:
                            new Date()
                                .toLocaleDateString(
                                    "ja-JP",
                                    {
                                        year:"numeric",
                                        month:"2-digit",
                                        day:"2-digit"
                                    }
                                )

                    };

                    update();

                }
            );

        }
    );

}
function addIncome(type){

    openNumberModal("収入金額",(amount,memo)=>{

        if(amount<=0) return;

        switch(type){

            case "パパ":

                app.income.papa += amount;
                break;

            case "ママ":

                app.income.mama += amount;
                break;

            case "臨時":

                app.income.extra += amount;

                app.history.unshift({

                    date:new Date().toLocaleDateString(
                        "ja-JP",
                        {
                            year:"numeric",
                            month:"2-digit",
                            day:"2-digit"
                        }
                    ),

                    category:"🎁 臨時収入",

                    amount,

                    memo,

                    income:true,

                    annual:false

                });

                break;

        }

        app.incomeHistory.unshift({

    id: Date.now().toString(),

    date: new Date().toLocaleDateString(
        "ja-JP",
        {
            year:"numeric",
            month:"2-digit",
            day:"2-digit"
        }
    ),

    type,

    amount,

    memo,

    targetMonth:`${getDisplayYear()}-${String(currentMonth).padStart(2,"0")}`

});

        update();

    });

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

    app.atm = {

        amount:0,

        coop:0,

        food:0,

        gas:0,

        holiday:0,

        date:null

    };

    update();

};

function editBank(){

    openNumberModal("みたけ銀行残高",(mitake)=>{

        openNumberModal("滝沢銀行残高",(takizawa)=>{

            app.bank.mitake = mitake;

            app.bank.takizawa = takizawa;

            if(currentMonth===4){

                app.startBank =
                    mitake + takizawa;

            }

            update();

        });

    });

}
function addSpent(index,isOverwrite=false){

    openNumberModal(

        app.budgets[index].name,

        (amount,memo)=>{

            if(amount<=0) return;

            if(isOverwrite){

                app.budgets[index].spent = amount;

            }else{

                app.budgets[index].spent += amount;

            }

            app.history.unshift({

                id: Date.now().toString(),

                date: new Date().toLocaleDateString(
                    "ja-JP",
                    {
                        year:"numeric",
                        month:"2-digit",
                        day:"2-digit"
                    }
                ),

                category: app.budgets[index].name,

                amount,

                memo,

                annual: false,

                targetMonth: `${getDisplayYear()}-${String(currentMonth).padStart(2,"0")}`

            });

            update();

        }

    );

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

const bonusPage =
    document.getElementById("bonusPage");

const incomePage =
    document.getElementById("incomePage");

const pages = [
    homePage,
    yearPage,
    annualPage,
    categoryPage,
    settingPage,
    bonusPage,
    incomePage
];

const navButtons =
    document.querySelectorAll(".bottom-nav button");

let lastPage = "home";

function showPage(page){

    pages.forEach(p=>{

        if(p){

            p.style.display = "none";

        }

    });

    navButtons.forEach(btn=>
        btn.classList.remove("active")
    );

    switch(page){

        case "home":

            homePage.style.display = "block";
            navButtons[0].classList.add("active");

            lastPage = "home";
            break;

        case "year":

            yearPage.style.display = "block";
            navButtons[1].classList.add("active");

            drawYearSummary();
            drawYearChart();

            lastPage = "year";
            break;

        case "annual":

            annualPage.style.display = "block";
            navButtons[2].classList.add("active");

            drawAnnualManage();

            lastPage = "annual";
            break;

    case "setting":

    settingPage.style.display = "block";
    navButtons[3].classList.add("active");

    lastPage = "setting";
    break;

      case "bonus":

    currentAnnualCategory = -1;

    bonusPage.style.display = "block";

    drawBonusPage();

    lastPage = "setting";
    break;

case "category":

    categoryPage.style.display = "block";
    break;
            
case "income":

    incomePage.style.display = "block";

    navButtons[3].classList.add("active");

    drawIncomeHistory();

    lastPage = "setting";

    break;

    }

    if(page !== "category"){

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

    app.categoryFilter = null;
    currentAnnualCategory = -1;

    showPage(window.lastPage || "home");

}

navButtons[0].onclick =
    ()=>showPage("home");

navButtons[1].onclick =
    ()=>showPage("year");

navButtons[2].onclick =
    ()=>showPage("annual");

navButtons[3].onclick =
    ()=>showPage("setting");

const prevMonthBtn =
    document.getElementById("prevMonth");

const nextMonthBtn =
    document.getElementById("nextMonth");

if(prevMonthBtn){

    prevMonthBtn.onclick =
        ()=>changeMonth(-1);

}

if(nextMonthBtn){

    nextMonthBtn.onclick =
        ()=>changeMonth(1);

}
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
if (income === 0) {
    ai.innerHTML = `
    💰 まずは今月の収入を入力しましょう😊<br><br>
    収入を入力すると年間目標や節約アドバイスを表示します。
    `;
    return;
}
    const spent =
        app.budgets.reduce(
            (sum,item)=>sum + Number(item.spent || 0),
            0
        );

    const bank =
    Number(app.bank.mitake || 0) +
    Number(app.bank.takizawa || 0);

const saving =
    bank -
    Number(app.startBank || 0);

const totalSaving =
    saving + getBonusKeepTotal();

const goal =
    Number(app.goal || 0);

const remain =
    Math.max(goal - totalSaving,0);

const monthsLeft =
    Math.max(
        currentMonth <= 3
            ? 4 - currentMonth
            : 16 - currentMonth,
        1
    );

    let html = "";
const monthlyNeed = Math.ceil(remain / monthsLeft);

const candidates = app.budgets
   .filter(item =>
    !["rent","utility"].includes(item.id)
)
    .sort((a, b) => b.budget - a.budget);

const advice = [];

let rest = monthlyNeed;

for (const item of candidates) {

    if (rest <= 0) break;

    const cut = Math.min(
        Math.ceil(rest / 1000) * 1000,
        Math.floor(item.budget * 0.2 / 1000) * 1000
    );

    if (cut >= 1000) {

        advice.push(`${item.name} -¥${cut.toLocaleString()}`);

        rest -= cut;
    }
}
   
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

    html += "🎉 すべてのカテゴリが予算内ペースです！<br><br>";

}

if(advice.length){

    html += "💡 <b>目標までナビ</b><br>";

    advice.forEach(item=>{

        html += `${item}<br>`;

    });

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

    const months = getFiscalMonths();

    months.forEach(month=>{

        const year =
            month <= 3
                ? currentYear + 1
                : currentYear;

        const data =
            getMonthData(year,month);

        if(!data) return;

        income +=
            Number(data.income?.papa || 0) +
            Number(data.income?.mama || 0) +
            Number(data.income?.extra || 0);

        spent +=
            (data.budgets || []).reduce(
                (sum,item)=>
                    sum + Number(item.spent || 0),
                0
            );

    });

    const remain =
        income - spent;

    const saving =
        (
            app.bank.mitake +
            app.bank.takizawa
        ) -
        Number(app.startBank || 0);

const progress =
    saving + getBonusKeepTotal();

 const summerBonus =
    (app.bonus.papaSummerActual || app.bonus.mamaSummerActual)
        ? Number(app.bonus.papaSummerActual || 0) +
          Number(app.bonus.mamaSummerActual || 0)
        : Number(app.bonus.papaSummerForecast || 0) +
          Number(app.bonus.mamaSummerForecast || 0);

const winterBonus =
    (app.bonus.papaWinterActual || app.bonus.mamaWinterActual)
        ? Number(app.bonus.papaWinterActual || 0) +
          Number(app.bonus.mamaWinterActual || 0)
        : Number(app.bonus.papaWinterForecast || 0) +
          Number(app.bonus.mamaWinterForecast || 0);

const bonusTotal =
    summerBonus + winterBonus;

    const totalIncome =
        income + bonusTotal;

    document.getElementById("yearIncome").textContent =
        "¥" + totalIncome.toLocaleString();

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
            Math.max(app.goal,1) *
            100,
            100
        ) + "%";

}

function showCategoryHistory(categoryId){

    lastPage = "year";

    showPage("category");

    drawCategoryDetail(categoryId);

}
function showCategoryList(){

  window.lastPage = "setting";

showPage("category");

    document.getElementById("categoryTitle").innerHTML =
        "📒 カテゴリ履歴";

     const historyList =
    document.getElementById("categoryDetailHistory");

historyList.innerHTML = "";

    app.budgets.forEach(budget=>{

       historyList.innerHTML += `
        
            <button
                class="setting-item"
               onclick="
    window.lastPage='category';
    app.categoryFilter='${budget.name}';
    drawCategoryDetail('${budget.id}');
">

                 ${budget.name}

            </button>
        `;

    });

}

/* ===========================
   ⑩ 年間グラフ
=========================== */

function getFiscalMonths(){

    return [
        4,5,6,7,8,9,
        10,11,12,
        1,2,3
    ];

}

function getFiscalIncomeHistory(){

    const list = [];

    const months = getFiscalMonths();

    months.forEach(month=>{

        const year =
            month <= 3
                ? currentYear + 1
                : currentYear;

        const data = getMonthData(year, month);

        if(!data) return;

        (data.incomeHistory || []).forEach(item=>{

    list.push({

        ...item,

        year,

        month

    });

});

    });

    return list.sort(
        (a,b)=>new Date(b.date)-new Date(a.date)
    );

}
function drawIncomeHistory(){

    const area =
        document.getElementById("incomeHistoryList");

    const papaBtn =
        document.getElementById("incomePapaFilter");

    const mamaBtn =
        document.getElementById("incomeMamaFilter");

    const extraBtn =
    document.getElementById("incomeExtraFilter");
    
    if(!area) return;
   [papaBtn, mamaBtn, extraBtn].forEach(btn=>{
    if(btn){
        btn.style.background = "";
        btn.style.color = "";
        btn.style.fontWeight = "";
    }
});

if(incomeFilter === "papa" && papaBtn){

    papaBtn.style.background = "#F7C948";
    papaBtn.style.fontWeight = "bold";

}else if(incomeFilter === "mama" && mamaBtn){

    mamaBtn.style.background = "#F7C948";
    mamaBtn.style.fontWeight = "bold";

}else if(incomeFilter === "extra" && extraBtn){

    extraBtn.style.background = "#F7C948";
    extraBtn.style.fontWeight = "bold";

}

const allList = getFiscalIncomeHistory();

let list = [...allList];

   if(incomeFilter === "papa"){

    list = list.filter(item=>
        item.type.includes("パパ")
    );

}else if(incomeFilter === "mama"){

    list = list.filter(item=>
        item.type.includes("ママ")
    );

}else if(incomeFilter === "extra"){

    list = list.filter(item=>
        item.type === "臨時"
    );

}
    
    if(list.length === 0){

        area.innerHTML = `
            <div class="card">
                <div style="text-align:center;padding:20px;color:#888;">
                    まだ収入履歴はありません😊
                </div>
            </div>
        `;

        return;

    }

   const total = allList.reduce((sum,item)=>{
    return sum + Number(item.amount || 0);
},0);

    area.innerHTML = `
        <div class="card" style="margin-bottom:15px;">
            <div style="font-size:14px;color:#888;">
                年間収入合計
            </div>
            <div style="font-size:28px;font-weight:bold;color:#f5a623;">
                ¥${total.toLocaleString()}
            </div>
        </div>
    `;

 const monthMap = {};

list.forEach(item=>{

const month = Number(
    (item.targetMonth || item.date.substring(0,7))
        .split("-")[1]
);

    if(!monthMap[month]){
        monthMap[month] = [];
    }

    monthMap[month].push(item);

});

Object.keys(monthMap)
.sort((a,b)=>b-a)
.forEach(month=>{

    area.innerHTML += `
        <div class="card">
            <h3>${month}月</h3>
        </div>
    `;

    monthMap[month].forEach(item=>{

        area.innerHTML += `
            <button
                class="setting-item"
               onclick="deleteIncomeHistory('${item.id}')"

             <span>
    <b>${item.type}</b><br>
    ${item.date}<br>
    <small>${item.memo || ""}</small>
</span>

                <span style="font-weight:bold;">
                    ¥${Number(item.amount).toLocaleString()}
                </span>

            </button>
        `;

    });

});
}


function changeCategoryFilter(name){

    app.categoryFilter = name;

    drawCategoryDetail();

    save();

}
function drawCategoryDetail(categoryId){

if(categoryId){

    const budget = app.budgets.find(item => item.id === categoryId);

    if(budget){
        app.categoryFilter = budget.name;
    }else{

        const annual = app.annualCategories?.find(item => item.id === categoryId);

        if(annual){
            app.categoryFilter = annual.title;
        }

    }

}

  const budget =
    app.budgets.find(item => item.name === app.categoryFilter)
    ||
    app.annualCategories?.find(item => item.title === app.categoryFilter);

    const history = getFiscalMonths().flatMap(month => {

        const year =
            month <= 3
                ? currentYear + 1
                : currentYear;

        const data = getMonthData(year, month);

        if (!data) return [];

        return (data.history || []).filter(item => {

    if(item.income) return false;

    if(item.category !== app.categoryFilter) return false;

    return true;

});
    });

    const total = history.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const yearlyBudget =
    budget?.budget
        ? Number(budget.budget) * 12
        : Number(budget?.amount || 0);

    const percent =
        yearlyBudget
            ? Math.min(100, Math.round(total / yearlyBudget * 100))
            : 0;

    document.getElementById("categoryTitle").innerHTML = `
<div style="display:flex;justify-content:space-between;align-items:center;">

   <span
    onclick="showCategoryList()"
    style="cursor:pointer;">
    ${app.categoryFilter}
</span>

<button
    onclick="${
    budget?.name
        ? `editCategoryBudget('${app.categoryFilter}')`
        : `editAnnualCategory()`
}"

        style="
            border:none;
            background:none;
            font-size:20px;
            cursor:pointer;
        ">
        ✏️
    </button>

</div>

<div class="progress" style="margin-top:15px;">
    <div style="
        width:${percent}%;
        height:100%;
        background:#f6c64f;
        border-radius:10px;
    "></div>
</div>

<div style="margin-top:15px;font-size:18px;font-weight:bold;">
    ${percent}%
</div>

<p>年間予算：¥${yearlyBudget.toLocaleString()}</p>

<p>年間実績：¥${total.toLocaleString()}</p>

<p>年間残り：¥${(yearlyBudget - total).toLocaleString()}</p>
`;

    const historyList =
        document.getElementById("categoryDetailHistory");

    history
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const monthMap = {};

history.forEach(item => {

const month = Number(
    (item.targetMonth || item.date.substring(0,7))
        .split("-")[1]
);

    if(!monthMap[month]){
        monthMap[month] = [];
    }

    monthMap[month].push(item);

});

historyList.innerHTML = "";
const fiscalOrder = [4,5,6,7,8,9,10,11,12,1,2,3];

Object.keys(monthMap)
.sort((a,b)=>
    fiscalOrder.indexOf(Number(b)) -
    fiscalOrder.indexOf(Number(a))
)
.forEach(month=>{

    historyList.innerHTML += `
<div class="card">
<h3>${month}月</h3>
</div>
`;

    monthMap[month].forEach(item=>{

        historyList.innerHTML += `

<button
class="setting-item"
onclick="deleteCategoryHistory('${item.id}')">

    <span>
        ${item.date}<br>
        <small>${item.memo || ""}</small>
    </span>

    <span style="font-weight:bold;">
        ¥${Number(item.amount).toLocaleString()}
    </span>

</button>
`;

    });

});

if(history.length===0){
   historyList.innerHTML = `
<div class="card">
    <p style="text-align:center;color:#888;">
        履歴はありません😊
    </p>
</div>
`;

}
window.scrollTo({
    top:0,
    behavior:"smooth"
});

}

function deleteCategoryHistory(historyId){

    if(!confirm("履歴を削除しますか？")) return;

    getFiscalMonths().forEach(month=>{

        const year =
            month <= 3
                ? currentYear + 1
                : currentYear;

        const data = getMonthData(year,month);

        if(!data) return;

        const target = (data.history || []).find(item =>
            item.id === historyId
        );

        if(!target) return;

        data.history = (data.history || []).filter(item =>
            item.id !== historyId
        );

        const budget = (data.budgets || []).find(b =>
            b.name === target.category
        );

        if(budget){

            budget.spent = Math.max(
                0,
                Number(budget.spent || 0) - Number(target.amount || 0)
            );

        }

        localStorage.setItem(
            `maru-kakei-${year}-${String(month).padStart(2,"0")}`,
            JSON.stringify(data)
        );

    });

    load();
    update();
    drawCategoryDetail();

}

function deleteIncomeHistory(id){

    if(!confirm("この収入履歴を削除しますか？"))
        return;

    const list = getFiscalIncomeHistory();

    const target = list.find(item => item.id === id);

    if(!target) return;

    const data = getMonthData(target.year, target.month);

    if(!data) return;

data.incomeHistory =
    (data.incomeHistory || []).filter(item =>
        item.id !== id
    );

    // 収入合計も減らす
    data.income = data.income || {
        papa:0,
        mama:0,
        extra:0
    };

    switch(target.type){

        case "パパ":
        case "パパ賞与":
            data.income.papa = Math.max(
                0,
                Number(data.income.papa || 0) - Number(target.amount || 0)
            );
            break;

        case "ママ":
        case "ママ賞与":
            data.income.mama = Math.max(
                0,
                Number(data.income.mama || 0) - Number(target.amount || 0)
            );
            break;

        case "臨時":
            data.income.extra = Math.max(
                0,
                Number(data.income.extra || 0) - Number(target.amount || 0)
            );
            break;

    }

    localStorage.setItem(

        `maru-kakei-${target.year}-${String(target.month).padStart(2,"0")}`,

        JSON.stringify(data)

    );

    // 今表示中の月なら読み直す
    if(
        target.year === getDisplayYear(currentMonth) &&
        target.month === currentMonth
    ){
        load();
    }

    update();

}

function getMonthlySpent(year,month){

const data =
    getMonthData(year,month);

if(!data){

    return 0;

}

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

        const year =
            month <= 3
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
            x,
            y:0,
            w,
            h:H,
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

if(hit.month <= 3){
    currentYear = getDisplayYear(currentMonth) - 1;
}

load();
update();
showPage("home");

requestAnimationFrame(()=>{
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
});

    };

}
function getOtherReserveBudget(){

    const total = app.annualCategories
        .filter(c=>c.id!=="otherReserve")
        .reduce((sum,c)=>sum+c.budget,0);

    return Math.max(
       app.annualBudget-total,
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

    openNumberModal("カテゴリ予算",(budget,title)=>{

        if(budget<=0) return;

        if(!title){

            alert("カテゴリ名を入力してください😊");

            return;

        }

        app.annualCategories.push({

            id:Date.now().toString(),

            title,

            budget,

            history:[]

        });

        refreshOtherReserve();

        save();

        drawAnnualManage();

    });

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
        app.annualBudget -totalUsed;

    area.innerHTML+=`

<div class="card">

<h3>💰 特別費</h3>

<p>年間予算 ¥${app.annualBudget.toLocaleString()}</p>

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

    currentAnnualCategory = index;

    const category = app.annualCategories[index];

    if(!category) return;

    lastPage = "annual";

    showPage("category");

document.getElementById("categoryTitle").innerHTML = `
<div style="
display:flex;
justify-content:space-between;
align-items:center;">

    <span>${category.title}</span>

    <div style="display:flex;gap:12px;">

        <button
            onclick="editAnnualCategory()"
            style="border:none;background:none;font-size:20px;">
            ✏️
        </button>

        <button
            onclick="deleteAnnualCategory()"
            style="border:none;background:none;font-size:20px;">
            🗑
        </button>

        <button
            onclick="addAnnualHistory()"
            style="border:none;background:none;font-size:20px;">
            ➕
        </button>

    </div>

</div>
`;

    const historyList =
        document.getElementById("categoryDetailHistory");

    historyList.innerHTML = "";

    const used = category.history.reduce(
        (sum,h)=>sum+h.amount,
        0
    );

    const remain = category.budget - used;

    historyList.innerHTML += `
        <div class="card">
            <p>予算：¥${category.budget.toLocaleString()}</p>
            <p>使用：¥${used.toLocaleString()}</p>
            <p>残り：¥${remain.toLocaleString()}</p>
        </div>
    `;

    if(category.id==="otherReserve"){
        historyList.innerHTML += `
            <div class="card">
                <small>📦 この金額は他カテゴリから自動計算されています。</small>
            </div>
        `;
    }

    if(category.history.length===0){

        historyList.innerHTML += `
            <p style="text-align:center;color:#888;">
                まだ履歴はありません😊
            </p>
        `;

        return;
    }

 const grouped = {};

category.history.forEach((item, index) => {

    const month = Number(item.date.substring(5,7));

    if(!grouped[month]){
        grouped[month] = [];
    }

    grouped[month].push({
        ...item,
        index
    });

});

Object.keys(grouped)
.sort((a,b)=>b-a)
.forEach(month=>{

    historyList.innerHTML += `
        <h3 style="margin:20px 0 10px;">
            ${month}月
        </h3>
    `;

    grouped[month].forEach(item=>{

        historyList.innerHTML += `
            <button
                class="setting-item"
                onclick="deleteAnnualHistory(${item.index})">

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

});
    
}
function addAnnualHistory(){

    if(currentAnnualCategory<0) return;

    const category=
        app.annualCategories[currentAnnualCategory];

openNumberModal("特別費",(amount,name)=>{

    if(amount<=0) return;

    if(!name){

        alert("名前を入力してください😊");

        return;

    }

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

    const historyItem = {

    name,

    amount,

    date:new Date().toLocaleDateString(
        "ja-JP",
        {
            year:"numeric",
            month:"2-digit",
            day:"2-digit"
        }
    )

};

category.history.unshift(historyItem);

app.history.push({

    date: historyItem.date,

    category: category.title,

    amount: amount,

    memo: name,

    annual: true

});

save();

drawAnnualManage();

openAnnualCategory(currentAnnualCategory);

});

}
   
function editAnnualCategory(){

    if(currentAnnualCategory<0) return;

    const category =
        app.annualCategories[currentAnnualCategory];

    if(category.id==="otherReserve"){

        alert("📦 その他積立は自動計算です。");

        return;

    }

    openNumberModal("カテゴリ予算",(budget,title)=>{

        if(budget<=0) return;

        if(!title){

            alert("カテゴリ名を入力してください😊");

            return;

        }

        category.title = title;

        category.budget = budget;

        refreshOtherReserve();

        save();

        drawAnnualManage();

        openAnnualCategory(currentAnnualCategory);

    });

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


function drawBonusPage(){

    const summer =
        document.getElementById("summerBonus");

    const winter =
        document.getElementById("winterBonus");

    const message =
        document.getElementById("bonusMessage");

    if(!summer || !winter || !message) return;

    summer.style.display = "none";
    winter.style.display = "none";
    message.style.display = "none";

    if(currentMonth === 6){

        summer.style.display = "block";

    }else if(currentMonth === 11){

        winter.style.display = "block";

    }else{

        message.style.display = "block";

    }

 const summerTotal =
    Number(app.bonus.papaSummerActual || 0) +
    Number(app.bonus.mamaSummerActual || 0);

const winterTotal =
    Number(app.bonus.papaWinterActual || 0) +
    Number(app.bonus.mamaWinterActual || 0);

document.getElementById("summerBonusAmount").textContent =
    "¥" + summerTotal.toLocaleString();

document.getElementById("winterBonusAmount").textContent =
    "¥" + winterTotal.toLocaleString();
    document.getElementById("summerKeepAmount").textContent =
        "¥" + Number(app.bonus.summerKeep || 0).toLocaleString();

    document.getElementById("winterKeepAmount").textContent =
        "¥" + Number(app.bonus.winterKeep || 0).toLocaleString();

}
function getBonusKeepTotal(){

    let total = 0;

    const summerActual =
        Number(app.bonus.papaSummerActual || 0) +
        Number(app.bonus.mamaSummerActual || 0);

    const winterActual =
        Number(app.bonus.papaWinterActual || 0) +
        Number(app.bonus.mamaWinterActual || 0);

    const summerForecast =
        Number(app.bonus.papaSummerForecast || 0) +
        Number(app.bonus.mamaSummerForecast || 0);

    const winterForecast =
        Number(app.bonus.papaWinterForecast || 0) +
        Number(app.bonus.mamaWinterForecast || 0);

    total += summerActual > 0
        ? Number(app.bonus.summerKeep || 0)
        : summerForecast;

    total += winterActual > 0
        ? Number(app.bonus.winterKeep || 0)
        : winterForecast;

    return total;

}

const editGoalBtn =
    document.getElementById("editGoal");

if(editGoalBtn){

    editGoalBtn.onclick = ()=>{

        openNumberModal("年間目標",(goal)=>{

    if(goal<=0) return;

    app.goal = goal;

    update();

});
       
    };

}
const editAnnualBudgetBtn =
    document.getElementById("editAnnualBudget");

if(editAnnualBudgetBtn){

    editAnnualBudgetBtn.onclick = ()=>{

        openNumberModal("特別費予算",(value)=>{

            if(value<=0) return;

            app.annualBudget = value;

            refreshOtherReserve();

            update();

        });

    };

}

const editBonusBtn =
    document.getElementById("editBonus");

if(editBonusBtn){

    editBonusBtn.onclick = ()=>{

        showPage("bonus");

    };

}
const summerBtn =
    document.getElementById("editSummerBonus");

if(summerBtn){

summerBtn.onclick = ()=>{

    openNumberModal("👨 パパ夏賞与",(papa)=>{

        app.bonus.papaSummerActual = papa;

        openNumberModal("👩 ママ夏賞与",(mama)=>{

            app.bonus.mamaSummerActual = mama;

            openNumberModal("積立額",(keep)=>{

                app.bonus.summerKeep = keep;
app.incomeHistory.unshift({

    date: new Date().toLocaleDateString(
        "ja-JP",
        {
            year:"numeric",
            month:"2-digit",
            day:"2-digit"
        }
    ),

    type:"パパ夏賞与",

    amount: app.bonus.papaSummerActual

});

app.incomeHistory.unshift({

    date: new Date().toLocaleDateString(
        "ja-JP",
        {
            year:"numeric",
            month:"2-digit",
            day:"2-digit"
        }
    ),

    type:"ママ夏賞与",

    amount: app.bonus.mamaSummerActual

});
                update();

                drawBonusPage();

            });

        });

    });

};
}

const winterBtn =
    document.getElementById("editWinterBonus");

if(winterBtn){

    winterBtn.onclick = ()=>{

    openNumberModal("👨 パパ冬賞与",(papa)=>{

        app.bonus.papaWinterActual = papa;

        openNumberModal("👩 ママ冬賞与",(mama)=>{

            app.bonus.mamaWinterActual = mama;

            openNumberModal("積立額",(keep)=>{

                app.bonus.winterKeep = keep;
app.incomeHistory.unshift({

    date: new Date().toLocaleDateString(
        "ja-JP",
        {
            year:"numeric",
            month:"2-digit",
            day:"2-digit"
        }
    ),

    type:"パパ冬賞与",

    amount: app.bonus.papaWinterActual

});

app.incomeHistory.unshift({

    date: new Date().toLocaleDateString(
        "ja-JP",
        {
            year:"numeric",
            month:"2-digit",
            day:"2-digit"
        }
    ),

    type:"ママ冬賞与",

    amount: app.bonus.mamaWinterActual

});
                update();

                drawBonusPage();

            });

        });

    });

}

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
   数字入力モーダル
=========================== */

let numberValue = "";

let numberCallback = null;
let numberMemo = "";

function updateNumberDisplay(){

    const display =
        document.getElementById("numberDisplay");

    if(!display) return;

    display.textContent =
        "¥" +
        (numberValue || "0")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}

function openNumberModal(title,callback){

    numberValue = "";

    document.getElementById("numberMemo").value = "";

    document.activeElement?.blur();

    numberCallback = callback;

    document.getElementById("numberTitle").textContent =
        title;

    setTimeout(() => {
        document.getElementById("numberModal").style.display =
            "flex";

        updateNumberDisplay();
    }, 100);

}

function closeNumberModal(){

    document.getElementById("numberModal").style.display =
        "none";

}

function numberKey(num){

    // 10桁まで入力可能
    if(numberValue.length >= 10){
        return;
    }

    if(numberValue === "" || numberValue === "0"){

        numberValue = String(num);

    }else{

        numberValue += String(num);

    }

    updateNumberDisplay();

    // iPhoneの高速連打対策
    if(navigator.vibrate){
        navigator.vibrate(5);
    }

}
function numberClear(){

    numberValue = "";

    updateNumberDisplay();

}

document.getElementById("numberOk").onclick = ()=>{

    const value =
    Number(numberValue || 0);

const memo =
    document.getElementById("numberMemo").value.trim();

closeNumberModal();

if(numberCallback){

    numberCallback(value,memo);

}
};
let lastTouchEnd = 0;

document.addEventListener("touchend", function(e){

    const now = Date.now();

    // ダブルタップによる画面ズームだけ防ぐ
    if(
        now - lastTouchEnd <= 300 &&
        e.target === document.documentElement
    ){
        e.preventDefault();
    }

    lastTouchEnd = now;

}, { passive:false });

window.onerror = function(message, source, line, column, error){
    alert(
        message +
        "\n行：" + line +
        "\n列：" + column
    );
};
function numberBack(){

    numberValue = numberValue.slice(0,-1);

    updateNumberDisplay();

}
// ===========================
// バックアップ保存
// ===========================

function exportBackup(){

    const backup = {};

    for(let i = 0; i < localStorage.length; i++){

        const key = localStorage.key(i);

        if(key.startsWith("maru-kakei")){

            backup[key] = JSON.parse(localStorage.getItem(key));

        }

    }

    const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type:"application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    const today = new Date();

    const fileName =
        `maru-kakei-backup-${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}.json`;

    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);

}

document
    .getElementById("backupExport")
    .onclick = exportBackup;

// ===========================
// バックアップ読込
// ===========================

function importBackup(file){

    const reader = new FileReader();

    reader.onload = e => {

        try{

            const backup = JSON.parse(e.target.result);

            if(!confirm("現在のデータをバックアップで上書きしますか？")){
                return;
            }

            Object.keys(backup).forEach(key=>{

                localStorage.setItem(
                    key,
                    JSON.stringify(backup[key])
                );

            });

            alert("バックアップを復元しました😊");

            location.reload();

        }catch{

            alert("バックアップファイルを読み込めませんでした。");

        }

    };

    reader.readAsText(file);

}
document
    .getElementById("backupImport")
    .onclick = ()=>{

    document
        .getElementById("backupFile")
        .click();

};

document
    .getElementById("backupFile")
    .addEventListener("change",(e)=>{

        if(e.target.files.length){

            importBackup(e.target.files[0]);

        }

        e.target.value = "";

    });
