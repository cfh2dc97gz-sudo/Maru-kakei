let monthlyBudget = 320000;
const budgets = [

    { name: "🏠 家賃", budget: 91000, spent: 0 },

    { name: "💡 電気・水道", budget: 32000, spent: 0 },

    { name: "🏦 岩銀", budget: 40000, spent: 0 },

    { name: "💳 楽天", budget: 20000, spent: 0 },

    { name: "🎉 休日", budget: 40000, spent: 0 },

    { name: "🍚 食費", budget: 80000, spent: 0 },

    { name: "⛽ ガソリン", budget: 17000, spent: 0 }

];

let spent = 0;

function update() {
    document.getElementById("spent").textContent = "¥" + spent.toLocaleString();

    const remain = monthlyBudget - spent;
    document.getElementById("remain").textContent = "¥" + remain.toLocaleString();

    const today = new Date();

    // 25日〜24日で計算
    let end;

    if (today.getDate() >= 25) {
        end = new Date(today.getFullYear(), today.getMonth() + 1, 24);
    } else {
        end = new Date(today.getFullYear(), today.getMonth(), 24);
    }

    const daysLeft =
        Math.ceil((end - today) / (1000 * 60 * 60 * 24)) + 1;

    const daily = Math.floor(remain / daysLeft);

    document.getElementById("daily").textContent =
        "今日あと ¥" + daily.toLocaleString() + " 使えます";
const list = document.getElementById("budgetList");

list.innerHTML = "";

budgets.forEach(item => {

    const color = item.spent > item.budget ? "red" : "black";

    list.innerHTML += `
        <p style="color:${color};font-size:20px;">
            ${item.name}<br>
            ¥${item.spent.toLocaleString()} / ¥${item.budget.toLocaleString()}
        </p>
    `;
});}

function addExpense() {

    const amount = prompt("金額");

    if (!amount) return;

    spent += Number(amount);

    update();

}
