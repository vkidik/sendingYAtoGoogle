const axios = require('axios')

class APITools{
    constructor(){
        this.apiDomen = 'http://localhost:3000'
    }

    async fetchData(endpoint, method, body = {}) {
        try {
            const res = await axios({
                method: method,
                url: `${this.apiDomen}/api${endpoint}`,
                data: body
            });
            return res.data; 
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    }    

    async getData(endpoint){
        return await this.fetchData(`${endpoint}`, 'get')
    }

    async sendData(endpoint, body){
        return await this.fetchData(`${endpoint}`, 'post', body)
    }
}

module.exports = new APITools