muhonur.HTML.plugins.date = function (target, args) {
	target.muhonur.HTML.date = {};
	target.muhonur.HTML.date.value = {
		text: target.value,
		day: '',
		month: '',
		year: ''
	};

	const typeDay = 'dd';
	const typeMonth = 'mm';
	const typeYear = 'yyyy';

	var ddIndex = args.format.indexOf(typeDay) > -1 ? args.format.split(typeDay)[0].length : -1;
	var mmIndex = args.format.indexOf(typeMonth) > -1 ? args.format.split(typeMonth)[0].length : -1;
	var yyyyIndex = args.format.indexOf(typeYear) > -1 ? args.format.split(typeYear)[0].length : -1;

	/**
	 * It will have only format characters.
	 * For example: format = 'dd.mm.yyyy' => variable = 'ddmmyyyy'
	 * @param {string} value It will be formatted.
	 */
	function clearFormat (value) {
		var result = '';

		for (let index = 0; index < value.length; index++) {
			const itemChar = value[index];
			if (parseInt(itemChar).toString() === itemChar) {
				result += itemChar;
			}
		}

		return result;
	}

	target.addEventListener('keydown', function (e) {
		// Is value number?
		if (
			(
				e.ctrlKey === true &&
				(
					e.key.toLowerCase() === 'c' ||
					e.key.toLowerCase() === 'a' ||
					e.key.toLowerCase() === 'x' ||
					e.key.toLowerCase() === 'v'
				)
			) ||
			e.key.length !== 1 ||
			(parseInt(e.key).toString() === e.key)) {
		} else {
			e.preventDefault();
		}
	});
	target.addEventListener('input', function () {
		setTimeout(() => {
			var beforeSelectionStart = this.selectionStart;

			var valueAsClear = clearFormat(this.value);

			// '', '12', '1', '12345', ...
			var addedSelection = 0;
			var newValue = '';
			for (let index = 0; index < valueAsClear.length; index++) {
				if (newValue.length >= args.format.length) {
					break;
				}

				const itemChar = valueAsClear[index];
				var actualIndex = newValue.length;

				if (
					(ddIndex <= actualIndex && actualIndex <= ddIndex + 1) ||
					(mmIndex <= actualIndex && actualIndex <= mmIndex + 1) ||
					(yyyyIndex <= actualIndex && actualIndex <= yyyyIndex + 3)
				) {
					newValue += itemChar;
					continue;
				} else {
					for (let actualValueIndex = actualIndex; actualValueIndex < args.format.length; actualValueIndex++) {
						if (
							(ddIndex <= actualValueIndex && actualValueIndex <= ddIndex + 1) ||
							(mmIndex <= actualValueIndex && actualValueIndex <= mmIndex + 1) ||
							(yyyyIndex <= actualValueIndex && actualValueIndex <= yyyyIndex + 3)
						) {
							break;
						}

						const itemCharFormat = args.format[actualValueIndex];
						newValue += itemCharFormat;
						if (actualIndex + 1 === beforeSelectionStart) {
							addedSelection++;
						}
					}

					if (newValue.length >= args.format.length) {
						break;
					}
					newValue += itemChar;
				}
			}

			this.value = newValue;

			this.selectionEnd = this.selectionStart = Math.min(this.value.length, beforeSelectionStart + addedSelection);
		});
	});
	target.addEventListener('change', function () {
		if (this.value.length !== args.format.length) {
			this.value = '';
			target.muhonur.HTML.date.value = {
				text: this.value,
				day: '',
				month: '',
				year: ''
			};
			return;
		}

		var year = '2000';
		if (yyyyIndex !== -1) {
			year = this.value.substr(yyyyIndex, 4);
			if (year < 1000) {
				year = '1000';
				this.value =
					this.value.substr(0, yyyyIndex) +
					year +
					this.value.substr(yyyyIndex + 4);
			}
		}

		var month = '01';
		if (mmIndex !== -1) {
			month = this.value.substr(mmIndex, 2);
			if (month < 1) {
				month = '01';
				this.value =
					this.value.substr(0, mmIndex) +
					month +
					this.value.substr(mmIndex + 2);
			} else if (month > 12) {
				month = '12';
				this.value =
					this.value.substr(0, mmIndex) +
					month +
					this.value.substr(mmIndex + 2);
			}
		}

		var day = '01';
		if (ddIndex !== -1) {
			day = ddIndex === -1 ? 0 : this.value.substr(ddIndex, 2);
			var daysInMonth = new Date(year, month, 0).getDate().toString().padStart(2, '0');
			if (day < 1) {
				day = '01';
				this.value =
					this.value.substr(0, ddIndex) +
					day +
					this.value.substr(ddIndex + 2);
			} else if (day > daysInMonth) {
				day = daysInMonth;
				this.value =
					this.value.substr(0, ddIndex) +
					day +
					this.value.substr(ddIndex + 2);
			}
		}

		target.muhonur.HTML.date.value = {
			text: this.value,
			day: day,
			month: month,
			year: year
		};
	});
};