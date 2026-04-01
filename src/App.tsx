import { CloudRain, Drop, MagnifyingGlass, SpinnerGap, SunDim, ThermometerSimple, Wind } from '@phosphor-icons/react'
import axios from 'axios'
import { useMemo, useState } from 'react'
import './index.css'

type ForecastDay = {
	date: string
	day: {
		avgtemp_c: number
		daily_chance_of_rain: number
		maxwind_kph: number
		avghumidity: number
		uv: number
		condition: {
			icon: string
			text: string
		}
	}
}

type WeatherApiResponse = {
	location: {
		name: string
		country: string
		localtime: string
	}
	current: {
		temp_c: number
		feelslike_c: number
		condition: { text: string; icon: string }
		humidity: number
		wind_kph: number
		uv: number
	}
	forecast: {
		forecastday: ForecastDay[]
	}
}

function formatTrDate(isoDate: string) {
	const d = new Date(`${isoDate}T00:00:00`)
	return new Intl.DateTimeFormat('tr-TR', {
		weekday: 'short',
		day: '2-digit',
		month: 'short',
	}).format(d)
}

function App() {
	const [location, setLocation] = useState('')
	const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const trimmedLocation = useMemo(() => location.trim(), [location])

	const fetchData = async (q: string) => {
		if (!q) return
		setLoading(true)
		setError(null)

		try {
			const response = await axios.get<WeatherApiResponse>(
				`https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API}&q=${encodeURIComponent(
					q
				)}&days=4&aqi=yes&alerts=yes`
			)
			setWeatherData(response.data)
		} catch (e: unknown) {
			setWeatherData(null)
			setError('Konum bulunamadı veya ağ hatası oluştu. Lütfen tekrar deneyin.')
			console.log(e)
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		void fetchData(trimmedLocation)
	}

	return (
		<div className="page">
			<div className="container">
				<header className="header">
					<div className="brand">
						
						<div className="brandText">
							<h1>Hava Atlas</h1>
						</div>
					</div>
				</header>

				<form className="search" onSubmit={handleSubmit}>
					<label className="srOnly" htmlFor="location">
						Konum
					</label>
					<div className="searchField">
						<MagnifyingGlass className="searchIcon" />
						<input
							id="location"
							type="text"
							placeholder="Şehir / ilçe ara (örn. İstanbul)"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							autoComplete="off"
							spellCheck={false}
						/>
					</div>
					<button className="btn" type="submit" disabled={!trimmedLocation || loading}>
						{loading ? (
							<span className="btnInline">
								<SpinnerGap className="spin" /> Yükleniyor
							</span>
						) : (
							'Ara'
						)}
					</button>
				</form>

				{error && <div className="notice error">{error}</div>}

				{weatherData && (
					<section className="weather">
						<div className="overview card">
							<div className="overviewTop">
								<div>
									<h2 className="overviewTitle">
										{weatherData.location.name}, {weatherData.location.country}
									</h2>
									<p className="muted">
										Şu an: {weatherData.current.condition.text} • {weatherData.location.localtime}
									</p>
								</div>
								<div className="overviewNow">
									<img src={weatherData.current.condition.icon} alt={weatherData.current.condition.text} />
									<div className="nowTemp">{Math.round(weatherData.current.temp_c)}°</div>
								</div>
							</div>

							<div className="stats">
								<div className="stat">
									<ThermometerSimple />
									<div>
										<div className="statLabel">Hissedilen</div>
										<div className="statValue">{Math.round(weatherData.current.feelslike_c)}°C</div>
									</div>
								</div>
								<div className="stat">
									<Wind />
									<div>
										<div className="statLabel">Rüzgar</div>
										<div className="statValue">{Math.round(weatherData.current.wind_kph)} km/sa</div>
									</div>
								</div>
								<div className="stat">
									<Drop />
									<div>
										<div className="statLabel">Nem</div>
										<div className="statValue">{Math.round(weatherData.current.humidity)}%</div>
									</div>
								</div>
								<div className="stat">
									<SunDim />
									<div>
										<div className="statLabel">UV</div>
										<div className="statValue">{weatherData.current.uv}</div>
									</div>
								</div>
							</div>
						</div>

						<div className="grid">
							{weatherData.forecast.forecastday.map((day) => (
								<article className="card dayCard" key={day.date}>
									<div className="dayTop">
										<h3 className="dayTitle">{formatTrDate(day.date)}</h3>
										<p className="muted">{day.day.condition.text}</p>
									</div>
									<div className="dayMain">
										<img src={day.day.condition.icon} alt={day.day.condition.text} className="dayIcon" />
										<div className="dayTemp">{Math.round(day.day.avgtemp_c)}°C</div>
									</div>
									<div className="dayStats">
										<div className="chip" title="Yağmur ihtimali">
											<CloudRain /> {Math.round(day.day.daily_chance_of_rain)}%
										</div>
										<div className="chip" title="Rüzgar">
											<Wind /> {Math.round(day.day.maxwind_kph)} km/sa
										</div>
										<div className="chip" title="Nem">
											<Drop /> {Math.round(day.day.avghumidity)}%
										</div>
										<div className="chip" title="UV">
											<SunDim /> {day.day.uv}
										</div>
									</div>
								</article>
							))}
						</div>
					</section>
				)}

				{!weatherData && !loading && !error && (
					<div className="empty card">
						<h2>Hava durumu araması yapın</h2>
						<p className="muted">Üstteki alana bir şehir yazıp “Ara” butonuna basın.</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default App
