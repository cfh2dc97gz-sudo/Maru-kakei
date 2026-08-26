まる家計 v45 修正｜JS

① app の ATM 初期値に foodFuture を追加

atm:{
  amount:0,
  coop:0,
  food:0,
  gas:0,
  holiday:0,
  foodFuture:0,
  date:null
}


② drawCategories() 内の「現金で管理」の表示部分を、
以下の処理に置き換えてください。

const food = app.budgets.find(item => item.id === "food");
const holiday = app.budgets.find(item => item.id === "holiday");
const gas = app.budgets.find(item => item.id === "gas");

const coop = Number(app.atm?.coop || 0);
const foodFuture = Number(app.atm?.foodFuture || 0);

const foodBudget = Number(food?.budget || 80000);
const foodUsed = Number(food?.spent || 0) + coop;
const foodRemaining = Math.max(foodBudget - foodUsed - foodFuture, 0);

const foodDays = Number(app.atm?.foodDays || 0);
const foodDaily = foodDays > 0
  ? Math.floor(foodRemaining / foodDays)
  : 0;

const holidayBudget = Number(
  app.atm?.holidayBudgetTotal ??
  holiday?.budget ??
  40000
);

const holidayUsed = Number(holiday?.spent || 0);
const holidayRemaining = Math.max(
  holidayBudget - holidayUsed,
  0
);

const holidayCount = Number(app.atm?.holidayCount || 0);
const holidayUsedCount =
  typeof getDistinctHolidaySpendDays === "function"
    ? getDistinctHolidaySpendDays()
    : 0;

const holidayRemainingCount = Math.max(
  holidayCount - holidayUsedCount,
  0
);

const holidayPerBudget =
  Number(app.atm?.holidayPerBudget || 0);

const gasBudget = Number(gas?.budget || 17000);
const gasUsed = Number(gas?.spent || 0);
const gasRemaining = Math.max(
  gasBudget - gasUsed,
  0
);


③ HTMLへ数字を流し込む処理

const foodCurrentEl =
  document.getElementById("cashFoodCurrent");

const foodRemainingEl =
  document.getElementById("cashFoodRemaining");

const foodDaysEl =
  document.getElementById("cashFoodDays");

const holidayCurrentEl =
  document.getElementById("cashHolidayCurrent");

const holidayRemainingEl =
  document.getElementById("cashHolidayRemaining");

const holidayCountEl =
  document.getElementById("cashHolidayCount");

const holidayPerEl =
  document.getElementById("cashHolidayPer");

const gasCurrentEl =
  document.getElementById("cashGasCurrent");

const gasRemainingEl =
  document.getElementById("cashGasRemaining");

if(foodCurrentEl)
  foodCurrentEl.textContent =
    `現在 ¥${foodUsed.toLocaleString()}`;

if(foodRemainingEl)
  foodRemainingEl.textContent =
    `あと ¥${foodRemaining.toLocaleString()}`;

if(foodDaysEl){
  foodDaysEl.textContent =
    foodDays > 0
      ? `残り${foodDays}日 → 1日 ¥${foodDaily.toLocaleString()}`
      : "食費の日数を設定してください";
}

if(holidayCurrentEl)
  holidayCurrentEl.textContent =
    `現在 ¥${holidayUsed.toLocaleString()}`;

if(holidayRemainingEl)
  holidayRemainingEl.textContent =
    `あと ¥${holidayRemaining.toLocaleString()}`;

if(holidayCountEl)
  holidayCountEl.textContent =
    `あと ${holidayRemainingCount}回`;

if(holidayPerEl)
  holidayPerEl.textContent =
    `1回 ¥${holidayPerBudget.toLocaleString()}`;

if(gasCurrentEl)
  gasCurrentEl.textContent =
    `現在 ¥${gasUsed.toLocaleString()}`;

if(gasRemainingEl)
  gasRemainingEl.textContent =
    `あと ¥${gasRemaining.toLocaleString()}`;


④ 食費「＋ この先使う」

function openFoodFuture(){

  const current =
    Number(app.atm?.foodFuture || 0);

  openNumberModal(
    "🍚 食費｜この先使うお金",
    (amount)=>{

      amount = Math.max(
        Number(amount || 0),
        0
      );

      app.atm = app.atm || {};
      app.atm.foodFuture = amount;

      save();
      update();
    },
    "",
    "",
    current
  );
}
