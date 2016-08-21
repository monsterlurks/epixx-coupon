var toCard = document.querySelectorAll('.catalog_cart__btn');// коллекция кнопок на карточке
var basketList = document.querySelector('.catalog_basket__list');//контейнер для новых позиций в корзине(в него будем добавлять дивы с ценой и т.д. )
var imgClose = document.querySelector('.catalog_basket__close').innerHTML;// картинка "удалить позицию в корзине"
var card = [];


function takeToBusket(){

   for (var i = 0; i < card.length; i++){
         var content = '<div class="catalog_basket__line"><div class="catalog_basket__product">'
         + card[i].title + '</div><div class="catalog_basket__price price">'
         + card[i].price + '</div><div class="catalog_basket__close">' + imgClose + '</div>'
    }
     basketList.innerHTML+= content;
  }

for (var i = 0; i < toCard.length; i++){
     toCard[i].addEventListener('click', function(e){
     e.preventDefault();// отключаем стандартный клик по ссылке
     var title = e.target.closest('.catalog_cart__content').querySelector('.catalog_cart__title').innerHTML;//внутренности дитя ближайшего родителя таргетнутого элемента
     var price = e.target.closest('.catalog_cart__content').querySelector('.catalog_cart__price_new').innerHTML;

     card.push({
            price: parseInt(price), //при клике пушатся в массив, потом при вызове ф-ии подгруж. в basketList
            title: title

        });//конец метода push()
    takeToBusket();//во время клика вызывается ф-ия
    });//конец события

}

var imgCloseAll = document.querySelectorAll('.catalog_basket__close');
for (var i = 0; i < imgCloseAll.length; i++) {
   imgCloseAll[i].addEventListener('click', function(e){
    e.target.closest('.catalog_basket__line').remove();
   });
}
