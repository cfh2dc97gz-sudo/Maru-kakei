let monthlyBudget = 150000;
let spent = 0;

function update() {
    document.getElementById("spent").textContent = "¥" + spent.toLocaleString();

    const remain = monthlyBudget - spent;
    document.getElementById("remain").textContent = "¥" + remain.toLocaleString();

    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth()+1,0).getDate();
    const daysLeft = lastDay - today.getDate() + 1;

    const daily = Math.floor(remain / daysLeft);

    document.getElementById("daily").textContent =
        "今日あと ¥" + daily.toLocaleString() + " 使えます";
}

function addExpense(){
    const amount = prompt("支出を入力（円）");

    if(amount && !isNaN(amount)){
        spent += Number(amount);
        update();
    }
}

update();
