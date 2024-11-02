import React,{useCallback} from 'react'
import {AiOutlineSearch} from "react-icons/ai"

import {MainWrapper} from "./style.module"
import { WiHumidity } from 'react-icons/wi'
import { FaWind } from "react-icons/fa";
import { BsSunFill,BsCloudyFill,BsFillCloudRainFill,BsCloudFog2Fill } from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";

import axios from "axios"

interface WeatherDataProps {
  name: string;

  main: {
    temp: number;
    humidity: number;
  };
  sys: {
    country: string;
  };
  weather: {
    main: string;
  }[];
  wind: {
    speed: number;
  };
}



const Display = () => {

  const api_key = "99384197854d953f3b86102b061f1440"
  const api_Endpoint ="https://api.openweathermap.org/data/2.5/"
 
  const [weatherData, setWeatherData] = React.useState<WeatherDataProps | null>(
    null
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [searchCity, setSearchCity] = React.useState("");


  const fetchCurrentWeather = useCallback(async (lat: number, lon: number) => {
    const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  }, [api_Endpoint, api_key]);


  const iconChanger = (weather: string) => {
    let iconElement: React.ReactNode;
    let iconColor: string;

    switch (weather) {
      case "Rain":
        iconElement = <BsFillCloudRainFill />;
        iconColor = "#272829";
        break;

      case "Clear":
        iconElement = <BsSunFill />;
        iconColor = "#FFC436";
        break;
      case "Clouds":
        iconElement = <BsCloudyFill />;
        iconColor = "#102C57";
        break;

      case "Mist":
        iconElement = <BsCloudFog2Fill />;
        iconColor = "#279EFF";
        break;
      default:
        iconElement = <TiWeatherPartlySunny />;
        iconColor = "#7B2869";
    }

    return (
      <span className="icon" style={{ color: iconColor }}>
        {iconElement}
      </span>
    );
  };

  const fetchWeatherData = async (city: string) => {
    try {
      const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
      const searchResponse = await axios.get(url);

      const currentWeatherData: WeatherDataProps = searchResponse.data;
      return { currentWeatherData };
    } catch (error) {
      throw error;
    }
  };
  const handleSearch = async () => {
    if (searchCity.trim() === "") {
      return;
    }

    try {
      const { currentWeatherData } = await fetchWeatherData(searchCity);
      setWeatherData(currentWeatherData);
    } catch (error) {
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const [currentWeather] = await Promise.all([fetchCurrentWeather(latitude, longitude)]);
        setWeatherData(currentWeather);
        setIsLoading(true);
      });
    };

    fetchData();
  }, [fetchCurrentWeather]);


  return (
    
    <MainWrapper>
      <div className="container">
        <div className="searchArea">
          <input type="text" placeholder="Enter a city"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          />
       
          <div className="searchCircle">
            <AiOutlineSearch className="searchIcon"  onClick={handleSearch}/>
          </div>
        </div>

        {weatherData && isLoading?(
          <>
        <div className="weatherArea">
          <h1>{weatherData.name}</h1>
          <span>{weatherData.sys.country}</span>
          <div className="icon">
          {iconChanger(weatherData.weather[0].main)}
          </div>
          <h1>{weatherData.main.temp.toFixed(0)}</h1>
          <h2>{weatherData.weather[0].main}</h2>
        </div>

        <div className="bottomInfoArea">
          <div className="humidityLevel">
            <WiHumidity className="windIcon"/>
            <div className="humidInfo">
              <h1>{weatherData.main.humidity}%</h1>
              <p>Humidity</p>
            </div>
          </div>

          <div className="wind">
          <FaWind className="windIcon"/>
          <div className="humidInfo">
            <h1>{weatherData.wind.speed}km/h</h1>
            <p>Wind Speed</p>
            </div>
          </div>

        </div>

          </>
        ):(
          <div className="loading">
          <RiLoaderFill className="loadingIcon" />
          <p>Loading</p>
        </div>
        )
      }

      </div>
    </MainWrapper>
    
  )
}

export default Display
