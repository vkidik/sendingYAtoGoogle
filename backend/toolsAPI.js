const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const credentials = require('./credentials.json');

class ToolsAPI {
    constructor() {
        this.auth = new GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
    }
    
    async getGoogleSheetsClient() {
        const client = await this.auth.getClient()
        return google.sheets({ version: 'v4', auth: client });
    }

    async getDataFromGoogleSheet(SPREADSHEET_ID, SHEET_NAME) {
        try {
            const googleSheets = await this.getGoogleSheetsClient();
            const res = await googleSheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
            const sheets = res.data.sheets;
            const sheet = sheets.find(s => s.properties.title === SHEET_NAME);
    
            if (!sheet) throw new Error(`Лист с таким названием '${SHEET_NAME}' не был найден в таблице.`);
    
            const range = `${SHEET_NAME}!A1:Z`;
            const response = await googleSheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range });
            const rows = response.data.values;
            return { state: true, data: {
                rows,
                url: '/api/data/' + SPREADSHEET_ID + '/' + SHEET_NAME + '/append',
            } };
        } catch (error) {
            return { state: false, message: 'Ошибка при получение данных с таблицы: ' + error.message };
        }
    }
    
    async appendDataInGoogleSheet(SPREADSHEET_ID, SHEET_NAME, newData) {
        try {
            const googleSheets = await this.getGoogleSheetsClient();
            const range = `${SHEET_NAME}!A1:Z`;
            const request = {
                spreadsheetId: SPREADSHEET_ID,
                range,
                valueInputOption: 'USER_ENTERED',
                resource: { values: newData },
                insertDataOption: 'INSERT_ROWS'
            };
    
            const response = await googleSheets.spreadsheets.values.append(request);

            // if(response.data.status != 200) throw new Error('Проблемы с добавлением')

            return { state: true, message: 'Данные успешно добавлены' };
        } catch (error) {
            return { state: false, message: 'Ошибка при добавлении данных в таблице: ' + error.message };
        }
    }
}

module.exports = new ToolsAPI();