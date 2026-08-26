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
