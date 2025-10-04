// utils/jwt-validators.ts
// Validadores para formularios JWT

import { ValidationResult } from '@/types/auth.types';

export class JwtValidators {
  
  // =============== VALIDACIÓN DE EMAIL ===============
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('El email es requerido');
      return { isValid: false, errors };
    }
    
    if (email.length > 150) {
      errors.push('El email no puede exceder 150 caracteres');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('El formato del email es inválido');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // =============== VALIDACIÓN DE CONTRASEÑA ===============
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('La contraseña es requerida');
      return { isValid: false, errors };
    }
    
    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    if (password.length > 100) {
      errors.push('La contraseña no puede exceder 100 caracteres');
    }
    
    // Opcional: Validaciones adicionales de seguridad
    if (!/[A-Za-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // =============== VALIDACIÓN DE DOCUMENTO ===============
  static validateDocument(document: string, type: string): ValidationResult {
    const errors: string[] = [];
    
    if (!document) {
      errors.push('El documento es requerido');
      return { isValid: false, errors };
    }
    
    // Remover espacios y caracteres especiales
    const cleanDocument = document.replace(/[^0-9]/g, '');
    
    switch (type) {
      case 'CC': // Cédula de Ciudadanía
        if (!/^\d{6,10}$/.test(cleanDocument)) {
          errors.push('La cédula debe tener entre 6 y 10 dígitos');
        }
        break;
        
      case 'CE': // Cédula de Extranjería
        if (!/^\d{6,12}$/.test(cleanDocument)) {
          errors.push('La cédula de extranjería debe tener entre 6 y 12 dígitos');
        }
        break;
        
      case 'TI': // Tarjeta de Identidad
        if (!/^\d{8,11}$/.test(cleanDocument)) {
          errors.push('La tarjeta de identidad debe tener entre 8 y 11 dígitos');
        }
        break;
        
      case 'PP': // Pasaporte
        if (!/^[A-Z0-9]{6,12}$/.test(document.toUpperCase())) {
          errors.push('El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos');
        }
        break;
        
      default:
        errors.push('Tipo de documento no válido');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // =============== VALIDACIÓN DE NOMBRE ===============
  static validateName(name: string, fieldName: string = 'nombre'): ValidationResult {
    const errors: string[] = [];
    
    if (!name) {
      errors.push(`El ${fieldName} es requerido`);
      return { isValid: false, errors };
    }
    
    if (name.length < 2) {
      errors.push(`El ${fieldName} debe tener al menos 2 caracteres`);
    }
    
    if (name.length > 50) {
      errors.push(`El ${fieldName} no puede exceder 50 caracteres`);
    }
    
    // Solo letras, espacios y algunos caracteres especiales
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(name)) {
      errors.push(`El ${fieldName} solo puede contener letras, espacios, apostrofes y guiones`);
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // =============== VALIDACIÓN DE TELÉFONO ===============
  static validatePhone(phone: string): ValidationResult {
    const errors: string[] = [];
    
    if (!phone) {
      // El teléfono es opcional
      return { isValid: true, errors };
    }
    
    // Remover espacios, guiones y paréntesis
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Validar formato colombiano: +57 seguido de 10 dígitos o directamente 10 dígitos
    if (!/^(\+57)?[0-9]{10}$/.test(cleanPhone)) {
      errors.push('El teléfono debe ser un número válido de Colombia (10 dígitos)');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // =============== VALIDACIÓN DE ROL ===============
  static validateRole(role: string): ValidationResult {
    const errors: string[] = [];
    const validRoles = ['super_admin', 'admin', 'gestor'];
    
    if (!role) {
      errors.push('El rol es requerido');
      return { isValid: false, errors };
    }
    
    if (!validRoles.includes(role)) {
      errors.push('El rol seleccionado no es válido');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // =============== VALIDACIÓN COMPLETA DE USUARIO ===============
  static validateUserForm(userData: any): ValidationResult {
    const allErrors: string[] = [];
    
    // Validar cada campo individualmente
    const emailValidation = this.validateEmail(userData.email);
    const passwordValidation = this.validatePassword(userData.contrasena);
    const documentValidation = this.validateDocument(userData.documento, userData.tipo_documento);
    const nameValidation = this.validateName(userData.nombre, 'nombre');
    const lastNameValidation = this.validateName(userData.apellido, 'apellido');
    const phoneValidation = this.validatePhone(userData.celular);
    const roleValidation = this.validateRole(userData.rol);
    
    // Recopilar todos los errores
    allErrors.push(...emailValidation.errors);
    allErrors.push(...passwordValidation.errors);
    allErrors.push(...documentValidation.errors);
    allErrors.push(...nameValidation.errors);
    allErrors.push(...lastNameValidation.errors);
    allErrors.push(...phoneValidation.errors);
    allErrors.push(...roleValidation.errors);
    
    return { isValid: allErrors.length === 0, errors: allErrors };
  }
}

// =============== HELPERS ADICIONALES ===============

export const formatDocument = (document: string, type: string): string => {
  if (type === 'PP') {
    return document.toUpperCase();
  }
  return document.replace(/[^0-9]/g, '');
};

export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleanPhone.startsWith('+57')) {
    return cleanPhone;
  }
  
  if (cleanPhone.startsWith('57') && cleanPhone.length === 12) {
    return `+${cleanPhone}`;
  }
  
  if (cleanPhone.length === 10) {
    return `+57${cleanPhone}`;
  }
  
  return phone; // Devolver original si no se puede formatear
};

export const getRoleLabel = (role: string): string => {
  const roleLabels: Record<string, string> = {
    super_admin: 'Super Administrador',
    admin: 'Administrador',
    gestor: 'Gestor'
  };
  
  return roleLabels[role] || role;
};

export const getDocumentTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    CC: 'Cédula de Ciudadanía',
    CE: 'Cédula de Extranjería',
    TI: 'Tarjeta de Identidad',
    PP: 'Pasaporte'
  };
  
  return typeLabels[type] || type;
};

export default JwtValidators;