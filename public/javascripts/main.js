const reqeustUrl = 'http://localhost:8080';

$(document).ready(function (){
    //getItems();
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
        //console.log(res);
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
        return e.idx === 1;
    });
    const options = itemObj[0].options;
    options.forEach((item)=>{
        console.log(item);
        const option = document.createElement('option');
        option.value = item.idx;
        option.setAttribute("data-price", item.price);
        option.text = item.name + '(' + item.price.toLocaleString()+' 원)';
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
    const f = document.orderForm;
    const row = document.querySelector('#goodsList').querySelectorAll('.row');

    const buyer = f.buyer.value;

    const data = {
        'order' : [],
        'buyer' : buyer
    };
    const ajax = $.ajax({
        method: 'POST',
        url: reqeustUrl+'/v1/orders',
        data: data
    });
}