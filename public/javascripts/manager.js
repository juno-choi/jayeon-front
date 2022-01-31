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
        console.log(order);
        const tr = document.createElement('tr');

        const no = document.createElement('td');
        no.innerText = order.idx;
        const date = document.createElement('td');
        date.innerText = order.regDate;
        const item = document.createElement('td');
        item.innerText = '주문 상품 정보';
        const itemDetail = document.createElement('td');
        itemDetail.innerText = '한박스 두박스 등'
        const status = document.createElement('td');
        status.innerText = order.status;
        const buyer = document.createElement('td');
        buyer.innerText = order.buyer;
        const price = document.createElement('td');
        price.innerText = order.price;

        tr.appendChild(no);
        tr.appendChild(date);
        tr.appendChild(item);
        tr.appendChild(itemDetail);
        tr.appendChild(status);
        tr.appendChild(buyer);
        tr.appendChild(price);
        tbody.appendChild(tr);
    });
}
