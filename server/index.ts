import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { WeatherConfig } from './config.js';
import { Weathers } from '@Shared/data/weathers.js';

const Rebar = useRebar();
const weatherService = Rebar.services.useWeatherService();

let weatherIndex = 0;

function updatePlayerWeather(player: alt.Player, weatherType: Weathers) {
    Rebar.player.useWorld(player).setWeather(weatherType, WeatherConfig.timeToTransition);
}

function updateWeather() {
    weatherIndex += 1;

    const weathers = weatherService.getWeatherForecast();
    if (weatherIndex >= weathers.length) {
        weatherIndex = 0;
    }

    weatherService.setWeather(weathers[weatherIndex]);
}

function handleWeatherChange(weather: Weathers) {
    for (let player of alt.Player.all) {
        if (!Rebar.player.useStatus(player).hasCharacter()) {
            continue;
        }

        updatePlayerWeather(player, weather);
    }

    alt.log(`Weather is now: ${weather}`);
}

function handleUpdateWeather(player: alt.Player) {
    updatePlayerWeather(player, weatherService.getWeather());
}

weatherService.setWeatherForecast(WeatherConfig.weathers);
alt.on('playerConnect', handleUpdateWeather);
alt.on('rebar:weatherChanged', handleWeatherChange);
alt.setInterval(updateWeather, WeatherConfig.timeBetweenUpdates);
