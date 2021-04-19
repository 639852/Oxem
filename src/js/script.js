@@include('_DynamicAdapt.js')
@@include('_supportWebp.js')


// Прилипающая шапка
const body = document.querySelector('body');
const header = document.querySelector('.header')
let fixed = header.offsetTop

window.onscroll = function stickHeader() {
	if (window.pageYOffset > fixed) {
		header.classList.add('fixed')
	} else {
		header.classList.remove('fixed')
	}
}


// Замена логотипа
if (document.documentElement.clientWidth <= 555) {
	document.querySelector('.header__logo').previousSibling.setAttribute('srcset', 'img/white-logo.svg')
}


// Бургер-меню
const burger = document.querySelector('.burger')
const burgerContent = document.querySelector('.header__menu')
const buttonWhite = document.querySelector('.header__menu .button_white')

burger.addEventListener('click', function(e) {
	e.preventDefault()

	burger.classList.toggle('active')
	burgerContent.classList.toggle('active')
	body.classList.toggle('lock')

	if (burger.classList.contains('active')) {
    	buttonWhite.classList.add('button_orange')
    	buttonWhite.classList.remove('button_white')
	} else {
	    buttonWhite.classList.remove('button_orange')
	    buttonWhite.classList.add('button_white')
	}
});


// Всплывающие окна
const popupLinks = document.querySelectorAll('.popup__link')
const lockPadding = document.querySelectorAll('.lock-padding')
let unlock = true
const timeout = 800

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index]
		popupLink.addEventListener('click', function(e) {
			const popupName = popupLink.getAttribute('href').replace('#', '')
			const currentPopup = document.getElementById(popupName)
			popupOpen(currentPopup)
			e.preventDefault()
		});
	}
}

const popupCloseIcon = document.querySelectorAll('.close__popup')

if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index]
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'))
			e.preventDefault()
		});
	}
}

function popupOpen(currentPopup) {
	if (currentPopup && unlock) {
		setTimeout(function() {
			const popupActive = document.querySelector('.popup.open')

			if (popupActive) {
				popupClose(popupActive, false)
			} else {
				bodyLock()
			}

			currentPopup.classList.add('open')
			currentPopup.addEventListener('click', function (e) {
				if (!e.target.closest('.popup__body')) {
					popupClose(e.target.closest('.popup'))
				}
			});
		}, 1000)
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open')

		if (doUnlock) {
			bodyUnLock()
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('body').offsetWidth + 'px'

	for (let index = 0; index < lockPadding.length; index++) {
		const el = lockPadding[index]
		el.style.paddingRight = lockPaddingValue
	}

	body.style.paddingRight = lockPaddingValue
	body.classList.add('lock')
	unlock = false

	setTimeout(function() {
		unlock = true
	},  timeout)
}

function bodyUnLock() {
	setTimeout(function() {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index]
			el.style.paddingRight = '0px'
		}

		body.style.paddingRight = '0px'
		body.classList.remove('lock')
	},  timeout)

	unlock = false

	setTimeout(function() {
		unlock = true
	},  timeout)
}


// Ползунки
const carValue = document.querySelector('.car-value'),
	  feeValue = document.querySelector('.fee-value'),
	  leaseValue = document.querySelector('.lease-value')

const carRange = document.querySelector('.car-range'),
	  feeRange = document.querySelector('.fee-range'),
	  leaseRange = document.querySelector('.lease-range')

const sum = document.querySelector('.sum'),
	  monthlyPayment = document.querySelector('.monthly'),
	  anInitialFee = document.querySelector('.an-initial-fee')

let anInitialFeeValue,
	monthlyPaymentValue,
	sumValue

function assignValue() {
	carValue.value = carRange.value
	feeValue.value = feeRange.value
	leaseValue.value = leaseRange.value
}

function prettify(num, type) {
	if (type == 1) {
		let n = num.toString()
		n = n.replace(/\s/g, '')
		return +n
	} else {
		let n = num.toString()
		return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ')
	}
}

function calculation(type) {
	anInitialFeeValue = Math.round(carValue.value * (feeValue.value / 100))
	monthlyPaymentValue = (carValue.value - anInitialFeeValue) * ((0.1 / leaseValue.value) / (1 - 1 / (1 + 0.1 / leaseValue.value)))
	sumValue = anInitialFeeValue + leaseValue.value * monthlyPaymentValue

	anInitialFeeValue = Math.round(anInitialFeeValue)
	monthlyPaymentValue = Math.round(monthlyPaymentValue)
	sumValue = Math.round(sumValue)

	carValue.value = prettify(carValue.value, type)
	anInitialFeeValue = prettify(anInitialFeeValue, type)
	monthlyPaymentValue = prettify(monthlyPaymentValue, type)
	sumValue = prettify(sumValue, type)

	anInitialFee.setAttribute('value', anInitialFeeValue + ' ₽')
	monthlyPayment.innerHTML = monthlyPaymentValue + ' ₽'
	sum.innerHTML = sumValue + ' ₽'
}

const range = document.querySelectorAll('input[type="range"]')
const number = document.querySelectorAll('.input-value')

range.forEach(e => {
	const max = e.getAttribute('max')
	const min = e.getAttribute('min')

	e.addEventListener('input', function() {
		assignValue()

		calculation()

		fillColor(e)
	})

	function fillColor(e) {
		if (e != undefined) {
			const i = 100 / ((max - min) / (e.value - min))
			const color = 'linear-gradient(90deg, #FF9514 ' + i + '%, #E1E1E1 ' + i + '%)'

			e.style.background = color
		}
	}
})

for (let i = 0; i < number.length; i++) {
	const max = +range[i].getAttribute('max')
	const min = +range[i].getAttribute('min')

	number[i].addEventListener('change', function() {
		range[i].value = prettify(number[i].value, 1)

		if (prettify(number[i].value, 1) > max) {
			number[i].value = max
		}

		if (prettify(number[i].value, 1) < min) {
			number[i].value = min
		}

		calculation(1)

		calculation()

		fillColor(range[i])
	})

	number[i].oninput = function() {
		this.value = this.value.replace(/[A-za-zА-Яа-яЁё]/g, '')
	}

	function fillColor(e) {
		if (e != undefined) {
			const i = 100 / ((max - min) / (e.value - min))
			const color = 'linear-gradient(90deg, #FF9514 ' + i + '%, #E1E1E1 ' + i + '%)'

			e.style.background = color
		}
	}
}

assignValue()

calculation()


// Валидация формы
document.querySelector('.popup__content button').addEventListener('click', function(e) {
	document.querySelectorAll('.form__valid input').forEach(el => {
		if (el.value == "") {
			el.parentElement.setAttribute('data-error', 'Заполните поле')
		} else {
			el.parentElement.removeAttribute('data-error')
		}
	})
})


// Маска ввода номера телефона
let element = document.querySelectorAll('input[type="tel"]')
let mask = new Inputmask('+7 (999) 999 99 99')

mask.mask(element)


// Слайдер
new Swiper('.slider', {
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev', 
	},
	pagination: {
		el: '.swiper-pagination',
		clickable: false,
	},
	grabCursor: true,
	keyboard: {
		enabled: true,
		onlyInViewport: true,
		pageUpDown: true,
	},
	autoHeight: true,
	loop: true,
	autoplay: {
		delay: 10000,
		disableOnInteraction: false,
	},
	speed: 700,
})

// Анимация кнопки слайдера
const circle = document.querySelector('.progress-ring__circle[r="24"]')
const radius = circle.r.baseVal.value
const circumference = 2 * Math.PI * radius
let percent = 1
let interval

circle.style.strokeDasharray = `${circumference} ${circumference}`
circle.style.strokeDashoffset = circumference

function setProgress() {

	interval = setInterval(fill, 100)

	function fill() {
		if (percent >= 100) {
			resetProgress()
			setTimeout(setProgress, 700)
		} else {
			percent++
			circle.style.strokeDashoffset = circumference - percent / 100 * circumference
		}
	}
}

function resetProgress() {
	percent = 1
	clearInterval(interval)
	circle.style.strokeDashoffset = circumference - percent / 100 * circumference
}

setProgress()

let observer = new MutationObserver(callback => {
	resetProgress()
	setProgress()
})

observer.observe(document.querySelector('.swiper-wrapper'), {attributes: true})

// Кнопки загрузки
document.querySelectorAll('.main-slider__button').forEach(e => {
	e.addEventListener('click', () => {
		e.innerHTML = '<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="loading"><path d="M13.8691 19.3825C11.9455 20.1121 9.83718 20.1976 7.86093 19.6261C5.88468 19.0546 4.14734 17.857 2.91009 16.2134C1.67285 14.5698 1.00256 12.569 1.00001 10.5118C0.99745 8.45459 1.66276 6.45212 2.89591 4.80546C4.12906 3.15879 5.86342 1.95691 7.83825 1.38051C9.81307 0.804109 11.9216 0.88433 13.847 1.60911C15.7723 2.3339 17.4103 3.66408 18.5148 5.39968C19.6193 7.13528 20.1305 9.18251 19.9716 11.2336" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>'
		e.firstElementChild.classList.add('loading')

		setTimeout(function() {
			if (body.classList.contains('lock')) {
				e.firstElementChild.classList.remove('loading')
				e.innerHTML = 'Оставить заявку'
			}
		}, 1100)
	})
})

// Отправка формы
const form = document.querySelector('.popup__form')
form.addEventListener('submit', formSend)

async function formSend(e) {
	e.preventDefault()

	let calculatorData = {
		carValue: carValue.value,
		feeValue: feeValue.value,
		leaseValue: leaseValue.value,
		anInitialFeeValue,
		monthlyPaymentValue,
		sumValue
	}

	let formData = new FormData(form)
	formData.append('Calculator Data', calculatorData)

	let response = await fetch('sendmail.php', {
		method: 'POST',
		body: formData
	})

	if (response.ok) {
		let result = await response.json()
		alert(result.message)
		form.reset()
	} else {
		alert('Ошибка!')
	}
}