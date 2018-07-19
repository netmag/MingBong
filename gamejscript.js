'use strict';
let attackOrHealthCount = 0;
let gameReport = '';
let imgHealth = document.getElementById('monster_health');
let monsterHealthCount = 50;
let startHealthMonster = '';
let position, startPosition;
let countRun = 0;
let damage = 0, treatment = 0;
let endRun = false;
let crit = 0;
let maxDamage = 0, maxTreatment = 0;
let maxMonsterHealth = 50, minMonsterHealth = 50;
let startBtn = document.querySelector('.start_btn');
let attack = document.getElementById('attack_or_healing');
let descHunter = document.getElementById('hunter_txt');
let descMonster = document.getElementById('monster_txt');
let descWitch = document.getElementById('witch_txt');
let descButton = document.querySelector('.desc_btn');
let description = document.querySelector('.description');

descButton.onclick = () => {
	if ((description.style.display == 'none') || (description.style.display == '')) {
		description.style.display = 'inline-block';
		descButton.innerHTML = 'Свернуть описание';
	} else if (description.style.display == 'inline-block') {
			description.style.display = 'none';
			descButton.innerHTML = 'Развернуть описание';
	}
};

startBtn.innerHTML = 'Начать!';

function monsterHealth(attackOrHealthCount) {
	if (startBtn.innerHTML == 'Атака!') {
		descHunter.style.display = 'none';
		descWitch.style.display = 'block';
		startBtn.innerHTML = 'Отхил!';
		attack.value = '';
		descWitch.innerHTML = 'Ведьма хилит монстра!<br>Введите силу отхила от 1 до 49.</p>';
		critStrike();
// считаем на сколько у монстра выбили здоровья
		monsterHealthCount = monsterHealthCount - (attackOrHealthCount + crit);
		if (crit == 0) {
			descMonster.innerHTML = '<p>Минг Бонг получает ' + attackOrHealthCount + ' урона!</p>';
		} else {
			descMonster.innerHTML = '<p>Минг Бонг получает ' + (attackOrHealthCount + crit) + ' урона!<br>'
			+ ' Критический удар!</p>';
		}

		position = position - (attackOrHealthCount + crit);
		imgHealth.style.backgroundSize = position + '% 100%';
		damage = attackOrHealthCount + crit;
		endRun = false; //проверяем закончен ли ход
		crit = 0;
		return monsterHealthCount;
	} else if (startBtn.innerHTML == 'Отхил!') {
		descWitch.style.display = 'none';
		descHunter.style.display = 'block';
		startBtn.innerHTML = 'Атака!';
		attack.value = '';
		descHunter.innerHTML = '<p>Охотник атакует Минг Бонга!<br>'+
			'Введите силу атаки от 1 до 49.</p>';
		critStrike();
// считаем на сколько монстра отхилили
		monsterHealthCount = monsterHealthCount + attackOrHealthCount + crit;

		if (crit == 0) {
			descMonster.innerHTML = '<p>Минг Бонг получает ' + attackOrHealthCount + ' отхила!</p>';
		} else {
			descMonster.innerHTML = '<p>Минг Бонг получает ' + (attackOrHealthCount + crit) + ' отхила!<br>'
			+ ' Критический отхил!</p>';
		}
		position = position + (attackOrHealthCount + crit);
		imgHealth.style.backgroundSize = position + '% 100%';
		treatment = attackOrHealthCount + crit;
		endRun = true;
		crit = 0;
		return monsterHealthCount;
	}
}

let inputStyle = () => {
	if (attack.readOnly == true) {
		attack.readOnly = false;
		attack.style.backgroundColor = '#fff';
	} else if (attack.readOnly == false) {
			attack.readOnly = true;
			attack.style.backgroundColor = '#ac9a9a';
	}
};

startBtn.onclick = () => {
	let gameReportFull = '';

	//проверка на начало игры
	if (startBtn.innerHTML == 'Начать!') {
		startHealthMonster = -(parseInt(imgHealth.offsetWidth) - 2) / 2;
		startPosition = startHealthMonster;
		position = 50;
		inputStyle();
		imgHealth.style.backgroundSize = position + '% 100%';
		startBtn.innerHTML = 'Атака!';
		descHunter.innerHTML = '<p>Охотник атакует Минг Бонга!<br>'+
			'Введите силу атаки от 1 до 49.</p>';
		return;
	}
	//если игра окончена - перезагрузка страницы
	if (startBtn.innerHTML == 'Заново?') {

		window.location.reload(true);
	}
	//Выводим статистику игры
	if (startBtn.innerHTML == 'Игра окончена.<br>Вывести отчет.') {
		description.innerHTML = null;
		gameReportFull = 'Всего ходов: ' + countRun + '. Макимальный урон ' + maxDamage + '. Максимальное лечение '
			+ maxTreatment + '.<br>Минимум здоровья монстра ' + minMonsterHealth
			+ '. Максимум здоровья монстра ' + maxMonsterHealth + '. </p><br><br><hr><br><p id="full_report">'
			+ gameReport + '</p>';
		if (descHunter.style.display == 'none') {
			document.querySelector('.description').innerHTML = '<p>Монстр выиграл. ' + gameReportFull;
		} else if (descWitch.style.display == 'none') {
			document.querySelector('.description').innerHTML = '<p>Охотник выиграл. ' + gameReportFull;
		};
		description.style.display = 'inline-block';
		descButton.innerHTML = 'Свернуть описание';
		startBtn.innerHTML = 'Заново?';
		startBtn.style.height = '50px';
		document.getElementById('full_report').style.display = 'none'; //Прячем полный лог игры
		if (confirm('Вывести полный отчет по игре?')) {
			document.getElementById('full_report').style.display = 'block'; //Показываем полный лог
		}
	}
	//берем и проверяем введенное значение, отдаем его функции
	//monsterHealth.
	if ((startBtn.innerHTML == 'Атака!') || (startBtn.innerHTML == 'Отхил!')) {
		attackOrHealthCount = parseInt(attack.value);
		if ((isNaN(attackOrHealthCount)) || (0 >= attackOrHealthCount) || (50 <= attackOrHealthCount)) {
			alert('Введите число от 1 до 49.');
			attack.value = '';
		} else {
			monsterHealth(attackOrHealthCount);
			report();
			deadOrAlive();
		}
	}
}
// проверяем условия победы / поражения
function deadOrAlive() {
	endRun = true;//заглушка проверки конца хода
	if (endRun) {
		if (monsterHealthCount >= 100) {
			descWitch.innerHTML = '<p>Охотник проиграл.<br> Монстр Минг Бонг захватил мир!</p>';
			startBtn.innerHTML = 'Игра окончена.<br>Вывести отчет.';
			startBtn.style.height = '100px';
			descWitch.style.display = 'block';
			descHunter.style.display = 'none';
			document.getElementById('img_hunter').style.backgroundPositionX = 'right';
		} else if (monsterHealthCount <= 0) {
			descHunter.innerHTML = '<p>Монстр побежден!<br> Злая колдунья Сардулья отправлена за решетку.</p>';
			startBtn.innerHTML = 'Игра окончена.<br>Вывести отчет.';
			document.querySelector('.status_witch').innerHTML = 'За решеткой';
			startBtn.style.height = '100px';
			descHunter.style.display = 'block';
			descWitch.style.display = 'none';
			document.getElementById('img_monster').style.backgroundPositionX = 'right';
			document.getElementById('img_witch').style.backgroundPositionX = 'right';
		}
	}
}
// формируем отчет по игре
function report() {
	endRun = true; //заглушка проверки конца хода
	if (endRun) {
		if (damage > maxDamage) {
			maxDamage = damage;
		}
		if (treatment > maxTreatment) {
			maxTreatment = treatment;
		}
		if (monsterHealthCount > maxMonsterHealth) {
			maxMonsterHealth = monsterHealthCount;
		}
		if (monsterHealthCount < minMonsterHealth) {
			minMonsterHealth = monsterHealthCount;
		}
		countRun++;
		gameReport = gameReport + 'Ход № ' + countRun + ' | Нанесенный урон ' + damage
			+ ' | Полученный отхил ' + treatment + ' | Здоровье монстра '
			+ monsterHealthCount + '.<br>';
	}
}
// критический удар
function critStrike() {
	if (Math.random() > .75) {
		return crit = 25;
	}
}
