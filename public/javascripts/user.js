clientValidation.setAsNumericBox = function(elements, options) {
	// options items: precision, min, max, needCommas, maxLenght
	var $elements = elements ? $(elements) : null,
		regex = this.regex.INPUT_NUMERIC,
		autoCommas = (options.needCommas == null ? false : options.needCommas),
		precision = options.precision || 0,
		min = options.min || 0,
		max = options.max || 0,
		maxLength = options.maxLength || 0,
		boxValue = min,
		oldValue,
		insertCommasTimer = null;

	if (!$elements) return;

	var checkNumeric = function($el) {
		var text = $el.val();
		if (text == "" || text == "0") {
			return false;
		}
		text = FormatterUtil.formatNumber(text).getValueAfterClearCommas();

		text = parseFloat(text);

		if (isNaN(text)) {
			$el.val(boxValue).change().keyup();
			return false;
		}
		boxValue = text;
		return true;
	};

	var setMaxOrMin = function() {
		if (min && boxValue < min) {
			boxValue = min;
		} else if (max > min && boxValue > max) {
			boxValue = max;
		}
	};

	var setPrecision = function() {
		if (precision) {
			boxValue = FormatterUtil.formatNumber(boxValue).setPrecision(precision).getNumber();
		}
	};

	var autoInsertCommas = function($el) {
		if (autoCommas) {

			clearTimeout(insertCommasTimer);
			// use setTimeout to fixed the issue that flash commas when user click the relate label
			insertCommasTimer = setTimeout(function() {
				if (!$el.is(':focus')) {
					boxValue = FormatterUtil.formatNumber(boxValue).getNumberWithCommas();
					$el.val(boxValue);
				}
			}, 150);

		}
	};

	$elements.bind('keypress', function(e) {
		var inputVal = String.fromCharCode(e.which),
			overMaxLength = function() {
				return maxLength > 0 && $(this).val().indexOf(".") >= maxLength
			},
			hasLimitChar = function() {
				return !regex.test(inputVal)
			},
			reduplicateDot = function() {
				return (inputVal == "." && $(this).val().indexOf(".") != -1)
			};

		if (e.which == 0 || e.which == 8)
			return true;

		if (overMaxLength() || hasLimitChar() || reduplicateDot())
			return false;

		return true;
	}).bind("paste", function() {
		if (window.clipboardData) {
			var s = clipboardData.getData("text");
			return !/\D/.test(s);
		} else {
			return false;
		}
	}).bind("dragenter", function() {
		return false;
	}).bind('blur', function() {
		var $el = $(this);

		if (!checkNumeric($el)) return;

		setMaxOrMin();
		setPrecision();
		$el.val(boxValue).change().keyup();
		autoInsertCommas($el);

	}).css('ime-mode', 'disabled');
	if (autoCommas) {
		$elements.bind('focus', function() {
			var tempValue = $(this).val();
			if (tempValue.indexOf(',') > 0) {
				$(this).val(FormatterUtil.formatNumber(tempValue).getValueAfterClearCommas()).focus();
			}
		});
	}
};