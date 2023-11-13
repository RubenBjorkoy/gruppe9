import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Tag =  {
    tagid: number;
    navn: string;
};


class TagService {

    /**
     * Get Tag with given id.
     */
    get(tagid: number) {
        return axios.get<Tag>('/tag/' + tagid).then((response) => response.data);
    }

}

const tagService = new TagService();
export default tagService;