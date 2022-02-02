const reqeustUrl = 'http://jayeonapple.com:8001';

$(document).ready(function (){
    getItems();
    saleModalEvent();
    addGoodsListEvent();
});

//상품 정보
let items;
function getItems(){
    const ajax = $.ajax({
        method : 'GET',
        url : reqeustUrl+'/v1/items',
    });
    
    ajax.done((res)=>{
        console.log(res);
        items = res.data;
    });
    
    ajax.fail((res)=>{
        alert('오류');
    });
}

//판매중인 상품과 아닌 상품의 modal event 추가 분기처리
function saleModalEvent(){
    const sale = document.querySelectorAll('.sale');
    sale.forEach((item)=>{
        item.addEventListener('click', clickCardSale, false);
    });
    const notSale = document.querySelectorAll('.not-sale');
    notSale.forEach((item)=>{
        item.addEventListener('click', clickCardNotSale, false);
    });
}

function addGoodsListEvent(){
    const goodsList = document.getElementById('addGoodsList');
    goodsList.addEventListener('click', addGoodsList, false);
}

//modal의 상품 추가 버튼 동작
function addGoodsList(){
    const saleGoodsList = document.getElementById('goodsList');
    
    //data들을 출력할 div
    const div = document.createElement('div');
    div.setAttribute('class', 'row');

    //상품 목록 select
    const goodsSelect = document.createElement('select');
    goodsSelect.setAttribute('class', 'form-control col-lg-2 ml-1 mr-1 mt-1');
    goodsSelect.setAttribute('name', 'goods');
    const option = document.createElement('option');
    option.value = '';
    option.text = '상품 선택';
    goodsSelect.appendChild(option);
    items.forEach((item)=>{
        const option = document.createElement('option');
        option.value = item.idx;
        option.text = item.name;
        goodsSelect.appendChild(option);
    });
    goodsSelect.addEventListener('change', getOptionList, false);

    //상품 옵션 select
    const goodsOptionSelect = document.createElement('select');
    goodsOptionSelect.setAttribute('class', 'form-control col-lg-3 ml-1 mr-1 mt-1');
    goodsOptionSelect.setAttribute('name', 'option');
    goodsOptionSelect.addEventListener('change', reloadEa, false);

    //상품 개수
    const ea = document.createElement('input');
    ea.setAttribute('class', 'form-control col-lg-2 ml-1 mr-1 mt-1');
    ea.setAttribute('name', 'ea');
    ea.setAttribute('type', 'number');
    ea.setAttribute('value', 0);
    ea.addEventListener('change', changeEa, false);

    //상품 가격
    const price = document.createElement('input');
    price.setAttribute('class', 'form-control col-lg-2 ml-1 mr-1 mt-1');
    price.setAttribute('name', 'price');
    price.setAttribute('type', 'text');
    price.setAttribute('readonly', true);
    price.setAttribute('value', 0);

    //해당 line 삭제
    const delBtn = document.createElement('button');
    delBtn.setAttribute('type', 'button');
    delBtn.setAttribute('class', 'btn btn-danger col-lg-1  ml-1 mr-1 mt-1');
    delBtn.innerText = '취소';
    delBtn.addEventListener('click',goodsListDelBtn, false);

    //node 추가
    div.appendChild(goodsSelect);
    div.appendChild(goodsOptionSelect);
    div.appendChild(ea);
    div.appendChild(price);
    div.appendChild(delBtn);

    saleGoodsList.appendChild(div);
}

//판매중인 상품의 modal창 띄우기
function clickCardSale(){
    $('#saleModal').modal();
}

//판매중이지 아닌 상품의 alert
function clickCardNotSale(){
    alert('판매중인 상품이 아닙니다.');
}

//modal del btn 클릭
function goodsListDelBtn(){
    const btn = this;
    btn.parentElement.remove();
}

//option list value에 따른 정보 변경
function getOptionList(){
    const select = this;
    const row = select.parentElement;
    const optionSelect = row.querySelector('select[name=option]');
    const eaInput = row.querySelector('input[name=ea]');
    const priceInput = row.querySelector('input[name=price]');
    optionSelect.length = 0;
    eaInput.value = 0;
    priceInput.value = 0;

    if(select.value == 0){
        return ;
    }

    const itemObj = items.filter((e)=>{
        return e.idx == select.value;
    });
    const options = itemObj[0].options;
    options.forEach((item)=>{
        const option = document.createElement('option');
        option.value = item.idx;
        option.setAttribute("data-price", item.price);
        option.text = item.kg + 'kg ' + item.name + '(' + item.price.toLocaleString()+' 원)';
        optionSelect.appendChild(option);
    });
}

//옵션 재 선택시 ea와 price 0으로 변경
function reloadEa(){
    const select = this;
    const row = select.parentElement;
    const eaInput = row.querySelector('input[name=ea]');
    const priceInput = row.querySelector('input[name=price]');

    eaInput.value = 0;
    priceInput.value = 0;
}

//ea변경 시 price 값 변경
function changeEa(){
    const ea = this;
    const row = ea.parentElement;
    const optionSelect = row.querySelector('select[name=option]');
    const priceInput = row.querySelector('input[name=price]');
    const selectPrice = optionSelect.options[optionSelect.selectedIndex].dataset.price;
    const calPrice = selectPrice * ea.value;
    priceInput.value = calPrice.toLocaleString();
}

//kakao 주소검색 api
function kakaoPostSearch(){
    const post1 = document.querySelector('input[name=post1]');
    const post2 = document.querySelector('input[name=post2]');

    new daum.Postcode({
        oncomplete: function(data) {
            post1.value = data.zonecode;
            post2.value = data.address;
        }
    }).open();
}

//주문 button
function order(){
    if(!orderValidation()){
        return ;
    }
    orderAjax();
}

function orderValidation(){
    let result = true;
    const f = document.orderForm;
    const list = document.getElementById('goodsList').querySelectorAll('.row');
    if(list.length == 0){
        alert('상품 추가 버튼을 통해 상품을 추가해주세요!');
        result = false;
        return result;
    }
    list.forEach((item)=>{
        const itemValue = item.querySelector('select[name=goods]').value;
        if(itemValue == ''){
            alert('상품을 선택해주세요!');
            result = false;
            return result;
        }
        const ea = item.querySelector('input[name=ea]').value;
        if(ea == 0){
            alert('상품 개수를 입력해주세요!');
            result = false;
            return result;
        }
        
    });

    const buyer = f.buyer.value;
    const buyerTel1 = f.buyerTel1.value;
    const buyerTel2 = f.buyerTel2.value;
    const buyerTel3 = f.buyerTel3.value;
    const recipient = f.recipient.value;
    const recipientTel1 = f.recipientTel1.value;
    const recipientTel2 = f.recipientTel2.value;
    const recipientTel3 = f.recipientTel3.value;
    const post1 = f.post1.value;
    const post2 = f.post2.value;
    const post3 = f.post3.value;
    const request = f.request.value;

    //주문자 정보
    if(buyer == ''){
        alert('입금자 명을 입력해주세요!');
        result = false;
        return result;
    }
    if(buyerTel1 == ''){
        alert('주문자 연락처를 입력해주세요!');
        result = false;
        return result;
    }
    if(buyerTel2 == ''){
        alert('주문자 연락처를 입력해주세요!');
        result = false;
        return result;
    }
    if(buyerTel3 == ''){
        alert('주문자 연락처를 입력해주세요!');
        result = false;
        return result;
    }

    //수정자 정보
    if(recipient == ''){
        alert('수령자 명을 입력해주세요!');
        result = false;
        return result;
    }
    if(recipientTel1 == ''){
        alert('수령자 연락처를 입력해주세요!');
        result = false;
        return result;
    }
    if(recipientTel2 == ''){
        alert('수령자 연락처를 입력해주세요!');
        result = false;
        return result;
    }
    if(recipientTel3 == ''){
        alert('수령자 연락처를 입력해주세요!');
        result = false;
        return result;
    }

    //주소
    if(post1 == ''){
        alert('주소찾기 후 주소를 정확히 입력해주세요!');
        result = false;
        return result;
    }
    if(post2 == ''){
        alert('주소찾기 후 주소를 정확히 입력해주세요!');
        result = false;
        return result;
    }
    if(post3 == ''){
        alert('상세 주소를 정확히 입력해주세요!');
        result = false;
        return result;
    }
    return result;
}

function orderAjax(){
    const f = document.orderForm;
    const rows = document.querySelector('#goodsList').querySelectorAll('.row');
    const arr = [];
    rows.forEach((row)=>{
        const item = {
            'item' : row.querySelector('select[name=goods]').value,
            'option' : row.querySelector('select[name=option]').value,
            'ea' : row.querySelector('input[name=ea]').value,
            'price' : row.querySelector('input[name=price]').value
        };
        arr.push(item);
    });
    const buyer = f.buyer.value;
    const buyerTel1 = f.buyerTel1.value;
    const buyerTel2 = f.buyerTel2.value;
    const buyerTel3 = f.buyerTel3.value;
    const recipient = f.recipient.value;
    const recipientTel1 = f.recipientTel1.value;
    const recipientTel2 = f.recipientTel2.value;
    const recipientTel3 = f.recipientTel3.value;
    const post1 = f.post1.value;
    const post2 = f.post2.value;
    const post3 = f.post3.value;
    const request = f.request.value;

    axios.post(reqeustUrl+'/v1/orders',{
        'order' : JSON.stringify(arr),
        'buyer' : buyer,
        'buyerTel1' : buyerTel1,
        'buyerTel2' : buyerTel2,
        'buyerTel3' : buyerTel3,
        'recipient' : recipient,
        'recipientTel1' : recipientTel1,
        'recipientTel2' : recipientTel2,
        'recipientTel3' : recipientTel3,
        'post1' : post1,
        'post2' : post2,
        'post3' : post3,
        'request' : request
    })
    .then(function(res){
        alert('주문 완료! 입금자명과 동일한 이름으로 계좌입금을 해주시면 확인 후 상품 배송해드리겠습니다!');
        location.reload();
    })
    .catch(function(){
        alert('실패');
    });
}