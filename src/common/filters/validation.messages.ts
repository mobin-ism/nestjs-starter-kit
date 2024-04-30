export function ValidationMessage(field: any) {
    return {
        isString: `Invalid format of the field ${field}`,
        isNotEmpty: `${field} can not be empty`,
        isEmail: `Invalid ${field} format`
    }
}
