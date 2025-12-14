// 1. 引入 axios
import axios from 'axios';

// 2. 全局配置（核心）
const service = axios.create({
  baseURL: 'https://yunlideyang.ltd/api', // 你的后端基础地址（替代每次写完整 URL）
  timeout: 5000, // 请求超时时间（5秒）
  headers: {
    'Content-Type': 'application/json', // 默认请求头
  },
});

// 可选：请求拦截器（比如加 token、loading 等）
service.interceptors.request.use(
  (config) => {
    // 示例：给所有请求加 token（登录后用）
    // config.headers.Authorization = localStorage.getItem('token');
    return config;
  },
  (error) => Promise.reject(error)
);

// 可选：响应拦截器（统一处理错误、解析数据）
service.interceptors.response.use(
  (response) => {
    // 只返回后端的核心数据（跳过 axios 自带的包装层）
    return response.data;
  },
  (error) => {
    // 统一处理错误（比如 401 跳登录、500 提示服务器错误）
    if (error.response.status === 401) {
      // window.location.href = '/login';
      console.error('未登录，请登录');
    } else {
      console.error('请求失败：', error.message);
    }
    return Promise.reject(error);
  }
);

// 3. 导出封装后的 axios 实例
export default service;