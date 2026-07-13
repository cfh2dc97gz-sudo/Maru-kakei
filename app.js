*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif;
    background:#f4f7f5;
    color:#222;
    padding:16px;
}

h1{
    text-align:center;
    font-size:30px;
    font-weight:800;
    color:#2e7d32;
    margin-bottom:22px;
}

h2{
    font-size:20px;
    margin-bottom:14px;
    color:#444;
}

.card{
    background:#fff;
    border-radius:26px;
    padding:22px;
    margin-bottom:18px;
    box-shadow:0 8px 24px rgba(0,0,0,.06);
}

.money{
    font-size:36px;
    font-weight:800;
    color:#1b5e20;
}

button{
    border:none;
    background:#4caf50;
    color:#fff;
    border-radius:16px;
    cursor:pointer;
    transition:.15s;
}

button:active{
    transform:scale(.98);
}

#foodArea{
    margin-bottom:18px;
}

#gridArea{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:14px;
}
/* ---------- カテゴリカード ---------- */

.input-card{
    background:#fff;
    border:none;
    border-radius:24px;
    padding:18px;
    display:flex;
    flex-direction:column;
    box-shadow:0 4px 14px rgba(0,0,0,.07);
    transition:.15s;
    cursor:pointer;
}

.input-card:active{
    transform:scale(.98);
}


.food-card{

    background:#ffffff;
    border-radius:28px;
    padding:24px;
    min-height:360px;

}

.small-card{
    min-height:150px;
}

.input-name{

    display:flex;
    align-items:center;
    gap:8px;

    font-size:26px;
    font-weight:700;
    color:#222;

    margin-bottom:16px;

}

.input-used{
    display:none;
}

.input-left{
    background:#eef8ea;
    color:#2e7d32;
    border-radius:16px;
    padding:14px;
    text-align:center;
    font-size:22px;
    font-weight:700;
    margin-bottom:16px;
}

.over{
    color:#d32f2f;
}
/* ---------- 履歴 ---------- */

.mini-history{

    padding:14px 0;

}

.history-memo{

    font-size:18px;
    font-weight:700;

}

.mini-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    color:#888;
    font-size:13px;
}

.mini-row b{
    color:#2e7d32;
    font-size:15px;
}

/* ---------- 収入ボタン ---------- */

.income-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:12px;
    margin-top:14px;
}

.income-grid button{
    height:64px;
    font-size:15px;
    font-weight:700;
    border-radius:16px;
}

/* ---------- 共通 ---------- */

p{
    line-height:1.8;
}

small{
    color:#999;
}

#forecast{
    margin-top:8px;
    color:#666;
}

#advice,
#aiMessage{
    margin-top:8px;
    line-height:1.7;
}

@media (max-width:480px){

    body{
        padding:14px;
    }

    .card{
        padding:16px;
    }

    .money{
        font-size:30px;
    }

    .food-card{
        min-height:340px;
    }

    .small-card{

    min-height:135px;
    padding:16px;

}

    .input-name{
        font-size:22px;
    }

    .input-left{
        font-size:20px;
    }

}
/* ===== Ver6 ===== */

.food-card{

    background:linear-gradient(
        to bottom,
        #f2fbf3 0%,
        #f2fbf3 110px,
        #ffffff 110px
    );

}

.food-card .input-name{

    font-size:30px;
    color:#222;
    margin-bottom:20px;

}

.food-card .input-left{

    display:flex;
    flex-direction:column;
    align-items:center;

    background:#eef8ea;

    color:#2e7d32;

    border-radius:20px;

    padding:18px;

    margin-bottom:22px;

    font-size:32px;

    font-weight:800;

}
.small-card .input-name{

    font-size:19px;
    margin-bottom:10px;

}

.small-card .input-left{

    background:#f4faf4;
    color:#2e7d32;
    border-radius:14px;
    padding:10px;
    font-size:17px;
    margin-bottom:0;

}

.mini-history:first-of-type{

    border-top:none;

}

.mini-history:last-child{

    padding-bottom:0;

}

.mini-row{

    margin-top:6px;

}

.history-memo{

    font-size:17px;

}
