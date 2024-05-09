<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>Это ознакомительная страница для подключения Yandex Форм к Google Sheets(таблиц, excel)</p>
  </div>

  <a href="https://t.me/vkidik" class="creator">tg: @vkidik</a>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>