        /* まる家計 Ver45｜デザインリフレッシュ */

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

            startBank:78142,
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

            memo:"",

            recurringOthers:[],

            foodPlanned:[],

            cardConfig:{
                iwagin:{
                    shoppingCutoff:15,
                    shoppingPayDay:10,
                    cashingCutoff:0,
                    cashingPayDay:27,
                    fixedItems:[
                        {name:"FWD保険",amount:1228},
                        {name:"ソフトバンクまとめて支払い",amount:1100},
                        {name:"がん保険（パパ）",amount:1368},
                        {name:"ウォーターサーバー",amount:4194},
                        {name:"タブレット保険",amount:700},
                        {name:"チューリッヒ",amount:2014},
                        {name:"スマホ代",amount:14000}
                    ]
                }
            },

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
                ),

                recurringOthers: JSON.parse(
                    JSON.stringify(app.recurringOthers || [])
                ),

                cardConfig: JSON.parse(
                    JSON.stringify(app.cardConfig || {})
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

                memo: String(app.memo || ""),

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

            app.startBank=78142;
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

            app.memo="";

            app.foodPlanned=[];

            app.atm={
                amount:0,
                withdrawn:0,
                coop:0,
                food:0,
                gas:0,
                holiday:0,
                cashSpent:0,
                date:null
            };
            
            const monthSaved=
                localStorage.getItem(getKey());

            if(monthSaved){

                const data=
                    JSON.parse(monthSaved);

                app.bank=data.bank || app.bank;
                app.bankConfirmed = data.bankConfirmed === true || (Number(app.bank.mitake || 0) + Number(app.bank.takizawa || 0) > 0);

                app.income=data.income || app.income;

                app.budgets=data.budgets || app.budgets;

                      app.history=data.history || [];

                app.incomeHistory =
                    data.incomeHistory || [];

                app.memo =
                    data.memo || "";

                app.foodPlanned =
                    Array.isArray(data.foodPlanned)
                        ? data.foodPlanned
                        : [];

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

                app.recurringOthers =
                    Array.isArray(data.recurringOthers)
                        ? data.recurringOthers
                        : [];

                if(data.cardConfig){
                    app.cardConfig = {
                        ...app.cardConfig,
                        ...data.cardConfig,
                        iwagin:{
                            ...app.cardConfig.iwagin,
                            ...(data.cardConfig.iwagin || {})
                        }
                    };
                }

            }

            // 年度スタート残高は2026年度の基準として固定。
            app.startBank = 78142;

            app.budgets.forEach(item=>{

                if(item.spent===undefined){

                    item.spent=0;

                }

            });

            app.recurringOthers =
                Array.isArray(app.recurringOthers)
                    ? app.recurringOthers
                    : [];

            if(!app.atm || typeof app.atm !== "object"){
                app.atm = {};
            }

            if(app.atm.foodDays === undefined){
                app.atm.foodDays = 0;
            }

            ensureRecurringOthersApplied();

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
        function getCashSpendingState(){

            const food =
                app.budgets.find(item=>item.id==="food");

            const gas =
                app.budgets.find(item=>item.id==="gas");

            const holiday =
                app.budgets.find(item=>item.id==="holiday");

            const coop =
                Number(app.atm?.coop || 0);

            const plan =
                getAtmPlan();

            const foodActual =
                Number(food?.spent || 0) + coop;

            const gasActual =
                Number(gas?.spent || 0);

            const holidayActual =
                Number(holiday?.spent || 0);

            // そのカテゴリを1回でも入力したら、そのカテゴリだけ実測へ切り替える。
            const foodHasActual =
                foodActual > 0;

            const gasHasActual =
                gasActual > 0;

            const holidayHasActual =
                holidayActual > 0;

            const foodDisplay =
                foodHasActual
                    ? foodActual
                    : plan.foodCashBudget + coop;

            const gasDisplay =
                gasHasActual
                    ? gasActual
                    : plan.gasCashBudget;

            const holidayDisplay =
                holidayHasActual
                    ? holidayActual
                    : plan.holidayBudget;

            const fixedActual =
                app.budgets
                    .filter(item =>
                        !["food","gas","holiday"].includes(item.id)
                    )
                    .reduce(
                        (sum,item)=>
                            sum + Number(item.spent || 0),
                        0
                    );

            const total =
                fixedActual +
                foodDisplay +
                gasDisplay +
                holidayDisplay;

            const hasForecast =
                (!foodHasActual && plan.foodCashBudget > 0) ||
                (!gasHasActual && plan.gasCashBudget > 0) ||
                (!holidayHasActual && plan.holidayBudget > 0);

            return {
                foodActual,
                gasActual,
                holidayActual,
                foodDisplay,
                gasDisplay,
                holidayDisplay,
                fixedActual,
                total,
                hasForecast
            };

        }

        function getCashBudgetStatus(id){

            const item =
                app.budgets.find(b=>b.id===id);

            if(!item){
                return {
                    budget:0,
                    used:0,
                    remaining:0
                };
            }

            let used =
                Number(item.spent || 0);

            if(id==="food"){
                used += Number(app.atm?.coop || 0);
            }

            const budget =
                id==="holiday"
                    ? Number(
                        app.atm?.holidayBudgetTotal ??
                        item.budget ??
                        0
                    )
                    : Number(item.budget || 0);

            return {
                budget,
                used,
                remaining:budget-used
            };

        }

        function ensureRecurringOthersApplied(){

            const otherIndex =
                app.budgets.findIndex(item=>item.id==="other");

            if(otherIndex < 0) return;

            if(!Array.isArray(app.history)){
                app.history = [];
            }

            const monthKey =
                `${getDisplayYear()}-${String(currentMonth).padStart(2,"0")}`;

            (app.recurringOthers || []).forEach(item=>{

                const id = String(item.id || "");

                if(app.history.some(h =>
                    String(h.recurringOtherId || "") === id &&
                    String(h.targetMonth || "") === monthKey
                )){
                    return;
                }

                const amount = Math.max(Number(item.amount || 0),0);
                if(amount <= 0) return;

                app.budgets[otherIndex].spent =
                    Number(app.budgets[otherIndex].spent || 0) + amount;

                app.history.unshift({
                    id:`recurring-${id}-${monthKey}`,
                    date:`${getDisplayYear()}/${String(currentMonth).padStart(2,"0")}/01`,
                    category:app.budgets[otherIndex].name,
                    amount,
                    memo:`毎月自動：${item.name}`,
                    annual:false,
                    targetMonth:monthKey,
                    recurringOtherId:id
                });

            });

        }

        function drawRecurringOthers(){

            const el = document.getElementById("recurringOthersList");
            if(!el) return;

            const list = Array.isArray(app.recurringOthers)
                ? app.recurringOthers
                : [];

            if(list.length === 0){
                el.innerHTML =
                    `<div class="summary-sub">まだ登録されていません。登録すると毎月「その他」に自動計上します。</div>`;
                return;
            }

            el.innerHTML = list.map(item=>{
                const safeId = String(item.id || "").replaceAll("'","\\'");
                return `
                    <div class="recurring-other-item">
                        <span>📦 ${escapeHtml(item.name)}　¥${Number(item.amount||0).toLocaleString()}/月</span>
                        <span class="recurring-other-actions">
                            <button type="button" onclick="editRecurringOther('${safeId}')">編集</button>
                            <button type="button" onclick="deleteRecurringOther('${safeId}')">削除</button>
                        </span>
                    </div>
                `;
            }).join("");

        }

        function addRecurringOther(){

            const name = prompt("毎月かかる項目名を入力してください。");
            if(!name || !name.trim()) return;

            openNumberModal(`📦 ${name.trim()} の月額`, (amount)=>{

                amount = Math.max(Number(amount || 0),0);
                if(amount <= 0) return;

                if(!Array.isArray(app.recurringOthers)){
                    app.recurringOthers = [];
                }

                app.recurringOthers.push({
                    id:`ro-${Date.now()}`,
                    name:name.trim(),
                    amount
                });

                ensureRecurringOthersApplied();
                update();

            });

        }

        function editRecurringOther(id){

            const item = (app.recurringOthers || []).find(
                entry=>String(entry.id)===String(id)
            );
            if(!item) return;

            const name = prompt("項目名を変更できます。", item.name);
            if(!name || !name.trim()) return;

            openNumberModal(
                `📦 ${name.trim()} の月額`,
                (amount)=>{
                    amount = Math.max(Number(amount || 0),0);
                    if(amount <= 0) return;

                    item.name = name.trim();
                    item.amount = amount;

                    update();
                },
                "",
                "",
                Number(item.amount || 0)
            );

        }

        function deleteRecurringOther(id){

            const item = (app.recurringOthers || []).find(
                entry=>String(entry.id)===String(id)
            );
            if(!item) return;

            if(!confirm(`「${item.name}」を毎月の自動入力から外しますか？\nすでに入力済みの月の支出はそのまま残ります。`)){
                return;
            }

            app.recurringOthers = (app.recurringOthers || []).filter(
                entry=>String(entry.id)!==String(id)
            );

            save();
            drawRecurringOthers();

        }

        function escapeHtml(value){
            return String(value ?? "")
                .replaceAll("&","&amp;")
                .replaceAll("<","&lt;")
                .replaceAll(">","&gt;")
                .replaceAll('"',"&quot;")
                .replaceAll("'","&#039;");
        }


        function drawIwaginCardSummary(){
            const el=document.getElementById("iwaginCardSettings");
            if(!el) return;

            const c=app.cardConfig.iwagin;
            el.innerHTML=
                `ショッピング：毎月${c.shoppingCutoff}日締め → 翌月${c.shoppingPayDay}日払い<br>`+
                `キャッシング：毎月末日締め → 翌月${c.cashingPayDay}日払い<br>`+
                `固定費：¥${getFixedIwaginTotal().toLocaleString()} / 月`;
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

            // ATM入力直後は、食費・ガソリン・休日を予測として支出に反映。
            // そのカテゴリを入力したら、そのカテゴリだけ実測へ切り替える。
            const spending =
                getCashSpendingState();

            const spent =
                spending.total;

            const remain =
                income - spent;

            const incomeSummaryEl = document.getElementById("incomeSummary");
            if(incomeSummaryEl){
                incomeSummaryEl.textContent = "¥"+income.toLocaleString();
            }

            document
                .getElementById("spent")
                .textContent=
                "¥"+spent.toLocaleString();

            const spentStatusEl =
                document.getElementById("spentStatus");

            if(spentStatusEl){
                spentStatusEl.textContent =
                    spending.hasForecast
                        ? "ATM入力分を予測中"
                        : "実測";
            }

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

                // ホームの「前月比」は、前月の銀行残高との差。
                // 4月だけは3月末のスタート残高 ¥78,142 と比較する。
                const previousBank = getPreviousBankBalance(currentMonth);
                const saving = previousBank === null
                    ? null
                    : bankTotal - previousBank;

                savingEl.textContent = saving === null
                    ? "—"
                    : (saving>=0?"+":"") + "¥" + saving.toLocaleString();

                savingEl.className =
                    "bank-saving " +
                    (saving === null ? "" : (saving>=0 ? "plus" : "minus"));

            }

            drawCategories();

            drawMemo();

            drawRecurringOthers();

            drawIwaginCardSummary();

            drawNewAnnualPage();

            drawAnnualManage();

            drawIncomeHistory();
            
            save();

        }
        /* ===========================
           ⑤ カテゴリ・収入・支出
        =========================== */
        function getFixedIwaginTotal(){
            return (app.cardConfig?.iwagin?.fixedItems || [])
                .reduce((sum,item)=>sum + Number(item.amount || 0),0);
        }

        function addMonthsToYearMonth(year,month,delta){
            const d = new Date(Number(year), Number(month)-1+delta, 1);
            return {
                year:d.getFullYear(),
                month:d.getMonth()+1
            };
        }

        function getIwaginCardChargeMonth(dateValue, type="shopping"){
            const parts = String(dateValue || "").split("-");
            if(parts.length !== 3){
                return `${getDisplayYear()}-${String(currentMonth).padStart(2,"0")}`;
            }

            const y=Number(parts[0]);
            const m=Number(parts[1]);
            const day=Number(parts[2]);

            if(type==="cashing"){
                const next=addMonthsToYearMonth(y,m,1);
                return `${next.year}-${String(next.month).padStart(2,"0")}`;
            }

            const cutoff=Number(app.cardConfig?.iwagin?.shoppingCutoff || 15);
            const add=day <= cutoff ? 1 : 2;
            const target=addMonthsToYearMonth(y,m,add);
            return `${target.year}-${String(target.month).padStart(2,"0")}`;
        }

        function getAllStoredMonthHistories(){
            const result=[];
            for(let i=0;i<localStorage.length;i++){
                const key=localStorage.key(i);
                if(!key || !key.startsWith("maru-kakei-") || key.startsWith("maru-kakei-year-") || key==="maru-kakei-session"){
                    continue;
                }
                try{
                    const data=JSON.parse(localStorage.getItem(key));
                    if(Array.isArray(data?.history)){
                        result.push(...data.history);
                    }
                }catch(e){}
            }
            result.push(...(app.history || []));
            return result;
        }

        function getIwaginCardForecast(targetYear=getDisplayYear(),targetMonth=currentMonth){
            const key=`${targetYear}-${String(targetMonth).padStart(2,"0")}`;
            const seen=new Set();
            let total=0;

            getAllStoredMonthHistories().forEach(item=>{
                if(!item || item.payment!=="card") return;
                if(item.cardChargeMonth!==key) return;
                const unique=item.id || `${item.date}-${item.amount}-${item.memo}`;
                if(seen.has(unique)) return;
                seen.add(unique);
                total += Number(item.amount || 0);
            });

            return total;
        }

        function getFoodPlannedTotal(){
            return (app.foodPlanned || [])
                .reduce((sum,item)=>sum+Number(item.amount || 0),0);
        }

        function addFoodPlanned(){
            openNumberModal(
                "🍚 この先使うお金",
                (amount,memo)=>{
                    if(amount<=0) return;

                    if(!Array.isArray(app.foodPlanned)){
                        app.foodPlanned=[];
                    }

                    app.foodPlanned.unshift({
                        id:`food-plan-${Date.now()}`,
                        name:memo || "食費の予定",
                        amount:Number(amount)
                    });

                    update();
                },
                "",
                "",
                null
            );
        }

        function deleteFoodPlanned(id){
            app.foodPlanned=(app.foodPlanned || []).filter(
                item=>String(item.id)!==String(id)
            );
            update();
        }

        function showIwaginCardDetails(){
            const c=app.cardConfig?.iwagin;
            const fixed=(c?.fixedItems || [])
                .map(item=>`${item.name} ¥${Number(item.amount).toLocaleString()}`)
                .join("\n");

            alert(
`🏦 岩銀カード

ショッピング
毎月${c.shoppingCutoff}日締め → 翌月${c.shoppingPayDay}日払い

キャッシング
毎月末日締め → 翌月${c.cashingPayDay}日払い

固定費（月 ¥${getFixedIwaginTotal().toLocaleString()}）
${fixed}`
            );
        }

        function drawCategories(){

            const grid = document.getElementById("gridArea");
            if(!grid) return;

            const cashIds = ["food","holiday","gas"];

            grid.innerHTML = `
                <button class="input-card atm-card" onclick="openATM()">
                    <span class="input-name">🏧 ATM</span>
                    <span class="input-left">¥${Number(getAtmPlan().cashBalance || 0).toLocaleString()}</span>
                </button>
            `;

            app.budgets.forEach((item,index)=>{

                if(cashIds.includes(item.id)) return;

                const used = Number(item.spent || 0);

                let extra="";
                if(item.id==="iwagin"){
                    const forecast=getIwaginCardForecast();
                    const fixed=getFixedIwaginTotal();

                    extra=`
                        <div class="card-forecast-line">
                            固定 ¥${fixed.toLocaleString()}
                            ${forecast>0
                                ? `｜次回カード予測 <span class="card-forecast">¥${forecast.toLocaleString()}</span>`
                                : ""}
                        </div>
                    `;
                }

                grid.innerHTML += `
                    <button
                        class="input-card"
                        onclick="${item.id === "other"
                            ? "addOtherExpense()"
                            : `addSpent(${index},${item.id==="iwagin"||item.id==="rakuten"})`}">

                        <span class="input-name">${item.name}</span>
                        <span class="input-left ${used > Number(item.budget || 0) ? "over" : ""}">
                            ¥${used.toLocaleString()}
                        </span>
                        ${extra}
                    </button>
                `;

            });

            const food = app.budgets.find(item=>item.id==="food");
            const holiday = app.budgets.find(item=>item.id==="holiday");
            const gas = app.budgets.find(item=>item.id==="gas");

            const coop = Number(app.atm?.coop || 0);
            const plannedFood = getFoodPlannedTotal();

            const rows = [
                {
                    id:"food",
                    index:app.budgets.findIndex(item=>item.id==="food"),
                    name:"🍚 食費",
                    budget:Number(food?.budget || 80000),
                    used:Number(food?.spent || 0) + coop
                },
                {
                    id:"holiday",
                    index:app.budgets.findIndex(item=>item.id==="holiday"),
                    name:"🎉 休日",
                    budget:Number(
                        app.atm?.holidayBudgetTotal ??
                        holiday?.budget ??
                        40000
                    ),
                    used:Number(holiday?.spent || 0)
                },
                {
                    id:"gas",
                    index:app.budgets.findIndex(item=>item.id==="gas"),
                    name:"⛽ ガソリン",
                    budget:Number(gas?.budget || 17000),
                    used:Number(gas?.spent || 0)
                }
            ];

            grid.innerHTML += `
                <div class="cash-budget-section">
                    <div class="cash-budget-title">💰 現金で管理</div>
                    <div class="cash-budget-grid">
                        ${rows.map(row=>{

                            const remaining=row.budget-row.used;

                            if(row.id==="food"){
                                const days=Number(app.atm?.foodDays || 0);
                                const dailyBase=days>0
                                    ? Math.floor(Math.max(remaining-plannedFood,0)/days)
                                    : 0;

                                const plannedList=(app.foodPlanned || [])
                                    .map(item=>`
                                        <div style="display:flex;justify-content:space-between;gap:6px;">
                                            <span>${escapeHtml(item.name)}</span>
                                            <span>¥${Number(item.amount||0).toLocaleString()}</span>
                                            <button type="button"
                                                onclick="event.stopPropagation();deleteFoodPlanned('${String(item.id).replaceAll("'","\\'")}')"
                                                style="border:0;background:transparent;font-weight:900;">×</button>
                                        </div>
                                    `).join("");

                                return `
                                    <div class="cash-budget-card">
                                        <div class="cash-budget-name">${row.name}</div>
                                        <div class="cash-budget-numbers">
                                            <span>現在 ¥${row.used.toLocaleString()}</span>
                                            <strong class="${remaining < 0 ? "over" : ""}">
                                                あと ¥${Math.max(remaining,0).toLocaleString()}
                                            </strong>
                                        </div>
                                        <div class="cash-budget-sub">
                                            予算 ¥${row.budget.toLocaleString()}
                                        </div>

                                        <div class="cash-budget-planned">
                                            この先使うお金
                                            <strong>¥${plannedFood.toLocaleString()}</strong>
                                            <button type="button"
                                                class="cash-budget-plan-btn"
                                                onclick="event.stopPropagation();addFoodPlanned()">
                                                ＋予定を追加
                                            </button>
                                            ${plannedList}
                                        </div>

                                        ${
                                            days>0
                                                ? `<div class="cash-budget-food-days">
                                                    予定を引いたあと → あと ${days}日
                                                    → 1日 <strong>¥${dailyBase.toLocaleString()}</strong>
                                                   </div>`
                                                : `<div class="cash-budget-food-days">🗓 食費の日数をATM入力で設定</div>`
                                        }
                                    </div>
                                `;
                            }

                            return `
                                <button
                                    class="cash-budget-card"
                                    onclick="addSpent(${row.index},false)"
                                >
                                    <div class="cash-budget-name">${row.name}</div>
                                    <div class="cash-budget-numbers">
                                        <span>現在 ¥${row.used.toLocaleString()}</span>
                                        <strong class="${remaining < 0 ? "over" : ""}">
                                            あと ¥${Math.max(remaining,0).toLocaleString()}
                                        </strong>
                                    </div>
                                    <div class="cash-budget-sub">
                                        予算 ¥${row.budget.toLocaleString()}
                                    </div>
                                    ${
                                        row.id==="holiday"
                                            ? `<div class="cash-budget-food-days">
                                                残り ${getRemainingHolidayCount()}回
                                                ${Number(app.atm?.holidayPerBudget || 0)>0
                                                    ? `→ 1回 ¥${Number(app.atm.holidayPerBudget).toLocaleString()}`
                                                    : ""}
                                              </div>`
                                            : ""
                                    }
                                </button>
                            `;
                        }).join("")}
                    </div>
                </div>
            `;

        }

        function openATM(){

            openNumberModal(
                "🏧 ATM引出額",
                (amount,atmMemo,atmDate)=>{

                    if(amount<=0) return;

                    openNumberModal(
                        "🛒 生協引落額（食費）",
                        (coop,coopMemo,coopDate)=>{

                            coop = Math.max(Number(coop || 0),0);

                            openNumberModal(
                                "🎉 休日はあと何回？",
                                (holidayCount)=>{

                                    holidayCount =
                                        Math.max(
                                            Math.floor(Number(holidayCount || 0)),
                                            0
                                        );

                                    openNumberModal(
                                        "🎉 休日は1回いくら？",
                                        (holidayPerBudget)=>{

                                            holidayPerBudget =
                                                Math.max(
                                                    Number(holidayPerBudget || 0),
                                                    0
                                                );

                                            const finishATMInput = (foodDays)=>{
                                                foodDays = Math.max(
                                                    Math.floor(Number(foodDays || 0)),
                                                    0
                                                );

                                            const foodBudget =
                                                Number(
                                                    app.budgets.find(
                                                        item=>item.id==="food"
                                                    )?.budget || 80000
                                                );

                                            const gasBudget =
                                                Number(
                                                    app.budgets.find(
                                                        item=>item.id==="gas"
                                                    )?.budget || 17000
                                                );

                                            const previousCoop =
                                                Number(app.atm.coop || 0);

                                            const previousFood =
                                                Number(app.atm.food || 0);

                                            const previousGas =
                                                Number(app.atm.gas || 0);

                                            const previousHoliday =
                                                Number(app.atm.holiday || 0);

                                            const previousHolidayBudget =
                                                Number(
                                                    app.atm.holidayBudgetTotal || 0
                                                );

                                            const totalCoop =
                                                previousCoop + coop;

                                            const foodRemaining =
                                                Math.max(
                                                    foodBudget -
                                                    totalCoop -
                                                    previousFood,
                                                    0
                                                );

                                            const gasRemaining =
                                                Math.max(
                                                    gasBudget -
                                                    previousGas,
                                                    0
                                                );

                                            // 最新の「回数×1回予算」を休日予算として保持。
                                            // すでに確保した金額を下回らない。
                                            const holidayBudgetTotal =
                                                previousHolidayBudget > 0
                                                    ? previousHolidayBudget
                                                    : holidayCount * holidayPerBudget;

                                            const holidayRemaining =
                                                Math.max(
                                                    holidayBudgetTotal -
                                                    previousHoliday,
                                                    0
                                                );

                                            let remaining =
                                                Number(amount);

                                            const foodAdd =
                                                Math.min(
                                                    foodRemaining,
                                                    remaining
                                                );

                                            remaining -= foodAdd;

                                            const gasAdd =
                                                Math.min(
                                                    gasRemaining,
                                                    remaining
                                                );

                                            remaining -= gasAdd;

                                            const holidayAdd =
                                                Math.min(
                                                    holidayRemaining,
                                                    remaining
                                                );

                                            app.atm.amount =
                                                Number(app.atm.amount || 0) +
                                                Number(amount);

                                            app.atm.withdrawn =
                                                Number(app.atm.withdrawn || 0) +
                                                Number(amount);

                                            app.atm.coop =
                                                totalCoop;

                                            app.atm.food =
                                                previousFood + foodAdd;

                                            app.atm.gas =
                                                previousGas + gasAdd;

                                            app.atm.holiday =
                                                previousHoliday + holidayAdd;

                                            app.atm.holidayCount =
                                                holidayCount > 0
                                                    ? holidayCount
                                                    : Number(app.atm.holidayCount || 0);

                                            app.atm.holidayPerBudget =
                                                holidayPerBudget > 0
                                                    ? holidayPerBudget
                                                    : Number(app.atm.holidayPerBudget || 0);

                                            app.atm.holidayBudgetTotal =
                                                holidayBudgetTotal;

                                            app.atm.foodDays =
                                                foodDays > 0
                                                    ? foodDays
                                                    : Number(app.atm.foodDays || 0);

                                            app.atm.date =
                                                formatInputDate(
                                                    atmDate || coopDate
                                                );

                                            update();

                                            };

                                            if(Number(app.atm.foodDays || 0) > 0){
                                                finishATMInput(Number(app.atm.foodDays || 0));
                                            }else{
                                                openNumberModal(
                                                    "🍚 食費はあと何日？",
                                                    finishATMInput
                                                );
                                            }

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }

        function addIncome(type){

            openNumberModal("収入金額",(amount,memo,dateValue)=>{

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

                            date:formatInputDate(dateValue),

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

            date: formatInputDate(dateValue),

            type,

            amount,

            memo,

            targetMonth:getTargetMonthFromInputDate(dateValue)

        });

                update();

            });

        }

        const incomePapaBtn = document.getElementById("incomePapa");
        if(incomePapaBtn) incomePapaBtn.onclick = ()=>addIncome("パパ");

        const incomeMamaBtn = document.getElementById("incomeMama");
        if(incomeMamaBtn) incomeMamaBtn.onclick = ()=>addIncome("ママ");

        const incomeExtraBtn = document.getElementById("incomeExtra");
        if(incomeExtraBtn) incomeExtraBtn.onclick = ()=>addIncome("臨時");

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

                withdrawn:0,

                coop:0,

                food:0,

                gas:0,

                holiday:0,

                holidayCount:0,

                holidayPerBudget:0,

                holidayBudgetTotal:0,

                foodDays:0,

                cashSpent:0,

                date:null

            };

            update();

        };

        function editBank(){

            openNumberModal("みたけ銀行残高",(mitake)=>{

                openNumberModal("滝沢銀行残高",(takizawa)=>{

                    app.bank.mitake = mitake;

                    app.bank.takizawa = takizawa;
                    app.bankConfirmed = true;

                    // 年度スタート残高は固定（78,142円）。
                    // 月ごとの銀行残高を入力しても、年度の基準額は変えない。

                    update();

                });

            });

        }
        function addSpent(index,isOverwrite=false){

            openNumberModal(

                app.budgets[index].name,

                (amount,memo,dateValue)=>{

                    if(amount<=0) return;

                    if(isOverwrite){

                        app.budgets[index].spent = amount;

                    }else{

                        app.budgets[index].spent += amount;

                    }

                    // ATMで確保した現金から使うカテゴリだけ、ATM残高も減らす。
                    const categoryId = app.budgets[index].id;
                    if(
                        categoryId === "food" ||
                        categoryId === "gas" ||
                        categoryId === "holiday"
                    ){
                        app.atm.cashSpent =
                            Number(app.atm.cashSpent || 0) + amount;
                    }

                    app.history.unshift({

                        id: Date.now().toString(),

                        date: formatInputDate(dateValue),

                        category: app.budgets[index].name,

                        amount,

                        memo,

                        annual: false,

                        targetMonth: getTargetMonthFromInputDate(dateValue)

                    });

                    update();

                }

            );

        }
        function addOtherExpense(){

            const otherIndex =
                app.budgets.findIndex(item=>item.id==="other");

            if(otherIndex < 0) return;

            openNumberModal(
                "📦 その他",
                (amount,memo,dateValue)=>{

                    if(amount<=0) return;

                    openPaymentModal(
                        (payment)=>{

                            if(payment === "cash"){

                                const cashBalance =
                                    Number(getAtmPlan().cashBalance || 0);

                                if(amount > cashBalance){
                                    alert(
                                        `ATM残高が足りません。\n現在 ¥${cashBalance.toLocaleString()} です。`
                                    );
                                    return;
                                }

                                app.atm.cashSpent =
                                    Number(app.atm.cashSpent || 0) + amount;

                                app.budgets[otherIndex].spent =
                                    Number(app.budgets[otherIndex].spent || 0) + amount;

                                app.history.unshift({
                                    id:Date.now().toString(),
                                    date:formatInputDate(dateValue),
                                    category:app.budgets[otherIndex].name,
                                    amount,
                                    memo,
                                    payment:"cash",
                                    paymentLabel:"現金",
                                    annual:false,
                                    targetMonth:getTargetMonthFromInputDate(dateValue)
                                });

                            }else{

                                // カードは「使った月」には支出計上しない。
                                // 岩銀ショッピングの締め日に応じて、支払月へ予測を持っていく。
                                const chargeMonth =
                                    getIwaginCardChargeMonth(
                                        dateValue,
                                        "shopping"
                                    );

                                app.history.unshift({
                                    id:Date.now().toString(),
                                    date:formatInputDate(dateValue),
                                    category:app.budgets[otherIndex].name,
                                    amount,
                                    memo,
                                    payment:"card",
                                    paymentLabel:"岩銀カード",
                                    cardType:"shopping",
                                    cardChargeMonth:chargeMonth,
                                    annual:false,
                                    targetMonth:chargeMonth
                                });

                            }

                            update();

                        }
                    );

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

                    drawNewAnnualPage();

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

            const withdrawn =
                Number(
                    app.atm.withdrawn ??
                    app.atm.amount ??
                    0
                );

            // ATMを何回入力しても、今月の累計として扱う。
            const foodCashBudget =
                Number(app.atm.food || 0);

            const gasCashBudget =
                Number(app.atm.gas || 0);

            const holidayBudget =
                Number(
                    app.atm.holidayBudgetTotal ??
                    app.atm.holiday ??
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
                withdrawn,
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

            let directSpent = budgets.reduce((sum,item)=>{

                if(["food","holiday","gas"].includes(item.id)) return sum;
                return sum + Number(item.spent || 0);

            },0);

            const cashOther = (data.history || []).reduce((sum,item)=>{

                if(
                    item.category === "📦 その他" &&
                    item.paymentMethod === "cash"
                ){
                    return sum + Number(item.amount || 0);
                }

                return sum;

            },0);

            directSpent = Math.max(0, directSpent - cashOther);

            const atm = data.atm || {};
            const coop = Number(atm.coop || 0);
            const withdrawn = Number(atm.withdrawn || 0);

            // 生協は独立カテゴリではないが、支出合計には食費として含める。
            return directSpent + coop + withdrawn;

        }

        function getBankForecast(){

            const months = getFiscalMonths();
            const currentIndex = months.indexOf(currentMonth);

            let balance = Number(app.startBank || 0);
            let baseIndex = -1;

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

            for(let i=baseIndex + 1; i<=currentIndex; i++){

                const info = getFiscalMonthInfo(months[i]);
                const data = getMonthData(info.year,info.month);

                if(!data) continue;

                balance += getMonthIncomeTotal(data);
                balance -= getMonthBankOutflow(data);

            }

            return Math.round(balance);

        }

        function getCoachBankReference(){

            const months = getFiscalMonths();
            const currentIndex = Math.max(
                months.indexOf(currentMonth),
                0
            );

            // 今月の銀行残高を入力済みなら今月を使う。
            if(app.bankConfirmed){
                return {
                    month: currentMonth,
                    balance:
                        Number(app.bank.mitake || 0) +
                        Number(app.bank.takizawa || 0),
                    index: currentIndex,
                    isCurrent: true
                };
            }

            // 今月が未入力なら、直前に確定している月を見る。
            // 7月未入力なら6月の銀行残高を使う、という仕様。
            for(let i=currentIndex - 1; i>=0; i--){

                const month = months[i];
                const balance = getKnownBankBalance(month);

                if(balance !== null){
                    return {
                        month,
                        balance: Number(balance),
                        index: i,
                        isCurrent: false
                    };
                }

            }

            // 4月も未入力なら年度開始残高を基準にする。
            return {
                month: 3,
                balance: Number(app.startBank || 78142),
                index: -1,
                isCurrent: false
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
            const bankReference =
                getCoachBankReference();

            const currentBank =
                Number(bankReference.balance || 0);

            const startBank =
                Number(app.startBank || 0);

            const currentSaving =
                Math.max(
                    currentBank - startBank,
                    0
                );

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

            // 基準にした月の次の月から年度末までを「残り月数」にする。
            // 7月未入力で6月残高を使う場合は、7月〜3月の9ヶ月。
            const futureMonths =
                Math.max(
                    months.length -
                    bankReference.index -
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

            const summerActual =
                Number(app.bonus.papaSummerActual || 0) +
                Number(app.bonus.mamaSummerActual || 0);

            const winterActual =
                Number(app.bonus.papaWinterActual || 0) +
                Number(app.bonus.mamaWinterActual || 0);

            const winterForecast =
                Number(app.bonus.papaWinterForecast || 0) +
                Number(app.bonus.mamaWinterForecast || 0);

            // 夏ボーナス実績はまだ銀行残高に入っていない。
            // 「銀行へ」は今後銀行に入る金額として予測へ加える。
            const summerBankFuture =
                Number(app.bonus.summerKeep || 0);

            // 冬ボーナスは未実績なら予測額を全額、
            // 実績があれば銀行へ入れる実績額を使う。
            const winterForForecast =
                winterActual > 0
                    ? Number(app.bonus.winterKeep || 0)
                    : winterForecast;

            const childForecast =
                Number(getRemainingChildAllowance().amount || 0);

            const bonusFuture =
                summerBankFuture +
                winterForForecast +
                childForecast;

            // 年間予測の構成要素を固定：
            // 現在の銀行残高増加 + 夏ボーナス銀行分 + 冬ボーナス + 児童手当
            const annualForecast =
                currentSaving +
                summerBankFuture +
                winterForForecast +
                childForecast;

            /*
               現在の自然な貯金
               ＋ 今後の自然な貯金
               ＋ ボーナス
               ＝ 今のままの年間予測
            */

            // 年間コーチの予測は、
            // 「7月時点で実際に増えた銀行残高」
            // ＋「これから銀行へ入れるボーナス」
            // ＋「これから受け取る児童手当」
            // だけで計算する。
            // 未来の通常月貯金70,000円はここには先に足さない。
            const noBonusForecast =
                currentSaving;

            const withBonusForecast =
                annualForecast;

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

            // 1円未満を残さず、目標を確実に達成できるよう切り上げ。
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
                bankReference,

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

        /* ===========================
           ⑦ AI分析
        =========================== */
        function drawMemo(){

            const memo = document.getElementById("homeMemo");

            if(memo && document.activeElement !== memo){
                memo.value = String(app.memo || "");
            }

            const planEl =
                document.getElementById("holidayPlanHome");

            if(planEl){

                const count =
                    Number(app.atm?.holidayCount || 0);

                const per =
                    Number(app.atm?.holidayPerBudget || 0);

                const remainingCount =
                    getRemainingHolidayCount();

                if(count > 0 && per > 0){

                    planEl.innerHTML =
                        `🎉 休日　あと <strong>${remainingCount}回</strong> × ¥${per.toLocaleString()}（1回）`;

                }else{

                    planEl.innerHTML =
                        "🎉 休日プラン：ATM入力時に設定できます";

                }

            }

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

                // ATM引出は支出ではない。生協は食費として支出に含める。
                spent +=
                    (data.budgets || []).reduce(
                        (sum,item)=>
                            sum + Number(item.spent || 0),
                        0
                    ) + Number(data.atm?.coop || 0);

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

                // 生協は独立カテゴリではなく「食費」として記録する。
                const coop = Number(data.atm?.coop || 0);

                if(coop > 0){

                    const foodName =
                        (data.budgets || []).find(
                            item=>item.id==="food"
                        )?.name || "🍚 食費";

                    list.push({
                        id:`coop-${year}-${month}`,
                        date:data.atm?.date || "",
                        category:foodName,
                        amount:coop,
                        memo:"生協",
                        year,
                        month,
                        coop:true
                    });

                }

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

        <div class="history-row">
        <button
        class="setting-item history-main"
        onclick="editCategoryHistory('${item.id}')">

            <span>
                ${item.date}<br>
                <small>${item.memo || ""}</small>
            </span>

            <span style="font-weight:bold;">
                ¥${Number(item.amount).toLocaleString()}
            </span>

        </button>

        <button
        class="history-delete"
        onclick="deleteCategoryHistory('${item.id}')">
            🗑
        </button>
        </div>
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

        function editCategoryHistory(historyId){

            let found = null;
            let foundData = null;
            let foundBudget = null;

            getFiscalMonths().forEach(month=>{

                if(found) return;

                const year =
                    month <= 3
                        ? currentYear + 1
                        : currentYear;

                const data = getMonthData(year,month);

                if(!data) return;

                const target =
                    (data.history || []).find(
                        item=>item.id===historyId
                    );

                if(target){
                    found = target;
                    foundData = data;
                    foundBudget =
                        (data.budgets || []).find(
                            b=>b.name===target.category
                        );
                }

            });

            if(!found || !foundData) return;

            openNumberModal(
                `${found.category}を編集`,
                (newAmount,newMemo,newDate)=>{

                    newAmount = Number(newAmount || 0);
                    if(newAmount<=0) return;

                    const oldAmount = Number(found.amount || 0);
                    const diff = newAmount - oldAmount;

                    if(foundBudget){

                        foundBudget.spent =
                            Math.max(
                                0,
                                Number(foundBudget.spent || 0) + diff
                            );

                        if(["food","gas","holiday"].includes(foundBudget.id)){

                            foundData.atm =
                                foundData.atm || {};

                            foundData.atm.cashSpent =
                                Math.max(
                                    0,
                                    Number(foundData.atm.cashSpent || 0) + diff
                                );

                        }

                    }

                    found.amount = newAmount;

                    if(newMemo !== undefined){
                        found.memo = newMemo;
                    }

                    if(newDate){
                        found.date = formatInputDate(newDate);
                        found.targetMonth =
                            getTargetMonthFromInputDate(newDate);
                    }

                    localStorage.setItem(
                        getStorageKey(foundData.year,foundData.month),
                        JSON.stringify(foundData)
                    );

                    load();
                    update();

                },
                found.memo || "",
                found.date || "",
                found.amount || 0
            );

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
           新・年間ページ
        =========================== */

        function getFiscalMonthDataForYear(month){
            const year = month <= 3 ? currentYear + 1 : currentYear;
            return getMonthData(year, month);
        }

        function getBankTotalFromMonthData(data){
            if(!data || !data.bank) return null;
            const confirmed = isBankConfirmedData(data);
            if(!confirmed) return null;
            return Number(data.bank.mitake || 0) + Number(data.bank.takizawa || 0);
        }

        function getKnownBankBalance(month){

            // 実際に入力済みの月を最優先。
            // 未入力の過去月だけ、現在の画面で確定している値を表示用の基準として使う。
            const knownBalances = {
                4: 178142,
                5: 151333,
                6: 199620,
                7: 323877
            };

            const info = getFiscalMonthInfo(month);
            const data = getMonthData(info.year, info.month);

            if(isBankConfirmedData(data)){
                return Number(data.bank?.mitake || 0) +
                       Number(data.bank?.takizawa || 0);
            }

            return knownBalances[month] ?? null;
        }

        function getPreviousBankBalance(month){

            // 4月は3月末のスタート残高から計算。
            if(month === 4){
                return Number(app.startBank || 78142);
            }

            const months = getFiscalMonths();
            const index = months.indexOf(month);
            if(index <= 0) return Number(app.startBank || 78142);

            const previousMonth = months[index - 1];
            return getKnownBankBalance(previousMonth);
        }

        function getAnnualBankRows(){

            const months = getFiscalMonths();

            return months.map(month=>{

                const balance = getKnownBankBalance(month);
                const previous = getPreviousBankBalance(month);

                return {
                    month,
                    balance,
                    change: balance === null || previous === null
                        ? null
                        : balance - previous
                };
            });

        }

        function drawAnnualBankTrend(){

            const area = document.getElementById("bankTrendList");
            const diffArea = document.getElementById("bankTrendDifference");
            if(!area || !diffArea) return;

            const rows = getAnnualBankRows();

            area.innerHTML = rows.map(row=>`
                <div class="bank-trend-row">
                    <span class="bank-trend-month">${row.month}月</span>
                    <span class="bank-trend-value">${row.balance === null ? "未入力" : "¥" + row.balance.toLocaleString()}</span>
                    <span class="bank-trend-change ${row.change === null ? "" : row.change >= 0 ? "plus" : "minus"}">
                        ${row.change === null ? "—" : (row.change >= 0 ? "+" : "") + "¥" + row.change.toLocaleString()}
                    </span>
                </div>
            `).join("");

            const april = rows[0];
            const currentIndex = Math.max(
                0,
                rows.findIndex(row=>row.month === currentMonth)
            );
            const current = rows[currentIndex];

            if(april.balance !== null && current.balance !== null){
                const diff = current.balance - Number(app.startBank || 78142);

                diffArea.innerHTML = `
                    4月（${Number(app.startBank || 78142).toLocaleString()}） → ${current.month}月
                    <strong>${diff >= 0 ? "+" : ""}¥${diff.toLocaleString()}</strong>
                `;
                diffArea.className =
                    "bank-trend-difference " + (diff >= 0 ? "plus" : "minus");
            }else{
                diffArea.textContent = "今月の銀行残高を入力すると差額を表示";
                diffArea.className = "bank-trend-difference";
            }
        }

        function drawAnnualBonus(){

            const area = document.getElementById("annualBonus");
            if(!area) return;

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

            const row = (label, forecast, actual, keep) => {

                const hasActual = actual > 0;
                const value = hasActual ? actual : forecast;

                return `
                    <div class="bonus-row">
                        <div>
                            <div class="bonus-label">${label}</div>
                            <div class="${hasActual ? "bonus-actual" : "bonus-forecast"}">
                                ${hasActual ? "実績" : "予測"}
                            </div>
                            ${hasActual ? `
                                <div class="bonus-bank-save">
                                    🏦 銀行へ ¥${Number(keep || 0).toLocaleString()}
                                </div>
                            ` : ""}
                        </div>
                        <div class="bonus-value">¥${value.toLocaleString()}</div>
                    </div>
                `;
            };

            area.innerHTML =
                row("🌻 夏", summerForecast, summerActual, app.bonus.summerKeep) +
                row("⛄ 冬", winterForecast, winterActual, app.bonus.winterKeep);
        }

        function getRemainingChildAllowance(){
            // 児童手当は偶数月。現在月より後の偶数月を数える。
            const months = getFiscalMonths();
            const currentIndex = Math.max(months.indexOf(currentMonth), 0);
            const futureMonths = months.slice(currentIndex + 1);
            const count = futureMonths.filter(m => m % 2 === 0).length;
            return {
                count,
                // 1回 = 10,000円 × 2か月 × 2人 = 40,000円
                amount: count * 10000 * 2 * 2
            };
        }

        function getAnnualCoachDetail(){
            const annual = getAnnualCoachData();
            const bonusActual =
                Number(app.bonus.papaSummerActual || 0) +
                Number(app.bonus.mamaSummerActual || 0) +
                Number(app.bonus.papaWinterActual || 0) +
                Number(app.bonus.mamaWinterActual || 0);

            const summerActual =
                Number(app.bonus.papaSummerActual || 0) +
                Number(app.bonus.mamaSummerActual || 0);
            const winterActual =
                Number(app.bonus.papaWinterActual || 0) +
                Number(app.bonus.mamaWinterActual || 0);

            const bankKeep =
                Number(app.bonus.summerKeep || 0) +
                Number(app.bonus.winterKeep || 0);

            const winterForecast =
                Number(app.bonus.papaWinterForecast || 0) +
                Number(app.bonus.mamaWinterForecast || 0);

            const winterBonusForForecast =
                winterActual > 0
                    ? Number(app.bonus.winterKeep || 0)
                    : winterForecast;

            const child = getRemainingChildAllowance();
            const currentSaving = Math.max(Number(annual.currentSaving || 0), 0);
            // 目標から、すでに確保できているものを引く。
            // ・現在までの銀行残高の増加
            // ・冬ボーナスは未実績なら予測額を全額入れる
            // ・今後の児童手当（1回2万円）
            const summerBankKeep =
                Number(app.bonus.summerKeep || 0);

            const remaining = Math.max(
                Number(app.goal || 0)
                - currentSaving
                - summerBankKeep
                - winterBonusForForecast
                - child.amount,
                0
            );

            const monthsLeft = Math.max(Number(annual.futureMonths || 0), 0);
            const monthlyNeed = monthsLeft > 0
                ? Math.ceil(remaining / monthsLeft)
                : remaining;
            const natural = Number(annual.naturalMonthly || 70000);
            const extraNeed = Math.max(monthlyNeed - natural, 0);

            return {
                annual, bonusActual, summerActual, winterActual,
                bankKeep, summerBankKeep, winterForecast, winterBonusForForecast, child,
                currentSaving, remaining, monthsLeft, monthlyNeed, natural, extraNeed
            };
        }

        function drawAnnualCoach(){

            const area = document.getElementById("annualCoach");
            if(!area) return;

            const annual = getAnnualCoachData();
            const detail = getAnnualCoachDetail();
            const forecast = Number(annual.withBonusForecast || 0);
            const goal = Number(annual.goal || 0);
            const gap = Math.max(goal - forecast, 0);

            area.innerHTML = `
                <button class="annual-coach-toggle" type="button" onclick="toggleAnnualCoachDetail()">
                    <span>${annual.statusText}</span><span>›</span>
                </button>
                <div class="annual-coach-numbers">
                    <span>🎯 ¥${goal.toLocaleString()}</span>
                    <span>🔮 予測 ¥${forecast.toLocaleString()}</span>
                    <span>${gap > 0 ? `あと ¥${gap.toLocaleString()}` : "達成ペース"}</span>
                </div>
                <div id="annualCoachDetail" class="annual-coach-detail" style="display:none;">
                    <div>🎯 目標　¥${goal.toLocaleString()}</div>
                    <div>🎁 ボーナス実績　¥${detail.bonusActual.toLocaleString()}</div>
                    <div>⛄ 冬ボーナス予測　¥${detail.winterForecast.toLocaleString()}</div>
                    <div>🏦 夏ボーナスから銀行へ　¥${detail.bankKeep.toLocaleString()}</div>
                    <div>🏦 銀行残高の増加 ${detail.annual.bankReference.month}月時点　¥${detail.currentSaving.toLocaleString()}</div>
                    <div>👶 児童手当あと${detail.child.count}回　¥${detail.child.amount.toLocaleString()}（1回¥40,000・偶数月）</div>
                    <div class="coach-remaining">残り　¥${detail.remaining.toLocaleString()}</div>
                    <div>¥${detail.remaining.toLocaleString()} ÷ ${detail.monthsLeft}ヶ月 ＝ 1ヶ月 ¥${detail.monthlyNeed.toLocaleString()}の貯金が必要</div>
                    <div>そのためには${detail.extraNeed > 0 ? `月 ¥${detail.extraNeed.toLocaleString()}を追加で節約` : "今のペースでOK"}</div>
                </div>
            `;
        }

        function toggleAnnualCoachDetail(){
            const detail = document.getElementById("annualCoachDetail");
            if(!detail) return;
            detail.style.display = detail.style.display === "none" ? "grid" : "none";
        }

        function drawNewAnnualPage(){
            drawAnnualCoach();
            drawAnnualBankTrend();
            drawAnnualBonus();
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
            "%c🌸 まる家計 Ver43",
            "color:#4CAF50;font-size:16px;font-weight:bold;"
        );

        console.log({

            version:"43.0",

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

        function getTodayInputDate(){

            const now = new Date();

            const y = now.getFullYear();
            const m = String(now.getMonth()+1).padStart(2,"0");
            const d = String(now.getDate()).padStart(2,"0");

            return `${y}-${m}-${d}`;

        }

        function formatInputDate(dateValue){

            if(!dateValue) return getTodayInputDate();

            const parts = String(dateValue).split("-");

            if(parts.length !== 3) return getTodayInputDate();

            return `${parts[0]}/${parts[1]}/${parts[2]}`;

        }

        function getTargetMonthFromInputDate(dateValue){

            if(!dateValue) return `${getDisplayYear()}-${String(currentMonth).padStart(2,"0")}`;

            const parts = String(dateValue).split("-");

            if(parts.length !== 3) return `${getDisplayYear()}-${String(currentMonth).padStart(2,"0")}`;

            return `${parts[0]}-${parts[1]}`;

        }

        let paymentCallback = null;

        function openPaymentModal(callback){

            paymentCallback = callback;

            document.getElementById("paymentModal").style.display =
                "flex";

        }

        function closePaymentModal(){

            document.getElementById("paymentModal").style.display =
                "none";

            paymentCallback = null;

        }

        document.getElementById("paymentCash").onclick = ()=>{

            const callback = paymentCallback;

            closePaymentModal();

            if(callback){
                callback("cash");
            }

        };

        document.getElementById("paymentCard").onclick = ()=>{

            const callback = paymentCallback;

            closePaymentModal();

            if(callback){
                callback("card");
            }

        };

        document.getElementById("paymentCancel").onclick =
            closePaymentModal;

        function openNumberModal(title,callback,initialMemo="",initialDate="",initialAmount=null){

            numberValue =
                initialAmount !== null
                    ? String(initialAmount)
                    : "";

            document.getElementById("numberMemo").value =
                String(initialMemo || "");

            const dateInput = document.getElementById("numberDate");

            if(dateInput){
                dateInput.value =
                    initialDate
                        ? String(initialDate).replaceAll("/","-")
                        : getTodayInputDate();
            }

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

        const dateValue =
            document.getElementById("numberDate")?.value
            || getTodayInputDate();

        closeNumberModal();

        if(numberCallback){

            numberCallback(
                value,
                memo,
                dateValue
            );

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

/* まる家計 v46｜現金3カード最終修正
最新の maru-kakei_v45_app.js.txt の一番下に追加 */

function drawCategories(){
    const grid=document.getElementById("gridArea");
    if(!grid) return;

    const cashIds=["food","holiday","gas"];

    app.budgets.forEach((item,index)=>{
        if(cashIds.includes(item.id)) return;

        const used=Number(item.spent||0);
        let extra="";

        if(item.id==="iwagin"){
            const forecast=getIwaginCardForecast();
            const fixed=getFixedIwaginTotal();
            extra=`<div class="card-forecast-line">
                固定 ¥${fixed.toLocaleString()}
                ${forecast>0?`｜次回カード予測 <span class="card-forecast">¥${forecast.toLocaleString()}</span>`:""}
            </div>`;
        }

        grid.innerHTML+=`
            <button class="input-card"
                onclick="${item.id==="other"?"addOtherExpense()":`addSpent(${index},${item.id==="iwagin"||item.id==="rakuten"})`}">
                <span class="input-name">${item.name}</span>
                <span class="input-left ${used>Number(item.budget||0)?"over":""}">
                    ¥${used.toLocaleString()}
                </span>
                ${extra}
            </button>`;
    });

    const food=app.budgets.find(x=>x.id==="food");
    const holiday=app.budgets.find(x=>x.id==="holiday");
    const gas=app.budgets.find(x=>x.id==="gas");

    const coop=Number(app.atm?.coop||0);
    const plannedFood=getFoodPlannedTotal();

    const foodBudget=Number(food?.budget||80000);
    const foodUsed=Number(food?.spent||0)+coop;
    const foodRemaining=Math.max(foodBudget-foodUsed-plannedFood,0);

    const foodDays=Number(app.atm?.foodDays||0);
    const foodDaily=foodDays>0?Math.floor(foodRemaining/foodDays):0;

    const holidayBudget=Number(app.atm?.holidayBudgetTotal??holiday?.budget??40000);
    const holidayUsed=Number(holiday?.spent||0);
    const holidayRemaining=Math.max(holidayBudget-holidayUsed,0);
    const holidayCount=Number(app.atm?.holidayCount||0);
    const holidayRemainingCount=Math.max(
        holidayCount-getDistinctHolidaySpendDays(),0
    );
    const holidayPer=Number(app.atm?.holidayPerBudget||0);

    const gasBudget=Number(gas?.budget||17000);
    const gasUsed=Number(gas?.spent||0);
    const gasRemaining=Math.max(gasBudget-gasUsed,0);

    const foodIndex=app.budgets.findIndex(x=>x.id==="food");
    const holidayIndex=app.budgets.findIndex(x=>x.id==="holiday");
    const gasIndex=app.budgets.findIndex(x=>x.id==="gas");

    const plannedList=(app.foodPlanned||[]).map(item=>`
        <div class="cash-budget-plan-item">
            <span>${escapeHtml(item.name)}</span>
            <span>¥${Number(item.amount||0).toLocaleString()}
                <button type="button"
                    onclick="event.stopPropagation();deleteFoodPlanned('${String(item.id).replaceAll("'","\\'")}')">×</button>
            </span>
        </div>`).join("");

    grid.innerHTML+=`
        <div class="cash-budget-section">
            <div class="cash-budget-title">💰 現金で管理</div>

            <div class="cash-budget-grid">

                <div class="cash-budget-card food-budget-card">
                    <button type="button" class="cash-budget-main"
                        onclick="addSpent(${foodIndex},false)">
                        <div class="cash-budget-name">🍚 食費</div>
                        <div class="cash-budget-numbers">
                            <span>現在 ¥${foodUsed.toLocaleString()}</span>
                            <strong>あと ¥${foodRemaining.toLocaleString()}</strong>
                        </div>
                    </button>

                    <div class="cash-budget-planned">
                        <span>この先使うお金</span>
                        <strong>¥${plannedFood.toLocaleString()}</strong>
                    </div>

                    <button type="button" class="cash-budget-plan-button"
                        onclick="event.stopPropagation();addFoodPlanned()">
                        ＋ この先の予定を追加
                    </button>

                    ${plannedList?`<div class="cash-budget-plan-list">${plannedList}</div>`:""}

                    <div class="cash-budget-food-days">
                        ${foodDays>0
                            ?`1日あと <strong>¥${foodDaily.toLocaleString()}</strong>（残り${foodDays}日）`
                            :"🗓 食費の日数はATM入力で設定"}
                    </div>
                </div>

                <button type="button" class="cash-budget-card"
                    onclick="addSpent(${holidayIndex},false)">
                    <div class="cash-budget-name">🎉 休日</div>
                    <div class="cash-budget-numbers">
                        <span>現在 ¥${holidayUsed.toLocaleString()}</span>
                        <strong>あと ¥${holidayRemaining.toLocaleString()}</strong>
                    </div>
                    <div class="cash-budget-food-days">
                        ${holidayCount>0
                            ?`あと ${holidayRemainingCount}回${holidayPer>0?`｜1回 ¥${holidayPer.toLocaleString()}`:""}`
                            :"🗓 回数・1回予算はATM入力で設定"}
                    </div>
                </button>

                <button type="button" class="cash-budget-card"
                    onclick="addSpent(${gasIndex},false)">
                    <div class="cash-budget-name">⛽ ガソリン</div>
                    <div class="cash-budget-numbers">
                        <span>現在 ¥${gasUsed.toLocaleString()}</span>
                        <strong>あと ¥${gasRemaining.toLocaleString()}</strong>
                    </div>
                </button>

            </div>
        </div>`;
}

/* 既存データとの互換 */
const _v46_update_original=update;
function update(){
    app.atm=app.atm||{};
    if(app.atm.foodFuture===undefined) app.atm.foodFuture=0;
    _v46_update_original();
}
