<template>
  <div class="home">
    <HelloWorld msg="Главная"/>

    <div class="home" v-if="$store.state.links.length > 0">
      <h3>Ваши созданные ссылки</h3>
      <table border="1">
        <tr>
          <th>Ссылка</th>
          <th>Действия</th>
        </tr>
        <tr v-for="(link, index) in $store.state.links" :key="index">
          <td>{{ link }}</td>
          <td><button @click="copy(link)">Скопировать</button></td>
        </tr>
      </table>
    </div>

    <form @submit="sendForm">
        <h3>Подключить Google таблицу</h3>
        <p>Введите данные Google таблицы для того, чтобы взамен получили пример, который надо выполнить в Yandex Формах</p>
        <input type="text" ref="sheetUrl" placeholder="Ссылка на таблицу (обязательно публичная):" required>
        <input type="text" ref="sheetName" placeholder="Название листа:" required>
        <button type="submit">Получить уникальный индетификатор</button>
    </form>

    <h4 v-if="response.data != ''">{{ response.message || response.data.url || response.data }}</h4>
  </div>
</template>

<script>
const api = require('../api')
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  mounted() {
    console.log(this.$store.state.links);
  },
  data() {
    return {
      response: {
        state: false,
        data: '',
      },
    }
  },
  methods: {
    async sendForm(event) {
      event.preventDefault();

      const tableURL = this.$refs.sheetUrl.value
      const sheetName = this.$refs.sheetName.value
      
      if (tableURL == '' && sheetName == '') {
        this.response = {
          state: true,
          data: 'У вас заполнены не все поля'
        }
      } else {
        this.response = {
          state: true,
          data: 'Ожидайте ответа...'
        };
        
        this.response = await api.sendData('/data', {
          tableURL,
          sheetName
        });
        console.log(this.response);
        if(!this.response.message) this.$store.state.links.push(this.response.data.url)
      }
    },
    copy(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Текст скопирован в буфер обмена');
          alert('Текст скопирован в буфер обмена');
        })
        .catch(err => {
          console.error('Ошибка копирования текста в буфер обмена: ', err);
          alert('Ошибка копирования текста в буфер обмена: ', err);
        });
    }
  }
}
</script>

<style lang="scss">
table{
  width: 100%;
  max-width: 600px;

  td{
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
  }
}

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    h3 {
      margin-bottom: 0;
    }

    input {
      width: 320px;
    }
  }
}
</style>
