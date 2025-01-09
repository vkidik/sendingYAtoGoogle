<template>
  <nav>
    <router-link to="/">Главная</router-link> |
    <router-link to="/about">Как работает?</router-link>
  </nav>
  <router-view/>
  <h3>Дочерние проекты</h3>
  <ul>
    <li v-for="(project, index) in projects" :key="index"><a :href="project.link" target="_blank" rel="noopener">{{ project.name }}</a></li>
  </ul>
  <br><br>
</template>

<script>
  export default{
    name: "MainApp",
    data(){
      return{
        projects: [
          {
            name: "Яндекс Формы",
            link: "https://forms.yandex.ru/"
          },
          {
            name: "Google Таблицы",
            link: "https://docs.google.com/spreadsheets/"
          }
        ]
      }
    },
    mounted() {
      console.log("Developed by Vkidik\nTelegram: https://t.me/young_vykqq/")
    },
  }
</script>

<style lang="scss">
html, body, #app {
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

.creator{
  position: fixed;
  right: 16px;
  bottom: 16px
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #c41717;
    }
  }
}
</style>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #c41717;
}
</style>

