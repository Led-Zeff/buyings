import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  
  /**
   * @description
   * Validator that requires the control have a non-empty, non-white spaces value.
   *
   * @usageNotes
   *
   * ### Validate that the field is non-empty
   *
   * ```typescript
   * const control = new FormControl('', CustomValidators.notEmpty);
   *
   * console.log(control.errors); // {required: true}
   * ```
   *
   * @returns An error map with the `required` property
   * if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static notEmpty(control: AbstractControl): ValidationErrors {
    if (!control.value?.trim()) {
      return { required: true }
    }
    return null;
  }

  /**
   * @description
   * Validator that requires the control have a non-special symbols value.
   *
   * @usageNotes
   *
   * ### Validate that the field is non-special symbols
   *
   * ```typescript
   * const control = new FormControl('', CustomValidators.noSymbols);
   *
   * console.log(control.errors); // {noSymbols: true}
   * ```
   *
   * @returns An error map with the `noSymbols` property
   * if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static noSymbols(control: AbstractControl): ValidationErrors {
    if (control.value && !/^[\w.,\d \-;:áéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ]*$/.test(control.value)) {
      return { noSymbols: true };
    }
    return null;
  }

  /**
   * @description
   * Validator that requires the control have a integer value.
   *
   * @usageNotes
   *
   * ### Validate that the field is integer
   *
   * ```typescript
   * const control = new FormControl('', CustomValidators.number);
   *
   * console.log(control.errors); // {number: true}
   * ```
   *
   * @returns An error map with the `number` property
   * if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static number(control: AbstractControl): ValidationErrors {
    if (control.value && !/^\d*$/.test(control.value)) {
      return { number: true };
    }
    return null;
  }

  /**
   * @description
   * Validator that requires the control have a decimal value.
   *
   * @usageNotes
   *
   * ### Validate that the field is decimal
   *
   * ```typescript
   * const control = new FormControl('', CustomValidators.decimal);
   *
   * console.log(control.errors); // {decimal: true}
   * ```
   *
   * @returns An error map with the `decimal` property
   * if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static decimal(control: AbstractControl): ValidationErrors {
    if (control.value && !/^\d*(\.\d+)?$/.test(control.value)) {
      return { decimal: true };
    }
    return null;
  }

}
