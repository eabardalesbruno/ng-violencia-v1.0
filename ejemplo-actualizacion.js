// 🧪 Ejemplo de uso del servicio de actualización

// Datos que se enviarán al hacer click en "Actualizar"
const exampleUpdateData = {
  casoId: 537,      // Número entero
  personaId: 279,   // Número entero  
  rolId: 7          // Número entero - ID del rol seleccionado
};

// Endpoint que se llamará
const endpoint = "http://localhost:8080/rolespersonacaso/752";

// Método HTTP: PUT

/* 
📋 Flujo completo:

1. Usuario selecciona nuevo rol en el dropdown
   - Roles disponibles: 7 (Agraviado), 9 (Investigado), 11 (Procesado), 16 (Reo contumaz), 17 (Imputado)
2. Hace click en "Actualizar"
3. Se valida que el rol esté permitido
4. Se formatean los datos como números enteros:
   - caso_id → casoId (number)
   - persona_id → personaId (number)  
   - rol_id → rolId (number)
5. Se envía PUT a /rolespersonacaso/{id}
6. Backend actualiza solo el rol
7. Frontend muestra mensaje de éxito
8. Redirige a la lista
*/

// Ejemplo de logs esperados en consola:
console.log('Datos a actualizar (formato backend):', {
  casoId: 537,     // number
  personaId: 279,  // number
  rolId: 7         // number - según selección del usuario
});
console.log('Endpoint: http://localhost:8080/rolespersonacaso/752');
console.log('Rol seleccionado ID:', 7, 'tipo:', typeof 7);

// Roles disponibles para selección:
const availableRoles = [
  { id: 7, nombre: 'Agraviado' },
  { id: 9, nombre: 'Investigado' },
  { id: 11, nombre: 'Procesado' },
  { id: 16, nombre: 'Reo contumaz' },
  { id: 17, nombre: 'Imputado' }
];

// El rolId enviado será uno de estos IDs según la selección del usuario
