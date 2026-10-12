import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const db = prisma as any;
  const passwordPlana = '123456789';
  const saltRounds = 10;
  
  // Generar el hash exactamente con la versión de bcrypt instalada
  const passwordHash = await bcrypt.hash(passwordPlana, saltRounds);

  const adminEmail = 'admin@miteleferico.bo';

  const adminData = {
    ci: '10020030',
    nombres: 'RESPONSABLE',
    apellidos: 'TALENTO HUMANO',
    email: adminEmail,
    cargo: 'RESPONSABLE DE PASANTIAS Y GRADUACION',
    departamento_unidad: 'GERENCIA DE GESTION DE TALENTO HUMANO',
    password_hash: passwordHash,
    rol: 'SUPERADMIN',
    activo: true,
  };

  // Upsert: crea el usuario si no existe, o actualiza su hash si ya existía
  const usuario = await db.usuarios_administrativos.upsert({
    where: { email: adminEmail },
    update: {
      password_hash: passwordHash,
      activo: true,
    },
    create: adminData,
  });

  console.log('--------------------------------------------------');
  console.log('ADMINISTRADOR CREADO / ACTUALIZADO CON EXITO:');
  console.log(`Email:      ${usuario.email}`);
  console.log(`Password:   ${passwordPlana}`);
  console.log(`Hash nuevo: ${usuario.password_hash}`);
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Error al crear el administrador:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });