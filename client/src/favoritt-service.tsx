import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Favoritt = {
    favorittid: number;
    svarid: number;
};

class FavorittService {
    
    getAll () {
        return axios.get<Favoritt[]>('/favoritt').then((response) => response.data);
    }
    

    // create 

    // delete 
    
    }





const favorittService = new FavorittService();
export default favorittService;