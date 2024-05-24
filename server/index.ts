import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { WeatherConfig } from './config.js';
import { Weathers } from '@Shared/data/weathers.js';

const Rebar = useRebar();
const RebarEvents = Rebar.events.useEvents();

const weathers = [...WeatherConfig.weathers];

function updatePlayerWeather(player: alt.Player, weatherType: Weathers) {
    Rebar.player.useWorld(player).setWeather(weatherType, WeatherConfig.timeToTransition);
}

function updateWeather() {
    const oldWeather = weathers.shift();
    weathers.push(oldWeather);
    const newWeather = weathers[0];

    for (let player of alt.Player.all) {
        if (!Rebar.player.useStatus(player).hasCharacter()) {
            continue;
        }

        updatePlayerWeather(player, newWeather);
    }

    alt.log(`Weather is now: ${newWeather}`);
}

function handleCharacterSelect(player: alt.Player) {
    updatePlayerWeather(player, weathers[0]);
}

alt.setInterval(updateWeather, WeatherConfig.timeBetweenUpdates);
RebarEvents.on('character-bound', handleCharacterSelect);
