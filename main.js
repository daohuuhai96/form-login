function validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    };

    var selectorRules = {};
    // ham thuc hien validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        // lay ra cac rule cau selector
        var rules = selectorRules[rule.selector];

        // lap qua tung rule va kiem tra
        // neu co loi dung viec kiem tra
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }
        return !errorMessage;
    }
    // lay element cua form can validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // bo di hanh dong mac dinh khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;
            //lap qua tung rule va validate
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                };
            });

            if (isFormValid) {
                //truong hop submit voi javascrip
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');

                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        values[input.name] = input.value;
                        return values;
                    }, {});
                    options.onSubmit(formValues);
                    // truong hop submit voi hanh vi mac dinh
                } else {
                    formElement.submit();
                }
            }
        };
        //lap qua moi rule va su ly ( lang nghe su kien blur , ipnut, .....)
        options.rules.forEach(function(rule) {

            // luu lai cac rule chho moi input

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                // su ly truong hop blur khoi input
                inputElement.onblur = function() {
                        // value: inputElrment.value
                        //test funx: rule.test
                        validate(inputElement, rule);
                    }
                    //su ly nguoi dung nhap vao input
                inputElement.oninput = function() {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            }
        });
    }
}
// định nghĩa rules
//nguyen tac cua cac rule
// 1. khi co loi => tra ve messae loi
// 2. khi hop le khong tra ra cai j ca
validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : "vui long nhap truong nay"
        }
    };
}

validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : 'truong nay phai la email'
        }
    };
}

validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : `vui long nhap toi thieu ${min} ky tu`;
        }
    };
}

validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'gia tri nhap vao khong chinh sac';
        }
    };
}