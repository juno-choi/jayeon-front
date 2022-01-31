const reqeustUrl = 'http://localhost:8080';

let orders;
$(document).ready(async function (){
    await getOrders();
    makeTable();
});

//order 정보 비동기 불러오기
async function getOrders(){
    await axios.get(reqeustUrl+'/v1/orders',{}
    ).then(function(res){
        orders = res.data.data;
    }).catch(function(err){
        alert('정보 불러오기 실패');
    });
}

//table 정보 만들기
function makeTable(){
    const tbody = document.getElementById('orderList').querySelector('tbody');

    orders.forEach((order)=>{
        const tr = document.createElement('tr');

        const no = document.createElement('td');
        no.innerText = order.idx;
        const date = document.createElement('td');
        date.innerText = order.regDate;
        const item = document.createElement('td');
        const itemList = order.itemList;
        const itemName = itemList[0].item;
        const kg = itemList[0].kg + 'kg';
        const optionName = itemList[0].option;
        const ea = itemList[0].ea;
        let itemText = itemName + ' ' + kg + ' '+ optionName + '('+ ea +')';
        const itemListLength = itemList.length;
        if(itemListLength > 1){
            const length = itemListLength - 1;
            itemText += ' 외 '+length;
        }
        const itemA = document.createElement('a');
        itemA.addEventListener('click', function(){alert('실행');});
        itemA.href = "#";
        itemA.innerText = itemText;
        item.appendChild(itemA);

        const status = document.createElement('td');
        status.innerText = order.status;
        const buyer = document.createElement('td');
        buyer.innerText = order.buyer;
        const price = document.createElement('td');
        price.innerText = order.price;

        tr.appendChild(no);
        tr.appendChild(date);
        tr.appendChild(item);
        tr.appendChild(status);
        tr.appendChild(buyer);
        tr.appendChild(price);
        tbody.appendChild(tr);
    });
}
