const tools = require("./toolsAPI");
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Buffer } = require('buffer');

const host = 'https://example.com';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

app.post('/api/data', async (req, res) => {
    try {
        const { tableURL, sheetName } = req.body;
        const tableId = tableURL.split('/spreadsheets/d/')[1].split('/')[0];
        
        const data = await tools.getDataFromGoogleSheet(tableId, sheetName);

        if (!data.state) {
            if (data.message === 'Ошибка при получение данных с таблицы: The caller does not have permission') {
                throw new Error('Ошибка при получение данных с таблицы: \nПроблемы с доступом таблицы. Проверьте, что она действительно является публичной или ввели правильную ссылку!');
            }
            throw new Error(data.message);
        }

        console.log(`${host}/api/data/${tableId}__${Buffer.from(sheetName).toString('base64')}/append`);

        res.send({
            state: true,
            data: {
                rows: data.data.rows,
                url: `${host}/api/data/${tableId}__${Buffer.from(sheetName).toString('base64')}/append`
            }
        });
    } catch (error) {
        console.error(error);
        res.status(200).json({ state: false, message: error.message });
    }
});

app.get('/api/data/:id', async (req, res) => {
    try {
        const ids = req.params.id.split("__");

        const table = {
            tableId: ids[0],
            sheetName: Buffer.from(ids[1], 'base64').toString('utf-8')
        };

        const data = await tools.getDataFromGoogleSheet(table.tableId, table.sheetName);

        if (!data.state) {
            if (data.message === 'Ошибка при получение данных с таблицы: The caller does not have permission') {
                throw new Error('Ошибка при получение данных с таблицы: \nПроблемы с доступом таблицы. Проверьте, что она действительно является публичной или ввели правильную ссылку!');
            }
            throw new Error(data.message);
        }
        
        res.send({
            state: true,
            data: {
                rows: data.data.rows,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(200).json({ state: false, message: error.message });
    }
});

app.post('/api/data/:id/append', async (req, res) => {
    try {
        const ids = req.params.id.split("__");

        const table = {
            tableId: ids[0],
            sheetName: Buffer.from(ids[1], 'base64').toString('utf-8')
        };
        console.log(req.body)
        const newData = [Object.values(req.body.params)];

        if (!table) throw new Error("Нет такого листа или таблицы");

        const appendState = await tools.appendDataInGoogleSheet(table.tableId, table.sheetName, newData);
        console.log(newData)

        if (!appendState.state) {
            if (appendState.message === 'Ошибка при получение данных с таблицы: The caller does not have permission') {
                throw new Error('Ошибка при получение данных с таблицы: \nПроблемы с доступом таблицы. Проверьте, что она действительно является публичной или ввели правильную ссылку!');
            }
            throw new Error(appendState.message);
        }

        res.json({ state: true });
    } catch (error) {
        res.status(200).json({ state: false, message: error.message });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// if ("SOCKET" in process.env) {
//     const socket = process.env.SOCKET;
//     if (fs.existsSync(socket)) {
//         fs.unlinkSync(socket);
//     }
//     app.listen(socket, () => {
//         fs.chmodSync(socket, 0o660);
//         console.log(`Listening ${socket}`);
//     });
// } else if ("PORT" in process.env) {
//     const port = process.env.PORT || 3000;
//     app.listen(port, () => {
//         console.log(`Listening on port ${port}/`);
//     });
// } else {
//     const port = 3000;
//     app.listen(port, () => {
//         console.log(`Listening on port ${port}/`);
//     });
// }


const server = app.listen(PORT, async () => {
  const { port } = server.address();
  
  http.get('http://api.ipify.org/', (res) => {
    res.on('data', (chunk) => {
      ip += chunk;
    });
    res.on('end', () => {
      host = `http://${ip}:${port}/api`
      console.log("Developed by Vkidik\nTelegram: https://t.me/young_vykqq/")
      console.log(`Сервер запущен на адресе ${host}\n`);
    });
  }).on('error', (err) => {
    console.log('Ошибка:', err.message);
  });
});
