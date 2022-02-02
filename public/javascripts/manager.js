const reqeustUrl = 'http://localhost:8080';
const orderStatus = {
    'BEFORE' : '입금전',
    'DEPOSIT' : '결제완료',
    'COMPLETE' : '배송완료'
}
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
        const orderIdx = order.idx;
        const orderStatusValue = order.status;
        const orderStatusText = orderStatus[orderStatusValue];

        const no = document.createElement('td');
        no.innerText = orderIdx;
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
        itemA.addEventListener('click', openOrderDetailModal);
        itemA.href = "#";
        itemA.innerText = itemText;
        itemA.setAttribute('data-no', orderIdx);
        item.appendChild(itemA);

        const status = document.createElement('td');
        status.innerText = orderStatusText;
        const buyer = document.createElement('td');
        buyer.innerText = order.buyer;
        const price = document.createElement('td');
        price.innerText = order.price.toLocaleString();

        const btnTd = document.createElement('td');
        const manageBtn = document.createElement('button');
        manageBtn.type = 'button';
        manageBtn.setAttribute('class','btn btn-sm btn-primary');
        manageBtn.setAttribute('data-idx', orderIdx);
        manageBtn.setAttribute('data-status', orderStatusValue);
        manageBtn.addEventListener('click', changeStatus);
        manageBtn.innerText = '상태변경';
        btnTd.appendChild(manageBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.setAttribute('class','btn btn-sm btn-danger');
        cancelBtn.addEventListener('click', deleteOrder);
        cancelBtn.setAttribute('data-idx', orderIdx);
        cancelBtn.innerText = '삭제';
        btnTd.appendChild(cancelBtn);

        tr.appendChild(no);
        tr.appendChild(date);
        tr.appendChild(item);
        tr.appendChild(status);
        tr.appendChild(buyer);
        tr.appendChild(price);
        tr.appendChild(btnTd);
        tbody.appendChild(tr);
    });
}

//주문 상세 modal
function openOrderDetailModal(){
    const orderIdx = this.dataset.no;
    const items = orders.filter((obj)=>{
        return obj.idx == orderIdx;
    });
    const item = items[0];
    console.log(item);
    const itemList = item.itemList;

    const modal = document.getElementById('orderDetailModal');
    const goodsList = modal.querySelector('#goodsList');
    goodsList.innerHTML = '';
    itemList.forEach((obj)=>{
        const row = document.createElement('div');
        row.setAttribute('class', 'row');

        const item = document.createElement('input');
        item.setAttribute('class','form-control col-lg-2 ml-1 mr-1 mt-1');
        item.setAttribute('disabled','');
        item.value = obj.item;
        const option = document.createElement('input');
        option.setAttribute('class','form-control col-lg-2 ml-1 mr-1 mt-1');
        option.setAttribute('disabled','');
        option.value = obj.option;
        const kg = document.createElement('input');
        kg.setAttribute('class','form-control col-lg-2 ml-1 mr-1 mt-1');
        kg.setAttribute('disabled','');
        kg.value = obj.kg;
        const ea = document.createElement('input');
        ea.setAttribute('class','form-control col-lg-2 ml-1 mr-1 mt-1');
        ea.setAttribute('disabled','');
        ea.value = obj.ea;
        const price = document.createElement('input');
        price.setAttribute('class','form-control col-lg-2 ml-1 mr-1 mt-1');
        price.setAttribute('disabled','');
        price.value = obj.price.toLocaleString();

        row.appendChild(item);
        row.appendChild(option);
        row.appendChild(kg);
        row.appendChild(ea);
        row.appendChild(price);
        goodsList.appendChild(row);
    });

    modal.querySelector('input[name=buyer]').value = item.buyer;
    modal.querySelector('input[name=recipient]').value = item.recipient;
    modal.querySelector('input[name=tel1]').value = item.tel1;
    modal.querySelector('input[name=tel2]').value = item.tel2;
    modal.querySelector('input[name=tel3]').value = item.tel3;
    modal.querySelector('input[name=post1]').value = item.post1;
    modal.querySelector('input[name=post2]').value = item.post2;
    modal.querySelector('input[name=post3]').value = item.post3;
    modal.querySelector('textarea[name=request]').innerText = item.request;

    $('#orderDetailModal').modal();
}

//삭제 버튼
function deleteOrder(){
    const idx = this.dataset.idx;

    if(confirm("현재 주문을 삭제하시겠습니까? 주문번호 = "+idx)){
        deleteOrderAjax(idx);
    }
}
//주문 삭제 ajax
function deleteOrderAjax(idx){
    axios.delete(reqeustUrl+'/v1/orders/'+idx,{
    }).then((res)=>{
        const data = res.data.data;
        const idx = data.order_idx;
        alert('주문번호 = '+idx + '의 결제가 정상적으로 삭제되었습니다.');
        location.reload();
    }).catch((err)=>{
        alert('실패');
    });
}

//상태변경 버튼
function changeStatus(){
    const idx = this.dataset.idx;
    const status = this.dataset.status;

    if(status == 'COMPLETE'){
        alert('더이상 상태 값을 변경할 수 없습니다.');
        return;
    }

    if(confirm("현재 주문의 상태를 변경하시겠습니까?")){
        changeStatusAjax(idx, status);
    }
}
//주문 상태 변경 ajax
function changeStatusAjax(idx, status){
    axios.put(reqeustUrl+'/v1/orders/status',{
        idx : idx,
        orderStatus : status
    }).then((res)=>{
        const data = res.data.data;
        const idx = data.order_idx;
        alert('주문번호 = '+idx + '의 결제 상태가 정상적으로 변경되었습니다.');
        location.reload();
    }).catch((err)=>{
        alert('실패');
    });
}

