import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Favoritt = {
    favorittid: number;
    svarid: number;
};

class FavorittService {
    
        /**
        * Get Favoritt with given id.
        */
        get(favorittid: number) {
            return axios.get<Favoritt>('/favoritt/' + favorittid).then((response) => response.data);
        }
    
    }

const favorittService = new FavorittService();
export default favorittService;