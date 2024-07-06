// 二次封装axios

//这里配置封装一下axios
import axios from "axios";
//生成一个axios实例
const request = axios.create({
  baseURL: "https://restapi.amap.com/v3/",
  timeout: 3000,
});
// 导出axios实例
export default request;
