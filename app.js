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

    bankConfirmed:false,

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
        withdrawn:0,
        cashSpent:0,
        coop:0,
        holidayCount:0,
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

        bankConfirmed: app.bankConfirmed === true,

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

    app.bankConfirmed=false;

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
        withdrawn:0,
        cashSpent:0,
        coop:0,
        holidayCount:0,
        date:null
    };
    
    const monthSaved=
        localStorage.getItem(getKey());

    if(monthSaved){

        const data=
            JSON.parse(monthSaved);

        app.bank=data.bank || app.bank;

        app.bankConfirmed =
            data.bankConfirmed === true;

        app.income=data.income || app.income;

        app.budgets=data.budgets || app.budgets;

              app.history=data.history || [];

        app.incomeHistory =
            data.incomeHistory || [];

        app.atm = {
            ...app.atm,
            ...(data.atm || {})
        };

        // 旧ATMデータが残っている場合の移行
        if(app.atm.withdrawn === undefined){
            app.atm.withdrawn = Number(data.atm?.amount || 0);
        }
        if(app.atm.cashSpent === undefined){
            app.atm.cashSpent = 0;
        }
        if(app.atm.holidayCount === undefined){
            app.atm.holidayCount = 0;
        }
        
        
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
function getFiscalMonthInfo(month){

    return {
        year: month <= 3 ? currentYear + 1 : currentYear,
        month
    };

}

function isBankConfirmedData(data){

    if(!data) return false;

    if(data.bankConfirmed === true) return true;

    const bank = data.bank || {};

    return (
        Number(bank.mitake || 0) +
        Number(bank.takizawa || 0)
    ) > 0;

}

function getMonthIncomeTotal(data){

    if(!data || !data.income) return 0;

    return (
        Number(data.income.papa || 0) +
        Number(data.income.mama || 0) +
        Number(data.income.extra || 0)
    );

}

function getMonthBankOutflow(data){

    if(!data) return 0;

    const budgets = data.budgets || [];

    /* 現金カテゴリはATM引出時に銀行から出るので二重計上しない */
    let directSpent = budgets.reduce((sum,item)=>{

        if(["food","holiday","gas"].includes(item.id)){
            return sum;
        }

        return sum + Number(item.spent || 0);

    },0);

    /*
       「📦 その他」は入力時に
       🏦銀行 / 🏧現金 を選べる。
       現金を選んだ分はATMからすでに出ているため、
       銀行からの直接支出から差し引く。
    */
    const cashOther =
        (data.history || []).reduce((sum,item)=>{

            if(
                item.category === "📦 その他" &&
                item.paymentMethod === "cash"
            ){
                return sum + Number(item.amount || 0);
            }

            return sum;

        },0);

    directSpent =
        Math.max(
            0,
            directSpent - cashOther
        );

    const atm = data.atm || {};

    /* 生協は滝沢銀行から引き落とされる */
    const coop = Number(atm.coop || 0);

    /* ATMは現金を下ろした時点で銀行から出る */
    const withdrawn = Number(atm.withdrawn || 0);

    return directSpent + coop + withdrawn;

}

function getBankForecast(){

    /*
       銀行予測も「現在年度」のデータだけを使う。
       過去年度のデータはここには入れない。
    */

    const aiScope =
        getCurrentAIDataScope();

    const months = getFiscalMonths();

    const currentIndex = months.indexOf(
        aiScope.currentMonth
    );

    let balance = Number(app.startBank || 0);

    let baseIndex = -1;

    /* 現在月より前で最後に確定した銀行残高を探す */
    for(let i=0; i<currentIndex; i++){

        const info = getFiscalMonthInfo(months[i]);
        const data = getMonthData(info.year,info.month);

        if(isBankConfirmedData(data)){

            balance =
                Number(data.bank?.mitake || 0) +
                Number(data.bank?.takizawa || 0);

            baseIndex = i;

        }

    }

    /* 最後の確定残高より後の月を予測する */
    for(let i=baseIndex + 1; i<=currentIndex; i++){

        const info = getFiscalMonthInfo(months[i]);
        const data = getMonthData(info.year,info.month);

        if(!data) continue;

        balance += getMonthIncomeTotal(data);
        balance -= getMonthBankOutflow(data);

    }

    return Math.round(balance);

}

function drawBankForecast(){

    const bankEl =
        document.getElementById("bankTotal");

    if(!bankEl) return;

    const row = bankEl.closest(".bank-row");

    if(!row) return;

    let forecastEl =
        document.getElementById("bankForecast");

    if(!forecastEl){

        forecastEl = document.createElement("div");

        forecastEl.id = "bankForecast";
        forecastEl.style.marginTop = "6px";
        forecastEl.style.fontSize = "13px";
        forecastEl.style.fontWeight = "600";
        forecastEl.style.opacity = "0.78";

        row.parentNode.insertBefore(
            forecastEl,
            row.nextSibling
        );

    }

    if(app.bankConfirmed){

        const actual =
            Number(app.bank.mitake || 0) +
            Number(app.bank.takizawa || 0);

        forecastEl.innerHTML =
            `🔒 確定残高　¥${actual.toLocaleString()}`;

    }else{

        const forecast = getBankForecast();

        forecastEl.innerHTML =
            `🔮 月末予測　¥${forecast.toLocaleString()}<br>` +
            `<span style="font-weight:500;opacity:.7">` +
            `収入・ATM・生協・入力済みの銀行支出から予測` +
            `</span>`;

    }

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

        if(app.bankConfirmed){

            bankEl.textContent=
                "¥"+bankTotal.toLocaleString();

        }else{

            bankEl.textContent=
                "¥"+getBankForecast().toLocaleString();

        }

    }

    drawBankForecast();

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

function drawCategories(){

    const grid =
        document.getElementById("gridArea");

    if(!grid) return;

    const plan = getAtmPlan();

    grid.innerHTML = `

<button
class="input-card atm-card"
onclick="openATM()">

    <span class="input-name">
        🏧 ATM
    </span>

    <span class="input-left">
        ¥${plan.cashBalance.toLocaleString()}
    </span>

</button>

<button
class="input-card"
onclick="addCoop()">

    <span class="input-name">
        🛒 生協
    </span>

    <span class="input-left">
        ¥${plan.coop.toLocaleString()}
    </span>

</button>

`;

    app.budgets.forEach((item,index)=>{

        const used =
            Number(item.spent || 0);

        const isCashCategory =
            ["food","holiday","gas"].includes(item.id);

        let displayUsed = used;

        // 生協は食費に含めるので、食費カードの使用額はそのまま合計表示
        // ATM現金の残高は別管理する
        if(isCashCategory && item.id === "food"){
            displayUsed = used;
        }

        grid.innerHTML += `

<button
class="input-card"
onclick="addSpent(${index},${item.id==="iwagin"||item.id==="rakuten"})">

    <span class="input-name">
        ${item.name}
    </span>

    <span class="input-left ${displayUsed>item.budget?"over":""}">
        ¥${displayUsed.toLocaleString()}
    </span>

</button>

`;

    });

}

function openATM(){

    openNumberModal(
        "🏧 ATMから下ろす金額",
        (amount)=>{

            if(amount<=0) return;

            openNumberModal(
                "🎉 今月の休日回数",
                (holidayCount)=>{

                    holidayCount = Math.max(
                        0,
                        Math.floor(Number(holidayCount || 0))
                    );

                    app.atm.withdrawn =
                        Number(app.atm.withdrawn || 0) + amount;

                    app.atm.holidayCount =
                        holidayCount;

                    app.atm.date =
                        new Date().toLocaleDateString(
                            "ja-JP",
                            {
                                year:"numeric",
                                month:"2-digit",
                                day:"2-digit"
                            }
                        );

                    update();

                }
            );

        }
    );

}

function addCoop(){

    openNumberModal(
        "🛒 生協（今月の食費）",
        (amount,memo)=>{

            if(amount<=0) return;

            app.atm = {
                withdrawn:0,
                cashSpent:0,
                coop:0,
                holidayCount:0,
                date:null,
                ...(app.atm || {})
            };

            /* 生協はATM現金とは完全に別。滝沢銀行からの食費引落。 */
            app.atm.coop =
                Number(app.atm.coop || 0) + amount;

            const food =
                app.budgets.find(item => item.id === "food");

            if(food){
                food.spent =
                    Number(food.spent || 0) + amount;
            }

            const date =
                new Date().toLocaleDateString(
                    "ja-JP",
                    {
                        year:"numeric",
                        month:"2-digit",
                        day:"2-digit"
                    }
                );

            app.history.unshift({
                id:Date.now().toString(),
                date,
                category:"🍚 食費",
                amount,
                memo:`🛒 生協${memo ? "｜" + memo : ""}`,
                annual:false,
                coop:true,
                targetMonth:
                    `${getDisplayYear()}-${String(currentMonth).padStart(2,"0")}`
            });

            update();

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

    app.bankConfirmed = false;

    app.income = {

        papa:0,

        mama:0,

        extra:0

    };

      app.budgets =
        createDefaultBudgets();

    app.history = [];

    app.atm = {
        withdrawn:0,
        cashSpent:0,
        coop:0,
        holidayCount:0,
        date:null
    };

    /*
       リセットした内容を、その月の保存データにも反映。
       これがないと、画面上はリセットされても
       月を移動したときに古いデータが復活してしまう。
    */
    save();

    update();

};

function editBank(){

    openNumberModal("みたけ銀行残高",(mitake)=>{

        openNumberModal("滝沢銀行残高",(takizawa)=>{

            app.bank.mitake = mitake;

            app.bank.takizawa = takizawa;

            app.bankConfirmed = true;

            if(currentMonth===4){

                app.startBank =
                    mitake + takizawa;

            }

            update();

        });

    });

}
function openPaymentChoice(callback){

    const old = document.getElementById("paymentChoiceModal");

    if(old){
        old.remove();
    }

    const modal =
        document.createElement("div");

    modal.id = "paymentChoiceModal";

    modal.style.position = "fixed";
    modal.style.inset = "0";
    modal.style.background = "rgba(0,0,0,.35)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "99999";
    modal.style.padding = "20px";
    modal.style.boxSizing = "border-box";

    modal.innerHTML = `

<div style="
    width:100%;
    max-width:360px;
    background:#fff;
    border-radius:22px;
    padding:24px 20px;
    box-shadow:0 10px 40px rgba(0,0,0,.18);
    text-align:center;
">

    <div style="
        font-size:20px;
        font-weight:800;
        margin-bottom:8px;
    ">
        📦 その他の支払い方法
    </div>

    <div style="
        font-size:14px;
        color:#777;
        margin-bottom:20px;
        line-height:1.6;
    ">
        この支出は銀行から？<br>
        それともATMの現金から？
    </div>

    <button
        id="paymentBankBtn"
        style="
            width:100%;
            border:0;
            border-radius:14px;
            padding:15px 12px;
            margin-bottom:10px;
            background:#fff4c7;
            font-size:16px;
            font-weight:800;
        "
    >
        🏦 銀行から引き落とし
    </button>

    <button
        id="paymentCashBtn"
        style="
            width:100%;
            border:0;
            border-radius:14px;
            padding:15px 12px;
            background:#fff4c7;
            font-size:16px;
            font-weight:800;
        "
    >
        🏧 ATMの現金
    </button>

    <button
        id="paymentCancelBtn"
        style="
            width:100%;
            border:0;
            background:transparent;
            padding:14px 12px 4px;
            color:#888;
            font-size:14px;
        "
    >
        キャンセル
    </button>

</div>

`;

    document.body.appendChild(modal);

    const close = ()=>{
        modal.remove();
    };

    document
        .getElementById("paymentBankBtn")
        .onclick = ()=>{
            close();
            callback("bank");
        };

    document
        .getElementById("paymentCashBtn")
        .onclick = ()=>{
            close();
            callback("cash");
        };

    document
        .getElementById("paymentCancelBtn")
        .onclick = close;

}

function addSpent(index,isOverwrite=false){

    openNumberModal(

        app.budgets[index].name,

        (amount,memo)=>{

            if(amount<=0) return;

            /*
               「その他」だけは、
               支払い方法を選ぶ。
            */

            if(app.budgets[index].id === "other"){

                openPaymentChoice(
                    (paymentMethod)=>{

                        saveExpense(
                            index,
                            amount,
                            memo,
                            isOverwrite,
                            paymentMethod
                        );

                    }
                );

                return;

            }

            /*
               食費・休日・ガソリンはATM現金。
               それ以外は銀行支出。
            */

            const paymentMethod =
                ["food","holiday","gas"].includes(
                    app.budgets[index].id
                )
                    ? "cash"
                    : "bank";

            saveExpense(
                index,
                amount,
                memo,
                isOverwrite,
                paymentMethod
            );

        }
    );

}

function saveExpense(
    index,
    amount,
    memo,
    isOverwrite=false,
    paymentMethod="bank"
){

    const item =
        app.budgets[index];

    if(!item) return;

    if(isOverwrite){

        const previous =
            Number(item.spent || 0);

        item.spent = amount;

        /*
           上書き対象が現金の場合、
           ATM現金使用額も差し替える。
        */

        if(paymentMethod === "cash"){

            app.atm.cashSpent =
                Math.max(
                    0,
                    Number(app.atm.cashSpent || 0)
                    - previous
                    + amount
                );

        }

    }else{

        item.spent =
            Number(item.spent || 0)
            + amount;

        if(paymentMethod === "cash"){

            app.atm.cashSpent =
                Number(app.atm.cashSpent || 0)
                + amount;

        }

    }

    app.history.unshift({

        id: Date.now().toString(),

        date:
            new Date().toLocaleDateString(
                "ja-JP",
                {
                    year:"numeric",
                    month:"2-digit",
                    day:"2-digit"
                }
            ),

        category:item.name,

        amount,

        memo,

        annual:false,

        paymentMethod,

        cashExpense:
            paymentMethod === "cash",

        targetMonth:
            `${getDisplayYear()}-${
                String(currentMonth)
                    .padStart(2,"0")
            }`

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
function getTodayString(){
    return new Date().toLocaleDateString(
        "ja-JP",
        {
            year:"numeric",
            month:"2-digit",
            day:"2-digit"
        }
    );
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

    /*
       年間コーチは現在年度だけを分析対象にする。
       過去年度は「学習材料」であり、
       現在の年間目標・予算・節約判定には混ぜない。
    */

    const aiScope =
        getCurrentAIDataScope();

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

    const noChangeForecast =
        currentSaving +
        naturalFuture +
        bonusFuture;

    const goal =
        Number(app.goal || 0);

    const gap =
        Math.max(
            goal - noChangeForecast,
            0
        );

    const surplus =
        Math.max(
            noChangeForecast - goal,
            0
        );

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

        goal,
        gap,
        surplus,

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

       1カテゴリにつき通常予算の15%までを
       現実的な節約上限として扱う。
       その上限を超える無理な金額は提案しない。

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


function getMonthlyCoachPlan(){

    const annual = getAnnualCoachData();
    const cuts = getAnnualCutPlan(annual.monthlyExtra);

    const plan = {
        target: cuts.reduce(
            (sum,item)=>sum + Number(item.amount || 0),
            0
        ),
        categories:{}
    };

    cuts.forEach(item=>{

        const id =
            item.name.includes("食費")
                ? "food"
                : item.name.includes("休日")
                    ? "holiday"
                    : null;

        if(id){
            plan.categories[id] =
                Number(item.amount || 0);
        }

    });

    return plan;
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

    const historicalTrendMessage =
        getHistoricalTrendMessage();

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
        🔮 <strong>このままなら年度末</strong><br>
        ¥${annual.noChangeForecast.toLocaleString()}
        <br>
        <span style="opacity:.78;">
            目標との差：
            ${
                annual.gap > 0
                    ? "あと¥" + annual.gap.toLocaleString()
                    : "＋¥" + annual.surplus.toLocaleString()
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

        🔮 年度末予測：
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


    if(historicalTrendMessage){

        html += `
<div style="
    margin-top:10px;
    padding:10px 12px;
    border-radius:12px;
    background:#f5f5f5;
    line-height:1.7;
    font-size:12px;
    opacity:.9;
">
${historicalTrendMessage}
</div>
`;

    }

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

            const suggestedTotal =
                cuts.reduce(
                    (sum,item)=>sum+item.amount,
                    0
                );

            const remainingNeed =
                Math.max(
                    annual.monthlyExtra -
                    suggestedTotal,
                    0
                );

            html += `
<div style="
    margin-top:10px;
    padding:10px 12px;
    border-radius:12px;
    background:#fff8dc;
    line-height:1.7;
">
💡 <strong>現実的な今月の調整案</strong>
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
現実的に見込める改善は
<strong>月約¥${suggestedTotal.toLocaleString()}</strong>です。
`;

            if(remainingNeed > 0){

                html += `
<br>
⚠️ 目標達成に必要な
月¥${annual.monthlyExtra.toLocaleString()}には、
まだ<strong>約¥${remainingNeed.toLocaleString()}</strong>
足りません。
<br>
<span style="opacity:.78;">
ここを無理に食費・休日だけで削ることはせず、
今後はボーナス・収入・特別費・目標設定なども含めて
達成方法を考えます。
</span>
`;

            }else{

                html += `
<br>
🎯 この調整で、必要な月間改善額を
まかなえる計算です。
`;

            }

            html += `
</div>
`;

        }else{

            html += `
<div style="
    margin-top:10px;
    line-height:1.7;
">
⚠️ 今の生活費だけで埋めるにはかなり厳しい金額です。
<br>
無理な節約を前提にせず、ボーナス・収入・特別費・
目標設定なども含めて達成方法を考えます。
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


/* ===========================
   AIデータの扱い
=========================== */

/*
   現在のAIコーチが使ってよいデータは、
   「現在選択している年度」のデータだけ。

   過去年度のデータは、現在の家計ルールとは
   入力方法やカテゴリの意味が違う可能性があるため、
   現在のAIコーチの予算判定・目標判定には混ぜない。

   将来、季節傾向や過去傾向を分析するときだけ、
   getHistoricalLearningData() を学習材料として使う。
*/


/*
   過去データの季節・カテゴリ傾向
   --------------------------------
   過去年度は現在のAI判定には混ぜず、
   「過去にはどんな傾向があったか」を見るためだけに使う。
*/

function getHistoricalTrendData(){

    /*
       現在月と同じ月だけを見る。
       過去2年度分までを参考データとして読む。

       以前のv9では過去年度の全24か月を毎回読み込み、
       その全履歴を集計していたため、履歴が多い家庭では
       AI表示中に画面全体が重くなる可能性があった。

       季節傾向で必要なのは「今月の過去傾向」なので、
       必要な月だけを読む。
    */

    const result = {
        months: 0,
        categories: {}
    };

    const startFiscalYear =
        Math.max(
            2024,
            currentYear - 2
        );

    for(
        let fiscalYear = startFiscalYear;
        fiscalYear < currentYear;
        fiscalYear++
    ){

        const year =
            currentMonth <= 3
                ? fiscalYear + 1
                : fiscalYear;

        const data =
            getMonthData(
                year,
                currentMonth
            );

        if(!data) continue;

        result.months += 1;

        (data.history || []).forEach(item => {

            const category =
                item.category || "その他";

            const amount =
                Number(item.amount || 0);

            if(!result.categories[category]){

                result.categories[category] = {
                    total: 0,
                    count: 0
                };

            }

            result.categories[category].total +=
                amount;

            result.categories[category].count +=
                1;

        });

    }

    Object.keys(
        result.categories
    ).forEach(category => {

        const item =
            result.categories[category];

        item.average =
            result.months > 0
                ? Math.round(
                    item.total /
                    result.months
                )
                : 0;

    });

    return result;

}

function getCurrentMonthHistoricalTrends(){

    const trends =
        getHistoricalTrendData();

    return trends[currentMonth] || {
        months: 0,
        categories: {}
    };

}

/*
   画面に出すための参考コメント。
   データが十分にない場合は何も表示しない。
*/

function getHistoricalTrendMessage(){

    const trend =
        getCurrentMonthHistoricalTrends();

    if(!trend.months || trend.months < 2){
        return "";
    }

    const categories =
        Object.entries(
            trend.categories
        )
        .filter(([_,item]) => item.average > 0)
        .sort(
            (a,b) =>
                b[1].average -
                a[1].average
        );

    if(!categories.length){
        return "";
    }

    const top =
        categories.slice(0,3);

    let message =
        `📊 過去${trend.months}年の同じ時期では、`;

    top.forEach(([category,item],index) => {

        message +=
            `${category}が平均約¥${item.average.toLocaleString()}`;

        if(index < top.length - 1){
            message += "、";
        }

    });

    message +=
        "でした。これは現在の予算判定には使わず、参考として表示しています。";

    return message;

}

function getCurrentAIDataScope(){

    return {
        fiscalYear: currentYear,
        currentMonth,
        source: "current-fiscal-year"
    };

}

/*
   過去年度のデータを「学習材料」として取得するための入口。
   現在のAIコーチからは呼び出さない。

   ここではデータを保存・取得できるようにするだけで、
   過去データを現在の予算や節約判定へ混ぜない。
*/

function getHistoricalLearningData(){

    const result = [];

    for(let fiscalYear=2024; fiscalYear<currentYear; fiscalYear++){

        const months = [
            4,5,6,7,8,9,
            10,11,12,
            1,2,3
        ];

        months.forEach(month=>{

            const year =
                month <= 3
                    ? fiscalYear + 1
                    : fiscalYear;

            const data =
                getMonthData(year, month);

            if(!data) return;

            result.push({
                fiscalYear,
                year,
                month,
                incomeHistory:
                    data.incomeHistory || [],
                history:
                    data.history || [],
                budgets:
                    data.budgets || [],
                bank:
                    data.bank || null,
                bankConfirmed:
                    data.bankConfirmed === true
            });

        });

    }

    return result;

}

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

        data.atm = data.atm || {
            withdrawn:0,
            cashSpent:0,
            coop:0,
            holidayCount:0,
            date:null
        };

        if(target.coop){
            data.atm.coop = Math.max(
                0,
                Number(data.atm.coop || 0) - Number(target.amount || 0)
            );
        }

        if(target.cashExpense){
            data.atm.cashSpent = Math.max(
                0,
                Number(data.atm.cashSpent || 0) - Number(target.amount || 0)
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
