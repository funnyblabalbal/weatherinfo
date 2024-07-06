
// 封装具体的请求数据的方法

// 引入封装的axios实例，并命名为request（在引入js文件时，文件后缀（.js）可以省略）
import request from './axios'


// 请求当前城市
export const getCurrentCityApi = () => {
    return request.get("ip?key=b6510975201abe43bb343cc9c8ea1ff9");
};

// 请求实时天气数据
export const getBaseWeatherDataApi = (code) => {
    return request.get(`weather/weatherInfo?city=${code}&key=b6510975201abe43bb343cc9c8ea1ff9&extensions=base`);
};

// 请求当天以及未来3天的天气数据
export const getWeatherForecastDataApi = (code) => {
    return request.get(`weather/weatherInfo?city=${code}&key=b6510975201abe43bb343cc9c8ea1ff9&extensions=all`);
};




