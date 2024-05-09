const tools = require("./toolsAPI");
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const { log } = require("console");

let ip = '', host = ''

require('dotenv').config();

const PORT = process.env.SERVER_PORT || 3000;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME

mongoose.connect(`mongodb+srv://vladgro720:zkCWVEd65RB3HETO@cluster0.1o5p1nv.mongodb.net/${DB_NAME}`);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB:'));
db.once('open', () => {
  console.log('Успешное подключение к MongoDB');
});

const Schema = mongoose.Schema;
const dataSchema = new Schema({
  tableId: String,
  sheetName: String
}, { versionKey: false });

const DataModel = mongoose.model('Data', dataSchema, COLLECTION_NAME);

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/data', async (req, res) => {
    try {
      const { tableURL, sheetName } = req.body;
      const tableId = tableURL.split('/spreadsheets/d/')[1].split('/')[0];
      let table = await DataModel.findOne({ tableId, sheetName }) 

      if(table) throw new Error('Таблица с таким листом уже существует')
      
      const data = await tools.getDataFromGoogleSheet(tableId, sheetName);

      if (!data.state){
        if(data.message == 'Ошибка при получение данных с таблицы: The caller does not have permission') throw new Error('Ошибка при получение данных с таблицы: \nПроблемы с доступом таблицы. Проверьте, что она действительно является публичной или ввели правильную ссылку!')
        throw new Error(data.message)
      }

      table = await new DataModel({ tableId, sheetName }).save() 

      res.send({ 
        state: true, 
        data: {
          rows: data.data.rows,
          url: host+'/api/data/'+table._id+'/append'
        } 
      });
    } catch (error) {
      console.error(error);
      res.status(200).json({ state: false, message: error.message });
    }
});

app.get('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const table = await DataModel.findById(id);

    if (!table) throw new Error("Нет такого листа или таблицы");

    const data = await tools.getDataFromGoogleSheet(table.tableId, table.sheetName);

    if (!data.state){
      if(data.message == 'Ошибка при получение данных с таблицы: The caller does not have permission') throw new Error('Ошибка при получение данных с таблицы: \nПроблемы с доступом таблицы. Проверьте, что она действительно является публичной или ввели правильную ссылку!')
      throw new Error(data.message)
    }
    

    res.send({ state: true, data: {
      rows: data.data.rows,
    } });
  } catch (error) {
    console.error(error);
    res.status(200).json({ state: false, message: error.message });
  }
});

app.post('/api/data/:id/append', async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body.data;
    console.log(id, req.body);
    const table = await DataModel.findById(id);

    if (!table) throw new Error("Нет такого листа или таблицы");

    const appendState = await tools.appendDataInGoogleSheet(table.tableId, table.sheetName, newData);

    if (!appendState.state){
      if(appendState.message == 'Ошибка при получение данных с таблицы: The caller does not have permission') throw new Error('Ошибка при получение данных с таблицы: \nПроблемы с доступом таблицы. Проверьте, что она действительно является публичной или ввели правильную ссылку!')
      throw new Error(appendState.message)
    }

    res.json({ state: true });
  } catch (error) {
    res.status(200).json({ state: false, message: error.message });
  }
});

const server = app.listen(PORT, async () => {
  const { port } = server.address();
  
  http.get('http://api.ipify.org/', (res) => {
    res.on('data', (chunk) => {
      ip += chunk;
    });
    res.on('end', () => {
      host = `http://${ip}:${port}`
      console.log(`Сервер запущен на адресе ${host}\n`);
    });
  }).on('error', (err) => {
    console.log('Ошибка:', err.message);
  });
});
