function validator(options) {
    var formElement = document.querySelector(options.form);
    if (formElement) {
        options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                inputElement.onblur = function() {
                    console.log(rule);
                }
            }
        });;
    }
}
// định nghĩa rules
validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function() {

        }
    }
}

validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function() {

        }
    }
}