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

let incomeFilter = "all";
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
function getAtmPlan(){

    const foodBudget =
        Number(app.budgets.find(item=>item.id==="food")?.budget || 80000);

    const gasBudget =
        Number(app.budgets.find(item=>item.id==="gas")?.budget || 17000);

    const coop =
        Number(app.atm.coop || 0);

    const foodCashBudget =
        Math.max(foodBudget - coop, 0);

    const withdrawn =
        Number(app.atm.withdrawn || 0);

    const gasCashBudget =
        Math.min(gasBudget, Math.max(withdrawn - foodCashBudget, 0));

    const holidayBudget =
        Math.max(
            withdrawn - foodCashBudget - gasCashBudget,
            0
        );

    const cashBalance =
        Math.max(
            withdrawn - Number(app.atm.cashSpent || 0),
            0
        );

    return {
        foodBudget,
        gasBudget,
        coop,
        foodCashBudget,
        gasCashBudget,
        holidayBudget,
        cashBalance
    };

}

function getTodayCategoryTotal(categoryId){

    const today = getTodayString();

    return (app.history || [])
        .filter(item =>
            item.category ===
            app.budgets.find(b=>b.id===categoryId)?.name
            && item.date === today
            && !item.annual
            && !item.income
        )
        .reduce(
            (sum,item)=>sum + Number(item.amount || 0),
            0
        );

}

function getDistinctHolidaySpendDays(){

    const holidayName =
        app.budgets.find(
            item=>item.id==="holiday"
        )?.name;

    return new Set(
        (app.history || [])
            .filter(item =>
                item.category === holidayName &&
                !item.annual &&
                !item.income
            )
            .map(item=>item.date)
    ).size;

}

function getRemainingHolidayCount(){

    const total =
        Number(app.atm.holidayCount || 0);

    if(total<=0) return 0;

    return Math.max(
        total - getDistinctHolidaySpendDays(),
        0
    );

}

function getHolidayCoach(){

    const plan = getAtmPlan();

    const totalCount =
        Number(app.atm.holidayCount || 0);

    if(totalCount<=0){
        return {
            hasPlan:false,
            budget:plan.holidayBudget,
            remaining:plan.holidayBudget,
            remainingCount:0,
            daily:0,
            today:0,
            todayOver:0
        };
    }

    const today =
        getTodayCategoryTotal("holiday");

    const remaining =
        Math.max(
            plan.holidayBudget -
            Number(
                app.budgets.find(
                    item=>item.id==="holiday"
                )?.spent || 0
            ),
            0
        );

    const remainingCount =
        getRemainingHolidayCount();

    const daily =
        remainingCount > 0
            ? Math.floor(
                remaining / remainingCount
            )
            : 0;

    const firstDaily =
        Math.floor(
            plan.holidayBudget / totalCount
        );

    return {
        hasPlan:true,
        budget:plan.holidayBudget,
        remaining,
        remainingCount,
        daily,
        today,
        todayOver:Math.max(today-firstDaily,0)
    };

}

function getAnnualCoachData(){

    const months = getFiscalMonths();

    const currentIndex =
        Math.max(
            months.indexOf(currentMonth),
            0
        );

    /*
       現在月までの銀行予測を「今ここにあるお金」として扱う。
       ここから先だけを未来予測するので、
       今月分を二重計上しない。
    */

    /*
       銀行残高を入力済みなら、年間コーチも
       実際に入力した銀行残高を使う。
       未入力のときだけ、これまで通り予測残高を使う。
    */
    const currentBank =
        app.bankConfirmed
            ? Number(app.bank.mitake || 0) +
              Number(app.bank.takizawa || 0)
            : getBankForecast();

    const startBank =
        Number(app.startBank || 0);

    const currentSaving =
        currentBank - startBank;

    /*
       年度内に記録されている月から
       「自然に残る金額」の平均を出す。

       ボーナスは別管理なので、
       ここでは通常収入・通常支出だけを見る。
    */

    /*
       「自然に貯まりそうな額」は、
       今は過去データの単純平均から出さない。

       この年度は実際の銀行残高の増加が小さく、
       過去データと現在の入力ルールも違うため、
       まずは「月収約42万円 − 生活費約35万円」
       という現実的な基準、月70,000円を使う。

       今後データが十分に蓄積したら、
       実績ベースへ切り替える。
    */

    const NATURAL_MONTHLY_BASELINE = 70000;

    const naturalMonthly =
        NATURAL_MONTHLY_BASELINE;

    /*
       残り月数。
       現在月はすでに currentBank に反映済みなので、
       「未来の月」だけを加える。
    */

    const futureMonths =
        Math.max(
            months.length -
            currentIndex -
            1,
            0
        );

    const naturalFuture =
        naturalMonthly *
        futureMonths;

    /*
       ボーナスは「実際に積み立てる金額」だけを
       年間目標に加える。
       まだ実績がないものは予測値を使う。
    */

    const bonusFuture =
        getBonusKeepTotal();

    /*
       現在の自然な貯金
       ＋ 今後の自然な貯金
       ＋ ボーナス
       ＝ 今のままの年間予測
    */

    const noBonusForecast =
        currentSaving +
        naturalFuture;

    const withBonusForecast =
        noBonusForecast +
        bonusFuture;

    const goal =
        Number(app.goal || 0);

    const noBonusGap =
        Math.max(
            goal - noBonusForecast,
            0
        );

    const noBonusSurplus =
        Math.max(
            noBonusForecast - goal,
            0
        );

    const withBonusGap =
        Math.max(
            goal - withBonusForecast,
            0
        );

    const withBonusSurplus =
        Math.max(
            withBonusForecast - goal,
            0
        );

    // 既存の計算部分との互換性を保つため、従来名は「ボーナス込み」を指す。
    const noChangeForecast = withBonusForecast;
    const gap = withBonusGap;
    const surplus = withBonusSurplus;

    const monthlyExtra =
        futureMonths > 0
            ? Math.ceil(
                gap /
                futureMonths
            )
            : gap;

    let status = "green";
    let statusText =
        "🟢 このままなら達成できそう";

    if(gap>0){

        /*
           自然な月間貯金額に対して
           必要な追加額がどれくらい重いかで判定。
        */

        if(
            naturalMonthly > 0 &&
            monthlyExtra <=
                naturalMonthly * 0.3
        ){

            status = "yellow";
            statusText =
                "🟡 少し頑張れば達成できそう";

        }else{

            status = "red";
            statusText =
                "🔴 今のペースではかなり厳しい";

        }

    }

    return {

        currentBank,
        startBank,
        currentSaving,

        naturalMonthly,
        futureMonths,
        naturalFuture,

        bonusFuture,

        noChangeForecast,
        noBonusForecast,
        withBonusForecast,

        goal,
        gap,
        surplus,
        noBonusGap,
        noBonusSurplus,
        withBonusGap,
        withBonusSurplus,

        monthlyExtra,

        status,
        statusText

    };

}

function getAnnualCutPlan(extraNeed){

    if(extraNeed<=0){
        return [];
    }

    const food =
        app.budgets.find(
            item=>item.id==="food"
        );

    const holiday =
        app.budgets.find(
            item=>item.id==="holiday"
        );

    /*
       「残り予算」ではなく、
       現実に減らせる余地を見て
       食費・休日へ分ける。

       ガソリンは今の段階では
       節約計画に強く入れない。
    */

    const candidates = [

        {
            id:"food",
            name:"🍚 食費",
            max:
                Math.floor(
                    Number(food?.budget || 0)
                    * 0.15 /
                    1000
                ) * 1000
        },

        {
            id:"holiday",
            name:"🎉 休日",
            max:
                Math.floor(
                    Number(holiday?.budget || 0)
                    * 0.15 /
                    1000
                ) * 1000
        }

    ];

    let rest =
        Math.max(
            extraNeed,
            0
        );

    const result = [];

    /*
       まず食費と休日を半分ずつに近づける。
       片方だけに無理をさせない。
    */

    const firstTarget =
        Math.ceil(
            rest / 2 / 1000
        ) * 1000;

    candidates.forEach(candidate=>{

        if(rest<=0) return;

        const cut =
            Math.min(
                firstTarget,
                candidate.max,
                Math.ceil(rest/1000)*1000
            );

        if(cut>0){

            result.push({
                name:candidate.name,
                amount:cut
            });

            rest -= cut;

        }

    });

    /*
       まだ足りなければ残った余地から補う。
    */

    candidates.forEach(candidate=>{

        if(rest<=0) return;

        const already =
            result.find(
                item=>item.name===candidate.name
            )?.amount || 0;

        const available =
            Math.max(
                candidate.max - already,
                0
            );

        const cut =
            Math.min(
                available,
                Math.ceil(rest/1000)*1000
            );

        if(cut>0){

            const existing =
                result.find(
                    item=>item.name===candidate.name
                );

            if(existing){

                existing.amount += cut;

            }else{

                result.push({
                    name:candidate.name,
                    amount:cut
                });

            }

            rest -= cut;

        }

    });

    return result;

}

function getMonthlyCoachProgress(){

    const plan = getMonthlyCoachPlan();

    const result = {
        target: plan.target,
        achieved: 0,
        remaining: plan.target,
        categories:[]
    };

    /*
       年間コーチの「○円減らす」は、
       通常予算からその金額を減らした
       「今月の目標使用額」として扱う。

       例：
       食費 80,000円
       節約目標 12,000円
       → 今月は68,000円以内

       現在1,000円使っているなら、
       → 目標まであと67,000円使える

       「まだ使っていない＝節約達成」
       とは扱わないのがポイント。
    */

    ["food","holiday"].forEach(id=>{

        const target =
            Number(plan.categories[id] || 0);

        if(target <= 0) return;

        const budget =
            Number(
                app.budgets.find(
                    item=>item.id===id
                )?.budget || 0
            );

        const spent =
            Number(
                app.budgets.find(
                    item=>item.id===id
                )?.spent || 0
            );

        const targetSpend =
            Math.max(
                budget - target,
                0
            );

        const remainingToTarget =
            Math.max(
                targetSpend - spent,
                0
            );

        /*
           目標使用額を超えた場合は、
           その超過額を「追加で抑える必要がある額」とする。
        */

        const overTarget =
            Math.max(
                spent - targetSpend,
                0
            );

        result.categories.push({
            id,
            target,
            budget,
            spent,
            targetSpend,
            remainingToTarget,
            overTarget
        });

    });

    /*
       「今月あと減らす額」ではなく、
       現在の目標使用額との差を
       チャレンジの進捗として扱う。

       目標使用額以内なら、
       まだその金額まで使える状態。
       月末に使わなかった分が
       最終的な節約額になる。
    */

    result.remaining =
        result.categories.reduce(
            (sum,item)=>sum + item.remainingToTarget,
            0
        );

    result.achieved =
        result.categories.reduce(
            (sum,item)=>{
                return sum +
                    Math.max(
                        item.targetSpend -
                        item.spent,
                        0
                    );
            },
            0
        );

    return result;
}

function getGoalContinuationForecast(annual, monthlyCoach){

    const monthlyImprovement =
        Number(monthlyCoach.target || 0);

    const continuedImprovement =
        monthlyImprovement *
        Number(annual.futureMonths || 0);

    const continuedForecast =
        Number(annual.noChangeForecast || 0) +
        continuedImprovement;

    const remainingGap =
        Math.max(
            Number(annual.goal || 0) -
            continuedForecast,
            0
        );

    const remainingSurplus =
        Math.max(
            continuedForecast -
            Number(annual.goal || 0),
            0
        );

    return {
        monthlyImprovement,
        continuedImprovement,
        continuedForecast,
        remainingGap,
        remainingSurplus
    };
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

    /*
       収入0円でも
       「あと使える金額」は表示する。
       AIを収入入力待ちで止めない。
    */

    const plan =
        getAtmPlan();

    const food =
        app.budgets.find(
            item=>item.id==="food"
        );

    const holiday =
        app.budgets.find(
            item=>item.id==="holiday"
        );

    const gas =
        app.budgets.find(
            item=>item.id==="gas"
        );

    const foodRemaining =
        Math.max(
            Number(food?.budget || 0) -
            Number(food?.spent || 0),
            0
        );

    const gasRemaining =
        Math.max(
            Number(gas?.budget || 0) -
            Number(gas?.spent || 0),
            0
        );

    const holidayCoach =
        getHolidayCoach();

    let html = `

<div style="
    margin-bottom:18px;
">

    <div style="
        font-size:15px;
        font-weight:800;
        margin-bottom:10px;
    ">
        👛 今月あと使える金額
    </div>

    <div style="
        display:grid;
        gap:8px;
    ">

        <div style="
            padding:11px 12px;
            border-radius:12px;
            background:#fff8dc;
            display:flex;
            justify-content:space-between;
            align-items:center;
        ">
            <span>🍚 食費</span>
            <strong>
                ¥${foodRemaining.toLocaleString()}
            </strong>
        </div>

        <div style="
            padding:11px 12px;
            border-radius:12px;
            background:#fff8dc;
            display:flex;
            justify-content:space-between;
            align-items:center;
        ">
            <span>🎉 休日</span>
            <strong>
                ¥${holidayCoach.remaining.toLocaleString()}
            </strong>
        </div>

        <div style="
            padding:11px 12px;
            border-radius:12px;
            background:#fff8dc;
            display:flex;
            justify-content:space-between;
            align-items:center;
        ">
            <span>⛽ ガソリン</span>
            <strong>
                ¥${gasRemaining.toLocaleString()}
            </strong>
        </div>

    </div>

`;

    if(holidayCoach.hasPlan){

        html += `
<div style="
    margin-top:9px;
    font-size:13px;
    opacity:.78;
">
🎉 休日：残り${holidayCoach.remainingCount}回
`;

        if(holidayCoach.remainingCount>0){

            html +=
                `｜1回あたり約¥${holidayCoach.daily.toLocaleString()}`;

        }

        html += `</div>`;

    }

    /*
       今日の休日コーチ
    */

    if(holidayCoach.hasPlan){

        html += `
<div style="
    margin-top:18px;
    padding-top:16px;
    border-top:1px solid rgba(0,0,0,.08);
">
    <div style="
        font-size:15px;
        font-weight:800;
        margin-bottom:7px;
    ">
        🎉 今日の休日コーチ
    </div>
`;

        if(holidayCoach.today>0){

            if(
                holidayCoach.todayOver>0 &&
                holidayCoach.remainingCount>0
            ){

                html += `
今日は¥${holidayCoach.today.toLocaleString()}使いました。<br>
😊 今日の目安より約¥${holidayCoach.todayOver.toLocaleString()}多めです。<br>
残り${holidayCoach.remainingCount}回は、
1回約¥${holidayCoach.daily.toLocaleString()}で過ごすと予算内です。
`;

            }else{

                html += `
今日は¥${holidayCoach.today.toLocaleString()}使いました。<br>
😊 今のところいいペースです。
`;

                if(holidayCoach.remainingCount>0){

                    html += `
残り${holidayCoach.remainingCount}回は、
1回約¥${holidayCoach.daily.toLocaleString()}が目安です。
`;

                }

            }

        }else{

            const firstDaily =
                Math.floor(
                    holidayCoach.budget /
                    Math.max(
                        Number(app.atm.holidayCount || 1),
                        1
                    )
                );

            html += `
今日の休日費はまだ入力されていません。<br>
今日の目安は約¥${firstDaily.toLocaleString()}です。
`;

        }

        html += `</div>`;

    }

    /*
       年間コーチ → 今月の節約チャレンジ
    */

    const monthlyCoach =
        getMonthlyCoachProgress();

    if(monthlyCoach.target > 0){

        html += `
<div style="
    margin-top:18px;
    padding-top:16px;
    border-top:1px solid rgba(0,0,0,.08);
">

    <div style="
        font-size:15px;
        font-weight:800;
        margin-bottom:8px;
    ">
        🎯 今月の節約チャレンジ
    </div>

    <div style="
        font-size:13px;
        line-height:1.7;
    ">
        年間目標から逆算して、
        今月は
        <strong>¥${monthlyCoach.target.toLocaleString()}減らす</strong>
        ことを目標にします。
    </div>
`;

        monthlyCoach.categories.forEach(item=>{

            const label =
                item.id==="food"
                    ? "🍚 食費"
                    : "🎉 休日";

            html += `
<div style="
    margin-top:9px;
    padding:10px 12px;
    border-radius:12px;
    background:#fff8dc;
    font-size:13px;
    line-height:1.6;
">
    ${label}
    <strong>¥${item.target.toLocaleString()}減</strong>
    <br>
    <span style="opacity:.78;">
        目標使用額：¥${item.targetSpend.toLocaleString()}以内
    </span>
    <br>
    <span style="opacity:.78;">
        今は¥${item.spent.toLocaleString()}使用
        ｜あと¥${item.remainingToTarget.toLocaleString()}使えます
    </span>
`;

        if(item.overTarget > 0){

            html += `
<br>
<span style="font-weight:700;">
⚠️ 年間目標のための今月の目安より
¥${item.overTarget.toLocaleString()}多く使っています。
</span>
`;

            if(item.id==="holiday"){

                const holidayCoach =
                    getHolidayCoach();

                if(
                    holidayCoach.remainingCount > 0
                ){

                    /*
                       節約チャレンジの超過分を、
                       残りの休日で均等に調整する。
                    */

                    const adjustment =
                        Math.ceil(
                            item.overTarget /
                            holidayCoach.remainingCount /
                            100
                        ) * 100;

                    html += `
<br>
<span style="opacity:.82;">
残り${holidayCoach.remainingCount}回で
1回あたり約¥${adjustment.toLocaleString()}
ずつ抑えると、今月の目標に近づけます。
</span>
`;

                }

            }else if(item.id==="food"){

                html += `
<br>
<span style="opacity:.82;">
ここからの食費を少しずつ抑えて、
今月の目標使用額以内に戻せるか見ていきましょう。
</span>
`;

            }

        }else{

            html += `
<br>
<span style="opacity:.78;">
😊 今のところ、年間目標から決めた今月の使用額以内です。
</span>
`;

        }

        html += `</div>
`;

        });

        const allOnTrack =
            monthlyCoach.categories.length > 0 &&
            monthlyCoach.categories.every(
                item=>item.overTarget <= 0
            );

        if(allOnTrack){

            html += `
<div style="
    margin-top:10px;
    font-size:13px;
    opacity:.78;
">
今のところ目標使用額以内のペースです👌
月末までこの範囲に収めれば、節約チャレンジ達成です。
</div>
`;

        }else{

            html += `
<div style="
    margin-top:10px;
    font-size:13px;
    opacity:.78;
">
支出を入力するたびに、目標使用額との差を更新します。
</div>
`;

        }

        html += `</div>`;

    }

    /*
       年間コーチ
    */

    const annual =
        getAnnualCoachData();

    const goalForecast =
        getGoalContinuationForecast(
            annual,
            monthlyCoach
        );

    html += `
<div style="
    margin-top:18px;
    padding-top:16px;
    border-top:1px solid rgba(0,0,0,.08);
">

    <div style="
        font-size:15px;
        font-weight:800;
        margin-bottom:9px;
    ">
        🏆 年間コーチ
    </div>

    <div style="
        font-weight:800;
        margin-bottom:8px;
    ">
        ${annual.statusText}
    </div>

    <div style="
        font-size:13px;
        line-height:1.75;
    ">
        🎯 年間目標
        ¥${annual.goal.toLocaleString()}<br>

        💰 今の貯金ペース
        ¥${annual.currentSaving.toLocaleString()}<br>

        🌱 自然に貯まりそうな額の基準
        月約¥${annual.naturalMonthly.toLocaleString()}
        × ${annual.futureMonths}か月
        ＝ ¥${annual.naturalFuture.toLocaleString()}<br>
        <span style="opacity:.72;">
            ※現在は「月収約42万円 − 生活費約35万円」を基準に計算
        </span><br>

        🎁 ボーナス見込み
        ¥${annual.bonusFuture.toLocaleString()}
    </div>

    <div style="
        margin-top:12px;
        padding:11px 12px;
        border-radius:12px;
        background:#f8f8f8;
        line-height:1.7;
        font-size:13px;
    ">
        🔮 <strong>年度末予測【ボーナスなし】</strong><br>
        <strong>¥${annual.noBonusForecast.toLocaleString()}</strong>
        <br>
        <span style="opacity:.78;">
            目標との差：
            ${
                annual.noBonusGap > 0
                    ? "あと¥" + annual.noBonusGap.toLocaleString()
                    : "＋¥" + annual.noBonusSurplus.toLocaleString()
            }
        </span>
    </div>

    <div style="
        margin-top:10px;
        padding:11px 12px;
        border-radius:12px;
        background:#fff8dc;
        line-height:1.7;
        font-size:13px;
    ">
        🎁 <strong>年度末予測【ボーナス込み】</strong><br>
        <strong>¥${annual.withBonusForecast.toLocaleString()}</strong>
        <br>
        <span style="opacity:.78;">
            目標との差：
            ${
                annual.withBonusGap > 0
                    ? "あと¥" + annual.withBonusGap.toLocaleString()
                    : "＋¥" + annual.withBonusSurplus.toLocaleString()
            }
        </span>
    </div>

    <div style="
        margin-top:10px;
        padding:11px 12px;
        border-radius:12px;
        background:#fff8dc;
        line-height:1.7;
        font-size:13px;
    ">
        🚀 <strong>今月の節約チャレンジを残りの月も続けたら</strong><br>
        年間でさらに
        ¥${goalForecast.continuedImprovement.toLocaleString()}
        改善できる見込みです。<br>

        🔮 ボーナス込みの年度末予測：
        <strong>¥${goalForecast.continuedForecast.toLocaleString()}</strong>
        <br>
`;

    if(goalForecast.remainingGap > 0){

        html += `
        ⚠️ それでも目標まで
        あと¥${goalForecast.remainingGap.toLocaleString()}
        足りない予測です。
        `;

    }else{

        html += `
        🎉 このペースを続ければ、
        目標より
        ¥${goalForecast.remainingSurplus.toLocaleString()}
        上回る予測です！
        `;

    }

    html += `
    </div>
`;

    if(annual.gap > 0){

        html += `
<div style="
    margin-top:10px;
    line-height:1.7;
    font-size:13px;
">
年間目標まで
<strong>あと約¥${annual.gap.toLocaleString()}</strong>です。
`;

        if(annual.futureMonths > 0){

            html += `
<br>
残り${annual.futureMonths}か月なので、
追加で月約
<strong>¥${annual.monthlyExtra.toLocaleString()}</strong>
の改善が必要です。
`;

        }

        html += `</div>`;

        const cuts =
            getAnnualCutPlan(
                annual.monthlyExtra
            );

        if(cuts.length){

            html += `
<div style="
    margin-top:10px;
    padding:10px 12px;
    border-radius:12px;
    background:#fff8dc;
    line-height:1.7;
">
💡 今月の調整案
<br>
`;

            cuts.forEach((item,index)=>{

                html +=
                    `${item.name}を
                    ¥${item.amount.toLocaleString()}減らす`;

                if(index < cuts.length - 1){
                    html += "<br>";
                }

            });

            html += `
<br>
合計約¥${cuts.reduce(
    (sum,item)=>sum+item.amount,
    0
).toLocaleString()}の改善です。
</div>
`;

        }else{

            html += `
<div style="
    margin-top:10px;
    line-height:1.7;
">
⚠️ 今の生活費だけで埋めるにはかなり厳しい金額です。
無理な節約を前提にせず、目標やボーナスの見込みも確認しましょう。
</div>
`;

        }

    }else{

        html += `
<div style="
    margin-top:10px;
    font-weight:700;
">
🎉 今の予測では年間目標を達成できるペースです！
</div>
`;

    }

    html += `</div>`;

    ai.innerHTML = html;

}
/* ===========================
   ⑧ 年間サマリー
=========================== */

function drawYearSummary(){

    const title =
        document.getElementById("yearTitle");

    if(title){
        title.textContent = `${currentYear}年度`;
    }

    // 「年間合計」は実際に入力された収入・支出だけ。
    // 収入は収入履歴を正本として集計し、賞与の重複も除外する。
    const incomeHistory = getFiscalIncomeHistory();

    const income = incomeHistory.reduce(
        (sum,item)=>sum + Number(item.amount || 0),
        0
    );

    let spent = 0;

    getFiscalMonths().forEach(month=>{

        const year =
            month <= 3
                ? currentYear + 1
                : currentYear;

        const data = getMonthData(year,month);

        if(!data) return;

        spent +=
            (data.budgets || []).reduce(
                (sum,item)=>
                    sum + Number(item.spent || 0),
                0
            );

    });

    const remain = income - spent;

    const saving =
        (
            Number(app.bank.mitake || 0) +
            Number(app.bank.takizawa || 0)
        ) -
        Number(app.startBank || 0);

    const progress =
        saving + getBonusKeepTotal();

    const incomeEl = document.getElementById("yearIncome");
    const spentEl = document.getElementById("yearSpent");
    const remainEl = document.getElementById("yearRemain");

    if(incomeEl){
        incomeEl.textContent = "¥" + income.toLocaleString();
    }

    if(spentEl){
        spentEl.textContent = "¥" + spent.toLocaleString();
    }

    if(remainEl){
        remainEl.textContent = "¥" + remain.toLocaleString();
        remainEl.className =
            "summary-money " +
            (remain >= 0 ? "plus" : "minus");
    }

    const goalEl = document.getElementById("yearGoal");
    const goalBar = document.getElementById("goalBar");

    if(goalEl){
        goalEl.textContent =
            `¥${progress.toLocaleString()} / ¥${app.goal.toLocaleString()}`;
    }

    if(goalBar){
        goalBar.style.width =
            Math.min(
                progress / Math.max(app.goal,1) * 100,
                100
            ) + "%";
    }

    // 年間目標の内訳をタップで確認できるようにする。
    if(goalEl){
        goalEl.style.cursor = "pointer";
        goalEl.title = "タップすると年間目標の内訳を表示";
        goalEl.onclick = (event)=>{
            event.stopPropagation();
            showAnnualGoalDetail();
        };
    }

    if(goalBar){
        goalBar.style.cursor = "pointer";
        goalBar.title = "タップすると年間目標の内訳を表示";
        goalBar.onclick = (event)=>{
            event.stopPropagation();
            showAnnualGoalDetail();
        };
    }

    const goalCard =
        goalEl?.closest(".card");

    if(goalCard){
        goalCard.style.cursor = "pointer";
        goalCard.onclick = (event)=>{
            // 編集ボタン等が将来カード内に追加されても邪魔しない。
            if(event.target.closest && event.target.closest("button")) return;
            showAnnualGoalDetail();
        };
    }

}


/* ===========================
   年間目標の内訳
   ※現在の年間目標の計算値をそのまま表示する。
   ※年度末予測はここでは行わない。
=========================== */
function showAnnualGoalDetail(){

    const old = document.getElementById("annualGoalDetailOverlay");
    if(old){
        old.remove();
    }

    const bankTotal =
        Number(app.bank.mitake || 0) +
        Number(app.bank.takizawa || 0);

    const currentSaving =
        bankTotal - Number(app.startBank || 0);

    const summerActualTotal =
        Number(app.bonus.papaSummerActual || 0) +
        Number(app.bonus.mamaSummerActual || 0);

    const winterActualTotal =
        Number(app.bonus.papaWinterActual || 0) +
        Number(app.bonus.mamaWinterActual || 0);

    const summerHasActual = summerActualTotal > 0;
    const winterHasActual = winterActualTotal > 0;

    // 年間目標が実際に使っている金額と同じルールで表示する。
    const papaSummer = summerHasActual
        ? Number(app.bonus.papaSummerActual || 0)
        : Number(app.bonus.papaSummerForecast || 0);

    const mamaSummer = summerHasActual
        ? Number(app.bonus.mamaSummerActual || 0)
        : Number(app.bonus.mamaSummerForecast || 0);

    const papaWinter = winterHasActual
        ? Number(app.bonus.papaWinterActual || 0)
        : Number(app.bonus.papaWinterForecast || 0);

    const mamaWinter = winterHasActual
        ? Number(app.bonus.mamaWinterActual || 0)
        : Number(app.bonus.mamaWinterForecast || 0);

    const summerContribution = summerHasActual
        ? Number(app.bonus.summerKeep || 0)
        : Number(app.bonus.papaSummerForecast || 0) +
          Number(app.bonus.mamaSummerForecast || 0);

    const winterContribution = winterHasActual
        ? Number(app.bonus.winterKeep || 0)
        : Number(app.bonus.papaWinterForecast || 0) +
          Number(app.bonus.mamaWinterForecast || 0);

    const bonusContribution =
        summerContribution + winterContribution;

    const progress =
        currentSaving + bonusContribution;

    const overlay = document.createElement("div");
    overlay.id = "annualGoalDetailOverlay";
    overlay.style.cssText = `
        position:fixed;
        inset:0;
        z-index:99999;
        background:rgba(255,255,255,.97);
        overflow-y:auto;
        padding:18px 16px 100px;
        box-sizing:border-box;
        font-family:inherit;
    `;

    const cardStyle = `
        background:#fff;
        border:1px solid #f0d98a;
        border-radius:20px;
        padding:18px;
        margin-bottom:14px;
        box-shadow:0 2px 10px rgba(0,0,0,.04);
    `;

    const rowStyle = `
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        padding:12px 0;
        border-bottom:1px solid #eee;
        font-size:17px;
    `;

    const yen = value =>
        "¥" + Number(value || 0).toLocaleString();

    overlay.innerHTML = `
        <div style="max-width:720px;margin:0 auto;">
            <button id="closeAnnualGoalDetail" style="
                border:1px solid #f0d98a;
                background:#fff;
                border-radius:999px;
                padding:10px 18px;
                font-size:16px;
                font-weight:700;
                color:#6f554b;
                margin-bottom:14px;
            ">← 年間サマリーへ</button>

            <div style="${cardStyle}">
                <div style="font-size:22px;font-weight:800;color:#6f554b;">
                    🎯 年間目標の内訳
                </div>
                <div style="text-align:center;margin-top:14px;font-size:31px;font-weight:900;color:#2e7d32;">
                    ${yen(progress)}
                </div>
                <div style="text-align:center;color:#777;margin-top:4px;">
                    目標 ${yen(app.goal)}
                </div>
            </div>

            <div style="${cardStyle}">
                <div style="font-size:20px;font-weight:800;margin-bottom:6px;">
                    🏦 現在の貯金
                </div>
                <div style="${rowStyle}border-bottom:0;">
                    <span>銀行残高から増えた貯金</span>
                    <strong>${yen(currentSaving)}</strong>
                </div>
            </div>

            <div style="${cardStyle}">
                <div style="font-size:20px;font-weight:800;margin-bottom:4px;">
                    ☀️ 夏ボーナス
                </div>
                <div style="${rowStyle}">
                    <span>👨 パパ夏賞与</span>
                    <strong>${yen(papaSummer)}</strong>
                </div>
                <div style="${rowStyle}">
                    <span>👩 ママ夏賞与</span>
                    <strong>${yen(mamaSummer)}</strong>
                </div>
                <div style="${rowStyle}border-bottom:0;">
                    <span>🎯 年間目標への反映額</span>
                    <strong>${yen(summerContribution)}</strong>
                </div>
            </div>

            <div style="${cardStyle}">
                <div style="font-size:20px;font-weight:800;margin-bottom:4px;">
                    ❄️ 冬ボーナス
                </div>
                <div style="${rowStyle}">
                    <span>👨 パパ冬賞与</span>
                    <strong>${yen(papaWinter)}</strong>
                </div>
                <div style="${rowStyle}">
                    <span>👩 ママ冬賞与</span>
                    <strong>${yen(mamaWinter)}</strong>
                </div>
                <div style="${rowStyle}border-bottom:0;">
                    <span>🎯 年間目標への反映額</span>
                    <strong>${yen(winterContribution)}</strong>
                </div>
            </div>

            <div style="${cardStyle};background:#fff8dc;">
                <div style="font-size:20px;font-weight:800;">
                    🎯 年間目標の達成額
                </div>
                <div style="font-size:30px;font-weight:900;margin-top:8px;color:#2e7d32;">
                    ${yen(currentSaving)} ＋ ${yen(bonusContribution)}
                </div>
                <div style="font-size:14px;color:#666;margin-top:8px;line-height:1.7;">
                    現在の貯金 ${yen(currentSaving)} と、年間目標に反映されているボーナス分 ${yen(bonusContribution)} の合計です。
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("closeAnnualGoalDetail")?.addEventListener("click",()=>{
        overlay.remove();
    });
}

function showCategoryHistory(categoryId){

    lastPage = "year";

    showPage("category");

    drawCategoryDetail(categoryId);

}
function getFiscalExpenseHistory(){

    const list = [];

    getFiscalMonths().forEach(month=>{

        const year =
            month <= 3
                ? currentYear + 1
                : currentYear;

        const data = getMonthData(year, month);

        if(!data) return;

        (data.history || []).forEach(item=>{

            // 年間特別費は「カテゴリ履歴」の全カテゴリー合計には含めない。
            if(item.income) return;
            if(item.annual === true) return;

            list.push({
                ...item,
                year,
                month
            });

        });

    });

    return list;
}

function showCategoryList(){

    window.lastPage = "setting";
    showPage("category");

    document.getElementById("categoryTitle").innerHTML =
        "📒 カテゴリ履歴";

    const historyList =
        document.getElementById("categoryDetailHistory");

    const allExpenses = getFiscalExpenseHistory();

    const total = allExpenses.reduce(
        (sum,item)=>sum + Number(item.amount || 0),
        0
    );

    historyList.innerHTML = `
        <div class="card" style="margin-bottom:15px;">
            <div style="font-size:14px;color:#888;">
                全カテゴリー合計
            </div>
            <div style="font-size:28px;font-weight:bold;color:#f5a623;">
                ¥${total.toLocaleString()}
            </div>
        </div>
    `;

    app.budgets.forEach(budget=>{

        const categoryTotal = allExpenses
            .filter(item => item.category === budget.name)
            .reduce(
                (sum,item)=>sum + Number(item.amount || 0),
                0
            );

        historyList.innerHTML += `
            <button
                class="setting-item"
                style="display:flex;justify-content:space-between;align-items:center;gap:12px;"
                onclick="
                    window.lastPage='category';
                    app.categoryFilter='${budget.name}';
                    drawCategoryDetail('${budget.id}');
                ">
                <span>${budget.name}</span>
                <strong style="font-size:18px;white-space:nowrap;">
                    ¥${categoryTotal.toLocaleString()}
                </strong>
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

function normalizeIncomeHistoryItem(item, year, month, index){

    const rawDate = item?.date || "";
    const targetMonth = item?.targetMonth || `${year}-${String(month).padStart(2,"0")}`;

    let monthNumber = Number(String(targetMonth).split("-")[1]);

    if(!Number.isFinite(monthNumber)){
        const m = String(rawDate).match(/(?:^|\D)(\d{1,2})(?:\D\d{1,2})?$/);
        monthNumber = m ? Number(m[1]) : month;
    }

    const isBonus = /賞与/.test(String(item?.type || ""));

    const stableKey =
        `${year}-${String(month).padStart(2,"0")}|` +
        `${item?.type || ""}|` +
        `${Number(item?.amount || 0)}|` +
        `${rawDate}`;

    return {
        ...item,
        id: item?.id || `income-${stableKey}-${index}`,
        year,
        month: monthNumber,
        targetMonth,
        isBonus
    };

}

function getFiscalIncomeHistory(){

    const list = [];

    getFiscalMonths().forEach(month=>{

        const year =
            month <= 3
                ? currentYear + 1
                : currentYear;

        const data = getMonthData(year, month);

        if(!data) return;

        (data.incomeHistory || []).forEach((item,index)=>{

            list.push(
                normalizeIncomeHistoryItem(item, year, month, index)
            );

        });

    });

    // 賞与は管理画面が正しい数字の基準。
    // 履歴側に同じ賞与が複数保存されていても、表示は1件にする。
    const seenBonus = new Set();
    const normalized = [];

    list.forEach(item=>{

        if(item.isBonus){

            const key =
                `${item.year}-${String(item.month).padStart(2,"0")}|` +
                `${item.type}|${Number(item.amount || 0)}`;

            if(seenBonus.has(key)) return;
            seenBonus.add(key);

        }

        normalized.push(item);

    });

    return normalized.sort(
        (a,b)=>new Date(b.date)-new Date(a.date)
    );

}

function drawIncomeHistory(){

    const area =
        document.getElementById("incomeHistoryList");

    const allBtn =
        document.getElementById("incomeAllFilter");
    const papaBtn =
        document.getElementById("incomePapaFilter");
    const mamaBtn =
        document.getElementById("incomeMamaFilter");
    const extraBtn =
        document.getElementById("incomeExtraFilter");

    if(!area) return;

    [allBtn, papaBtn, mamaBtn, extraBtn].forEach(btn=>{
        if(btn){
            btn.style.background = "";
            btn.style.color = "";
            btn.style.fontWeight = "";
        }
    });

    const activeBtn =
        incomeFilter === "all" ? allBtn :
        incomeFilter === "papa" ? papaBtn :
        incomeFilter === "mama" ? mamaBtn :
        extraBtn;

    if(activeBtn){
        activeBtn.style.background = "#F7C948";
        activeBtn.style.fontWeight = "bold";
    }

    const allList = getFiscalIncomeHistory();
    let list = [...allList];

    if(incomeFilter === "papa"){
        list = list.filter(item=>item.type.includes("パパ"));
    }else if(incomeFilter === "mama"){
        list = list.filter(item=>item.type.includes("ママ"));
    }else if(incomeFilter === "extra"){
        list = list.filter(item=>item.type === "臨時");
    }

    const papaTotal = allList
        .filter(item=>item.type.includes("パパ"))
        .reduce((sum,item)=>sum + Number(item.amount || 0),0);

    const mamaTotal = allList
        .filter(item=>item.type.includes("ママ"))
        .reduce((sum,item)=>sum + Number(item.amount || 0),0);

    const extraTotal = allList
        .filter(item=>item.type === "臨時")
        .reduce((sum,item)=>sum + Number(item.amount || 0),0);

    const total = papaTotal + mamaTotal + extraTotal;

    area.innerHTML = `
        <div class="card" style="margin-bottom:15px;">
            <div style="font-size:14px;color:#888;margin-bottom:8px;">
                年間収入合計
            </div>

            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                <div style="padding:10px;background:#FFF9EF;border-radius:10px;">
                    <div style="font-size:13px;color:#8A7768;">👨 パパ</div>
                    <div style="font-size:20px;font-weight:bold;">¥${papaTotal.toLocaleString()}</div>
                </div>
                <div style="padding:10px;background:#FFF9EF;border-radius:10px;">
                    <div style="font-size:13px;color:#8A7768;">👩 ママ</div>
                    <div style="font-size:20px;font-weight:bold;">¥${mamaTotal.toLocaleString()}</div>
                </div>
                <div style="padding:10px;background:#FFF9EF;border-radius:10px;">
                    <div style="font-size:13px;color:#8A7768;">🎁 臨時</div>
                    <div style="font-size:20px;font-weight:bold;">¥${extraTotal.toLocaleString()}</div>
                </div>
                <div style="padding:10px;background:#FFF9EF;border-radius:10px;">
                    <div style="font-size:13px;color:#8A7768;">💰 合計</div>
                    <div style="font-size:20px;font-weight:bold;color:#F5A623;">¥${total.toLocaleString()}</div>
                </div>
            </div>
        </div>
    `;

    if(list.length === 0){

        area.innerHTML += `
            <div class="card">
                <div style="text-align:center;padding:20px;color:#888;">
                    まだ収入履歴はありません😊
                </div>
            </div>
        `;

        return;
    }

    const monthMap = {};

    list.forEach(item=>{

        const month = Number(item.month || 0);
        if(!Number.isFinite(month) || month < 1 || month > 12) return;

        if(!monthMap[month]){
            monthMap[month] = [];
        }

        monthMap[month].push(item);

    });

    Object.keys(monthMap)
    .sort((a,b)=>{
        const order = [4,5,6,7,8,9,10,11,12,1,2,3];
        return order.indexOf(Number(b)) - order.indexOf(Number(a));
    })
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
                    onclick="deleteIncomeHistory('${item.id}')">
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

let month = Number(
    (item.targetMonth || "").split("-")[1]
);

if(!Number.isFinite(month)){
    const match = String(item.date || "").match(/(?:^|\D)(\d{1,2})(?:\D\d{1,2})?$/);
    month = match ? Number(match[1]) : null;
}

if(!Number.isFinite(month) || month < 1 || month > 12) return;

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

    // 賞与は「ボーナス管理」が正本。
    // 履歴だけを削除し、ボーナス管理の金額は変更しない。
    getFiscalMonths().forEach(month=>{

        const year =
            month <= 3
                ? currentYear + 1
                : currentYear;

        const data = getMonthData(year, month);

        if(!data) return;

        const original = data.incomeHistory || [];

        if(target.isBonus){

            data.incomeHistory = original.filter(item => {

                const sameType =
                    String(item.type || "") === String(target.type || "");

                const sameAmount =
                    Number(item.amount || 0) === Number(target.amount || 0);

                const sameMonth =
                    String(item.targetMonth || "") === String(target.targetMonth || "")
                    || month === target.month;

                return !(sameType && sameAmount && sameMonth);

            });

        }else{

            data.incomeHistory = original.filter(item => {

                if(item.id && item.id === id) return false;

                return true;

            });

            if(year === target.year && month === target.month){

                data.income = data.income || {
                    papa:0,
                    mama:0,
                    extra:0
                };

                switch(target.type){

                    case "パパ":
                        data.income.papa = Math.max(
                            0,
                            Number(data.income.papa || 0) - Number(target.amount || 0)
                        );
                        break;

                    case "ママ":
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

            }

        }

        localStorage.setItem(
            `maru-kakei-${year}-${String(month).padStart(2,"0")}`,
            JSON.stringify(data)
        );

    });

    load();
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
function upsertBonusHistory(type, amount){

    const targetMonth =
        `${getDisplayYear()}-${String(currentMonth).padStart(2,"0")}`;

    const data = getMonthData(
        getDisplayYear(),
        currentMonth
    );

    if(data){

        data.incomeHistory =
            (data.incomeHistory || []).filter(item =>
                !(String(item.type || "") === type &&
                  String(item.targetMonth || "") === targetMonth)
            );

        data.incomeHistory.unshift({
            id: `bonus-${type}-${targetMonth}`,
            date: new Date().toLocaleDateString(
                "ja-JP",
                {
                    year:"numeric",
                    month:"2-digit",
                    day:"2-digit"
                }
            ),
            type,
            amount:Number(amount || 0),
            targetMonth
        });

        app.incomeHistory = data.incomeHistory;

    }else{

        app.incomeHistory =
            (app.incomeHistory || []).filter(item =>
                !(String(item.type || "") === type &&
                  String(item.targetMonth || "") === targetMonth)
            );

        app.incomeHistory.unshift({
            id:`bonus-${type}-${targetMonth}`,
            date:new Date().toLocaleDateString(
                "ja-JP",
                {
                    year:"numeric",
                    month:"2-digit",
                    day:"2-digit"
                }
            ),
            type,
            amount:Number(amount || 0),
            targetMonth
        });

    }

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
upsertBonusHistory("パパ夏賞与", app.bonus.papaSummerActual);

upsertBonusHistory("ママ夏賞与", app.bonus.mamaSummerActual);
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
upsertBonusHistory("パパ冬賞与", app.bonus.papaWinterActual);

upsertBonusHistory("ママ冬賞与", app.bonus.mamaWinterActual);
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
