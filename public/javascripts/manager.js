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
        manageBtn.setAttribute('class','btn btn-primary');
        manageBtn.setAttribute('data-idx', orderIdx);
        manageBtn.setAttribute('data-status', orderStatusValue);
        manageBtn.addEventListener('click', changeStatus);
        manageBtn.innerText = '상태변경';
        btnTd.appendChild(manageBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.setAttribute('class','btn btn-danger');
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
    modal.querySelector('input[name=buyerTel1]').value = item.buyerTel1;
    modal.querySelector('input[name=buyerTel2]').value = item.buyerTel2;
    modal.querySelector('input[name=buyerTel3]').value = item.buyerTel3;
    modal.querySelector('input[name=recipient]').value = item.recipient;
    modal.querySelector('input[name=recipientTel1]').value = item.recipientTel1;
    modal.querySelector('input[name=recipientTel2]').value = item.recipientTel2;
    modal.querySelector('input[name=recipientTel3]').value = item.recipientTel3;
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


function s2ab(s) {
    const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    const view = new Uint8Array(buf);  //create uint8array as viewer
    for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}

function deliveryExcel(){
    // step 1. workbook 생성
    const wb = XLSX.utils.book_new();

    // step 2. 시트 만들기
    const newWorksheet = deliveryExcelHandler.getWorksheet();

    // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.
    XLSX.utils.book_append_sheet(wb, newWorksheet, deliveryExcelHandler.getSheetName());

    // step 4. 엑셀 파일 만들기
    const wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

    // step 5. 엑셀 파일 내보내기
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), deliveryExcelHandler.getExcelFileName());
}

const deliveryExcelHandler = {
    getExcelFileName : function(){
        return '배송.xlsx';
    },
    getSheetName : function(){
        return '배송';
    },
    getExcelData : function(){
        const result = [];
        const row = [];
        row.push('날짜');
        row.push('수령자');
        row.push('수령인 연락처');
        row.push('상품');
        row.push('kg');
        row.push('개수');
        row.push('주소');
        row.push('보내는 사람');
        row.push('보내는 사람 연락처');
        row.push('요청사항');
        result.push(row);

        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth()+1);
        const monthValue = (month<10) ? '0'+month : month;
        const dateValue = (date.getDate()<10) ? '0'+date.getDate() : date.getDate();
        const dateText = year+'-'+monthValue+'-'+ dateValue;
        orders.forEach((order)=>{
            const buyer = order.buyer;
            const buyerTel1 = order.buyerTel1;
            const buyerTel2 = order.buyerTel2;
            const buyerTel3 = order.buyerTel3;
            const recipient = order.recipient;
            const recipientTel1 = order.recipientTel1;
            const recipientTel2 = order.recipientTel2;
            const recipientTel3 = order.recipientTel3;
            const post1 = order.post1;
            const post2 = order.post2;
            const post3 = order.post3;
            const request = order.request;
            const itemList = order.itemList;
            itemList.forEach((item)=>{
                const data = [];
                data.push(dateText);
                data.push(recipient);
                data.push(recipientTel1+'-'+recipientTel2+'-'+recipientTel3);
                data.push('[' + item.item + '] ' + item.option);
                data.push(item.kg);
                data.push(item.ea);
                data.push(post2+' '+post3);
                data.push(buyer);
                data.push(buyerTel1+'-'+buyerTel2+'-'+buyerTel3);
                data.push(request);
                result.push(data);
            });
        });

        return result;
    },
    getWorksheet : function(){
        return XLSX.utils.aoa_to_sheet(this.getExcelData());
    }
}

function saleExcel(){
    // step 1. workbook 생성
    const wb = XLSX.utils.book_new();

    // step 2. 시트 만들기
    const newWorksheet = saleExcelHandler.getWorksheet();

    // step 3. workbook에 새로만든 워크시트에 이름을 주고 붙인다.
    XLSX.utils.book_append_sheet(wb, newWorksheet, saleExcelHandler.getSheetName());

    // step 4. 엑셀 파일 만들기
    const wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

    // step 5. 엑셀 파일 내보내기
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), saleExcelHandler.getExcelFileName());
}

const saleExcelHandler = {
    getExcelFileName : function(){
        return '판매.xlsx';
    },
    getSheetName : function(){
        return '판매';
    },
    getExcelData : function(){
        const result = [];
        const row = [];
        row.push('주문번호');
        row.push('날짜');
        row.push('구매자');
        row.push('구매자 연락처');
        row.push('상품');
        row.push('kg');
        row.push('개수');
        row.push('가격');
        row.push('수령인');
        row.push('수령인 연락처');
        row.push('주소');
        row.push('요청사항');
        result.push(row);

        orders.forEach((order)=>{
            const idx = order.idx;
            const dateText = order.regDate;
            const buyer = order.buyer;
            const buyerTel1 = order.buyerTel1;
            const buyerTel2 = order.buyerTel2;
            const buyerTel3 = order.buyerTel3;
            const recipient = order.recipient;
            const recipientTel1 = order.recipientTel1;
            const recipientTel2 = order.recipientTel2;
            const recipientTel3 = order.recipientTel3;
            const post1 = order.post1;
            const post2 = order.post2;
            const post3 = order.post3;
            const request = order.request;
            const itemList = order.itemList;
            itemList.forEach((item)=>{
                const data = [];
                data.push(idx); //주문번호
                data.push(dateText);    //날짜
                data.push(buyer);   //구매자
                data.push(buyerTel1+'-'+buyerTel2+'-'+buyerTel3);   //구매자번호
                data.push('[' + item.item + '] ' + item.option); //주문 상품
                data.push(item.kg); //kg
                data.push(item.ea); //개수
                data.push(item.price * item.ea); //개수
                data.push(recipient);   //수령자
                data.push(recipientTel1+'-'+recipientTel2+'-'+recipientTel3);   //수령자 번호
                data.push(post2+' '+post3);   //주소
                data.push(request); //요청사항
                result.push(data);
            });
        });

        return result;
    },
    getWorksheet : function(){
        return XLSX.utils.aoa_to_sheet(this.getExcelData());
    }
}