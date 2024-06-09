import { filterForecastData } from "./filterForecastData.js";
import { roundDegree, formatDate } from "./convertUnits.js";
import {weatherForecastMap} from "./util.js";

export const weatherForecastData = async (data, key) => {
  const hourlyWeatherForecastDate = document.querySelectorAll(".hourly-weather-forecast-date");
  const hourlyWeatherForecastTime = document.querySelectorAll(".hourly-weather-forecast-time");
  const hourlyWeatherForecastTemperature = document.querySelectorAll(".hourly-weather-forecast-temperature");

  const dailyWeatherForecastDate = document.querySelectorAll(".daily-weather-forecast-date");
  const dailyWeatherForecastTime = document.querySelectorAll(".daily-weather-forecast-time");
  const dailyWeatherForecastIcon = document.querySelectorAll(".daily-weather-forecast-icon");
  const dailyWeatherForecastTemperature = document.querySelectorAll(".daily-weather-forecast-temperature");
  const dailyWeatherForecastDescription = document.querySelectorAll(".daily-weather-forecast-description");

  let API_URL;

  if (data.lat && data.lon) {
    API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.lat}&lon=${data.lon}&appid=d98411a21a90bab401b28d9346819bba&units=metric&lang=pt`;
  } else {
    API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${data}&appid=d98411a21a90bab401b28d9346819bba&units=metric&lang=pt`;
  }

  const response = await fetch(API_URL);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Desculpe, não conseguimos encontrar. ${data}. Verifique a ortografia e tente novamente.`);
    } else {
      throw new Error(
        "Ops! Estamos tendo problemas para obter as informações meteorológicas mais recentes no momento. Tente novamente mais tarde ou entre em contato com o suporte se o problema persistir."
      );
    }
  }

  const weatherForecastData = await response.json();

  await filterForecastData(weatherForecastData);

  for (let index = 0; index < 5; index++) {
    hourlyWeatherForecastDate[index].innerHTML = await formatDate(weatherForecastData.list[index].dt, "day");
    hourlyWeatherForecastTime[index].innerHTML = await formatDate(weatherForecastData.list[index].dt, "hour");
    hourlyWeatherForecastTemperature[index].innerHTML = await roundDegree(weatherForecastData.list[index].main.temp);
  }

  for (let index = 0; index < 40; index++) {
    dailyWeatherForecastDate[index].innerHTML = await formatDate(weatherForecastData.list[index].dt, "short");
    dailyWeatherForecastTime[index].innerHTML = await formatDate(weatherForecastData.list[index].dt, "hour");
    dailyWeatherForecastIcon[index].src = `src/img/static/${weatherForecastData.list[index].weather[0].icon}.svg`;
    dailyWeatherForecastTemperature[index].innerHTML = await roundDegree(weatherForecastData.list[index].main.temp);
    let weatherForecast = weatherForecastData.list[index].weather[0].main;
    let i18WeatherForecast = weatherForecastMap.get(weatherForecast) ?? weatherForecast;
    dailyWeatherForecastDescription[index].innerHTML = i18WeatherForecast;
  }
};
