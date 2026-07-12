let monthlyBudget = 320000;
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
}

function addExpense() {

    const amount = prompt("金額");

    if (!amount) return;

    spent += Number(amount);

    update();

}

update();
