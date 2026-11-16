export function normalizedKebabCase (value: string): string {
    if (!value) {
        return '';
    }

    return value
        .trim()
        // Separa camelCase y PascalCase: "myValue" -> "my Value"
        .replace(/([a-z\d])([A-Z])/g, '$1 $2')
        // Separa siglas pegadas a palabra: "XMLParser" -> "XML Parser"
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        // Elimina diacríticos: áéíóúñ -> aeioun
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        // Cualquier bloque no alfanumérico pasa a guion
        .replace(/[^a-z0-9]+/g, '-')
        // Limpia guiones al inicio/fin
        .replace(/^-+|-+$/g, '');
}