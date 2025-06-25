import { Rector } from "@/interfaces";


export const DUMMY_RECTORES: Rector[] = [
  {
    id: "1",
    nombres: "María Elena",
    apellidos: "Rodríguez",
    cedula: "12345678",
    email: "maria.rodriguez@sanjudastadeo.edu.co",
    telefono: "6045551234",
    institucionId: "1", // I.E. San Judas Tadeo
    fechaVinculacion: "2020-01-15",
    estado: "activa",
    experienciaAnios: 15,
    observaciones: "Rectora con amplia experiencia en gestión educativa",
  },
  {
    id: "2",
    nombres: "Carlos Alberto",
    apellidos: "Gómez",
    cedula: "87654321",
    email: "carlos.gomez@laesperanza.edu.co",
    telefono: "6045559876",
    institucionId: "2", // I.E. Rural La Esperanza
    fechaVinculacion: "2018-03-20",
    estado: "activa",
    experienciaAnios: 12,
    observaciones: "Especialista en educación rural",
  },
  {
    id: "3",
    nombres: "Ana Patricia",
    apellidos: "Morales",
    cedula: "11223344",
    email: "ana.morales@tecnicoindustrial.edu.co",
    telefono: "6045557890",
    institucionId: "3", // I.E. Técnico Industrial
    fechaVinculacion: "2015-08-10",
    estado: "inactiva", // porque la institución está inactiva
    experienciaAnios: 10,
    observaciones: "Rectora en proceso de reestructuración",
  },
  {
    id: "4",
    nombres: "Juan Pablo",
    apellidos: "Restrepo",
    cedula: "44332211",
    email: "juan.restrepo@bicentenario.edu.co",
    telefono: "6045556789",
    institucionId: "4", // I.E. Bicentenario del Saber
    fechaVinculacion: "2021-06-25",
    estado: "activa",
    experienciaAnios: 8,
    observaciones: "Líder en innovación educativa",
  },
];