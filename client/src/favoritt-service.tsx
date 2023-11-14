import axios from 'axios';
import { Svar } from './svar-service';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Favoritt = {
    favorittid: number;
    svarid: number;
};

class FavorittService {
    
    getAll () {
        return axios.get<Svar[]>('/favoritt').then((response) => response.data);
    }

    create (svarid: number) {
        return axios.post<{ favoritt: Favoritt }>('/favoritt', { svarid: svarid }).then((response) => response.data);
    }
    


    delete (favorittid: number) {
        return axios.delete<Favoritt>('/favoritt/' + favorittid).then((response) => response.data);
    }

     
    
    }





const favorittService = new FavorittService();
export default favorittService;