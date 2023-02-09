"use strict"

document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('form');
	form.addEventListener('submit', formSend);

	// Функция отправляет даные. Если данные не введены ввыводит окно с укозанием заполнить поля
	async function formSend(e) {
		e.preventDefault();

		let error = formValidate(form);

		let formData = new FormData(form);
		formData.append('image', formImage.files[0]);

		if (error === 0) {
			form.classList.add('_sending');

			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: 'formData'
			});
			if (response.ok) {
				let result = await response.json();
				alert(result.messege);
				formPreview.innerHTML = '';
				form.reset();
				form.classList.remove('_sending');
			} else {
				alert('Ошибка');
				form.classList.remove('_sending');
			}

		} else {
			alert('Заполните пожалуйста поля отмеченные красным цветом');
		}
	}

	// Функция проверяет форму на заполненые области ввода
	function formValidate(form) {
		let error = 0;
		let formReq = document.querySelectorAll('._req');

		for (let i = 0; i < formReq.length; i++) {
			const input = formReq[i];
			formRemoveError(input);

			if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
			}
			else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
				formAddError(input);
				error++;
			}
			else {
				if (input.value === '') {
					formAddError(input);
					error++;
				}
			}
		}
		return error;
	};

	// Функция добавляет класс ._error
	function formAddError(input) {
		input.parentElement.classList.add('_error');
		input.classList.add('_error');
	}

	// Функция удаляет класс ._error
	function formRemoveError(input) {
		input.parentElement.classList.remove('_error');
		input.classList.remove('_error');
	}

	// Функция теста email
	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	};

	//Получает input file в переменную
	const formImage = document.getElementById('formImage');
	// Получаем file с переменной formImage
	const formPreview = document.getElementById('formPreview');

	// Слушаем изменения в inpute file
	formImage.addEventListener('change', () => {
		uploadFile(formImage.files[0]);
	});

	function uploadFile(file) {
		// Проверяем тип файла
		if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
			alert('Разрешены только изображения');
			formImage.value = '';
			return;
		}
		// Проверяем размер файла
		if (file.size > 2 * 1024 * 1024) {
			alert('Файл должен быть мене 2 МБ');
			return;
		}

		var reader = new FileReader();
		reader.onload = function (e) {
			formPreview.innerHTML = `<img src="${e.target.result}" alt="Photo">`;
		};
		reader.onerror = function (e) {
			alert("Ошибка")
		};
		reader.readAsDataURL(file);
	}
});