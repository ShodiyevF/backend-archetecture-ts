namespace ValidationInterface {

    interface IStringType {
        required: boolean;
        type: 'string';
        min_length?: number;
        max_length?: number;
        pattern?: RegExp;
        enum?: any[];
        custom_validation?: TCustomValidation;
    }

    interface INumberType {
        required: boolean;
        type: 'number';
        min?: number;
        max?: number;
        pattern?: RegExp;
        enum?: any[];
        custom_validation?: TCustomValidation;
    }

    interface IBooleanType {
        required: boolean;
        type: 'boolean';
    }

    interface IObjectType {
        required: boolean;
        type: 'object';
        dto?: DTO;
        custom_validation?: TCustomValidation;
    }

    interface IArrayType {
        required: boolean;
        type: 'array';
        elements_min_length?: number;
        elements_max_length?: number;
        custom_validation?: TCustomValidation;
        element_type: 'string' | 'number' | 'boolean' | 'object';
    }

    interface IArrayElementStringType extends IArrayType {
        element_type: 'string';
        element_min_length?: number;
        element_max_length?: number;
        element_pattern?: RegExp;
        element_enum?: any[];
        element_custom_validation?: TCustomValidation;
    }

    interface IArrayElementNumberType extends IArrayType {
        element_type: 'number';
        element_min?: number;
        element_max?: number;
        element_pattern?: RegExp;
        element_enum?: any[];
        element_custom_validation?: TCustomValidation;
    }

    interface IArrayElementBooleanType extends IArrayType {
        element_type: 'boolean';
    }

    interface IArrayElementObjectType extends IArrayType {
        element_type: 'object';
        element_dto?: DTO;
        element_custom_validation?: TCustomValidation;
    }

    type TArrayType = IArrayElementStringType | IArrayElementNumberType | IArrayElementBooleanType | IArrayElementObjectType

    type TValidationRule = IStringType | INumberType | IBooleanType | IObjectType | TArrayType
    
    type CustomValidationReturn = {
        error: true;
        message: string;
    } | {
        error: false;
    }
    type TCustomValidation = (value: any) => CustomValidationReturn;
    
    export interface DTO {
        [key: string]: TValidationRule;
    }
    
    export interface IValidationSuccessResult {
        status: 200;
    }
    
    export interface IValidationErrorResult {
        status: 400;
        error: string;
    }
    
    export type TValidationResult = IValidationSuccessResult | IValidationErrorResult
    
}

export default ValidationInterface