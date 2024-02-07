const { internalErrorCatcher } = require('../logger/logger.internal');

function validator(dto, body) {
    try {
        for (let key in dto) {
            if (dto.hasOwnProperty(key)) {
                const rules = dto[key];
                const value = body[key];

                if (rules.required && (value === undefined || value === null || value === '')) {
                    return { status: 400, error: `${key}: Field is required` };
                }

                if (value === undefined || value === null || value === '') {
                    continue;
                }

                if (rules.type && rules.type == 'number' ? (isNaN(+value) ? true : false) : typeof value !== rules.type) {
                    return { status: 400, error: `${key}: Expected type ${rules.type}, but got ${typeof value}` };
                }

                if (rules.type === 'number') {
                    if (rules.min !== undefined && value < rules.min) {
                        return { status: 400, error: `${key}: Value should be greater than or equal to ${rules.min}` };
                    }

                    if (rules.max !== undefined && value > rules.max) {
                        return { status: 400, error: `${key}: Value should be less than or equal to ${rules.max}` };
                    }
                }

                if (rules.type === 'string') {
                    if (rules.minLength !== undefined && value.length < rules.minLength) {
                        return { status: 400, error: `${key}: Length should be at least ${rules.minLength} characters` };
                    }
                    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
                        return { status: 400, error: `${key}: Length should be at most ${rules.maxLength} characters` };
                    }
                }

                if (rules.pattern && rules.pattern.length && !rules.pattern[0].test(value)) {
                    return { status: 400, error: `${key}: Value does not match the required pattern ${rules.pattern[1]}` };
                }

                if (rules.custom_validation && !rules.custom_validation[0]) {
                    return { status: 400, error: `${key}: ${rules.custom_validation[1]}` };
                }
            }
        }

        return { status: 200 };
    } catch (error) {
        internalErrorCatcher(error);
    }
}

module.exports = {
    validator,
};
