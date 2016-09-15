var toCard = document.querySelectorAll('.catalog_cart'); // коллекция кнопок на карточке
var basketList = document.querySelector('.catalog_basket__list'); //контейнер для новых позиций в корзине(в него будем добавлять дивы с ценой и т.д. )
var imgClose = document.querySelector('#close').innerHTML; // картинка "удалить позицию в корзине"
var card = [];
var cardList = document.querySelector('.catalog__list');

function MakeBusket() {
    basketList.innerHTML = '';
    for (var i = 0; i < card.length; i++) {
        var content = '<div class="catalog_basket__line" data-number ="' + i + '"><div class="catalog_basket__product">' + card[i].title + '</div><div class="catalog_basket__price price">' + card[i].price + '$' + '</div><div class="catalog_basket__close">' + imgClose + '</div>';
        basketList.innerHTML += content;
        console.log(card);
    }
    SumTotal();
}
var cardContent = document.querySelector('.catalog__content');
cardContent.onclick = function(e) {
    e.preventDefault(); // отключаем стандартный клик по ссылке
    if (e.target.closest('.catalog_cart--disabled')) { // купоны с классом disabled не пушатся в массив card
        return false
    }
    if (e.target.className == 'btn') {
        var title = e.target.closest('.catalog_cart__content').querySelector('.catalog_cart__title').innerHTML; //внутренности дитя ближайшего родителя таргетнутого элемента
        var price = e.target.closest('.catalog_cart__content').querySelector('.catalog_cart__price_new').innerHTML;
        console.log(title);
        card.push({
            price: parseInt(price), //при клике пушатся в массив, потом при вызове ф-ии подгруж. в basketList (кроме тех, что disabled)
            title: title
        });
    }
    MakeBusket();
};

function SumTotal() {
    var sum = 0;
    for (var i = 0; i < card.length; i++) {
        if (card[i] !== null) { //если card[i] существует, то прибавляем к sum price из массива
            sum += card[i].price;
        }
    }
    document.querySelector(".catalog_basket__summ_text").innerHTML = sum + "$";
}

basketList.onclick = function(e) {
    //повесила событие на весь контейнер с добавленными товарами
    var target = e.target; //где был клик?
    if (target.tagName == 'svg') { // если таргетнутый элемент svg, то удаляем
        var number = target.closest('.catalog_basket__line').dataset.number;
        card.splice(number, 1);
        MakeBusket();
    }
}

var url = 'http://localhost:8000/data.json';
var obj = new XMLHttpRequest();
var timer = '<div class="catalog_cart__timer timer"><div class="timer__item"><span class = "days">00</span><span>day</span></div><div class="timer__item"><span class = "hour">00</span><span>hour</span></div><div class="timer__item"><span class="min">00</span><span>min</span></div><div class="timer__item"><span class = "sec">00</span><span>sec</span></div>';
obj.open('GET', url);
obj.addEventListener('load', function() {
    //console.log(obj.responseText)
    var data = JSON.parse(obj.responseText); //массив карточек из Json
    for (var i = 0; i < data.length; i++) {
        createCoupon(data[i]); // data [i] элемент массива data
        var generatedCard = cardList.querySelectorAll('.catalog__item');
        for (var j = 0; j < generatedCard.length; j++) {
            if (data[j].special == true) {
                generatedCard[j].classList.add('catalog_cart--special'); // в сочетании с классом --spescial таймер виден
            }
        }
    }
});

obj.send();

function createCoupon(data) {
    var cardFromJson = '<a href="/" data-type="' + data.type + '" data-price="500" data-date-to="' + data.dateTo + '" data-date-from="' + data.dateFrom + '" data-metro="' + data.metro + '" class="catalog_cart catalog__item">' + '<div class="catalog_cart__image"><img src="' + data.backgroundUrl + '">' + timer + '</div></div>' + '<div class="catalog_cart__content"><div class="catalog_cart__discount">' + data.discount + '%' + '</div><p class="catalog_cart__title">' + data.title + '</p><div class="catalog_cart__footer"><p class="catalog_cart__price">' + '<span class="price catalog_cart__price_old">' + data.priceOld + '</span>' + '<span class="price catalog_cart__price_new">' + data.priceNew + '</span></p><div class="catalog_cart__btn"><p class="btn">to cart</p></div></div></div></a>';
    // генерируем html строку(купон)
    cardList.innerHTML += cardFromJson;
}

/* ФУНКЦИЯ ТАЙМЕРА */
function countdown() { // по загрузке страницы запускается данная ф-ия
    var cardSpecial = document.querySelectorAll('.catalog_cart--special');
    for (var i = 0; i < cardSpecial.length; i++) { // внутри каждой карточки в зависимости от атрибута dateto
        var dateToAttr = cardSpecial[i].getAttribute('data-date-to').substring(0, 19); // дата не парсилась, обрезали часовой пояс
        var deadLine = new Date(dateToAttr);
        var days = cardSpecial[i].closest('.catalog_cart--special').querySelector(".days");
        var hours = cardSpecial[i].closest('.catalog_cart--special').querySelector(".hour");
        var minutes = cardSpecial[i].closest('.catalog_cart--special').querySelector(".min");
        var seconds = cardSpecial[i].closest('.catalog_cart--special').querySelector(".sec");
        var now = new Date();
        var timeLeft = deadLine - now; //сколько времни прошло в ms
        var daysLeft = Math.floor(timeLeft / 86400000); //кол-во млс в дне
        var hoursLeft = Math.floor(timeLeft % 86400000 / 3600000);
        var minutesLeft = Math.floor(timeLeft % 86400000 % 3600000 / 60000);
        var secondsLeft = Math.floor(timeLeft % 86400000 % 3600000 % 60000 / 1000);
        if (timeLeft <= 0) {
            cardSpecial[i].classList.add('catalog_cart--disabled');
            cardSpecial[i].classList.remove('catalog_cart--special');
        }
        days.innerHTML = daysLeft;
        hours.innerHTML = hoursLeft;
        minutes.innerHTML = minutesLeft;
        seconds.innerHTML = secondsLeft;
    }
}
setInterval(countdown, 1000); //каждую секунду функция countdown запускается
/* КОНЕЦ ТАЙМЕРА*/

/*МОДАЛЬНОЕ ОКНО; ВАЛИДАЦИЯ ФОРМЫ*/
var btnBuy = document.querySelector('#bth_buy');
var modalOrder = document.querySelector('.modal_order');
var modalOrderClose = document.querySelector('.modal__close');
var underlay = document.querySelector('.modal_underlay');
btnBuy.addEventListener('click', function(e) {
    e.preventDefault();
    modalOrder.style.display = 'block';
    underlay.style.display = 'block';
})
underlay.onclick = function() {
    modalOrder.style.display = 'none';
    underlay.style.display = 'none';
}
modalOrderClose.onclick = function(e) {
    e.preventDefault();
    modalOrder.style.display = 'none';
    underlay.style.display = 'none';
}
document.forms.order.elements.name.addEventListener('input', function(e) { //при введении value запускается ф-ия goValidate
    if (goValidate(this, /[a-zа-я]+\s?[a-zа-я]+/i) === null) { //this используется внутри метода и ссылается на текущий объект
        this.style.borderColor = 'red';
        this.style.color = 'red'
    } else {
        this.style.borderColor = 'black';
        this.style.color = 'black';
    }
})
document.forms.order.elements.phone.addEventListener('input', function(e) {
    if (goValidate(this, /^\+?[\(\)\-0-9]+$/) === null) {
        this.style.borderColor = 'red';
        this.style.color = 'red'
    } else {
        this.style.borderColor = 'black';
        this.style.color = 'black';
    }
})
document.forms.order.elements.mail.addEventListener('input', function(e) {
    if (goValidate(this, /.+@.+\..+/) === null) {
        this.style.borderColor = 'red';
        this.style.color = 'red'
    } else {
        this.style.borderColor = 'black';
        this.style.color = 'black';
    }
})

function goValidate(input, regular) {
    return input.value.match(regular);
}
var checkInputs = document.forms.order.elements.delivery;
for (var i = 0; i < checkInputs.length; i++) {
    checkInputs[i].addEventListener('change', function() { //чекнули и увели фокус
        for (var i = 0; i < checkInputs.length; i++) {
            if (checkInputs[i] != this) {
                checkInputs[i].checked = false;
            }
        }
    })
}
// Функция проверки чекбоксов. Если ни один не выбран, то при нажатии на кнопу [I WANT IT] алерт с просьбой выбрать время доставки
function validateCheckBoxes() {
    var checkBoxes = document.querySelectorAll('.checkbox__input')
    var checkBoxesArr = [];
    for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked === true) {
            checkBoxesArr.push(checkBoxes[i]);
        }
    }
    if (checkBoxesArr.length === 0) {
        alert('Choose the delivery time');
    }
}
document.forms.order.elements.sendBtn.addEventListener('click', function(e) {
    e.preventDefault();
    validateCheckBoxes();
})
