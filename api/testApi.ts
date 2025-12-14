import request from '../src/utils/request'

const testApi = () => {
    return request({
        url: '/test',
        method: 'get',
    })
}
export default testApi;