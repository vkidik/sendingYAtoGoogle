<template>
<div class="about">
    <h1>Как работает?</h1>

    <p>Отправлять значения с Яндекс Формы на Google таблицы идея значительная бредовая идея, ведь есть Google Формы для этого<br>Но если вам потребовалось это сделать, слежуем использовать инструкицию ниже:</p>

    <h2>Инструкция</h2>

    <ol>
        <li>Создать таблицу публичную( *если это невыполнено ) <img src="@/images/1.jpg" alt="Пример"></li>
        <li>Внести описание нужных вам значений в таблицу( *если это невыполнено )<img src="@/images/2.jpg" alt="Пример"></li>
        <li>Получить ссылку для Яндекс Формы на платформе путем ввода ссылки на табличку и нужного названия листа( *если это невыполнено )<img src="@/images/3.jpg" alt="Пример"></li>
        <li>Зайти в форму -> Интеграция</li>
        <li>Включить группу действий, выбрать внизу раздел "API" и  выбрать "Запрос JSON-RPC POST"</li>
        <li>В URL вставить ссылку, которая дала эта платформа</li>
        <li>В параметрах по очереди добавлять нужные вам передаваемые значения(строго по порядку как в таблице!): <img src="@/images/4.jpg" alt="Пример"></li>
            <ul>
                <li><span>Влево написать описание названия, как в таблице</span></li>
                <li><span>Правее нажать на "+" -> "Ответ на форму" и выбрать нужное значение</span></li>
            </ul>
        <li>Готово, если всё сделано правильно, то ждем новые заяявки, которые будут добавлять в Google Таблицу</li>
    </ol>
</div>
</template>
    
<style>
.about {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
}

h2 {
    font-size: 20px;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 10px;
}

p {
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 20px;
}

ol {
    list-style-type: numeric;
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 20px;
}

img{
    width: 100%;
}

li {
    position: relative;
    margin-bottom: 10px;
    text-align: left
}

ul li {
    position: relative;
    margin-left: 20px;

    list-style-type: disc;
}

ul li span {
    display: inline-block;
    margin-left: 10px;
}

</style>