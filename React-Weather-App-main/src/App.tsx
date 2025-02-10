import { CloudRain, Drop, SpinnerGap, SunDim, ThermometerSimple, Wind } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import "./index.css"

import axios from 'axios'

function App() {
	const [weatherData, setWeatherData] = useState(null)
	const [location, setLocation] = useState('')

	const fetchData = async () => {
		if (!location) return

		try {
			const response = await axios.get(
				`http://api.weatherapi.com/v1/forecast.json?key=${
					import.meta.env.VITE_WEATHER_API
				}&q=${location}&days=4&aqi=yes&alerts=yes`
			)
			setWeatherData(response.data)
			console.log('data:', response.data)
		} catch (error) {
			console.log(error)
		}
	}

	const handleLocationChange = (e) => {
		setLocation(e.target.value)
	}

	useEffect(() => {
		fetchData()
	}, [location])

	return (
		<div className="container">
			{/* header  */}
			<div className="header">
				<h1>Welcome to TypeWeather</h1>
				<p>Choose a location to see the weather forecast</p>
			</div>

			{/* search input */}
			<div className="search">
				<input type="text" placeholder="Search location" value={location} onChange={handleLocationChange} />
			</div>
			{/* weather data */}
			<div className="weather">
				{weatherData && (
					<div>
						{weatherData.forecast.forecastday.map((day, index) => (
							// weather card component
							<div className="card" key={index}>
								<h2>{day.date}</h2>
								<div className="icon">
									<img src={day.day.condition.icon} alt="weather icon" />
								</div>
								<div className="weather-info">
									<div className="temp">
										<ThermometerSimple />
										<p>{day.day.avgtemp_c}°C</p>
									</div>
									<div className="rain">
										<CloudRain />
										<p>{day.day.daily_chance_of_rain}%</p>
									</div>
									<div className="wind">
										<Wind />
										<p>{day.day.maxwind_kph}km/h</p>
									</div>
									<div className="humidity">
										<Drop />
										<p>{day.day.avghumidity}%</p>
									</div>
									<div className="uv">
										<SunDim />
										<p>{day.day.uv}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default App
